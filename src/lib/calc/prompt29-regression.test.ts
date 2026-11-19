import { describe, it, expect, beforeEach } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { calculateUshr } from "./ushr";
import { buildSalarySummaryData } from "../summary/builders";
import { buildWhatsAppText } from "../summary";
import { saveHistoryEntry, getHistory, clearHistory } from "../history/storage";
import ratesData from "@/data/rates.json";
import fs from "fs";
import path from "path";

class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(k: string) {
    return this.store[k] || null;
  }
  setItem(k: string, v: string) {
    this.store[k] = String(v);
  }
  removeItem(k: string) {
    delete this.store[k];
  }
}

if (typeof window !== "undefined") {
  // @ts-ignore
  window.localStorage = new LocalStorageMock();
} else {
  // @ts-ignore
  global.window = {
    localStorage: new LocalStorageMock(),
    dispatchEvent: () => true,
  } as any;
}

describe("Prompt 29 — Full 11-Point Regression Test Suite", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Test 1: Zakat page rates & nisab calculation
  it("Test 1: Rates updated date is 18 Nov 2026, spot prices within range, and cash 500,000 -> Rs 12,500", () => {
    expect(ratesData.lastUpdatedLabel).toContain("18 Nov 2026");
    expect(ratesData.lastCheckedLabel).toContain("18 Nov 2026");

    // Spot ranges
    expect(ratesData.goldPerTolaPKR).toBeGreaterThan(380000);
    expect(ratesData.goldPerTolaPKR).toBeLessThan(410000);
    expect(ratesData.silverPerTolaPKR).toBeGreaterThan(4500);
    expect(ratesData.silverPerTolaPKR).toBeLessThan(5000);

    // Exact Nisab check: 52.5 * silverPerTolaPKR
    const expectedNisab = Math.round(52.5 * ratesData.silverPerTolaPKR);
    expect(ratesData.nisabSilverPKR).toBe(expectedNisab);

    const zakatRes = calculateZakat({
      cashInHand: 500000,
      silverRatePerTola: ratesData.silverPerTolaPKR,
    });
    expect(zakatRes.zakatDue).toBe(12500);
  });

  // Test 2: Salary 150,000 -> monthly tax 6,000, take-home 144,000 & 1 history entry
  it("Test 2: Salary 150,000 -> monthly tax Rs 6,000, take-home Rs 144,000 and 1 history entry", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.monthlyTakeHome).toBe(144000);

    const history = saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryRaw: "150000", salaryNum: 150000, frequency: "monthly", taxYear: "2026-27" },
    });
    expect(history).toHaveLength(1);
    expect(history[0].summary).toBe("Salary Rs 150,000/mo");
  });

  // Test 3: CRITICAL — In the same session, 200,000 adds 2nd entry live without refresh (200k on top, 150k below)
  it("Test 3: CRITICAL — Live addition of 200,000 produces 2 entries with 200,000 on top and 150,000 below", () => {
    // 1st entry
    saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryRaw: "150000", salaryNum: 150000, frequency: "monthly", taxYear: "2026-27" },
    });

    // Calculate 200,000
    const res2 = calculateSalaryTax(200000, "monthly", "2026-27");
    expect(res2.monthlyTax).toBe(13000);
    expect(res2.annualTax).toBe(156000);

    // 2nd entry in same session
    const updated = saveHistoryEntry("salary", {
      summary: "Salary Rs 200,000/mo",
      resultSummary: "Tax Rs 13,000",
      inputs: { salaryRaw: "200000", salaryNum: 200000, frequency: "monthly", taxYear: "2026-27" },
    });

    expect(updated).toHaveLength(2);
    expect(updated[0].summary).toBe("Salary Rs 200,000/mo");
    expect(updated[0].resultSummary).toBe("Tax Rs 13,000");
    expect(updated[1].summary).toBe("Salary Rs 150,000/mo");
    expect(updated[1].resultSummary).toBe("Tax Rs 6,000");
  });

  // Test 4: Persistence across refresh
  it("Test 4: Refresh simulation — entries persist in localStorage", () => {
    saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryRaw: "150000", salaryNum: 150000, frequency: "monthly", taxYear: "2026-27" },
    });
    saveHistoryEntry("salary", {
      summary: "Salary Rs 200,000/mo",
      resultSummary: "Tax Rs 13,000",
      inputs: { salaryRaw: "200000", salaryNum: 200000, frequency: "monthly", taxYear: "2026-27" },
    });

    const persisted = getHistory("salary");
    expect(persisted).toHaveLength(2);
    expect(persisted[0].summary).toBe("Salary Rs 200,000/mo");
    expect(persisted[1].summary).toBe("Salary Rs 150,000/mo");
  });

  // Test 5: Zakat cash 500,000 -> Rs 12,500 and history isolated
  it("Test 5: Zakat calculation and history isolated from salary", () => {
    const res = calculateZakat({ cashInHand: 500000, silverRatePerTola: ratesData.silverPerTolaPKR });
    expect(res.zakatDue).toBe(12500);

    const zakatHistory = saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });
    expect(zakatHistory).toHaveLength(1);
    expect(getHistory("salary")).toHaveLength(0);
  });

  // Test 6: Ushr wheat 1,000 kg, Rs 130/kg, Rain -> Ushr 100 kg, Rs 13,000
  it("Test 6: Ushr wheat 1,000 kg, Rs 130/kg, rain -> 100 kg, Rs 13,000", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });
    expect(res.ushrKind).toBe(100);
    expect(res.ushrCashValue).toBe(13000);
  });

  // Test 7: Property Buy, Filer, 10,000,000 -> Rs 125,000 (TY27 slab rate 1.25%)
  it("Test 7: Property Buy, Filer, 10,000,000 -> Rs 125,000", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer", "2026-27");
    expect(res.taxAmount).toBe(125000);
  });

  // Test 8: GST 100,000 at 18% -> 18,000 / 118,000; Custom 5% -> 5,000 / 105,000
  it("Test 8: GST standard 18% and custom 5%", () => {
    const standard = calculateGst(100000, "add", 18);
    expect(standard.gstAmount).toBe(18000);
    expect(standard.totalAmount).toBe(118000);

    const custom = calculateGst(100000, "add", 5);
    expect(custom.gstAmount).toBe(5000);
    expect(custom.totalAmount).toBe(105000);
  });

  // Test 9: Fitrana 5 persons, wheat -> Rs 1,500
  it("Test 9: Fitrana 5 persons wheat -> Rs 1,500", () => {
    const res = calculateFitrana(5, "wheat");
    expect(res.totalFitrana).toBe(1500);
  });

  // Test 10: Sitemap and robots.txt domain check
  it("Test 10: Robots and sitemap contain calculationhubs.com and 0 occurrences of pak-tax-cal.vercel.app", () => {
    const robotsPath = path.join(process.cwd(), "public/robots.txt");
    const robots = fs.readFileSync(robotsPath, "utf-8");
    expect(robots).toContain("https://calculationhubs.com/sitemap.xml");
    expect(robots).not.toContain("pak-tax-cal.vercel.app");

    const sitemapPath = path.join(process.cwd(), "public/sitemap.xml");
    const sitemap = fs.readFileSync(sitemapPath, "utf-8");
    expect(sitemap).toContain("https://calculationhubs.com/");
    expect(sitemap).not.toContain("pak-tax-cal.vercel.app");
  });

  // Test 11: Copy Summary uses current inputs (200,000), not old history (150,000)
  it("Test 11: Copy Summary reflects current inputs (200,000) and not previous history", () => {
    const currentResult = calculateSalaryTax(200000, "monthly", "2026-27");
    const summaryData = buildSalarySummaryData({
      salaryRaw: "200,000",
      salaryNum: 200000,
      period: "monthly",
      taxYear: "2026-27",
      result: currentResult,
      language: "en",
    });
    const copyText = buildWhatsAppText(summaryData, "en");
    expect(copyText).toContain("200,000");
    expect(copyText).not.toContain("150,000");
  });
});
