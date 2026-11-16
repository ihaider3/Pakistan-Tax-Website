export interface SalaryTaxSlab {
  min: number;
  max: number | null;
  baseTax: number;
  rate: number; // e.g. 0.01 for 1%
  description: string;
}

export interface RatesMetadata {
  source: string;
  sourceDocument: string;
  lastVerified: string;
  notes?: string;
}

export const salaryRates2026_27 = {
  metadata: {
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Finance Act 2026, FBR Withholding Tax Rate Card TY2027, Section 149",
    lastVerified: "14 Nov 2026",
    notes: "Salaried surcharge abolished for salaried individuals in Tax Year 2027.",
  } as RatesMetadata,
  taxYear: "2026-27",
  taxYearCode: "TY2027",
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
      rate: 0.20,
      description: "Rs 2,200,001 to Rs 3,200,000: Rs 116,000 + 20% of amount exceeding Rs 2,200,000",
    },
    {
      min: 3200000,
      max: 4100000,
      baseTax: 316000,
      rate: 0.25,
      description: "Rs 3,200,001 to Rs 4,100,000: Rs 316,000 + 25% of amount exceeding Rs 3,200,000",
    },
    {
      min: 4100000,
      max: 5600000,
      baseTax: 541000,
      rate: 0.29,
      description: "Rs 4,100,001 to Rs 5,600,000: Rs 541,000 + 29% of amount exceeding Rs 4,100,000",
    },
    {
      min: 5600000,
      max: 7000000,
      baseTax: 976000,
      rate: 0.32,
      description: "Rs 5,600,001 to Rs 7,000,000: Rs 976,000 + 32% of amount exceeding Rs 5,600,000",
    },
    {
      min: 7000000,
      max: null,
      baseTax: 1424000,
      rate: 0.35,
      description: "Above Rs 7,000,000: Rs 1,424,000 + 35% of amount exceeding Rs 7,000,000",
    },
  ] as SalaryTaxSlab[],
  surcharge: {
    applied: false,
    notes: "Abolished in Finance Act 2026 for salaried taxpayers.",
  },
};
