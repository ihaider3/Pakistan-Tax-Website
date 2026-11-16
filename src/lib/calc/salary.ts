import { salaryRates2026_27, SalaryTaxSlab } from "../rates/salary-2026-27";
import { salaryRates2025_26 } from "../rates/salary-2025-26";
import { roundToPaisa } from "./money";

export interface SlabBreakdownItem {
  slabIndex: number;
  description: string;
  taxableAmountInSlab: number;
  rate: number;
  rateLabel: string;
  taxForSlab: number;
  cumulativeTax: number;
}

export interface SalaryTaxResult {
  taxYear: "2026-27" | "2025-26";
  monthlySalary: number;
  annualSalary: number;
  annualTax: number;
  monthlyTax: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
  effectiveTaxRate: number; // percentage, e.g. 4.0
  appliedSlabIndex: number;
  appliedSlabDescription: string;
  breakdown: SlabBreakdownItem[];
  warning?: string;
  surchargeNote?: string;
}

export function calculateSalaryTax(
  salary: number,
  frequency: "monthly" | "annual",
  taxYear: "2026-27" | "2025-26" = "2026-27"
): SalaryTaxResult {
  const annualSalary = frequency === "monthly" ? salary * 12 : salary;
  const monthlySalary = frequency === "monthly" ? salary : salary / 12;

  const rateConfig = taxYear === "2026-27" ? salaryRates2026_27 : salaryRates2025_26;
  const slabs = rateConfig.slabs;

  let totalTaxPaisa = 0;
  let appliedSlabIndex = 0;
  const breakdown: SlabBreakdownItem[] = [];

  // Determine applicable slab and compute progressive tax
  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const prevMax = slab.min;
    const currentMax = slab.max;

    if (annualSalary > prevMax) {
      appliedSlabIndex = i;
      const taxableInThisSlab = currentMax !== null
        ? Math.min(annualSalary, currentMax) - prevMax
        : annualSalary - prevMax;

      const taxInThisSlab = taxableInThisSlab * slab.rate;
      totalTaxPaisa += Math.round(taxInThisSlab * 100);

      breakdown.push({
        slabIndex: i + 1,
        description: slab.description,
        taxableAmountInSlab: roundToPaisa(taxableInThisSlab),
        rate: slab.rate,
        rateLabel: `${slab.rate * 100}%`,
        taxForSlab: roundToPaisa(taxInThisSlab),
        cumulativeTax: roundToPaisa(totalTaxPaisa / 100),
      });
    } else {
      // Slab not reached
      breakdown.push({
        slabIndex: i + 1,
        description: slab.description,
        taxableAmountInSlab: 0,
        rate: slab.rate,
        rateLabel: `${slab.rate * 100}%`,
        taxForSlab: 0,
        cumulativeTax: roundToPaisa(totalTaxPaisa / 100),
      });
    }
  }

  const annualTax = roundToPaisa(totalTaxPaisa / 100);
  const monthlyTax = roundToPaisa(annualTax / 12);
  const annualTakeHome = roundToPaisa(annualSalary - annualTax);
  const monthlyTakeHome = roundToPaisa(monthlySalary - monthlyTax);
  const effectiveTaxRate = annualSalary > 0
    ? roundToPaisa((annualTax / annualSalary) * 100)
    : 0;

  let warning: string | undefined = undefined;
  if (annualSalary > 100000000) {
    warning = "Check with a tax professional — surcharge / other rules may apply.";
  }

  let surchargeNote: string | undefined = undefined;
  if (taxYear === "2025-26" && annualSalary > 10000000) {
    surchargeNote = "Surcharge: check FBR rate card (9% surcharge on tax for income > Rs 10M TO VERIFY; not applied silently).";
  }

  return {
    taxYear,
    monthlySalary: roundToPaisa(monthlySalary),
    annualSalary: roundToPaisa(annualSalary),
    annualTax,
    monthlyTax,
    annualTakeHome,
    monthlyTakeHome,
    effectiveTaxRate,
    appliedSlabIndex: appliedSlabIndex + 1,
    appliedSlabDescription: slabs[appliedSlabIndex]?.description ?? "",
    breakdown,
    warning,
    surchargeNote,
  };
}
