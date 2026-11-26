import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculatorPages } from "@/content/pages";
import { calculateGst } from "./gst";

describe("Prompt 71 — GST Page SEO Audit + Content Gap", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/gst-calculator/layout.tsx"),
    "utf-8"
  );

  it("Tests 1, 2 & 4: Preserves exact title, meta description, canonical, and OpenGraph tags", () => {
    expect(layoutContent).toContain(
      'title: "GST Calculator Pakistan — 18% Sales Tax | CalculationHub"'
    );
    expect(layoutContent).toContain(
      "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total invoice amounts."
    );
    expect(layoutContent).toContain("canonical: `${siteUrl}/gst-calculator`");
    expect(layoutContent).toContain("openGraph:");
    expect(calculatorPages.gst.title).toBe(
      "GST Calculator Pakistan — 18% Sales Tax | CalculationHub"
    );
    expect(calculatorPages.gst.metaDescription).toBe(
      "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total invoice amounts."
    );
  });

  it("Tests 5 & 6: Preserves all 6 existing FAQs and adds the exact new FAQ", () => {
    const qs = calculatorPages.gst.faqs.map((f) => f.question);
    expect(qs).toHaveLength(7);
    expect(qs).toContain("18% kaise nikalein?");
    expect(qs).toContain("Total se GST kaise alag karein?");
    expect(qs).toContain("Services par GST kyun alag hai?");
    expect(qs).toContain("Exempt goods par kitna tax hai?");
    expect(qs).toContain("Input tax credit kya hota hai?");
    expect(qs).toContain("How is GST credit calculated in Pakistan?");

    const newFaq = calculatorPages.gst.faqs.find(
      (f) => f.question === "Is GST 18% on everything in Pakistan?"
    );
    expect(newFaq?.answer).toBe(
      "No. 18% is the standard GST rate on most goods in Pakistan, but some goods are exempt or zero-rated, and services are taxed separately by the provinces at different rates. This calculator applies the 18% standard rate on goods, and also lets you enter a custom rate for any special case. Always check the current SRO or your invoice for the exact rate on a specific item."
    );
  });

  it("Tests 8 & 9: GST 18% trap regressions pass with integer paisa precision", () => {
    const removeRes = calculateGst(100000, "remove", 18);
    expect(removeRes.baseAmount).toBe(84745.76);
    expect(removeRes.gstAmount).toBe(15254.24);

    const addRes = calculateGst(100000, "add", 18);
    expect(addRes.gstAmount).toBe(18000);
    expect(addRes.totalAmount).toBe(118000);
  });
});
