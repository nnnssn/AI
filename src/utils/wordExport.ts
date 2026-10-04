import { CurriculumContext, MatrixTopic7991, ExamQuestion, LessonPlan5512 } from '../types/edtech';

/**
 * Generates an official Word Document (.doc) for KHBD 5512 (Lesson Plan)
 * conforming to Appendix IV of Công văn 5512/BGDĐT-GDTrH.
 */
export function exportKHBDToWord(
  curriculum: CurriculumContext,
  khbd: LessonPlan5512
): void {
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Kế hoạch bài dạy - ${curriculum.lessonTitle}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 13pt;
      line-height: 1.35;
      margin: 20mm 20mm 20mm 25mm;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    .header-table td {
      text-align: center;
      vertical-align: top;
      border: none;
      font-size: 12pt;
    }
    .main-title {
      text-align: center;
      font-weight: bold;
      font-size: 15pt;
      text-transform: uppercase;
      margin: 10px 0 5px 0;
    }
    .sub-title {
      text-align: center;
      font-style: italic;
      font-size: 12pt;
      margin-bottom: 15px;
    }
    .section-title {
      font-weight: bold;
      font-size: 13pt;
      margin-top: 15px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    .activity-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 15px 0;
    }
    .activity-table th, .activity-table td {
      border: 1px solid #000;
      padding: 8px;
      font-size: 12pt;
      vertical-align: top;
    }
    .activity-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .sign-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
    }
    .sign-table td {
      text-align: center;
      vertical-align: top;
      border: none;
      font-size: 12pt;
    }
  </style>
</head>
<body>

  <!-- Header Tiêu ngữ -->
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <b>TRƯỜNG: ${(curriculum.schoolName || 'THCS CHU VĂN AN').toUpperCase()}</b><br>
        <b>TỔ CHUYÊN MÔN: ${(curriculum.subject || 'KHTN').toUpperCase()}</b><br>
        <i>Kế hoạch giáo dục giáo viên</i>
      </td>
      <td style="width: 55%;">
        <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
        <b>Độc lập - Tự do - Hạnh phúc</b><br>
        <i>------------------------</i>
      </td>
    </tr>
  </table>

  <!-- Tựa đề -->
  <div class="main-title">KẾ HOẠCH BÀI DẠY (GIÁO ÁN)</div>
  <div class="sub-title">
    Tên bài dạy: <b>${curriculum.lessonTitle}</b><br>
    Môn học/Hoạt động giáo dục: <b>${curriculum.subject}</b>; Lớp: <b>${curriculum.grade}</b><br>
    Bộ sách giáo khoa: <b>${curriculum.bookSeries}</b> · Thời lượng thực hiện: <b>${curriculum.duration || '2 tiết'}</b>
  </div>

  <!-- I. Mục tiêu -->
  <div class="section-title">I. MỤC TIÊU DẠY HỌC</div>
  <div>
    <b>1. Kiến thức:</b>
    <ul>
      ${khbd.objectives.knowledge.map(k => `<li>${k}</li>`).join('')}
    </ul>
    <b>2. Năng lực:</b>
    <ul>
      ${khbd.objectives.domainCompetencies.map(c => `<li>${c}</li>`).join('')}
    </ul>
    <b>3. Phẩm chất:</b>
    <ul>
      ${khbd.objectives.qualities.map(q => `<li>${q}</li>`).join('')}
    </ul>
  </div>

  <!-- II. Thiết bị dạy học -->
  <div class="section-title">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</div>
  <div>
    <p><b>1. Thiết bị của Giáo viên:</b> ${khbd.equipment.teacher.join('; ')}</p>
    <p><b>2. Học liệu của Học sinh:</b> ${khbd.equipment.student.join('; ')}</p>
  </div>

  <!-- III. Tiến trình dạy học -->
  <div class="section-title">III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG CV 5512)</div>

  ${khbd.activities.map(act => `
    <table class="activity-table">
      <thead>
        <tr>
          <th colspan="2" style="text-align: left;">
            ${act.title.toUpperCase()} (${act.durationMinutes} phút) - <i>${act.subtitle}</i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="width: 25%;"><b>a) Mục tiêu</b></td>
          <td>${act.objective}</td>
        </tr>
        <tr>
          <td><b>b) Nội dung</b></td>
          <td>${act.content}</td>
        </tr>
        <tr>
          <td><b>c) Sản phẩm</b></td>
          <td>${act.product}</td>
        </tr>
        <tr>
          <td><b>d) Tổ chức thực hiện</b></td>
          <td>
            <p><b>* Bước 1: Chuyển giao nhiệm vụ:</b> ${act.implementation.assign}</p>
            <p><b>* Bước 2: Thực hiện nhiệm vụ:</b> ${act.implementation.execute}</p>
            <p><b>* Bước 3: Báo cáo, thảo luận:</b> ${act.implementation.discuss}</p>
            <p><b>* Bước 4: Kết luận, nhận định:</b> ${act.implementation.conclude}</p>
          </td>
        </tr>
      </tbody>
    </table>
  `).join('')}

  <!-- Chữ ký -->
  <table class="sign-table">
    <tr>
      <td style="width: 50%;">
        <b>TỔ TRƯỞNG CHUYÊN MÔN</b><br>
        <i>(Ký và ghi rõ họ tên)</i>
        <div style="height: 70px;"></div>
      </td>
      <td style="width: 50%;">
        <i>Ngày ..... tháng ..... năm 202...</i><br>
        <b>GIÁO VIÊN SOẠN BÀI</b><br>
        <i>(Ký và ghi rõ họ tên)</i>
        <div style="height: 60px;"></div>
        <b>${curriculum.teacherName || 'GIÁO VIÊN SOẠN BÀI'}</b>
      </td>
    </tr>
  </table>

</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `KHBD_5512_${curriculum.subject}_${curriculum.grade}_${curriculum.lessonTitle.substring(0, 20)}.doc`;
  link.download = fileName.replace(/\s+/g, '_');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an official Word Document (.doc) for the 7991 Exam Paper
 * formatted with Vietnam Ministry of Education official styling.
 */
export function exportExamToWord(
  curriculum: CurriculumContext,
  matrix: MatrixTopic7991[],
  questions: ExamQuestion[],
  includeSolutions: boolean = false
): void {
  const mcQuestions = questions.filter(q => q.type === 'mc');
  const tfQuestions = questions.filter(q => q.type === 'tf');
  const saQuestions = questions.filter(q => q.type === 'sa');
  const essayQuestions = questions.filter(q => q.type === 'essay');

  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Đề kiểm tra định kì - ${curriculum.subject} ${curriculum.grade}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 13pt;
      line-height: 1.35;
      margin: 20mm 20mm 20mm 25mm;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    .header-table td {
      text-align: center;
      vertical-align: top;
      border: none;
      font-size: 12pt;
    }
    .main-title {
      text-align: center;
      font-weight: bold;
      font-size: 14pt;
      text-transform: uppercase;
      margin: 10px 0 5px 0;
    }
    .sub-title {
      text-align: center;
      font-style: italic;
      font-size: 12pt;
      margin-bottom: 15px;
    }
    .score-summary {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 15px 0;
    }
    .score-summary th, .score-summary td {
      border: 1px solid #333;
      padding: 6px;
      text-align: center;
      font-size: 11pt;
    }
    .section-title {
      font-weight: bold;
      font-size: 13pt;
      margin-top: 15px;
      margin-bottom: 6px;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
    }
    .instruction {
      font-style: italic;
      font-size: 11pt;
      margin-bottom: 8px;
    }
    .question {
      margin-bottom: 10px;
    }
    .options-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    .options-table td {
      padding: 3px 5px;
      border: none;
      font-size: 12pt;
      width: 50%;
    }
    .tf-table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
    }
    .tf-table th, .tf-table td {
      border: 1px solid #666;
      padding: 5px;
      font-size: 11.5pt;
    }
    .barem-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .barem-table th, .barem-table td {
      border: 1px solid #333;
      padding: 6px;
      font-size: 11pt;
    }
  </style>
</head>
<body>

  <!-- Header Tiêu ngữ chuẩn -->
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <b>SỞ GD&ĐT ....................</b><br>
        <b>TRƯỜNG: ${curriculum.schoolName.toUpperCase()}</b><br>
        <i>Mã đề thi: 7991-A</i>
      </td>
      <td style="width: 55%;">
        <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
        <b>Độc lập - Tự do - Hạnh phúc</b><br>
        <i>------------------------</i>
      </td>
    </tr>
  </table>

  <!-- Tựa đề -->
  <div class="main-title">ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991/BGDĐT-GDTrH</div>
  <div class="sub-title">
    Môn: <b>${curriculum.subject} - ${curriculum.grade}</b> (Bộ sách: ${curriculum.bookSeries})<br>
    Thời gian làm bài: 45 phút (không kể thời gian giao đề)
  </div>

  <!-- Bảng phân bổ điểm -->
  <table class="score-summary">
    <tr style="background-color: #f2f2f2;">
      <th>Phần I: TN 4 lựa chọn</th>
      <th>Phần II: Đúng / Sai</th>
      <th>Phần III: Trả lời ngắn</th>
      <th>Phần IV: Tự luận</th>
      <th>Tổng điểm</th>
    </tr>
    <tr>
      <td><b>3,0 điểm (30%)</b><br>12 câu (0,25đ/câu)</td>
      <td><b>2,0 điểm (20%)</b><br>2 câu (4 lệnh/câu)</td>
      <td><b>2,0 điểm (20%)</b><br>4 câu (0,5đ/câu)</td>
      <td><b>3,0 điểm (30%)</b><br>Tự luận có barem</td>
      <td><b style="color: #0044cc;">10,0 điểm (100%)</b></td>
    </tr>
  </table>

  <!-- PHẦN I -->
  <div class="section-title">PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 điểm)</div>
  <div class="instruction">Thí sinh trả lời từ câu 1 đến câu ${mcQuestions.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất.</div>
  
  ${mcQuestions.map(q => `
    <div class="question">
      <b>Câu ${q.number} (${q.score} điểm - ${q.level}):</b> ${q.content}
      <table class="options-table">
        <tr>
          <td>${q.options?.[0] || 'A. ....................'}</td>
          <td>${q.options?.[1] || 'B. ....................'}</td>
        </tr>
        <tr>
          <td>${q.options?.[2] || 'C. ....................'}</td>
          <td>${q.options?.[3] || 'D. ....................'}</td>
        </tr>
      </table>
      ${includeSolutions ? `<div style="color: #006600; font-size: 11pt; margin-top: 3px;">-> <b>Đáp án:</b> ${q.correctAnswer} | <i>Giải thích:</i> ${q.explanation || 'Áp dụng định nghĩa.'}</div>` : ''}
    </div>
  `).join('')}

  <!-- PHẦN II -->
  <div class="section-title">PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (2,0 điểm)</div>
  <div class="instruction">
    Thí sinh trả lời các câu hỏi sau. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn Đúng hoặc Sai.<br>
    <i>(Cách tính điểm: Đúng 1 ý được 0,1đ; Đúng 2 ý được 0,25đ; Đúng 3 ý được 0,5đ; Đúng 4 ý được 1,0đ)</i>
  </div>

  ${tfQuestions.map(q => `
    <div class="question">
      <b>Câu ${q.number} (${q.score} điểm - ${q.level}):</b> ${q.content}
      <table class="tf-table">
        <tr style="background-color: #f9f9f9;">
          <th style="width: 75%; text-align: left;">Lệnh hỏi / Mệnh đề</th>
          <th style="width: 25%; text-align: center;">Thí sinh chọn</th>
        </tr>
        ${(q.tfItems || []).map(item => `
          <tr>
            <td><b>${item.letter}</b> ${item.statement}</td>
            <td style="text-align: center;">
              ${includeSolutions ? `<b style="color: ${item.isCorrect ? '#006600' : '#cc0000'};">${item.isCorrect ? 'ĐÚNG' : 'SAI'}</b>` : '[  ] Đúng    [  ] Sai'}
            </td>
          </tr>
        `).join('')}
      </table>
      ${includeSolutions && q.explanation ? `<div style="font-size: 10.5pt; color: #555;"><i>Hướng dẫn chi tiết:</i> ${q.explanation}</div>` : ''}
    </div>
  `).join('')}

  <!-- PHẦN III -->
  <div class="section-title">PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 điểm)</div>
  <div class="instruction">Thí sinh trả lời từ câu 1 đến câu ${saQuestions.length}. Điền trực tiếp kết quả vào ô đáp số.</div>

  ${saQuestions.map(q => `
    <div class="question">
      <b>Câu ${q.number} (${q.score} điểm - ${q.level}):</b> ${q.content}
      <div style="margin-top: 4px; padding-left: 20px;">
        ${includeSolutions ? `<b style="color: #006600;">Đáp số: ${q.correctAnswer}</b> | <i>Giải thích:</i> ${q.explanation || ''}` : '<b>Đáp số:</b> ............................................................................'}
      </div>
    </div>
  `).join('')}

  <!-- PHẦN IV -->
  <div class="section-title">PHẦN IV. TỰ LUẬN (3,0 điểm)</div>
  <div class="instruction">Thí sinh trình bày chi tiết lời giải vào giấy làm bài.</div>

  ${essayQuestions.map(q => `
    <div class="question">
      <b>Câu ${q.number} (${q.score} điểm - ${q.level}):</b> ${q.content}
      ${includeSolutions ? `
        <table class="barem-table">
          <tr style="background-color: #f2f2f2;">
            <th style="width: 80%; text-align: left;">Các bước giải / Tiêu chí đánh giá</th>
            <th style="width: 20%; text-align: center;">Điểm</th>
          </tr>
          <tr>
            <td>Bước 1: Nêu điều kiện, giả thiết và công thức khoa học áp dụng</td>
            <td style="text-align: center;">0,50 đ</td>
          </tr>
          <tr>
            <td>Bước 2: Biến đổi đại số / Suy luận logic đúng theo định luật</td>
            <td style="text-align: center;">0,50 đ</td>
          </tr>
          <tr>
            <td>Bước 3: Thay số chính xác, kèm đơn vị đo và kết luận thực tế: ${q.explanation || ''}</td>
            <td style="text-align: center;">0,50 đ</td>
          </tr>
        </table>
      ` : `
        <div style="height: 60px; border-bottom: 1px dotted #ccc; margin: 10px 0;"></div>
      `}
    </div>
  `).join('')}

  <br>
  <div style="text-align: center; font-style: italic;">----------------- HẾT -----------------</div>
  <div style="text-align: center; font-size: 10pt; margin-top: 5px;">Cán bộ coi thi không giải thích gì thêm.</div>

</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = includeSolutions 
    ? `Dap_An_7991_${curriculum.subject}_${curriculum.grade}.doc`
    : `De_Kiem_Tra_7991_${curriculum.subject}_${curriculum.grade}.doc`;
  link.download = fileName.replace(/\s+/g, '_');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates an official Word Document (.doc) for Matrix & Specification Sheet
 * according to Appendix 1 and Appendix 2 of CV 7991/BGDĐT-GDTrH.
 */
export function exportMatrixSpecificationToWord(
  curriculum: CurriculumContext,
  matrix: MatrixTopic7991[],
  questions: ExamQuestion[]
): void {
  const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Ma trận & Bản đặc tả CV 7991 - ${curriculum.subject} ${curriculum.grade}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.3;
      margin: 15mm;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .header-table td {
      text-align: center;
      vertical-align: top;
      border: none;
      font-size: 11pt;
    }
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 13pt;
      text-transform: uppercase;
      margin: 10px 0 5px 0;
    }
    .sub {
      text-align: center;
      font-style: italic;
      font-size: 11pt;
      margin-bottom: 12px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 20px 0;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #000;
      padding: 5px;
      font-size: 10pt;
      text-align: center;
    }
    table.data-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .text-left {
      text-align: left !important;
    }
  </style>
</head>
<body>

  <!-- PHỤ LỤC 1: MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ -->
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <b>BỘ GIÁO DỤC VÀ ĐÀO TẠO</b><br>
        <i>Cơ sở: ${curriculum.schoolName}</i>
      </td>
      <td style="width: 55%;">
        <b>PHỤ LỤC 1</b><br>
        <i>(Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GDĐT)</i>
      </td>
    </tr>
  </table>

  <div class="title">1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ</div>
  <div class="sub">Môn học: <b>${curriculum.subject} - ${curriculum.grade}</b> · Thời lượng: 45 phút · Tỉ lệ: 40% Biết - 30% Hiểu - 30% Vận dụng</div>

  <table class="data-table">
    <thead>
      <tr>
        <th rowspan="3" style="width: 4%;">TT</th>
        <th rowspan="3" style="width: 20%;">Chủ đề / Đơn vị kiến thức</th>
        <th colspan="9">Mức độ đánh giá (TNKQ)</th>
        <th colspan="3">Tự luận</th>
        <th rowspan="3" style="width: 8%;">Tổng số câu</th>
        <th rowspan="3" style="width: 8%;">Tổng điểm</th>
      </tr>
      <tr>
        <th colspan="3">Nhiều lựa chọn (30%)</th>
        <th colspan="3">Đúng - Sai (20%)</th>
        <th colspan="3">Trả lời ngắn (20%)</th>
        <th colspan="3">Tự luận (30%)</th>
      </tr>
      <tr>
        <th>Biết</th><th>Hiểu</th><th>VD</th>
        <th>Biết</th><th>Hiểu</th><th>VD</th>
        <th>Biết</th><th>Hiểu</th><th>VD</th>
        <th>Biết</th><th>Hiểu</th><th>VD</th>
      </tr>
    </thead>
    <tbody>
      ${matrix.map((t, idx) => {
        const rowTotalQuestions = 
          (t.multipleChoice.know + t.multipleChoice.understand + t.multipleChoice.apply) +
          (t.trueFalse.know + t.trueFalse.understand + t.trueFalse.apply) +
          (t.shortAnswer.know + t.shortAnswer.understand + t.shortAnswer.apply) +
          (t.essay.know + t.essay.understand + t.essay.apply);
        const rowScore = idx === 0 ? '5,0' : idx === 1 ? '3,5' : '1,5';
        return `
          <tr>
            <td>${idx + 1}</td>
            <td class="text-left"><b>${t.subTopic}</b></td>
            <td>${t.multipleChoice.know}</td><td>${t.multipleChoice.understand}</td><td>${t.multipleChoice.apply}</td>
            <td>${t.trueFalse.know}</td><td>${t.trueFalse.understand}</td><td>${t.trueFalse.apply}</td>
            <td>${t.shortAnswer.know}</td><td>${t.shortAnswer.understand}</td><td>${t.shortAnswer.apply}</td>
            <td>${t.essay.know}</td><td>${t.essay.understand}</td><td>${t.essay.apply}</td>
            <td><b>${rowTotalQuestions}</b></td>
            <td><b>${rowScore} đ</b></td>
          </tr>
        `;
      }).join('')}
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <td colspan="2">Tổng số câu:</td>
        <td colspan="3">12 câu</td>
        <td colspan="3">2 câu (8 lệnh)</td>
        <td colspan="3">4 câu</td>
        <td colspan="3">2 câu</td>
        <td>20 câu</td>
        <td>10,0 đ</td>
      </tr>
      <tr style="background-color: #e6f0ff; font-weight: bold;">
        <td colspan="2">Tổng điểm & Tỉ lệ %:</td>
        <td colspan="3">3,0 đ (30%)</td>
        <td colspan="3">2,0 đ (20%)</td>
        <td colspan="3">2,0 đ (20%)</td>
        <td colspan="3">3,0 đ (30%)</td>
        <td colspan="2">10,0 điểm (100%)</td>
      </tr>
    </tbody>
  </table>

  <br>

  <!-- PHỤ LỤC 2: BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ -->
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <b>BỘ GIÁO DỤC VÀ ĐÀO TẠO</b>
      </td>
      <td style="width: 55%;">
        <b>PHỤ LỤC 2</b><br>
        <i>(Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GDĐT)</i>
      </td>
    </tr>
  </table>

  <div class="title">2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ</div>
  <div class="sub">Môn học: <b>${curriculum.subject} - ${curriculum.grade}</b> (Bộ sách: ${curriculum.bookSeries})</div>

  <table class="data-table">
    <thead>
      <tr>
        <th rowspan="2" style="width: 4%;">TT</th>
        <th rowspan="2" style="width: 18%;">Chủ đề / Đơn vị kiến thức</th>
        <th rowspan="2" style="width: 38%;">Yêu cầu cần đạt</th>
        <th colspan="4">Số câu hỏi ở các mức độ đánh giá</th>
      </tr>
      <tr>
        <th>Nhiều lựa chọn</th>
        <th>Đúng - Sai</th>
        <th>Trả lời ngắn</th>
        <th>Tự luận</th>
      </tr>
    </thead>
    <tbody>
      ${matrix.map((t, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td class="text-left"><b>${t.subTopic}</b></td>
          <td class="text-left" style="font-size: 9.5pt;">
            <b>- Nhận biết:</b> Nêu được định nghĩa, đơn vị và công thức cơ bản.<br>
            <b>- Thông hiểu:</b> Giải thích hiện tượng thực tế và phân tích mối quan hệ.<br>
            <b>- Vận dụng:</b> Giải bài tập định lượng và giải quyết tình huống đời sống.<br>
            <i>(Yêu cầu: ${t.competenciesReq})</i>
          </td>
          <td>${t.multipleChoice.know + t.multipleChoice.understand + t.multipleChoice.apply} câu (C${idx * 3 + 1}-C${idx * 3 + 3})</td>
          <td>${t.trueFalse.know + t.trueFalse.understand + t.trueFalse.apply} câu (C${idx + 1})</td>
          <td>${t.shortAnswer.know + t.shortAnswer.understand + t.shortAnswer.apply} câu</td>
          <td>${t.essay.know + t.essay.understand + t.essay.apply} câu</td>
        </tr>
      `).join('')}
      <tr style="background-color: #f2f2f2; font-weight: bold;">
        <td colspan="3">Tổng số câu hỏi:</td>
        <td>12 câu</td>
        <td>2 câu</td>
        <td>4 câu</td>
        <td>2 câu</td>
      </tr>
      <tr style="background-color: #e6f0ff; font-weight: bold;">
        <td colspan="3">Tổng số điểm:</td>
        <td>3,0 điểm</td>
        <td>2,0 điểm</td>
        <td>2,0 điểm</td>
        <td>3,0 điểm</td>
      </tr>
    </tbody>
  </table>

</body>
</html>
  `;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `Ma_Tran_Dac_Ta_7991_${curriculum.subject}_${curriculum.grade}.doc`;
  link.download = fileName.replace(/\s+/g, '_');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
