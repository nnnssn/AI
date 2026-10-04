import React, { useRef, useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface SplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  splitRatio: number; // percentage (e.g. 45)
  onSplitRatioChange: (ratio: number) => void;
  leftTitle: string;
  rightTitle: string;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  leftPane,
  rightPane,
  splitRatio,
  onSplitRatioChange,
  leftTitle,
  rightTitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const totalWidth = rect.width;
      let newRatio = Math.round((currentX / totalWidth) * 100);

      // Clamp between 20% and 80%
      if (newRatio < 25) newRatio = 25;
      if (newRatio > 75) newRatio = 75;

      onSplitRatioChange(newRatio);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onSplitRatioChange]);

  return (
    <main
      ref={containerRef}
      className={`flex-1 flex overflow-hidden relative ${
        isDragging ? 'select-none cursor-col-resize' : ''
      }`}
    >
      {/* LEFT PANE (Cấu hình / Soạn thảo / Ma trận) */}
      <section
        style={{ width: `${splitRatio}%` }}
        className="h-full border-r border-slate-200 bg-white flex flex-col overflow-hidden shrink-0 transition-[width] duration-75 no-print print:hidden"
      >
        {/* Left Pane Header */}
        <div className="h-10 border-b border-slate-200 px-4 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {leftTitle}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Module Editor</span>
        </div>

        {/* Left Pane Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {leftPane}
        </div>
      </section>

      {/* DRAGGABLE RESIZER BAR */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className="w-2 bg-slate-200 hover:bg-indigo-400 active:bg-indigo-600 cursor-col-resize shrink-0 transition-colors flex items-center justify-center group relative z-10 no-print print:hidden"
        title="Kéo sang trái hoặc phải để chỉnh tỉ lệ split-pane"
      >
        <div className="w-1 h-8 bg-slate-400 rounded-full group-hover:bg-white transition-colors flex items-center justify-center">
          <GripVertical className="w-3 h-3 text-slate-500 group-hover:text-white" />
        </div>
      </div>

      {/* RIGHT PANE (Live Preview / Màn chiếu / In ấn) */}
      <section className="flex-1 h-full bg-slate-100 flex flex-col overflow-hidden print:bg-white print:overflow-visible print:h-auto print:w-full">
        {/* Right Pane Header */}
        <div className="h-10 border-b border-slate-200 px-4 bg-white flex items-center justify-between shrink-0 shadow-2xs no-print print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {rightTitle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
              Live Synchronized
            </span>
          </div>
        </div>

        {/* Right Pane Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-start">
          {rightPane}
        </div>
      </section>
    </main>
  );
};
