import React, { useState } from 'react';
import { 
  CheckSquare, 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  EyeOff, 
  Sliders, 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { MatrixTopic7991, ExamQuestion, CurriculumContext } from '../../types/edtech';
import { exportExamToWord, exportMatrixSpecificationToWord } from '../../utils/wordExport';

interface ExamBank7991ModuleProps {
  matrix: MatrixTopic7991[];
  onMatrixChange: (updated: MatrixTopic7991[]) => void;
  questions: ExamQuestion[];
  onQuestionsChange: (updated: ExamQuestion[]) => void;
  curriculum: CurriculumContext;
  activeTab: 'matrix' | 'spec' | 'questions';
  onTabChange: (tab: 'matrix' | 'spec' | 'questions') => void;
  isRightPane?: boolean;
}

export const ExamBank7991Module: React.FC<ExamBank7991ModuleProps> = ({
  matrix,
  onMatrixChange,
  questions,
  onQuestionsChange,
  curriculum,
  activeTab,
  onTabChange,
  isRightPane = false,
}) => {
  // Slider state for 40-30-30 ratio (Biết - Hiểu - Vận dụng)
  const [ratioKnow, setRatioKnow] = useState(40);
  const [ratioUnderstand, setRatioUnderstand] = useState(30);
  const [ratioApply, setRatioApply] = useState(30);

  // Right pane interactive state
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [selectedStudentAnswers, setSelectedStudentAnswers] = useState<Record<string, string>>({});
  const [selectedTfAnswers, setSelectedTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});
  const [shortAnswerChecked, setShortAnswerChecked] = useState<Record<string, boolean>>({});

  // Calculations
  const totalScore = 10.0;
  const isRatioValid = ratioKnow + ratioUnderstand + ratioApply === 100;

  // Counts by part
  const mcQuestions = questions.filter((q) => q.type === 'mc');
  const tfQuestions = questions.filter((q) => q.type === 'tf');
  const saQuestions = questions.filter((q) => q.type === 'sa');
  const essayQuestions = questions.filter((q) => q.type === 'essay');

  const scorePartI = 3.0;   // 30%
  const scorePartII = 2.0;  // 20%
  const scorePartIII = 2.0; // 20%
  const scorePartIV = 3.0;  // 30%

  // Handlers for Slider adjustments (Total locks strictly at 100% / 10.0 pts)
  const handleKnowChange = (val: number) => {
    setRatioKnow(val);
    const remain = 100 - val;
    const half = Math.floor(remain / 2);
    setRatioUnderstand(half);
    setRatioApply(remain - half);
  };

  const handleUnderstandChange = (val: number) => {
    setRatioUnderstand(val);
    const remain = 100 - val - ratioKnow;
    setRatioApply(Math.max(0, remain));
  };

  const resetStandardRatio = () => {
    setRatioKnow(40);
    setRatioUnderstand(30);
    setRatioApply(30);
  };

  // Toggle TF answer by student
  const handleToggleTf = (questionId: string, letter: string, value: boolean) => {
    setSelectedTfAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [letter]: value,
      },
    }));
  };

  // LEFT PANE: BẢNG THIẾT LẬP MA TRẬN ĐỀ (SLIDER 40-30-30, BỘ ĐẾM CÂU HỎI)
  if (!isRightPane) {
    return (
      <div className="p-4 space-y-5 text-xs">
        {/* Banner chuẩn Công văn 7991 */}
        <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200/80 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-xs">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Quy Chuẩn Công Văn 7991/BGDĐT-GDTrH</span>
            </div>
            <span className="text-[10px] font-mono bg-white text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
              10.0 Điểm Khóa Chặt
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Quy định cấu trúc ma trận định kì mới cho cấp THCS & THPT: 4 dạng câu hỏi, phân bổ năng lực và tỉ lệ điểm lũy tiến khoa học.
          </p>
        </div>

        {/* 1. SLIDER PHÂN BỔ TỈ LỆ 40 - 30 - 30 (BIẾT - HIỂU - VẬN DỤNG) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Thiết lập tỉ lệ mức độ đánh giá</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Tổng điểm: <strong className="text-indigo-600 font-mono">10.0 điểm (100%)</strong>
              </span>
            </div>
            <button
              onClick={resetStandardRatio}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
              title="Khôi phục chuẩn 40% Biết - 30% Hiểu - 30% Vận dụng"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Chuẩn 40-30-30</span>
            </button>
          </div>

          {/* Visual Ratio Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
            <div
              style={{ width: `${ratioKnow}%` }}
              className="bg-blue-500 h-full transition-all duration-200 relative group"
              title={`Nhận biết: ${ratioKnow}% (${(ratioKnow / 10).toFixed(1)}đ)`}
            />
            <div
              style={{ width: `${ratioUnderstand}%` }}
              className="bg-amber-500 h-full transition-all duration-200"
              title={`Thông hiểu: ${ratioUnderstand}% (${(ratioUnderstand / 10).toFixed(1)}đ)`}
            />
            <div
              style={{ width: `${ratioApply}%` }}
              className="bg-emerald-500 h-full transition-all duration-200"
              title={`Vận dụng: ${ratioApply}% (${(ratioApply / 10).toFixed(1)}đ)`}
            />
          </div>

          {/* Individual Sliders */}
          <div className="space-y-2.5 pt-1">
            {/* Nhận biết */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Nhận biết (Biết)</span>
                </span>
                <span className="font-mono font-bold text-blue-700">
                  {ratioKnow}% · {(ratioKnow / 10).toFixed(1)}đ
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="60"
                step="5"
                value={ratioKnow}
                onChange={(e) => handleKnowChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Thông hiểu */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Thông hiểu (Hiểu)</span>
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {ratioUnderstand}% · {(ratioUnderstand / 10).toFixed(1)}đ
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={ratioUnderstand}
                onChange={(e) => handleUnderstandChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Vận dụng */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Vận dụng (VD / VDC)</span>
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {ratioApply}% · {(ratioApply / 10).toFixed(1)}đ
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={ratioApply}
                disabled
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-not-allowed accent-emerald-600 opacity-80"
              />
            </div>
          </div>
        </div>

        {/* 2. BỘ ĐẾM SỐ LƯỢNG CÂU HỎI THEO 4 PHẦN CHUẨN CV 7991 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
            <span>Cấu trúc 4 phần đề kiểm tra</span>
            <span className="text-[10px] text-slate-400">Chuẩn hóa điểm số</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Phần I */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Phần I: TN 4 Lựa chọn</span>
                <span className="font-mono font-bold text-indigo-600">{scorePartI.toFixed(1)}đ</span>
              </div>
              <div className="text-[10px] text-slate-500">
                12 câu · 0,25đ/câu · 30% tổng điểm
              </div>
              <div className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                {mcQuestions.length} câu đã nạp
              </div>
            </div>

            {/* Phần II */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Phần II: Đúng / Sai</span>
                <span className="font-mono font-bold text-indigo-600">{scorePartII.toFixed(1)}đ</span>
              </div>
              <div className="text-[10px] text-slate-500">
                2 câu (8 lệnh a,b,c,d) · 20% điểm
              </div>
              <div className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                {tfQuestions.length} câu (4 ý/câu)
              </div>
            </div>

            {/* Phần III */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Phần III: Trả lời ngắn</span>
                <span className="font-mono font-bold text-indigo-600">{scorePartIII.toFixed(1)}đ</span>
              </div>
              <div className="text-[10px] text-slate-500">
                4 câu · 0,5đ/câu · 20% điểm
              </div>
              <div className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                {saQuestions.length} câu đã nạp
              </div>
            </div>

            {/* Phần IV */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Phần IV: Tự luận</span>
                <span className="font-mono font-bold text-indigo-600">{scorePartIV.toFixed(1)}đ</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Barem chi tiết từng bước · 30% điểm
              </div>
              <div className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-100 inline-block">
                {essayQuestions.length} bài toán tự luận
              </div>
            </div>
          </div>
        </div>

        {/* 3. TABS MA TRẬN & ĐẶC TẢ */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => onTabChange('matrix')}
            className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-colors ${
              activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ma trận đề (PL 1)
          </button>
          <button
            onClick={() => onTabChange('spec')}
            className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-colors ${
              activeTab === 'spec' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bản đặc tả (PL 2)
          </button>
          <button
            onClick={() => onTabChange('questions')}
            className={`flex-1 py-1.5 rounded-md font-semibold text-center transition-colors ${
              activeTab === 'questions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ngân hàng câu hỏi
          </button>
        </div>

        {/* Sub-view: Ma trận chi tiết các chủ đề */}
        {activeTab === 'matrix' && (
          <div className="space-y-3">
            {matrix.map((topic, tIdx) => (
              <div key={topic.id} className="border border-slate-200 rounded-xl p-3 bg-white space-y-2.5 shadow-2xs">
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
                    Chủ đề {tIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={topic.subTopic}
                    onChange={(e) => {
                      const updated = [...matrix];
                      updated[tIdx] = { ...topic, subTopic: e.target.value };
                      onMatrixChange(updated);
                    }}
                    className="w-full font-semibold text-slate-800 text-xs border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none pb-0.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700 block">TNKQ 4 lựa chọn (30%)</span>
                    <div className="flex items-center gap-1.5 mt-1 font-mono">
                      <span>B:{topic.multipleChoice.know}</span>
                      <span>· H:{topic.multipleChoice.understand}</span>
                      <span>· VD:{topic.multipleChoice.apply}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700 block">Đúng - Sai 4 ý (20%)</span>
                    <div className="flex items-center gap-1.5 mt-1 font-mono">
                      <span>B:{topic.trueFalse.know}</span>
                      <span>· H:{topic.trueFalse.understand}</span>
                      <span>· VD:{topic.trueFalse.apply}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sub-view: Bản đặc tả chi tiết */}
        {activeTab === 'spec' && (
          <div className="space-y-3">
            {matrix.map((item, idx) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
                <span className="font-bold text-slate-900 block text-xs">
                  {idx + 1}. {item.subTopic}
                </span>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                    Yêu cầu cần đạt & Mã năng lực (NL):
                  </label>
                  <textarea
                    value={item.competenciesReq}
                    onChange={(e) => {
                      const updated = [...matrix];
                      updated[idx].competenciesReq = e.target.value;
                      onMatrixChange(updated);
                    }}
                    rows={2}
                    className="w-full border border-slate-200 rounded p-1.5 text-xs bg-slate-50"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sub-view: Danh sách câu hỏi */}
        {activeTab === 'questions' && (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="border border-slate-200 rounded-xl p-3 bg-white space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-700 text-xs">
                    {q.typeLabel} - Câu {q.number} ({q.score}đ)
                  </span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                    {q.level}
                  </span>
                </div>
                <textarea
                  value={q.content}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[idx].content = e.target.value;
                    onQuestionsChange(updated);
                  }}
                  rows={2}
                  className="w-full border border-slate-200 rounded p-1.5 text-xs bg-slate-50"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // RIGHT PANE: LIVE DOCUMENT HIỂN THỊ ĐÚNG 4 PHẦN CHUẨN CÔNG VĂN 7991
  return (
    <div className="w-full max-w-3xl flex flex-col items-center space-y-4">
      {/* Top Action Bar for Live Document */}
      <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-xs no-print print:hidden">
        {/* Toggle Đáp án / Chấm thử */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              showAnswerKey
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAnswerKey ? 'Ẩn đáp án & Barem' : 'Hiện đáp án & Barem'}</span>
          </button>
        </div>

        {/* Nút tải file Word theo yêu cầu Scope 2 */}
        <div className="flex items-center gap-2">
          {/* Nút 1: Tải file Word chuẩn Bộ GD&ĐT */}
          <button
            onClick={() => exportExamToWord(curriculum, matrix, questions, showAnswerKey)}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            title="Xuất file Microsoft Word (.doc) đề kiểm tra chuẩn thể thức văn bản Bộ GD&ĐT"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file Word chuẩn Bộ GD&ĐT</span>
          </button>

          {/* Nút 2: Tải Ma Trận Đặc Tả */}
          <button
            onClick={() => exportMatrixSpecificationToWord(curriculum, matrix, questions)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            title="Xuất file Word bảng Ma trận Phụ lục 1 và Bản đặc tả Phụ lục 2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Tải Ma Trận Đặc Tả</span>
          </button>
        </div>
      </div>

      {/* Main A4 Document Container */}
      <div className="w-full bg-white shadow-md border border-slate-200 rounded-sm p-8 text-slate-800 text-xs leading-relaxed space-y-6 print:shadow-none print:border-none print:p-0">
        
        {/* Tiêu ngữ hành chính chuẩn */}
        <div className="grid grid-cols-2 pb-4 border-b border-slate-300">
          <div className="text-center font-serif text-[11px]">
            <div className="font-bold uppercase tracking-wider">{curriculum.schoolName}</div>
            <div className="text-slate-600">NĂM HỌC 2024 - 2025</div>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5">Mã đề kiểm tra: 7991-A</div>
          </div>
          <div className="text-center font-serif text-[11px]">
            <div className="font-bold uppercase">ĐỀ KIỂM TRA ĐỊNH KÌ THEO CÔNG VĂN 7991</div>
            <div className="italic font-sans">
              Môn: {curriculum.subject} - {curriculum.grade} · Thời gian: 45 phút
            </div>
            <div className="text-slate-500 font-sans text-[10px] mt-0.5">
              (Áp dụng từ học kì II năm học 2024 - 2025)
            </div>
          </div>
        </div>

        {/* Khung phân bổ điểm 4 phần */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-4 gap-2 text-center text-[11px]">
          <div>
            <span className="block text-slate-500">Phần I: TN 4 lựa chọn</span>
            <strong className="text-slate-900 font-bold">{scorePartI.toFixed(1)} điểm (30%)</strong>
          </div>
          <div>
            <span className="block text-slate-500">Phần II: Đúng / Sai</span>
            <strong className="text-slate-900 font-bold">{scorePartII.toFixed(1)} điểm (20%)</strong>
          </div>
          <div>
            <span className="block text-slate-500">Phần III: TL ngắn</span>
            <strong className="text-slate-900 font-bold">{scorePartIII.toFixed(1)} điểm (20%)</strong>
          </div>
          <div>
            <span className="block text-slate-500">Phần IV: Tự luận</span>
            <strong className="text-slate-900 font-bold">{scorePartIV.toFixed(1)} điểm (30%)</strong>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PHẦN I: TRẮC NGHIỆM 4 LỰA CHỌN (3.0đ) KÈM KEY ĐÁP ÁN      */}
        {/* ======================================================== */}
        <div className="space-y-3.5">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 điểm)
            </h4>
            <span className="font-mono text-[10px] text-slate-500">12 câu · 0,25đ/câu</span>
          </div>
          <p className="italic text-slate-500 text-[11px]">
            Thí sinh trả lời từ câu 1 đến câu {mcQuestions.length}. Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng nhất.
          </p>

          <div className="space-y-3">
            {mcQuestions.map((q) => {
              const selectedOpt = selectedStudentAnswers[q.id];
              return (
                <div key={q.id} className="space-y-1.5 pl-2 border-l-2 border-slate-100 hover:border-indigo-400 transition-colors py-0.5">
                  <div className="font-semibold text-slate-900">
                    <span className="text-indigo-700">Câu {q.number}.</span> {q.content}
                  </div>
                  
                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3 pt-1">
                    {q.options?.map((opt, i) => {
                      const optPrefix = opt.substring(0, 2);
                      const isCorrect = q.correctAnswer?.startsWith(optPrefix);
                      const isSelected = selectedOpt === optPrefix;
                      return (
                        <button
                          key={i}
                          onClick={() =>
                            setSelectedStudentAnswers((prev) => ({
                              ...prev,
                              [q.id]: optPrefix,
                            }))
                          }
                          className={`text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-500 font-semibold text-indigo-950'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          } ${
                            showAnswerKey && isCorrect
                              ? 'ring-2 ring-emerald-500 bg-emerald-50/60 font-semibold text-emerald-950'
                              : ''
                          }`}
                        >
                          <span>{opt}</span>
                          {showAnswerKey && isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              ĐÁP ÁN
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Giải thích khi bật Key */}
                  {showAnswerKey && q.explanation && (
                    <div className="mt-1 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                      <strong>Hướng dẫn:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PHẦN II: TRẮC NGHIỆM ĐÚNG/SAI (2.0đ) VỚI BADGE CHỌN TRỰC QUAN */}
        {/* ======================================================== */}
        <div className="space-y-3.5 pt-2">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (2,0 điểm)
            </h4>
            <span className="font-mono text-[10px] text-slate-500">2 câu · 4 lệnh/câu</span>
          </div>
          
          {/* Thông báo quy tắc tính điểm chuẩn 7991 */}
          <div className="bg-amber-50/70 border border-amber-200 text-amber-900 rounded-lg p-2.5 text-[11px] leading-relaxed">
            <strong>Thang điểm chuẩn CV 7991:</strong> Trong mỗi câu hỏi có 4 ý a, b, c, d:
            <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-amber-800">
              <li>Thí sinh chỉ lựa chọn chính xác 01 ý: được <strong>0,10 điểm</strong>.</li>
              <li>Thí sinh lựa chọn chính xác 02 ý: được <strong>0,25 điểm</strong>.</li>
              <li>Thí sinh lựa chọn chính xác 03 ý: được <strong>0,50 điểm</strong>.</li>
              <li>Thí sinh lựa chọn chính xác cả 04 ý: được <strong>1,00 điểm</strong>.</li>
            </ul>
          </div>

          <div className="space-y-4">
            {tfQuestions.map((q) => {
              const currentTfState = selectedTfAnswers[q.id] || {};
              return (
                <div key={q.id} className="space-y-2 pl-2 border-l-2 border-slate-100 hover:border-indigo-400 transition-colors py-0.5">
                  <div className="font-semibold text-slate-900">
                    <span className="text-indigo-700">Câu {q.number}.</span> {q.content}
                  </div>

                  {/* 4 Mệnh đề a, b, c, d với Badge chọn Đúng / Sai trực quan */}
                  <div className="space-y-1.5 pl-3">
                    {q.tfItems?.map((item) => {
                      const userChoice = currentTfState[item.letter];
                      const isCorrect = userChoice === item.isCorrect;
                      return (
                        <div
                          key={item.letter}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/70 rounded-lg border border-slate-200 gap-2 transition-colors"
                        >
                          <div className="text-slate-800 text-xs pr-2">
                            <strong className="font-semibold text-indigo-900 mr-1">{item.letter}</strong>
                            <span>{item.statement}</span>
                          </div>

                          {/* Interactive Badges: ĐÚNG / SAI */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => handleToggleTf(q.id, item.letter, true)}
                              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                                userChoice === true
                                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
                                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                              }`}
                            >
                              <span>ĐÚNG</span>
                            </button>

                            <button
                              onClick={() => handleToggleTf(q.id, item.letter, false)}
                              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                                userChoice === false
                                  ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                              }`}
                            >
                              <span>SAI</span>
                            </button>

                            {/* Badge đáp án chuẩn khi bật Key */}
                            {showAnswerKey && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ml-1 ${
                                  item.isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                {item.isCorrect ? 'Chuẩn: ĐÚNG' : 'Chuẩn: SAI'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {showAnswerKey && q.explanation && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                      <strong>Giải thích chi tiết 4 ý:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PHẦN III: TRẢ LỜI NGẮN (2.0đ) CÓ Ô ĐIỀN KẾT QUẢ NHANH     */}
        {/* ======================================================== */}
        <div className="space-y-3.5 pt-2">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 điểm)
            </h4>
            <span className="font-mono text-[10px] text-slate-500">4 câu · 0,5đ/câu</span>
          </div>
          <p className="italic text-slate-500 text-[11px]">
            Thí sinh điền kết quả số học hoặc tên chất/khái niệm vào ô đáp số tương ứng.
          </p>

          <div className="space-y-3.5">
            {saQuestions.map((q) => {
              const enteredValue = shortAnswers[q.id] || '';
              const isChecked = shortAnswerChecked[q.id];
              const isMatch = enteredValue.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();

              return (
                <div key={q.id} className="space-y-2 pl-2 border-l-2 border-slate-100 hover:border-indigo-400 transition-colors py-0.5">
                  <div className="font-semibold text-slate-900">
                    <span className="text-indigo-700">Câu {q.number}.</span> {q.content}
                  </div>

                  {/* Ô điền kết quả nhanh */}
                  <div className="flex flex-wrap items-center gap-2 pl-3">
                    <span className="text-xs font-semibold text-slate-700">Đáp số của em:</span>
                    <input
                      type="text"
                      value={enteredValue}
                      onChange={(e) => {
                        setShortAnswers((prev) => ({ ...prev, [q.id]: e.target.value }));
                        setShortAnswerChecked((prev) => ({ ...prev, [q.id]: false }));
                      }}
                      placeholder="Nhập kết quả..."
                      className="border border-slate-300 rounded-lg px-3 py-1 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none font-mono text-xs font-semibold w-44"
                    />

                    <button
                      onClick={() =>
                        setShortAnswerChecked((prev) => ({ ...prev, [q.id]: true }))
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors shadow-2xs"
                    >
                      Kiểm tra
                    </button>

                    {isChecked && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          isMatch
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isMatch ? '✓ Chính xác (+0,5đ)' : `✗ Chưa đúng`}
                      </span>
                    )}

                    {showAnswerKey && (
                      <span className="text-[11px] text-emerald-800 font-mono font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Đáp án chuẩn: {q.correctAnswer}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PHẦN IV: TỰ LUẬN (3.0đ) KÈM BAREM CHẤM TỪNG BƯỚC         */}
        {/* ======================================================== */}
        <div className="space-y-3.5 pt-2">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              PHẦN IV. TỰ LUẬN (3,0 điểm)
            </h4>
            <span className="font-mono text-[10px] text-slate-500">2 câu · Kèm barem chi tiết</span>
          </div>
          <p className="italic text-slate-500 text-[11px]">
            Thí sinh trình bày đầy đủ lời giải, công thức và biện luận logic vào giấy thi.
          </p>

          <div className="space-y-4">
            {essayQuestions.map((q) => (
              <div key={q.id} className="space-y-2 pl-2 border-l-2 border-slate-100 hover:border-indigo-400 transition-colors py-0.5">
                <div className="font-semibold text-slate-900">
                  <span className="text-indigo-700">Câu {q.number} ({q.score} điểm).</span> {q.content}
                </div>

                {/* Barem chấm từng bước chi tiết */}
                <div className="pl-3 mt-2">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 text-[11px] flex items-center justify-between">
                      <span>Barem chấm điểm từng bước (Rubric)</span>
                      <span className="text-emerald-700 font-mono">Tổng: {q.score} điểm</span>
                    </div>

                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                          <th className="p-2 font-semibold">Các bước giải / Tiêu chí đánh giá</th>
                          <th className="p-2 font-semibold text-center w-20">Điểm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-2 text-slate-700">
                            <strong>Bước 1:</strong> Xác định điều kiện, tóm tắt dữ liệu và viện dẫn công thức định luật khoa học liên quan.
                          </td>
                          <td className="p-2 text-center font-mono font-semibold text-indigo-700">
                            0,50 đ
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-700">
                            <strong>Bước 2:</strong> Thực hiện các bước biến đổi đại số / suy luận logic theo đúng bản chất quy luật.
                          </td>
                          <td className="p-2 text-center font-mono font-semibold text-indigo-700">
                            0,50 đ
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 text-slate-700">
                            <strong>Bước 3:</strong> Tính toán ra kết quả cuối cùng, kiểm tra đơn vị đo và kết luận thực tế:
                            <div className="text-emerald-800 font-medium mt-0.5 bg-white p-1 rounded border border-emerald-100">
                              {q.explanation || 'Thay số và đối chiếu điều kiện.'}
                            </div>
                          </td>
                          <td className="p-2 text-center font-mono font-semibold text-indigo-700">
                            0,50 đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="font-serif italic">----------------- HẾT -----------------</div>
          <div>Cán bộ coi thi không giải thích gì thêm · Học sinh không được sử dụng tài liệu.</div>
        </div>

      </div>
    </div>
  );
};
