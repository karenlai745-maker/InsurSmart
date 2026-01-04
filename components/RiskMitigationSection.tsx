
import React, { useState } from 'react';
import { HouseholdFinancials, Currency, CurrencySymbols, DebtItem } from '../types';
import { LifeBuoy, AlertCircle, Plus, Trash2, TrendingDown, Landmark, ShieldAlert } from 'lucide-react';

interface Props {
  financials: HouseholdFinancials;
  onUpdateFinancials: (financials: HouseholdFinancials) => void;
}

const RiskMitigationSection: React.FC<Props> = ({ financials, onUpdateFinancials }) => {
  const [newDebt, setNewDebt] = useState({ name: '', amount: 0, type: '房贷' });

  const handleUpdate = (field: keyof HouseholdFinancials, value: any) => {
    onUpdateFinancials({ ...financials, [field]: value });
  };

  const addDebt = () => {
    if (!newDebt.name || newDebt.amount <= 0) return;
    const item: DebtItem = { ...newDebt, id: Math.random().toString(36).substr(2, 9) };
    const updatedDebts = [...financials.debts, item];
    const newTotalDebt = updatedDebts.reduce((sum, d) => sum + d.amount, 0);
    onUpdateFinancials({ 
      ...financials, 
      debts: updatedDebts,
      totalDebt: newTotalDebt
    });
    setNewDebt({ name: '', amount: 0, type: '房贷' });
  };

  const removeDebt = (id: string) => {
    const updatedDebts = financials.debts.filter(d => d.id !== id);
    const newTotalDebt = updatedDebts.reduce((sum, d) => sum + d.amount, 0);
    onUpdateFinancials({ 
      ...financials, 
      debts: updatedDebts,
      totalDebt: newTotalDebt
    });
  };

  const coverageMonths = financials.monthlyExpenses > 0 
    ? (financials.emergencyFund / financials.monthlyExpenses).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Emergency Fund Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <LifeBuoy className="text-indigo-600" /> 紧急预备金管理
          </h2>
          <span className={`text-xs font-bold px-2 py-1 rounded ${parseFloat(coverageMonths) >= 6 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            建议覆盖 6-12 个月开支
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">当前预备金总额 ({financials.currency})</label>
              <input
                type="number"
                value={financials.emergencyFund}
                onChange={(e) => handleUpdate('emergencyFund', parseInt(e.target.value) || 0)}
                className="text-2xl font-bold border-b-2 border-slate-100 focus:border-indigo-500 outline-none py-2 transition"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">家庭月均必要开支 ({financials.currency})</label>
              <input
                type="number"
                value={financials.monthlyExpenses}
                onChange={(e) => handleUpdate('monthlyExpenses', parseInt(e.target.value) || 0)}
                className="text-lg font-medium border-b-2 border-slate-100 focus:border-indigo-500 outline-none py-2 transition"
                placeholder="如房租/供、饮食、交通"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="text-4xl font-black text-indigo-600 mb-1">{coverageMonths}</div>
            <div className="text-sm font-bold text-slate-600 mb-4">当前预备金可覆盖月数</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${parseFloat(coverageMonths) >= 6 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min((parseFloat(coverageMonths) / 12) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400">
              {parseFloat(coverageMonths) < 3 ? '风险较高：建议优先积攒至少3个月开支。' : 
               parseFloat(coverageMonths) < 6 ? '基本达标：建议逐步增加至6个月开支。' : 
               '稳健：您的流动性管理非常出色。'}
            </p>
          </div>
        </div>
      </div>

      {/* Debt Management Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> 债务风险控制
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">债务名称</label>
                <input
                  type="text"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  placeholder="如：工行房贷"
                  className="bg-transparent border-b border-slate-200 outline-none text-sm py-1 focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">金额</label>
                <input
                  type="number"
                  value={newDebt.amount || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, amount: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="bg-transparent border-b border-slate-200 outline-none text-sm py-1 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={addDebt}
                  className="w-full bg-slate-800 text-white rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1 hover:bg-slate-700 transition"
                >
                  <Plus size={14} /> 添加债务
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {financials.debts.map(debt => (
                <div key={debt.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <Landmark size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{debt.name}</p>
                      <p className="text-xs text-slate-500">{debt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700">{CurrencySymbols[financials.currency]}{debt.amount.toLocaleString()}</span>
                    <button onClick={() => removeDebt(debt.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {financials.debts.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-sm italic">
                  暂无债务记录
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
              <p className="text-xs font-bold text-red-400 uppercase mb-1">当前总负债</p>
              <p className="text-2xl font-black text-red-600">{CurrencySymbols[financials.currency]}{financials.totalDebt.toLocaleString()}</p>
              <div className="mt-4 flex flex-col space-y-3">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">预计清偿年限</label>
                  <input
                    type="number"
                    value={financials.debtRepaymentYears}
                    onChange={(e) => handleUpdate('debtRepaymentYears', parseInt(e.target.value) || 0)}
                    className="bg-white/50 border border-red-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                <strong>专家提示：</strong> 寿险保额的一个核心锚点是<strong>“覆盖家庭债务”</strong>。如果负债较高，务必配置足额的定期寿险，以确保极端情况下不给家人留下债务压力。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMitigationSection;
