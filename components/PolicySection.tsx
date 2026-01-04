
import React, { useState } from 'react';
import { Policy, PolicyType, FamilyMember, Currency, CurrencySymbols } from '../types';
import { PlusCircle, Trash2, Shield, Coins, TrendingUp } from 'lucide-react';

interface Props {
  policies: Policy[];
  members: FamilyMember[];
  onAdd: (policy: Omit<Policy, 'id'>) => void;
  onRemove: (id: string) => void;
}

const PolicySection: React.FC<Props> = ({ policies, members, onAdd, onRemove }) => {
  const [formData, setFormData] = useState<Omit<Policy, 'id'>>({
    company: '',
    type: PolicyType.MEDICAL,
    insuredMemberId: '',
    coverageAmount: 1000000,
    annualPremium: 1000,
    paymentPeriod: 20,
    remainingYears: 10,
    currency: Currency.CNY
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.insuredMemberId) {
      alert("请填写保险公司并选择被保人");
      return;
    }
    onAdd(formData);
    setFormData({ ...formData, company: '' });
  };

  // Calculate total premiums grouped by currency
  const totalPremiumsByCurrency = policies.reduce((acc, policy) => {
    acc[policy.currency] = (acc[policy.currency] || 0) + policy.annualPremium;
    return acc;
  }, {} as Record<string, number>);

  const hasPolicies = policies.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <PlusCircle className="text-indigo-600" /> 录入新保单
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">保险公司</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="如：中国人寿"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">币种</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">险种类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as PolicyType })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(PolicyType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">被保人</label>
            <select
              value={formData.insuredMemberId}
              onChange={(e) => setFormData({ ...formData, insuredMemberId: e.target.value })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">选择被保人</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">保额</label>
            <input
              type="number"
              value={formData.coverageAmount}
              onChange={(e) => setFormData({ ...formData, coverageAmount: parseInt(e.target.value) })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">年缴费</label>
            <input
              type="number"
              value={formData.annualPremium}
              onChange={(e) => setFormData({ ...formData, annualPremium: parseInt(e.target.value) })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">缴费年限</label>
            <input
              type="number"
              value={formData.paymentPeriod}
              onChange={(e) => setFormData({ ...formData, paymentPeriod: parseInt(e.target.value) })}
              className="border-slate-200 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition font-medium h-[42px]">
              添加保单
            </button>
          </div>
        </form>
      </div>

      {/* Policy Summary Bar */}
      {hasPolicies && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md">
              <Coins size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">本页保单总年缴费</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
                {Object.entries(totalPremiumsByCurrency).map(([curr, total]) => (
                  <span key={curr} className="text-xl font-black text-indigo-900">
                    {CurrencySymbols[curr as Currency]}{total.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 bg-white/50 px-3 py-1.5 rounded-xl border border-indigo-100 self-start md:self-center">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">共 {policies.length} 份保单</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">保单信息</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">被保人</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">保额/保费</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {policies.map(policy => {
              const insured = members.find(m => m.id === policy.insuredMemberId);
              const symbol = CurrencySymbols[policy.currency];
              return (
                <tr key={policy.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="text-indigo-600 w-5 h-5" />
                      <div>
                        <p className="font-bold text-slate-800">{policy.company}</p>
                        <p className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-1 font-medium">{policy.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {insured?.name || '未知'}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{symbol}{(policy.coverageAmount/10000).toFixed(1)}万</p>
                    <p className="text-xs text-slate-500">{symbol}{policy.annualPremium.toLocaleString()}/年</p>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => onRemove(policy.id)} className="text-slate-300 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {policies.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">暂无录入保单</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicySection;
