
import React, { useRef, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Sparkles, RefreshCcw, PieChart, Info, Download, FileText, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  loading: boolean;
  data: any | null;
  onRetry: () => void;
}

const AnalysisView: React.FC<Props> = ({ loading, data, onRetry }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      // Capture the element
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc', // match bg-slate-50
        windowWidth: 1200 // Ensure consistent width for capture
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add image to first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Handle multiple pages
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`家庭保单分析报告_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('导出 PDF 失败，请尝试截图或直接打印网页。');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-slate-800">AI 正在深度分析中</h3>
          <p className="text-slate-500">正在评估流动性、负债风险及保障完整性...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-24 text-center">
        <PieChart size={64} className="mx-auto text-slate-200 mb-4" />
        <p className="text-slate-500">点击顶部的“开始智能分析”按钮生成报告</p>
      </div>
    );
  }

  const radarData = [
    { subject: '健康保障', A: data.summary.healthScore, fullMark: 100 },
    { subject: '意外保障', A: data.summary.accidentScore, fullMark: 100 },
    { subject: '寿险保障', A: data.summary.lifeScore, fullMark: 100 },
    { subject: '财富规划', A: data.summary.wealthScore, fullMark: 100 },
    { subject: '流动性', A: data.summary.liquidityScore || 50, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 no-print">
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
            isExporting 
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {isExporting ? (
            <><Loader2 size={18} className="animate-spin" /> 正在生成 PDF...</>
          ) : (
            <><Download size={18} /> 导出 PDF 报告</>
          )}
        </button>
      </div>

      {/* Report Container to Capture */}
      <div ref={reportRef} className="space-y-8 p-4 md:p-0">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="text-center font-bold text-slate-800 mb-4">核心风险防御雷达</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="得分" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              关键财务指标 <Info size={14} className="text-slate-400" />
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">汇总年缴保费</p>
                <p className="text-xl font-black text-indigo-600">￥{data.summary.totalPremium.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">保费/收入比</p>
                <p className="text-xl font-black text-slate-800">{(data.summary.premiumToIncomeRatio * 100).toFixed(1)}%</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1">
                <AlertTriangle className="text-amber-500 w-4 h-4" /> 风险预警与缺口:
              </p>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {data.summary.gaps.map((gap: string, i: number) => (
                  <div key={i} className="text-xs text-slate-600 bg-amber-50 px-3 py-2.5 rounded-xl border border-amber-100 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Markdown Report */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
            <div>
              <h2 className="text-2xl font-black text-slate-800 m-0 flex items-center gap-2">
                <FileText className="text-indigo-600" /> AI 深度配置报告
              </h2>
              <p className="text-slate-400 text-sm mt-1">基于流动性、负债及保障现状的综合评估</p>
            </div>
            <button onClick={onRetry} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition no-print">
              <RefreshCcw size={20} />
            </button>
          </div>
          <div className="report-content space-y-4">
            {data.reportMarkdown.split('\n').map((line: string, i: number) => {
              if (line.trim() === '') return <div key={i} className="h-2" />;
              if (line.startsWith('#')) {
                return <h3 key={i} className="text-xl font-black text-slate-800 mt-8 mb-4 border-l-4 border-indigo-600 pl-4">{line.replace(/#/g, '').trim()}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-bold text-indigo-700 bg-indigo-50/50 px-3 py-1 rounded inline-block">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.match(/^\s*-\s+/)) {
                return <div key={i} className="flex items-start gap-2 text-slate-600 pl-4">
                  <div className="w-1 h-1 bg-slate-300 rounded-full mt-2.5 flex-shrink-0" />
                  <span>{line.replace(/^\s*-\s+/, '')}</span>
                </div>;
              }
              return <p key={i} className="text-slate-600 leading-relaxed">{line.replace(/\*\*/g, '<b>').replace(/\*\*/g, '</b>')}</p>;
            })}
          </div>
        </div>

        {/* Footer CTA (Usually excluded from strict reports but keeping for design) */}
        <div className="bg-indigo-600 p-10 rounded-3xl shadow-2xl text-white text-center relative overflow-hidden no-print">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
          
          <h3 className="text-2xl font-black mb-3 relative z-10">需要更专业的人工解读？</h3>
          <p className="opacity-80 mb-8 max-w-xl mx-auto relative z-10">AI 提供宏观思路，具体产品选择建议咨询持牌保险经纪人，为您进行精细化投保指导。</p>
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-black hover:scale-105 transition-transform shadow-2xl relative z-10">
            预约 1V1 规划服务
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
