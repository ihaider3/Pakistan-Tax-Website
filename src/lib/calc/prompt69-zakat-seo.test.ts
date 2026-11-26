import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculatorPages } from "@/content/pages";
import { calculateZakat } from "./zakat";

describe("Prompt 69 — Zakat Page SEO with Trending Keywords", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/zakat-calculator/layout.tsx"),
    "utf-8"
  );
  const pageContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/zakat-calculator/page.tsx"),
    "utf-8"
  );

  it("Tests 1 & 2: Keeps Zakat title and meta description unchanged", () => {
    expect(layoutContent).toContain(
      'title: "Zakat Calculator Pakistan — Nisab 2026 | CalculationHub"'
    );
    expect(layoutContent).toContain(
      "Calculate 2.5% Zakat on cash, gold, silver and business assets with live Hanafi Nisab verification in Pakistan. 100% private, free, and instant breakdown."
    );
    expect(calculatorPages.zakat.title).toBe(
      "Zakat Calculator Pakistan — Nisab 2026 | CalculationHub"
    );
    expect(calculatorPages.zakat.metaDescription).toBe(
      "Calculate 2.5% Zakat on cash, gold, silver and business assets with live Hanafi Nisab verification in Pakistan. 100% private, free, and instant breakdown."
    );
  });

  it("Test 4: Adds the 1 new silver FAQ dynamically wired to live silverRateNum", () => {
    expect(pageContent).toContain('"How much Zakat is due on silver in Pakistan?"');
    expect(pageContent).toContain(
      "Zakat on silver is 2.5% of its value once your silver reaches the nisab of 52.5 tola (612.36 grams) and one lunar year has passed. For example, Zakat on 1 tola of silver is 2.5% of the live silver rate per tola — the calculator above uses the live silver rate, so the figure is always current. In Pakistan the silver nisab is used by default (Hanafi), because it is lower than the gold nisab and covers more people."
    );
    expect(pageContent).toContain("roundToPaisa(silverRateNum * 0.025)");
    expect(pageContent).toContain("Math.round(52.5 * silverRateNum)");
  });

  it("Test 5: Preserves all 9 existing FAQs (5 static + 4 dynamic gold FAQs)", () => {
    const staticQs = calculatorPages.zakat.faqs.map((f) => f.question);
    expect(staticQs).toHaveLength(5);
    expect(staticQs).toContain("Nisab gold ya silver?");
    expect(staticQs).toContain("Bank ne zakat kaat li to kya karein?");
    expect(staticQs).toContain("Hawl kya hai?");
    expect(staticQs).toContain(
      "Government bank deduction nisab aur personal nisab mein kya farq hai?"
    );
    expect(staticQs).toContain(
      "Kia zewar jo rozmarra istemal mein ho us par Zakat hai?"
    );

    expect(pageContent).toContain('"What is the Zakat nisab on gold in Pakistan?"');
    expect(pageContent).toContain(
      '"How much Zakat is due on 1 tola of gold in Pakistan?"'
    );
    expect(pageContent).toContain(
      '"How much Zakat on 10 tola gold is due in Pakistan?"'
    );
    expect(pageContent).toContain('"What is the 24k gold rate in Pakistan today?"');
  });

  it("Tests 7 & 8: Zakat trap regressions remain accurate", () => {
    const baseInputs = {
      bankSavings: 0,
      goldUnit: "tola" as const,
      goldQuantity: 0,
      goldRatePerTola: 300000,
      silverUnit: "tola" as const,
      silverQuantity: 0,
      silverRatePerTola: 4000,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    };

    const trap1 = calculateZakat({ ...baseInputs, cashInHand: 777777 });
    expect(trap1.zakatDue).toBe(19444.43);

    const trap2 = calculateZakat({ ...baseInputs, cashInHand: 500000 });
    expect(trap2.zakatDue).toBe(12500);
  });
});
