export type UshrIrrigationType = "rain" | "tubewell" | "mixed";
export type UshrUnit = "kg" | "maund";

export interface UshrCropOption {
  id: string;
  nameEn: string;
  nameRoman: string;
}

export const USHR_CROPS: UshrCropOption[] = [
  { id: "wheat", nameEn: "Wheat", nameRoman: "Wheat (Gehun)" },
  { id: "rice", nameEn: "Rice", nameRoman: "Rice (Chawal)" },
  { id: "maize", nameEn: "Maize", nameRoman: "Maize (Makai)" },
  { id: "cotton", nameEn: "Cotton", nameRoman: "Cotton (Kapas)" },
  { id: "sugarcane", nameEn: "Sugarcane", nameRoman: "Sugarcane (Ganna)" },
  { id: "barley", nameEn: "Barley", nameRoman: "Barley (Jau)" },
  { id: "dates", nameEn: "Dates", nameRoman: "Dates (Khajoor)" },
  { id: "vegetables", nameEn: "Vegetables", nameRoman: "Vegetables (Sabzi)" },
  { id: "fruits", nameEn: "Fruits", nameRoman: "Fruits (Phal)" },
  { id: "other", nameEn: "Other", nameRoman: "Other (Digar)" },
];

export const ushrRates = {
  metadata: {
    source: "Quran 6:141 & Sahih al-Bukhari 1483 (Islamic Fiqh)",
    sourceDocument: "Hanafi Standard for Pakistan & Sahih Hadith Injunctions",
    lastVerified: "17 Nov 2026",
    notes: "Ushr is due at harvest with no 1-year holding period (Hawl). Costs of seed, fertiliser, or harvesting are not deducted. 1 maund = 40 kg.",
  },
  rates: {
    rain: {
      rate: 0.10,
      percent: "10%",
      labelEn: "Rain / River / Spring — 10%",
      labelRoman: "Barish / Nehri Pani — 10%",
      descriptionEn: "Naturally watered crops (rain, river, spring, natural streams) with zero artificial extraction cost.",
      descriptionRoman: "Barish, darya ya qudrati nehron se sairab fasal jis par pani ka kharcha nahi hota.",
      hadithRef: "Sahih al-Bukhari 1483",
    },
    tubewell: {
      rate: 0.05,
      percent: "5%",
      labelEn: "Tube-well / Well / Drawn water — 5%",
      labelRoman: "Tube-well / Khud Pani — 5%",
      descriptionEn: "Artificially irrigated crops (tube-well, diesel pump, canal lift, drawn well) involving cost or labor.",
      descriptionRoman: "Tube-well, well ya machinery ke zariye nikale gaye pani par 5% (nisf ushr) wajib hai.",
      hadithRef: "Sahih al-Bukhari 1483",
    },
    mixed: {
      rate: 0.075,
      percent: "7.5%",
      labelEn: "Mixed — both methods — 7.5%",
      labelRoman: "Mixed — Dono Barabar — 7.5%",
      descriptionEn: "7.5% applies when both methods watered the crop about equally. If one method was dominant, choose that method above.",
      descriptionRoman: "7.5% tab lagu hota hai jab dono tareeqon se lagbhag barabar pani diya gaya ho. Agar koi ek tareeqa ghalib raha ho to usi ka rate chunein.",
      hadithRef: "Hanafi Jurisprudence Consensus",
    },
  },
  kgPerMaund: 40,
  majorityNisabKg: 653, // 5 wasq ≈ 653 kg
  majorityNisabMaund: 16.325, // 653 / 40 ≈ 16.3 maund
  references: [
    {
      source: "Quran 6:141",
      arabic: "وَآتُوا حَقَّهُ يَوْمَ حَصَادِهِ",
      translationEn: "…and give its due on the day of its harvest.",
      translationRoman: "…aur fasal katne ke din uska haq (Ushr) ada karo.",
    },
    {
      source: "Sahih al-Bukhari 1483",
      translationEn:
        "On a land irrigated by rain water or by natural water channels… Ushr (one-tenth) is compulsory; and on the land irrigated by the well, half of an Ushr (one-twentieth) is compulsory.",
      translationRoman:
        "Jis zameen ko barish ya qudrati chashmon ne sairab kiya ho us par Ushr (10%) hai, aur jo zameen kuen (ya masnooi tareeqe) se sairab ki jaye us par aadha Ushr (5%) hai.",
    },
  ],
  disclaimer:
    "Ye sirf rehnumai ke liye hai — fatwa nahi. Apni khaas surat-e-haal ke liye kisi qualified Mufti se mashwara karein.",
};

