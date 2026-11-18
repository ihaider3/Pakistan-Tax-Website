import { siteDomain } from "@/config/site";

export type CalculatorKey = "salary" | "zakat" | "property" | "gst" | "fitrana" | "ushr";

export interface SummaryKeyValue {
  label: string;
  value: string;
}

export interface SummaryData {
  calculatorKey: CalculatorKey;
  title: string; // e.g. "Zakat Calculator", "Salary Tax Calculator"
  description: string; // one short line intro
  inputs: SummaryKeyValue[]; // user's entered data only
  keyValues: SummaryKeyValue[]; // important results besides final
  breakdown: SummaryKeyValue[]; // step-by-step lines
  rateLabel: string; // e.g. "Applicable Zakat Rate"
  rateValue: string; // e.g. "2.5%"
  formula: string; // one line, e.g. "Rs 450,000 × 2.5% = Rs 11,250"
  finalLabel: string; // e.g. "FINAL ZAKAT AMOUNT"
  finalValue: string; // e.g. "Rs 11,250"
  explanation: string; // short, 2–3 lines
  disclaimer: string; // per-category disclaimer
  generatedAt: string; // e.g. "17 Nov 2026, 02:30 PM PKT"
  domain: string; // from siteDomain config
}

/**
 * Returns the current date and time formatted in Pakistan Standard Time (PKT, UTC+5).
 * Format: "17 Nov 2026, 02:30 PM PKT"
 */
export function getPKTFormattedTimestamp(date: Date = new Date()): string {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const pktDate = new Date(utcMs + 5 * 3600000);

  const day = pktDate.getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = months[pktDate.getMonth()];
  const year = pktDate.getFullYear();

  let hours = pktDate.getHours();
  const minutes = String(pktDate.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = String(hours).padStart(2, "0");

  return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm} PKT`;
}

/**
 * Standard category disclaimers in English and Roman Urdu
 */
export function getCategoryDisclaimer(
  calculatorKey: CalculatorKey,
  language: "roman" | "en"
): string {
  if (calculatorKey === "zakat" || calculatorKey === "fitrana" || calculatorKey === "ushr") {
    return language === "roman"
      ? "Ye sirf rehnumai ke liye hai — fatwa nahi. Apni khaas surat-e-haal ke liye kisi qualified Mufti se mashwara karein."
      : "This is guidance only — not a fatwa. Please consult a qualified Mufti for your personal situation.";
  }

  // salary | property | gst
  return language === "roman"
    ? "Ye sirf rehnumai ke liye hai — tax ya qanooni mashwara nahi. Amal karne se pehle FBR ya kisi tax professional se tasdeeq karein."
    : "This is an estimate for guidance only — not tax or legal advice. Please verify with FBR or a qualified tax professional before acting.";
}

/**
 * Builds professionally organized plain text for WhatsApp sharing according to Part C.
 * *text* = bold, dividers ━━━━━━━━━━━━━━━━, clean blank lines.
 */
export function buildWhatsAppText(
  data: SummaryData,
  language: "roman" | "en" = "roman"
): string {
  const isRoman = language === "roman";

  // Section titles
  const cleanTitle = data.title.replace(/\s+Calculator$/i, "").toUpperCase();
  const titleText = `*CalculationHub*\n*${cleanTitle} CALCULATION SUMMARY*`;
  const divider = "━━━━━━━━━━━━━━━━";

  const detailsHeading = isRoman
    ? "*Aapki Tafseelat*"
    : data.calculatorKey === "zakat"
    ? "*Your Financial Details*"
    : "*Your Details*";

  const breakdownHeading = isRoman
    ? "*Calculation Ki Tafseel*"
    : "*Calculation Breakdown*";

  const explanationHeading = isRoman
    ? "*Calculation Ki Wazahat:*"
    : "*Calculation Explanation:*";

  const generatedLabel = isRoman ? "*Tayyar kiya gaya:*" : "*Generated on:*";
  const websiteLabel = "*Website:*";

  // Details block
  const detailsLines = data.inputs.map((inp) => `${inp.label}: ${inp.value}`);

  // Breakdown block
  const breakdownLines: string[] = [];
  if (data.rateLabel && data.rateValue) {
    breakdownLines.push(`${data.rateLabel}: ${data.rateValue}`);
  }
  for (const item of data.breakdown) {
    breakdownLines.push(`${item.label}: ${item.value}`);
  }
  if (data.calculatorKey !== "zakat") {
    for (const item of data.keyValues) {
      if (!breakdownLines.some((b) => b.startsWith(item.label))) {
        breakdownLines.push(`${item.label}: ${item.value}`);
      }
    }
  }

  const sections: string[] = [
    titleText,
    divider,
    `${detailsHeading}\n${detailsLines.join("\n")}`,
    `${breakdownHeading}\n${breakdownLines.join("\n")}\n\nCalculation:\n${data.formula}`,
    `*${data.finalLabel}*\n\n*${data.finalValue}*`,
    divider,
    `${explanationHeading}\n${data.explanation}`,
  ];

  if (data.disclaimer) {
    sections.push(data.disclaimer);
  }

  sections.push(`${generatedLabel} ${data.generatedAt}\n${websiteLabel} ${data.domain || siteDomain}`);

  return sections.join("\n\n");
}
