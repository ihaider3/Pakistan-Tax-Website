import { RatesMetadata } from "./salary-2026-27";

export type StapleType = "wheat" | "barley" | "dates" | "raisins";
export type FitranaSourceKey = "muneeb" | "cii";

export interface StapleRate {
  id: StapleType;
  name: string;
  weightDescription: string;
  amount: number;
}

export const fitranaRates2026 = {
  metadata: {
    source: "Mufti Muneeb-ur-Rehman (21 Feb 2026) & Council of Islamic Ideology (Ramadan 2026)",
    sourceDocument: "Official Ramadan 2026 Fitrana / Sadqat-ul-Fitr Announcements",
    lastVerified: "14 Nov 2026",
    notes: "Rates conflict across scholarly bodies on barley, dates, and raisins. Wheat Rs 300 per person is the consensus minimum rate.",
  } as RatesMetadata,
  sources: {
    muneeb: {
      key: "muneeb" as FitranaSourceKey,
      name: "Mufti Muneeb-ur-Rehman",
      announcedDate: "21 Feb 2026",
      rates: {
        wheat: { id: "wheat" as StapleType, name: "Wheat (Gandum)", weightDescription: "2 kg", amount: 300 },
        barley: { id: "barley" as StapleType, name: "Barley (Jau)", weightDescription: "4 kg", amount: 1160 },
        dates: { id: "dates" as StapleType, name: "Dates (Khajoor)", weightDescription: "4 kg", amount: 2800 },
        raisins: { id: "raisins" as StapleType, name: "Raisins (Kishmish)", weightDescription: "4 kg", amount: 7200 },
      },
    },
    cii: {
      key: "cii" as FitranaSourceKey,
      name: "Council of Islamic Ideology (CII)",
      announcedDate: "Ramadan 2026",
      subsidisedFlour: 200,
      rates: {
        wheat: { id: "wheat" as StapleType, name: "Wheat (Gandum)", weightDescription: "Standard 2 kg", amount: 300 },
        barley: { id: "barley" as StapleType, name: "Barley (Jau)", weightDescription: "Standard 4 kg", amount: 1100 },
        dates: { id: "dates" as StapleType, name: "Dates (Khajoor)", weightDescription: "Standard 4 kg", amount: 1600 },
        raisins: { id: "raisins" as StapleType, name: "Raisins (Kishmish)", weightDescription: "Standard 4 kg", amount: 3800 },
      },
    },
  },
  consensusWheatRate: 300,
  disclaimerText: "Fitrana (Zakat al-Fitr) is obligatory per person for every self-sufficient Muslim and dependents before Eid prayer. These are minimum recommended amounts — you may pay higher amounts (barley, dates, raisins) according to your financial means. Fidya and Kaffara are not included.",
};

