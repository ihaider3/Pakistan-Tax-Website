import { RatesMetadata } from "./salary-2026-27";

export const gstRates = {
  metadata: {
    source: "Federal Board of Revenue (FBR)",
    sourceDocument: "Sales Tax Act 1990, as amended to 30 June 2026",
    lastVerified: "14 Nov 2026",
    notes: "Federal sales tax on goods is 18%. Services taxes are provincial and conflict across sources (PRA, SRB, KPRA, BRA) — use Custom Rate for services.",
  } as RatesMetadata,
  standardGoodsRate: 0.18, // 18%
  standardGoodsLabel: "18% Standard (Goods)",
  provincialNotice: "Services rates are set by provinces (Punjab PRA, Sindh SRB, KP KPRA, Balochistan BRA) and change across service categories — confirm with the respective provincial revenue authority for your service.",
};

