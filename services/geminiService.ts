import { GoogleGenAI } from "@google/genai";
import { AcracsInput, ScoreBreakdown } from "../types";
import { LOCATIONS, SECTORS, YEARS_IN_BUSINESS, RESOURCE_DEPENDENCY } from "../constants";

export const generateRiskAnalysis = async (inputs: AcracsInput, scores: { final: number, breakdown: ScoreBreakdown }, lang: 'en' | 'bn'): Promise<string> => {
  // Fix: Removed API key check as per guidelines, assuming it's always present.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const locationLabel = LOCATIONS.find(l => l.value === inputs.location)?.label[lang] || 'N/A';
  const sectorLabel = SECTORS.find(s => s.value === inputs.sector)?.label[lang] || 'N/A';
  const yearsLabel = YEARS_IN_BUSINESS.find(y => y.value === inputs.yearsInBusiness)?.label[lang] || 'N/A';
  const dependencyLabel = RESOURCE_DEPENDENCY.find(r => r.value === inputs.resourceDependency)?.label[lang] || 'N/A';
  
  const resilienceMeasuresText = (Object.entries(inputs.resilienceMeasures) as [keyof AcracsInput['resilienceMeasures'], {checked: boolean, details: string}][])
    .filter(([, value]) => value.checked)
    .map(([key, value]) => {
      let measureText = '';
      if (lang === 'bn') {
          switch (key) {
            case 'diversification': measureText = '- আয়ের একাধিক উৎস আছে।'; break;
            case 'climateSmartPractices': measureText = '- জলবায়ু-সহনশীল পদ্ধতি ব্যবহার করে।'; break;
            case 'protectiveInfrastructure': measureText = '- শক্তিশালী কাঠামোতে বিনিয়োগ করেছে।'; break;
            case 'microInsurance': measureText = '- দুর্যোগের জন্য ব্যবসার বীমা আছে।'; break;
            case 'climateTraining': measureText = '- জলবায়ু ঝুঁকি সম্পর্কে প্রশিক্ষণ নিয়েছে।'; break;
            case 'hasSavings': measureText = '- জরুরি অবস্থার জন্য সঞ্চয় রাখে।'; break;
            case 'earlyWarningAccess': measureText = '- আবহাওয়ার সতর্কতা পায়।'; break;
            case 'communityGroupMember': measureText = '- স্থানীয় কমিউনিটি গ্রুপের সদস্য।'; break;
            case 'formalBusinessPlan': measureText = '- একটি লিখিত ব্যবসায়িক পরিকল্পনা আছে।'; break;
            case 'localSupplierNetwork': measureText = '- স্থানীয় সরবরাহকারীদের একটি শক্তিশালী নেটওয়ার্ক আছে।'; break;
            case 'digitalLiteracy': measureText = '- ডিজিটাল সরঞ্জাম ব্যবহার করে (যেমন মোবাইল ব্যাংকিং)।'; break;
            default: measureText = '';
          }
      } else {
          switch (key) {
            case 'diversification': measureText = '- Has multiple sources of income.'; break;
            case 'climateSmartPractices': measureText = '- Uses climate-smart methods.'; break;
            case 'protectiveInfrastructure': measureText = '- Invested in stronger infrastructure.'; break;
            case 'microInsurance': measureText = '- Has business insurance for disasters.'; break;
            case 'climateTraining': measureText = '- Attended training about climate risks.'; break;
            case 'hasSavings': measureText = '- Keeps savings for emergencies.'; break;
            case 'earlyWarningAccess': measureText = '- Receives early weather warnings.'; break;
            case 'communityGroupMember': measureText = '- Is a member of a local community group.'; break;
            case 'formalBusinessPlan': measureText = '- Has a written business plan.'; break;
            case 'localSupplierNetwork': measureText = '- Has a strong network of local suppliers.'; break;
            case 'digitalLiteracy': measureText = '- Uses digital tools (e.g., mobile banking).'; break;
            default: measureText = '';
          }
      }

      if (value.details) {
        measureText += lang === 'bn' ? `\n    - বিবরণ: ${value.details}` : `\n    - Details: ${value.details}`;
      }
      return measureText;
    }).join('\n');
    
  const languageInstructions = {
      en: {
          promptRole: "Act as a friendly, encouraging business advisor for a small enterprise owner in rural Bangladesh.",
          languageDirection: "Write a simple, easy-to-understand summary in English.",
          businessInfo: "Business Information",
          name: "Name",
          womanLed: "Woman-led",
          location: "Location",
          businessType: "Business Type",
          yearsInBusiness: "Years in Business",
          employees: "Number of Employees",
          dependency: "Dependence on local natural resources",
          financialHealth: "Financial Health",
          debtToEquity: "Borrowed Money vs. Own Money (Debt-to-Equity)",
          yearlyProfit: "Yearly Profit (BDT)",
          monthlyRevenue: "Avg. Monthly Income (BDT)",
          monthlyExpenses: "Avg. Monthly Expenses (BDT)",
          cashOnHand: "Cash / Savings on Hand (BDT)",
          actionsTaken: "Actions Taken to Protect Business from Climate Change",
          noActions: "- No specific actions reported.",
          results: "ACRACS Score Results",
          finalScore: "Final Score",
          breakdown: "Score Breakdown",
          financial: "Financial Health",
          stability: "Business Stability",
          cvi: "Climate Vulnerability (higher score is better)",
          acs: "Actions to Protect Business (Adaptive Capacity)",
          task: "Your Task (in simple language, using Markdown formatting):",
          task1: `1.  **Overall Summary:** Start with a simple risk level ("Low Risk," "Medium Risk," or "High Risk") and briefly explain what the final score means in one sentence. Use **bold** for the risk level.`,
          task2: "2.  **Your Strengths (What you are doing well):** Create a bulleted list using \"-\" for 2-3 key positive points. If they provided details on their actions, praise their specific efforts.",
          task3: "3.  **Areas to Improve (Suggestions to get a better score):** Create a bulleted list using \"-\" for 1-2 friendly, actionable suggestions. Explain *why* these suggestions will help make their business stronger and more loan-ready. Frame this as helpful advice, not criticism."
      },
      bn: {
          promptRole: "গ্রামীণ বাংলাদেশের একজন ক্ষুদ্র উদ্যোক্তার জন্য বন্ধুত্বপূর্ণ, উৎসাহব্যঞ্জক ব্যবসায়িক উপদেষ্টা হিসেবে কাজ করুন।",
          languageDirection: "বাংলায় একটি সহজ, সহজে বোঝা যায় এমন সারসংক্ষেপ লিখুন।",
          businessInfo: "ব্যবসার তথ্য",
          name: "নাম",
          womanLed: "নারী-নেতৃত্বাধীন",
          location: "অবস্থান",
          businessType: "ব্যবসার ধরণ",
          yearsInBusiness: "ব্যবসায় বছর",
          employees: "কর্মচারীর সংখ্যা",
          dependency: "স্থানীয় প্রাকৃতিক সম্পদের উপর নির্ভরতা",
          financialHealth: "আর্থিক স্বাস্থ্য",
          debtToEquity: "ধার করা টাকা বনাম নিজের টাকা (ঋণ-ইকুইটি অনুপাত)",
          yearlyProfit: "বার্ষিক লাভ (BDT)",
          monthlyRevenue: "গড় মাসিক আয় (BDT)",
          monthlyExpenses: "গড় মাসিক ব্যয় (BDT)",
          cashOnHand: "হাতে নগদ / সঞ্চয় (BDT)",
          actionsTaken: "জলবায়ু পরিবর্তন থেকে ব্যবসাকে রক্ষা করার জন্য গৃহীত পদক্ষেপ",
          noActions: "- কোনো নির্দিষ্ট পদক্ষেপের কথা জানানো হয়নি।",
          results: "ACRACS স্কোর ফলাফল",
          finalScore: "চূড়ান্ত স্কোর",
          breakdown: "স্কোর ভাঙ্গন",
          financial: "আর্থিক স্বাস্থ্য",
          stability: "ব্যবসায়িক স্থিতিশীলতা",
          cvi: "জলবায়ু ঝুঁকি (উচ্চ স্কোর ভালো)",
          acs: "ব্যবসা রক্ষার পদক্ষেপ (অভিযোজন ক্ষমতা)",
          task: "আপনার কাজ (সহজ ভাষায়, মার্কডাউন ফরম্যাটিং ব্যবহার করে):",
          task1: `১. **সামগ্রিক সারসংক্ষেপ:** একটি সাধারণ ঝুঁকির স্তর ("কম ঝুঁকি," "মাঝারি ঝুঁকি," বা "উচ্চ ঝুঁকি") দিয়ে শুরু করুন এবং চূড়ান্ত স্কোরের অর্থ কী তা এক বাক্যে সংক্ষেপে ব্যাখ্যা করুন। ঝুঁকির স্তরের জন্য **বোল্ড** ব্যবহার করুন।`,
          task2: "২. **আপনার শক্তি (আপনি যা ভালো করছেন):** ২-৩টি মূল ইতিবাচক পয়েন্টের জন্য \"-\" ব্যবহার করে একটি বুলেটযুক্ত তালিকা তৈরি করুন। যদি তারা তাদের পদক্ষেপের বিবরণ দিয়ে থাকে, তবে তাদের নির্দিষ্ট প্রচেষ্টার প্রশংসা করুন।",
          task3: "৩. **উন্নতির ক্ষেত্র (আরও ভালো স্কোর পাওয়ার জন্য পরামর্শ):** ১-২টি বন্ধুত্বপূর্ণ, কার্যকর পরামর্শের জন্য \"-\" ব্যবহার করে একটি বুলেটযুক্ত তালিকা তৈরি করুন। ব্যাখ্যা করুন *কেন* এই পরামর্শগুলি তাদের ব্যবসাকে আরও শক্তিশালী এবং ঋণ-প্রস্তুত করতে সাহায্য করবে। এটিকে সহায়ক পরামর্শ হিসাবে উপস্থাপন করুন, সমালোচনা হিসাবে নয়।"
      }
  };

  const t = languageInstructions[lang];

  let optionalFinancials = '';
  if (inputs.monthlyRevenue && inputs.monthlyRevenue > 0) {
    optionalFinancials += `\n    - ${t.monthlyRevenue}: ${inputs.monthlyRevenue.toLocaleString()}`;
  }
  if (inputs.monthlyExpenses && inputs.monthlyExpenses > 0) {
    optionalFinancials += `\n    - ${t.monthlyExpenses}: ${inputs.monthlyExpenses.toLocaleString()}`;
  }
  if (inputs.cashOnHand && inputs.cashOnHand > 0) {
    optionalFinancials += `\n    - ${t.cashOnHand}: ${inputs.cashOnHand.toLocaleString()}`;
  }


  const prompt = `
    ${t.promptRole}
    ${t.languageDirection}
    Avoid complex financial jargon. Use "BDT" for the local currency.

    **${t.businessInfo}:**
    - ${t.name}: ${inputs.enterpriseName}
    - ${t.womanLed}: ${inputs.isWomanLed ? (lang === 'bn' ? 'হ্যাঁ' : 'Yes') : (lang === 'bn' ? 'না' : 'No')}
    - ${t.location}: ${locationLabel}
    - ${t.businessType}: ${sectorLabel}
    - ${t.yearsInBusiness}: ${yearsLabel}
    - ${t.employees}: ${inputs.employees}
    - ${t.dependency}: ${dependencyLabel}
    
    **${t.financialHealth}:**
    - ${t.debtToEquity}: ${inputs.debtToEquity}
    - ${t.yearlyProfit}: ${inputs.yearlyProfit.toLocaleString()}${optionalFinancials}

    **${t.actionsTaken}:**
    ${resilienceMeasuresText || t.noActions}

    **${t.results}:**
    - ${t.finalScore}: ${scores.final.toFixed(0)} / 100
    - ${t.breakdown}:
      - ${t.financial}: ${scores.breakdown.financial.toFixed(0)}/100
      - ${t.stability}: ${scores.breakdown.stability.toFixed(0)}/100
      - ${t.cvi}: ${scores.breakdown.cvi.toFixed(0)}/100
      - ${t.acs}: ${scores.breakdown.acs.toFixed(0)}/100

    **${t.task}**
    ${t.task1}
    ${t.task2}
    ${t.task3}
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating risk analysis:", error);
    return lang === 'bn' ? "বিশ্লেষণ তৈরি করার সময় একটি ত্রুটি ঘটেছে। বিস্তারিত জানতে কনসোল চেক করুন।" : "An error occurred while generating the analysis. Please check the console for details.";
  }
};