import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { calculateUshr } from "./ushr";

describe("Prompt 75 — Mobile Page Compaction without Deleting SEO Content", () => {
  it("Preserves all DOM content via CSS grid folding (never display:none or unmounted SEO answers)", () => {
    const howItWorks = fs.readFileSync(
      path.join(process.cwd(), "src/components/HomeHowItWorks.tsx"),
      "utf-8"
    );
    expect(howItWorks).toContain("grid-rows-[0fr] md:grid-rows-[1fr]");

    const homeFaq = fs.readFileSync(
      path.join(process.cwd(), "src/components/HomeFaqAccordion.tsx"),
      "utf-8"
    );
    expect(homeFaq).toContain("grid-rows-[0fr] md:grid-rows-[1fr]");

    const shell = fs.readFileSync(
      path.join(process.cwd(), "src/components/CalculatorShell.tsx"),
      "utf-8"
    );
    expect(shell).toContain("grid-rows-[0fr] md:grid-rows-[1fr]");
    expect(shell).toContain("<BackToCalculatorButton />");

    const faq = fs.readFileSync(
      path.join(process.cwd(), "src/components/Faq.tsx"),
      "utf-8"
    );
    expect(faq).toContain("window.innerWidth < 768");
    expect(faq).toContain("grid-rows-[0fr] md:grid-rows-[1fr]");
    expect(faq).not.toContain("{isOpen &&");

    const expBox = fs.readFileSync(
      path.join(process.cwd(), "src/components/ExplanationBox.tsx"),
      "utf-8"
    );
    expect(expBox).toContain("Read more");
    expect(expBox).toContain("Aur parhein");
    expect(expBox).toContain("line-clamp-2 md:line-clamp-none");

    const backBtn = fs.readFileSync(
      path.join(process.cwd(), "src/components/BackToCalculatorButton.tsx"),
      "utf-8"
    );
    expect(backBtn).toContain("md:hidden");
    expect(backBtn).toContain("Calculator par wapas");
  });

  it("All 7 calculator formula regressions remain unchanged", () => {
    const sal = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(sal.monthlyTax).toBe(6000);
    expect(sal.monthlyTakeHome).toBe(144000);

    expect(
      calculateZakat({
        cashInHand: 500000,
        bankSavings: 0,
        goldUnit: "tola",
        goldQuantity: 0,
        goldRatePerTola: 400000,
        silverUnit: "tola",
        silverQuantity: 0,
        silverRatePerTola: 4277,
        businessStock: 0,
        investments: 0,
        debtsToDeduct: 0,
      }).zakatDue
    ).toBe(12500);

    expect(
      calculateZakat({
        cashInHand: 777777,
        bankSavings: 0,
        goldUnit: "tola",
        goldQuantity: 0,
        goldRatePerTola: 400000,
        silverUnit: "tola",
        silverQuantity: 0,
        silverRatePerTola: 4277,
        businessStock: 0,
        investments: 0,
        debtsToDeduct: 0,
      }).zakatDue
    ).toBe(19444.43);

    expect(calculatePropertyTax(10000000, "buy", "filer").taxAmount).toBe(125000);

    const gst = calculateGst(100000, "add", 18);
    expect(gst.gstAmount).toBe(18000);
    expect(gst.totalAmount).toBe(118000);

    expect(calculateFitrana(5, "wheat", "muneeb").totalFitrana).toBe(1500);

    expect(
      calculateUshr({
        crop: "wheat",
        quantity: 2000,
        unit: "kg",
        pricePerUnit: 130,
        irrigation: "tubewell",
      }).ushrKind
    ).toBe(100);
  });
});
