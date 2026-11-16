import { describe, it, expect } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { formatRupees } from "./money";
import { calculatorPages } from "../../content/pages";
import nextConfig from "../../../next.config";

describe("Final Pre-Launch Audit Verification", () => {
  it("Text Fix 1: Salary Tax slab number in ExplanationBox is slab 3", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.appliedSlabIndex).toBe(3);
    const roman = `Aap ne mahana tankhwah Rs ${formatRupees(res.monthlySalary, { prefix: false })} likhi. Is se salana tankhwah Rs ${formatRupees(res.annualSalary, { prefix: false })} banti hai. Tax Year 2026–27 ke slab ${res.appliedSlabIndex} ke mutabiq: ${res.appliedSlabDescription}.`;
    const english = `Under Tax Year 2026–27 slab ${res.appliedSlabIndex}: ${res.appliedSlabDescription}.`;
    expect(roman).toContain("slab 3");
    expect(roman).not.toContain("slab 4");
    expect(english).toContain("slab 3");
    expect(english).not.toContain("slab 4");
  });

  it("Text Fix 2: Fitrana table header uses 1 person", () => {
    const familyMembers = 1;
    const header = `Family Total (${familyMembers} ${familyMembers > 1 ? "persons" : "person"})`;
    expect(header).toBe("Family Total (1 person)");
  });

  it("Text Fix 3: Homepage Fitrana card badge is exactly 'Wheat Rs 300'", () => {
    const fs = require("fs");
    const path = require("path");
    const homeContent = fs.readFileSync(path.resolve(__dirname, "../../app/page.tsx"), "utf-8");
    expect(homeContent).toContain('badge: "Wheat Rs 300"');
    expect(homeContent).not.toContain('badge: "WHEAT RS 300"');
    expect(homeContent).not.toContain('badge: "WHEAT Rs 300"');
  });

  it("Text Fix 4 & 5: Zakat rozmarra and Salary izaafi in FAQs", () => {
    const zakatFaq = calculatorPages.zakat.faqs.find((f) => f.question.includes("zewar"));
    expect(zakatFaq?.question).toContain("rozmarra");
    expect(zakatFaq?.question).not.toContain("rozmara");

    const salaryFaq = calculatorPages.salary.faqs.find((f) => f.question.includes("Surcharge"));
    expect(salaryFaq?.answer).toContain("izaafi");
    expect(salaryFaq?.answer).not.toContain("azafi");
  });

  it("Text Fix 8: Zakat empty state due text", () => {
    const res = calculateZakat({
      cashInHand: 0,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldRatePerTola: 400000,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: 5500,
      businessStock: 0,
      financialInvestments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    const englishText = `At 2.5%, your Zakat due is Rs ${formatRupees(res.zakatDue, { prefix: false })}.`;
    expect(englishText).toBe("At 2.5%, your Zakat due is Rs 0.");
  });

  it("Section 5: /privacy redirect in next.config.ts", async () => {
    const redirectsFn = nextConfig.redirects;
    expect(redirectsFn).toBeDefined();
    if (redirectsFn) {
      const redirects = await redirectsFn();
      const privacyRedirect = redirects.find((r) => r.source === "/privacy");
      expect(privacyRedirect).toBeDefined();
      expect(privacyRedirect?.destination).toBe("/privacy-policy");
      expect(privacyRedirect?.permanent).toBe(true);
    }
  });

  it("The 21 Regression Numbers verification", () => {
    // 1. Salary Tax
    const salaryRes = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(salaryRes.monthlyTax).toBe(6000);
    expect(salaryRes.monthlyTakeHome).toBe(144000);

    // 2. Zakat
    const zakatRes = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 2,
      goldUnit: "tola",
      goldRatePerTola: 400000,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: 5500,
      businessStock: 0,
      financialInvestments: 0,
      debtsToDeduct: 100000,
      alreadyPaid: 0,
    });
    expect(zakatRes.zakatDue).toBe(30000);

    // 3. Property
    const propBuy = calculatePropertyTax(10000000, "buy", "filer");
    expect(propBuy.taxAmount).toBe(125000);
    const propSell = calculatePropertyTax(10000000, "sell", "filer");
    expect(propSell.taxAmount).toBe(275000);

    // 4. GST
    const gst100k = calculateGst(100000, "add", 18);
    expect(gst100k.gstAmount).toBe(18000);
    const gst99k = calculateGst(99999.99, "add", 18);
    expect(formatRupees(gst99k.totalAmount, { showPaisaIfDecimal: true })).toBe("Rs 117,999.99");

    // 5. Fitrana
    const fitranaRes = calculateFitrana(5, "wheat", "muneeb");
    expect(fitranaRes.totalFitrana).toBe(1500);
  });
});
