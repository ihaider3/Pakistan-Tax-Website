import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import nextConfig from "../../../next.config";
import { calculateSalaryTax } from "./salary";

describe("Prompt 65 — Dead /income-tax-calculator Redirects & Regression Suite", () => {
  it("defines permanent (308) relative redirects for dead income-tax-calculator URLs", async () => {
    expect(typeof nextConfig.redirects).toBe("function");
    const redirects = await nextConfig.redirects!();

    const expectedNew = [
      { source: "/income-tax-calculator", destination: "/salary-tax-calculator", permanent: true },
      { source: "/income-tax-calculator-2025-26", destination: "/salary-tax-calculator", permanent: true },
    ];

    for (const exp of expectedNew) {
      const match = redirects.find((r) => r.source === exp.source);
      expect(match).toBeDefined();
      expect(match?.destination).toBe(exp.destination);
      expect(match?.permanent).toBe(true);
      expect(match?.destination.startsWith("http")).toBe(false);
    }
  });

  it("preserves existing P54 and short-URL permanent redirects unchanged", async () => {
    const redirects = await nextConfig.redirects!();

    const existing = [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/zakat", destination: "/zakat-calculator", permanent: true },
      { source: "/salary", destination: "/salary-tax-calculator", permanent: true },
      { source: "/property", destination: "/property-tax-calculator", permanent: true },
      { source: "/gst", destination: "/gst-calculator", permanent: true },
      { source: "/fitrana", destination: "/fitrana-calculator", permanent: true },
      { source: "/ushr", destination: "/ushr-calculator", permanent: true },
      { source: "/salary-calculator", destination: "/salary-tax-calculator", permanent: true },
      { source: "/property-calculator", destination: "/property-tax-calculator", permanent: true },
    ];

    for (const exp of existing) {
      const match = redirects.find((r) => r.source === exp.source);
      expect(match).toBeDefined();
      expect(match?.destination).toBe(exp.destination);
      expect(match?.permanent).toBe(true);
    }
  });

  it("excludes old dead URLs from sitemap.xml while retaining /salary-tax-calculator", () => {
    const sitemapPath = path.join(process.cwd(), "public/sitemap.xml");
    const sitemap = fs.readFileSync(sitemapPath, "utf-8");

    expect(sitemap).not.toContain("/income-tax-calculator");
    expect(sitemap).not.toContain("/income-tax-calculator-2025-26");
    expect(sitemap).toContain("https://calculationhubs.com/salary-tax-calculator");
  });

  it("Trap test (Salary): monthly salary 175,000 yields Rs 8,750/mo (Rs 105,000/yr) on TY2027 slabs", () => {
    const res = calculateSalaryTax(175000, "monthly", "2026-27");
    expect(res.annualSalary).toBe(2100000);
    expect(res.annualTax).toBe(105000);
    expect(res.monthlyTax).toBe(8750);
  });
});

