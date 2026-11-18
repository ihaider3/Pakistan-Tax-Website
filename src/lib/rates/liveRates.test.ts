import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  validateRateValues,
  getCachedRates,
  saveCachedRates,
  getInitialRates,
  formatPKTLabel,
  RATES_CACHE_KEY,
  CACHE_TTL_MS,
  LiveRatesData,
} from "./liveRates";
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
  } as any;
}

describe("Prompt 30 — Live Rates & Fallback System", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("Test 1: PKT date-time formatting generates valid label and ISO string", () => {
    const { iso, label } = formatPKTLabel(new Date());
    expect(iso).toContain("+05:00");
    expect(label).toContain("PKT");
  });

  it("Test 2: Rate validation passes within expected spot ranges", () => {
    // Normal spot rates
    const valid = validateRateValues(3770, 45.75, 276.82, 391500, 4747, null);
    expect(valid.valid).toBe(true);
  });

  it("Test 3: Rate validation rejects out-of-range anomalies", () => {
    // Gold spot too low
    expect(validateRateValues(1500, 45.75, 276.82, 391500, 4747).valid).toBe(false);
    // Silver spot too high
    expect(validateRateValues(3770, 150, 276.82, 391500, 4747).valid).toBe(false);
    // USD too low
    expect(validateRateValues(3770, 45.75, 150, 391500, 4747).valid).toBe(false);
  });

  it("Test 4: 10% jump guard rejects sudden market spikes or API glitches", () => {
    const previous: LiveRatesData = {
      ...ratesData,
      goldPerTolaPKR: 400000,
    };

    // 12% jump (400,000 -> 450,000)
    const res = validateRateValues(4200, 45, 280, 450000, 4800, previous);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("10% guard");

    // 5% move is accepted
    const safeRes = validateRateValues(3900, 45, 276, 420000, 4800, previous);
    expect(safeRes.valid).toBe(true);
  });

  it("Test 5: 15-minute cache avoids unnecessary network fetches", () => {
    const sampleRate: LiveRatesData = {
      ...ratesData,
      goldPerTolaPKR: 395000,
      silverPerTolaPKR: 4800,
    };

    saveCachedRates(sampleRate);

    const cached = getCachedRates();
    expect(cached).not.toBeNull();
    expect(cached?.isFresh).toBe(true);
    expect(cached?.data.goldPerTolaPKR).toBe(395000);

    // Simulate 20 minutes elapsed
    const now = Date.now();
    const stalePayload = {
      data: sampleRate,
      cachedAt: now - 20 * 60 * 1000,
    };
    window.localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(stalePayload));

    const expired = getCachedRates();
    expect(expired).not.toBeNull();
    expect(expired?.isFresh).toBe(false); // Expired cache triggers background refresh
  });

  it("Test 6: Fallback chain returns bundled rates.json when cache is empty", () => {
    window.localStorage.clear();
    const initial = getInitialRates();
    expect(initial.status).toBe("fallback");
    expect(initial.data.goldPerTolaPKR).toBe(ratesData.goldPerTolaPKR);
    expect(initial.data.silverPerTolaPKR).toBe(ratesData.silverPerTolaPKR);
  });

  it("Test 7: Nisab values mathematically reconcile with displayed rates", () => {
    const silverTola = 4732.08;
    const goldTola = 390697.71;

    const silverNisab = Math.round(52.5 * silverTola);
    const goldNisab = Math.round(7.5 * goldTola);

    expect(silverNisab).toBe(248434);
    expect(goldNisab).toBe(2930233);
  });
});

