import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculateGst } from "./gst";
import { calculatePropertyTax } from "./property";

describe("Prompt 67 — Homepage SEO with Trending Keywords & Regression Suite", () => {
  const pagePath = path.join(process.cwd(), "src/app/page.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  it("Tests 1 & 2: Exact homepage title and meta description updated", () => {
    expect(pageContent).toContain(
      "CalculationHub | Pakistan Tax Calculator 2026-27 — Salary Tax, Zakat, Property & GST"
    );
    expect(pageContent).toContain(
      "Free Pakistan tax calculator 2026-27 — salary tax, income tax, Zakat, property tax & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private."
    );
  });

  it("Tests 3, 4 & 5: Preserves H1 & 4 old FAQs, adds exactly 3 new FAQs, avoids forbidden topics on homepage", () => {
    expect(pageContent).toContain("Free Pakistan Tax, Zakat");
    expect(pageContent).toContain("Is salary up to Rs 50,000 exempt from tax?");
    expect(pageContent).toContain("Should I use Gold or Silver Nisab?");
    expect(pageContent).toContain("How much does a Filer save on property?");
    expect(pageContent).toContain("Is CalculationHub an income tax calculator for Pakistan?");

    expect(pageContent).toContain("What is the salary tax on Rs 150,000 per month in Pakistan?");
    expect(pageContent).toContain("Rs 6,000 per month (Rs 72,000 per year)");
    expect(pageContent).toContain("What is the FBR tax calculator, and how is CalculationHub different?");
    expect(pageContent).toContain("Which tax calculator should I use for 2026-27?");

    expect(pageContent.toLowerCase()).not.toContain("zakat calculator on gold");
    expect(pageContent.toLowerCase()).not.toContain("24k gold rate");
    expect(pageContent.toLowerCase()).not.toContain("pta tax");
  });

  it("Tests 7, 8, 9 & 10: Trap regression math matches official formulas", () => {
    const sal = calculateSalaryTax(123456, "monthly", "2026-27");
    expect(sal.monthlyTax).toBe(3080.16);

    const zak = calculateZakat({
      cashInHand: 777777,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 369756.85,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4276.3,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(zak.zakatDue).toBe(19444.43);

    const gst = calculateGst(100000, "remove", 18);
    expect(gst.baseAmount).toBe(84745.76);
    expect(gst.gstAmount).toBe(15254.24);

    const prop = calculatePropertyTax(10000000, "buy", "filer");
    expect(prop.taxAmount).toBe(125000);
  });
});
