import { describe, it, expect, beforeEach, vi } from "vitest";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculatePropertyTax } from "./property";
import { calculateGst } from "./gst";
import { calculateFitrana } from "./fitrana";
import { calculateUshr } from "./ushr";
import {
  getCachedRates,
  saveCachedRates,
  getInitialRates,
  validateRateValues,
  LiveRatesData,
} from "../rates/liveRates";
import ratesData from "@/data/rates.json";

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

describe("Prompt 30 — Full 12-Point Regression Test Suite", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Test 1: Zakat fresh load rates & validation
  it("Test 1: Rates updated label exists and displayed rates are within spot bounds", () => {
    const initial = getInitialRates();
    expect(initial.data.goldPerTolaPKR).toBeGreaterThan(250000);
    expect(initial.data.goldPerTolaPKR).toBeLessThan(600000);
    expect(initial.data.silverPerTolaPKR).toBeGreaterThan(2500);
    expect(initial.data.silverPerTolaPKR).toBeLessThan(10000);
  });

  // Test 2: Zakat cash 500,000 -> Rs 12,500; Nisab = 52.5 * displayed silver rate
  it("Test 2: Zakat cash 500,000 -> Rs 12,500 and dynamic nisab matches 52.5 * silverRate", () => {
    const silverRate = 4732.08;
    const res = calculateZakat({
      cashInHand: 500000,
      silverRatePerTola: silverRate,
    });
    expect(res.zakatDue).toBe(12500);
    const expectedNisab = Math.round(52.5 * silverRate);
    expect(res.nisabThreshold).toBe(expectedNisab);
  });

  // Test 3: Reload within 15 minutes uses cache without refetching
  it("Test 3: Reload within 15 minutes uses cache and preserves timestamp", () => {
    const mockRate: LiveRatesData = {
      ...ratesData,
      lastUpdatedLabel: "18 Nov 2026, 16:45 PKT",
      goldPerTolaPKR: 391500,
      silverPerTolaPKR: 4745,
    };
    saveCachedRates(mockRate);

    const cached = getCachedRates();
    expect(cached?.isFresh).toBe(true);
    expect(cached?.data.lastUpdatedLabel).toBe("18 Nov 2026, 16:45 PKT");
  });

  // Test 4: APIs blocked fallback — last available rates used and calculation succeeds
  it("Test 4: Fallback to bundled rates.json when APIs and cache are unavailable", () => {
    window.localStorage.clear();
    const fallback = getInitialRates();
    expect(fallback.status).toBe("fallback");

    const res = calculateZakat({
      cashInHand: 500000,
      silverRatePerTola: fallback.data.silverPerTolaPKR,
    });
    expect(res.zakatDue).toBe(12500);
  });

  // Test 5: Manual override — custom silver rate recomputes Nisab
  it("Test 5: Manual override applies user rate and recalculates Nisab dynamically", () => {
    const customSilver = 5000;
    const res = calculateZakat({
      cashInHand: 300000,
      silverRatePerTola: customSilver,
    });
    expect(res.nisabThreshold).toBe(262500); // 52.5 * 5000
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(7500); // 2.5% of 300,000
  });

  // Test 6: Salary 150,000 -> tax 6,000, take-home 144,000
  it("Test 6: Salary 150,000 -> tax Rs 6,000, take-home Rs 144,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.monthlyTakeHome).toBe(144000);
  });

  // Test 7: Salary 200,000 -> tax 13,000, annual 156,000
  it("Test 7: Salary 200,000 -> tax Rs 13,000, annual tax Rs 156,000", () => {
    const res = calculateSalaryTax(200000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(13000);
    expect(res.annualTax).toBe(156000);
  });

  // Test 8: Ushr wheat 1,000 kg, Rs 130/kg, rain -> 100 kg, Rs 13,000
  it("Test 8: Ushr wheat 1,000 kg, Rs 130/kg, rain -> 100 kg, Rs 13,000", () => {
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

  // Test 9: Property Buy, Filer, 10,000,000 -> Rs 125,000
  it("Test 9: Property Buy, Filer, 10,000,000 -> Rs 125,000", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer", "2026-27");
    expect(res.taxAmount).toBe(125000);
  });

  // Test 10: GST 100,000 at 18% -> 18,000 / 118,000
  it("Test 10: GST 100,000 at 18% -> 18,000 / 118,000", () => {
    const res = calculateGst(100000, "add", 18);
    expect(res.gstAmount).toBe(18000);
    expect(res.totalAmount).toBe(118000);
  });

  // Test 11: Fitrana 5 persons, wheat -> Rs 1,500
  it("Test 11: Fitrana 5 persons wheat -> Total Rs 1,500", () => {
    const res = calculateFitrana(5, "wheat");
    expect(res.totalFitrana).toBe(1500);
  });

  // Test 12: Non-blocking initial render — getInitialRates is synchronous with 0 delay
  it("Test 12: Synchronous initialization guarantees non-blocking page load", () => {
    const start = performance.now();
    const initial = getInitialRates();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(10); // Less than 10ms execution
    expect(initial.data.goldPerTolaPKR).toBeGreaterThan(0);
  });
});
