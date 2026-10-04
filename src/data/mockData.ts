import { CurriculumContext, LessonPlan5512, SlideItem, MatrixTopic7991, ExamQuestion } from '../types/edtech';
import { 
  KHTN_6_CURRICULUM, 
  KHTN_7_CURRICULUM, 
  KHTN_8_CURRICULUM, 
  KHTN_9_CURRICULUM, 
  ALL_TEXTBOOKS,
  KHTN_PRESETS 
} from './knttCurriculum';

export { 
  KHTN_6_CURRICULUM, 
  KHTN_7_CURRICULUM, 
  KHTN_8_CURRICULUM, 
  KHTN_9_CURRICULUM, 
  ALL_TEXTBOOKS, 
  KHTN_PRESETS 
};

export const INITIAL_CURRICULUM: CurriculumContext = {
  subject: 'Khoa học tự nhiên',
  grade: 'Lớp 7',
  bookSeries: 'Kết Nối Tri Thức',
  lessonTitle: 'Bài 22. Quang hợp ở thực vật (Phương trình quang hợp)',
  chapterTitle: 'Chương VII: Trao đổi chất và chuyển hoá năng lượng ở sinh vật',
  duration: '2 tiết (90 phút)',
  schoolName: 'THCS Chu Văn An',
  teacherName: 'Cô Lê Thị Thanh Thảo',
};

export const SUBJECT_OPTIONS = [
  'Khoa học tự nhiên',
  'Toán học',
  'Vật lí',
  'Hóa học',
  'Sinh học',
  'Ngữ văn',
  'Lịch sử',
  'Địa lí',
  'Tin học',
  'Tiếng Anh',
];

export const GRADE_OPTIONS = [
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
  'Lớp 9',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
];

export const BOOK_SERIES_OPTIONS = [
  'Kết Nối Tri Thức',
  'Cánh Diều',
  'Chân Trời Sáng Tạo',
];

// Helper to get lessons by grade and book series
export function getAvailableLessonsForCurriculum(subject: string, grade: string, bookSeries: string): string[] {
  if (subject === 'Khoa học tự nhiên' && bookSeries === 'Kết Nối Tri Thức') {
    if (grade === 'Lớp 6') {
      return KHTN_6_CURRICULUM.chapters.flatMap((c) => c.lessons.map((l) => `${l.lessonTitle} (${c.chapterNumber})`));
    }
    if (grade === 'Lớp 7') {
      return KHTN_7_CURRICULUM.chapters.flatMap((c) => c.lessons.map((l) => `${l.lessonTitle} (${c.chapterNumber})`));
    }
    if (grade === 'Lớp 8') {
      return KHTN_8_CURRICULUM.chapters.flatMap((c) => c.lessons.map((l) => `${l.lessonTitle} (${c.chapterNumber})`));
    }
    if (grade === 'Lớp 9') {
      return KHTN_9_CURRICULUM.chapters.flatMap((c) => c.lessons.map((l) => `${l.lessonTitle} (${c.chapterNumber})`));
    }
  }

  // Fallback defaults for other subjects/grades
  if (bookSeries === 'Cánh Diều') {
    return [
      'Bài 2: Cấp số cộng - Số hạng tổng quát và tính chất',
      'Bài 3: Cấp số nhân - Công thức và mô hình hóa',
      'Bài 5: Giới hạn của dãy số và chuỗi số',
      'Bài 9: Đường thẳng và mặt phẳng song song',
    ];
  }
  if (bookSeries === 'Chân Trời Sáng Tạo') {
    return [
      'Bài 2: Dãy số và quy luật số học - Cấp số cộng',
      'Bài 3: Cấp số nhân và bài toán tài chính ngân hàng',
      'Bài 6: Hàm số liên tục và định lí giá trị trung gian',
      'Bài 11: Góc giữa hai mặt phẳng và khoảng cách hình học',
    ];
  }

  return [
    'Bài 22. Quang hợp ở thực vật (Phương trình quang hợp)',
    'Bài 13. Khối lượng riêng (D = m/V)',
    'Bài 5. Khúc xạ ánh sáng (Định luật khúc xạ, chiết suất)',
    'Bài 6: Cấp số cộng và định lí số hạng tổng quát',
    'Bài 18. Tế bào - Đơn vị cơ bản của sự sống',
  ];
}

// Default initial module data
export const INITIAL_KHBD_5512: LessonPlan5512 = KHTN_PRESETS['khtn7_b22'].khbd;
export const INITIAL_SLIDES: SlideItem[] = KHTN_PRESETS['khtn7_b22'].slides;
export const INITIAL_7991_MATRIX: MatrixTopic7991[] = KHTN_PRESETS['khtn7_b22'].matrix;
export const INITIAL_7991_QUESTIONS: ExamQuestion[] = KHTN_PRESETS['khtn7_b22'].questions;
