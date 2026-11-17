export interface ContentFieldConfig {
  key: string;
  page:
    | "homepage"
    | "salary"
    | "zakat"
    | "property"
    | "gst"
    | "fitrana"
    | "ushr"
    | "footer"
    | "contact"
    | "about"
    | "methodology"
    | "privacy"
    | "disclaimer";
  fieldLabel: string;
  isTextarea?: boolean;
  defaultValue: string;
}

export const DEFAULT_SITE_CONTENT: ContentFieldConfig[] = [
  // ===================== HOMEPAGE =====================
  {
    key: "home_hero_badge",
    page: "homepage",
    fieldLabel: "Homepage Hero Badge",
    defaultValue: "VERIFIED AGAINST OFFICIAL 2026–27 NOTIFICATIONS",
  },
  {
    key: "home_hero_title",
    page: "homepage",
    fieldLabel: "Homepage Main Title (H1)",
    defaultValue: "Pakistan Financial & Islamic Calculators — Free, Accurate, No Login",
  },
  {
    key: "home_hero_subtitle",
    page: "homepage",
    fieldLabel: "Homepage Subtitle / Intro Description",
    isTextarea: true,
    defaultValue:
      "Instant, private calculations for salary tax, Zakat, property advance tax (236C/236K), GST 18%, Fitrana, and Ushr on agricultural produce. All numbers stay in your browser.",
  },
  {
    key: "home_card_salary_title",
    page: "homepage",
    fieldLabel: "Salary Card Title",
    defaultValue: "Salary Tax Calculator",
  },
  {
    key: "home_card_salary_desc",
    page: "homepage",
    fieldLabel: "Salary Card Description",
    isTextarea: true,
    defaultValue:
      "Calculate your monthly tax deduction, annual tax, and net take-home salary based on official FBR Section 149 slabs.",
  },
  {
    key: "home_card_zakat_title",
    page: "homepage",
    fieldLabel: "Zakat Card Title",
    defaultValue: "Complete Zakat Calculator",
  },
  {
    key: "home_card_zakat_desc",
    page: "homepage",
    fieldLabel: "Zakat Card Description",
    isTextarea: true,
    defaultValue:
      "Calculate 2.5% Zakat on cash, gold, silver, and business inventory with live Hanafi Nisab verification & deduction logic.",
  },
  {
    key: "home_card_property_title",
    page: "homepage",
    fieldLabel: "Property Tax Card Title",
    defaultValue: "Property Tax (236C + 236K)",
  },
  {
    key: "home_card_property_desc",
    page: "homepage",
    fieldLabel: "Property Tax Card Description",
    isTextarea: true,
    defaultValue:
      "Determine buyer advance tax (1.25%) and seller tax (2.75%) with instant Filer vs Non-Filer savings comparison.",
  },
  {
    key: "home_card_gst_title",
    page: "homepage",
    fieldLabel: "GST Card Title",
    defaultValue: "GST Calculator (18%)",
  },
  {
    key: "home_card_gst_desc",
    page: "homepage",
    fieldLabel: "GST Card Description",
    isTextarea: true,
    defaultValue:
      "Add or remove 18% federal sales tax from any amount, or calculate custom rates with integer paisa precision.",
  },
  {
    key: "home_card_fitrana_title",
    page: "homepage",
    fieldLabel: "Fitrana Card Title",
    defaultValue: "Fitrana Calculator 2026",
  },
  {
    key: "home_card_fitrana_desc",
    page: "homepage",
    fieldLabel: "Fitrana Card Description",
    isTextarea: true,
    defaultValue:
      "Calculate household Fitrana for Eid-ul-Fitr 2026. Compare Mufti Muneeb and Council of Islamic Ideology rates side-by-side.",
  },
  {
    key: "home_card_ushr_title",
    page: "homepage",
    fieldLabel: "Ushr Card Title",
    defaultValue: "Ushr Calculator (Crops)",
  },
  {
    key: "home_card_ushr_desc",
    page: "homepage",
    fieldLabel: "Ushr Card Description",
    isTextarea: true,
    defaultValue:
      "Calculate Islamic Ushr on agricultural produce: 10% on rain-fed / natural crops, 5% on tube-well / irrigated crops. Units in kg, maunds, or rupees.",
  },

  // ===================== SALARY CALCULATOR PAGE =====================
  {
    key: "salary_intro",
    page: "salary",
    fieldLabel: "Salary Calculator English Intro",
    isTextarea: true,
    defaultValue:
      "Calculate your monthly tax withholding and take-home salary in Pakistan for Tax Year 2026-27 (1 July 2026 to 30 June 2027) based on official FBR progressive income tax slabs under Section 149.",
  },
  {
    key: "salary_roman_urdu_intro",
    page: "salary",
    fieldLabel: "Salary Wazahat Box (Roman Urdu)",
    isTextarea: true,
    defaultValue:
      "Ye calculator aapki mahana tankhwah par FBR ke Tax Year 2026–27 ke slabs ke mutabiq tax nikalta hai. Agar aapki salana tankhwah Rs 600,000 se kam hai, to koi tax nahi lagta. Tax slab ke hisab se lagta hai aur aapki take-home tankhwah foran samne aa jati hai.",
  },
  {
    key: "salary_english_intro",
    page: "salary",
    fieldLabel: "Salary Wazahat Box (English)",
    isTextarea: true,
    defaultValue:
      "This calculator works out the tax on your monthly salary using FBR's Tax Year 2026–27 slabs. If your annual salary is below Rs 600,000, no tax applies. Tax is charged slab by slab, and your take-home salary appears instantly.",
  },

  // ===================== ZAKAT CALCULATOR PAGE =====================
  {
    key: "zakat_intro",
    page: "zakat",
    fieldLabel: "Zakat Calculator English Intro",
    isTextarea: true,
    defaultValue:
      "Accurately calculate your annual Zakat (2.5%) on cash, gold, silver, bank accounts, trade stock, and shares in Pakistani Rupees. Includes automatic Nisab evaluation under Hanafi jurisprudence.",
  },
  {
    key: "zakat_roman_urdu_intro",
    page: "zakat",
    fieldLabel: "Zakat Wazahat Box (Roman Urdu)",
    isTextarea: true,
    defaultValue:
      "Ye Zakat calculator aapke cash, bank balance, sone, chandi aur karobar ke maal par 2.5% Zakat nikalta hai. Hanafi fiqh ke mutabiq, agar aapka maal nisab (chandi ka nisab 52.5 tola) tak pohanch jaye to Zakat farz ho jati hai. Zakat sirf us waqt farz hoti hai jab maal par poora ek saal (hawl) guzar chuka ho.",
  },
  {
    key: "zakat_english_intro",
    page: "zakat",
    fieldLabel: "Zakat Wazahat Box (English)",
    isTextarea: true,
    defaultValue:
      "This Zakat calculator works out 2.5% Zakat on your cash, bank balance, gold, silver and business stock. Under Hanafi jurisprudence, Zakat becomes obligatory once your wealth reaches the nisab (the silver nisab of 52.5 tola). It is only due once a full lunar year (hawl) has passed over the wealth.",
  },

  // ===================== PROPERTY CALCULATOR PAGE =====================
  {
    key: "property_intro",
    page: "property",
    fieldLabel: "Property Calculator English Intro",
    isTextarea: true,
    defaultValue:
      "Calculate FBR Advance Withholding Tax on real estate transactions in Pakistan for Tax Year 2026-27. Features Section 236K for buyers and Section 236C for sellers with side-by-side Filer vs Non-Filer comparisons.",
  },
  {
    key: "property_roman_urdu_intro",
    page: "property",
    fieldLabel: "Property Wazahat Box (Roman Urdu)",
    isTextarea: true,
    defaultValue:
      "Ye tool FBR ke Section 236K (kharidar) aur Section 236C (farokht kaninda) ke advance income tax ka hisab karta hai. Tax Year 2026–27 ke mutabiq, filer kharidar 1.25% aur filer farokht kaninda 2.75% tax deta hai. Filer aur non-filer ke darmiyan farq bhi yahan saaf nazar aa jata hai.",
  },
  {
    key: "property_english_intro",
    page: "property",
    fieldLabel: "Property Wazahat Box (English)",
    isTextarea: true,
    defaultValue:
      "This tool calculates FBR advance income tax under Section 236K (buyer) and Section 236C (seller). For Tax Year 2026–27, a filer buyer pays 1.25% and a filer seller pays 2.75%. The difference between filer and non-filer rates is shown clearly side by side.",
  },

  // ===================== GST CALCULATOR PAGE =====================
  {
    key: "gst_intro",
    page: "gst",
    fieldLabel: "GST Calculator English Intro",
    isTextarea: true,
    defaultValue:
      "Quickly compute Pakistan General Sales Tax (GST). Add 18% sales tax to net figures, remove tax from total invoice amounts, or calculate base values from tax amounts with instant integer paisa accuracy.",
  },
  {
    key: "gst_roman_urdu_intro",
    page: "gst",
    fieldLabel: "GST Wazahat Box (Roman Urdu)",
    isTextarea: true,
    defaultValue:
      "Is tool se aap kisi bhi raqam par 18% General Sales Tax (GST) shamil ya nikaal sakte hain. Agar aapko invoice ki kul raqam maloom hai, to 'Remove GST' select kar ke asal qeemat aur tax alag alag dekh sakte hain.",
  },
  {
    key: "gst_english_intro",
    page: "gst",
    fieldLabel: "GST Wazahat Box (English)",
    isTextarea: true,
    defaultValue:
      "With this tool you can add or remove 18% General Sales Tax (GST) from any amount. If you know the total invoice amount, choose 'Remove GST' to see the base price and the tax separately.",
  },

  // ===================== FITRANA CALCULATOR PAGE =====================
  {
    key: "fitrana_intro",
    page: "fitrana",
    fieldLabel: "Fitrana Calculator English Intro",
    isTextarea: true,
    defaultValue:
      "Calculate obligatory Sadqat-ul-Fitr (Fitrana) for your household in Pakistan for Ramadan / Eid-ul-Fitr 2026. Features the agreed consensus minimum rate of Rs 300 (Wheat) with side-by-side comparison between Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology (CII).",
  },
  {
    key: "fitrana_roman_urdu_intro",
    page: "fitrana",
    fieldLabel: "Fitrana Wazahat Box (Roman Urdu)",
    isTextarea: true,
    defaultValue:
      "Ye calculator Sadqa-e-Fitr (Fitrana) ka hisab karta hai. Gandum ke hisab se kam se kam Rs 300 per shakhs banta hai. Ye raqam Mufti Muneeb-ur-Rehman aur Council of Islamic Ideology (CII) ke elan ke mutabiq hai. Jo log sahab-e-istetaat hain, wo zyada raqam se bhi ada kar sakte hain.",
  },
  {
    key: "fitrana_english_intro",
    page: "fitrana",
    fieldLabel: "Fitrana Wazahat Box (English)",
    isTextarea: true,
    defaultValue:
      "This calculator works out Sadqa-e-Fitr (Fitrana) for your household. The minimum is Rs 300 per person, based on wheat. This rate follows the announcements of Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology (CII). Those who can afford more may pay a higher amount.",
  },

  // ===================== USHR CALCULATOR PAGE =====================
  {
    key: "ushr_intro",
    page: "ushr",
    fieldLabel: "Ushr Calculator English Intro",
    isTextarea: true,
    defaultValue:
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% for rain-fed, 5% for tube-well irrigated, 7.5% for mixed irrigation. Also spelled Oshar in Pakistan. Enter your harvest in kg or maund and get the Ushr in kind and in rupees.",
  },
  {
    key: "ushr_roman_urdu_intro",
    page: "ushr",
    fieldLabel: "Ushr Wazahat Box (Roman Urdu)",
    isTextarea: true,
    defaultValue:
      "Apni fasal par Ushr ka hisab lagayein — barish ya tube-well ke pani ke mutabiq. Pakistan mein ise Oshar bhi kaha jata hai. Fasal uthte hi Ushr ada karna wajib hai.",
  },
  {
    key: "ushr_english_intro",
    page: "ushr",
    fieldLabel: "Ushr Wazahat Box (English)",
    isTextarea: true,
    defaultValue:
      "Calculate Ushr (Zakat on agricultural produce) in Pakistan according to your irrigation method — 10% for rain-fed, 5% for tube-well irrigated, and 7.5% for mixed watering. Also spelled Oshar in Pakistan.",
  },

  // ===================== FOOTER =====================
  {
    key: "footer_mission",
    page: "footer",
    fieldLabel: "Footer Platform Mission",
    isTextarea: true,
    defaultValue:
      "Free, official, and completely confidential calculation utilities for Pakistan. All tax slabs, Nisab rates, and withholding tables are verified against official notifications.",
  },
  {
    key: "footer_privacy_note",
    page: "footer",
    fieldLabel: "Footer Zero Storage Guarantee",
    isTextarea: true,
    defaultValue:
      "Everything is computed client-side inside your browser sandbox. We do not store or transmit any input amounts.",
  },
  {
    key: "footer_copyright",
    page: "footer",
    fieldLabel: "Footer Copyright Line",
    defaultValue: "© 2026-27 Pakistan Finance Calculators. All rights reserved.",
  },

  // ===================== CONTACT =====================
  {
    key: "contact_intro",
    page: "contact",
    fieldLabel: "Contact Page Notice",
    isTextarea: true,
    defaultValue:
      "Notice a rate change in a new FBR circular or scholarly announcement? Let us know so we can update the platform within 48 hours.",
  },
];

export const EDITABLE_KEYS = new Set(DEFAULT_SITE_CONTENT.map((c) => c.key));

export function getDefaultContentMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of DEFAULT_SITE_CONTENT) {
    map[item.key] = item.defaultValue;
  }
  return map;
}

