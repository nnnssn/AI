import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles,
  Layers,
  MessageSquareQuote,
  Presentation,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Eye,
  Tv
} from 'lucide-react';
import { SlideItem, CurriculumContext } from '../../types/edtech';

interface SlideShowModuleProps {
  slides: SlideItem[];
  onSlidesChange: (updated: SlideItem[]) => void;
  activeSlideIndex: number;
  onSlideSelect: (idx: number) => void;
  curriculum: CurriculumContext;
  isRightPane?: boolean;
  onConvertToSlides?: () => void;
}

export const SlideShowModule: React.FC<SlideShowModuleProps> = ({
  slides,
  onSlidesChange,
  activeSlideIndex,
  onSlideSelect,
  curriculum,
  isRightPane = false,
  onConvertToSlides,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showNotesInFullscreen, setShowNotesInFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[activeSlideIndex] || slides[0] || {
    id: 'empty',
    slideNumber: 1,
    title: 'CHƯA CÓ SLIDE',
    type: 'title',
    bullets: [],
    notes: '',
  };

  // Lecture timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation for presentation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (activeSlideIndex < slides.length - 1) {
          onSlideSelect(activeSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (activeSlideIndex > 0) {
          onSlideSelect(activeSlideIndex - 1);
        }
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlideIndex, slides.length, onSlideSelect, isFullscreen]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // LEFT PANE: QUẢN LÝ SLIDE & BIÊN TẬP NỘI DUNG
  // ----------------------------------------------------
  if (!isRightPane) {
    return (
      <div className="p-4 space-y-4 text-xs">
        {/* Banner with Quick Convert Button */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200/80 rounded-xl p-3.5 text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <Presentation className="w-4 h-4 text-indigo-600" />
              <span>Slide Bài Giảng 16:9</span>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-mono font-semibold px-2 py-0.5 rounded">
              {slides.length} slides
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Thiết kế bài giảng tương tác chuẩn 16:9 với thẻ trực quan hóa kiến thức, tích hợp trực tiếp từ KHBD 5512.
          </p>

          {/* Scope 3 Main Requirement Button */}
          {onConvertToSlides && (
            <button
              onClick={onConvertToSlides}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-3 rounded-lg shadow-sm transition-all transform hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chuyển Đổi Nhanh KHBD Thành Slide</span>
            </button>
          )}
        </div>

        {/* Slide Filmstrip / List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Danh sách Slide ({slides.length})</span>
            <button
              onClick={() => {
                const newSlide: SlideItem = {
                  id: `slide-${Date.now()}`,
                  slideNumber: slides.length + 1,
                  title: 'NỘI DUNG BỔ TRỢ MỚI',
                  subtitle: 'Hoạt động học tập tương tác',
                  type: 'concept',
                  bullets: ['Yếu tố quan trọng 1', 'Nhiệm vụ học sinh thực hiện'],
                  notes: 'Ghi chú cho giáo viên...',
                  badge: 'Kiến thức mới',
                };
                const updated = [...slides];
                updated.splice(activeSlideIndex + 1, 0, newSlide);
                onSlidesChange(updated);
                onSlideSelect(activeSlideIndex + 1);
              }}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Thêm slide
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {slides.map((sl, idx) => (
              <div
                key={sl.id}
                onClick={() => onSlideSelect(idx)}
                className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                  activeSlideIndex === idx
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500">#{idx + 1}</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                    {sl.badge || 'Slide'}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 truncate text-[11px]">{sl.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{sl.subtitle || sl.bullets[0] || ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Slide Form Editor */}
        <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span className="font-bold text-slate-800">Chỉnh sửa Slide #{activeSlideIndex + 1}</span>
            {slides.length > 1 && (
              <button
                onClick={() => {
                  const updated = slides.filter((_, i) => i !== activeSlideIndex);
                  onSlidesChange(updated);
                  onSlideSelect(Math.max(0, activeSlideIndex - 1));
                }}
                className="text-rose-500 hover:text-rose-700 text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Xóa
              </button>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Loại bố cục slide</label>
            <select
              value={currentSlide.type}
              onChange={(e) => {
                const updated = [...slides];
                updated[activeSlideIndex] = {
                  ...currentSlide,
                  type: e.target.value as any,
                };
                onSlidesChange(updated);
              }}
              className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs outline-none"
            >
              <option value="title">Bìa mở đầu bài học (Title Slide)</option>
              <option value="concept">Hình thành kiến thức mới (Knowledge Cards)</option>
              <option value="interactive_activity">Tình huống / Khởi động (Warm-up)</option>
              <option value="exercise">Luyện tập & Câu hỏi (Practice)</option>
              <option value="summary">Tổng kết & Giao bài (Summary)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tiêu đề Slide</label>
            <input
              type="text"
              value={currentSlide.title}
              onChange={(e) => {
                const updated = [...slides];
                updated[activeSlideIndex] = { ...currentSlide, title: e.target.value };
                onSlidesChange(updated);
              }}
              className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phụ đề</label>
            <input
              type="text"
              value={currentSlide.subtitle || ''}
              onChange={(e) => {
                const updated = [...slides];
                updated[activeSlideIndex] = { ...currentSlide, subtitle: e.target.value };
                onSlidesChange(updated);
              }}
              className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Các thẻ tri thức / Ý chính</label>
              <button
                onClick={() => {
                  const updated = [...slides];
                  updated[activeSlideIndex] = {
                    ...currentSlide,
                    bullets: [...currentSlide.bullets, 'Nội dung kiến thức bổ sung'],
                  };
                  onSlidesChange(updated);
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> Thêm thẻ
              </button>
            </div>
            <div className="space-y-1.5">
              {currentSlide.bullets.map((b, bIdx) => (
                <div key={bIdx} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] shrink-0 font-mono">
                    {bIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const newBullets = [...currentSlide.bullets];
                      newBullets[bIdx] = e.target.value;
                      const updated = [...slides];
                      updated[activeSlideIndex] = { ...currentSlide, bullets: newBullets };
                      onSlidesChange(updated);
                    }}
                    className="flex-1 border border-slate-200 rounded px-2 py-1 bg-slate-50 focus:bg-white text-xs outline-none"
                  />
                  {currentSlide.bullets.length > 1 && (
                    <button
                      onClick={() => {
                        const newBullets = currentSlide.bullets.filter((_, i) => i !== bIdx);
                        const updated = [...slides];
                        updated[activeSlideIndex] = { ...currentSlide, bullets: newBullets };
                        onSlidesChange(updated);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hộp điểm nhấn (Callout Box)</label>
            <input
              type="text"
              value={currentSlide.callout || ''}
              onChange={(e) => {
                const updated = [...slides];
                updated[activeSlideIndex] = { ...currentSlide, callout: e.target.value };
                onSlidesChange(updated);
              }}
              placeholder="Ghi chú kiến thức hoặc câu hỏi tư duy cốt lõi..."
              className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white text-xs outline-none"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1 font-semibold text-amber-900">
              <MessageSquareQuote className="w-3.5 h-3.5 text-amber-600" />
              <span>Ghi chú giảng dạy (Presenter Notes)</span>
            </div>
            <textarea
              value={currentSlide.notes}
              onChange={(e) => {
                const updated = [...slides];
                updated[activeSlideIndex] = { ...currentSlide, notes: e.target.value };
                onSlidesChange(updated);
              }}
              rows={3}
              placeholder="Lời thoại gợi ý cho thầy cô khi trình bày slide này..."
              className="w-full border border-amber-200 rounded p-2.5 bg-amber-50/40 text-slate-800 text-xs focus:bg-white outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RIGHT PANE: 16:9 PRESENTATION CANVAS & CONTROLLER
  // (CHẾ ĐỘ SLIDE DECK VỚI CÁC THẺ TRỰC QUAN HÓA KIẾN THỨC)
  // ----------------------------------------------------
  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col items-center ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-6 max-w-none justify-center'
          : 'max-w-4xl'
      }`}
    >
      {/* Top Banner inside Right Pane */}
      {!isFullscreen && (
        <div className="w-full mb-3 flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
            <span className="font-bold text-slate-800 text-xs">
              Slide Deck Chuẩn 16:9 · Bài giảng GDPT 2018
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onConvertToSlides && (
              <button
                onClick={onConvertToSlides}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                title="Đồng bộ lại KHBD 5512 sang Slide"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Chuyển Đổi Nhanh KHBD Thành Slide</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              title="Phóng to toàn màn hình trình chiếu (Phím F)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Toàn màn hình</span>
            </button>
          </div>
        </div>
      )}

      {/* 16:9 SLIDE CANVAS: BÀI GIẢNG ĐIỆN TỬ */}
      <div
        className={`w-full aspect-[16/9] bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border border-slate-800/80 transition-all ${
          isFullscreen ? 'max-w-6xl max-h-[85vh]' : ''
        }`}
      >
        {/* Ambient atmospheric glow lights */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 top-1/2 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Top bar of 16:9 slide */}
        <div className="flex items-center justify-between text-xs text-indigo-200 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-xs">
              {curriculum.subject} {curriculum.grade} · {curriculum.bookSeries}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 font-medium truncate max-w-xs hidden sm:inline">
              {curriculum.lessonTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/30 border border-indigo-400/40 text-indigo-100 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide">
              {currentSlide.badge || 'Chuẩn GDPT 2018'}
            </span>
          </div>
        </div>

        {/* Center Body: KNOWLEDGE VISUALIZATION CARDS */}
        <div className="my-auto space-y-4 relative z-10 py-3">
          {/* Main Title & Subtitle */}
          <div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="text-xs md:text-sm lg:text-base text-indigo-200 font-medium mt-1">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Knowledge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {currentSlide.bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-xl p-4 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/80 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm text-slate-100 font-medium leading-relaxed">
                    {bullet}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Callout Banner (Trực quan hóa cốt lõi) */}
          {currentSlide.callout && (
            <div className="mt-3 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-indigo-400/40 p-4 rounded-xl text-xs md:text-sm font-semibold text-indigo-100 shadow-inner flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{currentSlide.callout}</span>
            </div>
          )}
        </div>

        {/* Footer of 16:9 slide */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <span>{curriculum.schoolName}</span>
            <span>·</span>
            <span>GV: {curriculum.teacherName}</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-indigo-300 font-semibold bg-white/5 px-2.5 py-0.5 rounded">
            <span>Slide {activeSlideIndex + 1} / {slides.length}</span>
          </div>
        </div>
      </div>

      {/* Presentation Control Bar (Dưới Slide hoặc trong chế độ Toàn Màn Hình) */}
      <div
        className={`mt-4 flex items-center justify-between w-full max-w-xl bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-200 text-xs ${
          isFullscreen ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border-slate-700' : ''
        }`}
      >
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSlideSelect(Math.max(0, activeSlideIndex - 1))}
            disabled={activeSlideIndex === 0}
            className={`p-1.5 rounded-full transition-colors ${
              isFullscreen
                ? 'hover:bg-slate-800 text-slate-200 disabled:opacity-30'
                : 'hover:bg-slate-100 text-slate-700 disabled:opacity-30'
            }`}
            title="Slide trước (Phím mũi tên trái)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono font-bold px-1.5 text-xs">
            {activeSlideIndex + 1} / {slides.length}
          </span>

          <button
            onClick={() => onSlideSelect(Math.min(slides.length - 1, activeSlideIndex + 1))}
            disabled={activeSlideIndex === slides.length - 1}
            className={`p-1.5 rounded-full transition-colors ${
              isFullscreen
                ? 'hover:bg-slate-800 text-slate-200 disabled:opacity-30'
                : 'hover:bg-slate-100 text-slate-700 disabled:opacity-30'
            }`}
            title="Slide sau (Phím mũi tên phải hoặc Phím cách)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lecture Timer */}
        <div className={`flex items-center gap-2 border-x px-4 ${isFullscreen ? 'border-slate-700' : 'border-slate-200'}`}>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono font-medium">{formatTimer(elapsedSeconds)}</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-400 transition-colors"
          >
            {isTimerRunning ? 'Dừng' : 'Bắt đầu'}
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Notes toggle in fullscreen */}
          {isFullscreen && (
            <button
              onClick={() => setShowNotesInFullscreen(!showNotesInFullscreen)}
              className={`p-1.5 rounded-full transition-colors ${
                showNotesInFullscreen ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
              title="Hiện ghi chú giáo viên"
            >
              <MessageSquareQuote className="w-4 h-4" />
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-full transition-colors ${
              isFullscreen ? 'hover:bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
            title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình trình chiếu (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Presenter Notes Overlay in Fullscreen */}
      {isFullscreen && showNotesInFullscreen && currentSlide.notes && (
        <div className="fixed top-6 right-6 max-w-sm bg-slate-900/90 backdrop-blur-md border border-amber-400/40 rounded-xl p-4 text-xs text-amber-200 shadow-2xl z-50 animate-in fade-in">
          <div className="flex items-center justify-between pb-1 mb-2 border-b border-amber-400/20">
            <span className="font-bold flex items-center gap-1.5 text-amber-400">
              <MessageSquareQuote className="w-4 h-4" />
              Ghi chú lời thoại giảng viên
            </span>
            <button
              onClick={() => setShowNotesInFullscreen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-200 leading-relaxed text-[11px] whitespace-pre-line">
            {currentSlide.notes}
          </p>
        </div>
      )}

      {/* Presenter Notes Box (Normal view) */}
      {!isFullscreen && currentSlide.notes && (
        <div className="mt-3 w-full max-w-xl bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
          <MessageSquareQuote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-900 block text-[11px] mb-0.5">
              Ghi chú giảng dạy (Presenter Notes):
            </span>
            <p className="text-amber-800 leading-relaxed text-[11px] whitespace-pre-line">
              {currentSlide.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
