
import { GoogleGenAI, Type } from "@google/genai";
import { FamilyMember, Policy, HouseholdFinancials } from "../types";

// Always initialize the client using the API_KEY from environment variables
export const analyzeInsuranceData = async (
  family: FamilyMember[], 
  policies: Policy[], 
  financials: HouseholdFinancials
) => {
  // Always use a new instance to ensure it gets the current API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  const prompt = `
    作为一名资深的家庭理财与保险专家，请基于以下家庭结构、财务状况和现有保单进行深度分析。
    
    注意：输入数据包含多种币种（如 CNY, USD, HKD 等），请在分析时考虑汇率影响或以主要币种（CNY）为基准进行汇总说明。
    
    家庭成员 (包含年收入和币种):
    ${JSON.stringify(family, null, 2)}
    
    家庭风险防范与财务状况:
    - 紧急预备金: ${financials.emergencyFund} (${financials.currency})
    - 月均必要开支: ${financials.monthlyExpenses} (${financials.currency})
    - 家庭总负债: ${financials.totalDebt} (${financials.currency})
    - 详细债务项: ${JSON.stringify(financials.debts, null, 2)}
    - 预计还款年限: ${financials.debtRepaymentYears} 年
    - 其他年收入 (如投资、租金): ${financials.otherIncome} (${financials.currency})
    
    现有保单 (包含保额、保费和币种):
    ${JSON.stringify(policies, null, 2)}
    
    请特别关注：
    1. 紧急预备金充足度 (流动性风险): 预备金是否覆盖 6-12 个月开支。
    2. 家庭负债对寿险保额需求的影响: 保额应足以覆盖剩余负债。
    3. 核心保障缺口分析 (重疾、医疗、意外、寿险)。
    4. 保费支出合理性评估 (通常建议占家庭年总收入的 10%)。
    5. 针对性优化建议。
    
    返回内容必须包含两部分：
    1. 一个结构化的 JSON 总结，用于仪表盘展示。请将总保费汇总为 CNY（约数即可）。
    2. 详细的 Markdown 格式报告内容。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                healthScore: { type: Type.NUMBER },
                accidentScore: { type: Type.NUMBER },
                lifeScore: { type: Type.NUMBER },
                wealthScore: { type: Type.NUMBER },
                liquidityScore: { type: Type.NUMBER, description: "流动性/预备金得分" },
                totalPremium: { type: Type.NUMBER, description: "汇总后的年总保费 (CNY)" },
                premiumToIncomeRatio: { type: Type.NUMBER },
                gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["healthScore", "accidentScore", "lifeScore", "wealthScore", "liquidityScore", "totalPremium", "gaps"]
            },
            reportMarkdown: { type: Type.STRING }
          },
          required: ["summary", "reportMarkdown"]
        }
      }
    });

    const resultText = response.text || '{}';
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
