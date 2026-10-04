import React, { useState, useEffect } from 'react';
import { 
  User, 
  School, 
  Clock, 
  Save, 
  X, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  GraduationCap,
  Building2,
  Check,
  AlertTriangle
} from 'lucide-react';
import { CurriculumContext } from '../types/edtech';
import {
  MIN_PERIODS,
  MAX_PERIODS,
  MAX_PERIODS_EXCEEDED_MESSAGE,
  INVALID_PERIODS_MESSAGE,
  validatePeriodCount,
  parsePeriodsFromDuration
} from '../utils/periodValidator';

export const TEACHER_INFO_STORAGE_KEY = 'edtech_teacher_info';

export interface SavedTeacherInfo {
  teacherName: string;
  schoolName: string;
  duration: string;
  periods?: number;
  updatedAt?: string;
}

interface TeacherInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: CurriculumContext;
  onSave: (updated: { teacherName: string; schoolName: string; duration: string }) => void;
}

export const TeacherInfoModal: React.FC<TeacherInfoModalProps> = ({
  isOpen,
  onClose,
  curriculum,
  onSave,
}) => {
  const [teacherName, setTeacherName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [periods, setPeriods] = useState<number>(2);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [useCustomDuration, setUseCustomDuration] = useState<boolean>(false);
  const [includeMinutes, setIncludeMinutes] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ teacherName?: string; schoolName?: string; periods?: string }>({});
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<boolean>(false);

  // Sync state when modal opens or curriculum updates
  useEffect(() => {
    if (isOpen) {
      setTeacherName(curriculum.teacherName || '');
      setSchoolName(curriculum.schoolName || '');

      // Parse period number from duration string (e.g., "2 tiết (90 phút)")
      const parsedPeriods = parsePeriodsFromDuration(curriculum.duration);
      setPeriods(parsedPeriods);

      const hasMinutes = curriculum.duration ? curriculum.duration.includes('phút') : true;
      setIncludeMinutes(hasMinutes);

      setCustomDuration(curriculum.duration || `${parsedPeriods} tiết (${parsedPeriods * 45} phút)`);
      setUseCustomDuration(false);
      setErrors({});
      setIsSavedSuccessfully(false);
    }
  }, [isOpen, curriculum]);

  // Compute final duration string
  const computedDuration = useCustomDuration
    ? customDuration.trim() || `${periods} tiết`
    : includeMinutes
    ? `${periods} tiết (${periods * 45} phút)`
    : `${periods} tiết`;

  if (!isOpen) return null;

  const handlePeriodChange = (rawVal: unknown) => {
    // If user clicked "+" or typed something greater than 5
    if (typeof rawVal === 'number' && rawVal > MAX_PERIODS) {
      setPeriods(MAX_PERIODS);
      setErrors((prev) => ({
        ...prev,
        periods: MAX_PERIODS_EXCEEDED_MESSAGE,
      }));
      if (!useCustomDuration) {
        setCustomDuration(includeMinutes ? `${MAX_PERIODS} tiết (${MAX_PERIODS * 45} phút)` : `${MAX_PERIODS} tiết`);
      }
      return;
    }

    const { isValid, value, errorMessage } = validatePeriodCount(rawVal);
    setPeriods(value);
    if (!useCustomDuration) {
      setCustomDuration(includeMinutes ? `${value} tiết (${value * 45} phút)` : `${value} tiết`);
    }

    if (!isValid && errorMessage) {
      setErrors((prev) => ({ ...prev, periods: errorMessage }));
    } else {
      setErrors((prev) => ({ ...prev, periods: undefined }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { teacherName?: string; schoolName?: string; periods?: string } = {};
    if (!teacherName.trim()) {
      newErrors.teacherName = 'Vui lòng nhập họ và tên giáo viên.';
    }
    if (!schoolName.trim()) {
      newErrors.schoolName = 'Vui lòng nhập tên trường / đơn vị công tác.';
    }

    // Strict validation for periods
    if (periods > MAX_PERIODS) {
      newErrors.periods = MAX_PERIODS_EXCEEDED_MESSAGE;
    } else if (periods < MIN_PERIODS) {
      newErrors.periods = INVALID_PERIODS_MESSAGE;
    }

    // If custom text duration was entered, ensure it does not specify > 5 periods
    if (useCustomDuration) {
      const match = customDuration.match(/(\d+)\s*tiết/i);
      if (match) {
        const parsed = parseInt(match[1], 10);
        if (parsed > MAX_PERIODS) {
          newErrors.periods = MAX_PERIODS_EXCEEDED_MESSAGE;
        } else if (parsed < MIN_PERIODS) {
          newErrors.periods = INVALID_PERIODS_MESSAGE;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalInfo: SavedTeacherInfo = {
      teacherName: teacherName.trim(),
      schoolName: schoolName.trim(),
      duration: computedDuration,
      periods: Math.min(MAX_PERIODS, Math.max(MIN_PERIODS, periods)),
      updatedAt: new Date().toISOString(),
    };

    // Save to LocalStorage
    try {
      localStorage.setItem(TEACHER_INFO_STORAGE_KEY, JSON.stringify(finalInfo));
    } catch (err) {
      console.warn('Không thể lưu thông tin giáo viên vào LocalStorage:', err);
    }

    // Call update callback
    onSave({
      teacherName: finalInfo.teacherName,
      schoolName: finalInfo.schoolName,
      duration: finalInfo.duration,
    });

    setIsSavedSuccessfully(true);

    // Close after short feedback
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-modal-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-bold text-white shadow-inner shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Nghiệp vụ Giáo viên
                </span>
                <span className="text-[11px] text-indigo-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Tự động lưu LocalStorage
                </span>
              </div>
              <h2 id="teacher-modal-title" className="text-base font-bold text-white mt-0.5">
                Cấu Hình Thông Tin Giáo Viên & Bài Dạy
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Quick Notice */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3 text-[11px] text-indigo-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Thông tin sau khi lưu sẽ được <strong>lưu trữ vĩnh viễn trên trình duyệt này</strong> và <strong>tự động đồng bộ</strong> vào phần đầu văn bản KHBD, chữ ký giáo viên, Slide bài giảng và các tệp xuất Word (.docx).
            </p>
          </div>

          <form id="teacher-form" onSubmit={handleSave} className="space-y-4">
            {/* Field 1: Họ và tên giáo viên */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Họ và tên giáo viên <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Xuất hiện tại chữ ký cuối KHBD</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => {
                    setTeacherName(e.target.value);
                    if (errors.teacherName) setErrors((prev) => ({ ...prev, teacherName: undefined }));
                  }}
                  placeholder="VD: Cô Lê Thị Thanh Thảo hoặc Thầy Nguyễn Văn An"
                  className={`w-full bg-slate-50 focus:bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium ${
                    errors.teacherName
                      ? 'border-rose-400 ring-2 ring-rose-100 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  autoFocus
                />
              </div>
              {errors.teacherName ? (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.teacherName}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 mt-1">
                  <span>Gợi ý mẫu:</span>
                  <button
                    type="button"
                    onClick={() => setTeacherName('Cô Lê Thị Thanh Thảo')}
                    className="text-indigo-600 hover:underline hover:text-indigo-800"
                  >
                    Cô Lê Thị Thanh Thảo
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setTeacherName('Thầy Trần Khoa')}
                    className="text-indigo-600 hover:underline hover:text-indigo-800"
                  >
                    Thầy Trần Khoa
                  </button>
                </div>
              )}
            </div>

            {/* Field 2: Tên trường học */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-indigo-600" />
                  Tên trường / Đơn vị công tác <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Xuất hiện tại tiêu ngữ góc trái KHBD</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => {
                    setSchoolName(e.target.value);
                    if (errors.schoolName) setErrors((prev) => ({ ...prev, schoolName: undefined }));
                  }}
                  placeholder="VD: THCS Chu Văn An, THCS Giảng Võ, THPT Chuyên..."
                  className={`w-full bg-slate-50 focus:bg-white border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium ${
                    errors.schoolName
                      ? 'border-rose-400 ring-2 ring-rose-100 focus:border-rose-500'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.schoolName ? (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {errors.schoolName}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 mt-1">
                  <span>Trường tham khảo:</span>
                  <button
                    type="button"
                    onClick={() => setSchoolName('THCS Chu Văn An')}
                    className="text-indigo-600 hover:underline hover:text-indigo-800"
                  >
                    THCS Chu Văn An
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setSchoolName('THCS Giảng Võ')}
                    className="text-indigo-600 hover:underline hover:text-indigo-800"
                  >
                    THCS Giảng Võ
                  </button>
                </div>
              )}
            </div>

            {/* Field 3: Số tiết dạy */}
            <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  Số tiết dạy của bài (Thời lượng)
                </label>
                <div className="text-[11px] text-slate-500 font-medium">
                  Hiện tại: <strong className="text-indigo-700">{computedDuration}</strong>
                </div>
              </div>

              {/* Quick Period Selector Buttons: Tiết 1 đến Tiết 5 */}
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = !useCustomDuration && periods === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setUseCustomDuration(false);
                        handlePeriodChange(num);
                      }}
                      className={`py-2 px-1 rounded-lg text-center transition-all border font-semibold ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                      title={`Chọn ${num} tiết (${num * 45} phút)`}
                    >
                      <div className="text-xs font-bold">{num} tiết</div>
                      <div className={`text-[9.5px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'} font-normal`}>
                        {num * 45}p
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Error banner when exceeding 5 periods or invalid input */}
              {errors.periods && (
                <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50 border border-rose-300 p-2.5 rounded-lg font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errors.periods}</span>
                </div>
              )}

              {/* Fine-tuning Stepper & Options */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200">
                {/* Stepper (Strictly 1 to 5) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-600 font-medium">Tùy chỉnh số tiết (1 - 5):</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomDuration(false);
                        if (periods <= MIN_PERIODS) {
                          setErrors((prev) => ({ ...prev, periods: INVALID_PERIODS_MESSAGE }));
                          return;
                        }
                        handlePeriodChange(periods - 1);
                      }}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                      title="Giảm 1 tiết"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={periods}
                      onChange={(e) => {
                        setUseCustomDuration(false);
                        handlePeriodChange(e.target.value);
                      }}
                      className="w-10 text-center font-mono font-bold text-xs outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomDuration(false);
                        if (periods >= MAX_PERIODS) {
                          setErrors((prev) => ({ ...prev, periods: MAX_PERIODS_EXCEEDED_MESSAGE }));
                          return;
                        }
                        handlePeriodChange(periods + 1);
                      }}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                      title="Tăng 1 tiết (Tối đa 5 tiết)"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">tiết</span>
                </div>

                {/* Minute toggle */}
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={includeMinutes}
                    onChange={(e) => {
                      setIncludeMinutes(e.target.checked);
                      setUseCustomDuration(false);
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Kèm số phút ({periods * 45} phút)</span>
                </label>
              </div>

              <div className="text-[10px] text-slate-500 italic">
                * Quy định: Số tiết dạy của một bài tối đa là 5 tiết.
              </div>

              {/* Custom Duration text input option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setUseCustomDuration(!useCustomDuration)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium underline-offset-2 hover:underline"
                >
                  {useCustomDuration ? '← Quay lại chọn số tiết chuẩn' : '+ Nhập chuỗi thời lượng tự do (VD: 5 tiết - Tuần 15-16)'}
                </button>
                {useCustomDuration && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customDuration}
                      onChange={(e) => {
                        setCustomDuration(e.target.value);
                        // validate custom text
                        const match = e.target.value.match(/(\d+)\s*tiết/i);
                        if (match && parseInt(match[1], 10) > MAX_PERIODS) {
                          setErrors((prev) => ({ ...prev, periods: MAX_PERIODS_EXCEEDED_MESSAGE }));
                        } else {
                          setErrors((prev) => ({ ...prev, periods: undefined }));
                        }
                      }}
                      placeholder="VD: 5 tiết (225 phút) hoặc 3 tiết (Tuần 14-15)"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:border-indigo-600 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Xem trước cách hiển thị trên văn bản KHBD:
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-normal font-serif">
                  Mẫu A4 chuẩn CV 5512
                </span>
              </div>

              <div className="bg-white border border-slate-300 rounded-lg p-3 text-[10.5px] font-serif shadow-2xs space-y-2">
                {/* Header letterhead preview */}
                <div className="grid grid-cols-2 pb-2 border-b border-slate-200 text-center">
                  <div>
                    <div className="font-bold uppercase text-slate-900 truncate">
                      {schoolName.trim().toUpperCase() || 'TÊN TRƯỜNG CỦA BẠN'}
                    </div>
                    <div className="text-slate-500 font-sans text-[9.5px]">TỔ CHUYÊN MÔN {curriculum.subject.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 uppercase text-[9.5px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="underline text-slate-600 text-[9.5px]">Độc lập - Tự do - Hạnh phúc</div>
                  </div>
                </div>

                {/* Title & Duration preview */}
                <div className="text-center pt-1">
                  <div className="font-bold uppercase text-indigo-950 text-xs">
                    KẾ HOẠCH BÀI DẠY: {(curriculum.lessonTitle || 'BÀI HỌC').toUpperCase()}
                  </div>
                  <div className="text-slate-600 italic text-[10px]">
                    Thời lượng: <strong className="text-slate-900 font-semibold">{computedDuration}</strong> · Khối {curriculum.grade}
                  </div>
                </div>

                {/* Signature box preview */}
                <div className="pt-2 grid grid-cols-2 text-center border-t border-slate-100">
                  <div className="text-slate-400 italic text-[9.5px]">Tổ trưởng chuyên môn duyệt</div>
                  <div>
                    <div className="font-bold uppercase text-slate-800 text-[10px]">GIÁO VIÊN SOẠN BÀI</div>
                    <div className="text-indigo-900 font-bold text-xs mt-2 truncate">
                      {teacherName.trim() || 'Họ và tên giáo viên'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer / Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đồng bộ tức thì mọi module</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto w-full sm:w-auto">
            {/* Nút HỦY */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors shadow-2xs"
            >
              HỦY
            </button>

            {/* Nút LƯU THÔNG TIN */}
            <button
              type="submit"
              form="teacher-form"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-98"
            >
              {isSavedSuccessfully ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>ĐÃ LƯU THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-100" />
                  <span>LƯU THÔNG TIN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
