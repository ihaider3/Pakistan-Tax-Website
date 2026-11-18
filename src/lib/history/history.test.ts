import { describe, it, expect, beforeEach } from "vitest";
import {
  saveHistoryEntry,
  getHistory,
  deleteHistoryEntry,
  clearHistory,
  formatPKTDateTime,
} from "./storage";
import { HISTORY_STORAGE_KEYS, MAX_HISTORY_ENTRIES } from "./types";

// Mock localStorage in node environment if needed
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

if (typeof window !== "undefined") {
  // @ts-ignore
  if (!window.localStorage || typeof window.localStorage.getItem !== "function") {
    // @ts-ignore
    window.localStorage = new LocalStorageMock();
  }
} else {
  // @ts-ignore
  global.window = {
    localStorage: new LocalStorageMock(),
    dispatchEvent: () => true,
  } as any;
}

describe("Local Calculation History (Prompt 26 & 27)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("has correct storage key for each of the 6 calculators", () => {
    expect(HISTORY_STORAGE_KEYS.salary).toBe("calc-history-salary");
    expect(HISTORY_STORAGE_KEYS.zakat).toBe("calc-history-zakat");
    expect(HISTORY_STORAGE_KEYS.property).toBe("calc-history-property");
    expect(HISTORY_STORAGE_KEYS.gst).toBe("calc-history-gst");
    expect(HISTORY_STORAGE_KEYS.fitrana).toBe("calc-history-fitrana");
    expect(HISTORY_STORAGE_KEYS.ushr).toBe("calc-history-ushr");
  });

  it("formats date & time in PKT format", () => {
    const formatted = formatPKTDateTime(new Date("2026-11-18T08:33:00Z")); // 13:33 PKT
    expect(formatted).toMatch(/18 Nov 2026/);
    expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
  });

  it("saves a valid calculation and retrieves it immediately", () => {
    const entries = saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryRaw: "150000", salaryNum: 150000, frequency: "monthly", taxYear: "2026-27" },
    });

    expect(entries).toHaveLength(1);
    expect(entries[0].summary).toBe("Salary Rs 150,000/mo");
    expect(entries[0].resultSummary).toBe("Tax Rs 6,000");

    const fromStorage = getHistory("salary");
    expect(fromStorage).toHaveLength(1);
    expect(fromStorage[0].inputs).toEqual({
      salaryRaw: "150000",
      salaryNum: 150000,
      frequency: "monthly",
      taxYear: "2026-27",
    });
  });

  it("maintains separate history per calculator without bleed-through", () => {
    saveHistoryEntry("salary", {
      summary: "Salary Rs 150,000/mo",
      resultSummary: "Tax Rs 6,000",
      inputs: { salaryNum: 150000 },
    });

    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });

    const salaryHistory = getHistory("salary");
    const zakatHistory = getHistory("zakat");

    expect(salaryHistory).toHaveLength(1);
    expect(salaryHistory[0].summary).toContain("Salary");

    expect(zakatHistory).toHaveLength(1);
    expect(zakatHistory[0].summary).toContain("Zakat");
  });

  it("enforces maximum 10 entries and drops the 11th oldest entry", () => {
    for (let i = 1; i <= 12; i++) {
      saveHistoryEntry("salary", {
        summary: `Salary Rs ${(i * 50000).toLocaleString()}/mo`,
        resultSummary: `Tax Rs ${i * 1000}`,
        inputs: { salaryNum: i * 50000 },
      });
    }

    const list = getHistory("salary");
    expect(list).toHaveLength(MAX_HISTORY_ENTRIES); // 10
    // Most recent is top
    expect(list[0].summary).toBe("Salary Rs 600,000/mo"); // 12 * 50k
    expect(list[9].summary).toBe("Salary Rs 150,000/mo"); // 3 * 50k (1 and 2 were pruned)
  });

  it("prevents duplicates: re-calculating exact same inputs updates timestamp and moves to top", () => {
    // 1st entry
    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });

    // 2nd entry with different amount
    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 800,000",
      resultSummary: "Zakat Rs 20,000",
      inputs: { cashNum: 800000 },
    });

    expect(getHistory("zakat")).toHaveLength(2);
    expect(getHistory("zakat")[0].summary).toBe("Zakat — Cash Rs 800,000");

    // Repeat 500,000 calculation
    saveHistoryEntry("zakat", {
      summary: "Zakat — Cash Rs 500,000",
      resultSummary: "Zakat Rs 12,500",
      inputs: { cashNum: 500000 },
    });

    const refreshed = getHistory("zakat");
    // Still 2 entries! No duplicate!
    expect(refreshed).toHaveLength(2);
    // 500,000 is now at index 0 (top)
    expect(refreshed[0].summary).toBe("Zakat — Cash Rs 500,000");
    expect(refreshed[1].summary).toBe("Zakat — Cash Rs 800,000");
  });

  it("deletes a single entry by id", () => {
    const list = saveHistoryEntry("property", {
      summary: "Property Buy — Rs 10,000,000 (Filer)",
      resultSummary: "Tax Rs 125,000",
      inputs: { propertyValNum: 10000000 },
    });

    expect(list).toHaveLength(1);
    const idToDelete = list[0].id;

    const remaining = deleteHistoryEntry("property", idToDelete);
    expect(remaining).toHaveLength(0);
    expect(getHistory("property")).toHaveLength(0);
  });

  it("clears entire history for a calculator", () => {
    saveHistoryEntry("gst", {
      summary: "GST 18% — Rs 100,000",
      resultSummary: "Tax Rs 18,000",
      inputs: { amountNum: 100000 },
    });

    expect(getHistory("gst")).toHaveLength(1);

    clearHistory("gst");
    expect(getHistory("gst")).toHaveLength(0);
  });
});
