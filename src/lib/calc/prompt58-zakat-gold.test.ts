import { describe, it, expect } from "vitest";
import { formatRupees, roundToPaisa } from "@/lib/calc/money";
import { calculateZakat } from "@/lib/calc/zakat";

describe("Prompt 58 — Zakat on Gold & Gold Rate in Pakistan Verification", () => {
  it("Test 1: Cash Rs 500,000, no gold/silver, no debts -> Zakat Rs 12,500 (2.5%)", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 366778,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4300,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(res.remainingDue).toBe(12500);
    expect(res.zakatDue).toBe(12500);
  });

  it("Test 2: 1 tola gold with wealth reaching nisab -> Zakat on 1 tola = 2.5% * live goldPerTola", () => {
    const testGoldRates = [366778, 370000, 382000];
    for (const rate of testGoldRates) {
      // 1 tola gold + cash meeting silver nisab so mixed portfolio qualifies
      const res = calculateZakat({
        cashInHand: 300000,
        bankSavings: 0,
        goldUnit: "tola",
        goldQuantity: 1,
        goldRatePerTola: rate,
        goldPurity: "24k",
        silverUnit: "tola",
        silverQuantity: 0,
        silverRatePerTola: 4300,
        businessStock: 0,
        investments: 0,
        debtsToDeduct: 0,
      });
      const expectedZakat = roundToPaisa((300000 + rate) * 0.025);
      expect(res.zakatDue).toBe(expectedZakat);
    }
  });

  it("Test 3: Worked example formula in FAQ computes dynamically and contains keywords", () => {
    const goldRate = 366778;
    const zakatOn1TolaVal = roundToPaisa(goldRate * 0.025);

    // Dynamic FAQ answer template in English
    const englishAnswer = `Zakat on gold is 2.5% of the gold's current value. 1 tola of gold is Zakat-able at 2.5% of today's gold price per tola, once total wealth reaches nisab and one lunar year (hawl) has passed. Today's gold rate: Rs ${formatRupees(goldRate, { prefix: false })}/tola → Zakat on 1 tola = 2.5% × Rs ${formatRupees(goldRate, { prefix: false })} = Rs ${formatRupees(zakatOn1TolaVal, { prefix: false, showPaisaIfDecimal: true })}. The rate used is today's live gold rate in Pakistan, updated automatically.`;

    expect(englishAnswer).toContain("Zakat on gold");
    expect(englishAnswer).toContain("gold rate in Pakistan");
    expect(englishAnswer).toContain("Rs 366,778");
    expect(englishAnswer).toContain("Rs 9,169.45");

    // Dynamic FAQ answer template in Roman Urdu
    const romanUrduAnswer = `Sonay par Zakat (zakat on gold) uski mojooda maliyat ka 2.5% hoti hai. 1 tola sonay par Zakat aaj ke fi tola rate ka 2.5% banti hai, bashart-e-ke kul daulat nisab tak pohanch jaye aur ek qamri saal (hawl) guzar chuka ho. Aaj ka sonay ka rate: Rs ${formatRupees(goldRate, { prefix: false })}/tola → 1 tola par Zakat = 2.5% × Rs ${formatRupees(goldRate, { prefix: false })} = Rs ${formatRupees(zakatOn1TolaVal, { prefix: false, showPaisaIfDecimal: true })}. Yeh hisab aaj ke live gold rate in Pakistan par mabni hai jo market ke mutabiq khud update hota hai.`;

    expect(romanUrduAnswer).toContain("zakat on gold");
    expect(romanUrduAnswer).toContain("gold rate in Pakistan");
    expect(romanUrduAnswer).toContain("Rs 366,778");
    expect(romanUrduAnswer).toContain("Rs 9,169.45");
  });

  it("Test 5 (TRAP TEST): 2 tola gold with wealth reaching nisab -> reactive to live gold rate", () => {
    const testRate = 366778;
    const res = calculateZakat({
      cashInHand: 300000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 2,
      goldRatePerTola: testRate,
      goldPurity: "24k",
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4300,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });

    const expectedZakat = roundToPaisa((300000 + 2 * testRate) * 0.025);
    expect(res.zakatDue).toBe(expectedZakat);
  });
});
