import { fitranaRates2026, StapleType, FitranaSourceKey } from "../rates/fitrana-2026";
import { roundToPaisa } from "./money";

export interface FitranaCalculationResult {
  familyMembers: number;
  staple: StapleType;
  sourceKey: FitranaSourceKey;
  sourceName: string;
  sourceDate: string;
  stapleName: string;
  weightDescription: string;
  perPersonRate: number;
  totalFitrana: number;
  alternateSourcePerPerson: number;
  alternateSourceTotal: number;
  alternateSourceName: string;
}

export function calculateFitrana(
  members: number,
  staple: StapleType = "wheat",
  source: FitranaSourceKey = "muneeb"
): FitranaCalculationResult {
  if (members < 1 || !Number.isInteger(members)) {
    throw new Error("Number of family members must be at least 1");
  }
  if (members > 50) {
    throw new Error("Maximum family members allowed is 50");
  }

  const selectedSource = fitranaRates2026.sources[source];
  const rateItem = selectedSource.rates[staple];
  const perPersonRate = rateItem.amount;
  const totalFitrana = roundToPaisa(members * perPersonRate);

  const alternateKey: FitranaSourceKey = source === "muneeb" ? "cii" : "muneeb";
  const alternateSource = fitranaRates2026.sources[alternateKey];
  const alternateRateItem = alternateSource.rates[staple];
  const alternateSourcePerPerson = alternateRateItem.amount;
  const alternateSourceTotal = roundToPaisa(members * alternateSourcePerPerson);

  return {
    familyMembers: members,
    staple,
    sourceKey: source,
    sourceName: selectedSource.name,
    sourceDate: selectedSource.announcedDate,
    stapleName: rateItem.name,
    weightDescription: rateItem.weightDescription,
    perPersonRate,
    totalFitrana,
    alternateSourcePerPerson,
    alternateSourceTotal,
    alternateSourceName: alternateSource.name,
  };
}

