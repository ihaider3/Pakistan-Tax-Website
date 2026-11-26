import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculatorPages } from "@/content/pages";
import { calculateSalaryTax } from "./salary";

describe("Prompt 68 — Salary Tax Page SEO with Trending Keywords", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/salary-tax-calculator/layout.tsx"),
    "utf-8"
  );

  it("Tests 1 & 2: Keeps exact title unchanged and updates Salary meta description", () => {
    expect(layoutContent).toContain('title: "Salary Tax Calculator Pakistan 2026-27 | CalculationHub"');
    expect(layoutContent).toContain(
      "Calculate Pakistan salary tax 2026-27 with official FBR slabs — monthly tax deduction, annual tax & take-home pay, with full slab breakdown."
    );
    expect(calculatorPages.salary.title).toBe(
      "Salary Tax Calculator Pakistan 2026-27 | CalculationHub"
    );
    expect(calculatorPages.salary.metaDescription).toBe(
      "Calculate Pakistan salary tax 2026-27 with official FBR slabs — monthly tax deduction, annual tax & take-home pay, with full slab breakdown."
    );
  });

  it("Tests 4 & 5: Preserves all 6 old FAQs and adds the exact 2 new FAQs", () => {
    const qs = calculatorPages.salary.faqs.map((f) => f.question);
    expect(qs).toHaveLength(8);
    expect(qs).toContain("50,000 salary par tax hai?");
    expect(qs).toContain("Tax year 2026-27 kab se shuru hua?");
    expect(qs).toContain("Surcharge khatam hua?");
    expect(qs).toContain("Take-home kaise nikalein?");
    expect(qs).toContain("Kia freelance ya business income is calculator mein shamil hai?");
    expect(qs).toContain("Is salary tax the same as income tax in Pakistan?");

    const faq1 = calculatorPages.salary.faqs.find(
      (f) => f.question === "How much tax is deducted from my salary every month in Pakistan?"
    );
    expect(faq1?.answer).toContain("Rs 6,000 per month");
    expect(faq1?.answer).toContain("Rs 500 per month");

    const faq2 = calculatorPages.salary.faqs.find(
      (f) => f.question === "How is salary tax calculated for 2026-27?"
    );
    expect(faq2?.answer).toContain("Rs 13,000 per month");
  });

  it("Tests 7 & 8: Salary trap regressions match TY2027 formulas", () => {
    expect(calculateSalaryTax(123456, "monthly", "2026-27").monthlyTax).toBe(3080.16);
    expect(calculateSalaryTax(175000, "monthly", "2026-27").monthlyTax).toBe(8750);
  });
});
