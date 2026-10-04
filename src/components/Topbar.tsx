import React from 'react';
import { 
  BookOpen, 
  Layers, 
  GraduationCap, 
  FileCode, 
  CheckCircle2, 
  Library,
  Presentation
} from 'lucide-react';
import { BookSeries, GradeLevel, Subject, CurriculumContext, LessonPlan5512 } from '../types/edtech';
import { SUBJECT_OPTIONS, GRADE_OPTIONS, BOOK_SERIES_OPTIONS, getAvailableLessonsForCurriculum } from '../data/mockData';
import { DownloadKhbdButton } from './DownloadKhbdButton';

interface TopbarProps {
  curriculum: CurriculumContext;
  onCurriculumChange: (updates: Partial<CurriculumContext>) => void;
  splitRatio: number;
  onSplitRatioChange: (ratio: number) => void;
  onOpenSourceModal: () => void;
  onOpenCurriculumModal: () => void;
  onOpenTeacherModal?: () => void;
  onPrint: () => void;
  onConvertToSlides?: () => void;
  khbd?: LessonPlan5512;
}

export const Topbar: React.FC<TopbarProps> = ({
  curriculum,
  onCurriculumChange,
  splitRatio,
  onSplitRatioChange,
  onOpenSourceModal,
  onOpenCurriculumModal,
  onPrint,
  onConvertToSlides,
  khbd,
}) => {

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between shrink-0 z-30 shadow-xs no-print print:hidden">
      {/* Zone 1: Brand & Core Selectors (Subject, Grade, Book Series) */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-slate-900 tracking-tight text-sm">EduPlan</span>
            <span className="text-[10px] text-indigo-600 font-semibold ml-1 bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded">GDPT 2018</span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Quick Selectors */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Môn học */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2 py-1 hover:border-slate-300 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 mr-1 hidden lg:block" />
            <span className="text-[11px] text-slate-400 font-medium mr-1.5 hidden md:inline">Môn:</span>
            <select
              value={curriculum.subject}
              onChange={(e) => {
                const newSubject = e.target.value as Subject;
                const newGrade = (newSubject === 'Khoa học tự nhiên' && ['Lớp 10', 'Lớp 11', 'Lớp 12'].includes(curriculum.grade)) 
                  ? 'Lớp 7' 
                  : curriculum.grade;
                const newLessons = getAvailableLessonsForCurriculum(newSubject, newGrade, curriculum.bookSeries);
                onCurriculumChange({ 
                  subject: newSubject,
                  grade: newGrade,
                  lessonTitle: newLessons[0] || curriculum.lessonTitle
                });
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Khối lớp */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-2 py-1 hover:border-slate-300 focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <span className="text-[11px] text-slate-400 font-medium mr-1.5 hidden md:inline">Khối:</span>
            <select
              value={curriculum.grade}
              onChange={(e) => {
                const newGrade = e.target.value as GradeLevel;
                const newLessons = getAvailableLessonsForCurriculum(curriculum.subject, newGrade, curriculum.bookSeries);
                onCurriculumChange({ 
                  grade: newGrade,
                  lessonTitle: newLessons[0] || curriculum.lessonTitle
                });
              }}
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {GRADE_OPTIONS.map((gr) => (
                <option key={gr} value={gr}>{gr}</option>
              ))}
            </select>
          </div>

          {/* Bộ sách: Cánh Diều, Kết Nối Tri Thức, Chân Trời Sáng Tạo */}
          <div className="flex items-center bg-indigo-50/70 border border-indigo-200/80 rounded-md px-2 py-1 hover:border-indigo-300 focus-within:border-indigo-600 focus-within:bg-white transition-all">
            <Layers className="w-3.5 h-3.5 text-indigo-500 mr-1 hidden lg:block" />
            <span className="text-[11px] text-indigo-500 font-medium mr-1.5 hidden md:inline">Bộ sách:</span>
            <select
              value={curriculum.bookSeries}
              onChange={(e) => {
                const newSeries = e.target.value as BookSeries;
                const newLessons = getAvailableLessonsForCurriculum(curriculum.subject, curriculum.grade, newSeries);
                onCurriculumChange({ 
                  bookSeries: newSeries,
                  lessonTitle: newLessons[0] || curriculum.lessonTitle
                });
              }}
              className="bg-transparent text-xs font-semibold text-indigo-900 outline-none cursor-pointer"
            >
              {BOOK_SERIES_OPTIONS.map((book) => (
                <option key={book} value={book}>{book}</option>
              ))}
            </select>
          </div>

          {/* Nút mở Thư viện SGK KHTN 6, 7, 8, 9 */}
          <button
            onClick={onOpenCurriculumModal}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors shadow-2xs"
            title="Tra cứu toàn bộ mục lục SGK Khoa học tự nhiên 6, 7, 8, 9 (KNTT)"
          >
            <Library className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">Mục lục SGK KHTN (6-9)</span>
          </button>
        </div>
      </div>


      {/* Zone 3: Function Actions */}
      <div className="flex items-center gap-2">
        {/* Sync status */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-1 rounded-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-medium">Đã đồng bộ</span>
        </div>

        {/* Scope 3: Nút Chuyển Đổi Nhanh KHBD Thành Slide */}
        {onConvertToSlides && (
          <button
            onClick={onConvertToSlides}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-xs transition-all transform hover:scale-102"
            title="Chuyển đổi tức thì KHBD 5512 sang Slide Deck 16:9"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Chuyển KHBD → Slide</span>
          </button>
        )}

        {/* Dedicated: TẢI KHBD (Chỉ tải tệp Word .docx) */}
        {khbd && (
          <DownloadKhbdButton
            khbd={khbd}
            curriculum={curriculum}
            variant="topbar"
          />
        )}

        {/* Modal: Xuất mã Single-file HTML + Alpine.js */}
        <button
          onClick={onOpenSourceModal}
          className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors shadow-2xs"
          title="Xem và tải mã nguồn Single-file HTML + Tailwind + Alpine.js"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mã nguồn Alpine.js</span>
        </button>
      </div>
    </header>
  );
};
