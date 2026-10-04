import { LessonPeriodPlan, Activity5512, LessonPlan5512 } from '../types/edtech';

export const MIN_PERIODS = 1;
export const MAX_PERIODS = 5;

// Exact required Vietnamese message when periods exceeds 5
export const MAX_PERIODS_EXCEEDED_MESSAGE = 'Số tiết dạy tối đa của một bài là 5 tiết. Vui lòng điều chỉnh lại!';
export const INVALID_PERIODS_MESSAGE = 'Số tiết dạy của bài phải từ 1 đến 5 tiết. Vui lòng điều chỉnh lại!';

/**
 * Validates number of periods strictly according to constraints:
 * - Minimum: 1
 * - Maximum: 5 (STRICT RULE: Tối đa chỉ 5 tiết/bài)
 * - Must be an integer
 */
export function validatePeriodCount(input: unknown): {
  isValid: boolean;
  value: number;
  errorMessage?: string;
} {
  if (input === undefined || input === null || input === '') {
    return {
      isValid: false,
      value: 2,
      errorMessage: INVALID_PERIODS_MESSAGE,
    };
  }

  const num = typeof input === 'number' ? input : parseFloat(String(input).trim());

  if (isNaN(num)) {
    return {
      isValid: false,
      value: 2,
      errorMessage: INVALID_PERIODS_MESSAGE,
    };
  }

  // Check exceeded maximum (> 5)
  if (num > MAX_PERIODS) {
    return {
      isValid: false,
      value: MAX_PERIODS,
      errorMessage: MAX_PERIODS_EXCEEDED_MESSAGE,
    };
  }

  // Check below minimum (< 1) or zero or negative
  if (num < MIN_PERIODS) {
    return {
      isValid: false,
      value: MIN_PERIODS,
      errorMessage: INVALID_PERIODS_MESSAGE,
    };
  }

  // Integer clamp (reject/round fractional periods)
  const intVal = Math.round(num);
  if (intVal > MAX_PERIODS) {
    return {
      isValid: false,
      value: MAX_PERIODS,
      errorMessage: MAX_PERIODS_EXCEEDED_MESSAGE,
    };
  }
  if (intVal < MIN_PERIODS) {
    return {
      isValid: false,
      value: MIN_PERIODS,
      errorMessage: INVALID_PERIODS_MESSAGE,
    };
  }

  return {
    isValid: true,
    value: intVal,
  };
}

/**
 * Extracts period count from a duration string (e.g. "2 tiết (90 phút)", "5 tiết")
 * Clamps safely between 1 and 5.
 */
export function parsePeriodsFromDuration(durationStr?: string): number {
  if (!durationStr) return 2;
  const match = durationStr.match(/(\d+)\s*tiết/i);
  if (match) {
    const parsed = parseInt(match[1], 10);
    if (!isNaN(parsed)) {
      if (parsed > MAX_PERIODS) return MAX_PERIODS;
      if (parsed < MIN_PERIODS) return MIN_PERIODS;
      return parsed;
    }
  }
  return 2;
}

/**
 * Formats duration string safely
 */
export function formatDurationString(periodCount: number, includeMinutes = true): string {
  const safeCount = Math.max(MIN_PERIODS, Math.min(MAX_PERIODS, Math.round(periodCount)));
  return includeMinutes
    ? `${safeCount} tiết (${safeCount * 45} phút)`
    : `${safeCount} tiết`;
}

/**
 * Generates initial 5 full pedagogical periods for a lesson
 */
export function generateDefault5Periods(
  lessonTitle: string,
  grade: string,
  baseActivities?: Activity5512[]
): LessonPeriodPlan[] {
  const title = lessonTitle || 'Bài học';
  const hd1 = baseActivities?.find((a) => a.code === 'hd1');
  const hd2 = baseActivities?.find((a) => a.code === 'hd2');
  const hd3 = baseActivities?.find((a) => a.code === 'hd3');
  const hd4 = baseActivities?.find((a) => a.code === 'hd4');

  return [
    {
      periodNumber: 1,
      periodTitle: `Tiết 1: Mở đầu & Khám phá hiện tượng cốt lõi`,
      durationMinutes: 45,
      objective: `Tạo hứng thú, tiếp cận vấn đề thực tiễn và nhận biết các khái niệm nền tảng trong ${title}.`,
      activities: [
        hd1 || {
          id: `act-p1-1`,
          code: 'hd1',
          title: 'Hoạt động 1: Mở đầu / Khởi động (Xác định vấn đề)',
          subtitle: 'Trải nghiệm tình huống thực tế và đặt câu hỏi tìm tòi',
          durationMinutes: 12,
          objective: 'Khơi gợi trí tò mò, liên hệ thực tế dẫn dắt vào bài học.',
          content: 'Quan sát hiện tượng thực tiễn hoặc hình ảnh mở đầu trong SGK, thảo luận trả lời câu hỏi gợi mở.',
          product: 'Câu trả lời dự đoán ban đầu và giả thuyết khoa học của học sinh.',
          implementation: {
            assign: 'GV nêu câu hỏi tình huống thực tế, yêu cầu HS thảo luận cặp đôi trong 3 phút.',
            execute: 'HS suy nghĩ, đối chiếu trải nghiệm thực tế và trao đổi với bạn cùng bàn.',
            discuss: 'Mời đại diện 2 cặp phát biểu, các bạn khác nhận xét, bổ sung.',
            conclude: 'GV phân tích câu trả lời và dẫn dắt vào bài học mới.',
          },
        },
        {
          id: `act-p1-2`,
          code: 'hd2_p1',
          title: 'Hoạt động 2.1: Khám phá kiến thức cốt lõi (Phần 1)',
          subtitle: 'Nghiên cứu tài liệu SGK và tìm hiểu khái niệm cơ bản',
          durationMinutes: 33,
          objective: `Nắm vững định nghĩa, thành phần và biểu hiện căn bản của ${title}.`,
          content: 'Nghiên cứu thông tin và kênh hình mục I trong SGK, hoàn thành phiếu học tập cá nhân.',
          product: 'Phiếu học tập cá nhân đã hoàn thiện các câu trả lời về khái niệm cốt lõi.',
          implementation: {
            assign: 'GV phát phiếu học tập số 1, yêu cầu HS đọc SGK mục I và trả lời 3 câu hỏi.',
            execute: 'HS làm việc độc lập trong 15 phút, sau đó trao đổi chéo kiểm tra kết quả.',
            discuss: 'GV gọi 3 học sinh đại diện trình bày, điều hành lớp phản biện.',
            conclude: 'GV chuẩn hóa nội dung mục I lên bảng chính và ghi chép vào vở.',
          },
        },
      ],
      notes: 'Nhắc học sinh mang đầy đủ đồ dùng thực hành cho tiết học sau.',
    },
    {
      periodNumber: 2,
      periodTitle: `Tiết 2: Hình thành kiến thức & Thực nghiệm chuyên sâu`,
      durationMinutes: 45,
      objective: `Phân tích sâu bản chất khoa học, cơ chế hoạt động và thực hiện các thí nghiệm/mô hình trong ${title}.`,
      activities: [
        hd2 || {
          id: `act-p2-1`,
          code: 'hd2_p2',
          title: 'Hoạt động 2.2: Nghiên cứu thực nghiệm và phân tích sơ đồ',
          subtitle: 'Quan sát thí nghiệm / mô hình trực quan để rút ra quy luật',
          durationMinutes: 35,
          objective: 'Hiểu rõ bản chất cơ chế, tính chất và các mối liên hệ khoa học trong bài học.',
          content: 'Quan sát video thí nghiệm / tranh vẽ giải phẫu mục II, thảo luận nhóm hoàn thành bảng đối chiếu.',
          product: 'Bảng thu hoạch của nhóm thể hiện cơ chế và tính chất khoa học chính xác.',
          implementation: {
            assign: 'Chia lớp làm 4 nhóm, giao nhiệm vụ phân tích bảng dữ liệu và sơ đồ quy trình.',
            execute: 'Các nhóm thảo luận, cử thư kí ghi chép kết quả lên giấy A3.',
            discuss: 'Đại diện 2 nhóm lên bảng thuyết trình, 2 nhóm còn lại đặt câu hỏi chất vấn.',
            conclude: 'GV tổng kết quy luật bản chất, kết luận kiến thức trọng tâm.',
          },
        },
        {
          id: `act-p2-2`,
          code: 'hd2_p2_conclude',
          title: 'Hoạt động 2.3: Tổng kết và chuẩn hóa kiến thức bài học',
          subtitle: 'Hệ thống hóa toàn bộ nội dung lý thuyết trọng tâm',
          durationMinutes: 10,
          objective: 'Khái quát hóa nội dung bài học thành sơ đồ tư duy hoặc bảng tổng hợp.',
          content: 'Cùng GV xây dựng sơ đồ khối tóm lược toàn bộ kiến thức mục I và II.',
          product: 'Sơ đồ tư duy kiến thức trong vở ghi của từng học sinh.',
          implementation: {
            assign: 'GV hướng dẫn HS các từ khóa then chốt để xây dựng sơ đồ.',
            execute: 'HS tự vẽ sơ đồ tóm lược nhanh vào vở ghi.',
            discuss: 'Chiếu 1-2 vở ghi tiêu biểu để cả lớp học tập.',
            conclude: 'GV chốt sơ đồ chuẩn lên slide bài giảng.',
          },
        },
      ],
      notes: 'Chuẩn bị bài tập luyện tập và phiếu trắc nghiệm nhanh cho tiết sau.',
    },
    {
      periodNumber: 3,
      periodTitle: `Tiết 3: Luyện tập, củng cố & Rèn luyện kĩ năng`,
      durationMinutes: 45,
      objective: `Củng cố toàn bộ kiến thức lý thuyết đã học thông qua hệ thống bài tập trắc nghiệm và câu hỏi tự luận.`,
      activities: [
        hd3 || {
          id: `act-p3-1`,
          code: 'hd3_p1',
          title: 'Hoạt động 3.1: Luyện tập câu hỏi trắc nghiệm khách quan',
          subtitle: 'Kiểm tra mức độ nhận biết và thông hiểu kiến thức',
          durationMinutes: 20,
          objective: 'Rèn luyện phản xạ nhanh và sự chính xác khi nhận diện các khái niệm.',
          content: 'Thực hiện 10 câu hỏi trắc nghiệm 4 lựa chọn trong phiếu luyện tập số 2.',
          product: 'Đáp án 10 câu hỏi trắc nghiệm có giải thích ngắn gọn lí do chọn.',
          implementation: {
            assign: 'Giao phiếu trắc nghiệm 10 câu trong thời gian 8 phút.',
            execute: 'HS độc lập làm bài, sau đó đổi chéo vở chấm điểm đồng đẳng.',
            discuss: 'GV phân tích từng câu hỏi, giải thích nguyên nhân gây nhiễu đáp án sai.',
            conclude: 'GV biểu dương các em đạt điểm tối đa và lưu ý các bẫy thường gặp.',
          },
        },
        {
          id: `act-p3-2`,
          code: 'hd3_p2',
          title: 'Hoạt động 3.2: Giải bài tập tự luận và tình huống thực tế',
          subtitle: 'Phân tích định tính và định lượng áp dụng công thức',
          durationMinutes: 25,
          objective: 'Rèn luyện kĩ năng trình bày bài toán tự luận logic, chuẩn xác theo quy chuẩn.',
          content: 'Giải quyết 2 bài toán định lượng hoặc bài tập tình huống thực tế trong SGK.',
          product: 'Lời giải chi tiết gồm các bước: tóm tắt, công thức, thế số và kết luận.',
          implementation: {
            assign: 'Yêu cầu HS làm bài tập 2 và 3 trong SGK trang tương ứng.',
            execute: 'HS làm bài vào vở, 2 HS xung phong lên bảng giải chi tiết.',
            discuss: 'Cả lớp nhận xét bài làm trên bảng của hai bạn.',
            conclude: 'GV sửa bài, chuẩn hóa barem chấm điểm và phương pháp trình bày mẫu.',
          },
        },
      ],
      notes: 'Giao nhiệm vụ nghiên cứu bài tập mở rộng và ứng dụng liên môn.',
    },
    {
      periodNumber: 4,
      periodTitle: `Tiết 4: Thực hành nâng cao & Trải nghiệm thực tiễn`,
      durationMinutes: 45,
      objective: `Phát triển tư duy phân tích nâng cao, giải quyết tình huống phức hợp và hoạt động trải nghiệm liên môn.`,
      activities: [
        {
          id: `act-p4-1`,
          code: 'hd4_p1',
          title: 'Hoạt động 4.1: Xử lí bài toán nâng cao và tình huống liên môn',
          subtitle: 'Kết nối kiến thức môn học với công nghệ, môi trường và xã hội',
          durationMinutes: 25,
          objective: 'Nâng cao năng lực giải quyết vấn đề phức tạp đòi hỏi tư duy sáng tạo.',
          content: 'Làm việc theo nhóm giải quyết tình huống mở: Đề xuất phương án tối ưu hóa.',
          product: 'Bản đề xuất giải pháp có lập luận khoa học và dẫn chứng số liệu thực tế.',
          implementation: {
            assign: 'GV giao câu hỏi mở mức độ vận dụng cao cho các nhóm.',
            execute: 'Nhóm trưởng điều phối thảo luận và tổng hợp ý kiến đa chiều.',
            discuss: 'Các nhóm phản biện chéo nhau về tính khả thi của giải pháp.',
            conclude: 'GV định hướng phương pháp tư duy phản biện khoa học.',
          },
        },
        {
          id: `act-p4-2`,
          code: 'hd4_p2',
          title: 'Hoạt động 4.2: Chuẩn bị sản phẩm dự án học tập',
          subtitle: 'Thực hành chế tạo hoặc thiết kế infographic tuyên truyền',
          durationMinutes: 20,
          objective: 'Phát triển kĩ năng hợp tác và khả năng truyền thông kiến thức khoa học.',
          content: 'Phác thảo ý tưởng poster / infographic / mô hình mini cho mục "Em có thể".',
          product: 'Bản thảo ý tưởng sản phẩm học tập hoặc kịch bản thuyết trình.',
          implementation: {
            assign: 'GV hướng dẫn tiêu chí đánh giá sản phẩm (Rubrics).',
            execute: 'Học sinh hoàn thiện các bước phác thảo ý tưởng tại lớp.',
            discuss: 'GV duyệt ý tưởng và đóng góp ý kiến hoàn thiện cho từng nhóm.',
            conclude: 'Giao nhiệm vụ hoàn thành sản phẩm hoàn chỉnh tại nhà cho Tiết 5.',
          },
        },
      ],
      notes: 'Chuẩn bị phòng học và thiết bị trình chiếu cho buổi báo cáo sản phẩm ở Tiết 5.',
    },
    {
      periodNumber: 5,
      periodTitle: `Tiết 5: Vận dụng thực tiễn, Báo cáo dự án & Tổng kết đánh giá`,
      durationMinutes: 45,
      objective: `Báo cáo sản phẩm dự án học tập, vận dụng kiến thức bài học vào thực tế đời sống và đánh giá phát triển năng lực.`,
      activities: [
        hd4 || {
          id: `act-p5-1`,
          code: 'hd4_p3',
          title: 'Hoạt động 5.1: Báo cáo sản phẩm dự án và giải pháp thực tiễn',
          subtitle: 'Học sinh thuyết trình sản phẩm học tập ứng dụng (Mục "Em có thể")',
          durationMinutes: 28,
          objective: 'Tự tin thuyết trình, bảo vệ quan điểm khoa học và truyền tải thông điệp ý nghĩa.',
          content: 'Đại diện các nhóm lần lượt trình bày sản phẩm / video / poster ứng dụng kiến thức bài học.',
          product: 'Sản phẩm hoàn chỉnh (mô hình, poster, bài báo cáo đa phương tiện) của học sinh.',
          implementation: {
            assign: 'GV tổ chức buổi báo cáo chuyên đề, mỗi nhóm có 4 phút trình bày và 2 phút hỏi đáp.',
            execute: 'HS thuyết trình, minh họa sản phẩm thực tế trước cả lớp.',
            discuss: 'Các bạn trong lớp nhận xét, đặt câu hỏi phản biện và chấm điểm chéo.',
            conclude: 'GV nhận xét tổng thể về sự sáng tạo và tính ứng dụng của từng sản phẩm.',
          },
        },
        {
          id: `act-p5-2`,
          code: 'hd5_eval',
          title: 'Hoạt động 5.2: Đánh giá quá trình và giao nhiệm vụ tự học',
          subtitle: 'Đánh giá năng lực học sinh và dặn dò bài học tiếp theo',
          durationMinutes: 17,
          objective: 'Học sinh tự đánh giá sự tiến bộ của bản thân; xác định nhiệm vụ ôn tập.',
          content: 'Tự đánh giá theo phiếu Rubric; nghe giáo viên tổng kết toàn bộ chuỗi 5 tiết dạy.',
          product: 'Phiếu tự đánh giá cá nhân và phiếu đánh giá đồng đẳng đã ghi nhận điểm.',
          implementation: {
            assign: 'GV phát phiếu tự đánh giá và hướng dẫn học sinh cho điểm.',
            execute: 'HS tự nhìn nhận sự tham gia và kiến thức đạt được qua 5 tiết học.',
            discuss: 'GV chia sẻ cảm nhận về sự tiến bộ của cả lớp trong suốt bài học.',
            conclude: 'GV công bố kết quả chung, giao bài tập về nhà và dặn dò chuẩn bị bài học mới.',
          },
        },
      ],
      notes: 'Lưu trữ các sản phẩm tiêu biểu vào hồ sơ học tập (portfolio) của lớp.',
    },
  ];
}

/**
 * Ensures a LessonPlan5512 has an accurate periodsCount (1..5) and safe periods array
 * Safe retention: Does NOT destroy user work when changing duration.
 */
export function ensurePeriodsSynchronized(
  khbd: LessonPlan5512,
  requestedCount: number,
  lessonTitle: string,
  grade: string,
  subject: string
): LessonPlan5512 {
  const safeCount = Math.max(MIN_PERIODS, Math.min(MAX_PERIODS, Math.round(requestedCount)));
  const existingPeriods = khbd.periods && khbd.periods.length > 0 ? [...khbd.periods] : [];

  // If no periods exist, build full 5 periods
  if (existingPeriods.length === 0) {
    const default5 = generateDefault5Periods(lessonTitle, grade, khbd.activities);
    return {
      ...khbd,
      periodsCount: safeCount,
      periods: default5,
    };
  }

  // If periods exist but less than 5, expand up to 5 so user can select up to Tiết 5
  if (existingPeriods.length < MAX_PERIODS) {
    const default5 = generateDefault5Periods(lessonTitle, grade, khbd.activities);
    for (let i = existingPeriods.length; i < MAX_PERIODS; i++) {
      existingPeriods.push(default5[i]);
    }
  }

  return {
    ...khbd,
    periodsCount: safeCount,
    periods: existingPeriods,
  };
}
