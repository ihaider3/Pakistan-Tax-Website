import type { CalculatorPageContent } from "../calcTypes";

export const propertyPageContent: CalculatorPageContent = {
  slug: "property-tax-calculator",
  title: "Property Tax Calculator Pakistan 236C 236K | CalculationHub",
  metaDescription:
    "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare Filer vs Non-Filer tax and savings instantly in Pakistan.",
  h1: "Property Transfer Tax Calculator (236C + 236K)",
  keywords: [
    "property tax calculator pakistan",
    "236c 236k tax",
    "filer vs non filer property tax",
    "property tax kitna hai",
    "makan khareedne par tax",
    "236c 236k kya hai",
  ],
  intro:
    "Use our property tax calculator Pakistan to calculate FBR advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax rates and instant savings with our 236C 236K tax calculator.",
  romanUrduIntro:
    "Ye tool FBR ke Section 236K (kharidar) aur Section 236C (farokht kaninda) ke advance income tax ka hisab karta hai. Tax Year 2026–27 ke mutabiq, filer kharidar 1.25% aur filer farokht kaninda 2.75% tax deta hai. Filer aur non-filer ke darmiyan farq bhi yahan saaf nazar aa jata hai.",
  englishIntro:
    "This tool calculates FBR advance income tax under Section 236K (buyer) and Section 236C (seller). For Tax Year 2026–27, a filer buyer pays 1.25% and a filer seller pays 2.75%. The difference between filer and non-filer rates is shown clearly side by side.",
  howToUseSteps: [
    "Enter the official FBR notified valuation or actual gross sale consideration in PKR.",
    "Select your transaction type: Buy (Section 236K) or Sell (Section 236C).",
    "Choose your tax status: Active Filer (ATL) or Non-Filer.",
    "View your advance tax, effective rate, total cost / net proceeds, and exact Filer savings.",
  ],
  formulaTitle: "FBR Property Advance Tax Schedule (Finance Act 2026)",
  formulaDescription:
    "Buyer (236K): Filer = 1.25% flat. Non-Filer = 10.5% (up to Rs 50M), 14.5% (Rs 50M to Rs 100M), 18.5% (above Rs 100M). Seller (236C): Filer = 2.75% flat. Non-Filer = 11.5% flat. Charged on FBR Valuation / Gross Consideration.",
  workedExample: {
    title: "Worked Example: Purchasing a Property Valued at Rs 10,000,000 (1 Crore)",
    description: "Comparison of Buyer Advance Tax (Section 236K) under Finance Act 2026:",
    bulletPoints: [
      "Property Value: Rs 10,000,000",
      "Active Filer Rate (Section 236K): 1.25% flat",
      "Filer Advance Tax: Rs 10,000,000 × 1.25% = Rs 125,000",
      "Total Cost for Filer Buyer: Rs 10,125,000",
      "Non-Filer Rate (up to Rs 50M): 10.5%",
      "Non-Filer Advance Tax: Rs 10,000,000 × 10.5% = Rs 1,050,000",
      "Total Cost for Non-Filer Buyer: Rs 11,050,000",
      "Instant Filer Savings = Rs 1,050,000 − Rs 125,000 = Rs 925,000",
    ],
  },
  faqs: [
    {
      question: "236C aur 236K mein farq?",
      answer:
        "Section 236C property farokht karne walay (Seller) par lagu hota hai, jabke Section 236K property khareedne walay (Buyer) par advance income tax hai. Dono transfer ke waqt collect kiye jatay hain.",
    },
    {
      question: "Filer banne se kitni bachat?",
      answer:
        "Filer banne se zabardast bachat hoti hai. Buyer ke liye filer par sirf 1.25% tax hai jabke non-filer par 10.5% se 18.5% tak hai. Seller ke liye filer par 2.75% jabke non-filer par 11.5% hai. 1 crore ki property par filer buyer Rs 925,000 bacha leta hai.",
    },
    {
      question: "Provincial fees kyun nahi hain?",
      answer:
        "Provincial stamp duty, registration fee, aur Capital Value Tax (CVT) har soobay (Punjab, Sindh, KPK, Balochistan) ke alag alag qawaneen ke teht tay hotay hain. Yeh calculator federal FBR advance tax ke liye hai. Provincial fees ke liye local sub-registrar office se tasdeeq karein.",
    },
    {
      question: "Late-filer category ka kya hua?",
      answer:
        "Finance Act 2026 mein late-filer ka alag rate khatam kar diya gaya hai. Ab sirf do wazeh categories hain: Active Taxpayer List (ATL) Filer aur Non-Filer.",
    },
    {
      question: "How much property tax does a filer pay in Pakistan?",
      answer:
        "A filer buyer pays 1.25% under Section 236K and a filer seller pays 2.75% under Section 236C, on the higher of the agreed price and the FBR/DC value. For example, on a property valued at Rs 10,000,000, a filer buyer pays Rs 125,000 and a filer seller pays Rs 275,000.",
    },
    {
      question: "Kia yeh advance tax adjustable hai?",
      answer:
        "Jee haan, filers ke liye Section 236C aur 236K ke teht kata gaya tax unke annual income tax return mein unki kul tax liability ke muqablay mein adjust ya refund ho sakta hai.",
    },
    {
      question: "How much property tax does a non-filer pay in Pakistan?",
      answer:
        "A non-filer pays much more than a filer. On a property worth Rs 10,000,000, a non-filer buyer pays 10.5% under Section 236K — Rs 1,050,000 — on properties up to Rs 50,000,000 (rising to 14.5% between Rs 50–100 million and 18.5% above Rs 100 million), while a filer buyer pays only 1.25%, Rs 125,000. A non-filer seller pays 11.5% under Section 236C — Rs 1,150,000 on Rs 10,000,000 — while a filer seller pays 2.75%, Rs 275,000. Use the calculator above to compare filer vs non-filer for your exact amount.",
    },
  ],
  source: "Federal Board of Revenue (FBR)",
  sourceDocument: "Finance Act 2026, FBR Withholding Tax Rate Card TY2027, Sections 236C & 236K",
  lastVerified: "14 Nov 2026",
  disclaimer:
    "This is an estimate only. It is not tax or legal advice. Provincial stamp duty, CVT, registration charges, and Capital Gains Tax (CGT) under Section 37 are not included. Confirm with FBR and your property registrar.",
};
