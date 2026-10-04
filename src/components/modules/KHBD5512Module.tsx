import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  HelpCircle, 
  Plus, 
  Trash2, 
  BookMarked,
  Sparkles,
  Presentation,
  Edit3,
  Eye,
  Check,
  RotateCcw,
  Clock,
  Layers,
  Table as TableIcon,
  AlertCircle,
  Calendar,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { LessonPlan5512, CurriculumContext, Activity5512, LessonPeriodPlan } from '../../types/edtech';
import { DownloadKhbdButton } from '../DownloadKhbdButton';
import { 
  ensurePeriodsSynchronized, 
  parsePeriodsFromDuration, 
  formatDurationString,
  MAX_PERIODS, 
  MIN_PERIODS, 
  MAX_PERIODS_EXCEEDED_MESSAGE,
  INVALID_PERIODS_MESSAGE 
} from '../../utils/periodValidator';

interface KHBD5512ModuleProps {
  khbd: LessonPlan5512;
  onKhbdChange: (updated: LessonPlan5512) => void;
  curriculum: CurriculumContext;
  activeSection: string;
  isRightPane?: boolean;
  onConvertToSlides?: () => void;
  onOpenTeacherModal?: () => void;
  onDurationChange?: (durationStr: string) => void;
  onSectionSelect?: (sectionId: string) => void;
}

export const KHBD5512Module: React.FC<KHBD5512ModuleProps> = ({
  khbd,
  onKhbdChange,
  curriculum,
  activeSection,
  isRightPane = false,
  onConvertToSlides,
  onOpenTeacherModal,
  onDurationChange,
  onSectionSelect,
}) => {
  // Right pane tab: 'table_editable' (Bảng tiến trình 4 hoạt động Inline Editable) or 'document_a4' (Văn bản in A4)
  const [viewMode, setViewMode] = useState<'table_editable' | 'document_a4'>('table_editable');
  const [inlineEditEnabled, setInlineEditEnabled] = useState<boolean>(true);
  const [selectedPeriodNum, setSelectedPeriodNum] = useState<number | 'all'>(1);
  const [periodAlert, setPeriodAlert] = useState<string | null>(null);

  // Auto-dismiss period alert
  useEffect(() => {
    if (periodAlert) {
      const timer = setTimeout(() => setPeriodAlert(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [periodAlert]);

  // Synchronize periods and cap strictly between 1 and 5
  const activePeriodsCount = Math.max(
    MIN_PERIODS,
    Math.min(MAX_PERIODS, khbd.periodsCount || parsePeriodsFromDuration(curriculum.duration) || 2)
  );

  // Ensure safe synchronized KHBD containing up to 5 full pedagogical periods
  const synchronizedKhbd = ensurePeriodsSynchronized(
    khbd,
    activePeriodsCount,
    curriculum.lessonTitle,
    curriculum.grade,
    curriculum.subject
  );

  // Sync back to parent if periods were missing on first load
  useEffect(() => {
    if (!khbd.periods || khbd.periods.length < MAX_PERIODS || khbd.periodsCount !== activePeriodsCount) {
      onKhbdChange(synchronizedKhbd);
    }
  }, [activePeriodsCount, khbd.periods?.length, khbd.periodsCount]);

  // Active periods sliced up to activePeriodsCount
  const activePeriods: LessonPeriodPlan[] = (synchronizedKhbd.periods || []).slice(0, activePeriodsCount);

  // Sync selected period from activeSection if user clicked sidebar period link (e.g. 'period_3')
  useEffect(() => {
    const match = activeSection?.match(/period_(\d+)/);
    if (match) {
      const p = parseInt(match[1], 10);
      if (p >= 1 && p <= activePeriodsCount) {
        setSelectedPeriodNum(p);
      }
    }
  }, [activeSection, activePeriodsCount]);

  // Handler: Change number of periods (1 to 5 only)
  const handleSetPeriodCount = (count: number) => {
    if (count > MAX_PERIODS) {
      setPeriodAlert(MAX_PERIODS_EXCEEDED_MESSAGE);
      return;
    }
    if (count < MIN_PERIODS) {
      setPeriodAlert(INVALID_PERIODS_MESSAGE);
      return;
    }

    const safeCount = Math.max(MIN_PERIODS, Math.min(MAX_PERIODS, count));
    const newDurationStr = formatDurationString(safeCount, true);

    // Update parent duration if callback available
    if (onDurationChange) {
      onDurationChange(newDurationStr);
    }

    // Safely update KHBD while preserving all existing period content
    const updated = ensurePeriodsSynchronized(
      khbd,
      safeCount,
      curriculum.lessonTitle,
      curriculum.grade,
      curriculum.subject
    );
    onKhbdChange(updated);

    if (selectedPeriodNum !== 'all' && selectedPeriodNum > safeCount) {
      setSelectedPeriodNum(safeCount);
    }
  };

  // Helper: Update whole period metadata
  const handleUpdatePeriod = (periodNum: number, patch: Partial<LessonPeriodPlan>) => {
    const updatedPeriods = (synchronizedKhbd.periods || []).map((p) =>
      p.periodNumber === periodNum ? { ...p, ...patch } : p
    );
    onKhbdChange({ ...synchronizedKhbd, periods: updatedPeriods });
  };

  // Helper: Update specific activity in a period
  const handleUpdatePeriodActivity = (periodNum: number, actId: string, patch: Partial<Activity5512>) => {
    const updatedPeriods = (synchronizedKhbd.periods || []).map((p) => {
      if (p.periodNumber === periodNum) {
        return {
          ...p,
          activities: p.activities.map((a) => (a.id === actId ? { ...a, ...patch } : a)),
        };
      }
      return p;
    });

    // Also update root activities if in period 1 or fallback
    const rootActivities = khbd.activities.map((a) => (a.id === actId ? { ...a, ...patch } : a));

    onKhbdChange({ ...synchronizedKhbd, activities: rootActivities, periods: updatedPeriods });
  };

  // Helper: Update implementation step (assign, execute, discuss, conclude)
  const handleUpdatePeriodStep = (
    periodNum: number,
    actId: string,
    step: 'assign' | 'execute' | 'discuss' | 'conclude',
    val: string
  ) => {
    const updatedPeriods = (synchronizedKhbd.periods || []).map((p) => {
      if (p.periodNumber === periodNum) {
        return {
          ...p,
          activities: p.activities.map((a) => {
            if (a.id === actId) {
              return {
                ...a,
                implementation: {
                  ...a.implementation,
                  [step]: val,
                },
              };
            }
            return a;
          }),
        };
      }
      return p;
    });

    // Also update root activities for compatibility
    const rootActivities = khbd.activities.map((a) => {
      if (a.id === actId) {
        return {
          ...a,
          implementation: {
            ...a.implementation,
            [step]: val,
          },
        };
      }
      return a;
    });

    onKhbdChange({ ...synchronizedKhbd, activities: rootActivities, periods: updatedPeriods });
  };

  // Active period for left pane editing
  const currentPeriodIndex = typeof selectedPeriodNum === 'number' ? selectedPeriodNum - 1 : 0;
  const currentEditingPeriod = activePeriods[currentPeriodIndex] || activePeriods[0];

  // ----------------------------------------------------
  // LEFT PANE: Cấu hình nhanh & Soạn từng tiết dạy độc lập
  // ----------------------------------------------------
  if (!isRightPane) {
    return (
      <div className="p-4 space-y-4 text-xs">
        {/* Banner tiêu chuẩn 5512 */}
        <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-xl p-3.5 text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-950 font-bold text-xs">
              <BookMarked className="w-4 h-4 text-indigo-600" />
              <span>Quy chuẩn Công văn 5512/BGDĐT-GDTrH</span>
            </div>
            <span className="text-[10px] bg-indigo-200/60 text-indigo-800 font-mono font-semibold px-2 py-0.5 rounded">
              GDPT 2018
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Thiết kế bài dạy phát triển phẩm chất và năng lực học sinh. Hỗ trợ phân bổ từ <strong>1 đến 5 tiết dạy</strong> độc lập và khoa học.
          </p>

          {/* Quick convert and download buttons in left pane */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 mt-2">
            {onConvertToSlides && (
              <button
                onClick={onConvertToSlides}
                className="flex-1 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-1.5 px-2.5 rounded-lg shadow-xs transition-all text-xs cursor-pointer"
                title="Chuyển sang trình chiếu Slide Deck 16:9"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Chuyển Sang Slide</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </button>
            )}

            <DownloadKhbdButton
              khbd={synchronizedKhbd}
              curriculum={curriculum}
              className="w-full sm:w-auto shrink-0"
            />
          </div>
        </div>

        {/* Thông tin giáo viên & trường học */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              GV
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-xs truncate">{curriculum.teacherName}</div>
              <div className="text-[10px] text-slate-500 truncate">
                {curriculum.schoolName} · <span className="font-semibold text-indigo-700">{curriculum.duration}</span>
              </div>
            </div>
          </div>
          {onOpenTeacherModal && (
            <button
              type="button"
              onClick={onOpenTeacherModal}
              className="text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 shadow-2xs flex items-center gap-1 cursor-pointer"
              title="Nhấn để đổi tên giáo viên, tên trường và số tiết dạy"
            >
              <Edit3 className="w-3 h-3 text-amber-600" />
              <span>Sửa GV</span>
            </button>
          )}
        </div>

        {/* Section 1: Mục tiêu bài học */}
        {activeSection === 'objectives' && (
          <div className="space-y-4">
            <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  1. Mục tiêu Kiến thức
                </label>
                <button
                  onClick={() => {
                    const newKnowledge = [...khbd.objectives.knowledge, 'Yêu cầu cần đạt mới theo SGK'];
                    onKhbdChange({
                      ...khbd,
                      objectives: { ...khbd.objectives, knowledge: newKnowledge },
                    });
                  }}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Thêm
                </button>
              </div>
              {khbd.objectives.knowledge.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...khbd.objectives.knowledge];
                      updated[idx] = e.target.value;
                      onKhbdChange({
                        ...khbd,
                        objectives: { ...khbd.objectives, knowledge: updated },
                      });
                    }}
                    className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs"
                  />
                  {khbd.objectives.knowledge.length > 1 && (
                    <button
                      onClick={() => {
                        const updated = khbd.objectives.knowledge.filter((_, i) => i !== idx);
                        onKhbdChange({
                          ...khbd,
                          objectives: { ...khbd.objectives, knowledge: updated },
                        });
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Xóa mục này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 2. Năng lực đặc thù */}
            <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                2. Năng lực đặc thù môn học
              </label>
              {khbd.objectives.domainCompetencies.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...khbd.objectives.domainCompetencies];
                      updated[idx] = e.target.value;
                      onKhbdChange({
                        ...khbd,
                        objectives: { ...khbd.objectives, domainCompetencies: updated },
                      });
                    }}
                    className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs"
                  />
                </div>
              ))}
            </div>

            {/* 3. Phẩm chất */}
            <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                3. Phẩm chất phát triển
              </label>
              {khbd.objectives.qualities.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...khbd.objectives.qualities];
                      updated[idx] = e.target.value;
                      onKhbdChange({
                        ...khbd,
                        objectives: { ...khbd.objectives, qualities: updated },
                      });
                    }}
                    className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Thiết bị dạy học */}
        {activeSection === 'equipment' && (
          <div className="space-y-4">
            <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <label className="font-bold text-slate-800">1. Thiết bị của Giáo viên</label>
              <textarea
                value={khbd.equipment.teacher.join('\n')}
                onChange={(e) => {
                  onKhbdChange({
                    ...khbd,
                    equipment: {
                      ...khbd.equipment,
                      teacher: e.target.value.split('\n'),
                    },
                  });
                }}
                rows={4}
                className="w-full border border-slate-200 rounded p-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs leading-relaxed"
              />
            </div>
            <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
              <label className="font-bold text-slate-800">2. Học liệu của Học sinh</label>
              <textarea
                value={khbd.equipment.student.join('\n')}
                onChange={(e) => {
                  onKhbdChange({
                    ...khbd,
                    equipment: {
                      ...khbd.equipment,
                      student: e.target.value.split('\n'),
                    },
                  });
                }}
                rows={4}
                className="w-full border border-slate-200 rounded p-2.5 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Section 3: Quản lý & Soạn thảo chi tiết TIẾT HỌC ĐANG CHỌN (Độc lập từng tiết 1 đến 5) */}
        {activeSection !== 'objectives' && activeSection !== 'equipment' && currentEditingPeriod && (
          <div className="space-y-4">
            {/* Header info of current selected period */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                    {currentEditingPeriod.periodNumber}
                  </span>
                  <span>Soạn thảo: Tiết {currentEditingPeriod.periodNumber} / {activePeriodsCount} tiết</span>
                </span>
                <span className="text-[10.5px] bg-white px-2 py-0.5 rounded text-indigo-700 font-mono font-semibold border border-indigo-200">
                  {currentEditingPeriod.durationMinutes || 45} phút
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Tiêu đề tiết học:
                </label>
                <input
                  type="text"
                  value={currentEditingPeriod.periodTitle}
                  onChange={(e) =>
                    handleUpdatePeriod(currentEditingPeriod.periodNumber, { periodTitle: e.target.value })
                  }
                  className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-xs font-bold text-slate-900 focus:border-indigo-600 outline-none"
                  placeholder="Nhập tiêu đề cho tiết dạy..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Mục tiêu trọng tâm của riêng tiết này:
                </label>
                <textarea
                  value={currentEditingPeriod.objective}
                  onChange={(e) =>
                    handleUpdatePeriod(currentEditingPeriod.periodNumber, { objective: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-white border border-indigo-200 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-600 outline-none leading-relaxed"
                  placeholder="Mục tiêu kiến thức, năng lực đạt được trong tiết học này..."
                />
              </div>
            </div>

            {/* Activities of this period */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Các hoạt động học trong Tiết {currentEditingPeriod.periodNumber}:</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {currentEditingPeriod.activities.length} hoạt động
                </span>
              </div>

              {currentEditingPeriod.activities.map((act, idx) => (
                <div key={act.id} className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  {/* Activity header */}
                  <div className="border-b border-slate-200 pb-2">
                    <input
                      type="text"
                      value={act.title}
                      onChange={(e) =>
                        handleUpdatePeriodActivity(currentEditingPeriod.periodNumber, act.id, {
                          title: e.target.value,
                        })
                      }
                      className="text-xs font-bold text-slate-900 w-full outline-none bg-transparent"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <input
                        type="text"
                        value={act.subtitle}
                        onChange={(e) =>
                          handleUpdatePeriodActivity(currentEditingPeriod.periodNumber, act.id, {
                            subtitle: e.target.value,
                          })
                        }
                        className="text-[11px] text-slate-500 w-3/4 outline-none bg-transparent"
                      />
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <input
                          type="number"
                          value={act.durationMinutes}
                          onChange={(e) =>
                            handleUpdatePeriodActivity(currentEditingPeriod.periodNumber, act.id, {
                              durationMinutes: Number(e.target.value) || 0,
                            })
                          }
                          className="w-10 text-right border-b border-slate-300 font-mono text-xs outline-none"
                        />
                        <span>phút</span>
                      </div>
                    </div>
                  </div>

                  {/* a) Mục tiêu */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">
                      a) Mục tiêu hoạt động:
                    </label>
                    <textarea
                      value={act.objective}
                      onChange={(e) =>
                        handleUpdatePeriodActivity(currentEditingPeriod.periodNumber, act.id, {
                          objective: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border border-slate-200 rounded p-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>

                  {/* b) Nội dung */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">
                      b) Nội dung (Nhiệm vụ học tập):
                    </label>
                    <textarea
                      value={act.content}
                      onChange={(e) =>
                        handleUpdatePeriodActivity(currentEditingPeriod.periodNumber, act.id, {
                          content: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border border-slate-200 rounded p-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>

                  {/* c) Sản phẩm */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">
                      c) Sản phẩm học tập:
                    </label>
                    <textarea
                      value={act.product}
                      onChange={(e) =>
                        handleUpdatePeriodActivity(currentEditingPeriod.periodNumber, act.id, {
                          product: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full border border-slate-200 rounded p-2 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-xs"
                    />
                  </div>

                  {/* d) Tổ chức thực hiện 4 bước */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      d) Tổ chức thực hiện (4 bước sư phạm CV 5512):
                    </label>
                    <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="font-semibold text-indigo-900 text-[11px] block">
                          Bước 1: Chuyển giao nhiệm vụ (Giao việc)
                        </span>
                        <textarea
                          value={act.implementation.assign}
                          onChange={(e) =>
                            handleUpdatePeriodStep(
                              currentEditingPeriod.periodNumber,
                              act.id,
                              'assign',
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs outline-none"
                        />
                      </div>

                      <div>
                        <span className="font-semibold text-indigo-900 text-[11px] block">
                          Bước 2: Thực hiện nhiệm vụ (Học sinh thực hiện)
                        </span>
                        <textarea
                          value={act.implementation.execute}
                          onChange={(e) =>
                            handleUpdatePeriodStep(
                              currentEditingPeriod.periodNumber,
                              act.id,
                              'execute',
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs outline-none"
                        />
                      </div>

                      <div>
                        <span className="font-semibold text-indigo-900 text-[11px] block">
                          Bước 3: Báo cáo, thảo luận (Trình bày & phản biện)
                        </span>
                        <textarea
                          value={act.implementation.discuss}
                          onChange={(e) =>
                            handleUpdatePeriodStep(
                              currentEditingPeriod.periodNumber,
                              act.id,
                              'discuss',
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs outline-none"
                        />
                      </div>

                      <div>
                        <span className="font-semibold text-indigo-900 text-[11px] block">
                          Bước 4: Kết luận, nhận định (Đánh giá & chuẩn hóa)
                        </span>
                        <textarea
                          value={act.implementation.conclude}
                          onChange={(e) =>
                            handleUpdatePeriodStep(
                              currentEditingPeriod.periodNumber,
                              act.id,
                              'conclude',
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full border border-slate-200 rounded p-1.5 bg-white text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dặn dò & Hướng dẫn tự học cho tiết sau */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
              <label className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <span>Dặn dò & Hướng dẫn tự học sau Tiết {currentEditingPeriod.periodNumber}:</span>
              </label>
              <textarea
                value={currentEditingPeriod.notes || ''}
                onChange={(e) =>
                  handleUpdatePeriod(currentEditingPeriod.periodNumber, { notes: e.target.value })
                }
                rows={2}
                className="w-full bg-white border border-amber-300/80 rounded-lg p-2 text-xs text-amber-900 outline-none"
                placeholder="Nhiệm vụ về nhà, chuẩn bị mẫu vật / bài tập cho tiết học tiếp theo..."
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // RIGHT PANE: LIVE DOCUMENT & BẢNG TIẾN TRÌNH THEO TIẾT
  // (CÓ KHẢ NĂNG INLINE EDITABLE TRỰC TIẾP TỪ TIẾT 1 ĐẾN TIẾT 5)
  // ----------------------------------------------------
  const displayPeriods =
    selectedPeriodNum === 'all'
      ? activePeriods
      : activePeriods.filter((p) => p.periodNumber === selectedPeriodNum);

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Action Bar for Live Document */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs no-print print:hidden">
        {/* Toggle view tabs */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode('table_editable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table_editable'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Bảng Tiến Trình Theo Tiết (Inline Editable)</span>
          </button>
          <button
            onClick={() => setViewMode('document_a4')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'document_a4'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Văn bản Kế hoạch bài dạy chuẩn A4</span>
          </button>
        </div>

        {/* Actions: Inline edit toggle, Quick Convert to Slides & Download KHBD */}
        <div className="flex items-center gap-2">
          {viewMode === 'table_editable' && (
            <button
              onClick={() => setInlineEditEnabled(!inlineEditEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                inlineEditEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {inlineEditEnabled ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{inlineEditEnabled ? 'Đang mở sửa trực tiếp' : 'Bật sửa trực tiếp'}</span>
            </button>
          )}

          {/* Chuyển Đổi Nhanh KHBD Thành Slide */}
          {onConvertToSlides && (
            <button
              onClick={onConvertToSlides}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all transform hover:scale-[1.02] cursor-pointer"
              title="Chuyển toàn bộ các tiết học thành Slide Deck 16:9"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Chuyển KHBD → Slide</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>
          )}

          {/* Dedicated: NÚT TẢI KHBD (Chỉ tải tệp Word .docx chuẩn A4 có đủ các tiết) */}
          <DownloadKhbdButton
            khbd={synchronizedKhbd}
            curriculum={curriculum}
          />
        </div>
      </div>

      {/* VIEW 1: BẢNG TIẾN TRÌNH THEO TIẾT (INLINE EDITABLE TABLE) */}
      {viewMode === 'table_editable' && (
        <div className="bg-white shadow-md border border-slate-200 rounded-xl overflow-hidden space-y-4">
          {/* Table Header Bar */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold">
                  Phụ lục IV · CV 5512/BGDĐT-GDTrH
                </span>
                <span className="text-[11px] text-slate-300">
                  {curriculum.subject} {curriculum.grade} · {curriculum.bookSeries}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                BẢNG TIẾN TRÌNH DẠY HỌC THEO TIẾT ({activePeriodsCount} TIẾT)
              </h2>
              <p className="text-xs text-indigo-200">
                Bài học: <strong className="text-white">{curriculum.lessonTitle}</strong>
              </p>
            </div>

            {/* Quick Period count switcher in Right Pane */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
                <span className="text-[10.5px] text-indigo-200 px-1.5 font-medium">Số tiết:</span>
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => handleSetPeriodCount(cnt)}
                    className={`w-5 h-5 rounded text-xs font-bold transition-all cursor-pointer ${
                      activePeriodsCount === cnt
                        ? 'bg-white text-indigo-900 shadow-2xs font-extrabold'
                        : 'text-indigo-200 hover:bg-white/20'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-indigo-300 italic">
                Tối đa 5 tiết/bài · Độc lập từng tiết
              </span>
            </div>
          </div>

          {/* Period Filter Tabs */}
          <div className="px-5 pt-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedPeriodNum('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPeriodNum === 'all'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả ({activePeriodsCount} tiết)
              </button>
              {activePeriods.map((p) => (
                <button
                  key={p.periodNumber}
                  type="button"
                  onClick={() => setSelectedPeriodNum(p.periodNumber)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedPeriodNum === p.periodNumber
                      ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>Tiết {p.periodNumber}</span>
                  <span className={`text-[10px] font-mono ${selectedPeriodNum === p.periodNumber ? 'text-indigo-200' : 'text-slate-400'}`}>
                    ({p.durationMinutes}p)
                  </span>
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Tổng thời lượng: {activePeriods.reduce((sum, p) => sum + (p.durationMinutes || 45), 0)} phút
            </span>
          </div>

          {/* Period Alert if exceeds 5 */}
          {periodAlert && (
            <div className="mx-5 flex items-center gap-2 text-xs text-rose-800 bg-rose-50 border border-rose-300 p-2.5 rounded-lg font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{periodAlert}</span>
            </div>
          )}

          {/* Render each Period in designated container */}
          <div className="p-5 space-y-6">
            {displayPeriods.map((period) => (
              <div 
                key={period.periodNumber} 
                className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-slate-50/30 space-y-4 p-4"
              >
                {/* Period Title Bar */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs font-mono">
                      0{period.periodNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      {inlineEditEnabled ? (
                        <input
                          type="text"
                          value={period.periodTitle}
                          onChange={(e) =>
                            handleUpdatePeriod(period.periodNumber, { periodTitle: e.target.value })
                          }
                          className="font-bold text-slate-900 text-sm bg-transparent border-b border-dashed border-blue-300 hover:border-blue-600 focus:border-blue-700 outline-none w-full"
                        />
                      ) : (
                        <h3 className="font-bold text-slate-900 text-sm truncate">{period.periodTitle}</h3>
                      )}
                      <span className="text-[11px] text-blue-800">
                        Tiến trình sư phạm độc lập cho Tiết {period.periodNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded text-xs text-slate-700 border border-slate-200 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {inlineEditEnabled ? (
                        <input
                          type="number"
                          value={period.durationMinutes}
                          onChange={(e) =>
                            handleUpdatePeriod(period.periodNumber, {
                              durationMinutes: Number(e.target.value) || 0,
                            })
                          }
                          className="w-10 text-center font-mono font-bold bg-transparent outline-none border-b border-slate-300"
                        />
                      ) : (
                        <span className="font-mono font-bold">{period.durationMinutes}</span>
                      )}
                      <span className="text-[10.5px] text-slate-500">phút</span>
                    </div>
                  </div>
                </div>

                {/* Period Objective */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                  <div className="text-[11px] font-bold text-indigo-950 uppercase tracking-wide">
                    * Mục tiêu trọng tâm của Tiết {period.periodNumber}:
                  </div>
                  {inlineEditEnabled ? (
                    <textarea
                      value={period.objective}
                      onChange={(e) =>
                        handleUpdatePeriod(period.periodNumber, { objective: e.target.value })
                      }
                      rows={2}
                      className="w-full border border-slate-200 rounded p-2 text-xs text-slate-800 focus:border-indigo-500 outline-none leading-relaxed"
                    />
                  ) : (
                    <p className="text-xs text-slate-700 italic">{period.objective}</p>
                  )}
                </div>

                {/* Activities within this Period */}
                <div className="space-y-3">
                  {period.activities.map((act, actIdx) => (
                    <div 
                      key={act.id} 
                      className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 hover:border-indigo-300 transition-colors"
                    >
                      {/* Activity Title Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0 font-mono">
                            {actIdx + 1}
                          </span>
                          <div>
                            {inlineEditEnabled ? (
                              <input
                                type="text"
                                value={act.title}
                                onChange={(e) =>
                                  handleUpdatePeriodActivity(period.periodNumber, act.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="font-bold text-slate-900 text-xs bg-transparent border-b border-dashed border-slate-300 hover:border-indigo-500 focus:border-indigo-600 outline-none"
                              />
                            ) : (
                              <h4 className="font-bold text-slate-900 text-xs">{act.title}</h4>
                            )}
                            <div className="text-[10.5px] text-slate-400">{act.subtitle}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{act.durationMinutes} phút</span>
                        </div>
                      </div>

                      {/* Content & Product Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 space-y-1">
                          <div className="font-bold text-slate-800 text-[11px]">
                            b) Nội dung (Nhiệm vụ):
                          </div>
                          {inlineEditEnabled ? (
                            <textarea
                              value={act.content}
                              onChange={(e) =>
                                handleUpdatePeriodActivity(period.periodNumber, act.id, {
                                  content: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:border-indigo-500 outline-none bg-white"
                            />
                          ) : (
                            <p className="text-xs text-slate-700">{act.content}</p>
                          )}
                        </div>

                        <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200 space-y-1">
                          <div className="font-bold text-slate-800 text-[11px]">
                            c) Sản phẩm học tập:
                          </div>
                          {inlineEditEnabled ? (
                            <textarea
                              value={act.product}
                              onChange={(e) =>
                                handleUpdatePeriodActivity(period.periodNumber, act.id, {
                                  product: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:border-indigo-500 outline-none bg-white"
                            />
                          ) : (
                            <p className="text-xs text-slate-700">{act.product}</p>
                          )}
                        </div>
                      </div>

                      {/* 4 Steps Implementation */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-800">
                          d) Tổ chức thực hiện (4 bước sư phạm CV 5512):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Step 1 */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-bold text-indigo-900 text-[10.5px] block mb-0.5">
                              1. Giao việc:
                            </span>
                            {inlineEditEnabled ? (
                              <textarea
                                value={act.implementation.assign}
                                onChange={(e) =>
                                  handleUpdatePeriodStep(period.periodNumber, act.id, 'assign', e.target.value)
                                }
                                rows={2}
                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white outline-none"
                              />
                            ) : (
                              <p className="text-xs text-slate-700">{act.implementation.assign}</p>
                            )}
                          </div>

                          {/* Step 2 */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-bold text-indigo-900 text-[10.5px] block mb-0.5">
                              2. Thực hiện:
                            </span>
                            {inlineEditEnabled ? (
                              <textarea
                                value={act.implementation.execute}
                                onChange={(e) =>
                                  handleUpdatePeriodStep(period.periodNumber, act.id, 'execute', e.target.value)
                                }
                                rows={2}
                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white outline-none"
                              />
                            ) : (
                              <p className="text-xs text-slate-700">{act.implementation.execute}</p>
                            )}
                          </div>

                          {/* Step 3 */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-bold text-indigo-900 text-[10.5px] block mb-0.5">
                              3. Báo cáo:
                            </span>
                            {inlineEditEnabled ? (
                              <textarea
                                value={act.implementation.discuss}
                                onChange={(e) =>
                                  handleUpdatePeriodStep(period.periodNumber, act.id, 'discuss', e.target.value)
                                }
                                rows={2}
                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white outline-none"
                              />
                            ) : (
                              <p className="text-xs text-slate-700">{act.implementation.discuss}</p>
                            )}
                          </div>

                          {/* Step 4 */}
                          <div className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="font-bold text-indigo-900 text-[10.5px] block mb-0.5">
                              4. Kết luận:
                            </span>
                            {inlineEditEnabled ? (
                              <textarea
                                value={act.implementation.conclude}
                                onChange={(e) =>
                                  handleUpdatePeriodStep(period.periodNumber, act.id, 'conclude', e.target.value)
                                }
                                rows={2}
                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white outline-none"
                              />
                            ) : (
                              <p className="text-xs text-slate-700">{act.implementation.conclude}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Period Notes / Homework */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 space-y-1">
                  <div className="text-[11px] font-bold text-amber-950">
                    * Dặn dò và hướng dẫn tự học sau Tiết {period.periodNumber}:
                  </div>
                  {inlineEditEnabled ? (
                    <textarea
                      value={period.notes || ''}
                      onChange={(e) =>
                        handleUpdatePeriod(period.periodNumber, { notes: e.target.value })
                      }
                      rows={2}
                      className="w-full bg-white border border-amber-300 rounded p-1.5 text-xs text-amber-900 outline-none"
                    />
                  ) : (
                    <p className="text-xs text-amber-900 italic">{period.notes || 'Không có ghi chú'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: VĂN BẢN KẾ HOẠCH BÀI DẠY IN A4 (PHỤ LỤC IV CV 5512 - TỔNG HỢP ĐỦ CÁC TIẾT) */}
      {viewMode === 'document_a4' && (
        <div 
          id="khbd-document-print-target" 
          className="w-full max-w-3xl bg-white shadow-md border border-slate-200 rounded-sm p-8 text-slate-900 text-xs leading-relaxed space-y-6 print:shadow-none print:border-none print:p-0 font-serif"
        >
          {/* Letterhead */}
          <div className="grid grid-cols-2 pb-4 border-b border-slate-300">
            <div className="text-center font-serif text-[11px] group relative">
              <div className="font-bold uppercase tracking-wider">{curriculum.schoolName || 'TRƯỜNG THCS GIẢNG VÕ'}</div>
              <div className="text-slate-600 font-semibold">TỔ CHUYÊN MÔN {(curriculum.subject || 'KHOA HỌC TỰ NHIÊN').toUpperCase()}</div>
              {onOpenTeacherModal && (
                <button
                  type="button"
                  onClick={onOpenTeacherModal}
                  className="no-print opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded font-sans inline-flex items-center gap-1 cursor-pointer"
                  title="Nhấn nút GV để sửa thông tin trường học & giáo viên"
                >
                  <Edit3 className="w-2.5 h-2.5 text-indigo-600" />
                  <span>Sửa thông tin trường/GV</span>
                </button>
              )}
            </div>
            <div className="text-center font-serif text-[11px]">
              <div className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div className="underline underline-offset-4 font-semibold">Độc lập - Tự do - Hạnh phúc</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-1 py-2">
            <h2 className="text-base font-bold text-slate-900 uppercase font-serif tracking-wide">
              KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
            </h2>
            <div className="font-semibold text-slate-900 text-sm">
              BÀI: {(curriculum.lessonTitle || 'TÊN BÀI HỌC').toUpperCase()}
            </div>
            <div className="text-slate-600 italic text-[11px] flex items-center justify-center gap-1.5 flex-wrap">
              <span>Môn học: {curriculum.subject} - {curriculum.grade} · Bộ sách: {curriculum.bookSeries} · Thời lượng: {curriculum.duration || `${activePeriodsCount} tiết`}</span>
              {onOpenTeacherModal && (
                <button
                  type="button"
                  onClick={onOpenTeacherModal}
                  className="no-print text-indigo-600 hover:text-indigo-800 p-0.5 rounded cursor-pointer"
                  title="Đổi số tiết dạy (Nhấn nút GV)"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* I. Mục tiêu */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1">
              I. MỤC TIÊU DẠY HỌC
            </h3>
            <div className="pl-3 space-y-2">
              <div>
                <strong className="text-slate-900">1. Kiến thức:</strong>
                <ul className="list-disc pl-5 space-y-1 mt-0.5 text-slate-800">
                  {khbd.objectives.knowledge.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-900">2. Năng lực:</strong>
                <div className="italic font-semibold text-slate-800 mt-1 pl-2">a) Năng lực đặc thù môn học:</div>
                <ul className="list-disc pl-7 space-y-0.5 mt-0.5 text-slate-800">
                  {khbd.objectives.domainCompetencies.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
                <div className="italic font-semibold text-slate-800 mt-1 pl-2">b) Năng lực chung:</div>
                <ul className="list-disc pl-7 space-y-0.5 mt-0.5 text-slate-800">
                  {(khbd.objectives.coreCompetencies || [
                    'Năng lực tự chủ và tự học: Nghiên cứu thông tin SGK, phân tích kết quả thí nghiệm.',
                    'Năng lực giao tiếp và hợp tác: Làm việc nhóm hiệu quả, thảo luận, phản biện tích cực.',
                    'Năng lực giải quyết vấn đề và sáng tạo: Vận dụng kiến thức bài học vào thực tiễn đời sống.'
                  ]).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong className="text-slate-900">3. Phẩm chất:</strong>
                <ul className="list-disc pl-5 space-y-1 mt-0.5 text-slate-800">
                  {khbd.objectives.qualities.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* II. Thiết bị dạy học */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1">
              II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
            </h3>
            <div className="pl-3 space-y-1">
              <div>
                <strong className="text-slate-900">1. Giáo viên:</strong>{' '}
                <span className="text-slate-800">{khbd.equipment.teacher.join('; ')}.</span>
              </div>
              <div>
                <strong className="text-slate-900">2. Học sinh:</strong>{' '}
                <span className="text-slate-800">{khbd.equipment.student.join('; ')}.</span>
              </div>
            </div>
          </div>

          {/* III. Tiến trình dạy học theo tiết */}
          <div className="space-y-5">
            <h3 className="font-bold text-slate-900 uppercase text-xs border-b border-slate-300 pb-1">
              III. TIẾN TRÌNH DẠY HỌC (CHUẨN CV 5512 - TỔNG SỐ {activePeriodsCount} TIẾT)
            </h3>

            {/* A. BẢNG TIẾN TRÌNH TỔNG QUAN THEO TIẾT */}
            <div className="space-y-1.5">
              <div className="font-bold text-indigo-950 text-xs uppercase tracking-wide">
                A. BẢNG TIẾN TRÌNH SƯ PHẠM TỔNG QUAN
              </div>
              <div className="overflow-x-auto border border-slate-300 rounded">
                <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 text-center font-bold">
                      <th className="border border-slate-300 p-2 w-[22%]">
                        Tiết &amp; Hoạt động học<br/>
                        <span className="font-normal italic text-[9.5px] text-slate-600">(Thời lượng)</span>
                      </th>
                      <th className="border border-slate-300 p-2 w-[25%]">Mục tiêu</th>
                      <th className="border border-slate-300 p-2 w-[26%]">Nội dung &amp; Sản phẩm</th>
                      <th className="border border-slate-300 p-2 w-[27%]">Tổ chức thực hiện (4 bước)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePeriods.map((period) => (
                      <React.Fragment key={period.periodNumber}>
                        {/* Period separator banner */}
                        <tr className="bg-indigo-50/70 text-indigo-900 font-bold border-y border-indigo-200">
                          <td colSpan={4} className="p-2 font-mono text-xs">
                            TIẾT {period.periodNumber}: {period.periodTitle.toUpperCase()} ({period.durationMinutes || 45} PHÚT)
                          </td>
                        </tr>

                        {period.activities.map((act, idx) => (
                          <tr key={act.id} className="align-top hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-semibold">
                              <div className="text-indigo-900 font-bold">HĐ {idx + 1}: {act.title}</div>
                              <div className="text-amber-800 italic text-[9.5px]">({act.durationMinutes} phút)</div>
                            </td>
                            <td className="border border-slate-300 p-2 text-slate-800">
                              {act.objective}
                            </td>
                            <td className="border border-slate-300 p-2 text-slate-800">
                              <div className="mb-1"><strong className="text-emerald-800">- ND:</strong> {act.content}</div>
                              <div><strong className="text-amber-800">- SP:</strong> {act.product}</div>
                            </td>
                            <td className="border border-slate-300 p-2 text-slate-800 space-y-0.5 text-[10px]">
                              <div><strong className="text-indigo-950">1. Giao:</strong> {act.implementation.assign}</div>
                              <div><strong className="text-indigo-950">2. Thực hiện:</strong> {act.implementation.execute}</div>
                              <div><strong className="text-indigo-950">3. Báo cáo:</strong> {act.implementation.discuss}</div>
                              <div><strong className="text-indigo-950">4. Kết luận:</strong> {act.implementation.conclude}</div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. CHI TIẾT TỪNG TIẾT DẠY (TỪ TIẾT 1 ĐẾN TIẾT 5) */}
            <div className="space-y-4 pt-2">
              <div className="font-bold text-indigo-950 text-xs uppercase tracking-wide">
                B. CHI TIẾT TỔ CHỨC CÁC HOẠT ĐỘNG DẠY HỌC (ĐẦY ĐỦ TỪ TIẾT 1 ĐẾN TIẾT {activePeriodsCount})
              </div>

              {activePeriods.map((period) => (
                <div 
                  key={period.periodNumber} 
                  className="border border-slate-300 rounded-lg p-4 bg-slate-50/30 space-y-3 break-inside-avoid"
                >
                  <div className="bg-indigo-100/70 border border-indigo-200 text-indigo-950 font-bold p-2.5 rounded text-xs flex items-center justify-between">
                    <span>TIẾT {period.periodNumber}: {period.periodTitle.toUpperCase()}</span>
                    <span className="font-mono text-[11px] text-indigo-800">({period.durationMinutes || 45} phút)</span>
                  </div>

                  <div className="text-slate-800 text-[11.5px] italic pl-1">
                    <strong>* Mục tiêu trọng tâm Tiết {period.periodNumber}:</strong> {period.objective}
                  </div>

                  {/* Activities in this period */}
                  <div className="space-y-3 pl-2">
                    {period.activities.map((act, idx) => (
                      <div key={act.id} className="border border-slate-200 bg-white rounded p-3 space-y-2">
                        <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                          <span className="text-sky-900">Hoạt động {idx + 1}: {act.title.toUpperCase()}</span>
                          <span className="text-slate-600 font-mono text-[10px]">({act.durationMinutes} phút)</span>
                        </div>
                        <div className="space-y-1 text-slate-800 text-xs">
                          <div>
                            <strong>a) Mục tiêu:</strong> <span>{act.objective}</span>
                          </div>
                          <div>
                            <strong>b) Nội dung:</strong> <span>{act.content}</span>
                          </div>
                          <div>
                            <strong>c) Sản phẩm:</strong> <span>{act.product}</span>
                          </div>
                          <div>
                            <strong>d) Tổ chức thực hiện:</strong>
                            <div className="pl-3 border-l-2 border-indigo-300 mt-1 space-y-1 text-[11px]">
                              <div>
                                <strong className="text-indigo-900 font-semibold">* Bước 1 (Giao việc):</strong>{' '}
                                <span>{act.implementation.assign}</span>
                              </div>
                              <div>
                                <strong className="text-indigo-900 font-semibold">* Bước 2 (Thực hiện):</strong>{' '}
                                <span>{act.implementation.execute}</span>
                              </div>
                              <div>
                                <strong className="text-indigo-900 font-semibold">* Bước 3 (Báo cáo, thảo luận):</strong>{' '}
                                <span>{act.implementation.discuss}</span>
                              </div>
                              <div>
                                <strong className="text-indigo-900 font-semibold">* Bước 4 (Kết luận, nhận định):</strong>{' '}
                                <span>{act.implementation.conclude}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {period.notes && (
                    <div className="text-[11px] text-amber-900 italic bg-amber-50/60 p-2 rounded border border-amber-200 pl-3">
                      <strong>* Dặn dò và hướng dẫn tự học sau Tiết {period.periodNumber}:</strong> {period.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 pt-6 text-center font-serif text-[11px] text-slate-700">
            <div>
              <div className="font-bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN</div>
              <div className="italic text-[10px] text-slate-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-16" />
            </div>
            <div>
              <div className="italic text-[10px] text-slate-500">Hà Nội, ngày ... tháng ... năm 202...</div>
              <div className="font-bold uppercase">GIÁO VIÊN SOẠN BÀI</div>
              <div className="italic text-[10px] text-slate-500">(Ký và ghi rõ họ tên)</div>
              <div className="h-12" />
              <div className="font-semibold text-slate-900 group">
                <span>{curriculum.teacherName}</span>
                {onOpenTeacherModal && (
                  <button
                    type="button"
                    onClick={onOpenTeacherModal}
                    className="no-print ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-700 hover:text-indigo-900 text-[10px] font-sans inline-flex items-center gap-0.5 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded cursor-pointer"
                    title="Nhấn nút GV để đổi họ và tên giáo viên"
                  >
                    <Edit3 className="w-2.5 h-2.5 text-indigo-600" />
                    <span>Sửa</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
