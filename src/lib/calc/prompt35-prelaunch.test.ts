import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import nextConfig from "../../../next.config";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { calculateUshr } from "./ushr";

describe("Prompt 35 — Pre-Launch Fixes & Regression Suite", () => {
  it("Test Fix 2: next.config.ts defines permanent (308) redirects for short URLs", async () => {
    if (typeof nextConfig.redirects !== "function") {
      throw new Error("nextConfig.redirects is not a function");
    }
    const redirects = await nextConfig.redirects();

    const expected = [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/zakat", destination: "/zakat-calculator", permanent: true },
      { source: "/salary", destination: "/salary-tax-calculator", permanent: true },
      { source: "/property", destination: "/property-tax-calculator", permanent: true },
      { source: "/gst", destination: "/gst-calculator", permanent: true },
      { source: "/fitrana", destination: "/fitrana-calculator", permanent: true },
      { source: "/ushr", destination: "/ushr-calculator", permanent: true },
    ];

    for (const exp of expected) {
      const match = redirects.find((r) => r.source === exp.source);
      expect(match).toBeDefined();
      expect(match?.destination).toBe(exp.destination);
      expect(match?.permanent).toBe(true);
    }
  });

  it("Test Fix 1 & Regression 2: Homepage has no stale rate figures (390,933.27 or 247,453)", () => {
    const homePath = path.join(process.cwd(), "src/app/page.tsx");
    const homeContent = fs.readFileSync(homePath, "utf-8");

    expect(homeContent.includes("390,933.27")).toBe(false);
    expect(homeContent.includes("390933")).toBe(false);
    expect(homeContent.includes("4,713.40")).toBe(false);
    expect(homeContent.includes("4713.40")).toBe(false);
    expect(homeContent.includes("247,453")).toBe(false);
    expect(homeContent.includes("247453")).toBe(false);
  });

  it("Test Fix 1: Zakat worked example in zakat-calculator uses live rates dynamically", () => {
    const zakatPagePath = path.join(process.cwd(), "src/app/zakat-calculator/page.tsx");
    const zakatPageContent = fs.readFileSync(zakatPagePath, "utf-8");

    // Dynamic Nisab and rate calculations are verified
    expect(zakatPageContent).toContain("const exampleNisabVal = Math.round(52.5 * silverRateNum);");
    expect(zakatPageContent).toContain("const exampleGoldVal = roundToPaisa(2 * goldRateNum);");
    expect(zakatPageContent).toContain("Silver Nisab Threshold (52.5 tola @ Rs ${silverRateNum.toFixed(2)}/tola)");
    expect(zakatPageContent).toContain("Gold: 2 tola @ market rate Rs ${goldRateNum.toFixed(2)}/tola");
  });

  it("Test 5: Zakat calculation regression — Cash Rs 500,000 -> Rs 12,500", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 400000,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 5000, // 52.5 * 5000 = Rs 262,500 nisab
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(res.netZakatableWealth).toBe(500000);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(12500);
  });

  it("Test 6: Salary calculation regression — Rs 150,000 monthly -> monthly tax Rs 6,000, take-home Rs 144,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.annualTax).toBe(72000);
    expect(res.monthlyTakeHome).toBe(144000);
  });

  it("Test 7: Ushr calculation regression — wheat 1,000 kg, Rs 130/kg, rain -> 100 kg, Rs 13,000", () => {
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
    expect(res.ushrCashValue).toBe(13000);
  });

  it("Test 8: Property calculation regression — Buy, Filer, Rs 10,000,000 -> Rs 125,000", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    expect(res.taxAmount).toBe(125000);
    expect(res.ratePercentage).toBe("1.25%");
  });

  it("Test 9: GST calculation regression — Rs 100,000, Add GST 18% -> tax Rs 18,000, total Rs 118,000", () => {
    const res = calculateGst(100000, "add", 18);
    expect(res.gstAmount).toBe(18000);
    expect(res.totalAmount).toBe(118000);
  });

  it("Test 10: Fitrana calculation regression — 5 persons, wheat -> Rs 1,500", () => {
    const res = calculateFitrana(5, "wheat", "muneeb");
    expect(res.totalFitrana).toBe(1500);
    expect(res.alternateSourceTotal).toBe(1500);
  });
});
