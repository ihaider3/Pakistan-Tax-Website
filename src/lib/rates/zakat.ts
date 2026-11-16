import { RatesMetadata } from "./salary-2026-27";

export const zakatRates = {
  metadata: {
    source: "Hanafi Islamic Jurisprudence & Ministry of Poverty Alleviation",
    sourceDocument: "State Bank of Pakistan (SBP) BPRD Circular Letter No. 03 of 2026 & Ministry Notification",
    lastVerified: "14 Nov 2026",
    notes: "Rates are based on Hanafi fiqh standard in Pakistan. Gold/silver rates must be entered by user based on Sarafa market. Bank deduction threshold is for auto-deduction only.",
  } as RatesMetadata,
  zakatPercentage: 0.025, // 2.5%
  goldNisabTola: 7.5,
  goldNisabGrams: 87.48,
  silverNisabTola: 52.5,
  silverNisabGrams: 612.36,
  gramsPerTola: 11.664,
  governmentBankNisab2026: {
    amount: 503529,
    yearH: "1446-47H",
    yearGregorian: "2026",
    notifiedDate: "16 Feb 2026",
    circular: "SBP BPRD Circular Letter No. 03 of 2026",
    explanation: "This is the bank-deduction threshold for automatic deduction from savings accounts on 1 Ramadan, NOT your personal nisab. Your personal nisab is calculated above from today's gold/silver rate.",
  },
  disclaimerText: "Zakat is due only if wealth stayed at or above nisab for one full lunar year (Hawl). This tool calculates the amount, not the date. It is guidance only, not a fatwa. For complex cases (partnerships, mixed assets, jewellery in regular use, agricultural Ushr, livestock), please consult a qualified Mufti or Islamic scholar.",
};
