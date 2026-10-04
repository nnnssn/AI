import { Activity5512, LessonPlan5512, CurriculumContext } from '../types/edtech';

export interface PeriodPlanConfig {
  period: number;
  durationMinutes: number;
  title: string;
  focus: string;
  badge: string;
}

export const PERIOD_CONFIGURATIONS: PeriodPlanConfig[] = [
  {
    period: 1,
    durationMinutes: 45,
    title: 'Tiết 1',
    focus: 'Khởi động & Khám phá kiến thức cốt lõi (Phần 1)',
    badge: 'Khám phá ban đầu',
  },
  {
    period: 2,
    durationMinutes: 90,
    title: 'Tiết 2',
    focus: 'Hình thành kiến thức chuyên sâu & Chuẩn hóa quy luật',
    badge: 'Chuẩn hóa kiến thức',
  },
  {
    period: 3,
    durationMinutes: 135,
    title: 'Tiết 3',
    focus: 'Thí nghiệm thực nghiệm chuyên sâu & Thao tác mẫu vật',
    badge: 'Thực nghiệm chuyên sâu',
  },
  {
    period: 4,
    durationMinutes: 180,
    title: 'Tiết 4',
    focus: 'Luyện tập rèn luyện kỹ năng & Giải bài tập thực tiễn',
    badge: 'Luyện tập & Kỹ năng',
  },
  {
    period: 5,
    durationMinutes: 225,
    title: 'Tiết 5',
    focus: 'Vận dụng thực tiễn vào đời sống & Hoạt động dự án',
    badge: 'Vận dụng đời sống',
  },
  {
    period: 6,
    durationMinutes: 270,
    title: 'Tiết 6',
    focus: 'Nghiên cứu ứng dụng liên môn & Thiết kế mô hình STEM',
    badge: 'Chuyên đề STEM',
  },
  {
    period: 7,
    durationMinutes: 315,
    title: 'Tiết 7',
    focus: 'Mở rộng tri thức khoa học hiện đại & Xu hướng công nghệ',
    badge: 'Mở rộng tri thức',
  },
  {
    period: 8,
    durationMinutes: 360,
    title: 'Tiết 8',
    focus: 'Kiểm tra đánh giá quá trình & Đánh giá năng lực theo CV 7991',
    badge: 'Đánh giá năng lực',
  },
  {
    period: 9,
    durationMinutes: 405,
    title: 'Tiết 9',
    focus: 'Hệ thống hóa toàn chuyên đề & Báo cáo sản phẩm học tập',
    badge: 'Tổng kết chuyên đề',
  },
  {
    period: 10,
    durationMinutes: 450,
    title: 'Tiết 10',
    focus: 'Thực hành chuyên sâu & Tối ưu hóa giải pháp phức hợp',
    badge: 'Tối ưu hóa giải pháp',
  },
  {
    period: 11,
    durationMinutes: 495,
    title: 'Tiết 11',
    focus: 'Báo cáo chuyên đề liên môn & Tọa đàm khoa học trẻ',
    badge: 'Chuyên đề liên môn',
  },
  {
    period: 12,
    durationMinutes: 540,
    title: 'Tiết 12',
    focus: 'Khám phá thực tiễn địa phương & Định hướng nghề nghiệp',
    badge: 'Thực tiễn & Hướng nghiệp',
  },
  {
    period: 13,
    durationMinutes: 585,
    title: 'Tiết 13',
    focus: 'Đánh giá năng lực thực hành & Đánh giá theo Rubric',
    badge: 'Đánh giá Rubric',
  },
  {
    period: 14,
    durationMinutes: 630,
    title: 'Tiết 14',
    focus: 'Hệ thống hóa toàn diện chủ đề & Báo cáo hồ sơ Portfolio',
    badge: 'Tổng kết & Portfolio',
  },
  {
    period: 15,
    durationMinutes: 675,
    title: 'Tiết 15',
    focus: 'Triển lãm sáng tạo khoa học & Vinh danh thành tích',
    badge: 'Triển lãm khoa học',
  },
];

/**
 * Generates tailored pedagogical activities for a specific teaching period (Tiết N)
 * ensuring non-duplication, lesson alignment, and adherence to CV 5512 4-step framework.
 */
export function createActivitiesForPeriod(
  periodNumber: number,
  curriculum: CurriculumContext
): Activity5512[] {
  const lesson = curriculum.lessonTitle || 'Bài học';
  const grade = curriculum.grade || 'THCS';
  const timestamp = Date.now();

  switch (periodNumber) {
    case 1:
      return [
        {
          id: `act-p1-1-${timestamp}`,
          code: 'hd1',
          periodIndex: 1,
          periodLabel: 'Tiết 1',
          title: `Tiết 1 - Hoạt động 1: Khởi động & Tạo tình huống có vấn đề`,
          subtitle: `Tạo hứng thú, kết nối trải nghiệm thực tế với ${lesson}`,
          durationMinutes: 12,
          objective: `Học sinh nhận biết được hiện tượng thực tiễn gắn với ${lesson}; kích thích sự tò mò và xác định được vấn đề cần nghiên cứu.`,
          content: `GV chiếu video/hình ảnh thực tế về ${lesson}. Học sinh thảo luận theo bàn để trả lời câu hỏi khởi động: "Hiện tượng này diễn ra như thế nào và do những yếu tố nào quyết định?"`,
          product: 'Câu trả lời dự đoán ban đầu, các giả thuyết khoa học của học sinh ghi trên bảng nhóm.',
          implementation: {
            assign: 'GV tổ chức trò chơi hoặc tình huống thực tế, yêu cầu các nhóm quan sát và ghi nhận xét trong 4 phút.',
            execute: 'HS làm việc nhóm đôi, thảo luận và đề xuất các phương án giải thích ban đầu.',
            discuss: 'Mời đại diện 2 nhóm trình bày ý tưởng, các nhóm khác nhận xét và phản biện nhanh.',
            conclude: 'GV tổng kết các dự đoán của HS, nêu mâu thuẫn nhận thức và chính thức giới thiệu vào bài mới.',
          },
        },
        {
          id: `act-p1-2-${timestamp}`,
          code: 'hd2',
          periodIndex: 1,
          periodLabel: 'Tiết 1',
          title: `Tiết 1 - Hoạt động 2: Khám phá khái niệm & Bản chất ban đầu`,
          subtitle: `Đọc hiểu SGK và phân tích hiện tượng thực nghiệm cơ bản`,
          durationMinutes: 33,
          objective: `Nêu được các định nghĩa, khái niệm cơ bản và cấu trúc chính trong nội dung ${lesson}.`,
          content: 'Nghiên cứu mục I SGK, quan sát sơ đồ cấu tạo/thí nghiệm cơ bản và hoàn thành Phiếu học tập số 1.',
          product: 'Phiếu học tập cá nhân đã hoàn thiện, bảng tổng hợp sơ bộ của các nhóm.',
          implementation: {
            assign: 'GV phát Phiếu học tập số 1, phân công nhiệm vụ đọc tài liệu và phân tích sơ đồ trong 10 phút.',
            execute: 'HS làm việc cá nhân đọc tài liệu, sau đó trao đổi nhóm 4 người để thống nhất câu trả lời.',
            discuss: 'GV mời đại diện 2 nhóm lên bảng thuyết trình sơ đồ, chỉ rõ các thành phần cơ bản.',
            conclude: 'GV nhận xét, chuẩn hóa khái niệm lên bảng chính và dặn dò nhiệm vụ chuyển tiếp sang Tiết 2.',
          },
        },
      ];

    case 2:
      return [
        {
          id: `act-p2-1-${timestamp}`,
          code: 'hd2',
          periodIndex: 2,
          periodLabel: 'Tiết 2',
          title: `Tiết 2 - Hoạt động 1: Nghiên cứu cơ chế, quy luật & Phương trình trọng tâm`,
          subtitle: `Phân tích sâu bản chất khoa học và thiết lập mối quan hệ định lượng`,
          durationMinutes: 35,
          objective: `Hiểu rõ cơ chế, viết đúng phương trình/công thức định luật và giải thích được các yếu tố ảnh hưởng trong ${lesson}.`,
          content: 'Nghiên cứu mục II SGK, tiến hành phân tích số liệu bảng thực nghiệm, rút ra công thức/quy luật tổng quát.',
          product: 'Sơ đồ cơ chế khoa học, công thức tính toán và bảng phân tích mối quan hệ nhân quả.',
          implementation: {
            assign: 'GV nêu câu hỏi trọng tâm: "Quy luật nào chi phối quá trình này? Hãy chứng minh bằng số liệu thực nghiệm trong SGK."',
            execute: 'HS thảo luận nhóm chuyên gia, phân tích dữ liệu và ghi kết quả lên bảng A3.',
            discuss: 'Các nhóm treo bảng phụ, luân phiên phản biện chéo nhau (Gallery Walk).',
            conclude: 'GV chính xác hóa công thức/phương trình khoa học, phân tích các điều kiện áp dụng chuẩn mực.',
          },
        },
        {
          id: `act-p2-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 2,
          periodLabel: 'Tiết 2',
          title: `Tiết 2 - Hoạt động 2: Củng cố & Đánh giá mức độ thông hiểu`,
          subtitle: `Nhận biết và phân biệt các trường hợp điển hình`,
          durationMinutes: 10,
          objective: `Củng cố kiến thức trọng tâm của 2 tiết đầu, rèn luyện kỹ năng nhận diện và phân loại.`,
          content: 'Làm bài tập trắc nghiệm nhanh 4 câu trên bảng tương tác hoặc phiếu kiểm tra ngắn.',
          product: 'Kết quả trả lời bài tập của học sinh, đáp án chuẩn đối chiếu.',
          implementation: {
            assign: 'GV đưa ra 4 câu hỏi trắc nghiệm định hướng CV 7991 trên màn hình chiếu.',
            execute: 'HS dùng thẻ giơ đáp án hoặc chọn trên ứng dụng học tập.',
            discuss: 'GV gọi 1 HS giải thích lí do chọn phương án đúng và chỉ ra điểm bẫy ở các phương án nhiễu.',
            conclude: 'GV biểu dương học sinh làm tốt và dặn dò phần thí nghiệm thực hành ở Tiết 3.',
          },
        },
      ];

    case 3:
      return [
        {
          id: `act-p3-1-${timestamp}`,
          code: 'hd3',
          periodIndex: 3,
          periodLabel: 'Tiết 3',
          title: `Tiết 3 - Hoạt động 1: Thí nghiệm thực nghiệm chuyên sâu & Thao tác mẫu vật`,
          subtitle: `Trực tiếp kiểm chứng hiện tượng, thu thập và xử lí số liệu thực nghiệm`,
          durationMinutes: 35,
          objective: `Sử dụng thành thạo dụng cụ thí nghiệm hoặc mô hình trực quan; thu thập, ghi chép và xử lí số liệu đo đạc khách quan theo đúng yêu cầu cần đạt của bài ${lesson}.`,
          content: 'Các nhóm tiến hành bố trí dụng cụ thực nghiệm theo hướng dẫn SGK mục III; quan sát hiện tượng, đo các thông số và lập bảng theo dõi.',
          product: 'Bảng số liệu thực nghiệm của từng nhóm, bản ghi nhận xét hiện tượng và ảnh chụp/sản phẩm thí nghiệm.',
          implementation: {
            assign: 'GV kiểm tra an toàn thí nghiệm, giao bộ dụng cụ và phiếu phân công nhiệm vụ cụ thể cho từng thành viên trong nhóm.',
            execute: 'HS tiến hành thao tác thực nghiệm theo các bước chuẩn; đo lường và ghi nhật ký thực nghiệm trung thực.',
            discuss: 'Đại diện nhóm báo cáo các sai số gặp phải và cách khắc phục trong quá trình thao tác.',
            conclude: 'GV đánh giá kỹ năng thực hành, thái độ làm việc nhóm và chuẩn hóa các thao tác an toàn phòng thí nghiệm.',
          },
        },
        {
          id: `act-p3-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 3,
          periodLabel: 'Tiết 3',
          title: `Tiết 3 - Hoạt động 2: Xử lí dữ liệu & Rút ra kết luận khoa học`,
          subtitle: `So sánh kết quả thực nghiệm với lý thuyết đã học`,
          durationMinutes: 10,
          objective: `Rút ra kết luận khoa học từ số liệu thực nghiệm vừa đo đạc; giải thích nguyên nhân gây sai số.`,
          content: 'Tính toán giá trị trung bình, đối chiếu với công thức lý thuyết và đưa ra kết luận.',
          product: 'Báo cáo thu hoạch thí nghiệm có chữ ký xác nhận của nhóm trưởng.',
          implementation: {
            assign: 'GV yêu cầu tính toán sai số và rút ra mối quan hệ giữa các biến số thực nghiệm.',
            execute: 'HS xử lí số liệu toán học trong 5 phút.',
            discuss: 'GV mời 1 nhóm trình bày công thức xử lí số liệu.',
            conclude: 'GV chốt lại kết luận thực nghiệm kiểm chứng thành công lý thuyết.',
          },
        },
      ];

    case 4:
      return [
        {
          id: `act-p4-1-${timestamp}`,
          code: 'hd3',
          periodIndex: 4,
          periodLabel: 'Tiết 4',
          title: `Tiết 4 - Hoạt động 1: Luyện tập giải bài tập định tính & Phân tích tình huống`,
          subtitle: `Hệ thống hóa kiến thức qua hệ thống bài tập phân hóa theo chuẩn CV 7991`,
          durationMinutes: 25,
          objective: `Vận dụng kiến thức bài ${lesson} để giải quyết thành thạo các dạng câu hỏi trắc nghiệm đúng/sai, trắc nghiệm trả lời ngắn và giải thích hiện tượng.`,
          content: 'Giải các bài tập trong Phiếu luyện tập số 2 gồm 6 câu trắc nghiệm nhiều lựa chọn và 2 câu Đúng/Sai 4 lệnh hỏi.',
          product: 'Lời giải chi tiết trong vở bài tập của học sinh, bảng chấm điểm chéo.',
          implementation: {
            assign: 'GV phát Phiếu luyện tập số 2, yêu cầu làm việc độc lập 15 phút.',
            execute: 'HS tập trung giải bài tập, áp dụng các bước suy luận logic và biến đổi công thức.',
            discuss: 'Tổ chức đổi chéo bài làm, chữa bài mẫu trên bảng chiếu.',
            conclude: 'GV giải đáp thắc mắc và hướng dẫn mẹo nhận biết phương án nhiễu.',
          },
        },
        {
          id: `act-p4-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 4,
          periodLabel: 'Tiết 4',
          title: `Tiết 4 - Hoạt động 2: Luyện tập bài tập tính toán định lượng nâng cao`,
          subtitle: `Rèn luyện kỹ năng tính toán, đổi đơn vị và trình bày tự luận chuẩn mực`,
          durationMinutes: 20,
          objective: `Hình thành kỹ năng giải bài toán tự luận nhiều bước tính; biết cách lập luận và trình bày bài giải khoa học, đúng thứ nguyên đơn vị.`,
          content: 'Làm bài tập tự luận nâng cao có số liệu thực tế liên quan đến ${lesson}.',
          product: 'Bài giải tự luận hoàn chỉnh trên bảng lớp và vở ghi của học sinh.',
          implementation: {
            assign: 'GV giao bài tập tự luận nâng cao lên bảng, phân công 2 HS đại diện lên bảng làm.',
            execute: 'HS làm bài dưới lớp, 2 HS làm trên 2 góc bảng độc lập.',
            discuss: 'Cả lớp nhận xét cách trình bày, lập luận logic và phép toán của bạn.',
            conclude: 'GV chốt barem điểm chi tiết và biểu dương bài làm xuất sắc.',
          },
        },
      ];

    case 5:
      return [
        {
          id: `act-p5-1-${timestamp}`,
          code: 'hd4',
          periodIndex: 5,
          periodLabel: 'Tiết 5',
          title: `Tiết 5 - Hoạt động 1: Vận dụng kiến thức giải quyết vấn đề thực tiễn gia đình & Đời sống`,
          subtitle: `Liên hệ thực tế, đề xuất giải pháp cải thiện môi trường sống và sinh hoạt`,
          durationMinutes: 30,
          objective: `Vận dụng kiến thức đã học trong ${lesson} để giải thích các vấn đề thực tiễn đời sống gia đình, nông nghiệp hoặc sản xuất công nghiệp tại địa phương.`,
          content: 'Nghiên cứu tình huống thực tiễn do GV đưa ra (hoặc mục "Em có thể" trong SGK); thảo luận nhóm để đề xuất phương án tối ưu.',
          product: 'Bản kế hoạch hành động hoặc đề xuất giải pháp thực tế có tính khả thi cao của nhóm.',
          implementation: {
            assign: 'GV chia 4 nhóm giải quyết 4 tình huống đời sống khác nhau gắn với ${lesson}.',
            execute: 'Các nhóm thảo luận sôi nổi, liên hệ thực tế tại gia đình và trường học.',
            discuss: 'Mỗi nhóm có 3 phút thuyết trình giải pháp trước lớp.',
            conclude: 'GV nhận xét tính khả thi, khen ngợi tính sáng tạo và tinh thần trách nhiệm với cộng đồng.',
          },
        },
        {
          id: `act-p5-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 5,
          periodLabel: 'Tiết 5',
          title: `Tiết 5 - Hoạt động 2: Xây dựng thông điệp tuyên truyền & Ý thức bảo vệ môi trường`,
          subtitle: `Phát triển phẩm chất trách nhiệm và công dân toàn cầu`,
          durationMinutes: 15,
          objective: `Có ý thức bảo vệ môi trường, sử dụng tài nguyên tiết kiệm và an toàn; tuyên truyền tới người thân trong gia đình.`,
          content: 'Viết thông điệp ngắn 3-5 câu hoặc vẽ sơ đồ tư duy tóm tắt hành động thiết thực.',
          product: 'Poster nhỏ hoặc thông điệp tuyên truyền của học sinh.',
          implementation: {
            assign: 'GV phát giấy màu hoặc bảng phụ, giao nhiệm vụ sáng tạo thông điệp.',
            execute: 'HS thiết kế khẩu hiệu hành động nhanh trong 8 phút.',
            discuss: 'Dán các sản phẩm lên bảng tin lớp học.',
            conclude: 'GV tổng kết tiết học, chuyển tiếp sang nhiệm vụ dự án STEM ở Tiết 6.',
          },
        },
      ];

    case 6:
      return [
        {
          id: `act-p6-1-${timestamp}`,
          code: 'hd4',
          periodIndex: 6,
          periodLabel: 'Tiết 6',
          title: `Tiết 6 - Hoạt động 1: Nghiên cứu ứng dụng liên môn & Thiết kế mô hình STEM`,
          subtitle: `Tích hợp kiến thức Khoa học, Công nghệ, Kỹ thuật và Toán học`,
          durationMinutes: 35,
          objective: `Phát triển năng lực giải quyết vấn đề và sáng tạo; thiết kế được bản vẽ hoặc chế tạo mô hình thiết bị đơn giản ứng dụng nguyên lí của ${lesson}.`,
          content: 'Sử dụng các vật liệu tái chế, vật liệu dễ tìm để chế tạo mô hình thử nghiệm (STEM) theo chủ đề bài học.',
          product: 'Bản vẽ thiết kế kỹ thuật, mô hình sản phẩm STEM hoạt động được của các nhóm.',
          implementation: {
            assign: 'GV giới thiệu tiêu chí sản phẩm STEM: Tối ưu chi phí, thẩm mỹ, vận hành đúng nguyên lí bài học.',
            execute: 'Các nhóm phối hợp lắp ráp, thử nghiệm và hiệu chỉnh sản phẩm.',
            discuss: 'Trình diễn mô hình trước lớp, giải thích cơ chế kỹ thuật vận hành.',
            conclude: 'GV đánh giá theo rubric tiêu chí STEM, gợi ý cải tiến mô hình.',
          },
        },
        {
          id: `act-p6-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 6,
          periodLabel: 'Tiết 6',
          title: `Tiết 6 - Hoạt động 2: Hoàn thiện hồ sơ kỹ thuật & Đánh giá đồng đẳng sản phẩm STEM`,
          subtitle: `Rèn luyện kỹ năng tự đánh giá và phản biện khoa học`,
          durationMinutes: 10,
          objective: `Biết nhận xét, đánh giá khách quan sản phẩm của bạn theo các tiêu chí đã thống nhất.`,
          content: 'Ghi phiếu đánh giá đồng đẳng (Peer assessment) cho 3 nhóm bạn.',
          product: 'Phiếu đánh giá đồng đẳng đã ghi đầy đủ điểm số và lời nhận xét mang tính xây dựng.',
          implementation: {
            assign: 'GV phát phiếu rubric đánh giá đồng đẳng cho từng nhóm.',
            execute: 'HS chấm điểm và ghi ý kiến đóng góp cho nhóm bạn.',
            discuss: 'Đại diện trao đổi trực tiếp những ưu điểm nổi bật của mô hình.',
            conclude: 'GV tổng kết điểm đánh giá và tuyên dương các sáng kiến đột phá.',
          },
        },
      ];

    case 7:
      return [
        {
          id: `act-p7-1-${timestamp}`,
          code: 'hd2',
          periodIndex: 7,
          periodLabel: 'Tiết 7',
          title: `Tiết 7 - Hoạt động 1: Mở rộng tri thức khoa học hiện đại & Xu hướng công nghệ mới`,
          subtitle: `Tiếp cận các thành tựu khoa học kỹ thuật tiên tiến trên thế giới gắn với bài học`,
          durationMinutes: 35,
          objective: `Mở rộng tầm nhìn khoa học; nhận biết được các ứng dụng công nghệ cao (trí tuệ nhân tạo, tự động hóa, vật liệu mới hoặc sinh học phân tử) liên quan đến ${lesson}.`,
          content: 'Đọc tài liệu bổ trợ, xem phóng sự khoa học ngắn và phân tích xu hướng phát triển trong tương lai.',
          product: 'Bài thu hoạch ngắn hoặc mindmap mở rộng tri thức của học sinh.',
          implementation: {
            assign: 'GV giao tài liệu đọc mở rộng và đặt câu hỏi định hướng nghiên cứu.',
            execute: 'HS nghiên cứu tài liệu, ghi chép từ khóa và vẽ sơ đồ liên hệ tri thức.',
            discuss: 'Thảo luận bàn tròn về những cơ hội và thách thức của công nghệ mới.',
            conclude: 'GV truyền cảm hứng nghiên cứu khoa học, khơi dậy đam mê khám phá của học sinh.',
          },
        },
        {
          id: `act-p7-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 7,
          periodLabel: 'Tiết 7',
          title: `Tiết 7 - Hoạt động 2: Rèn luyện kỹ năng tra cứu & Chọn lọc tài liệu khoa học`,
          subtitle: `Phát triển năng lực tự chủ và tự học suốt đời`,
          durationMinutes: 10,
          objective: `Hình thành kỹ năng tìm kiếm thông tin khoa học đáng tin cậy trên internet và sách báo chuyên ngành.`,
          content: 'Thực hành liệt kê 3 nguồn tài liệu khoa học uy tín về chuyên đề đang học.',
          product: 'Danh mục tài liệu tham khảo chất lượng do học sinh tự tổng hợp.',
          implementation: {
            assign: 'GV hướng dẫn cách xác thực nguồn tin khoa học chính thống.',
            execute: 'HS ghi nhận các trang web khoa học chuẩn mực vào sổ tay.',
            discuss: 'Chia sẻ các kênh thông tin bổ ích cho cả lớp.',
            conclude: 'GV nhắc nhở về đạo đức học thuật và chống đạo văn.',
          },
        },
      ];

    case 8:
      return [
        {
          id: `act-p8-1-${timestamp}`,
          code: 'hd3',
          periodIndex: 8,
          periodLabel: 'Tiết 8',
          title: `Tiết 8 - Hoạt động 1: Kiểm tra đánh giá quá trình theo chuẩn CV 7991/BGDĐT-GDTrH`,
          subtitle: `Khảo sát toàn diện mức độ đạt được các yêu cầu cần đạt của toàn bài học`,
          durationMinutes: 35,
          objective: `Đánh giá khách quan mức độ lĩnh hội kiến thức, kỹ năng và năng lực của học sinh theo 3 mức độ (Nhận biết, Thông hiểu, Vận dụng) với cấu trúc 4 phần của CV 7991.`,
          content: 'Học sinh làm bài kiểm tra định kì ngắn 25 phút gồm Phần I (TNKQ 4 lựa chọn), Phần II (Đúng/Sai), Phần III (Trả lời ngắn) và Phần IV (Tự luận ngắn).',
          product: 'Bài làm cá nhân của học sinh trên phiếu kiểm tra chuẩn.',
          implementation: {
            assign: 'GV phổ biến quy chế kiểm tra nghiêm túc và phát đề cho học sinh.',
            execute: 'HS làm bài độc lập, nghiêm túc và đúng thời gian quy định.',
            discuss: 'GV thu bài, chiếu đáp án và barem điểm chuẩn để học sinh tự đối chiếu sơ bộ.',
            conclude: 'GV nhận xét chung về tinh thần làm bài và nêu kế hoạch chấm trả bài.',
          },
        },
        {
          id: `act-p8-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 8,
          periodLabel: 'Tiết 8',
          title: `Tiết 8 - Hoạt động 2: Phân tích lỗi sai điển hình & Hướng dẫn tự sửa chữa`,
          subtitle: `Phản hồi sư phạm tức thì giúp học sinh khắc phục lỗ hổng kiến thức`,
          durationMinutes: 10,
          objective: `Nhận diện được các lỗi sai phổ biến về khái niệm, kỹ năng tính toán và cách trình bày bài giải.`,
          content: 'Phân tích 2 câu hỏi có tỉ lệ học sinh chọn phương án nhiễu nhiều nhất.',
          product: 'Sổ tay ghi chú lỗi sai và cách khắc phục của từng học sinh.',
          implementation: {
            assign: 'GV chiếu 2 câu hỏi điển hình dễ nhầm lẫn lên bảng.',
            execute: 'HS thảo luận nhanh nguyên nhân dẫn đến lựa chọn sai.',
            discuss: 'Một học sinh phân tích bẫy đề thi và giải thích phương án chuẩn.',
            conclude: 'GV chốt phương pháp làm bài trắc nghiệm và tự luận tối ưu điểm số.',
          },
        },
      ];

    case 9:
      return [
        {
          id: `act-p9-1-${timestamp}`,
          code: 'hd4',
          periodIndex: 9,
          periodLabel: 'Tiết 9',
          title: `Tiết 9 - Hoạt động 1: Hệ thống hóa toàn bộ mạch kiến thức bài học bằng Mindmap`,
          subtitle: `Tổng kết chuyên đề toàn diện, xâu chuỗi bản chất các hiện tượng đã học`,
          durationMinutes: 25,
          objective: `Hệ thống hóa toàn bộ kiến thức, kỹ năng cốt lõi của bài ${lesson} thành một sơ đồ tư duy logic, mạch lạc và dễ ghi nhớ dài hạn.`,
          content: 'Các nhóm phối hợp hoàn thiện bức tranh tổng thể về chuyên đề trên bảng A0 hoặc phần mềm vẽ sơ đồ tư duy.',
          product: 'Sơ đồ tư duy toàn bài học sáng tạo, đầy đủ các nhánh kiến thức và ứng dụng.',
          implementation: {
            assign: 'GV giao nhiệm vụ tổng kết: "Xây dựng sơ đồ tư duy thâu tóm toàn bộ tri thức của bài học theo cấu trúc logic nhất."',
            execute: 'HS thảo luận nhóm, sử dụng bút màu và từ khóa để vẽ sơ đồ.',
            discuss: 'Trưng bày triển lãm sơ đồ quanh lớp học (Triển lãm tranh).',
            conclude: 'GV chuẩn hóa sơ đồ tối ưu lên màn hình chính, làm tài liệu ôn tập lâu dài cho học sinh.',
          },
        },
        {
          id: `act-p9-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 9,
          periodLabel: 'Tiết 9',
          title: `Tiết 9 - Hoạt động 2: Báo cáo chung kết sản phẩm học tập & Định hướng bài tiếp theo`,
          subtitle: `Vinh danh học sinh xuất sắc, khen thưởng nhóm tích cực và giao bài về nhà`,
          durationMinutes: 20,
          objective: `Tổng kết chặng đường học tập của chuyên đề; kích thích động lực học tập và định hướng tự học bài tiếp theo.`,
          content: 'Nhìn lại hành trình bài học, công bố điểm thưởng thi đua của các nhóm và giao nhiệm vụ chuẩn bị bài học mới.',
          product: 'Bảng tổng kết thi đua của lớp, nhiệm vụ học tập tự học ở nhà.',
          implementation: {
            assign: 'GV công bố bảng tổng sắp điểm cộng của các nhóm qua các tiết học.',
            execute: 'Lớp trưởng ghi nhận danh sách khen thưởng các bạn có tiến bộ vượt bậc.',
            discuss: 'Đại diện học sinh chia sẻ cảm xúc và những điều tâm đắc nhất sau bài học.',
            conclude: 'GV tổng kết toàn diện giờ học, động viên học sinh và dặn dò đọc trước SGK bài sau.',
          },
        },
      ];

    case 10:
      return [
        {
          id: `act-p10-1-${timestamp}`,
          code: 'hd3',
          periodIndex: 10,
          periodLabel: 'Tiết 10',
          title: `Tiết 10 - Hoạt động 1: Giải quyết vấn đề phức hợp & Tối ưu hóa phương án thực tiễn`,
          subtitle: `Vận dụng tư duy bậc cao để xử lý các bài toán đa biến số gắn với ${lesson}`,
          durationMinutes: 25,
          objective: `Vận dụng kiến thức bài ${lesson} để phân tích các bài toán phức hợp, nhận diện mâu thuẫn nhận thức và đề xuất ít nhất 2 giải pháp tối ưu.`,
          content: `Nghiên cứu tình huống mở rộng về ${lesson} trong bối cảnh sản xuất hoặc đời sống thực tế; phân tích ưu - nhược điểm của các phương án kỹ thuật.`,
          product: 'Bản ma trận đánh giá phương án (Decision Matrix) và đề xuất kỹ thuật tối ưu của nhóm.',
          implementation: {
            assign: 'GV nêu bài toán thực tiễn cần tối ưu chi phí và hiệu năng; phát phiếu tiêu chí ma trận quyết định.',
            execute: 'Các nhóm phân tích các biến số, tính toán định lượng và điền vào bảng ma trận phương án.',
            discuss: 'Đại diện các nhóm phản biện và bảo vệ giải pháp tối ưu trước hội đồng lớp.',
            conclude: 'GV chuẩn hóa nguyên tắc tối ưu hóa và khen ngợi tư duy logic, phản biện của học sinh.',
          },
        },
        {
          id: `act-p10-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 10,
          periodLabel: 'Tiết 10',
          title: `Tiết 10 - Hoạt động 2: Thử nghiệm mô phỏng & Đánh giá sai số giải pháp`,
          subtitle: `Kiểm tra tính khả thi của giải pháp bằng thực nghiệm hoặc mô hình hóa số liệu`,
          durationMinutes: 20,
          objective: `Đánh giá được độ tin cậy và biên độ an toàn của giải pháp đã đề xuất thông qua thử nghiệm thực tế hoặc xử lý số liệu mô phỏng.`,
          content: 'Tiến hành chạy thử nghiệm mô hình hoặc nhập dữ liệu vào bảng tính để kiểm tra độ ổn định và các ngưỡng sai số.',
          product: 'Báo cáo kết quả thử nghiệm kèm biểu đồ trực quan hóa dữ liệu đo lường.',
          implementation: {
            assign: 'GV hướng dẫn các bước kiểm thử và cách xác định khoảng dung sai cho phép.',
            execute: 'Học sinh thao tác kiểm thử, ghi chép nhật ký thông số và vẽ biểu đồ biến thiên.',
            discuss: 'Chia sẻ kết quả kiểm nghiệm, thảo luận các điểm bất thường (anomalies) trong dữ liệu.',
            conclude: 'GV kết luận về tầm quan trọng của việc kiểm chứng thực nghiệm trước khi triển khai quy mô lớn.',
          },
        },
      ];

    case 11:
      return [
        {
          id: `act-p11-1-${timestamp}`,
          code: 'hd2',
          periodIndex: 11,
          periodLabel: 'Tiết 11',
          title: `Tiết 11 - Hoạt động 1: Xây dựng chuyên đề nghiên cứu liên môn & Thiết kế Infographic`,
          subtitle: `Kết nối kiến thức ${lesson} với các môn Toán, Công nghệ, Địa lí và Giáo dục công dân`,
          durationMinutes: 25,
          objective: `Xác định được mối liên hệ liên môn sâu sắc giữa bài ${lesson} và các lĩnh vực khoa học khác; thiết kế được infographic truyền tải tri thức ngắn gọn, trực quan.`,
          content: `Thu thập tư liệu liên môn, trích xuất dữ liệu cốt lõi và phác thảo sơ đồ infographic khoa học trên giấy A3 hoặc ứng dụng đồ họa.`,
          product: 'Bản phác thảo Infographic khoa học liên môn hoàn chỉnh, bố cục thẩm mỹ và chuẩn xác về mặt nội dung.',
          implementation: {
            assign: 'GV phân chia các nhóm chuyên đề liên môn (Khoa học - Công nghệ, Khoa học - Môi trường, Khoa học - Kinh tế - Xã hội).',
            execute: 'Học sinh tổng hợp số liệu, phác thảo bố cục và thể hiện các điểm kết nối liên môn.',
            discuss: 'Trưng bày sản phẩm theo hình thức phòng tranh (Gallery Walk), dán giấy ghi chú (stickynote) nhận xét chéo.',
            conclude: 'GV chuẩn hóa các điểm kết nối liên môn và nhấn mạnh tính chỉnh thể của tri thức khoa học hiện đại.',
          },
        },
        {
          id: `act-p11-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 11,
          periodLabel: 'Tiết 11',
          title: `Tiết 11 - Hoạt động 2: Tọa đàm khoa học trẻ: Báo cáo kết quả & Thuyết trình chuyên đề`,
          subtitle: `Rèn luyện kỹ năng diễn thuyết khoa học, lập luận phản biện và truyền cảm hứng`,
          durationMinutes: 20,
          objective: `Phát triển năng lực giao tiếp và hợp tác; tự tin báo cáo trước tập thể và lập luận thuyết phục trước các câu hỏi phản biện.`,
          content: 'Mỗi nhóm cử đại diện báo cáo tóm tắt 3 phút về điểm đột phá trong nghiên cứu của mình; lắng nghe và trả lời chất vấn từ hội đồng lớp.',
          product: 'Bài thuyết trình trực tiếp, biên bản chất vấn và phản hồi học thuật của nhóm.',
          implementation: {
            assign: 'GV đóng vai trò chủ tọa tọa đàm khoa học, phổ biến thể lệ thuyết trình và phản biện nghiêm túc.',
            execute: 'Đại diện các nhóm báo cáo ngắn gọn, tập trung vào giá trị thực tiễn và tính mới của bài học.',
            discuss: 'Học sinh trong lớp đặt câu hỏi xoay quanh cơ chế khoa học và tính ứng dụng thực tế.',
            conclude: 'GV tổng kết phiên tọa đàm, biểu dương tinh thần học thuật sôi nổi và kỹ năng thuyết trình tự tin.',
          },
        },
      ];

    case 12:
      return [
        {
          id: `act-p12-1-${timestamp}`,
          code: 'hd4',
          periodIndex: 12,
          periodLabel: 'Tiết 12',
          title: `Tiết 12 - Hoạt động 1: Khám phá ứng dụng công nghiệp, nông nghiệp & Đời sống địa phương`,
          subtitle: `Gắn lý thuyết bài ${lesson} với thực tiễn sản xuất, kinh tế và môi trường sinh thái địa phương`,
          durationMinutes: 25,
          objective: `Nhận diện được các mô hình kinh tế, cơ sở sản xuất hoặc dây chuyền công nghệ tại địa phương đang áp dụng nguyên lý của ${lesson}.`,
          content: `Đọc và phân tích hồ sơ tư liệu thực tế (Case study) về ứng dụng ${lesson} trong một nhà máy, trang trại hoặc công trình tiêu biểu.`,
          product: 'Bản thu hoạch phân tích thực tế: nêu tên công nghệ, ưu điểm kinh tế và giải pháp bảo vệ môi trường đi kèm.',
          implementation: {
            assign: 'GV cung cấp tư liệu thực tế địa phương và bảng câu hỏi phân tích kinh tế - kỹ thuật.',
            execute: 'Học sinh làm việc theo cặp, phân tích luồng vận hành công nghệ và tác động sinh thái.',
            discuss: 'Thảo luận các đề xuất cải tiến công nghệ thân thiện hơn với môi trường sống.',
            conclude: 'GV kết nối tri thức sách vở với hơi thở cuộc sống sản xuất, khơi gợi lòng tự hào quê hương.',
          },
        },
        {
          id: `act-p12-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 12,
          periodLabel: 'Tiết 12',
          title: `Tiết 12 - Hoạt động 2: Định hướng nghề nghiệp tương lai trong kỷ nguyên kinh tế số`,
          subtitle: `Tìm hiểu các ngành nghề, vị trí công việc gắn với lĩnh vực kiến thức bài học`,
          durationMinutes: 20,
          objective: `Nêu được ít nhất 3 ngành nghề/vị trí việc làm cần sử dụng kiến thức ${lesson}; xác định được các phẩm chất và kỹ năng cần chuẩn bị.`,
          content: 'Khảo sát thông tin tuyển dụng, yêu cầu bằng cấp và kỹ năng của các nghề nghiệp liên quan; lập kế hoạch rèn luyện cá nhân.',
          product: 'Bản "Kế hoạch phát triển năng lực cá nhân" định hướng nghề nghiệp tương lai.',
          implementation: {
            assign: 'GV giới thiệu bức tranh nghề nghiệp hiện đại trong kỷ nguyên cách mạng công nghiệp 4.0 liên quan đến bài học.',
            execute: 'Học sinh tự điền vào phiếu khảo sát xu hướng nghề nghiệp và kế hoạch học tập cá nhân.',
            discuss: 'Một số học sinh chia sẻ ước mơ nghề nghiệp tương lai và dự định phấn đấu.',
            conclude: 'GV truyền động lực, khích lệ học sinh nuôi dưỡng ước mơ và kiên trì học tập tốt môn học.',
          },
        },
      ];

    case 13:
      return [
        {
          id: `act-p13-1-${timestamp}`,
          code: 'hd3',
          periodIndex: 13,
          periodLabel: 'Tiết 13',
          title: `Tiết 13 - Hoạt động 1: Đánh giá sản phẩm dự án học tập theo khung Rubric chuẩn hóa`,
          subtitle: `Thực hiện đánh giá định mức đa chiều (Tự đánh giá, đánh giá đồng đẳng và đánh giá của GV)`,
          durationMinutes: 25,
          objective: `Nắm vững các tiêu chí đánh giá sản phẩm học tập; biết sử dụng bảng tiêu chí Rubric để chấm điểm công tâm, minh bạch và chính xác.`,
          content: `Áp dụng bảng tiêu chí Rubric 4 mức độ (Chưa đạt, Đạt, Khá, Xuất sắc) để thẩm định sản phẩm học tập/mô hình của các nhóm khác.`,
          product: 'Bảng điểm Rubric chi tiết kèm các nhận xét định tính cụ thể cho từng tiêu chí.',
          implementation: {
            assign: 'GV giải thích chi tiết các tiêu chí trong Rubric (tính chính xác khoa học, tính sáng tạo, thẩm mỹ, thuyết trình).',
            execute: 'Các nhóm luân phiên chấm điểm chéo độc lập và thảo luận để thống nhất điểm số.',
            discuss: 'Đại diện tổ thẩm định công bố nhận xét chi tiết, chỉ rõ điểm mạnh và điểm cần cải tiến của từng sản phẩm.',
            conclude: 'GV chốt điểm chính thức, phân tích tính chuẩn xác của quá trình đánh giá đồng đẳng.',
          },
        },
        {
          id: `act-p13-2-${timestamp}`,
          code: 'hd3',
          periodIndex: 13,
          periodLabel: 'Tiết 13',
          title: `Tiết 13 - Hoạt động 2: Khảo sát năng lực thực hành giải quyết vấn đề qua trạm thử thách ngắn`,
          subtitle: `Vượt qua các câu hỏi tình huống thực nghiệm tốc độ cao (Speed Challenge)`,
          durationMinutes: 20,
          objective: `Đánh giá phản xạ sư phạm và khả năng xử lý tình huống thực tế nhanh, chính xác trong thời gian giới hạn.`,
          content: `Học sinh luân chuyển qua 3 trạm thử thách với các câu hỏi thực nghiệm, câu hỏi bẫy tư duy về ${lesson}.`,
          product: 'Phiếu vượt trạm thử thách cá nhân có điểm số xác nhận của các trạm trưởng.',
          implementation: {
            assign: 'GV thiết lập 3 trạm thử thách quanh phòng học và phân công trạm trưởng bấm giờ.',
            execute: 'Học sinh di chuyển theo hiệu lệnh, giải quyết nhiệm vụ tại mỗi trạm trong 4 phút.',
            discuss: 'Công bố nhanh danh sách học sinh đạt điểm tuyệt đối tại tất cả các trạm.',
            conclude: 'GV khen ngợi sự tập trung cao độ và phản xạ tư duy sắc sảo của học sinh.',
          },
        },
      ];

    case 14:
      return [
        {
          id: `act-p14-1-${timestamp}`,
          code: 'hd4',
          periodIndex: 14,
          periodLabel: 'Tiết 14',
          title: `Tiết 14 - Hoạt động 1: Hệ thống hóa toàn diện hồ sơ học tập (Portfolio) & Chuẩn hóa năng lực`,
          subtitle: `Sắp xếp, lưu trữ và tự đánh giá hành trình tiến bộ qua toàn bộ các tiết học của bài ${lesson}`,
          durationMinutes: 25,
          objective: `Tổng hợp đầy đủ các minh chứng học tập (phiếu bài tập, báo cáo thí nghiệm, mô hình, bài kiểm tra); tự nhận thức được sự tiến bộ của bản thân qua từng tiết học.`,
          content: `Rà soát và hoàn thiện tập hồ sơ học tập (Portfolio) cá nhân/nhóm; viết bài tự đánh giá (Self-reflection) ngắn về những điều đã học được và kỹ năng đã tiến bộ.`,
          product: 'Tập Hồ sơ học tập hoàn chỉnh (bản cứng hoặc bản số điện tử) có bài tự đánh giá tiến bộ của học sinh.',
          implementation: {
            assign: 'GV hướng dẫn cấu trúc một hồ sơ học tập khoa học và phát phiếu tự đánh giá tiến bộ học tập.',
            execute: 'Học sinh sắp xếp hồ sơ theo trình tự thời gian, bổ sung các phần còn thiếu và viết phản tư cá nhân.',
            discuss: 'Chia sẻ bài học rút ra và những kỷ niệm đáng nhớ nhất trong suốt tiến trình học tập bài này.',
            conclude: 'GV xác nhận hồ sơ học tập hợp lệ và lưu vào học bạ theo dõi năng lực của học sinh.',
          },
        },
        {
          id: `act-p14-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 14,
          periodLabel: 'Tiết 14',
          title: `Tiết 14 - Hoạt động 2: Tổng kết chuyên đề, công bố bảng vinh danh & Bế mạc tiến trình dạy học`,
          subtitle: `Ghi nhận thành tích, vinh danh các cá nhân và tập thể xuất sắc, tạo động lực cho các bài học tiếp theo`,
          durationMinutes: 20,
          objective: `Tạo cảm xúc tích cực, tự hào và khơi dậy động lực học tập suốt đời; chuẩn bị tâm thế vững vàng bước vào bài học mới.`,
          content: `Tổng kết kết quả thi đua cả đợt học; trao giấy khen/huy hiệu biểu trưng cho các nhóm xuất sắc; dặn dò nhiệm vụ chuyển tiếp sang bài học mới.`,
          product: 'Bảng tổng kết thi đua cuối cùng của lớp học; ảnh kỷ niệm hoặc lưu bút học tập của tập thể.',
          implementation: {
            assign: 'GV chủ trì lễ tổng kết, thông báo số điểm tích lũy và các danh hiệu thi đua (Nhóm sáng tạo nhất, Nhóm kiên trì nhất, Ngôi sao tiến bộ).',
            execute: 'Đại diện lớp trưởng và học sinh lên nhận phần thưởng tinh thần; cả lớp cùng vỗ tay chúc mừng.',
            discuss: 'Học sinh phát biểu cảm tưởng và cam kết phát huy thành tích trong các bài học sau.',
            conclude: `GV đúc kết giá trị cốt lõi của bài học ${lesson}, cảm ơn sự nỗ lực của học sinh và chính thức khép lại kế hoạch bài dạy.`,
          },
        },
      ];

    case 15:
      return [
        {
          id: `act-p15-1-${timestamp}`,
          code: 'hd4',
          periodIndex: 15,
          periodLabel: 'Tiết 15',
          title: `Tiết 15 - Hoạt động 1: Triển lãm ngày hội sáng tạo khoa học & Giới thiệu giải pháp cộng đồng`,
          subtitle: `Quảng bá sản phẩm học tập tới phụ huynh và cộng đồng nhà trường`,
          durationMinutes: 25,
          objective: `Trình bày sản phẩm dự án trước công chúng; tự tin giải thích nguyên lý khoa học và giá trị ứng dụng thực tiễn của bài ${lesson}.`,
          content: 'Bố trí gian trưng bày sản phẩm khoa học của lớp; đón tiếp khách tham quan và thuyết minh nguyên lý hoạt động.',
          product: 'Gian hàng triển lãm khoa học thu nhỏ và sổ lưu niệm phản hồi của khách tham quan.',
          implementation: {
            assign: 'GV phân công khu vực trưng bày và các nhiệm vụ thuyết minh, đón tiếp.',
            execute: 'Học sinh trang trí gian hàng, thử nghiệm vận hành mô hình và thuyết trình lưu loát.',
            discuss: 'Trao đổi với khách tham quan và giải đáp các thắc mắc chuyên môn.',
            conclude: 'GV đánh giá cao năng lực hòa nhập cộng đồng và tinh thần lan tỏa tri thức khoa học.',
          },
        },
        {
          id: `act-p15-2-${timestamp}`,
          code: 'hd4',
          periodIndex: 15,
          periodLabel: 'Tiết 15',
          title: `Tiết 15 - Hoạt động 2: Tọa đàm định hướng nghiên cứu mở rộng & Tuyên dương thành tích`,
          subtitle: `Phát động phong trào nghiên cứu khoa học kỹ thuật dành cho học sinh trung học (KHKT-VISEF)`,
          durationMinutes: 20,
          objective: `Khơi nguồn ý tưởng cho các đề tài nghiên cứu khoa học kỹ thuật cấp trường/huyện; ghi nhận sự nỗ lực vượt bậc của toàn thể học sinh.`,
          content: 'Gợi mở các hướng phát triển nâng cao từ bài học để tham gia cuộc thi KHKT; trao giải thưởng chung cuộc.',
          product: 'Ý tưởng đề tài nghiên cứu mở rộng được ghi nhận; danh sách khen thưởng toàn diện.',
          implementation: {
            assign: 'GV giới thiệu các cuộc thi sáng tạo KHKT và gợi ý các ý tưởng tiềm năng từ bài học.',
            execute: 'Học sinh ghi lại các ý tưởng ấp ủ và đăng ký nhóm nghiên cứu theo sở thích.',
            discuss: 'Chia sẻ các ý tưởng sáng tạo độc đáo trước lớp.',
            conclude: 'GV khen thưởng và chính thức bế mạc chuyên đề học tập.',
          },
        },
      ];

    default:
      return [
        {
          id: `act-p${periodNumber}-1-${timestamp}`,
          code: 'hd3',
          periodIndex: periodNumber,
          periodLabel: `Tiết ${periodNumber}`,
          title: `Tiết ${periodNumber} - Hoạt động: Thực hành & Nâng cao năng lực chuyên đề`,
          subtitle: `Rèn luyện chuyên sâu các kỹ năng thực nghiệm và giải quyết vấn đề`,
          durationMinutes: 45,
          objective: `Củng cố và vận dụng linh hoạt các kiến thức bài ${lesson} vào các bài toán và tình huống đa dạng.`,
          content: `Thực hiện phiếu nhiệm vụ học tập nâng cao dành cho Tiết ${periodNumber}.`,
          product: `Bài làm thu hoạch của học sinh theo chuyên đề Tiết ${periodNumber}.`,
          implementation: {
            assign: `GV giao nhiệm vụ chuyên sâu Tiết ${periodNumber} cho các nhóm.`,
            execute: 'HS chủ động nghiên cứu và hoàn thành nhiệm vụ.',
            discuss: 'Báo cáo kết quả và thảo luận nhóm.',
            conclude: 'GV nhận xét và đánh giá tiến độ học tập.',
          },
        },
      ];
  }
}

/**
 * Synchronizes the KHBD activities list when the teacher changes the number of teaching periods.
 * - Preserves all existing activities previously drafted or edited.
 * - If periods increased: dynamically appends rich, customized activities for the newly added periods.
 * - Labels all activities with their corresponding teaching period (Tiết 1, Tiết 2, Tiết 3...).
 */
export function synchronizeKhbdActivitiesForPeriods(
  existingKhbd: LessonPlan5512,
  targetPeriods: number,
  curriculum: CurriculumContext
): LessonPlan5512 {
  const currentActivities = [...existingKhbd.activities];

  // 1. Ensure existing activities have period tags
  // Usually, in a 2-period starter plan:
  // Activity 1 (Khởi động) -> Tiết 1
  // Activity 2 (Hình thành kiến thức) -> Tiết 1 / Tiết 2
  // Activity 3 (Luyện tập) -> Tiết 2
  // Activity 4 (Vận dụng) -> Tiết 2
  const updatedExisting = currentActivities.map((act, idx) => {
    if (!act.periodIndex) {
      if (idx === 0) {
        return { ...act, periodIndex: 1, periodLabel: 'Tiết 1' };
      } else if (idx === 1) {
        return { ...act, periodIndex: 1, periodLabel: 'Tiết 1' };
      } else if (idx === 2) {
        return { ...act, periodIndex: 2, periodLabel: 'Tiết 2' };
      } else {
        return { ...act, periodIndex: 2, periodLabel: 'Tiết 2' };
      }
    }
    return act;
  });

  // Calculate highest period index currently in activities
  const maxExistingPeriod = Math.max(
    ...updatedExisting.map((a) => a.periodIndex || 2),
    2
  );

  // If targetPeriods is greater than existing max period, generate new activities for each added period
  let mergedActivities = [...updatedExisting];
  if (targetPeriods > maxExistingPeriod) {
    for (let p = maxExistingPeriod + 1; p <= targetPeriods; p++) {
      const newPeriodActivities = createActivitiesForPeriod(p, curriculum);
      mergedActivities.push(...newPeriodActivities);
    }
  } else if (targetPeriods < maxExistingPeriod) {
    // If user reduced periods, keep activities up to targetPeriods, or retain all if user prefers
    // Pedagogically, we retain activities up to targetPeriods, but if it has at least 1 activity per remaining period
    const filtered = mergedActivities.filter((a) => (a.periodIndex || 1) <= targetPeriods);
    if (filtered.length >= 2) {
      mergedActivities = filtered;
    }
  }

  return {
    ...existingKhbd,
    activities: mergedActivities,
  };
}
