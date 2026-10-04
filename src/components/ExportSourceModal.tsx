import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileCode, 
  Sparkles,
  Eye
} from 'lucide-react';
import { generateAlpineSingleFileSource } from '../utils/alpineSourceGenerator';

interface ExportSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportSourceModal: React.FC<ExportSourceModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [previewTab, setPreviewTab] = useState<'code' | 'iframe'>('code');

  if (!isOpen) return null;

  const htmlSource = generateAlpineSingleFileSource();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlSource);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlSource], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edtech-shell-alpine.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Mã Nguồn Hoàn Chỉnh: Single-file HTML + Tailwind CSS + Alpine.js
              </h3>
              <p className="text-[11px] text-slate-500">
                100% Độc lập, không cần Node.js hay build step. Chạy trực tiếp trên trình duyệt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View tab toggles */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setPreviewTab('code')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  previewTab === 'code' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Mã nguồn HTML
              </button>
              <button
                onClick={() => setPreviewTab('iframe')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  previewTab === 'iframe' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Xem thử trực tiếp
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép toàn bộ'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              title="Tải về file .html độc lập"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file .html</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden bg-slate-950 p-0 relative">
          {previewTab === 'code' ? (
            <div className="h-full overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-200 selection:bg-indigo-700">
              <pre>
                <code>{htmlSource}</code>
              </pre>
            </div>
          ) : (
            <iframe
              src="/standalone-alpine.html"
              title="Alpine.js Preview"
              className="w-full h-full border-0 bg-white"
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Single-file HTML bao gồm Tailwind CSS CDN + Alpine.js 3.x + Full SVG Icons</span>
          </div>
          <a
            href="/standalone-alpine.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-600 hover:underline font-medium"
          >
            <span>Mở trong cửa sổ mới</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
