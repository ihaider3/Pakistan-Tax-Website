import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculatorPages } from "@/content/pages";
import { calculatePropertyTax } from "./property";

describe("Prompt 70 — Property Tax Page SEO Audit + Non-Filer FAQ", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/property-tax-calculator/layout.tsx"),
    "utf-8"
  );

  it("Tests 1, 2 & 4: Preserves title, meta description, canonical, and OpenGraph tags", () => {
    expect(layoutContent).toContain(
      'title: "Property Tax Calculator Pakistan 236C 236K | CalculationHub"'
    );
    expect(layoutContent).toContain(
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare Filer vs Non-Filer tax and savings instantly in Pakistan."
    );
    expect(layoutContent).toContain("canonical: `${siteUrl}/property-tax-calculator`");
    expect(layoutContent).toContain("openGraph:");
    expect(calculatorPages.property.title).toBe(
      "Property Tax Calculator Pakistan 236C 236K | CalculationHub"
    );
    expect(calculatorPages.property.metaDescription).toBe(
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare Filer vs Non-Filer tax and savings instantly in Pakistan."
    );
  });

  it("Tests 5 & 6: Preserves all 6 existing FAQs and adds the verified non-filer FAQ", () => {
    const qs = calculatorPages.property.faqs.map((f) => f.question);
    expect(qs).toHaveLength(7);
    expect(qs).toContain("236C aur 236K mein farq?");
    expect(qs).toContain("Filer banne se kitni bachat?");
    expect(qs).toContain("Provincial fees kyun nahi hain?");
    expect(qs).toContain("Late-filer category ka kya hua?");
    expect(qs).toContain("How much property tax does a filer pay in Pakistan?");
    expect(qs).toContain("Kia yeh advance tax adjustable hai?");

    const nfFaq = calculatorPages.property.faqs.find(
      (f) => f.question === "How much property tax does a non-filer pay in Pakistan?"
    );
    expect(nfFaq).toBeDefined();
    expect(nfFaq?.answer).toContain("10.5% under Section 236K");
    expect(nfFaq?.answer).toContain("Rs 1,050,000");
    expect(nfFaq?.answer).toContain("14.5%");
    expect(nfFaq?.answer).toContain("18.5%");
    expect(nfFaq?.answer).toContain("1.25%, Rs 125,000");
    expect(nfFaq?.answer).toContain("11.5% under Section 236C");
    expect(nfFaq?.answer).toContain("Rs 1,150,000");
    expect(nfFaq?.answer).toContain("2.75%, Rs 275,000");
  });

  it("Tests 8 & 9: Property trap and FBR Circular 02 2026-27 non-filer regressions pass", () => {
    expect(calculatePropertyTax(10000000, "buy", "filer").taxAmount).toBe(125000);
    expect(calculatePropertyTax(30000000, "buy", "filer").taxAmount).toBe(375000);
    expect(calculatePropertyTax(30000000, "sell", "filer").taxAmount).toBe(825000);

    expect(calculatePropertyTax(10000000, "buy", "non-filer").taxAmount).toBe(1050000);
    expect(calculatePropertyTax(10000000, "sell", "non-filer").taxAmount).toBe(1150000);
  });
});
