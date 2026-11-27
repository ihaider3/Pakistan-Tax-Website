import type { CalculatorPageContent } from "../calcTypes";

export const gstPageContent: CalculatorPageContent = {
  slug: "gst-calculator",
  title: "GST Calculator Pakistan — 18% Sales Tax | CalculationHub",
  metaDescription:
    "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total invoice amounts.",
  h1: "GST Calculator Pakistan (18%)",
  keywords: [
    "gst calculator pakistan",
    "sales tax calculator pakistan 18%",
    "sales tax calculator pakistan",
    "18% gst",
    "gst kitna hai",
    "18% gst kaise nikalein",
  ],
  intro:
    "Use our GST calculator Pakistan to quickly compute 18% federal sales tax on goods. Add or remove sales tax with our sales tax calculator Pakistan 18% tool with integer paisa precision.",
  romanUrduIntro:
    "Is tool se aap kisi bhi raqam par 18% General Sales Tax (GST) shamil ya nikaal sakte hain. Agar aapko invoice ki kul raqam maloom hai, to 'Remove GST' select kar ke asal qeemat aur tax alag alag dekh sakte hain.",
  englishIntro:
    "With this tool you can add or remove 18% General Sales Tax (GST) from any amount. If you know the total invoice amount, choose 'Remove GST' to see the base price and the tax separately.",
  howToUseSteps: [
    "Enter the amount in Pakistani Rupees.",
    "Select your calculation mode: Add GST (from base price), Remove GST (from total gross invoice), or GST Amount Only.",
    "Select 18% Standard (Goods) or enter a custom percentage for specialized tax categories.",
    "View the Base Amount, GST Tax Amount, and Gross Total displayed clearly in one view.",
  ],
  formulaTitle: "Sales Tax Computation Formulas (Sales Tax Act 1990)",
  formulaDescription:
    "Add GST: GST = Base × (Rate ÷ 100); Total = Base + GST. Remove GST: Base = Total ÷ (1 + Rate ÷ 100); GST = Total − Base. Amount Only: Base = GST ÷ (Rate ÷ 100); Total = Base + GST.",
  workedExample: {
    title: "Worked Example: Adding & Removing 18% Standard GST",
    description: "How 18% GST is added to a product or extracted from an inclusive invoice:",
    bulletPoints: [
      "Adding GST: Base Product Price = Rs 100,000",
      "GST (18%) = Rs 100,000 × 0.18 = Rs 18,000",
      "Total Invoice Payable = Rs 100,000 + Rs 18,000 = Rs 118,000",
      "Removing GST: Total Inclusive Bill = Rs 118,000",
      "Base Price = Rs 118,000 ÷ 1.18 = Rs 100,000",
      "Extracted GST Component = Rs 118,000 − Rs 100,000 = Rs 18,000",
    ],
  },
  faqs: [
    {
      question: "18% kaise nikalein?",
      answer:
        "Kisi bhi cheez ki asal qeemat par 18% nikalne ke liye qeemat ko 0.18 se multiply karein (ya 18 se multiply kar ke 100 se divide karein). Maslan Rs 10,000 par 18% tax Rs 1,800 banta hai.",
    },
    {
      question: "Total se GST kaise alag karein?",
      answer:
        "Agar invoice mein tax pehle se shamil hai to total raqam ko 1.18 se divide karein. Is se aap ko asal base price mil jayegi, aur total mein se base price minus karne se tax raqam alag ho jayegi.",
    },
    {
      question: "Services par GST kyun alag hai?",
      answer:
        "Services rates are set by provinces and vary by service — confirm with PRA / SRB / KPRA / BRA. Do not use 13–16% as an exact rate.",
    },
    {
      question: "Exempt goods par kitna tax hai?",
      answer:
        "Zaroori khorak, adwiyaat, aur aisi ashya jo Sales Tax Act ke Sixth Schedule mein shamil hain un par 0% sales tax hota hai. Is calculator mein Custom Rate select kar ke 0% darj karein.",
    },
    {
      question: "Input tax credit kya hota hai?",
      answer:
        "Registered karobar jo raw material khareedte waqt GST ada karte hain woh sales ke waqt collect kiye gaye tax ke muqablay mein is ada shuda tax ka credit claim kar saktay hain.",
    },
    {
      question: "How is GST credit calculated in Pakistan?",
      answer:
        "A GST-registered business pays GST on its purchases (input tax) and charges GST on its sales (output tax); the input tax paid can be adjusted against the output tax charged, and the balance is paid to FBR with the monthly sales tax return under the Sales Tax Act 1990. This calculator itself works on the 18% goods rate (add GST / remove GST from an inclusive price).",
    },
    {
      question: "Is GST 18% on everything in Pakistan?",
      answer:
        "No. 18% is the standard GST rate on most goods in Pakistan, but some goods are exempt or zero-rated, and services are taxed separately by the provinces at different rates. This calculator applies the 18% standard rate on goods, and also lets you enter a custom rate for any special case. Always check the current SRO or your invoice for the exact rate on a specific item.",
    },
  ],
  source: "Federal Board of Revenue (FBR)",
  sourceDocument: "Sales Tax Act 1990, as amended to 30 June 2026",
  lastVerified: "14 Nov 2026",
  disclaimer:
    "This is an estimate only. Standard rate of 18% applies to taxable goods under the federal Sales Tax Act 1990. Provincial services taxes vary across PRA, SRB, KPRA, and BRA. Confirm with your tax adviser.",
};
