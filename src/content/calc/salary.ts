import type { CalculatorPageContent } from "../calcTypes";

export const salaryPageContent: CalculatorPageContent = {
  slug: "salary-tax-calculator",
  title: "Salary Tax Calculator Pakistan 2026-27 | CalculationHub",
  metaDescription:
    "Calculate Pakistan salary tax 2026-27 with official FBR slabs — monthly tax deduction, annual tax & take-home pay, with full slab breakdown.",
  h1: "Salary Tax Calculator Pakistan 2026-27",
  keywords: [
    "salary tax calculator pakistan 2026-27",
    "fbr tax slabs 2026-27",
    "take home salary pakistan",
    "monthly tax calculator",
    "150000 salary par kitna tax",
    "meri salary par tax kitna katega",
  ],
  intro:
    "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs under Section 149. See monthly tax, annual tax and take-home pay instantly with full slab breakdown.",
  romanUrduIntro:
    "Ye calculator aapki mahana tankhwah par FBR ke Tax Year 2026–27 ke slabs ke mutabiq tax nikalta hai. Agar aapki salana tankhwah Rs 600,000 se kam hai, to koi tax nahi lagta. Tax slab ke hisab se lagta hai aur aapki take-home tankhwah foran samne aa jati hai.",
  englishIntro:
    "This calculator works out the tax on your monthly salary using FBR's Tax Year 2026–27 slabs. If your annual salary is below Rs 600,000, no tax applies. Tax is charged slab by slab, and your take-home salary appears instantly.",
  howToUseSteps: [
    "Choose whether you want to enter your Monthly Gross Salary or Annual Taxable Salary.",
    "Select the Tax Year (2026-27 is current; 2025-26 is available for prior year review).",
    "Type in your gross salary amount in PKR. Slabs and take-home update instantly.",
    "Review the progressive slab breakdown table and use the Copy Result or Print button.",
  ],
  formulaTitle: "Progressive Income Tax Formula (Section 149, Finance Act 2026)",
  formulaDescription:
    "Annual Tax = Sum over applicable slabs (each rate applies ONLY to the income falling within that specific slab bracket). Monthly Tax = Annual Tax ÷ 12. Monthly Take-Home Pay = Monthly Gross Salary − Monthly Tax.",
  workedExample: {
    title: "Worked Example: Monthly Salary of Rs 150,000 (Annual: Rs 1,800,000)",
    description: "How FBR computes your tax slab by slab for Tax Year 2026-27:",
    bulletPoints: [
      "First Rs 600,000 (Rs 0 to Rs 600,000): 0% tax = Rs 0",
      "Next Rs 600,000 (Rs 600,001 to Rs 1,200,000): 1% tax = Rs 6,000",
      "Remaining Rs 600,000 (Rs 1,200,001 to Rs 1,800,000): 11% tax = Rs 66,000",
      "Total Annual Tax = Rs 6,000 + Rs 66,000 = Rs 72,000",
      "Monthly Tax Deduction = Rs 72,000 ÷ 12 = Rs 6,000/month",
      "Monthly Take-Home Pay = Rs 150,000 − Rs 6,000 = Rs 144,000/month",
      "Effective Tax Rate = (Rs 72,000 ÷ Rs 1,800,000) × 100 = 4.0%",
    ],
  },
  faqs: [
    {
      question: "50,000 salary par tax hai?",
      answer:
        "Nahi. FBR slabs ke mutabiq saal ka pehla Rs 600,000 tax-free hai. Rs 50,000 mahana salary par saal ki kul aamdani Rs 600,000 banti hai, jis par tax bilkul 0% hai.",
    },
    {
      question: "Tax year 2026-27 kab se shuru hua?",
      answer:
        "Tax Year 2027 (2026-27) 1 July 2026 se shuru ho kar 30 June 2027 tak nafiz-ul-amal hai. Is doran milne wali tanhwah par Finance Act 2026 ke slabs lagu hotay hain.",
    },
    {
      question: "Surcharge khatam hua?",
      answer:
        "Jee haan, Finance Act 2026 ke mutabiq salaried individuals par izaafi income tax surcharge khatam kar diya gaya hai. TY2027 mein sirf standard 8 slabs lagu hain.",
    },
    {
      question: "Take-home kaise nikalein?",
      answer:
        "Take-home salary nikalne ka asaan tareeqa yeh hai ke aap apni gross salary mein se calculated monthly withholding tax minus karein. (Take-Home = Gross Salary − Monthly Tax).",
    },
    {
      question: "Kia freelance ya business income is calculator mein shamil hai?",
      answer:
        "Nahi. Yeh calculator sirf salaried individuals (Section 149) ke liye hai jinki aamdani ka kam az kam 75% hissa salary se aata hai. Business aur freelancers par alag slabs lagu hotay hain.",
    },
    {
      question: "Is salary tax the same as income tax in Pakistan?",
      answer:
        "Yes — salary tax is income tax charged on salary income. It is deducted at source by the employer under section 149 of the Income Tax Ordinance 2001, using the TY2027 slabs shown on this page. Enter your monthly salary above and the calculator shows your monthly and annual income tax. No figure may be hardcoded in the answer — the calculator on this page already computes it live.",
    },
    {
      question: "How much tax is deducted from my salary every month in Pakistan?",
      answer:
        "Your employer deducts income tax every month under Section 149 of the Income Tax Ordinance, using the Finance Act 2026 slabs for Tax Year 2027. For example, on a salary of Rs 150,000 per month, Rs 6,000 per month is deducted (Rs 72,000 per year); on Rs 100,000 per month, only Rs 500 per month is deducted. Enter your exact salary in the calculator above for your monthly deduction.",
    },
    {
      question: "How is salary tax calculated for 2026-27?",
      answer:
        "Salary tax for 2026-27 uses 8 slabs under the Finance Act 2026 (in force from 1 July 2026): no tax up to Rs 600,000 per year, then 1% to 35% across the higher slabs, with the salaried surcharge abolished. For example, on Rs 200,000 per month the tax is Rs 13,000 per month (Rs 156,000 per year). The calculator above shows your full slab-by-slab breakdown.",
    },
  ],
  source: "Federal Board of Revenue (FBR)",
  sourceDocument: "Finance Act 2026, FBR Withholding Tax Rate Card TY2027, Section 149",
  lastVerified: "14 Nov 2026",
  disclaimer:
    "This is an estimate only. It is not tax advice. Calculations apply exclusively to salaried individuals under Section 149. Confirm with FBR or a licensed chartered accountant before acting.",
};
