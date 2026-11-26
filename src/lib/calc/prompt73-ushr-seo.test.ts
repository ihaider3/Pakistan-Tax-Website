import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculatorPages } from "@/content/pages";
import { ushrRates } from "../rates/ushr";
import { calculateUshr } from "./ushr";

describe("Prompt 73 — Ushr Page SEO Audit + Content Gap", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/ushr-calculator/layout.tsx"),
    "utf-8"
  );
  const pageContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/ushr-calculator/page.tsx"),
    "utf-8"
  );

  it("Tests 1, 2 & 4: Preserves exact title, meta description, canonical, and OpenGraph tags", () => {
    expect(layoutContent).toContain(
      'title: "Ushr Calculator Pakistan — Zakat on Crops | CalculationHub"'
    );
    expect(layoutContent).toContain(
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% rain-fed, 5% tube-well, 7.5% mixed irrigation. Enter harvest in kg or maund, get Ushr in kind and rupees."
    );
    expect(layoutContent).toContain("canonical: `${siteUrl}/ushr-calculator`");
    expect(layoutContent).toContain("openGraph:");
    expect(calculatorPages.ushr.title).toBe(
      "Ushr Calculator Pakistan — Zakat on Crops | CalculationHub"
    );
    expect(calculatorPages.ushr.metaDescription).toBe(
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% rain-fed, 5% tube-well, 7.5% mixed irrigation. Enter harvest in kg or maund, get Ushr in kind and rupees."
    );
  });

  it("Test 5: Keeps Ushr rules unchanged and omits disputed 948/849 kg threshold", () => {
    expect(ushrRates.rates.rain.rate).toBe(0.1);
    expect(ushrRates.rates.tubewell.rate).toBe(0.05);
    expect(ushrRates.rates.mixed.rate).toBe(0.075);
    expect(ushrRates.kgPerMaund).toBe(40);
    expect(ushrRates.majorityNisabKg).toBe(653);
    expect(pageContent).not.toContain("948 kg");
    expect(pageContent).not.toContain("849 kg");
  });

  it("Tests 6 & 7: Preserves all 4 existing FAQs and adds the exact 100 maund wheat FAQ", () => {
    const qs = calculatorPages.ushr.faqs.map((f) => f.question);
    expect(qs).toHaveLength(5);
    expect(qs).toContain("Ushr aur Zakat (2.5%) mein kya farq hai?");
    expect(qs).toContain("Kya beej/khaad ka kharcha kaat sakte hain?");
    expect(qs).toContain("Mixed pani par rate kya hai?");
    expect(qs).toContain("Kya chhoti fasal par bhi Ushr hai?");

    const newFaq = calculatorPages.ushr.faqs.find(
      (f) => f.question === "How much Ushr is due on 100 maund of wheat?"
    );
    expect(newFaq?.answer).toBe(
      "100 maund equals 4,000 kg (1 maund = 40 kg). If the wheat was rain-fed, Ushr is 10% — 400 kg. If it was irrigated by tube-well, Ushr is 5% — 200 kg. If both methods were used equally, Ushr is 7.5% — 300 kg. Ushr is due at harvest time, and no seed or fertiliser cost is deducted. Enter your harvest in the calculator above for your exact figure."
    );
  });

  it("Test 9: Ushr trap (2,000 kg tube-well = 100 kg) and 100 maund wheat math pass", () => {
    const trap = calculateUshr({
      crop: "wheat",
      quantity: 2000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "tubewell",
    });
    expect(trap.ushrKind).toBe(100);

    expect(
      calculateUshr({
        crop: "wheat",
        quantity: 4000,
        unit: "kg",
        pricePerUnit: 130,
        irrigation: "rain",
      }).ushrKind
    ).toBe(400);
    expect(
      calculateUshr({
        crop: "wheat",
        quantity: 4000,
        unit: "kg",
        pricePerUnit: 130,
        irrigation: "tubewell",
      }).ushrKind
    ).toBe(200);
    expect(
      calculateUshr({
        crop: "wheat",
        quantity: 4000,
        unit: "kg",
        pricePerUnit: 130,
        irrigation: "mixed",
      }).ushrKind
    ).toBe(300);
  });
});
