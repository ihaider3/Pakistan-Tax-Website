export interface FaqItem {
  question: string;
  answer: string;
}

export interface CalculatorPageContent {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  keywords: string[];
  intro: string;
  romanUrduIntro: string;
  howToUseSteps: string[];
  formulaTitle: string;
  formulaDescription: string;
  workedExample: {
    title: string;
    description: string;
    bulletPoints: string[];
  };
  faqs: FaqItem[];
  source: string;
  sourceDocument: string;
  lastVerified: string;
  disclaimer: string;
}

export const siteConfig = {
  brandName: "Pakistan Finance Calculators",
  tagline: "Free, Accurate, No Login — Financial & Islamic Calculators for Pakistan",
  privacyClaim: "Your numbers never leave your phone.",
  baseUrl: "https://pak-tax-cal.vercel.app",
  copyrightYear: "2026-27",
};

export const calculatorPages: Record<string, CalculatorPageContent> = {
  salary: {
    slug: "salary-tax-calculator",
    title: "Pakistan Salary Tax Calculator 2026-27 — FBR Slabs, Monthly Tax & Take-Home Pay",
    metaDescription:
      "Calculate your Pakistan salary tax for 2026-27 with FBR slabs. Enter monthly salary and see monthly tax, annual tax and take-home pay instantly, with slab breakdown.",
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
      "Calculate your monthly tax withholding and take-home salary in Pakistan for Tax Year 2026-27 (1 July 2026 to 30 June 2027) based on official FBR progressive income tax slabs under Section 149.",
    romanUrduIntro:
      "Yeh calculator aap ki monthly ya annual salary par FBR ke naye Tax Year 2026-27 slabs ke mutabiq tax calculate karta hai. 50,000 rupay mahana (600,000 salana) tak koi tax nahi hai. Tax progressive slabs ke mutabiq hisab hota hai aur aap ka net take-home salary foran samne aa jata hai.",
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
          "Jee haan, Finance Act 2026 ke mutabiq salaried individuals par azafi income tax surcharge khatam kar diya gaya hai. TY2027 mein sirf standard 8 slabs lagu hain.",
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
    ],
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Finance Act 2026, FBR Withholding Tax Rate Card TY2027, Section 149",
    lastVerified: "14 Nov 2026",
    disclaimer:
      "This is an estimate only. It is not tax advice. Calculations apply exclusively to salaried individuals under Section 149. Confirm with FBR or a licensed chartered accountant before acting.",
  },

  zakat: {
    slug: "zakat-calculator",
    title: "Zakat Calculator Pakistan 2026 — Gold, Silver, Cash & Business Zakat (2.5%)",
    metaDescription:
      "Calculate your Zakat in PKR on cash, gold, silver and business assets with nisab check. 2.5% rate, Hanafi silver nisab, government bank nisab explained.",
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
      "Accurately calculate your annual Zakat (2.5%) on cash, gold, silver, bank accounts, trade stock, and shares in Pakistani Rupees. Includes automatic Nisab evaluation under Hanafi jurisprudence.",
    romanUrduIntro:
      "Yeh Zakat calculator aap ke cash, bank balance, sonay, chandi, aur karobari maal par 2.5% zakat hisab karta hai. Hanafi fiqh ke mutabiq agar mixed maal ho to chandi ka nisab (52.5 tola) lagta hai. Zakat sirf us waqt farz hoti hai jab maal par pura ek saal (Hawl) guzar chuka ho.",
    howToUseSteps: [
      "Enter your cash, bank balances, business trade goods, and investment valuations.",
      "Enter your gold and silver weight in Tola or Grams, and input today's Sarafa market rates per tola.",
      "Add any short-term deductible liabilities/debts to calculate your Net Zakatable Wealth.",
      "Check whether your net wealth crosses the dynamic Nisab threshold, see Zakat due, and subtract any Zakat already paid.",
    ],
    formulaTitle: "Hanafi Net Zakatable Wealth & 2.5% Zakat Formula",
    formulaDescription:
      "Net Zakatable Wealth = (Cash + Bank Savings + Gold Value + Silver Value + Business Stock + Investments) − Deductible Debts. If Net Wealth ≥ Nisab Threshold: Zakat Due = Net Wealth × 2.5% (or ÷ 40). Remaining Due = Max(0, Zakat Due − Already Paid).",
    workedExample: {
      title: "Worked Example: Mixed Assets with Cash, Gold, and Liabilities",
      description: "How Nisab and Zakat are calculated for an individual in Pakistan:",
      bulletPoints: [
        "Cash in Hand + Bank: Rs 500,000",
        "Gold: 2 tola @ market rate Rs 400,000/tola = Rs 800,000",
        "Gross Zakatable Assets = Rs 1,300,000",
        "Less Debts to Deduct = Rs 100,000",
        "Net Zakatable Wealth = Rs 1,200,000",
        "Silver Nisab Threshold (52.5 tola @ Rs 5,500/tola) = Rs 288,750",
        "Status: Zakat Due (Net Wealth Rs 1,200,000 exceeds Nisab Rs 288,750)",
        "Zakat Due (2.5%) = Rs 1,200,000 × 0.025 = Rs 30,000",
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
        question: "Kia zewar jo rozmara istemal mein ho us par Zakat hai?",
        answer:
          "Hanafi maslak ke mutabiq har qism ke sonay chandi par zakat farz hai chahay woh pehna jaye ya na pehna jaye. Deegar aima ke nazdeek zaati istemal ke zewar par ikhtilaf hai. Tafseel ke liye kisi mustanad Mufti se rujoo karein.",
      },
    ],
    source: "Hanafi Islamic Jurisprudence & State Bank of Pakistan",
    sourceDocument: "State Bank of Pakistan (SBP) BPRD Circular Letter No. 03 of 2026 & Hanafi Classical Texts",
    lastVerified: "14 Nov 2026",
    disclaimer:
      "This is an estimate only. It is not a fatwa. Zakat is due only if wealth remained at or above Nisab for one full lunar year (Hawl). Consult a qualified Islamic scholar or Mufti for complex cases (e.g. agricultural Ushr, livestock, joint ventures).",
  },

  property: {
    slug: "property-tax-calculator",
    title: "Property Tax Calculator Pakistan 2026-27 — 236C & 236K Filer / Non-Filer",
    metaDescription:
      "Work out FBR advance tax on buying and selling property in Pakistan — 236K buyer 1.25% filer, 236C seller 2.75% filer. Compare filer vs non-filer instantly.",
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
      "Calculate FBR Advance Withholding Tax on real estate transactions in Pakistan for Tax Year 2026-27. Features Section 236K for buyers and Section 236C for sellers with side-by-side Filer vs Non-Filer comparisons.",
    romanUrduIntro:
      "Yeh tool FBR ke Section 236K (Buyer) aur 236C (Seller) ke advance income tax ko calculate karta hai. Tax Year 2026-27 ke mutabiq buyer filer par 1.25% aur seller filer par 2.75% tax hai. Filer ban kar aap lakhoon rupay advance tax mein bacha saktay hain.",
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
        question: "Kia yeh advance tax adjustable hai?",
        answer:
          "Jee haan, filers ke liye Section 236C aur 236K ke teht kata gaya tax unke annual income tax return mein unki kul tax liability ke muqablay mein adjust ya refund ho sakta hai.",
      },
    ],
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Finance Act 2026, FBR Withholding Tax Rate Card TY2027, Sections 236C & 236K",
    lastVerified: "14 Nov 2026",
    disclaimer:
      "This is an estimate only. It is not tax or legal advice. Provincial stamp duty, CVT, registration charges, and Capital Gains Tax (CGT) under Section 37 are not included. Confirm with FBR and your property registrar.",
  },

  gst: {
    slug: "gst-calculator",
    title: "GST Calculator Pakistan — Add & Remove 18% Sales Tax",
    metaDescription:
      "Add or remove 18% GST from any amount in PKR. See base price, GST amount and total instantly. Custom rate supported.",
    h1: "GST Calculator Pakistan (18%)",
    keywords: [
      "gst calculator pakistan",
      "sales tax calculator pakistan",
      "18% gst",
      "gst kitna hai",
      "18% gst kaise nikalein",
    ],
    intro:
      "Quickly compute Pakistan General Sales Tax (GST). Add 18% sales tax to net figures, remove tax from total invoice amounts, or calculate base values from tax amounts with instant integer paisa accuracy.",
    romanUrduIntro:
      "Is tool se aap kisi bhi raqam mein 18% General Sales Tax (GST) shamil ya alag kar saktay hain. Agar aap ko invoice ki kul raqam maloom hai to remove GST select karein taake asal qeemat aur tax alag alag nazar aa sakein.",
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
    ],
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Sales Tax Act 1990, as amended to 30 June 2026",
    lastVerified: "14 Nov 2026",
    disclaimer:
      "This is an estimate only. Standard rate of 18% applies to taxable goods under the federal Sales Tax Act 1990. Provincial services taxes vary across PRA, SRB, KPRA, and BRA. Confirm with your tax adviser.",
  },

  fitrana: {
    slug: "fitrana-calculator",
    title: "Fitrana Calculator Pakistan 2026 — Per Person Fitrana Amount",
    metaDescription:
      "Calculate Fitrana for your family in Pakistan for 2026. Wheat Rs 300 per person (minimum). Choose wheat, barley, dates or raisins, Mufti Muneeb or CII rates.",
    h1: "Fitrana Calculator Pakistan 2026",
    keywords: [
      "fitrana calculator pakistan",
      "fitrana amount 2026",
      "sadqa e fitr per person",
      "fitrana kitna hai",
      "fitrana per person 2026",
    ],
    intro:
      "Calculate obligatory Sadqat-ul-Fitr (Fitrana) for your household in Pakistan for Ramadan / Eid-ul-Fitr 2026. Features the agreed consensus minimum rate of Rs 300 (Wheat) with side-by-side comparison between Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology (CII).",
    romanUrduIntro:
      "Yeh calculator Sadqa-e-Fitr (Fitrana) hisab karta hai. Gandum (Wheat) par Rs 300 fi fard dono aalimon (Mufti Muneeb aur CII) ke mutabiq mutafiqqa raqam hai. Jo log sahib-e-istetaat hain woh jau, khajoor ya kishmish ke hisab se ada karein.",
    howToUseSteps: [
      "Enter the number of family members and dependent individuals in your household (1 to 50).",
      "Choose the staple category: Wheat (consensus minimum), Barley, Dates, or Raisins.",
      "Switch between Mufti Muneeb-ur-Rehman and Council of Islamic Ideology (CII) announcements.",
      "Review the total Fitrana payable before Eid prayer, and see the alternate scholarly rate side-by-side.",
    ],
    formulaTitle: "Household Fitrana Calculation Formula",
    formulaDescription:
      "Total Household Fitrana = Number of Family Members × Per-Person Rate of Selected Staple. (Wheat: Rs 300/person consensus; Barley: Rs 1,160 / Rs 1,100; Dates: Rs 2,800 / Rs 1,600; Raisins: Rs 7,200 / Rs 3,800).",
    workedExample: {
      title: "Worked Example: Household of 5 Family Members (Wheat vs Dates)",
      description: "How household Fitrana is determined based on financial capability:",
      bulletPoints: [
        "Family Size: 5 persons (parents + 3 dependent children)",
        "Standard Wheat (Gandum - 2 kg) consensus rate: Rs 300 per person",
        "Total Fitrana for Family (Wheat) = 5 × Rs 300 = Rs 1,500",
        "Affluent Option (Dates / Khajoor - 4 kg @ Mufti Muneeb rate): Rs 2,800 per person",
        "Total Fitrana for Family (Dates) = 5 × Rs 2,800 = Rs 14,000",
        "Note: Must be disbursed before the Eid-ul-Fitr prayer to reach the deserving.",
      ],
    },
    faqs: [
      {
        question: "Fitrana kab dena hai?",
        answer:
          "Sadqa-e-Fitr Eid-ul-Fitr ki namaz se pehle ada karna wajib hai taake mustahqeen bhi Eid ki khushiyon mein shamil ho sakein. Behtar yeh hai ke Ramadan ke aakhri ashray mein hi ada kar diya jaye.",
      },
      {
        question: "Wheat Rs 300 kis ki announcement hai?",
        answer:
          "Gandum (2 kg) ka rate Rs 300 fi fard Mufti Muneeb-ur-Rehman aur Council of Islamic Ideology (CII) dono ki taraf se 2026 ke liye mutafiqqa tor par elan kiya gaya hai.",
      },
      {
        question: "CII aur Mufti Muneeb mein farq kyun hai?",
        answer:
          "Gandum par dono ka ittefaq hai (Rs 300). Jau, khajoor aur kishmish ki market qeematon aur quality ke muqami farq ki wajah se CII aur Mufti Muneeb ke elanaat mein farq hai, is liye yeh tool dono options shafaf tor par dikhata hai.",
      },
      {
        question: "Fitrana kis par farz hai?",
        answer:
          "Har us Musalman par jo sahib-e-istetaat ho apni taraf se aur apne zer-e-kafalat nabaligh bachon ki taraf se Fitrana ada karna wajib hai.",
      },
      {
        question: "Kia Fidya aur Kaffara is mein shamil hain?",
        answer:
          "Nahi, yeh tool sirf Sadqa-e-Fitr (Fitrana) ke liye hai. Rozon ke Fidya aur Kaffara ke rules alag hain jo mustaqbil mein shamil kiye jayenge.",
      },
    ],
    source: "Mufti Muneeb-ur-Rehman & Council of Islamic Ideology (CII)",
    sourceDocument: "Official Ramadan 2026 Fitrana / Sadqat-ul-Fitr Public Announcements",
    lastVerified: "14 Nov 2026",
    disclaimer:
      "Guidance only, not a fatwa. Rates reflect official public announcements for Ramadan 2026. Wheat Rs 300 is the minimum standard; those with greater means are encouraged to pay according to barley, dates, or raisins. Consult a qualified scholar.",
  },
};

