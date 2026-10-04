export type BookSeries = 'Cánh Diều' | 'Kết Nối Tri Thức' | 'Chân Trời Sáng Tạo';

export type Subject = 
  | 'Khoa học tự nhiên'
  | 'Toán học'
  | 'Vật lí'
  | 'Hóa học'
  | 'Sinh học'
  | 'Ngữ văn'
  | 'Lịch sử'
  | 'Địa lí'
  | 'Tin học'
  | 'Tiếng Anh';

export type GradeLevel = 'Lớp 6' | 'Lớp 7' | 'Lớp 8' | 'Lớp 9' | 'Lớp 10' | 'Lớp 11' | 'Lớp 12';

export type AppMode = 'khbd_5512' | 'slide_presentation' | 'exam_bank_7991';

export interface CurriculumContext {
  subject: Subject;
  grade: GradeLevel;
  bookSeries: BookSeries;
  lessonTitle: string;
  chapterTitle?: string;
  duration: string;
  schoolName: string;
  teacherName: string;
}

export interface TextbookChapter {
  chapterNumber: string;
  chapterTitle: string;
  lessons: {
    lessonNumber: number;
    lessonTitle: string;
    page: number;
    subtopics?: string[];
  }[];
}

export interface TextbookCurriculumData {
  grade: GradeLevel;
  subject: Subject;
  bookSeries: BookSeries;
  bookTitle: string;
  publisher: string;
  chiefAuthor: string;
  chapters: TextbookChapter[];
}

// KHBD 5512 Types
export interface Activity5512 {
  id: string;
  code: 'hd1' | 'hd2' | 'hd3' | 'hd4' | string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  objective: string;
  content: string;
  product: string;
  implementation: {
    assign: string;      // Giao nhiệm vụ
    execute: string;     // Thực hiện nhiệm vụ
    discuss: string;     // Báo cáo, thảo luận
    conclude: string;    // Kết luận, nhận định
  };
}

export interface LessonPeriodPlan {
  periodNumber: number; // 1 | 2 | 3 | 4 | 5 (TỐI ĐA 5 TIẾT)
  periodTitle: string;  // Tiêu đề tiết học
  durationMinutes: number; // Thường là 45 phút
  objective: string;    // Mục tiêu trọng tâm của riêng tiết này
  activities: Activity5512[]; // Các hoạt động tiến trình trong tiết
  notes?: string;       // Dặn dò / Chuẩn bị tiết tiếp theo
}

export interface LessonPlan5512 {
  objectives: {
    knowledge: string[];
    coreCompetencies: string[];      // Năng lực chung: tự chủ, giao tiếp, sáng tạo
    domainCompetencies: string[];    // Năng lực đặc thù môn học
    qualities: string[];             // Phẩm chất: yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm
  };
  equipment: {
    teacher: string[];
    student: string[];
  };
  activities: Activity5512[];
  periodsCount?: number;            // Số tiết dạy (từ 1 đến 5 tiết)
  periods?: LessonPeriodPlan[];     // Danh sách các tiết từ Tiết 1 đến Tiết 5
}

// Slide Presentation Types
export interface SlideItem {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  type: 'title' | 'concept' | 'interactive_activity' | 'exercise' | 'summary';
  bullets: string[];
  callout?: string;
  notes: string;
  badge?: string;
}

// Exam Bank 7991 Types (CV 7991/BGDĐT-GDTrH)
export interface MatrixTopic7991 {
  id: string;
  topicName: string;
  subTopic: string;
  competenciesReq: string;
  // TNKQ Nhiều lựa chọn (30% điểm ~ 3.0 điểm)
  multipleChoice: {
    know: number;        // Biết
    understand: number;  // Hiểu
    apply: number;       // Vận dụng
  };
  // TNKQ Đúng - Sai (20% điểm ~ 2.0 điểm, mỗi câu 4 ý a,b,c,d)
  trueFalse: {
    know: number;
    understand: number;
    apply: number;
  };
  // TNKQ Trả lời ngắn (20% điểm ~ 2.0 điểm)
  shortAnswer: {
    know: number;
    understand: number;
    apply: number;
  };
  // Tự luận (30% điểm ~ 3.0 điểm)
  essay: {
    know: number;
    understand: number;
    apply: number;
  };
}

export interface ExamQuestion {
  id: string;
  type: 'mc' | 'tf' | 'sa' | 'essay';
  typeLabel: string;
  number: number;
  score: number;
  level: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng';
  content: string;
  options?: string[]; // for mc
  tfItems?: { letter: string; statement: string; isCorrect: boolean }[]; // for tf
  correctAnswer?: string;
  explanation?: string;
}
