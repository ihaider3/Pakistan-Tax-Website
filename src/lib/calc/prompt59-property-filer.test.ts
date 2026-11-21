import { describe, it, expect } from "vitest";
import { calculatePropertyTax } from "@/lib/calc/property";
import { calculatorPages } from "@/content/pages";

describe("Prompt 59 — Property Tax for Filers in Pakistan Verification", () => {
  it("Test 1: Property Rs 30,000,000, buyer filer, seller filer -> Buyer Rs 375,000 (1.25%), seller Rs 825,000 (2.75%) — unchanged", () => {
    const buyerRes = calculatePropertyTax(30000000, "buy", "filer");
    expect(buyerRes.taxAmount).toBe(375000);
    expect(buyerRes.rate).toBe(0.0125);
    expect(buyerRes.ratePercentage).toBe("1.25%");

    const sellerRes = calculatePropertyTax(30000000, "sell", "filer");
    expect(sellerRes.taxAmount).toBe(825000);
    expect(sellerRes.rate).toBe(0.0275);
    expect(sellerRes.ratePercentage).toBe("2.75%");
  });

  it("Test 2: Property Rs 10,000,000, buyer filer -> Buyer advance tax Rs 125,000", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    expect(res.taxAmount).toBe(125000);
    expect(res.rate).toBe(0.0125);
    expect(res.ratePercentage).toBe("1.25%");
  });

  it("Test 3: New subsection heading Property Tax for Filers in Pakistan visible; new FAQ visible with the Rs 10,000,000 example (125,000 / 275,000)", () => {
    const content = calculatorPages.property;

    // Check new FAQ exists in content
    const faq = content.faqs.find((f) =>
      f.question.includes("How much property tax does a filer pay in Pakistan?")
    );
    expect(faq).toBeDefined();
    expect(faq?.answer).toContain("1.25% under Section 236K");
    expect(faq?.answer).toContain("2.75% under Section 236C");
    expect(faq?.answer).toContain("Rs 10,000,000");
    expect(faq?.answer).toContain("Rs 125,000");
    expect(faq?.answer).toContain("Rs 275,000");
  });

  it("Test 4: Title still Property Tax Calculator Pakistan 236C 236K | CalculationHub; all other sections/FAQs unchanged", () => {
    const content = calculatorPages.property;
    expect(content.title).toBe(
      "Property Tax Calculator Pakistan 236C 236K | CalculationHub"
    );
    expect(content.metaDescription).toBe(
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare Filer vs Non-Filer tax and savings instantly in Pakistan."
    );
    expect(content.slug).toBe("property-tax-calculator");

    // Existing FAQs preserved
    expect(content.faqs.some((f) => f.question.includes("236C aur 236K mein farq?"))).toBe(true);
    expect(content.faqs.some((f) => f.question.includes("Filer banne se kitni bachat?"))).toBe(true);
    expect(content.faqs.some((f) => f.question.includes("Provincial fees kyun nahi hain?"))).toBe(true);
    expect(content.faqs.some((f) => f.question.includes("Late-filer category ka kya hua?"))).toBe(true);
  });

  it("Test 5 (TRAP TEST): same Rs 10,000,000 property, buyer NON-filer -> Buyer advance tax Rs 1,050,000 (10.5%) — must NOT show the filer figure of Rs 125,000", () => {
    const nonFilerRes = calculatePropertyTax(10000000, "buy", "non-filer");
    expect(nonFilerRes.taxAmount).toBe(1050000);
    expect(nonFilerRes.rate).toBe(0.105);
    expect(nonFilerRes.ratePercentage).toBe("10.5%");
    expect(nonFilerRes.taxAmount).not.toBe(125000);
  });
});
