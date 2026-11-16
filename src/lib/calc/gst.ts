import { gstRates } from "../rates/gst";
import { roundToPaisa } from "./money";

export type GstMode = "add" | "remove" | "amount_only";

export interface GstCalculationResult {
  inputAmount: number;
  mode: GstMode;
  rate: number; // e.g. 0.18
  ratePercentage: string; // "18%"
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export function calculateGst(
  amount: number,
  mode: GstMode = "add",
  ratePercent: number = 18
): GstCalculationResult {
  const rate = ratePercent / 100;
  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === "add") {
    baseAmount = amount;
    gstAmount = roundToPaisa(baseAmount * rate);
    totalAmount = roundToPaisa(baseAmount + gstAmount);
  } else if (mode === "remove") {
    totalAmount = amount;
    if (1 + rate !== 0) {
      baseAmount = roundToPaisa(totalAmount / (1 + rate));
      gstAmount = roundToPaisa(totalAmount - baseAmount);
    }
  } else {
    // amount_only (input amount represents the GST paid/collected)
    gstAmount = amount;
    baseAmount = rate > 0 ? roundToPaisa(gstAmount / rate) : 0;
    totalAmount = roundToPaisa(baseAmount + gstAmount);
  }

  const ratePercentage = `${ratePercent}%`;

  return {
    inputAmount: amount,
    mode,
    rate,
    ratePercentage,
    baseAmount,
    gstAmount,
    totalAmount,
  };
}
