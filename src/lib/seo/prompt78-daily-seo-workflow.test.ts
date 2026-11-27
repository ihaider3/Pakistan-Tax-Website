import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../..");

describe("P78 — Semi-Auto Daily SEO GitHub Actions Workflow", () => {
  it("defines daily-seo-report.yml with 09:00 PKT cron (0 4 * * *), workflow_dispatch, read-only repo, and Issue + artifact only", () => {
    const wfPath = path.join(rootDir, ".github/workflows/daily-seo-report.yml");
    expect(fs.existsSync(wfPath)).toBe(true);
    const wf = fs.readFileSync(wfPath, "utf8");

    expect(wf).toContain('cron: "0 4 * * *"');
    expect(wf).toContain("workflow_dispatch:");
    expect(wf).toContain('python-version: "3.11"');
    expect(wf).toContain("contents: read");
    expect(wf).toContain("issues: write");
    expect(wf).toContain("secrets.GSC_SERVICE_ACCOUNT_JSON");
    expect(wf).toContain('--label "seo-report"');
    expect(wf).toContain('SEO Report ${REPORT_DATE}');
    expect(wf).toContain("retention-days: 90");
    expect(wf).toContain("scripts/daily_seo_report.py");

    // Must NEVER auto-commit, push, or trigger deploy
    expect(wf).not.toMatch(/git\s+commit|git\s+push|vercel\s+deploy/i);
  });

  it("preserves existing update-rates.yml untouched", () => {
    const ratesWf = path.join(rootDir, ".github/workflows/update-rates.yml");
    expect(fs.existsSync(ratesWf)).toBe(true);
    const content = fs.readFileSync(ratesWf, "utf8");
    expect(content).toContain('cron: "0 7 * * *"');
    expect(content).toContain("node scripts/update-rates.mjs");
  });

  it("pins pytrends, google-api-python-client, and google-auth dependencies", () => {
    const reqs = fs.readFileSync(path.join(rootDir, "scripts/requirements-seo.txt"), "utf8");
    expect(reqs).toMatch(/pytrends==\d+\.\d+\.\d+/);
    expect(reqs).toMatch(/google-api-python-client==\d+\.\d+\.\d+/);
    expect(reqs).toMatch(/google-auth==\d+\.\d+\.\d+/);
  });

  it("contains all 7 core keyword targets, 4 competitor domains, and PARKED PTA rule cleanly", () => {
    const py = fs.readFileSync(path.join(rootDir, "scripts/daily_seo_report.py"), "utf8");

    const coreTerms = [
      "Pakistan tax calculator",
      "salary tax calculator Pakistan 2026-27",
      "zakat calculator Pakistan",
      "property tax calculator Pakistan",
      "GST calculator Pakistan",
      "fitrana 2026 Pakistan",
      "ushr calculator Pakistan",
    ];
    for (const term of coreTerms) {
      expect(py).toContain(term);
    }

    const competitors = ["calculation-hub.com", "investify.pk", "deencalc.com", "paycalculus.com"];
    for (const comp of competitors) {
      expect(py).toContain(comp);
    }

    expect(py).toContain("https://calculationhubs.com/");
    expect(py).toContain("PARKED: PTA Tax Calculator");
    expect(py).toContain("Trends rate-limited today, retry tomorrow");
    expect(py).toContain("GSC unavailable — secret add karein");
    expect(py).not.toContain("PRIVATE_KEY_SUPER_SECRET");
  });
});
