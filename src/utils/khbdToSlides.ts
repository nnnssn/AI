import { LessonPlan5512, CurriculumContext, SlideItem } from '../types/edtech';

/**
 * Converts a standardized KHBD 5512 lesson plan into a professional 16:9 slide deck
 * with knowledge visualization cards, pedagogical stages, and presenter notes.
 */
export function convertKhbdToSlides(khbd: LessonPlan5512, curriculum: CurriculumContext): SlideItem[] {
  const slides: SlideItem[] = [];
  let slideNo = 1;

  // 1. Slide Bìa mở đầu (Title slide)
  slides.push({
    id: `slide-title-${Date.now()}`,
    slideNumber: slideNo++,
    title: curriculum.lessonTitle.toUpperCase(),
    subtitle: `${curriculum.subject} ${curriculum.grade} · Bộ sách: ${curriculum.bookSeries}`,
    type: 'title',
    badge: 'Kế hoạch bài dạy chuẩn CV 5512',
    bullets: [
      `Thời lượng giảng dạy: ${curriculum.duration}`,
      `Đơn vị: ${curriculum.schoolName}`,
      `Giáo viên thực hiện: ${curriculum.teacherName}`,
    ],
    callout: 'Ứng dụng dạy học phát triển phẩm chất và năng lực học sinh theo chương trình GDPT 2018',
    notes: `Kính chào quý thầy cô và các em học sinh. Hôm nay chúng ta cùng bắt đầu bài học: ${curriculum.lessonTitle}. Chuẩn bị sách giáo khoa và vở ghi bài.`,
  });

  // 2. Slide Mục tiêu bài học (Objectives Overview)
  slides.push({
    id: `slide-obj-${Date.now()}`,
    slideNumber: slideNo++,
    title: 'MỤC TIÊU VÀ YÊU CẦU CẦN ĐẠT',
    subtitle: 'Chuẩn hóa theo Công văn 5512/BGDĐT-GDTrH',
    type: 'concept',
    badge: 'Mục tiêu GDPT 2018',
    bullets: [
      `Kiến thức: ${khbd.objectives.knowledge.slice(0, 2).join('; ') || 'Nắm vững kiến thức trọng tâm SGK'}`,
      `Năng lực: ${khbd.objectives.domainCompetencies[0] || 'Phát triển năng lực tìm hiểu và vận dụng tự nhiên'}`,
      `Phẩm chất: ${khbd.objectives.qualities.slice(0, 2).join('; ') || 'Chăm chỉ, trung thực, trách nhiệm'}`,
    ],
    callout: 'Đích đến sau giờ học: Tự chủ khám phá kiến thức và giải quyết bài toán thực tế.',
    notes: 'Giáo viên giới thiệu nhanh mục tiêu bài học để học sinh chủ động định hướng nhiệm vụ học tập của mình.',
  });

  // 3. Slides cho từng Hoạt động sư phạm (Hoạt động 1 -> 4)
  khbd.activities.forEach((act) => {
    let badgeText = 'Khởi động';
    let type: SlideItem['type'] = 'concept';

    if (act.code === 'hd1') {
      badgeText = 'Hoạt động 1 · Mở đầu';
      type = 'interactive_activity';
    } else if (act.code === 'hd2') {
      badgeText = 'Hoạt động 2 · Hình thành kiến thức mới';
      type = 'concept';
    } else if (act.code === 'hd3') {
      badgeText = 'Hoạt động 3 · Luyện tập';
      type = 'exercise';
    } else if (act.code === 'hd4') {
      badgeText = 'Hoạt động 4 · Vận dụng';
      type = 'summary';
    }

    slides.push({
      id: `slide-act-${act.code}-${Date.now()}`,
      slideNumber: slideNo++,
      title: act.title.toUpperCase(),
      subtitle: act.subtitle || `Thời lượng: ${act.durationMinutes} phút`,
      type: type,
      badge: badgeText,
      bullets: [
        `Mục tiêu: ${act.objective}`,
        `Nhiệm vụ: ${act.content}`,
        `Sản phẩm yêu cầu: ${act.product}`,
      ],
      callout: `Tổ chức: ${act.implementation.assign.slice(0, 100)}...`,
      notes: `Tiến trình 4 bước CV 5512:
1. Giao việc: ${act.implementation.assign}
2. Thực hiện: ${act.implementation.execute}
3. Thảo luận: ${act.implementation.discuss}
4. Kết luận: ${act.implementation.conclude}`,
    });
  });

  // 4. Slide Tổng kết & Dặn dò tự học (Summary & Next steps)
  slides.push({
    id: `slide-summary-${Date.now()}`,
    slideNumber: slideNo++,
    title: 'TỔNG KẾT & HƯỚNG DẪN TỰ HỌC',
    subtitle: 'Củng cố kiến thức và chuẩn bị bài học tiếp theo',
    type: 'summary',
    badge: 'Kết luận bài học',
    bullets: [
      'Ghi nhớ các khái niệm cốt lõi, công thức và sơ đồ vừa học.',
      'Hoàn thành bài tập tự luyện trong SGK và phiếu học tập.',
      'Chuẩn bị thiết bị và nghiên cứu trước tài liệu cho bài học kế tiếp.',
    ],
    callout: 'Chúc các em học tập hiệu quả và luôn say mê khám phá tri thức!',
    notes: 'Giáo viên đánh giá tinh thần học tập của các nhóm, ghi nhận điểm cộng và dặn dò bài tập về nhà.',
  });

  return slides;
}
