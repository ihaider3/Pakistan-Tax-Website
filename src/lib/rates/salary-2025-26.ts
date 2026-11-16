import { SalaryTaxSlab, RatesMetadata } from "./salary-2026-27";

export const salaryRates2025_26 = {
  metadata: {
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Finance Act 2025, FBR Withholding Tax Rate Card TY2026, Section 149",
    lastVerified: "14 Nov 2026",
    notes: "Tax Year 2026 (1 July 2025 - 30 June 2026). Surcharge TO VERIFY: check FBR rate card if income exceeds Rs 10,000,000.",
  } as RatesMetadata,
  taxYear: "2025-26",
  taxYearCode: "TY2026",
  slabs: [
    {
      min: 0,
      max: 600000,
      baseTax: 0,
      rate: 0,
      description: "Up to Rs 600,000: 0%",
    },
    {
      min: 600000,
      max: 1200000,
      baseTax: 0,
      rate: 0.01,
      description: "Rs 600,001 to Rs 1,200,000: 1% of the amount exceeding Rs 600,000",
    },
    {
      min: 1200000,
      max: 2200000,
      baseTax: 6000,
      rate: 0.11,
      description: "Rs 1,200,001 to Rs 2,200,000: Rs 6,000 + 11% of amount exceeding Rs 1,200,000",
    },
    {
      min: 2200000,
      max: 3200000,
      baseTax: 116000,
      rate: 0.23,
      description: "Rs 2,200,001 to Rs 3,200,000: Rs 116,000 + 23% of amount exceeding Rs 2,200,000",
    },
    {
      min: 3200000,
      max: 4100000,
      baseTax: 346000,
      rate: 0.30,
      description: "Rs 3,200,001 to Rs 4,100,000: Rs 346,000 + 30% of amount exceeding Rs 3,200,000",
    },
    {
      min: 4100000,
      max: null,
      baseTax: 616000,
      rate: 0.35,
      description: "Above Rs 4,100,000: Rs 616,000 + 35% of amount exceeding Rs 4,100,000",
    },
  ] as SalaryTaxSlab[],
  surcharge: {
    applied: false,
    threshold: 10000000,
    rateText: "9% (TO VERIFY against FBR Circular No. 2 of 2026-27)",
    notes: "Surcharge: check FBR rate card. Not applied silently in this calculator.",
  },
};
