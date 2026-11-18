import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculateUshr } from "./ushr";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { zakatRates } from "@/lib/rates/zakat";

describe("Prompt 34 — Methodology Page Ushr Section & Regression Suite", () => {
  const methodologyClientPath = path.join(
    process.cwd(),
    "src/app/methodology/MethodologyClient.tsx"
  );
  const methodologyPagePath = path.join(
    process.cwd(),
    "src/app/methodology/page.tsx"
  );

  const clientContent = fs.readFileSync(methodologyClientPath, "utf-8");
  const pageContent = fs.readFileSync(methodologyPagePath, "utf-8");

  it("Test 1: /methodology page includes all 6 sections with Section 6 heading '6. Ushr Calculator'", () => {
    expect(clientContent).toContain("1. Salary Tax Calculator (Section 149)");
    expect(clientContent).toContain("2. Complete Zakat Calculator");
    expect(clientContent).toContain("3. Property Advance Tax (236C &amp; 236K)");
    expect(clientContent).toContain("4. General Sales Tax (GST)");
    expect(clientContent).toContain("5. Fitrana (Sadqat-ul-Fitr)");
    expect(clientContent).toContain("<h2 className=\"text-lg font-bold text-primary\">6. Ushr Calculator</h2>");
  });

  it("Test 2: Section 6 English text contains all required rules, figures, citations and link", () => {
    expect(clientContent).toContain("Rain, river or spring water (natural irrigation): <strong>10%</strong> of the produce");
    expect(clientContent).toContain("Tube-well or drawn water (artificial irrigation): <strong>5%</strong> of the produce");
    expect(clientContent).toContain("Mixed irrigation: <strong>7.5%</strong> if both sources are used equally; otherwise the rate of the dominant source applies");
    expect(clientContent).toContain("Due at harvest — no Hawl (one lunar year) is required");
    expect(clientContent).toContain("No deduction for cultivation costs");
    expect(clientContent).toContain("1 maund = 40 kg");
    expect(clientContent).toContain("Note: the majority view applies a nisab of 5 wasq (about 653 kg, about 16.3 maund) to storable staple crops only. This calculator uses the Hanafi default (no nisab).");
    expect(clientContent).toContain("Sources: Quran 6:141; Sahih al-Bukhari 1483");
    expect(clientContent).toContain('href="/ushr-calculator"');
    expect(clientContent).toContain("Try it: Ushr Calculator &rarr;");
  });

  it("Test 3: Section 6 Roman Urdu mode contains exact required Urdu copy", () => {
    expect(clientContent).toContain("Baarish, darya ya chashme ka paani (qudrati aabpashi): fasal ka <strong>10%</strong>");
    expect(clientContent).toContain("Tube-well ya khincha hua paani (masnooi aabpashi): fasal ka <strong>5%</strong>");
    expect(clientContent).toContain("Mili-juli aabpashi: dono barabar hon to <strong>7.5%</strong>; warna jis zariye ka paani zyada ho, us ki sharah lagegi");
    expect(clientContent).toContain("Fasal katne par wajib — Hawl (aik saal guzarna) ki shart nahi");
    expect(clientContent).toContain("Kasht ke kharch ki koi katauti nahi");
    expect(clientContent).toContain("1 maund = 40 kg");
    expect(clientContent).toContain("Note: aksariyat ke nazdeek zakheera karne wali buniyadi faslon par 5 wasq (taqreeban 653 kg, taqreeban 16.3 maund) ka nisab hai. Ye calculator Hanafi default (koi nisab nahi) use karta hai.");
    expect(clientContent).toContain("Hawale: Quran 6:141; Sahih al-Bukhari 1483");
  });

  it("Test 4: Section 6 link targets /ushr-calculator", () => {
    expect(clientContent).toMatch(/<Link\s+href="\/ushr-calculator"[^>]*>\s*Try it: Ushr Calculator &rarr;\s*<\/Link>/);
  });

  it("Test 5: Section 2 Zakat contains exclusion pointer to Section 6 in English and Roman Urdu", () => {
    expect(clientContent).toContain(
      'Agricultural Ushr (5%–10% — {isRoman ? "alag se Section 6 mein diya gaya hai" : "covered separately in Section 6 below"})'
    );
  });

  it("Test 6: Ushr calculation regression — 1,000 kg wheat, Rs 130/kg, rain -> 100 kg, Rs 13,000", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });
    expect(res.ratePercentage).toBe("10%");
    expect(res.totalHarvestValue).toBe(130000);
    expect(res.ushrKind).toBe(100);
    expect(res.ushrKindUnit).toBe("kg");
    expect(res.ushrCashValue).toBe(13000);
  });

  it("Test 7: Salary calculation regression — Rs 150,000 monthly -> monthly tax Rs 6,000, take-home Rs 144,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.annualTax).toBe(72000);
    expect(res.monthlyTakeHome).toBe(144000);
  });

  it("Test 8: Zakat calculation regression — Cash Rs 500,000 -> Rs 12,500", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 400000,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 5000, // 52.5 tola * 5000 = Rs 262,500 nisab threshold
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(res.netZakatableWealth).toBe(500000);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(12500);
  });

  it("Metadata update: description mentions agricultural Ushr", () => {
    expect(pageContent).toContain("agricultural Ushr");
  });
});
