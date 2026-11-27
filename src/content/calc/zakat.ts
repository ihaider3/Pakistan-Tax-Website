import type { CalculatorPageContent } from "../calcTypes";

export const zakatPageContent: CalculatorPageContent = {
  slug: "zakat-calculator",
  title: "Zakat Calculator Pakistan — Nisab 2026 | CalculationHub",
  metaDescription:
    "Calculate 2.5% Zakat on cash, gold, silver and business assets with live Hanafi Nisab verification in Pakistan. 100% private, free, and instant breakdown.",
  h1: "Zakat Calculator Pakistan",
  keywords: [
    "zakat calculator pakistan",
    "zakat nisab pakistan",
    "gold zakat calculator",
    "silver nisab",
    "zakat kaise nikalein",
    "zakat nisab kitna hai",
    "sona par zakat",
  ],
  intro:
    "Use our zakat calculator Pakistan to accurately calculate your annual 2.5% Zakat on cash, gold, silver, bank accounts, and trade assets with live Hanafi zakat nisab Pakistan 2026 verification.",
  romanUrduIntro:
    "Ye Zakat calculator aapke cash, bank balance, sone, chandi aur karobar ke maal par 2.5% Zakat nikalta hai. Hanafi fiqh ke mutabiq, agar aapka maal nisab (chandi ka nisab 52.5 tola) tak pohanch jaye to Zakat farz ho jati hai. Zakat sirf us waqt farz hoti hai jab maal par poora ek saal (hawl) guzar chuka ho.",
  englishIntro:
    "This Zakat calculator works out 2.5% Zakat on your cash, bank balance, gold, silver and business stock. Under Hanafi jurisprudence, Zakat becomes obligatory once your wealth reaches the nisab (the silver nisab of 52.5 tola). It is only due once a full lunar year (hawl) has passed over the wealth.",
  howToUseSteps: [
    "Enter your cash, bank balances, business trade goods, and investment valuations.",
    "Gold and silver rates update live every time you open this page — always the latest market rates.",
    "Add any short-term deductible liabilities/debts to calculate your Net Zakatable Wealth.",
    "Check whether your net wealth crosses the dynamic Nisab threshold, see Zakat due, and subtract any Zakat already paid.",
  ],
  formulaTitle: "Hanafi Net Zakatable Wealth & 2.5% Zakat Formula",
  formulaDescription:
    "Net Zakatable Wealth = (Cash + Bank Savings + Gold Value + Silver Value + Business Stock + Investments) − Deductible Debts. If Net Wealth ≥ Nisab Threshold: Zakat Due = Net Wealth × 2.5% (or ÷ 40). Remaining Due = Max(0, Zakat Due − Already Paid).",
  workedExample: {
    title: "Worked Example: Mixed Assets with Cash, Gold, and Liabilities",
    description: "How Nisab and Zakat are calculated for an individual in Pakistan (rates update live with current market spot prices):",
    bulletPoints: [
      "Cash in Hand + Bank: Rs 500,000",
      "Gold: 2 tola @ live market rate (fetched automatically on every visit)",
      "Gross Zakatable Assets: Calculated live from cash and gold values",
      "Less Debts to Deduct = Rs 100,000",
      "Net Zakatable Wealth: Gross assets minus debts",
      "Silver Nisab Threshold: 52.5 tola × live silver rate (updated live on page)",
      "Status: Zakat Due (Net Wealth exceeds live Silver Nisab)",
      "Zakat Due (2.5%): Net Zakatable Wealth × 0.025",
    ],
  },
  faqs: [
    {
      question: "Nisab gold ya silver?",
      answer:
        "Agar aap ke paas sirf aur sirf sona hai (koi cash, chandi ya business maal nahi), to Sonay ka nisab (7.5 tola / 87.48g) dekha jayega. Agar aap ke paas sonay ke sath cash, bank balance ya chandi bhi hai, to Hanafi fiqh ke mutabiq Chandi ka nisab (52.5 tola / 612.36g) lagta hai jo ghareebon ke haq mein behtar aur ehtiyaat par mabni hai.",
    },
    {
      question: "Bank ne zakat kaat li to kya karein?",
      answer:
        "Government 1 Ramadan ko savings accounts se 2.5% auto-deduct karti hai (agar CZ-50 form jama na ho). Is calculator mein 'Already Paid' field mein woh raqam darj karein taake aap ki baqi wajib-ul-ada Zakat ka sahi hisab ho sake.",
    },
    {
      question: "Hawl kya hai?",
      answer:
        "Hawl ka matlab hai ek qamri saal (Lunar year / ~354 din). Zakat sirf us surat mein farz hoti hai jab aap ki milkiyat mein Nisab ke barabar ya us se zyada raqam par pura ek qamri saal guzar chuka ho.",
    },
    {
      question: "Government bank deduction nisab aur personal nisab mein kya farq hai?",
      answer:
        "Hukumat-e-Pakistan ne Zakat Year 1446-47H (2026) ke liye bank auto-deduction threshold Rs 503,529 mukhtas kiya hai. Yeh sirf bank accounts se deduction ke liye hai, aap ka zaati Shariah nisab aaj ke chandi/sonay ke rate ke mutabiq tay hota hai.",
    },
    {
      question: "Kia zewar jo rozmarra istemal mein ho us par Zakat hai?",
      answer:
        "Hanafi maslak ke mutabiq har qism ke sonay chandi par zakat farz hai chahay woh pehna jaye ya na pehna jaye. Deegar aima ke nazdeek zaati istemal ke zewar par ikhtilaf hai. Tafseel ke liye kisi mustanad Mufti se rujoo karein.",
    },
  ],
  source: "Hanafi Islamic Jurisprudence & State Bank of Pakistan",
  sourceDocument: "State Bank of Pakistan (SBP) BPRD Circular Letter No. 03 of 2026 & Hanafi Classical Texts",
  lastVerified: "14 Nov 2026",
  disclaimer:
    "This is an estimate only. It is not a fatwa. Zakat is due only if wealth remained at or above Nisab for one full lunar year (Hawl). Consult a qualified Islamic scholar or Mufti for complex cases (e.g. agricultural Ushr, livestock, joint ventures).",
};
