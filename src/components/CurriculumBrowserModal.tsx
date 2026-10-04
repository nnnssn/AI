import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Check, 
  BookmarkCheck, 
  ArrowRight, 
  Layers,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  ALL_TEXTBOOKS, 
  KHTN_6_CURRICULUM, 
  KHTN_7_CURRICULUM, 
  KHTN_8_CURRICULUM, 
  KHTN_9_CURRICULUM 
} from '../data/knttCurriculum';
import { GradeLevel, Subject, BookSeries } from '../types/edtech';

interface CurriculumBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (grade: GradeLevel, lessonTitle: string, chapterTitle: string) => void;
  currentGrade: GradeLevel;
}

export const CurriculumBrowserModal: React.FC<CurriculumBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  currentGrade,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(
    ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'].includes(currentGrade) ? currentGrade : 'Lớp 7'
  );
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentTextbook = 
    selectedGrade === 'Lớp 6' ? KHTN_6_CURRICULUM :
    selectedGrade === 'Lớp 7' ? KHTN_7_CURRICULUM :
    selectedGrade === 'Lớp 8' ? KHTN_8_CURRICULUM :
    KHTN_9_CURRICULUM;

  // Filter lessons by search query
  const filteredChapters = currentTextbook.chapters.map((ch) => {
    const matchedLessons = ch.lessons.filter((l) =>
      l.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...ch,
      lessons: matchedLessons,
    };
  }).filter((ch) => ch.lessons.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Kho Thư Viện SGK Khoa Học Tự Nhiên (Kết Nối Tri Thức Với Cuộc Sống)
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Bộ GD&ĐT
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tích hợp nguyên văn mục lục, chương và bài học từ SGK KHTN Lớp 6, 7, 8, 9 (NXB Giáo dục Việt Nam)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Grade Selector Tabs & Live Search */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Grade tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {(['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] as GradeLevel[]).map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr)}
                className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors ${
                  selectedGrade === gr
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                KHTN {gr}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài học, chủ đề (VD: Quang hợp, Khối lượng riêng, Thấu kính...)"
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Textbook Metadata Banner */}
        <div className="px-5 py-2.5 bg-indigo-50/50 border-b border-indigo-100 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-bold">{currentTextbook.bookTitle}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{currentTextbook.publisher}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Tổng Chủ biên: <span className="font-semibold text-slate-700">{currentTextbook.chiefAuthor}</span>
          </div>
        </div>

        {/* Chapters & Lessons List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/60">
          {filteredChapters.map((chapter) => (
            <div
              key={chapter.chapterNumber}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              {/* Chapter Header */}
              <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {chapter.chapterNumber}
                  </span>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {chapter.chapterTitle}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {chapter.lessons.length} bài học
                </span>
              </div>

              {/* Lessons Grid */}
              <div className="divide-y divide-slate-100">
                {chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.lessonNumber}
                    className="p-3 hover:bg-indigo-50/50 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {lesson.lessonNumber}
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 transition-colors">
                          {lesson.lessonTitle}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Trang {lesson.page} · SGK {currentTextbook.bookTitle}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectLesson(
                          selectedGrade,
                          lesson.lessonTitle,
                          `${chapter.chapterNumber}: ${chapter.chapterTitle}`
                        );
                        onClose();
                      }}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-2xs group-hover:shadow-xs"
                    >
                      <span>Nạp vào hệ thống</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredChapters.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              Không tìm thấy bài học nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>
            Hệ thống hỗ trợ nạp giáo án KHBD 5512, slide bài giảng 16:9 và ma trận 7991 tự động theo SGK được chọn.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
