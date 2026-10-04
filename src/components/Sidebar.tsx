import React from 'react';
import { 
  FileText, 
  Presentation, 
  CheckSquare, 
  PanelLeftClose, 
  PanelLeft, 
  FolderTree, 
  ListFilter,
  Sparkles,
  User,
  GraduationCap
} from 'lucide-react';
import { AppMode, CurriculumContext } from '../types/edtech';
import { parsePeriodsFromDuration, MAX_PERIODS } from '../utils/periodValidator';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  curriculum: CurriculumContext;
  onOpenTeacherModal?: () => void;
  // Sub-navigation state passed down
  active5512Section: string;
  on5512SectionChange: (section: string) => void;
  activeSlideIndex: number;
  onSlideSelect: (index: number) => void;
  totalSlides: number;
  active7991Tab: 'matrix' | 'spec' | 'questions';
  on7991TabChange: (tab: 'matrix' | 'spec' | 'questions') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMode,
  onModeChange,
  isCollapsed,
  onToggleCollapse,
  curriculum,
  onOpenTeacherModal,
  active5512Section,
  on5512SectionChange,
  activeSlideIndex,
  onSlideSelect,
  totalSlides,
  active7991Tab,
  on7991TabChange,
}) => {
  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ease-in-out z-20 no-print print:hidden ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Modes Navigation Top Zone */}
      <div className="p-3 border-b border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1 mb-1">
          {!isCollapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Không gian nghiệp vụ
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors ml-auto"
            title={isCollapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Mode 1: Soạn KHBD 5512 */}
        <button
          onClick={() => onModeChange('khbd_5512')}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg border text-left text-xs transition-all ${
            currentMode === 'khbd_5512'
              ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200 font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50 border-transparent font-medium'
          }`}
          title="Soạn Kế hoạch bài dạy theo Công văn 5512/BGDĐT-GDTrH"
        >
          <div
            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
              currentMode === 'khbd_5512' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="truncate">Soạn KHBD 5512</div>
              <div className="text-[10px] text-slate-400 font-normal">Kế hoạch bài dạy 4 bước</div>
            </div>
          )}
        </button>

        {/* Mode 2: Trình Chiếu Slide Bài Giảng */}
        <button
          onClick={() => onModeChange('slide_presentation')}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg border text-left text-xs transition-all ${
            currentMode === 'slide_presentation'
              ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200 font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50 border-transparent font-medium'
          }`}
          title="Trình chiếu bài giảng Slide tỉ lệ 16:9 tương tác"
        >
          <div
            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
              currentMode === 'slide_presentation' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Presentation className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="truncate">Trình Chiếu Slide</div>
              <div className="text-[10px] text-slate-400 font-normal">Slide tương tác 16:9</div>
            </div>
          )}
        </button>

        {/* Mode 3: Ngân Hàng Đề Thi 7991 */}
        <button
          onClick={() => onModeChange('exam_bank_7991')}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg border text-left text-xs transition-all ${
            currentMode === 'exam_bank_7991'
              ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200 font-semibold shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50 border-transparent font-medium'
          }`}
          title="Xây dựng ma trận & đề thi theo Công văn 7991/BGDĐT-GDTrH"
        >
          <div
            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
              currentMode === 'exam_bank_7991' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="truncate">Ngân Hàng Đề 7991</div>
              <div className="text-[10px] text-slate-400 font-normal">Ma trận & Bản đặc tả mới</div>
            </div>
          )}
        </button>
      </div>

      {/* Subtree Section based on Active Mode */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3 text-xs space-y-4">
          {/* Subtree: KHBD 5512 */}
          {currentMode === 'khbd_5512' && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Khung KHBD Phụ lục IV
              </div>
              <button
                onClick={() => on5512SectionChange('objectives')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  active5512Section === 'objectives'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>I. Mục tiêu & Yêu cầu</span>
              </button>
              <button
                onClick={() => on5512SectionChange('equipment')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 transition-colors ${
                  active5512Section === 'equipment'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>II. Thiết bị & Học liệu</span>
              </button>

              {/* III. Tiến trình dạy học theo tiết */}
              {(() => {
                const periodsCount = Math.min(MAX_PERIODS, Math.max(1, parsePeriodsFromDuration(curriculum.duration) || 2));
                return (
                  <>
                    <div className="pt-2 pb-0.5 px-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                      <span>III. Tiến trình dạy học</span>
                      <span className="text-[9.5px] bg-indigo-50 text-indigo-700 font-mono px-1.5 py-0.2 rounded font-semibold border border-indigo-100">
                        {periodsCount} tiết
                      </span>
                    </div>

                    {/* Danh sách các tiết dạy từ Tiết 1 đến Tiết 5 */}
                    <div className="space-y-0.5">
                      {Array.from({ length: periodsCount }).map((_, idx) => {
                        const pNum = idx + 1;
                        const sectionId = `period_${pNum}`;
                        const isSelected = active5512Section === sectionId;
                        return (
                          <button
                            key={pNum}
                            onClick={() => on5512SectionChange(sectionId)}
                            className={`w-full text-left pl-3.5 pr-2 py-1.5 rounded-md flex items-center justify-between transition-colors text-xs ${
                              isSelected
                                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                            }`}
                            title={`Xem và soạn nội dung Tiết ${pNum}`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center font-mono shrink-0 ${
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {pNum}
                              </span>
                              <span className="truncate">Tiết {pNum}</span>
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              45p
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Subtree: Slide Deck */}
          {currentMode === 'slide_presentation' && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                <span>Slides ({totalSlides})</span>
                <span className="text-[10px] text-slate-400">16:9 Canvas</span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSlideSelect(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 text-xs transition-colors ${
                      activeSlideIndex === idx
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span className="truncate">Slide #{idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subtree: Exam Bank 7991 */}
          {currentMode === 'exam_bank_7991' && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Chuẩn CV 7991 mới
              </div>
              <button
                onClick={() => on7991TabChange('matrix')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  active7991Tab === 'matrix'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>1. Ma trận đề định kì</span>
                <span className="text-[10px] text-indigo-600 font-mono">10.0 đ</span>
              </button>
              <button
                onClick={() => on7991TabChange('spec')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  active7991Tab === 'spec'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>2. Bản đặc tả ma trận</span>
                <span className="text-[10px] text-slate-400">Yêu cầu</span>
              </button>
              <button
                onClick={() => on7991TabChange('questions')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  active7991Tab === 'questions'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>3. Đề kiểm tra mẫu</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                  Phần I-IV
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Teacher Profile Footer (Clickable to edit GV info) */}
      <button
        type="button"
        onClick={onOpenTeacherModal}
        className={`p-2.5 border-t border-slate-200 bg-slate-50/70 hover:bg-amber-50/80 transition-colors flex items-center gap-2.5 text-left group cursor-pointer ${
          isCollapsed ? 'justify-center p-2' : ''
        }`}
        title="Thông tin Giáo viên, Trường học và Số tiết (Bấm để chỉnh sửa)"
      >
        <div className="w-8 h-8 rounded-full bg-amber-500 text-white group-hover:bg-amber-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs transition-transform group-hover:scale-105">
          GV
        </div>
        {!isCollapsed && (
          <div className="flex-1 truncate">
            <div className="font-semibold text-slate-800 text-xs truncate group-hover:text-amber-950 flex items-center justify-between">
              <span className="truncate">{curriculum.teacherName}</span>
              <span className="text-[9px] bg-slate-200/80 group-hover:bg-amber-200 text-slate-600 group-hover:text-amber-900 px-1 py-0.2 rounded font-medium ml-1">
                Sửa
              </span>
            </div>
            <div className="text-[10px] text-slate-400 group-hover:text-slate-600 truncate">
              {curriculum.schoolName}
            </div>
          </div>
        )}
      </button>
    </aside>
  );
};
