import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { LessonPlan5512, CurriculumContext } from '../types/edtech';
import { downloadKhbdDocx } from '../utils/khbdExport';

interface DownloadKhbdButtonProps {
  khbd: LessonPlan5512;
  curriculum: CurriculumContext;
  documentElementId?: string; // Kept for interface compatibility
  variant?: 'primary' | 'topbar' | 'compact';
  className?: string;
}

export const DownloadKhbdButton: React.FC<DownloadKhbdButtonProps> = ({
  khbd,
  curriculum,
  variant = 'primary',
  className = '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-dismiss toast notification after 4.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleDownloadDocx = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isGenerating) return;

    setIsGenerating(true);
    setToastMessage(null);
    setErrorMessage(null);

    try {
      const filename = await downloadKhbdDocx(khbd, curriculum);
      setToastMessage(`Đã tải thành công tệp Word: ${filename}`);
    } catch (error) {
      console.error('Lỗi khi tạo tệp Word (.docx):', error);
      setErrorMessage('Có lỗi xảy ra khi tạo tệp Word (.docx). Vui lòng thử lại!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Toast Notification on Success */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Tải tệp Word (.docx) thành công
            </div>
            <div className="text-xs text-slate-200 mt-0.5 max-w-sm truncate font-mono">
              {toastMessage}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Chuẩn khổ giấy A4 · Font Times New Roman 13pt · Đầy đủ 4 hoạt động
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer p-1"
            title="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toast Notification on Error */}
      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-rose-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Lỗi tạo tệp Word
            </div>
            <div className="text-xs text-rose-100 mt-0.5">
              {errorMessage}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-300 hover:text-white text-xs ml-2 cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Single-Click "TẢI KHBD" Button: Only Word (.docx) */}
      <button
        type="button"
        onClick={handleDownloadDocx}
        disabled={isGenerating}
        className={`flex items-center gap-2 font-bold transition-all disabled:opacity-75 disabled:cursor-wait cursor-pointer ${
          variant === 'topbar'
            ? 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white text-xs px-3 py-1.5 rounded-md shadow-xs active:scale-98'
            : variant === 'compact'
            ? 'bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xs active:scale-98'
            : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-600 hover:to-indigo-600 text-white text-xs px-4 py-2 rounded-lg shadow-sm border border-blue-500/30 active:scale-98'
        }`}
        title="Nhấn để tải ngay Kế hoạch bài dạy định dạng Microsoft Word (.docx) khổ A4"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
        ) : (
          <FileText className="w-4 h-4 text-blue-100" />
        )}

        <span className="tracking-wide">
          {isGenerating ? 'Đang tạo Word...' : 'TẢI KHBD'}
        </span>

        {/* Word (.docx) badge */}
        <span className="hidden sm:inline-block text-[10px] bg-blue-950/60 text-blue-200 px-1.5 py-0.5 rounded font-mono font-bold border border-blue-400/30">
          .docx
        </span>
      </button>
    </div>
  );
};
