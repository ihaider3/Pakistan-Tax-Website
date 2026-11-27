import type { CalculatorPageContent } from "../calcTypes";

export const ushrPageContent: CalculatorPageContent = {
  slug: "ushr-calculator",
  title: "Ushr Calculator Pakistan — Zakat on Crops | CalculationHub",
  metaDescription:
    "Calculate Ushr (Zakat on crops) in Pakistan — 10% rain-fed, 5% tube-well, 7.5% mixed irrigation. Enter harvest in kg or maund, get Ushr in kind and rupees.",
  h1: "Ushr Calculator Pakistan (Zakat on Crops)",
  keywords: [
    "ushr calculator pakistan",
    "ushr on wheat pakistan",
    "ushr calculator",
    "oshar calculator pakistan",
    "zakat on crops",
    "zameen ki paidawar par zakat",
    "ushr nisab",
    "agricultural zakat pakistan",
    "ushr rate rain fed tubewell",
  ],
  intro:
    "Use our ushr calculator Pakistan to accurately calculate Zakat on crops with official 10% rain-fed, 5% tube-well, and 7.5% mixed irrigation rates. Calculate ushr on wheat Pakistan, rice, and cash crops in kg or maund with instant cash and in-kind valuation.",
  romanUrduIntro:
    "Apni fasal par Ushr ka hisab lagayein — barish ya tube-well ke pani ke mutabiq. Pakistan mein ise Oshar bhi kaha jata hai. Fasal uthte hi Ushr ada karna wajib hai.",
  englishIntro:
    "Calculate Ushr (Zakat on agricultural produce) in Pakistan according to your irrigation method — 10% for rain-fed, 5% for tube-well irrigated, and 7.5% for mixed watering. Also spelled Oshar in Pakistan.",
  howToUseSteps: [
    "Select your agricultural produce/crop from the list (Wheat, Rice, Cotton, Sugarcane, etc.).",
    "Enter your total harvest quantity and choose your preferred unit (kg or maund; 1 maund = 40 kg).",
    "Enter today's local mandi market price per unit in PKR.",
    "Select your irrigation water source (Rain / River, Tube-well / Well, or Mixed).",
    "View your obligatory Ushr both in kind (produce weight) and in cash rupees.",
  ],
  formulaTitle: "Shariah Ushr Calculation Formula (Sahih al-Bukhari 1483)",
  formulaDescription:
    "Total Harvest Value = Quantity × Market Price. Ushr in Kind = Quantity × Rate (10% rain / 5% tube-well / 7.5% mixed). Ushr Cash Value = Total Harvest Value × Rate. No deductions allowed for seeds, fertiliser, or harvesting labor.",
  workedExample: {
    title: "Worked Example: 1,000 kg Wheat Harvest (Rain-Fed Irrigation)",
    description: "How Ushr is calculated on a 1,000 kg rain-watered wheat harvest at Rs 130/kg:",
    bulletPoints: [
      "Total Harvest Quantity = 1,000 kg (25 maund)",
      "Market Price = Rs 130 per kg",
      "Total Harvest Value = 1,000 kg × Rs 130 = Rs 130,000",
      "Irrigation Method = Rain / River (Naturally watered) → 10% Ushr Rate",
      "Ushr in Kind = 1,000 kg × 10% = 100 kg wheat",
      "Ushr Cash Value = Rs 130,000 × 10% = Rs 13,000",
      "Due Date = Payable immediately upon harvest (Quran 6:141 — no one-year Hawl applies)",
    ],
  },
  faqs: [
    {
      question: "Ushr aur Zakat (2.5%) mein kya farq hai?",
      answer:
        "Zakat saal ke aakhir mein bachat aur daulat par 2.5% hoti hai (jis ke liye 1 saal guzarna / Hawl zaroori hai). Ushr zameen ki paidawar par fasal uthte hi wajib hota hai (Quran 6:141), is ke liye saal guzarna shart nahi hai, aur iska rate 10%, 5% ya 7.5% hota hai (2.5% nahi).",
    },
    {
      question: "Kya beej/khaad ka kharcha kaat sakte hain?",
      answer:
        "Jumhoor fuqaha aur Islamic Fiqh Academy ke mutabiq beej, khaad, tractor ya katai ka kharcha harvest se minha (deduct) nahi kiya jata. Shariat ne masnooi pani aur mehnat ke kharche ki riayat dete hue pehle hi rate 10% se ghata kar 5% kar diya hai.",
    },
    {
      question: "Mixed pani par rate kya hai?",
      answer:
        "Agar fasal ko nehri/barishi pani aur tube-well dono se barabar sairab kiya gaya ho to Hanafi fiqh ke mutabiq darmiyani rate 7.5% lagu hota hai. Agar koi ek tareeqa ghalib raha ho (maslan 80% tube-well) to ghalib tareeqe ka rate (5%) lagu hoga.",
    },
    {
      question: "Kya chhoti fasal par bhi Ushr hai?",
      answer:
        "Hanafi fiqh ke mutabiq Ushr har miqdaar ki paidawar par wajib hai — is ke liye koi kam az kam nisab nahi hai. Jumhoor fuqaha (Shafi'i, Maliki, Hanbali) ke mutabiq 5 wasq (taqreeban 653 kg ya 16.3 maund) nisab hai, jis se kam par Ushr wajib nahi hota.",
    },
    {
      question: "How much Ushr is due on 100 maund of wheat?",
      answer:
        "100 maund equals 4,000 kg (1 maund = 40 kg). If the wheat was rain-fed, Ushr is 10% — 400 kg. If it was irrigated by tube-well, Ushr is 5% — 200 kg. If both methods were used equally, Ushr is 7.5% — 300 kg. Ushr is due at harvest time, and no seed or fertiliser cost is deducted. Enter your harvest in the calculator above for your exact figure.",
    },
  ],
  source: "Quran 6:141 & Sahih al-Bukhari 1483",
  sourceDocument: "Hanafi Fiqh Standard & Sahih Hadith Injunctions",
  lastVerified: "17 Nov 2026",
  disclaimer:
    "Ye sirf rehnumai ke liye hai — fatwa nahi. Apni khaas surat-e-haal ke liye kisi qualified Mufti se mashwara karein.",
};
