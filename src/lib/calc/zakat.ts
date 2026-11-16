import { zakatRates } from "../rates/zakat";
import { roundToPaisa } from "./money";

export interface ZakatInputs {
  cashInHand: number;
  bankSavings: number;
  goldUnit: "tola" | "grams";
  goldQuantity: number;
  goldRatePerTola: number;
  silverUnit: "tola" | "grams";
  silverQuantity: number;
  silverRatePerTola: number;
  businessStock: number;
  investments: number;
  debtsToDeduct: number;
  alreadyPaid?: number;
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
    silverUnit = "tola",
    silverQuantity = 0,
    silverRatePerTola = 0,
    businessStock = 0,
    investments = 0,
    debtsToDeduct = 0,
    alreadyPaid = 0,
  } = inputs;

  // Gold value calculation
  let goldValue = 0;
  if (goldQuantity > 0 && goldRatePerTola > 0) {
    if (goldUnit === "tola") {
      goldValue = goldQuantity * goldRatePerTola;
    } else {
      goldValue = (goldQuantity / zakatRates.gramsPerTola) * goldRatePerTola;
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
    nisabThreshold = roundToPaisa(zakatRates.goldNisabTola * goldRatePerTola);
    nisabExplanation = `Gold Nisab (7.5 tola / 87.48g @ Rs ${goldRatePerTola.toLocaleString()}/tola) applied because your assets consist solely of gold.`;
  } else {
    nisabUsed = "silver";
    // If silver rate not entered, fallback to 0 until entered
    nisabThreshold = roundToPaisa(zakatRates.silverNisabTola * silverRatePerTola);
    nisabExplanation = `Silver Nisab (52.5 tola / 612.36g @ Rs ${silverRatePerTola.toLocaleString()}/tola) applied as per Hanafi jurisprudence for mixed or liquid wealth.`;
  }

  const isZakatDue = nisabThreshold > 0 && netZakatableWealth >= nisabThreshold;
  const zakatDue = isZakatDue ? roundToPaisa(netZakatableWealth * zakatRates.zakatPercentage) : 0;
  const remainingDue = Math.max(0, roundToPaisa(zakatDue - alreadyPaid));
  const statusLabel = isZakatDue ? "Zakat Due" : "Zakat Not Due — below nisab";

  const assetBreakdown: ZakatAssetItem[] = [
    { category: "Cash in hand", detail: "Physical cash notes", grossValue: cashInHand },
    { category: "Bank Savings", detail: "Savings / checking accounts", grossValue: bankSavings },
    {
      category: "Gold",
      detail: `${goldQuantity} ${goldUnit} @ Rs ${goldRatePerTola.toLocaleString()}/tola`,
      grossValue: goldValue,
    },
    {
      category: "Silver",
      detail: `${silverQuantity} ${silverUnit} @ Rs ${silverRatePerTola.toLocaleString()}/tola`,
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

