import { describe, it, expect } from "vitest";
import { calculateSalaryTax } from "./salary";
import { formatRupees } from "./money";

describe("Salary Tax Calculator TY2027 (Finance Act 2026)", () => {
  // Test 1: Rs 50,000 / month
  it("computes Rs 50,000/mo (Rs 600,000/yr) -> tax 0, take-home 50,000", () => {
    const res = calculateSalaryTax(50000, "monthly", "2026-27");
    expect(res.annualTax).toBe(0);
    expect(res.monthlyTax).toBe(0);
    expect(res.monthlyTakeHome).toBe(50000);
    expect(res.annualTakeHome).toBe(600000);
    expect(res.effectiveTaxRate).toBe(0);
  });

  // Test 2: Rs 75,000 / month
  it("computes Rs 75,000/mo -> annual tax 3,000, monthly 250, take-home 74,750", () => {
    const res = calculateSalaryTax(75000, "monthly", "2026-27");
    expect(res.annualTax).toBe(3000);
    expect(res.monthlyTax).toBe(250);
    expect(res.monthlyTakeHome).toBe(74750);
    expect(res.annualTakeHome).toBe(897000);
    expect(formatRupees(res.monthlyTax)).toBe("Rs 250");
  });

  // Test 3: Rs 100,000 / month
  it("computes Rs 100,000/mo -> annual tax 6,000, monthly 500, take-home 99,500", () => {
    const res = calculateSalaryTax(100000, "monthly", "2026-27");
    expect(res.annualTax).toBe(6000);
    expect(res.monthlyTax).toBe(500);
    expect(res.monthlyTakeHome).toBe(99500);
    expect(res.annualTakeHome).toBe(1194000);
  });

  // Test 4: Rs 150,000 / month
  it("computes Rs 150,000/mo -> annual tax 72,000, monthly 6,000, take-home 144,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.annualTax).toBe(72000);
    expect(res.monthlyTax).toBe(6000);
    expect(res.monthlyTakeHome).toBe(144000);
    expect(res.annualTakeHome).toBe(1728000);
    expect(res.effectiveTaxRate).toBe(4);
  });

  // Test 5: Rs 200,000 / month
  it("computes Rs 200,000/mo -> annual tax 156,000, monthly 13,000, take-home 187,000", () => {
    const res = calculateSalaryTax(200000, "monthly", "2026-27");
    expect(res.annualTax).toBe(156000);
    expect(res.monthlyTax).toBe(13000);
    expect(res.monthlyTakeHome).toBe(187000);
  });

  // Test 6: Rs 300,000 / month
  it("computes Rs 300,000/mo -> annual tax 416,000, monthly 34,667, take-home 265,333", () => {
    const res = calculateSalaryTax(300000, "monthly", "2026-27");
    expect(res.annualTax).toBe(416000);
    expect(formatRupees(res.monthlyTax)).toBe("Rs 34,667");
    expect(formatRupees(res.monthlyTakeHome)).toBe("Rs 265,333");
  });

  // Test 7: Rs 500,000 / month
  it("computes Rs 500,000/mo -> annual tax 1,104,000, monthly 92,000, take-home 408,000", () => {
    const res = calculateSalaryTax(500000, "monthly", "2026-27");
    expect(res.annualTax).toBe(1104000);
    expect(res.monthlyTax).toBe(92000);
    expect(res.monthlyTakeHome).toBe(408000);
  });

  // Test 8: Rs 1,000,000 / month
  it("computes Rs 1,000,000/mo -> annual tax 3,174,000, monthly 264,500, take-home 735,500", () => {
    const res = calculateSalaryTax(1000000, "monthly", "2026-27");
    expect(res.annualTax).toBe(3174000);
    expect(res.monthlyTax).toBe(264500);
    expect(res.monthlyTakeHome).toBe(735500);
  });

  // Test 9: Boundary exact 600,000 annual
  it("boundary: exactly Rs 600,000 annual -> tax 0", () => {
    const res = calculateSalaryTax(600000, "annual", "2026-27");
    expect(res.annualTax).toBe(0);
  });

  // Test 10: Boundary Rs 600,001 annual
  it("boundary: Rs 600,001 annual -> tax on Rs 1 at 1% = Rs 0.01, rounded display Rs 0", () => {
    const res = calculateSalaryTax(600001, "annual", "2026-27");
    expect(res.annualTax).toBe(0.01);
    expect(formatRupees(res.annualTax)).toBe("Rs 0");
    expect(formatRupees(res.annualTax, { showPaisa: true })).toBe("Rs 0.01");
  });

  // Test 11: Boundary Rs 1,200,000 annual
  it("boundary: exactly Rs 1,200,000 annual -> tax 6,000", () => {
    const res = calculateSalaryTax(1200000, "annual", "2026-27");
    expect(res.annualTax).toBe(6000);
  });

  // Test 12: Boundary Rs 1,200,001 annual
  it("boundary: Rs 1,200,001 annual -> tax 6,000.11", () => {
    const res = calculateSalaryTax(1200001, "annual", "2026-27");
    expect(res.annualTax).toBe(6000.11);
  });

  // Test 13: Boundary Rs 2,200,000 annual
  it("boundary: exactly Rs 2,200,000 annual -> tax 116,000", () => {
    const res = calculateSalaryTax(2200000, "annual", "2026-27");
    expect(res.annualTax).toBe(116000);
  });

  // Test 14: Boundary Rs 3,200,000 annual
  it("boundary: exactly Rs 3,200,000 annual -> tax 316,000", () => {
    const res = calculateSalaryTax(3200000, "annual", "2026-27");
    expect(res.annualTax).toBe(316000);
  });

  // Test 15: Boundary Rs 4,100,000 annual
  it("boundary: exactly Rs 4,100,000 annual -> tax 541,000", () => {
    const res = calculateSalaryTax(4100000, "annual", "2026-27");
    expect(res.annualTax).toBe(541000);
  });

  // Test 16: Boundary Rs 5,600,000 annual
  it("boundary: exactly Rs 5,600,000 annual -> tax 976,000", () => {
    const res = calculateSalaryTax(5600000, "annual", "2026-27");
    expect(res.annualTax).toBe(976000);
  });

  // Test 17: Boundary Rs 7,000,000 annual
  it("boundary: exactly Rs 7,000,000 annual -> tax 1,424,000", () => {
    const res = calculateSalaryTax(7000000, "annual", "2026-27");
    expect(res.annualTax).toBe(1424000);
  });

  // Test 18: Above Rs 7,000,000 annual (Rs 8,000,000)
  it("computes Rs 8,000,000 annual -> 1,424,000 + (1,000,000 * 0.35) = 1,774,000", () => {
    const res = calculateSalaryTax(8000000, "annual", "2026-27");
    expect(res.annualTax).toBe(1774000);
  });

  // Test 19: High wealth warning (> 100,000,000)
  it("shows high income professional warning for salaries over Rs 100M", () => {
    const res = calculateSalaryTax(120000000, "annual", "2026-27");
    expect(res.warning).toBeDefined();
    expect(res.warning).toContain("surcharge / other rules may apply");
  });

  // Test 20: Tax Year 2025-26 (TY2026) check
  it("computes Tax Year 2025-26 correctly with 23% and 30% slabs", () => {
    // In TY2026: 3,200,000 annual has 116,000 + 1,000,000 * 23% = 346,000
    const res = calculateSalaryTax(3200000, "annual", "2025-26");
    expect(res.annualTax).toBe(346000);

    // In TY2026: 4,100,000 annual has 346,000 + 900,000 * 30% = 616,000
    const res2 = calculateSalaryTax(4100000, "annual", "2025-26");
    expect(res2.annualTax).toBe(616000);
  });

  // Test 21: Tax Year 2025-26 surcharge note for > 10M
  it("attaches surcharge verification note for TY2026 when income > 10M", () => {
    const res = calculateSalaryTax(12000000, "annual", "2025-26");
    expect(res.surchargeNote).toBeDefined();
    expect(res.surchargeNote).toContain("Surcharge: check FBR rate card");
  });

  // Test 22: Breakdown array length and contents
  it("generates full 8-tier breakdown table for TY2027", () => {
    const res = calculateSalaryTax(1800000, "annual", "2026-27");
    expect(res.breakdown.length).toBe(8);
    expect(res.breakdown[0].taxableAmountInSlab).toBe(600000);
    expect(res.breakdown[1].taxableAmountInSlab).toBe(600000);
    expect(res.breakdown[2].taxableAmountInSlab).toBe(600000);
    expect(res.breakdown[3].taxableAmountInSlab).toBe(0);
  });
});
