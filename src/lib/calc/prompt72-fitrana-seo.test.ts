import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculatorPages } from "@/content/pages";
import { fitranaRates2026 } from "../rates/fitrana-2026";
import { calculateFitrana } from "./fitrana";

describe("Prompt 72 — Fitrana Page SEO Audit + Content Gap", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/fitrana-calculator/layout.tsx"),
    "utf-8"
  );

  it("Tests 1, 2 & 4: Preserves exact title, meta description, canonical, and OpenGraph tags", () => {
    expect(layoutContent).toContain(
      'title: "Fitrana Calculator 2026 — Wheat Rs 300 | CalculationHub"'
    );
    expect(layoutContent).toContain(
      "Calculate household Fitrana for Ramadan 2026 in Pakistan. Compare Mufti Muneeb and CII per-person rates for wheat, barley, dates and raisins instantly."
    );
    expect(layoutContent).toContain("canonical: `${siteUrl}/fitrana-calculator`");
    expect(layoutContent).toContain("openGraph:");
    expect(calculatorPages.fitrana.title).toBe(
      "Fitrana Calculator 2026 — Wheat Rs 300 | CalculationHub"
    );
    expect(calculatorPages.fitrana.metaDescription).toBe(
      "Calculate household Fitrana for Ramadan 2026 in Pakistan. Compare Mufti Muneeb and CII per-person rates for wheat, barley, dates and raisins instantly."
    );
  });

  it("Test 5: Keeps verified 2026 Mufti Muneeb and CII rates unchanged", () => {
    const muneeb = fitranaRates2026.sources.muneeb.rates;
    expect(muneeb.wheat.amount).toBe(300);
    expect(muneeb.barley.amount).toBe(1160);
    expect(muneeb.dates.amount).toBe(2800);
    expect(muneeb.raisins.amount).toBe(7200);

    const cii = fitranaRates2026.sources.cii.rates;
    expect(cii.wheat.amount).toBe(300);
    expect(cii.barley.amount).toBe(1100);
    expect(cii.dates.amount).toBe(1600);
    expect(cii.raisins.amount).toBe(3800);
  });

  it("Tests 6 & 7: Preserves all 5 existing FAQs and adds the exact family-of-5 FAQ", () => {
    const qs = calculatorPages.fitrana.faqs.map((f) => f.question);
    expect(qs).toHaveLength(6);
    expect(qs).toContain("Fitrana kab dena hai?");
    expect(qs).toContain("Wheat Rs 300 kis ki announcement hai?");
    expect(qs).toContain("CII aur Mufti Muneeb mein farq kyun hai?");
    expect(qs).toContain("Fitrana kis par farz hai?");
    expect(qs).toContain("Kia Fidya aur Kaffara is mein shamil hain?");

    const newFaq = calculatorPages.fitrana.faqs.find(
      (f) => f.question === "How much Fitrana should a family of 5 pay?"
    );
    expect(newFaq?.answer).toBe(
      "At the wheat rate of Rs 300 per person (Mufti Muneeb-ur-Rehman, 2026), a family of 5 pays Rs 1,500 in total. If you follow the other categories, the same family pays Rs 5,800 for barley (5 × Rs 1,160), Rs 14,000 for dates (5 × Rs 2,800), or Rs 36,000 for raisins (5 × Rs 7,200). Enter your family size in the calculator above for your exact amount."
    );
  });

  it("Test 9: Fitrana trap regression for family of 5 (wheat Rs 1,500) passes", () => {
    expect(calculateFitrana(5, "wheat", "muneeb").totalFitrana).toBe(1500);
    expect(calculateFitrana(5, "wheat", "cii").totalFitrana).toBe(1500);
    expect(calculateFitrana(5, "barley", "muneeb").totalFitrana).toBe(5800);
    expect(calculateFitrana(5, "dates", "muneeb").totalFitrana).toBe(14000);
    expect(calculateFitrana(5, "raisins", "muneeb").totalFitrana).toBe(36000);
  });
});
