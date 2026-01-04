
import React, { useState } from 'react';
import { FamilyMember, Policy, HouseholdFinancials, Currency } from './types';
import { analyzeInsuranceData } from './services/geminiService';
import FamilySection from './components/FamilySection';
import RiskMitigationSection from './components/RiskMitigationSection';
import PolicySection from './components/PolicySection';
import AnalysisView from './components/AnalysisView';
import { Activity, FileText, PieChart, Users, ShieldCheck, LifeBuoy } from 'lucide-react';

const App: React.FC = () => {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [financials, setFinancials] = useState<HouseholdFinancials>({
    totalDebt: 0,
    debtRepaymentYears: 0,
    otherIncome: 0,
    currency: Currency.CNY,
    emergencyFund: 0,
    monthlyExpenses: 0,
    debts: []
  });
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activeTab, setActiveTab] = useState<'family' | 'risk' | 'policies' | 'analysis'>('family');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember = { ...member, id: Math.random().toString(36).substr(2, 9) };
    setFamily([...family, newMember]);
  };

  const removeFamilyMember = (id: string) => {
    setFamily(family.filter(m => m.id !== id));
    setPolicies(policies.filter(p => p.insuredMemberId !== id));
  };

  const updateFinancials = (newFinancials: HouseholdFinancials) => {
    setFinancials(newFinancials);
  };

  const addPolicy = (policy: Omit<Policy, 'id'>) => {
    const newPolicy = { ...policy, id: Math.random().toString(36).substr(2, 9) };
    setPolicies([...policies, newPolicy]);
  };

  const removePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  const handleRunAnalysis = async () => {
    if (family.length === 0) {
      alert("请至少添加一名家庭成员");
      return;
    }
    setIsAnalyzing(true);
    setActiveTab('analysis');
    try {
      const result = await analyzeInsuranceData(family, policies, financials);
      setAnalysisResult(result);
    } catch (error) {
      alert("分析失败，请稍后重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-xl font-bold">家庭保单智能管家</h1>
          </div>
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || family.length === 0}
            className={`px-4 py-2 rounded-full font-medium transition flex items-center space-x-2 ${
              isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-md'
            }`}
          >
            {isAnalyzing ? (
              <><Activity className="w-4 h-4 animate-spin" /> <span>分析中...</span></>
            ) : (
              <><PieChart className="w-4 h-4" /> <span>开始智能分析</span></>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'family' && (
          <FamilySection 
            members={family} 
            financials={financials}
            onAdd={addFamilyMember} 
            onRemove={removeFamilyMember} 
            onUpdateFinancials={updateFinancials}
          />
        )}
        {activeTab === 'risk' && (
          <RiskMitigationSection 
            financials={financials}
            onUpdateFinancials={updateFinancials}
          />
        )}
        {activeTab === 'policies' && (
          <PolicySection 
            policies={policies} 
            members={family}
            onAdd={addPolicy} 
            onRemove={removePolicy} 
          />
        )}
        {activeTab === 'analysis' && (
          <AnalysisView 
            loading={isAnalyzing} 
            data={analysisResult} 
            onRetry={handleRunAnalysis} 
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-50">
        <div className="max-w-5xl mx-auto flex justify-around">
          <button 
            onClick={() => setActiveTab('family')}
            className={`flex flex-col items-center py-3 px-2 flex-1 space-y-1 transition-colors ${activeTab === 'family' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium">家庭成员</span>
          </button>
          <button 
            onClick={() => setActiveTab('risk')}
            className={`flex flex-col items-center py-3 px-2 flex-1 space-y-1 transition-colors ${activeTab === 'risk' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LifeBuoy className="w-5 h-5" />
            <span className="text-[10px] font-medium">风险防范</span>
          </button>
          <button 
            onClick={() => setActiveTab('policies')}
            className={`flex flex-col items-center py-3 px-2 flex-1 space-y-1 transition-colors ${activeTab === 'policies' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">保单管理</span>
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`flex flex-col items-center py-3 px-2 flex-1 space-y-1 transition-colors ${activeTab === 'analysis' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] font-medium">深度报告</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
