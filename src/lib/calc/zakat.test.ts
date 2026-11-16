import { describe, it, expect } from "vitest";
import { calculateZakat, ZakatInputs } from "./zakat";

describe("Complete Zakat Calculator (Hanafi standard)", () => {
  const baseInput: ZakatInputs = {
    cashInHand: 0,
    bankSavings: 0,
    goldUnit: "tola",
    goldQuantity: 0,
    goldRatePerTola: 400000,
    silverUnit: "tola",
    silverQuantity: 0,
    silverRatePerTola: 5500,
    businessStock: 0,
    investments: 0,
    debtsToDeduct: 0,
    alreadyPaid: 0,
  };

  // Test 1: Cash 1,000,000, silver rate 5,500/tola -> nisab 288,750, zakat 25,000
  it("computes Cash 1,000,000, silver rate 5,500/tola -> nisab 288,750, zakat 25,000", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 1000000,
      silverRatePerTola: 5500,
    });
    expect(res.nisabThreshold).toBe(288750); // 52.5 * 5500
    expect(res.isZakatDue).toBe(true);
    expect(res.statusLabel).toBe("Zakat Due");
    expect(res.zakatDue).toBe(25000); // 2.5% of 1,000,000
    expect(res.remainingDue).toBe(25000);
  });

  // Test 2: Cash 200,000 -> below nisab -> zakat 0, Not Due
  it("computes Cash 200,000 -> below nisab -> zakat 0, Not Due", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 200000,
      silverRatePerTola: 5500,
    });
    expect(res.nisabThreshold).toBe(288750);
    expect(res.isZakatDue).toBe(false);
    expect(res.statusLabel).toBe("Zakat Not Due — below nisab");
    expect(res.zakatDue).toBe(0);
  });

  // Test 3: Gold only 10 tola at 400,000/tola -> nisab gold 3,000,000, zakat 100,000
  it("computes Gold only 10 tola at 400,000/tola -> nisab gold 3,000,000, zakat 100,000", () => {
    const res = calculateZakat({
      ...baseInput,
      goldQuantity: 10,
      goldUnit: "tola",
      goldRatePerTola: 400000,
      silverRatePerTola: 5500,
    });
    expect(res.nisabUsed).toBe("gold");
    expect(res.nisabThreshold).toBe(3000000); // 7.5 * 400,000
    expect(res.netZakatableWealth).toBe(4000000); // 10 * 400,000
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(100000); // 4,000,000 * 0.025
  });

  // Test 4: Mixed 500,000 cash + 2 tola gold (800,000) - 100,000 debts = 1,200,000 net -> zakat 30,000
  it("computes Mixed 500,000 cash + 2 tola gold (800,000) - 100,000 debts = 1,200,000 net -> zakat 30,000", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 500000,
      goldQuantity: 2,
      goldUnit: "tola",
      goldRatePerTola: 400000,
      debtsToDeduct: 100000,
      silverRatePerTola: 5500,
    });
    expect(res.goldValue).toBe(800000);
    expect(res.netZakatableWealth).toBe(1200000);
    expect(res.nisabUsed).toBe("silver");
    expect(res.zakatDue).toBe(30000); // 1,200,000 * 0.025
  });

  // Test 5: Business 2,000,000 - 500,000 debts = 1,500,000 -> zakat 37,500
  it("computes Business 2,000,000 - 500,000 debts = 1,500,000 -> zakat 37,500", () => {
    const res = calculateZakat({
      ...baseInput,
      businessStock: 2000000,
      debtsToDeduct: 500000,
      silverRatePerTola: 5500,
    });
    expect(res.netZakatableWealth).toBe(1500000);
    expect(res.zakatDue).toBe(37500); // 1,500,000 * 0.025
  });

  // Test 6: Gold only below gold nisab (7 tola at 400,000)
  it("handles Gold only below nisab (7 tola = 2,800,000 < 3,000,000)", () => {
    const res = calculateZakat({
      ...baseInput,
      goldQuantity: 7,
      goldUnit: "tola",
      goldRatePerTola: 400000,
    });
    expect(res.nisabUsed).toBe("gold");
    expect(res.nisabThreshold).toBe(3000000);
    expect(res.isZakatDue).toBe(false);
    expect(res.zakatDue).toBe(0);
  });

  // Test 7: Gold specified in grams (87.48 grams = 7.5 tola)
  it("converts gold grams accurately to tola valuation", () => {
    const res = calculateZakat({
      ...baseInput,
      goldQuantity: 87.48,
      goldUnit: "grams",
      goldRatePerTola: 400000,
    });
    expect(res.goldValue).toBe(3000000);
    expect(res.nisabThreshold).toBe(3000000);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(75000);
  });

  // Test 8: Silver specified in grams (612.36 grams = 52.5 tola)
  it("converts silver grams accurately to tola valuation", () => {
    const res = calculateZakat({
      ...baseInput,
      silverQuantity: 612.36,
      silverUnit: "grams",
      silverRatePerTola: 5000,
    });
    expect(res.silverValue).toBe(262500); // 52.5 * 5000
    expect(res.nisabThreshold).toBe(262500);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(6562.5);
  });

  // Test 9: Already paid deduction
  it("subtracts already paid zakat from zakat due", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 1000000,
      silverRatePerTola: 5500,
      alreadyPaid: 10000,
    });
    expect(res.zakatDue).toBe(25000);
    expect(res.alreadyPaid).toBe(10000);
    expect(res.remainingDue).toBe(15000);
  });

  // Test 10: Already paid exceeds zakat due
  it("floors remaining zakat at 0 if already paid exceeds total due", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 1000000,
      silverRatePerTola: 5500,
      alreadyPaid: 30000,
    });
    expect(res.zakatDue).toBe(25000);
    expect(res.remainingDue).toBe(0);
  });

  // Test 11: Debts exceeding assets
  it("floors net zakatable wealth at 0 when debts exceed gross assets", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 100000,
      debtsToDeduct: 500000,
      silverRatePerTola: 5500,
    });
    expect(res.netZakatableWealth).toBe(0);
    expect(res.isZakatDue).toBe(false);
    expect(res.zakatDue).toBe(0);
  });

  // Test 12: Exact nisab threshold
  it("triggers Zakat Due when net wealth exactly equals nisab threshold", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 288750,
      silverRatePerTola: 5500,
    });
    expect(res.nisabThreshold).toBe(288750);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(7218.75);
  });

  // Test 13: 1 Rupee below nisab threshold
  it("evaluates Not Due when wealth is 1 rupee below nisab threshold", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 288749,
      silverRatePerTola: 5500,
    });
    expect(res.nisabThreshold).toBe(288750);
    expect(res.isZakatDue).toBe(false);
    expect(res.zakatDue).toBe(0);
  });

  // Test 14: Bank savings + Shares investments
  it("includes bank savings and shares investments in net wealth", () => {
    const res = calculateZakat({
      ...baseInput,
      bankSavings: 500000,
      investments: 500000,
      silverRatePerTola: 5500,
    });
    expect(res.netZakatableWealth).toBe(1000000);
    expect(res.zakatDue).toBe(25000);
  });

  // Test 15: Breakdown list check
  it("populates all 6 asset categories in assetBreakdown", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 100000,
      bankSavings: 200000,
      silverRatePerTola: 5500,
    });
    expect(res.assetBreakdown.length).toBe(6);
    expect(res.assetBreakdown[0].grossValue).toBe(100000);
    expect(res.assetBreakdown[1].grossValue).toBe(200000);
  });

  // Test 16: Zero assets check
  it("evaluates zero assets cleanly without error", () => {
    const res = calculateZakat({ ...baseInput, silverRatePerTola: 5500 });
    expect(res.totalGrossWealth).toBe(0);
    expect(res.isZakatDue).toBe(false);
    expect(res.zakatDue).toBe(0);
  });

  // Test 17: Silver only asset uses silver nisab
  it("uses silver nisab when user has silver only", () => {
    const res = calculateZakat({
      ...baseInput,
      silverQuantity: 60,
      silverUnit: "tola",
      silverRatePerTola: 5000,
    });
    expect(res.nisabUsed).toBe("silver");
    expect(res.nisabThreshold).toBe(262500);
    expect(res.silverValue).toBe(300000);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(7500);
  });

  // Test 18: Explanation text indicates silver nisab rationale
  it("includes clear explanation when silver nisab is applied", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 500000,
      silverRatePerTola: 5500,
    });
    expect(res.nisabExplanation).toContain("Silver Nisab (52.5 tola");
  });

  // Test 19: Explanation text indicates gold nisab rationale
  it("includes clear explanation when gold nisab is applied", () => {
    const res = calculateZakat({
      ...baseInput,
      goldQuantity: 10,
      goldRatePerTola: 400000,
    });
    expect(res.nisabExplanation).toContain("Gold Nisab (7.5 tola");
  });

  // Test 20: Rounding of 2.5% calculation to integer paisa
  it("rounds zakat calculations to paisa precision", () => {
    const res = calculateZakat({
      ...baseInput,
      cashInHand: 333333,
      silverRatePerTola: 5000,
    });
    // 333,333 * 0.025 = 8333.325 -> 8333.33
    expect(res.zakatDue).toBe(8333.33);
  });
});
