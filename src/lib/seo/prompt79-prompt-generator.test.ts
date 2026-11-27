import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../..");

describe("P79 — Ready-Made Antigravity Prompt Generator & Grounded Data", () => {
  it("provides exact statutory verified-figures.json with no hard-coded gold/silver rupee rate or Ushr Ordinance threshold", () => {
    const raw = fs.readFileSync(path.join(rootDir, "scripts/verified-figures.json"), "utf8");
    const data = JSON.parse(raw);

    expect(data.rules.neverInventFigures).toBe(true);
    expect(data.rules.goldAndSilverRatesMustUseLiveVariables).toBe(true);

    // Salary TY2027 8 slabs + examples
    const salary = data.calculators["/salary-tax-calculator"];
    expect(salary.slabs).toHaveLength(8);
    expect(salary.surcharge).toContain("abolished");
    expect(salary.figures.join("\n")).toContain("100,000");
    expect(salary.figures.join("\n")).toContain("500/month");
    expect(salary.figures.join("\n")).toContain("150,000");
    expect(salary.figures.join("\n")).toContain("6,000/month");
    expect(salary.figures.join("\n")).toContain("200,000");
    expect(salary.figures.join("\n")).toContain("13,000/month");

    // Zakat live variables (no hardcoded rupee gold/silver rate)
    const zakatText = data.calculators["/zakat-calculator"].figures.join("\n");
    expect(zakatText).toContain("87.48");
    expect(zakatText).toContain("612.36");
    expect(zakatText).toContain("52.5 tola");
    expect(zakatText).toContain("goldPerTola");
    expect(zakatText).toContain("silverPerTola");
    expect(zakatText).toContain("12,500");
    expect(zakatText).toContain("19,444.43");

    // Property 236C & 236K
    const propText = data.calculators["/property-tax-calculator"].figures.join("\n");
    expect(propText).toContain("2.75%");
    expect(propText).toContain("11.5%");
    expect(propText).toContain("1.25%");
    expect(propText).toContain("10.5%");
    expect(propText).toContain("14.5%");
    expect(propText).toContain("18.5%");
    expect(propText).toContain("125,000");

    // GST
    const gstText = data.calculators["/gst-calculator"].figures.join("\n");
    expect(gstText).toContain("18%");
    expect(gstText).toContain("118,000");
    expect(gstText).toContain("84,745.76");
    expect(gstText).toContain("15,254.24");

    // Fitrana
    const fitText = data.calculators["/fitrana-calculator"].figures.join("\n");
    expect(fitText).toContain("300");
    expect(fitText).toContain("1,160");
    expect(fitText).toContain("2,800");
    expect(fitText).toContain("7,200");
    expect(fitText).toContain("1,500");

    // Ushr
    const ushrText = data.calculators["/ushr-calculator"].figures.join("\n");
    expect(ushrText).toContain("10%");
    expect(ushrText).toContain("5%");
    expect(ushrText).toContain("7.5%");
    expect(ushrText).toContain("2,000 kg");
    expect(ushrText).toContain("100 kg");
    expect(ushrText).toContain("4,000 kg");
    expect(ushrText).toContain("400 kg");
    expect(ushrText).toContain("200 kg");
    expect(ushrText).toContain("300 kg");
  });

  it("provides curl-verified seo-coverage.json covering P58, P60, P64, P67", () => {
    const cov = JSON.parse(fs.readFileSync(path.join(rootDir, "scripts/seo-coverage.json"), "utf8"));
    expect(Array.isArray(cov.entries)).toBe(true);
    const allText = JSON.stringify(cov).toLowerCase();
    expect(allText).toContain("zakat calculator on gold");
    expect(allText).toContain("10 tola gold zakat");
    expect(allText).toContain("fbr tax calculator");
    expect(allText).toContain("how is gst credit calculated");
    expect(allText).toContain("24k gold rate in pakistan");
  });

  it("uploads prompts/ artifact in daily-seo-report.yml while remaining read-only draft", () => {
    const wf = fs.readFileSync(path.join(rootDir, ".github/workflows/daily-seo-report.yml"), "utf8");
    expect(wf).toContain("contents: read");
    expect(wf).toContain("seo-report/prompts/");
    expect(wf).toContain("retention-days: 90");
    expect(wf).toContain("scripts/upsert_seo_issue.py");
    expect(wf).not.toMatch(/git\s+commit|git\s+push|vercel\s+deploy/i);
  });
});
