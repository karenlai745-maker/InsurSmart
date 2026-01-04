
export enum Relationship {
  SELF = '本人',
  SPOUSE = '配偶',
  CHILD = '子女',
  PARENT = '父母'
}

export enum PolicyType {
  CRITICAL_ILLNESS = '重疾险',
  MEDICAL = '医疗险',
  ACCIDENT = '意外险',
  LIFE = '定期/终身寿险',
  ANNUITY = '年金险/分红险',
  OTHER = '其他'
}

export enum Currency {
  CNY = 'CNY',
  USD = 'USD',
  HKD = 'HKD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY'
}

export const CurrencySymbols: Record<Currency, string> = {
  [Currency.CNY]: '￥',
  [Currency.USD]: '$',
  [Currency.HKD]: 'HK$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.JPY]: '¥'
};

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  role: Relationship;
  income?: number;
  currency: Currency;
}

export interface DebtItem {
  id: string;
  name: string;
  amount: number;
  type: string;
}

export interface HouseholdFinancials {
  totalDebt: number;
  debtRepaymentYears: number;
  otherIncome: number;
  currency: Currency;
  emergencyFund: number;
  monthlyExpenses: number;
  debts: DebtItem[];
}

export interface Policy {
  id: string;
  company: string;
  type: PolicyType;
  insuredMemberId: string;
  coverageAmount: number;
  annualPremium: number;
  paymentPeriod: number;
  remainingYears: number;
  currency: Currency;
}

export interface AnalysisSummary {
  riskScores: {
    health: number;
    accident: number;
    life: number;
    wealth: number;
    liquidity: number;
  };
  totalAnnualPremium: number;
  coverageGaps: string[];
  recommendations: string;
}
