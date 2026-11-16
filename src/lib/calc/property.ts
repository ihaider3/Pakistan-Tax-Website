import { propertyRates2026_27 } from "../rates/property-2026-27";
import { roundToPaisa } from "./money";

export type PropertyTransactionType = "buy" | "sell";
export type FilerStatus = "filer" | "non-filer";

export interface PropertyTaxResult {
  propertyValue: number;
  transaction: PropertyTransactionType;
  filerStatus: FilerStatus;
  sectionCode: "236K" | "236C";
  rate: number; // e.g. 0.0125
  ratePercentage: string; // e.g. "1.25%"
  taxAmount: number;
  totalForBuyer: number; // value + tax
  netForSeller: number; // value - tax
  oppositeFilerTax: number;
  savingsVsNonFiler: number;
  comparisonText: string;
}

export function calculatePropertyTax(
  value: number,
  transaction: PropertyTransactionType,
  filerStatus: FilerStatus
): PropertyTaxResult {
  const sectionCode: "236K" | "236C" = transaction === "buy" ? "236K" : "236C";

  let rate = 0;
  let ratePercentage = "0%";

  if (transaction === "buy") {
    // 236K
    if (filerStatus === "filer") {
      rate = propertyRates2026_27.buyer236K.filerRate;
      ratePercentage = "1.25%";
    } else {
      // Non-filer tiers
      if (value <= 50000000) {
        rate = 0.105;
        ratePercentage = "10.5%";
      } else if (value <= 100000000) {
        rate = 0.145;
        ratePercentage = "14.5%";
      } else {
        rate = 0.185;
        ratePercentage = "18.5%";
      }
    }
  } else {
    // 236C sell
    if (filerStatus === "filer") {
      rate = propertyRates2026_27.seller236C.filerRate;
      ratePercentage = "2.75%";
    } else {
      rate = propertyRates2026_27.seller236C.nonFilerRate;
      ratePercentage = "11.5%";
    }
  }

  const taxAmount = roundToPaisa(value * rate);
  const totalForBuyer = roundToPaisa(value + taxAmount);
  const netForSeller = roundToPaisa(Math.max(0, value - taxAmount));

  // Calculate opposite status for comparison
  let nonFilerTax = 0;
  let filerTax = 0;

  if (transaction === "buy") {
    filerTax = roundToPaisa(value * propertyRates2026_27.buyer236K.filerRate);
    let nfRate = 0.105;
    if (value > 100000000) nfRate = 0.185;
    else if (value > 50000000) nfRate = 0.145;
    nonFilerTax = roundToPaisa(value * nfRate);
  } else {
    filerTax = roundToPaisa(value * propertyRates2026_27.seller236C.filerRate);
    nonFilerTax = roundToPaisa(value * propertyRates2026_27.seller236C.nonFilerRate);
  }

  const savingsVsNonFiler = roundToPaisa(nonFilerTax - filerTax);
  const oppositeFilerTax = filerStatus === "filer" ? nonFilerTax : filerTax;

  let comparisonText = "";
  if (filerStatus === "filer") {
    comparisonText = `As an Active Filer, you save Rs ${savingsVsNonFiler.toLocaleString()} compared to a Non-Filer.`;
  } else {
    comparisonText = `A Filer would pay Rs ${filerTax.toLocaleString()} (saving Rs ${savingsVsNonFiler.toLocaleString()}).`;
  }

  return {
    propertyValue: value,
    transaction,
    filerStatus,
    sectionCode,
    rate,
    ratePercentage,
    taxAmount,
    totalForBuyer,
    netForSeller,
    oppositeFilerTax,
    savingsVsNonFiler,
    comparisonText,
  };
}

