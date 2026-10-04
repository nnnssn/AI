/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { SplitPane } from './components/SplitPane';
import { KHBD5512Module } from './components/modules/KHBD5512Module';
import { SlideShowModule } from './components/modules/SlideShowModule';
import { ExamBank7991Module } from './components/modules/ExamBank7991Module';
import { ExportSourceModal } from './components/ExportSourceModal';
import { CurriculumBrowserModal } from './components/CurriculumBrowserModal';
import { TeacherInfoModal, TEACHER_INFO_STORAGE_KEY, SavedTeacherInfo } from './components/TeacherInfoModal';
import { 
  AppMode, 
  CurriculumContext, 
  LessonPlan5512, 
  SlideItem, 
  MatrixTopic7991, 
  ExamQuestion,
  GradeLevel,
  Subject
} from './types/edtech';
import { 
  INITIAL_CURRICULUM, 
  INITIAL_KHBD_5512, 
  INITIAL_SLIDES, 
  INITIAL_7991_MATRIX, 
  INITIAL_7991_QUESTIONS,
  KHTN_PRESETS
} from './data/mockData';
import { convertKhbdToSlides } from './utils/khbdToSlides';
import { ensurePeriodsSynchronized, parsePeriodsFromDuration } from './utils/periodValidator';

export default function App() {
  // 1. Core Shell State (with LocalStorage initialization for teacher profile)
  const [curriculum, setCurriculum] = useState<CurriculumContext>(() => {
    try {
      const saved = localStorage.getItem(TEACHER_INFO_STORAGE_KEY);
      if (saved) {
        const parsed: SavedTeacherInfo = JSON.parse(saved);
        return {
          ...INITIAL_CURRICULUM,
          teacherName: parsed.teacherName || INITIAL_CURRICULUM.teacherName,
          schoolName: parsed.schoolName || INITIAL_CURRICULUM.schoolName,
          duration: parsed.duration || INITIAL_CURRICULUM.duration,
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu giáo viên từ LocalStorage:', e);
    }
    return INITIAL_CURRICULUM;
  });

  const [currentMode, setCurrentMode] = useState<AppMode>('khbd_5512');
  const [splitRatio, setSplitRatio] = useState<number>(45);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  // 2. Sub-module Navigation State
  const [active5512Section, setActive5512Section] = useState<string>('period_1');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [active7991Tab, setActive7991Tab] = useState<'matrix' | 'spec' | 'questions'>('matrix');

  // 3. Module Data Models with Period Synchronization
  const [khbd, setKhbd] = useState<LessonPlan5512>(() => {
    const pCount = parsePeriodsFromDuration(INITIAL_CURRICULUM.duration) || 2;
    return ensurePeriodsSynchronized(
      INITIAL_KHBD_5512,
      pCount,
      INITIAL_CURRICULUM.lessonTitle,
      INITIAL_CURRICULUM.grade,
      INITIAL_CURRICULUM.subject
    );
  });
  const [slides, setSlides] = useState<SlideItem[]>(INITIAL_SLIDES);
  const [matrix7991, setMatrix7991] = useState<MatrixTopic7991[]>(INITIAL_7991_MATRIX);
  const [questions7991, setQuestions7991] = useState<ExamQuestion[]>(INITIAL_7991_QUESTIONS);

  // Scope 3 Handler: Chuyển Đổi Nhanh KHBD Thành Slide
  const handleConvertToSlides = () => {
    const generatedSlides = convertKhbdToSlides(khbd, curriculum);
    setSlides(generatedSlides);
    setActiveSlideIndex(0);
    setCurrentMode('slide_presentation');
  };

  // Handle lesson selection from textbook browser
  const handleSelectTextbookLesson = (grade: GradeLevel, lessonTitle: string, chapterTitle: string) => {
    setCurriculum((prev) => ({
      ...prev,
      subject: 'Khoa học tự nhiên',
      grade: grade,
      bookSeries: 'Kết Nối Tri Thức',
      lessonTitle: lessonTitle,
      chapterTitle: chapterTitle,
    }));

    // Check if we have an explicit preset
    let targetPreset = null;
    if (lessonTitle.includes('Bài 22') || lessonTitle.includes('Quang hợp')) {
      targetPreset = KHTN_PRESETS['khtn7_b22'];
    } else if (lessonTitle.includes('Bài 13') || lessonTitle.includes('Khối lượng riêng')) {
      targetPreset = KHTN_PRESETS['khtn8_b13'];
    } else if (lessonTitle.includes('Bài 5') || lessonTitle.includes('Khúc xạ')) {
      targetPreset = KHTN_PRESETS['khtn9_b5'];
    }

    const currentPeriodCount = parsePeriodsFromDuration(curriculum.duration) || 2;

    if (targetPreset) {
      setKhbd(ensurePeriodsSynchronized(targetPreset.khbd, currentPeriodCount, lessonTitle, grade, 'Khoa học tự nhiên'));
      setSlides(targetPreset.slides);
      setMatrix7991(targetPreset.matrix);
      setQuestions7991(targetPreset.questions);
    } else {
      // Dynamically generate tailored 5512 lesson plan & slides
      const baseGeneratedKhbd: LessonPlan5512 = {
        objectives: {
          knowledge: [
            `Nêu được các khái niệm và hiện tượng cơ bản trong ${lessonTitle}.`,
            `Thực hiện được thí nghiệm quan sát hoặc giải thích các hiện tượng thực tế theo chuẩn SGK KHTN ${grade}.`,
            `Vận dụng kiến thức bài học để giải quyết vấn đề đời sống và bảo vệ môi trường.`,
          ],
          coreCompetencies: [
            'Năng lực tự chủ và tự học: Tìm hiểu thông tin, hình ảnh và thí nghiệm trong sách giáo khoa.',
            'Năng lực giao tiếp và hợp tác: Làm việc nhóm, thảo luận và báo cáo kết quả trước lớp.',
            'Năng lực giải quyết vấn đề và sáng tạo: Đề xuất phương án thực nghiệm và giải thích hiện tượng.',
          ],
          domainCompetencies: [
            `Nhận thức khoa học tự nhiên về ${lessonTitle}.`,
            'Tìm hiểu tự nhiên thông qua quan sát, thu thập dữ liệu và xử lí thông tin thực nghiệm.',
            'Vận dụng kiến thức, kĩ năng đã học vào thực tiễn gia đình và nhà trường.',
          ],
          qualities: [
            'Chăm chỉ: Tích cực hoàn thành nhiệm vụ trong phiếu học tập cá nhân.',
            'Trung thực: Khách quan, trung thực trong thu thập và báo cáo số liệu thí nghiệm.',
            'Trách nhiệm: Có ý thức bảo vệ môi trường sống, an toàn phòng thí nghiệm.',
          ],
        },
        equipment: {
          teacher: [
            `Sách giáo khoa Khoa học tự nhiên ${grade} (Kết Nối Tri Thức Với Cuộc Sống).`,
            `Dụng cụ thí nghiệm và tranh ảnh trực quan theo ${lessonTitle}.`,
            'Slide bài giảng điện tử và phiếu học tập số 1, 2.',
          ],
          student: [
            `Sách giáo khoa KHTN ${grade}, vở ghi bài.`,
            'Dụng cụ học tập, bút dạ và bảng nhóm A3.',
          ],
        },
        activities: [
          {
            id: `act-${Date.now()}-1`,
            code: 'hd1',
            title: 'Hoạt động 1: Mở đầu / Khởi động',
            subtitle: 'Tạo tình huống có vấn đề thực tiễn',
            durationMinutes: 10,
            objective: `Khơi gợi hứng thú, liên hệ thực tế dẫn dắt vào ${lessonTitle}.`,
            content: `Quan sát hình ảnh mở đầu trong SGK trang tương ứng và trả lời câu hỏi gợi mở của giáo viên.`,
            product: 'Câu trả lời dự đoán ban đầu của học sinh.',
            implementation: {
              assign: 'GV nêu câu hỏi tình huống thực tế, yêu cầu HS thảo luận cặp đôi 3 phút.',
              execute: 'HS suy nghĩ, trao đổi nhanh với bạn cùng bàn.',
              discuss: 'Mời đại diện 2 cặp đôi phát biểu, các bạn khác bổ sung.',
              conclude: 'GV nhận xét và dẫn dắt vào bài mới.',
            },
          },
          {
            id: `act-${Date.now()}-2`,
            code: 'hd2',
            title: 'Hoạt động 2: Hình thành kiến thức mới',
            subtitle: 'Nghiên cứu tài liệu SGK và làm thí nghiệm khám phá',
            durationMinutes: 40,
            objective: `Nắm vững các khái niệm, quy luật và cấu trúc chính trong ${lessonTitle}.`,
            content: 'Nhiệm vụ 1: Đọc SGK mục I và II. Nhiệm vụ 2: Thảo luận nhóm hoàn thành bảng kết quả.',
            product: 'Bảng thu hoạch của nhóm và kết luận khoa học.',
            implementation: {
              assign: 'Chia 4 nhóm, phát phiếu học tập và giao nhiệm vụ cụ thể.',
              execute: 'Các nhóm nghiên cứu SGK, làm thí nghiệm hoặc phân tích sơ đồ.',
              discuss: 'Đại diện nhóm báo cáo, nhóm khác phản biện.',
              conclude: 'GV chuẩn hóa kiến thức trọng tâm lên bảng chính.',
            },
          },
          {
            id: `act-${Date.now()}-3`,
            code: 'hd3',
            title: 'Hoạt động 3: Luyện tập',
            subtitle: 'Giải bài tập và củng cố kĩ năng',
            durationMinutes: 25,
            objective: 'Rèn luyện kĩ năng giải bài tập trắc nghiệm và tự luận chuẩn mực.',
            content: 'Làm các câu hỏi trong mục "Câu hỏi và bài tập" của SGK.',
            product: 'Bài làm trong vở ghi của học sinh.',
            implementation: {
              assign: 'Giao bài tập cá nhân trong 7 phút.',
              execute: 'HS độc lập suy nghĩ và làm bài.',
              discuss: 'Gọi HS lên bảng giải, nhận xét đối chiếu.',
              conclude: 'GV phân tích lỗi sai và tổng kết phương pháp.',
            },
          },
          {
            id: `act-${Date.now()}-4`,
            code: 'hd4',
            title: 'Hoạt động 4: Vận dụng',
            subtitle: 'Giải quyết vấn đề thực tế liên môn và đời sống',
            durationMinutes: 15,
            objective: `Vận dụng kiến thức ${lessonTitle} vào đời sống gia đình và cộng đồng.`,
            content: 'Tìm hiểu mục "Em có thể" và đề xuất giải pháp thực tế.',
            product: 'Bản báo cáo ngắn hoặc sản phẩm ứng dụng của học sinh.',
            implementation: {
              assign: 'GV nêu nhiệm vụ thực tiễn và giao bài về nhà.',
              execute: 'HS liên hệ thực tế cuộc sống.',
              discuss: 'Chia sẻ nhanh các ý tưởng sáng tạo.',
              conclude: 'GV tổng kết giờ học và dặn dò bài sau.',
            },
          },
        ],
      };

      setKhbd(
        ensurePeriodsSynchronized(
          baseGeneratedKhbd,
          currentPeriodCount,
          lessonTitle,
          grade,
          'Khoa học tự nhiên'
        )
      );

      // Tailored slides
      setSlides([
        {
          id: `sl-${Date.now()}-1`,
          slideNumber: 1,
          title: lessonTitle.toUpperCase(),
          subtitle: `Môn Khoa học tự nhiên ${grade} · Kết Nối Tri Thức Với Cuộc Sống`,
          type: 'title',
          badge: chapterTitle || 'GDPT 2018',
          bullets: [
            `Bộ môn: Khoa học tự nhiên ${grade}`,
            'Quy chuẩn: Công văn 5512/BGDĐT-GDTrH Bộ Giáo dục & Đào tạo',
            'Học liệu: Sách giáo khoa Kết Nối Tri Thức, dụng cụ thực hành',
          ],
          notes: `Chào cả lớp, hôm nay chúng ta sẽ cùng khám phá ${lessonTitle}.`,
        },
        {
          id: `sl-${Date.now()}-2`,
          slideNumber: 2,
          title: '1. KHỞI ĐỘNG & TÌNH HUỐNG THỰC TẾ',
          subtitle: 'Quan sát và phát hiện vấn đề khoa học',
          type: 'interactive_activity',
          badge: 'Khám phá 5512',
          bullets: [
            'Quan sát hiện tượng thực tế xung quanh đời sống.',
            'Đặt câu hỏi: Tại sao lại xảy ra hiện tượng như vậy?',
            'Dự đoán và đề xuất giả thuyết khoa học.',
          ],
          callout: 'Quy luật tự nhiên luôn bắt đầu từ những quan sát tinh tế!',
          notes: 'Dành 3 phút cho học sinh trao đổi cặp đôi phát hiện vấn đề.',
        },
        {
          id: `sl-${Date.now()}-3`,
          slideNumber: 3,
          title: '2. KIẾN THỨC TRỌNG TÂM',
          subtitle: 'Quy chuẩn kiến thức SGK Kết Nối Tri Thức',
          type: 'concept',
          badge: 'Kiến thức cốt lõi',
          bullets: [
            `Khái niệm và định luật cơ bản của ${lessonTitle}.`,
            'Cấu tạo, tính chất và các đại lượng đặc trưng.',
            'Mối quan hệ nhân quả và sơ đồ biến đổi khoa học.',
          ],
          notes: 'Giảng viên phân tích chi tiết các định nghĩa và công thức.',
        },
        {
          id: `sl-${Date.now()}-4`,
          slideNumber: 4,
          title: '3. TỔNG KẾT & VẬN DỤNG ĐỜI SỐNG',
          subtitle: 'Mục "Em có thể" & Hướng dẫn tự học',
          type: 'summary',
          badge: 'Vận dụng 5512',
          bullets: [
            'Ghi nhớ các từ khóa và kết luận cốt lõi của bài học.',
            'Ứng dụng vào bảo vệ sức khỏe, môi trường và sản xuất.',
            'Nhiệm vụ về nhà: Hoàn thành bài tập SGK và chuẩn bị bài tiếp theo.',
          ],
          callout: 'Khoa học tự nhiên gắn liền với cuộc sống!',
          notes: 'Nhắc học sinh chuẩn bị mẫu vật cho bài học kế tiếp.',
        },
      ]);

      // Tailored exam matrix
      setMatrix7991([
        {
          id: `mat-${Date.now()}-1`,
          topicName: chapterTitle || `Khoa học tự nhiên ${grade}`,
          subTopic: lessonTitle,
          competenciesReq: 'Nhận biết khái niệm, giải thích hiện tượng và vận dụng kiến thức bài học.',
          multipleChoice: { know: 3, understand: 2, apply: 1 },
          trueFalse: { know: 1, understand: 1, apply: 0 },
          shortAnswer: { know: 0, understand: 1, apply: 1 },
          essay: { know: 0, understand: 1, apply: 1 },
        },
      ]);
    }
    setActiveSlideIndex(0);
  };

  // Helper for pane titles
  const getLeftPaneTitle = () => {
    switch (currentMode) {
      case 'khbd_5512':
        return `Soạn KHBD 5512: ${curriculum.lessonTitle}`;
      case 'slide_presentation':
        return `Thiết kế Slide: ${curriculum.lessonTitle}`;
      case 'exam_bank_7991':
        return `Ma trận & Đề thi 7991: ${curriculum.subject} ${curriculum.grade}`;
    }
  };

  const getRightPaneTitle = () => {
    switch (currentMode) {
      case 'khbd_5512':
        return 'Văn bản Kế hoạch bài dạy chuẩn A4 (Phụ lục IV CV 5512)';
      case 'slide_presentation':
        return 'Khung trình chiếu Slide 16:9 tương tác (Fullscreen / Timer)';
      case 'exam_bank_7991':
        return 'Xem trước Đề kiểm tra định kì & Biểu điểm (CV 7991)';
    }
  };

  // Teacher Profile update handler (with LocalStorage sync and period synchronization)
  const handleSaveTeacherInfo = (updated: { teacherName: string; schoolName: string; duration: string }) => {
    setCurriculum((prev) => ({
      ...prev,
      teacherName: updated.teacherName,
      schoolName: updated.schoolName,
      duration: updated.duration,
    }));
    const newPeriodCount = parsePeriodsFromDuration(updated.duration);
    setKhbd((prev) =>
      ensurePeriodsSynchronized(
        prev,
        newPeriodCount,
        curriculum.lessonTitle,
        curriculum.grade,
        curriculum.subject
      )
    );
  };

  // Quick period change from KHBD module
  const handleDurationChange = (newDurationStr: string) => {
    setCurriculum((prev) => ({
      ...prev,
      duration: newDurationStr,
    }));
    const newPeriodCount = parsePeriodsFromDuration(newDurationStr);
    setKhbd((prev) =>
      ensurePeriodsSynchronized(
        prev,
        newPeriodCount,
        curriculum.lessonTitle,
        curriculum.grade,
        curriculum.subject
      )
    );
  };

  // Render left content based on active mode
  const renderLeftPane = () => {
    switch (currentMode) {
      case 'khbd_5512':
        return (
          <KHBD5512Module
            khbd={khbd}
            onKhbdChange={setKhbd}
            curriculum={curriculum}
            activeSection={active5512Section}
            isRightPane={false}
            onConvertToSlides={handleConvertToSlides}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
            onDurationChange={handleDurationChange}
            onSectionSelect={setActive5512Section}
          />
        );
      case 'slide_presentation':
        return (
          <SlideShowModule
            slides={slides}
            onSlidesChange={setSlides}
            activeSlideIndex={activeSlideIndex}
            onSlideSelect={setActiveSlideIndex}
            curriculum={curriculum}
            isRightPane={false}
            onConvertToSlides={handleConvertToSlides}
          />
        );
      case 'exam_bank_7991':
        return (
          <ExamBank7991Module
            matrix={matrix7991}
            onMatrixChange={setMatrix7991}
            questions={questions7991}
            onQuestionsChange={setQuestions7991}
            curriculum={curriculum}
            activeTab={active7991Tab}
            onTabChange={setActive7991Tab}
            isRightPane={false}
          />
        );
    }
  };

  // Render right content based on active mode
  const renderRightPane = () => {
    switch (currentMode) {
      case 'khbd_5512':
        return (
          <KHBD5512Module
            khbd={khbd}
            onKhbdChange={setKhbd}
            curriculum={curriculum}
            activeSection={active5512Section}
            isRightPane={true}
            onConvertToSlides={handleConvertToSlides}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
            onDurationChange={handleDurationChange}
            onSectionSelect={setActive5512Section}
          />
        );
      case 'slide_presentation':
        return (
          <SlideShowModule
            slides={slides}
            onSlidesChange={setSlides}
            activeSlideIndex={activeSlideIndex}
            onSlideSelect={setActiveSlideIndex}
            curriculum={curriculum}
            isRightPane={true}
            onConvertToSlides={handleConvertToSlides}
          />
        );
      case 'exam_bank_7991':
        return (
          <ExamBank7991Module
            matrix={matrix7991}
            onMatrixChange={setMatrix7991}
            questions={questions7991}
            onQuestionsChange={setQuestions7991}
            curriculum={curriculum}
            activeTab={active7991Tab}
            onTabChange={setActive7991Tab}
            isRightPane={true}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100 font-sans text-slate-800 print:h-auto print:w-auto print:overflow-visible print:bg-white">
      {/* 1. Topbar */}
      <Topbar
        curriculum={curriculum}
        onCurriculumChange={(updates) => setCurriculum((prev) => ({ ...prev, ...updates }))}
        splitRatio={splitRatio}
        onSplitRatioChange={setSplitRatio}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        onOpenCurriculumModal={() => setIsCurriculumModalOpen(true)}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onPrint={() => window.print()}
        onConvertToSlides={handleConvertToSlides}
        khbd={khbd}
      />

      {/* 2. Main Workspace: Sidebar + SplitPane */}
      <div className="flex-1 flex overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Sidebar */}
        <Sidebar
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          curriculum={curriculum}
          onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
          active5512Section={active5512Section}
          on5512SectionChange={setActive5512Section}
          activeSlideIndex={activeSlideIndex}
          onSlideSelect={setActiveSlideIndex}
          totalSlides={slides.length}
          active7991Tab={active7991Tab}
          on7991TabChange={setActive7991Tab}
        />

        {/* Split-Pane Container */}
        <SplitPane
          splitRatio={splitRatio}
          onSplitRatioChange={setSplitRatio}
          leftTitle={getLeftPaneTitle()}
          rightTitle={getRightPaneTitle()}
          leftPane={renderLeftPane()}
          rightPane={renderRightPane()}
        />
      </div>

      {/* 3. Export Modal for Single-file HTML + Tailwind + Alpine.js */}
      <ExportSourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />

      {/* 4. Curriculum Library Browser Modal for KHTN 6, 7, 8, 9 */}
      <CurriculumBrowserModal
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        currentGrade={curriculum.grade}
        onSelectLesson={handleSelectTextbookLesson}
      />

      {/* 5. Teacher Profile & Duration Configuration Modal */}
      <TeacherInfoModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        curriculum={curriculum}
        onSave={handleSaveTeacherInfo}
      />
    </div>
  );
}
