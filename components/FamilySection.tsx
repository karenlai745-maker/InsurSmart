
import React, { useState } from 'react';
import { FamilyMember, Relationship, Currency, CurrencySymbols, HouseholdFinancials } from '../types';
import { UserPlus, Trash2, User, Wallet, Landmark, TrendingUp } from 'lucide-react';

interface Props {
  members: FamilyMember[];
  financials: HouseholdFinancials;
  onAdd: (member: Omit<FamilyMember, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdateFinancials: (financials: HouseholdFinancials) => void;
}

const FamilySection: React.FC<Props> = ({ members, financials, onAdd, onRemove, onUpdateFinancials }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [role, setRole] = useState<Relationship>(Relationship.SELF);
  const [income, setIncome] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>(Currency.CNY);

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd({ name, age, role, income, currency });
    setName('');
  };

  const handleFinancialChange = (field: keyof HouseholdFinancials, value: any) => {
    onUpdateFinancials({
      ...financials,
      [field]: value
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Family Financials Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Wallet className="text-indigo-600" /> 家庭财务概况 (选填)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
              <Landmark size={12}/> 家庭总负债
            </label>
            <div className="flex gap-2">
              <select
                value={financials.currency}
                onChange={(e) => handleFinancialChange('currency', e.target.value as Currency)}
                className="border-slate-200 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-20"
              >
                {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                value={financials.totalDebt}
                onChange={(e) => handleFinancialChange('totalDebt', parseInt(e.target.value) || 0)}
                className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
                placeholder="如房贷、车贷"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">还债周期 (年)</label>
            <input
              type="number"
              value={financials.debtRepaymentYears}
              onChange={(e) => handleFinancialChange('debtRepaymentYears', parseInt(e.target.value) || 0)}
              className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="剩余还款年限"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
              <TrendingUp size={12}/> 其他年收入
            </label>
            <input
              type="number"
              value={financials.otherIncome}
              onChange={(e) => handleFinancialChange('otherIncome', parseInt(e.target.value) || 0)}
              className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="投资、租金等"
            />
          </div>
          <div className="flex items-end text-xs text-slate-400 pb-2 italic">
            * 负债信息将显著影响对终身寿险保额的需求评估。
          </div>
        </div>
      </div>

      {/* Add Member Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <UserPlus className="text-indigo-600" /> 添加家庭成员
        </h2>
        <form onSubmit={handleSubmitMember} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="number"
            placeholder="年龄"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Relationship)}
            className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {Object.values(Relationship).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="border-slate-200 border rounded-lg px-2 py-2 focus:ring-2 focus:ring-indigo-500 outline-none w-20"
            >
              {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              placeholder="年收入"
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
              className="border-slate-200 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition font-medium">
            添加成员
          </button>
        </form>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map(member => (
          <div key={member.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">{member.name}</p>
                <p className="text-sm text-slate-500">{member.role} · {member.age}岁</p>
                {member.income ? (
                  <p className="text-xs text-slate-400 mt-1">年入: {CurrencySymbols[member.currency]}{member.income.toLocaleString()}</p>
                ) : null}
              </div>
            </div>
            <button 
              onClick={() => onRemove(member.id)}
              className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {members.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200">
            还没有成员，请在上方添加您的家庭成员
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilySection;
