export type { UshrIrrigationType, UshrUnit } from "../rates/ushr";

import {
  UshrIrrigationType,
  UshrUnit,
  USHR_CROPS,
  ushrRates,
} from "../rates/ushr";
import { roundToPaisa } from "./money";

export interface UshrCalculationInputs {
  crop: string;
  quantity: number;
  unit: UshrUnit;
  pricePerUnit: number;
  irrigation: UshrIrrigationType;
}

export interface UshrCalculationResult {
  cropId: string;
  cropNameEn: string;
  cropNameRoman: string;
  quantity: number;
  unit: UshrUnit;
  quantityKg: number;
  quantityMaund: number;
  convertedQuantityDisplay: string; // e.g. "25 maund = 1,000 kg" or "1,000 kg = 25 maund"
  pricePerUnit: number;
  totalHarvestValue: number;
  irrigation: UshrIrrigationType;
  rate: number;
  ratePercentage: string; // "10%", "5%", "7.5%"
  irrigationLabelEn: string;
  irrigationLabelRoman: string;
  ushrKind: number; // in user's selected unit
  ushrKindUnit: UshrUnit;
  ushrKindSecondary: number; // in the other unit
  ushrKindSecondaryUnit: UshrUnit;
  ushrKindDisplay: string; // e.g. "100 kg wheat" or "2.5 maund (100 kg) wheat"
  ushrCashValue: number; // in rupees
  hanafiNisabNote: string;
  majorityNisabStatus: "at_or_above" | "below";
  majorityNisabNoteEn: string;
  majorityNisabNoteRoman: string;
  formulaKind: string;
  formulaCash: string;
}

export function calculateUshr({
  crop,
  quantity,
  unit,
  pricePerUnit,
  irrigation,
}: UshrCalculationInputs): UshrCalculationResult {
  const cropObj = USHR_CROPS.find((c) => c.id === crop) || USHR_CROPS[0];
  const rateConfig = ushrRates.rates[irrigation] || ushrRates.rates.rain;
  const rate = rateConfig.rate;

  const validQty = isNaN(quantity) || quantity < 0 ? 0 : quantity;
  const validPrice = isNaN(pricePerUnit) || pricePerUnit < 0 ? 0 : pricePerUnit;

  let quantityKg = 0;
  let quantityMaund = 0;
  let convertedQuantityDisplay = "";

  if (unit === "kg") {
    quantityKg = validQty;
    quantityMaund = roundToPaisa(validQty / ushrRates.kgPerMaund);
    convertedQuantityDisplay = `${validQty.toLocaleString()} kg = ${quantityMaund.toLocaleString()} maund`;
  } else {
    quantityMaund = validQty;
    quantityKg = roundToPaisa(validQty * ushrRates.kgPerMaund);
    convertedQuantityDisplay = `${validQty.toLocaleString()} maund = ${quantityKg.toLocaleString()} kg`;
  }

  const totalHarvestValue = roundToPaisa(validQty * validPrice);

  const ushrKind = roundToPaisa(validQty * rate);
  const ushrCashValue = roundToPaisa(totalHarvestValue * rate);

  let ushrKindSecondary = 0;
  let ushrKindDisplay = "";

  if (unit === "kg") {
    ushrKindSecondary = roundToPaisa(ushrKind / ushrRates.kgPerMaund);
    ushrKindDisplay = `${ushrKind.toLocaleString()} kg ${cropObj.nameEn.toLowerCase()}`;
  } else {
    ushrKindSecondary = roundToPaisa(ushrKind * ushrRates.kgPerMaund);
    ushrKindDisplay = `${ushrKind.toLocaleString()} maund (${ushrKindSecondary.toLocaleString()} kg) ${cropObj.nameEn.toLowerCase()}`;
  }

  const majorityNisabKg = ushrRates.majorityNisabKg;
  const isAtOrAbove = quantityKg >= majorityNisabKg;
  const majorityNisabStatus = isAtOrAbove ? "at_or_above" : "below";

  const hanafiNisabNote =
    "Hanafi position: Ushr is due on any quantity — no minimum nisab.";

  const majorityComparisonEn = isAtOrAbove ? "at or above" : "below";
  const majorityComparisonRoman = isAtOrAbove ? "barabar ya zyada" : "kam";

  const majorityNisabNoteEn = `Majority position (Shafi'i, Maliki, Hanbali): nisab is 5 wasq (≈ 653 kg / 16.3 maund). Your harvest of ${quantityKg.toLocaleString()} kg is ${majorityComparisonEn} this nisab.`;
  const majorityNisabNoteRoman = `Jumhoor (Shafi'i, Maliki, Hanbali) ka mauqaf: nisab 5 wasq (≈ 653 kg / 16.3 maund) hai. Aapki ${quantityKg.toLocaleString()} kg ki paidawar is nisab se ${majorityComparisonRoman} hai.`;

  const formulaKind = `${validQty.toLocaleString()} ${unit} × ${rateConfig.percent} = ${ushrKind.toLocaleString()} ${unit}`;
  const formulaCash = `Rs ${totalHarvestValue.toLocaleString()} × ${rateConfig.percent} = Rs ${ushrCashValue.toLocaleString()}`;

  return {
    cropId: cropObj.id,
    cropNameEn: cropObj.nameEn,
    cropNameRoman: cropObj.nameRoman,
    quantity: validQty,
    unit,
    quantityKg,
    quantityMaund,
    convertedQuantityDisplay,
    pricePerUnit: validPrice,
    totalHarvestValue,
    irrigation,
    rate,
    ratePercentage: rateConfig.percent,
    irrigationLabelEn: rateConfig.labelEn,
    irrigationLabelRoman: rateConfig.labelRoman,
    ushrKind,
    ushrKindUnit: unit,
    ushrKindSecondary,
    ushrKindSecondaryUnit: unit === "kg" ? "maund" : "kg",
    ushrKindDisplay,
    ushrCashValue,
    hanafiNisabNote,
    majorityNisabStatus,
    majorityNisabNoteEn,
    majorityNisabNoteRoman,
    formulaKind,
    formulaCash,
  };
}

