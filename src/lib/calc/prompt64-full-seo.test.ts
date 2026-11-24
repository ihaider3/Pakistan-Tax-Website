import { describe, it, expect } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculateGst } from "./gst";
import { calculatePropertyTax } from "./property";
import { calculatorPages } from "@/content/pages";

describe("Prompt 64 — FULL On-Page SEO: trending keywords for every page", () => {
  it("Regression Test 2: Salary, Rs 150,000/month -> Tax Rs 6,000/month (annual Rs 72,000)", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.annualTax).toBe(72000);
  });

  it("Regression Test 3: Zakat, cash Rs 500,000 -> Zakat due Rs 12,500", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 375831,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4392,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(res.zakatDue).toBe(12500);
  });

  it("Regression Test 4: GST, Rs 100,000 inclusive (Remove mode) -> Base Rs 84,745.76, GST Rs 15,254.24", () => {
    const res = calculateGst(100000, "remove", 18);
    expect(res.baseAmount).toBe(84745.76);
    expect(res.gstAmount).toBe(15254.24);
    expect(res.totalAmount).toBe(100000);
  });

  it("Regression Test 5: Property, filer buyer Rs 10,000,000 -> Tax Rs 125,000", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    expect(res.taxAmount).toBe(125000);
  });

  it("Regression Test 6: New FAQs exist in content definitions", () => {
    // Salary FAQ
    const salaryFaq = calculatorPages.salary.faqs.find((f) =>
      f.question.includes("Is salary tax the same as income tax in Pakistan?")
    );
    expect(salaryFaq).toBeDefined();
    expect(salaryFaq?.answer).toContain("salary tax is income tax charged on salary income");
    expect(salaryFaq?.answer).toContain("section 149 of the Income Tax Ordinance 2001");
    expect(salaryFaq?.answer).toContain("TY2027 slabs");

    // GST Credit FAQ
    const gstFaq = calculatorPages.gst.faqs.find((f) =>
      f.question.includes("How is GST credit calculated in Pakistan?")
    );
    expect(gstFaq).toBeDefined();
    expect(gstFaq?.answer).toContain("input tax");
    expect(gstFaq?.answer).toContain("output tax");
    expect(gstFaq?.answer).toContain("Sales Tax Act 1990");
    expect(gstFaq?.answer).toContain("18% goods rate");
  });

  it("Regression Test 7: P58, P59, P60 FAQs remain unchanged", () => {
    // P59 Property Tax Filer FAQ
    const propFaq = calculatorPages.property.faqs.find((f) =>
      f.question.includes("How much property tax does a filer pay in Pakistan?")
    );
    expect(propFaq).toBeDefined();

    // P59 Existing Property FAQs preserved
    expect(calculatorPages.property.faqs.some((f) => f.question.includes("236C aur 236K mein farq?"))).toBe(true);
    expect(calculatorPages.property.faqs.some((f) => f.question.includes("Filer banne se kitni bachat?"))).toBe(true);
  });

  it("Regression Test 8 (TRAP TEST): Salary Rs 123,456/month -> Tax Rs 3,080.16/month (annual Rs 36,961.92)", () => {
    const res = calculateSalaryTax(123456, "monthly", "2026-27");
    expect(res.annualTax).toBe(36961.92);
    expect(res.monthlyTax).toBe(3080.16);
  });

  it("Regression Test 9 (TRAP TEST): Zakat cash Rs 777,777 -> Zakat due Rs 19,444.43", () => {
    const res = calculateZakat({
      cashInHand: 777777,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 375831,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4392,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(res.zakatDue).toBe(19444.43);
  });
});

