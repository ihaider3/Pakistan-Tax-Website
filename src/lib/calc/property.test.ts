import { describe, it, expect } from "vitest";
import { calculatePropertyTax } from "./property";

describe("Property Transfer Tax Calculator (236C & 236K - TY2027)", () => {
  // Test 1: Buy 10,000,000 filer -> 125,000
  it("computes Buy 10,000,000 filer -> 125,000 (1.25%)", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    expect(res.ratePercentage).toBe("1.25%");
    expect(res.taxAmount).toBe(125000);
    expect(res.totalForBuyer).toBe(10125000);
  });

  // Test 2: Sell 10,000,000 filer -> 275,000
  it("computes Sell 10,000,000 filer -> 275,000 (2.75%)", () => {
    const res = calculatePropertyTax(10000000, "sell", "filer");
    expect(res.ratePercentage).toBe("2.75%");
    expect(res.taxAmount).toBe(275000);
    expect(res.netForSeller).toBe(9725000);
  });

  // Test 3: Buy 10,000,000 non-filer -> 1,050,000
  it("computes Buy 10,000,000 non-filer -> 1,050,000 (10.5%)", () => {
    const res = calculatePropertyTax(10000000, "buy", "non-filer");
    expect(res.ratePercentage).toBe("10.5%");
    expect(res.taxAmount).toBe(1050000);
    expect(res.totalForBuyer).toBe(11050000);
  });

  // Test 4: Sell 10,000,000 non-filer -> 1,150,000
  it("computes Sell 10,000,000 non-filer -> 1,150,000 (11.5%)", () => {
    const res = calculatePropertyTax(10000000, "sell", "non-filer");
    expect(res.ratePercentage).toBe("11.5%");
    expect(res.taxAmount).toBe(1150000);
    expect(res.netForSeller).toBe(8850000);
  });

  // Test 5: Buy 60,000,000 non-filer -> 8,700,000
  it("computes Buy 60,000,000 non-filer -> 8,700,000 (14.5%)", () => {
    const res = calculatePropertyTax(60000000, "buy", "non-filer");
    expect(res.ratePercentage).toBe("14.5%");
    expect(res.taxAmount).toBe(8700000);
    expect(res.totalForBuyer).toBe(68700000);
  });

  // Test 6: Buy 120,000,000 non-filer -> 22,200,000
  it("computes Buy 120,000,000 non-filer -> 22,200,000 (18.5%)", () => {
    const res = calculatePropertyTax(120000000, "buy", "non-filer");
    expect(res.ratePercentage).toBe("18.5%");
    expect(res.taxAmount).toBe(22200000);
    expect(res.totalForBuyer).toBe(142200000);
  });

  // Test 7: Boundary exactly 50,000,000 non-filer buyer
  it("boundary: exactly Rs 50,000,000 non-filer buyer uses 10.5% band", () => {
    const res = calculatePropertyTax(50000000, "buy", "non-filer");
    expect(res.ratePercentage).toBe("10.5%");
    expect(res.taxAmount).toBe(5250000); // 50M * 0.105
  });

  // Test 8: Boundary 50,000,001 non-filer buyer
  it("boundary: Rs 50,000,001 non-filer buyer transitions to 14.5% band", () => {
    const res = calculatePropertyTax(50000001, "buy", "non-filer");
    expect(res.ratePercentage).toBe("14.5%");
    expect(res.taxAmount).toBe(7250000.15); // 50,000,001 * 0.145
  });

  // Test 9: Boundary exactly 100,000,000 non-filer buyer
  it("boundary: exactly Rs 100,000,000 non-filer buyer uses 14.5% band", () => {
    const res = calculatePropertyTax(100000000, "buy", "non-filer");
    expect(res.ratePercentage).toBe("14.5%");
    expect(res.taxAmount).toBe(14500000); // 100M * 0.145
  });

  // Test 10: Boundary 100,000,001 non-filer buyer
  it("boundary: Rs 100,000,001 non-filer buyer transitions to 18.5% band", () => {
    const res = calculatePropertyTax(100000001, "buy", "non-filer");
    expect(res.ratePercentage).toBe("18.5%");
    expect(res.taxAmount).toBe(18500000.19); // 100,000,001 * 0.185
  });

  // Test 11: Comparison savings on 10,000,000 buy
  it("calculates filer savings comparison accurately on Buy", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    // Non-filer pays 1,050,000; Filer pays 125,000; Saving = 925,000
    expect(res.savingsVsNonFiler).toBe(925000);
    expect(res.comparisonText).toContain("save Rs 925,000");
  });

  // Test 12: Comparison savings on 10,000,000 sell
  it("calculates filer savings comparison accurately on Sell", () => {
    const res = calculatePropertyTax(10000000, "sell", "filer");
    // Non-filer pays 1,150,000; Filer pays 275,000; Saving = 875,000
    expect(res.savingsVsNonFiler).toBe(875000);
    expect(res.comparisonText).toContain("save Rs 875,000");
  });

  // Test 13: Non-filer view shows potential savings
  it("presents potential savings to non-filer user", () => {
    const res = calculatePropertyTax(10000000, "buy", "non-filer");
    expect(res.comparisonText).toContain("saving Rs 925,000");
  });

  // Test 14: Buy 5,000,000 filer
  it("computes Buy 5,000,000 filer -> 62,500", () => {
    const res = calculatePropertyTax(5000000, "buy", "filer");
    expect(res.taxAmount).toBe(62500);
  });

  // Test 15: Sell 5,000,000 filer
  it("computes Sell 5,000,000 filer -> 137,500", () => {
    const res = calculatePropertyTax(5000000, "sell", "filer");
    expect(res.taxAmount).toBe(137500);
  });

  // Test 16: Buy 50,000,000 filer
  it("computes Buy 50,000,000 filer -> 625,000", () => {
    const res = calculatePropertyTax(50000000, "buy", "filer");
    expect(res.taxAmount).toBe(625000);
  });

  // Test 17: Sell 50,000,000 non-filer
  it("computes Sell 50,000,000 non-filer -> 5,750,000 (11.5%)", () => {
    const res = calculatePropertyTax(50000000, "sell", "non-filer");
    expect(res.taxAmount).toBe(5750000);
  });

  // Test 18: Sell 100,000,000 filer
  it("computes Sell 100,000,000 filer -> 2,750,000 (2.75%)", () => {
    const res = calculatePropertyTax(100000000, "sell", "filer");
    expect(res.taxAmount).toBe(2750000);
  });

  // Test 19: Section codes assigned correctly
  it("assigns 236K to buy and 236C to sell", () => {
    expect(calculatePropertyTax(1000000, "buy", "filer").sectionCode).toBe("236K");
    expect(calculatePropertyTax(1000000, "sell", "filer").sectionCode).toBe("236C");
  });

  // Test 20: Net received for seller calculation
  it("deducts advance tax from property value for seller net proceed", () => {
    const res = calculatePropertyTax(20000000, "sell", "filer");
    // 20M * 2.75% = 550,000. Net = 19,450,000
    expect(res.taxAmount).toBe(550000);
    expect(res.netForSeller).toBe(19450000);
  });
});

