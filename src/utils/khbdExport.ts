import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType, 
  BorderStyle, 
  Footer, 
  PageNumber, 
  ShadingType
} from 'docx';
import { LessonPlan5512, CurriculumContext, LessonPeriodPlan, Activity5512 } from '../types/edtech';
import { 
  ensurePeriodsSynchronized, 
  parsePeriodsFromDuration,
  MAX_PERIODS,
  MIN_PERIODS 
} from './periodValidator';

/**
 * Normalizes text to safe ASCII filename
 * e.g., "Quang hợp ở thực vật" -> "Quang_hop_o_thuc_vat"
 */
export function sanitizeFilename(str: string): string {
  if (!str) return 'Tai_lieu';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generates official standardized filename for KHBD
 * Format: KHBD_[Mon]_[Khoi]_[Ten_Bai].docx
 * e.g. KHBD_KHTN_7_Quang_hop_o_thuc_vat.docx
 */
export function getKhbdFilename(curriculum: CurriculumContext, ext: 'docx' = 'docx'): string {
  const subjectStr = sanitizeFilename(curriculum.subject);
  const gradeStr = sanitizeFilename(curriculum.grade);
  const titleStr = sanitizeFilename(curriculum.lessonTitle || 'Bai_hoc');
  return `KHBD_${subjectStr}_${gradeStr}_${titleStr}.${ext}`;
}

const FONT_FAMILY = 'Times New Roman';
const COLOR_BLACK = '000000';
const COLOR_DARK = '1E293B';
const COLOR_MUTED = '475569';

// Border style helper for borderless tables
const NO_BORDER = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'FFFFFF',
};

const NO_BORDERS = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
};

const TABLE_BORDER = {
  style: BorderStyle.SINGLE,
  size: 4, // 0.5 pt
  color: '94A3B8',
};

const TABLE_BORDERS = {
  top: TABLE_BORDER,
  bottom: TABLE_BORDER,
  left: TABLE_BORDER,
  right: TABLE_BORDER,
  insideHorizontal: TABLE_BORDER,
  insideVertical: TABLE_BORDER,
};

/**
 * Generates a standard Word (.docx) document compliant with:
 * - Nghị định 30/2020/NĐ-CP (Thể thức văn bản hành chính)
 * - Công văn 5512/BGDĐT-GDTrH (Kế hoạch bài dạy giáo dục trung học)
 * - Khổ giấy A4 dọc, Font Times New Roman, cỡ 13-14, lề chuẩn, bảng biểu nguyên vẹn.
 */
export async function generateKhbdDocxBlob(
  khbd: LessonPlan5512, 
  curriculum: CurriculumContext
): Promise<Blob> {
  // Synchronize periods and cap strictly between 1 and 5
  const activePeriodsCount = Math.max(
    MIN_PERIODS,
    Math.min(MAX_PERIODS, khbd.periodsCount || parsePeriodsFromDuration(curriculum.duration) || 2)
  );

  const safeKhbd = ensurePeriodsSynchronized(
    khbd,
    activePeriodsCount,
    curriculum.lessonTitle,
    curriculum.grade,
    curriculum.subject
  );

  const activePeriods = (safeKhbd.periods || []).slice(0, activePeriodsCount);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 26, // 13pt
            color: COLOR_BLACK,
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing (240 * 1.15 = 276)
              after: 100, // 5pt after
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width: 210mm in twips
              height: 16838, // A4 height: 297mm in twips
            },
            margin: {
              top: 1134, // 20 mm
              bottom: 1134, // 20 mm
              left: 1701, // 30 mm (tiêu chuẩn đóng gáy)
              right: 850, // 15 mm
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Trang ',
                    font: FONT_FAMILY,
                    size: 20, // 10pt
                    italics: true,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: FONT_FAMILY,
                    size: 20,
                    italics: true,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    text: ' / ',
                    font: FONT_FAMILY,
                    size: 20,
                    italics: true,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: FONT_FAMILY,
                    size: 20,
                    italics: true,
                    color: COLOR_MUTED,
                  }),
                  new TextRun({
                    text: `  |  ${curriculum.subject} ${curriculum.grade} - ${curriculum.lessonTitle}`,
                    font: FONT_FAMILY,
                    size: 18,
                    italics: true,
                    color: '94A3B8',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // 1. LETTERHEAD TABLE (2 COLUMNS)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    borders: NO_BORDERS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: (curriculum.schoolName || 'TRƯỜNG THCS GIẢNG VÕ').toUpperCase(),
                            bold: true,
                            size: 24, // 12pt
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `TỔ CHUYÊN MÔN ${(curriculum.subject || 'KHOA HỌC TỰ NHIÊN').toUpperCase()}`,
                            bold: true,
                            size: 22, // 11pt
                            color: COLOR_MUTED,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '-----------------------',
                            size: 18,
                            color: '94A3B8',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 55, type: WidthType.PERCENTAGE },
                    borders: NO_BORDERS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                            bold: true,
                            size: 24, // 12pt
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Độc lập - Tự do - Hạnh phúc',
                            bold: true,
                            underline: {},
                            size: 24, // 12pt
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { after: 120 } }),

          // 2. DOCUMENT TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: 'KẾ HOẠCH BÀI DẠY (GIÁO ÁN)',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A', // Deep Blue
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `BÀI: ${(curriculum.lessonTitle || 'TÊN BÀI HỌC').toUpperCase()}`,
                bold: true,
                size: 28, // 14pt
                color: COLOR_BLACK,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Môn học: ${curriculum.subject} - Khối: ${curriculum.grade}  |  Bộ sách: ${curriculum.bookSeries}  |  Thời lượng: ${curriculum.duration || '2 tiết'}`,
                italics: true,
                size: 24, // 12pt
                color: COLOR_MUTED,
              }),
            ],
          }),

          // 3. I. MỤC TIÊU DẠY HỌC
          createSectionHeading('I. MỤC TIÊU DẠY HỌC'),

          createSubHeading('1. Về kiến thức:'),
          ...khbd.objectives.knowledge.map((k) => createBulletItem(k)),

          createSubHeading('2. Về năng lực:'),
          createSubHeading('a) Năng lực đặc thù môn học:', true),
          ...khbd.objectives.domainCompetencies.map((c) => createBulletItem(c)),

          createSubHeading('b) Năng lực chung:', true),
          ...(khbd.objectives.coreCompetencies || [
            'Năng lực tự chủ và tự học: Tự nghiên cứu thông tin SGK, phân tích kết quả thí nghiệm.',
            'Năng lực giao tiếp và hợp tác: Làm việc nhóm hiệu quả, thảo luận, phản biện tích cực.',
            'Năng lực giải quyết vấn đề và sáng tạo: Vận dụng kiến thức bài học vào thực tiễn đời sống.'
          ]).map((c) => createBulletItem(c)),

          createSubHeading('3. Về phẩm chất:'),
          ...khbd.objectives.qualities.map((q) => createBulletItem(q)),

          new Paragraph({ spacing: { after: 140 } }),

          // 4. II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
          createSectionHeading('II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU'),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Đối với giáo viên: ', bold: true, size: 26 }),
              new TextRun({ text: khbd.equipment.teacher.join('; ') + '.', size: 26 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Đối với học sinh: ', bold: true, size: 26 }),
              new TextRun({ text: khbd.equipment.student.join('; ') + '.', size: 26 }),
            ],
          }),

          new Paragraph({ spacing: { after: 140 } }),

          // 5. III. TIẾN TRÌNH DẠY HỌC (CHUẨN CV 5512 - TỪNG TIẾT HỌC)
          createSectionHeading(`III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512 - TỔNG SỐ: ${activePeriodsCount} TIẾT)`),

          new Paragraph({
            children: [
              new TextRun({ 
                text: 'A. BẢNG TIẾN TRÌNH SƯ PHẠM TỔNG QUAN', 
                bold: true, 
                size: 26, 
                color: '1E3A8A' 
              }),
            ],
            spacing: { before: 80, after: 100 },
          }),

          // Process overview table (covers all active periods)
          createPeriodsProcessTable(activePeriods),

          new Paragraph({ spacing: { after: 200 } }),

          new Paragraph({
            children: [
              new TextRun({ 
                text: `B. CHI TIẾT TỔ CHỨC CÁC HOẠT ĐỘNG DẠY HỌC (ĐẦY ĐỦ TỪ TIẾT 1 ĐẾN TIẾT ${activePeriodsCount})`, 
                bold: true, 
                size: 26, 
                color: '1E3A8A' 
              }),
            ],
            spacing: { before: 140, after: 100 },
          }),

          // Detailed activities for EACH active period (Tiết 1 to Tiết 5)
          ...activePeriods.flatMap((period) => [
            new Paragraph({
              spacing: { before: 240, after: 80 },
              shading: {
                fill: 'EFF6FF',
                type: ShadingType.CLEAR,
                color: 'auto',
              },
              children: [
                new TextRun({
                  text: `TIẾT ${period.periodNumber}: ${period.periodTitle.toUpperCase()} (${period.durationMinutes || 45} PHÚT)`,
                  bold: true,
                  size: 28,
                  color: '1E3A8A',
                }),
              ],
            }),

            new Paragraph({
              spacing: { after: 60 },
              indent: { left: 240 },
              children: [
                new TextRun({ text: `* Mục tiêu trọng tâm Tiết ${period.periodNumber}: `, bold: true, size: 26, color: '0F172A' }),
                new TextRun({ text: period.objective, italics: true, size: 26 }),
              ],
            }),

            // Detailed activities within this period
            ...period.activities.flatMap((act, actIndex) => createDetailedActivityParagraphs(act, actIndex)),

            // Period notes / Homework
            ...(period.notes ? [
              new Paragraph({
                spacing: { before: 100, after: 140 },
                indent: { left: 240 },
                children: [
                  new TextRun({ text: `* Dặn dò và chuẩn bị sau Tiết ${period.periodNumber}: `, bold: true, italics: true, size: 24, color: '475569' }),
                  new TextRun({ text: period.notes, italics: true, size: 24, color: '475569' }),
                ],
              }),
            ] : [
              new Paragraph({ spacing: { after: 120 } })
            ]),
          ]),

          new Paragraph({ spacing: { after: 240 } }),

          // 6. IV. KÝ DUYỆT (SIGNATURES)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: NO_BORDERS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'TỔ TRƯỞNG CHUYÊN MÔN',
                            bold: true,
                            size: 24, // 12pt
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '(Ký và ghi rõ họ tên)',
                            italics: true,
                            size: 20,
                            color: COLOR_MUTED,
                          }),
                        ],
                      }),
                      new Paragraph({ spacing: { after: 600 } }), // Signature space
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '',
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: NO_BORDERS,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Hà Nội, ngày ..... tháng ..... năm 202...',
                            italics: true,
                            size: 20,
                            color: COLOR_MUTED,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'GIÁO VIÊN SOẠN BÀI',
                            bold: true,
                            size: 24, // 12pt
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '(Ký và ghi rõ họ tên)',
                            italics: true,
                            size: 20,
                            color: COLOR_MUTED,
                          }),
                        ],
                      }),
                      new Paragraph({ spacing: { after: 600 } }), // Signature space
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: curriculum.teacherName || 'GIÁO VIÊN SOẠN BÀI',
                            bold: true,
                            size: 24,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS FOR DOCX FORMATTING
// ----------------------------------------------------------------------

function createSectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 100 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 28, // 14pt
        color: '0F172A',
      }),
    ],
  });
}

function createSubHeading(title: string, isIndented = false): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 60 },
    indent: isIndented ? { left: 360 } : undefined,
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26, // 13pt
        color: '1E293B',
      }),
    ],
  });
}

function createBulletItem(text: string): Paragraph {
  return new Paragraph({
    indent: { left: 720 }, // 0.5 inch indent
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: '•  ',
        bold: true,
        size: 26,
        color: '475569',
      }),
      new TextRun({
        text,
        size: 26,
      }),
    ],
  });
}

/**
 * Builds the 4-activity process summary table in Word
 */
function createActivitiesProcessTable(khbd: LessonPlan5512): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Hoạt động học', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: '(Thời lượng)', italics: true, size: 20, color: COLOR_MUTED }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 26, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Mục tiêu', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 27, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Nội dung & Sản phẩm', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 27, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Tổ chức thực hiện (4 bước)', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
        ],
      }),
    ],
  });

  const dataRows = khbd.activities.map((act, index) => {
    return new TableRow({
      cantSplit: true,
      children: [
        // Col 1: Name & Duration
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: TABLE_BORDERS,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `HĐ ${index + 1}: ${act.title}`,
                  bold: true,
                  size: 22,
                  color: '1E3A8A',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `(${act.durationMinutes} phút)`,
                  italics: true,
                  size: 20,
                  color: 'D97706',
                }),
              ],
            }),
          ],
        }),
        // Col 2: Objective
        new TableCell({
          width: { size: 26, type: WidthType.PERCENTAGE },
          borders: TABLE_BORDERS,
          children: [
            new Paragraph({
              children: [new TextRun({ text: act.objective, size: 22 })],
            }),
          ],
        }),
        // Col 3: Content & Product
        new TableCell({
          width: { size: 27, type: WidthType.PERCENTAGE },
          borders: TABLE_BORDERS,
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: '- ND: ', bold: true, size: 22, color: '047857' }),
                new TextRun({ text: act.content, size: 22 }),
              ],
            }),
            new Paragraph({
              spacing: { before: 40 },
              children: [
                new TextRun({ text: '- SP: ', bold: true, size: 22, color: 'B45309' }),
                new TextRun({ text: act.product, size: 22 }),
              ],
            }),
          ],
        }),
        // Col 4: 4 Steps
        new TableCell({
          width: { size: 27, type: WidthType.PERCENTAGE },
          borders: TABLE_BORDERS,
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: '1. Giao việc: ', bold: true, size: 20 }),
                new TextRun({ text: act.implementation.assign, size: 20 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '2. Thực hiện: ', bold: true, size: 20 }),
                new TextRun({ text: act.implementation.execute, size: 20 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '3. Báo cáo: ', bold: true, size: 20 }),
                new TextRun({ text: act.implementation.discuss, size: 20 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: '4. Kết luận: ', bold: true, size: 20 }),
                new TextRun({ text: act.implementation.conclude, size: 20 }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    rows: [headerRow, ...dataRows],
  });
}

/**
 * Builds process overview table for all active periods (Tiết 1 đến Tiết 5)
 */
function createPeriodsProcessTable(activePeriods: LessonPeriodPlan[]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Tiết & Hoạt động học', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: '(Thời lượng)', italics: true, size: 18, color: '64748B' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Mục tiêu hoạt động', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 26, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Nội dung & Sản phẩm', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 27, type: WidthType.PERCENTAGE },
        shading: { fill: 'F1F5F9', type: ShadingType.CLEAR, color: 'auto' },
        borders: TABLE_BORDERS,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Tổ chức thực hiện (4 bước)', bold: true, size: 22, color: '0F172A' }),
            ],
          }),
        ],
      }),
    ],
  });

  const dataRows: TableRow[] = [];

  activePeriods.forEach((period) => {
    // Period Header Band across all 4 columns
    dataRows.push(
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnSpan: 4,
            shading: { fill: 'E0E7FF', type: ShadingType.CLEAR, color: 'auto' },
            borders: TABLE_BORDERS,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `TIẾT ${period.periodNumber}: ${period.periodTitle.toUpperCase()} (${period.durationMinutes || 45} PHÚT)`,
                    bold: true,
                    size: 22,
                    color: '1E3A8A',
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Activity rows for this period
    period.activities.forEach((act, idx) => {
      dataRows.push(
        new TableRow({
          cantSplit: true,
          children: [
            // Col 1: Name & Duration
            new TableCell({
              width: { size: 22, type: WidthType.PERCENTAGE },
              borders: TABLE_BORDERS,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `HĐ ${idx + 1}: ${act.title}`,
                      bold: true,
                      size: 21,
                      color: '1E3A8A',
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `(${act.durationMinutes} phút)`,
                      italics: true,
                      size: 19,
                      color: 'D97706',
                    }),
                  ],
                }),
              ],
            }),
            // Col 2: Objective
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: TABLE_BORDERS,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: act.objective, size: 21 })],
                }),
              ],
            }),
            // Col 3: Content & Product
            new TableCell({
              width: { size: 26, type: WidthType.PERCENTAGE },
              borders: TABLE_BORDERS,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '- ND: ', bold: true, size: 21, color: '047857' }),
                    new TextRun({ text: act.content, size: 21 }),
                  ],
                }),
                new Paragraph({
                  spacing: { before: 40 },
                  children: [
                    new TextRun({ text: '- SP: ', bold: true, size: 21, color: 'B45309' }),
                    new TextRun({ text: act.product, size: 21 }),
                  ],
                }),
              ],
            }),
            // Col 4: 4 Steps
            new TableCell({
              width: { size: 27, type: WidthType.PERCENTAGE },
              borders: TABLE_BORDERS,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: '1. Giao việc: ', bold: true, size: 20 }),
                    new TextRun({ text: act.implementation.assign, size: 20 }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '2. Thực hiện: ', bold: true, size: 20 }),
                    new TextRun({ text: act.implementation.execute, size: 20 }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '3. Báo cáo: ', bold: true, size: 20 }),
                    new TextRun({ text: act.implementation.discuss, size: 20 }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '4. Kết luận: ', bold: true, size: 20 }),
                    new TextRun({ text: act.implementation.conclude, size: 20 }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: TABLE_BORDERS,
    rows: [headerRow, ...dataRows],
  });
}

/**
 * Builds detailed paragraphs for each of the 4 pedagogical activities
 */
function createDetailedActivityParagraphs(act: LessonPlan5512['activities'][0], index: number): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({
          text: `Hoạt động ${index + 1}: ${act.title.toUpperCase()} (${act.durationMinutes} phút)`,
          bold: true,
          size: 28, // 14pt
          color: '0369A1',
        }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'a) Mục tiêu: ', bold: true, size: 26 }),
        new TextRun({ text: act.objective, size: 26 }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'b) Nội dung: ', bold: true, size: 26 }),
        new TextRun({ text: act.content, size: 26 }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'c) Sản phẩm học tập: ', bold: true, size: 26 }),
        new TextRun({ text: act.product, size: 26 }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 40 },
      children: [
        new TextRun({ text: 'd) Tổ chức thực hiện:', bold: true, size: 26 }),
      ],
    }),
    new Paragraph({
      indent: { left: 720 },
      spacing: { after: 40 },
      children: [
        new TextRun({ text: '- Bước 1: Chuyển giao nhiệm vụ học tập: ', bold: true, size: 25, color: '1E3A8A' }),
        new TextRun({ text: act.implementation.assign, size: 25 }),
      ],
    }),
    new Paragraph({
      indent: { left: 720 },
      spacing: { after: 40 },
      children: [
        new TextRun({ text: '- Bước 2: Thực hiện nhiệm vụ: ', bold: true, size: 25, color: '1E3A8A' }),
        new TextRun({ text: act.implementation.execute, size: 25 }),
      ],
    }),
    new Paragraph({
      indent: { left: 720 },
      spacing: { after: 40 },
      children: [
        new TextRun({ text: '- Bước 3: Báo cáo, thảo luận: ', bold: true, size: 25, color: '1E3A8A' }),
        new TextRun({ text: act.implementation.discuss, size: 25 }),
      ],
    }),
    new Paragraph({
      indent: { left: 720 },
      spacing: { after: 80 },
      children: [
        new TextRun({ text: '- Bước 4: Kết luận, nhận định (Đánh giá chuẩn hóa): ', bold: true, size: 25, color: '1E3A8A' }),
        new TextRun({ text: act.implementation.conclude, size: 25 }),
      ],
    }),
  ];
}

/**
 * Initiates direct browser download of the Word (.docx) file
 */
export async function downloadKhbdDocx(
  khbd: LessonPlan5512, 
  curriculum: CurriculumContext
): Promise<string> {
  const blob = await generateKhbdDocxBlob(khbd, curriculum);
  const filename = getKhbdFilename(curriculum, 'docx');
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
}

