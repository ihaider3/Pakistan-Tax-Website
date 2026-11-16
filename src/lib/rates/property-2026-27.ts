import { RatesMetadata } from "./salary-2026-27";

export interface PropertyTaxBracket {
  min: number;
  max: number | null;
  rate: number; // e.g. 0.105 for 10.5%
  rateLabel: string;
}

export const propertyRates2026_27 = {
  metadata: {
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Finance Act 2026, FBR Withholding Tax Rate Card TY2027, Sections 236C & 236K",
    lastVerified: "14 Nov 2026",
    notes: "Late-filer tier was REMOVED in Tax Year 2027. Provincial fees (stamp duty, CVT, registration) and Capital Gains Tax are not included.",
  } as RatesMetadata,
  taxYear: "2026-27",
  taxYearCode: "TY2027",
  buyer236K: {
    filerRate: 0.0125, // 1.25% flat
    nonFilerTiers: [
      {
        min: 0,
        max: 50000000,
        rate: 0.105, // 10.5%
        rateLabel: "10.5%",
      },
      {
        min: 50000000,
        max: 100000000,
        rate: 0.145, // 14.5%
        rateLabel: "14.5%",
      },
      {
        min: 100000000,
        max: null,
        rate: 0.185, // 18.5%
        rateLabel: "18.5%",
      },
    ] as PropertyTaxBracket[],
  },
  seller236C: {
    filerRate: 0.0275, // 2.75% flat
    nonFilerRate: 0.115, // 11.5% flat
  },
};

