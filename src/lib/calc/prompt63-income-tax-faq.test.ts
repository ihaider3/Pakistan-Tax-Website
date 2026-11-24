import { describe, it, expect } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatorPages } from "@/content/pages";

describe("Prompt 63 — On-page SEO: add 'income tax calculator Pakistan' naturally", () => {
  it("Regression Test 1: Salary page, Rs 150,000/month -> Tax Rs 6,000/month (annual Rs 72,000)", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.annualTax).toBe(72000);
  });

  it("Regression Test 2: Zakat page, cash Rs 500,000 -> Zakat due Rs 12,500", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 366778,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4257,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(res.zakatDue).toBe(12500);
  });

  it("Regression Test 3: Salary FAQ 'Is salary tax the same as income tax in Pakistan?' exists", () => {
    const salaryFaq = calculatorPages.salary.faqs.find((f) =>
      f.question.includes("Is salary tax the same as income tax in Pakistan?")
    );
    expect(salaryFaq).toBeDefined();
    expect(salaryFaq?.question).toBe("Is salary tax the same as income tax in Pakistan?");
    expect(salaryFaq?.answer).toContain("salary tax is income tax charged on salary income");
    expect(salaryFaq?.answer).toContain("section 149 of the Income Tax Ordinance 2001");
    expect(salaryFaq?.answer).toContain("TY2027 slabs");
  });

  it("Regression Test 4: Titles unchanged", () => {
    expect(calculatorPages.salary.title).toBe(
      "Salary Tax Calculator Pakistan 2026-27 | CalculationHub"
    );
  });

  it("Regression Test 5 (TRAP TEST): Salary Rs 123,456/month -> Tax Rs 3,080.16/month (annual Rs 36,961.92)", () => {
    const res = calculateSalaryTax(123456, "monthly", "2026-27");
    expect(res.annualTax).toBe(36961.92);
    expect(res.monthlyTax).toBe(3080.16);
  });

  it("Regression Test 6 (TRAP TEST): Zakat cash Rs 777,777 -> Zakat due Rs 19,444.43", () => {
    const res = calculateZakat({
      cashInHand: 777777,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 366778,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4257,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(res.zakatDue).toBe(19444.43);
  });

  it("Regression Test 7: P58, P59, P60 FAQs remain intact", () => {
    // P59 Property Tax Filer FAQ
    const propertyFaq = calculatorPages.property.faqs.find((f) =>
      f.question.includes("How much property tax does a filer pay in Pakistan?")
    );
    expect(propertyFaq).toBeDefined();
    expect(propertyFaq?.answer).toContain("1.25% under Section 236K");
    expect(propertyFaq?.answer).toContain("2.75% under Section 236C");

    // GST Input Tax Credit FAQ
    const gstFaq = calculatorPages.gst.faqs.find((f) =>
      f.question.includes("Input tax credit kya hota hai?")
    );
    expect(gstFaq).toBeDefined();
  });
});

