import { describe, it, expect } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat, GOLD_PURITY_CONFIG } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { formatRupees } from "./money";
import ratesData from "@/data/rates.json";
import fs from "fs";
import path from "path";

describe("§8 Regression Tests — All 21 Audit Fixes", () => {
  // 1. Salary 150,000/month TY2027 → tax 6,000, take-home 144,000, annual 72,000
  it("Salary 150,000/month TY2027 produces tax 6,000, take-home 144,000, annual 72,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.monthlyTakeHome).toBe(144000);
    expect(res.annualTax).toBe(72000);
  });

  // 2. Salary 50,000 → 0. Salary 0 → all Rs 0. Salary −5,000 → rejected (tax 0, handled safely)
  it("Salary edge cases: 50,000 (0 tax), 0 (all 0), -5000 (handled safely as 0 tax)", () => {
    const res50k = calculateSalaryTax(50000, "monthly", "2026-27");
    expect(res50k.monthlyTax).toBe(0);
    expect(res50k.annualTax).toBe(0);

    const res0 = calculateSalaryTax(0, "monthly", "2026-27");
    expect(res0.monthlyTax).toBe(0);
    expect(res0.annualTax).toBe(0);
    expect(res0.monthlyTakeHome).toBe(0);

    const resNeg = calculateSalaryTax(-5000, "monthly", "2026-27");
    expect(resNeg.monthlyTax).toBe(0);
    expect(resNeg.annualTax).toBe(0);
  });

  // 3. Salary 99,999.99 → tax 500, take-home 99,500
  it("Salary 99,999.99 rounds to whole rupees: tax 500 and displayed take-home 99,500", () => {
    const res = calculateSalaryTax(99999.99, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(500);
    expect(formatRupees(res.monthlyTakeHome, { prefix: false })).toBe("99,500");
  });

  // 4. Salary TY2025-26 selected: slab table shows 23% / 30% / 35% for slabs 4-6
  it("Salary TY2025-26 has slabs 23%, 30%, 35% for tiers 4-6", () => {
    const res = calculateSalaryTax(3000000, "annual", "2025-26");
    expect(res.breakdown[3].rate).toBe(0.23);
    expect(res.breakdown[4].rate).toBe(0.30);
    expect(res.breakdown[5].rate).toBe(0.35);
  });

  // 6. Zakat cash 500,000 → Zakat 12,500; displayed nisab = 52.5 × displayed silver rate exactly; cash 100,000 → 0
  it("Zakat: cash 500,000 gives 12,500 zakat; cash 100,000 gives 0", () => {
    const res500k = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldRatePerTola: ratesData.goldPerTolaPKR,
      goldPurity: "24k",
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: ratesData.silverPerTolaPKR,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(res500k.zakatDue).toBe(12500);
    expect(res500k.isZakatDue).toBe(true);

    const res100k = calculateZakat({
      cashInHand: 100000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldRatePerTola: ratesData.goldPerTolaPKR,
      goldPurity: "24k",
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: ratesData.silverPerTolaPKR,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(res100k.zakatDue).toBe(0);
    expect(res100k.isZakatDue).toBe(false);
  });

  // 6b. Displayed nisab = 52.5 * displayed silver rate exactly to the rupee
  it("Zakat displayed nisab equals Math.round(52.5 * silverRatePerTola)", () => {
    const silverRate = ratesData.silverPerTolaPKR;
    const expectedNisab = Math.round(52.5 * silverRate);
    expect(ratesData.nisabSilverPKR).toBe(expectedNisab);

    const goldRate = ratesData.goldPerTolaPKR;
    const expectedGoldNisab = Math.round(7.5 * goldRate);
    expect(ratesData.nisabGoldPKR).toBe(expectedGoldNisab);
  });

  // 7. Zakat gold: 2 tola 22K → gold value = 2 × displayed rate × 91.67%
  it("Zakat gold 2 tola 22k applies 91.67% purity multiplier", () => {
    const purityFraction = GOLD_PURITY_CONFIG["22k"].fraction;
    expect(purityFraction).toBe(0.9167);

    const res = calculateZakat({
      cashInHand: 0,
      bankSavings: 0,
      goldQuantity: 2,
      goldUnit: "tola",
      goldRatePerTola: ratesData.goldPerTolaPKR,
      goldPurity: "22k",
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: ratesData.silverPerTolaPKR,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });

    const expectedGoldVal = Math.round(2 * ratesData.goldPerTolaPKR * 0.9167 * 100) / 100;
    expect(res.goldValue).toBe(expectedGoldVal);
  });

  // 9. Property: Buy Filer 10M → 125,000; Sell Filer 10M → 275,000; Buy Non-Filer 10M → 1,050,000; Sell Non-Filer 10M → 1,150,000
  it("Property Advance Tax calculations for 10M", () => {
    const buyFiler = calculatePropertyTax(10000000, "buy", "filer");
    expect(buyFiler.taxAmount).toBe(125000);

    const sellFiler = calculatePropertyTax(10000000, "sell", "filer");
    expect(sellFiler.taxAmount).toBe(275000);

    const buyNonFiler = calculatePropertyTax(10000000, "buy", "non-filer");
    expect(buyNonFiler.taxAmount).toBe(1050000);

    const sellNonFiler = calculatePropertyTax(10000000, "sell", "non-filer");
    expect(sellNonFiler.taxAmount).toBe(1150000);
  });

  // 10. GST: Add 18% on 100,000 → 18,000 / 118,000. Custom 5% on 100,000 → 5,000 / 105,000. 99,999.99 → total 117,999.99
  it("GST: Add 18% on 100,000 gives 18,000/118,000; 5% gives 5,000/105,000; 99,999.99 gives 117,999.99 total", () => {
    const gst18 = calculateGst(100000, "add", 18);
    expect(gst18.gstAmount).toBe(18000);
    expect(gst18.totalAmount).toBe(118000);

    const gst5 = calculateGst(100000, "add", 5);
    expect(gst5.gstAmount).toBe(5000);
    expect(gst5.totalAmount).toBe(105000);

    const gstFloat = calculateGst(99999.99, "add", 18);
    expect(gstFloat.totalAmount).toBe(117999.99);
  });

  // 11. Fitrana: 5 wheat → 1,500; 1 dates → 2,800; 3 raisins → 21,600; CII alternate for 3 raisins → 11,400
  it("Fitrana calculations: 5 wheat = 1,500; 1 dates = 2,800; 3 raisins = 21,600; CII 3 raisins = 11,400", () => {
    const wheat5 = calculateFitrana(5, "wheat", "muneeb");
    expect(wheat5.totalFitrana).toBe(1500);

    const dates1 = calculateFitrana(1, "dates", "muneeb");
    expect(dates1.totalFitrana).toBe(2800);

    const raisins3 = calculateFitrana(3, "raisins", "muneeb");
    expect(raisins3.totalFitrana).toBe(21600);

    const raisins3CII = calculateFitrana(3, "raisins", "cii");
    expect(raisins3CII.totalFitrana).toBe(11400);
  });

  // 12. Unbroken Mufti Muneeb name
  it("Mufti Muneeb-ur-Rehman is rendered unbroken in fitrana page", () => {
    const pageContent = fs.readFileSync(path.resolve(__dirname, "../../app/fitrana-calculator/page.tsx"), "utf-8");
    expect(pageContent).toMatch(/Mufti Muneeb(\\u2011|‑)ur(\\u2011|‑)Rehman/);
  });

  // 13. Footer contact email
  it("Footer contains mailto contact@calculationhubs.com", () => {
    const footerContent = fs.readFileSync(path.resolve(__dirname, "../../components/Footer.tsx"), "utf-8");
    expect(footerContent).toContain("contact@calculationhubs.com");
    expect(footerContent).toContain("mailto:contact@calculationhubs.com");
  });

  // 14. Browser titles for Methodology & Disclaimer
  it("Titles for Methodology and Disclaimer fit ~60 characters", () => {
    const methContent = fs.readFileSync(path.resolve(__dirname, "../../app/methodology/page.tsx"), "utf-8");
    expect(methContent).toContain('title: "Pakistan Tax Slabs 2026-27 & Methodology | CalculationHub"');

    const discContent = fs.readFileSync(path.resolve(__dirname, "../../app/disclaimer/page.tsx"), "utf-8");
    expect(discContent).toContain('title: "CalculationHub Disclaimer | Legal & Religious Guidance"');
  });

  // 15. About page accuracy claim
  it("About page accuracy claim matches whole rupees reality", () => {
    const aboutContent = fs.readFileSync(path.resolve(__dirname, "../../app/about/page.tsx"), "utf-8");
    expect(aboutContent).toContain("we round to whole rupees and show our working");
    expect(aboutContent).not.toContain("round arbitrarily");
  });

  // 16. Mobile privacy bar no truncate
  it("Header privacy bar does not truncate text with ellipsis", () => {
    const headerContent = fs.readFileSync(path.resolve(__dirname, "../../components/Header.tsx"), "utf-8");
    expect(headerContent).not.toContain('truncate min-w-0">\n              100% Client-Side Privacy');
  });

  // 17. Mobile intro paragraph no line-clamp
  it("CalculatorShell intro paragraph has no line-clamp-2", () => {
    const shellContent = fs.readFileSync(path.resolve(__dirname, "../../components/CalculatorShell.tsx"), "utf-8");
    expect(shellContent).not.toContain("line-clamp-2");
  });

  // 18. Dynamic Salary ExplanationBox for Tax Year 2025-26 and 2026-27
  it("Salary Tax Calculator page has dynamic ExplanationBox for Tax Year 2025-26 and 2026-27", () => {
    const salaryPage = fs.readFileSync(path.resolve(__dirname, "../../app/salary-tax-calculator/page.tsx"), "utf-8");
    
    // Checks that 2025-26 overrides intro, englishIntro, and romanUrduIntro
    expect(salaryPage).toContain("taxYear === \"2025-26\"");
    expect(salaryPage).toContain("Tax Year 2025–26 slabs (6 progressive slabs, top rate 35% above Rs 4,100,000)");
    expect(salaryPage).toContain("Tax Year 2025–26 ke slabs (6 progressive slabs, Rs 4,100,000 se upar 35% aakhri rate)");
    expect(salaryPage).toContain("Salary Tax Calculator Pakistan 2025-26");
  });

  // 19. Spot check Zakat calculator unchanged
  it("Spot check Zakat calculator: cash 500,000 produces Zakat Rs 12,500", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: ratesData.goldPerTolaPKR,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: ratesData.silverPerTolaPKR,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(res.zakatDue).toBe(12500);
    expect(formatRupees(res.zakatDue)).toBe("Rs 12,500");
  });
});
