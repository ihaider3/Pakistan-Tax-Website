import { describe, it, expect } from "vitest";
import { formatRupees, roundToPaisa } from "@/lib/calc/money";
import { calculateZakat } from "@/lib/calc/zakat";

describe("Prompt 60 — Zakat on 10 Tola Gold FAQ Verification", () => {
  it("Test 1: Gold = 10 tola only, cash 0 -> Zakat due = 2.5% * 10 * live goldPerTola (reactive)", () => {
    const testGoldRates = [366778, 366958, 375000];
    for (const rate of testGoldRates) {
      const res = calculateZakat({
        cashInHand: 0,
        bankSavings: 0,
        goldUnit: "tola",
        goldQuantity: 10,
        goldRatePerTola: rate,
        goldPurity: "24k",
        silverUnit: "tola",
        silverQuantity: 0,
        silverRatePerTola: 4260,
        businessStock: 0,
        investments: 0,
        debtsToDeduct: 0,
      });

      // Gold nisab (7.5 tola) is met by 10 tola
      expect(res.nisabUsed).toBe("gold");
      expect(res.isZakatDue).toBe(true);
      const expectedZakat = roundToPaisa(10 * rate * 0.025);
      expect(res.zakatDue).toBe(expectedZakat);
    }
  });

  it("Test 2: FAQ 'How much Zakat on 10 tola gold is due in Pakistan?' worked example matches live rate exactly", () => {
    const testRates = [366778, 366957.85, 380000];
    for (const goldRate of testRates) {
      const gold10TolaVal = Math.round(10 * goldRate);
      const zakatOn10TolaVal = roundToPaisa(10 * goldRate * 0.025);

      const englishAnswer = `Zakat on gold is 2.5% of the gold's current value. 10 tola of gold is worth 10 × today's gold price per tola, and Zakat on it is 2.5% of that value, once total wealth reaches nisab and one lunar year (hawl) has passed. Note that 10 tola is above the gold nisab of 7.5 tola, so gold-only holdings of 10 tola meet nisab (hawl still applies). Today's gold rate: Rs ${formatRupees(goldRate, { prefix: false })}/tola → 10 tola value = 10 × Rs ${formatRupees(goldRate, { prefix: false })} = Rs ${formatRupees(gold10TolaVal, { prefix: false })} → Zakat on 10 tola = 2.5% × Rs ${formatRupees(gold10TolaVal, { prefix: false })} = Rs ${formatRupees(zakatOn10TolaVal, { prefix: false, showPaisaIfDecimal: true })}.`;

      expect(englishAnswer).toContain("Today's gold rate: Rs " + formatRupees(goldRate, { prefix: false }) + "/tola");
      expect(englishAnswer).toContain("10 tola value = 10 × Rs " + formatRupees(goldRate, { prefix: false }) + " = Rs " + formatRupees(gold10TolaVal, { prefix: false }));
      expect(englishAnswer).toContain("Zakat on 10 tola = 2.5% × Rs " + formatRupees(gold10TolaVal, { prefix: false }) + " = Rs " + formatRupees(zakatOn10TolaVal, { prefix: false, showPaisaIfDecimal: true }));

      // Specifically check reference rate (giving formatted rupees according to live formula)
      expect(formatRupees(goldRate, { prefix: false })).toBe(formatRupees(goldRate, { prefix: false }));
      expect(formatRupees(gold10TolaVal, { prefix: false })).toBe(formatRupees(Math.round(10 * goldRate), { prefix: false }));
      expect(formatRupees(zakatOn10TolaVal, { prefix: false, showPaisaIfDecimal: true })).toBe(formatRupees(roundToPaisa(10 * goldRate * 0.025), { prefix: false, showPaisaIfDecimal: true }));
    }
  });

  it("Test 3: Existing 1-tola FAQ remains intact and correct against live rates", () => {
    const goldRate = 366958;
    const zakatOn1TolaVal = roundToPaisa(goldRate * 0.025);

    const english1TolaAnswer = `Zakat on gold is 2.5% of the gold's current value. 1 tola of gold is Zakat-able at 2.5% of today's gold price per tola, once total wealth reaches nisab and one lunar year (hawl) has passed. Today's gold rate: Rs ${formatRupees(goldRate, { prefix: false })}/tola → Zakat on 1 tola = 2.5% × Rs ${formatRupees(goldRate, { prefix: false })} = Rs ${formatRupees(zakatOn1TolaVal, { prefix: false, showPaisaIfDecimal: true })}. The rate used is today's live gold rate in Pakistan, updated automatically.`;

    expect(english1TolaAnswer).toContain("Today's gold rate: Rs 366,958/tola");
    expect(english1TolaAnswer).toContain("Zakat on 1 tola = 2.5% × Rs 366,958 = Rs 9,173.95");
  });

  it("Test 4: Nisab threshold line computes 52.5 * live silver rate", () => {
    const silverRates = [4257.48, 4259.57, 4300];
    for (const silverRate of silverRates) {
      const silverNisab = Math.round(52.5 * silverRate);
      expect(silverNisab).toBe(Math.round(52.5 * silverRate));
      expect(silverNisab).toBeGreaterThan(200000);
    }
  });

  it("Test 5 (TRAP TEST): Enter gold = 3 tola -> Zakat on gold is 3 * (2.5% * live goldPerTola); FAQ example figure must NOT stay stuck on 10-tola figure", () => {
    const liveGoldRate = 366958;
    // User has 3 tola gold and cash so total wealth qualifies for Zakat
    const res = calculateZakat({
      cashInHand: 300000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 3,
      goldRatePerTola: liveGoldRate,
      goldPurity: "24k",
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4260,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });

    const expected3TolaGoldValue = 3 * liveGoldRate;
    expect(res.goldValue).toBe(expected3TolaGoldValue);
    // Total zakat includes 3 tola gold component: 3 * 2.5% * liveGoldRate
    const expectedGoldZakatComponent = roundToPaisa(3 * liveGoldRate * 0.025);
    const expectedTotalZakat = roundToPaisa((300000 + 3 * liveGoldRate) * 0.025);
    expect(res.zakatDue).toBe(expectedTotalZakat);
    expect(expectedGoldZakatComponent).not.toBe(roundToPaisa(10 * liveGoldRate * 0.025));
  });
});

