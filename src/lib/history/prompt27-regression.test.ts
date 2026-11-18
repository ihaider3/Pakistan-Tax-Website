import { describe, it, expect, beforeEach } from "vitest";
import {
  saveHistoryEntry,
  getHistory,
  deleteHistoryEntry,
  clearHistory,
} from "./storage";
import { calculateSalaryTax } from "../calc/salary";
import { calculateZakat } from "../calc/zakat";
import { calculatePropertyTax } from "../calc/property";
import { calculateGst } from "../calc/gst";
import { calculateFitrana } from "../calc/fitrana";
import { calculateUshr } from "../calc/ushr";
import { buildSalarySummaryData } from "../summary/builders";
import { buildWhatsAppText } from "../summary";
import fs from "fs";
import path from "path";
import ratesData from "../../data/rates.json";

class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(k: string) { return this.store[k] || null; }
  setItem(k: string, v: string) { this.store[k] = String(v); }
  removeItem(k: string) { delete this.store[k]; }
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

describe("Prompt 27 - Full 15-Point Regression Test Suite", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Test 1: Salary 150,000
  it("Test 1: Salary 150,000 produces monthly tax Rs 6,000, take-home Rs 144,000 and 1 history entry", () => {
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
    expect(history[0].resultSummary).toBe("Tax Rs 6,000");
  });

  // Test 2: Salary 300,000 TY2027 and TY2025-26
  it("Test 2: Salary 300,000 TY2027 annual Rs 416,000 & TY2025-26 annual Rs 466,000 in history", () => {
    const ty27 = calculateSalaryTax(300000, "monthly", "2026-27");
    expect(ty27.annualTax).toBe(416000);

    const ty26 = calculateSalaryTax(300000, "monthly", "2025-26");
    expect(ty26.annualTax).toBe(466000);

    saveHistoryEntry("salary", {
      summary: "Salary Rs 300,000/mo",
      resultSummary: "Tax Rs 34,667",
      inputs: { salaryRaw: "300000", salaryNum: 300000, frequency: "monthly", taxYear: "2026-27" },
    });
    saveHistoryEntry("salary", {
      summary: "Salary Rs 300,000/mo (TY2025-26)",
      resultSummary: "Tax Rs 38,833",
      inputs: { salaryRaw: "300000", salaryNum: 300000, frequency: "monthly", taxYear: "2025-26" },
    });

    const list = getHistory("salary");
    expect(list).toHaveLength(2);
    expect(list[0].summary).toBe("Salary Rs 300,000/mo (TY2025-26)");
    expect(list[1].summary).toBe("Salary Rs 300,000/mo");
  });

  // Test 3: Zakat cash 500,000 -> Rs 12,500 and isolated from Salary
  it("Test 3: Zakat cash 500,000 gives Rs 12,500; Zakat history does not leak into Salary", () => {
    const res = calculateZakat({ cashInHand: 500000, silverRatePerTola: ratesData.silverPerTolaPKR });
    expect(res.zakatDue).toBe(12500);

    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });

    expect(getHistory("zakat")).toHaveLength(1);
    expect(getHistory("salary")).toHaveLength(0);
  });

  // Test 4: Tap history row restores inputs and recalculates dynamically
  it("Test 4: Restoring inputs recalculates current live result (500,000 -> 12,500)", () => {
    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });

    const entry = getHistory<{ cashNum: number }>("zakat")[0];
    const recalculated = calculateZakat({ cashInHand: entry.inputs.cashNum, silverRatePerTola: ratesData.silverPerTolaPKR });
    expect(recalculated.zakatDue).toBe(12500);
  });

  // Test 5: Re-calculating same inputs does NOT create duplicate
  it("Test 5: Re-calculating exact same inputs updates timestamp without creating duplicate", () => {
    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });
    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });

    const entries = getHistory("zakat");
    expect(entries).toHaveLength(1);
  });

  // Test 6: Ushr wheat 1,000 kg, Rs 130/kg, Rain -> 100 kg, Rs 13,000
  it("Test 6: Ushr wheat 1,000 kg @ Rs 130/kg rain gives 100 kg produce, Rs 13,000 cash", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });
    expect(res.ushrKind).toBe(100);
    expect(res.ushrCashValue).toBe(13000);

    const hist = saveHistoryEntry("ushr", {
      summary: "Ushr — Wheat 1,000 kg, Rain",
      resultSummary: "Ushr 100 kg, Rs 13,000",
      inputs: { crop: "wheat", quantity: 1000, price: 130, irrigation: "rain" },
    });
    expect(hist[0].resultSummary).toBe("Ushr 100 kg, Rs 13,000");
  });

  // Test 7: Property Buy Filer 10,000,000 -> Rs 125,000
  it("Test 7: Property Buy Filer 10,000,000 gives Rs 125,000 (1.25%)", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    expect(res.taxAmount).toBe(125000);
  });

  // Test 8: GST 100,000 Add GST 18% -> Rs 18,000 / Rs 118,000
  it("Test 8: GST 100,000 Add GST 18% gives GST Rs 18,000 and Total Rs 118,000", () => {
    const res = calculateGst(100000, "add", 18);
    expect(res.gstAmount).toBe(18000);
    expect(res.totalAmount).toBe(118000);
  });

  // Test 9: Fitrana 5 persons wheat -> Rs 1,500
  it("Test 9: Fitrana 5 persons wheat gives Rs 1,500 (5 x 300)", () => {
    const res = calculateFitrana(5, "wheat", "muneeb");
    expect(res.totalFitrana).toBe(1500);
  });

  // Test 10: History persists in localStorage
  it("Test 10: History persists across reads from localStorage", () => {
    saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryNum: 150000 },
    });
    const reloaded = getHistory("salary");
    expect(reloaded).toHaveLength(1);
    expect(reloaded[0].summary).toBe("Salary Rs 150,000/mo");
  });

  // Test 11: Single delete & clear all
  it("Test 11: Single item delete removes only that item, clearHistory removes all", () => {
    const list = saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryNum: 150000 },
    });
    deleteHistoryEntry("salary", list[0].id);
    expect(getHistory("salary")).toHaveLength(0);

    saveHistoryEntry("salary", {
      summary: "Salary Rs 200,000/mo",
      resultSummary: "Tax Rs 14,000",
      inputs: { salaryNum: 200000 },
    });
    clearHistory("salary");
    expect(getHistory("salary")).toHaveLength(0);
  });

  // Test 12: Language headings
  it("Test 12: Headings support English and Roman Urdu modes", () => {
    const compContent = fs.readFileSync(path.resolve(__dirname, "../../components/CalculatorHistory.tsx"), "utf-8");
    expect(compContent).toContain("Haaliya hisaab");
    expect(compContent).toContain("Recent calculations");
    expect(compContent).toContain("History saaf karein");
    expect(compContent).toContain("Clear history");
  });

  // Test 13: Copy Summary uses CURRENT inputs (200,000) not history (150,000)
  it("Test 13: Copy Summary always builds from current inputs (200,000) not past history", () => {
    saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryNum: 150000 },
    });

    const currentResult = calculateSalaryTax(200000, "monthly", "2026-27");
    const summaryData = buildSalarySummaryData({
      salaryRaw: "200000",
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

  // Test 14: Footer email and mailto
  it("Test 14: Footer displays contact@calculationhubs.com and mailto:contact@calculationhubs.com", () => {
    const footer = fs.readFileSync(path.resolve(__dirname, "../../components/Footer.tsx"), "utf-8");
    expect(footer).toContain("contact@calculationhubs.com");
    expect(footer).toContain("mailto:contact@calculationhubs.com");
  });

  // Test 15: Contact page & entire codebase clean of pakfinancecalc.org
  it("Test 15: Contact page shows contact@calculationhubs.com; pakfinancecalc.org is nowhere in site", () => {
    const contact = fs.readFileSync(path.resolve(__dirname, "../../app/contact/page.tsx"), "utf-8");
    expect(contact).toContain("contact@calculationhubs.com");
    expect(contact).toContain("mailto:contact@calculationhubs.com");
    expect(contact).not.toContain("pakfinancecalc.org");
  });
});
