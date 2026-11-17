import { zakatRates } from "../rates/zakat";
import { roundToPaisa } from "./money";

export type GoldPurity = "24k" | "22k" | "21k" | "18k";

export const GOLD_PURITY_CONFIG: Record<
  GoldPurity,
  { fraction: number; percent: string; karat: number }
> = {
  "24k": { fraction: 1.0, percent: "100%", karat: 24 },
  "22k": { fraction: 0.9167, percent: "91.67%", karat: 22 },
  "21k": { fraction: 0.875, percent: "87.5%", karat: 21 },
  "18k": { fraction: 0.75, percent: "75%", karat: 18 },
};

export interface ZakatInputs {
  cashInHand: number;
  bankSavings: number;
  goldUnit: "tola" | "grams";
  goldQuantity: number;
  goldRatePerTola: number;
  goldPurity?: GoldPurity;
  silverUnit: "tola" | "grams";
  silverQuantity: number;
  silverRatePerTola: number;
  businessStock: number;
  investments: number;
  debtsToDeduct: number;
  alreadyPaid?: number;
  customSilverNisab?: number;
}

export interface ZakatAssetItem {
  category: string;
  detail: string;
  grossValue: number;
}

export interface ZakatCalculationResult {
  totalGrossWealth: number;
  totalDebts: number;
  netZakatableWealth: number;
  goldValue: number;
  goldPurity: GoldPurity;
  silverValue: number;
  nisabUsed: "silver" | "gold";
  nisabThreshold: number;
  nisabExplanation: string;
  isZakatDue: boolean;
  statusLabel: string; // "Zakat Due" | "Zakat Not Due — below nisab"
  zakatDue: number;
  alreadyPaid: number;
  remainingDue: number;
  assetBreakdown: ZakatAssetItem[];
}

export function calculateZakat(inputs: ZakatInputs): ZakatCalculationResult {
  const {
    cashInHand = 0,
    bankSavings = 0,
    goldUnit = "tola",
    goldQuantity = 0,
    goldRatePerTola = 0,
    goldPurity = "24k",
    silverUnit = "tola",
    silverQuantity = 0,
    silverRatePerTola = 0,
    businessStock = 0,
    investments = 0,
    debtsToDeduct = 0,
    alreadyPaid = 0,
    customSilverNisab,
  } = inputs;

  const purityInfo = GOLD_PURITY_CONFIG[goldPurity] || GOLD_PURITY_CONFIG["24k"];
  const purityFraction = purityInfo.fraction;

  // Gold value calculation: quantity * displayed rate * purity fraction
  let goldValue = 0;
  if (goldQuantity > 0 && goldRatePerTola > 0) {
    if (goldUnit === "tola") {
      goldValue = goldQuantity * goldRatePerTola * purityFraction;
    } else {
      goldValue = (goldQuantity / zakatRates.gramsPerTola) * goldRatePerTola * purityFraction;
    }
  }
  goldValue = roundToPaisa(goldValue);

  // Silver value calculation
  let silverValue = 0;
  if (silverQuantity > 0 && silverRatePerTola > 0) {
    if (silverUnit === "tola") {
      silverValue = silverQuantity * silverRatePerTola;
    } else {
      silverValue = (silverQuantity / zakatRates.gramsPerTola) * silverRatePerTola;
    }
  }
  silverValue = roundToPaisa(silverValue);

  const totalGrossWealth = roundToPaisa(
    cashInHand + bankSavings + goldValue + silverValue + businessStock + investments
  );
  const netZakatableWealth = roundToPaisa(Math.max(0, totalGrossWealth - debtsToDeduct));

  // Determine Nisab:
  // If wealth is ONLY gold (no cash, bank, silver, business, investments)
  const nonGoldAssets = cashInHand + bankSavings + silverValue + businessStock + investments;
  const isOnlyGold = goldValue > 0 && nonGoldAssets === 0;

  let nisabUsed: "gold" | "silver" = "silver";
  let nisabThreshold = 0;
  let nisabExplanation = "";

  if (isOnlyGold) {
    nisabUsed = "gold";
    nisabThreshold = Math.round(zakatRates.goldNisabTola * goldRatePerTola);
    nisabExplanation = `Gold Nisab (7.5 tola / 87.48g @ Rs ${goldRatePerTola.toFixed(2)}/tola) applied because your assets consist solely of gold.`;
  } else {
    nisabUsed = "silver";
    if (customSilverNisab && customSilverNisab > 0) {
      nisabThreshold = Math.round(customSilverNisab);
      nisabExplanation = `Silver Nisab (52.5 tola / 612.36g @ Rs ${silverRatePerTola.toFixed(2)}/tola) applied as per Hanafi jurisprudence for mixed or liquid wealth.`;
    } else {
      nisabThreshold = Math.round(zakatRates.silverNisabTola * silverRatePerTola);
      if (silverRatePerTola > 0) {
        nisabExplanation = `Silver Nisab (52.5 tola / 612.36g @ Rs ${silverRatePerTola.toFixed(2)}/tola) applied as per Hanafi jurisprudence for mixed or liquid wealth.`;
      } else {
        nisabExplanation = `Silver Nisab (52.5 tola / 612.36g) — enter today's silver rate in Step 2 to establish your Nisab threshold.`;
      }
    }
  }

  const isZakatDue = nisabThreshold > 0 && netZakatableWealth >= nisabThreshold;
  const zakatDue = isZakatDue ? roundToPaisa(netZakatableWealth * zakatRates.zakatPercentage) : 0;
  const remainingDue = Math.max(0, roundToPaisa(zakatDue - alreadyPaid));
  const statusLabel = isZakatDue ? "Zakat Due" : "Zakat Not Due — below nisab";

  const goldDetail =
    goldPurity !== "24k"
      ? `${goldQuantity} ${goldUnit} ${purityInfo.karat}K @ Rs ${goldRatePerTola.toFixed(2)}/tola × ${purityInfo.percent}`
      : `${goldQuantity} ${goldUnit} @ Rs ${goldRatePerTola.toFixed(2)}/tola`;

  const assetBreakdown: ZakatAssetItem[] = [
    { category: "Cash in hand", detail: "Physical cash notes", grossValue: cashInHand },
    { category: "Bank Savings", detail: "Savings / checking accounts", grossValue: bankSavings },
    {
      category: "Gold",
      detail: goldDetail,
      grossValue: goldValue,
    },
    {
      category: "Silver",
      detail: `${silverQuantity} ${silverUnit} @ Rs ${silverRatePerTola.toFixed(2)}/tola`,
      grossValue: silverValue,
    },
    { category: "Business stock / goods", detail: "Trade inventory at cost/market", grossValue: businessStock },
    { category: "Investments & Shares", detail: "Stocks, mutual funds, certificates", grossValue: investments },
  ];

  return {
    totalGrossWealth,
    totalDebts: roundToPaisa(debtsToDeduct),
    netZakatableWealth,
    goldValue,
    goldPurity,
    silverValue,
    nisabUsed,
    nisabThreshold,
    nisabExplanation,
    isZakatDue,
    statusLabel,
    zakatDue,
    alreadyPaid: roundToPaisa(alreadyPaid),
    remainingDue,
    assetBreakdown,
  };
}

