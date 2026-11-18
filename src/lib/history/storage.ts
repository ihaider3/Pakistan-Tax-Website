import {
  CalculatorId,
  HistoryEntry,
  HISTORY_STORAGE_KEYS,
  MAX_HISTORY_ENTRIES,
} from "./types";

/**
 * Format a Date to PKT (Asia/Karachi, UTC+5) as e.g. "18 Nov 2026, 01:33 PM"
 */
export function formatPKTDateTime(date: Date = new Date()): string {
  try {
    const formatted = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

    // Ensure AM/PM is uppercase: "18 Nov 2026, 01:33 PM"
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
  } catch {
    // Fallback if Intl timeZone fails in certain environments
    const pad = (n: number) => n.toString().padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = date.getDate();
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${d} ${m} ${y}, ${pad(hours)}:${minutes} ${ampm}`;
  }
}

/**
 * Compare two inputs objects to detect duplicates.
 */
function areInputsEqual(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * Get all history entries for a specific calculator.
 */
export function getHistory<TInputs = Record<string, unknown>>(
  calculatorId: CalculatorId
): HistoryEntry<TInputs>[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  const key = HISTORY_STORAGE_KEYS[calculatorId];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Save an entry to history.
 * - Max 10 entries.
 * - Most recent on top.
 * - Duplicate prevention: if identical inputs exist, update timestamp/result and bring to top.
 */
export function saveHistoryEntry<TInputs = Record<string, unknown>>(
  calculatorId: CalculatorId,
  data: {
    summary: string;
    resultSummary: string;
    inputs: TInputs;
  }
): HistoryEntry<TInputs>[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  const key = HISTORY_STORAGE_KEYS[calculatorId];
  const now = new Date();
  const timestamp = now.getTime();
  const formattedDate = formatPKTDateTime(now);

  const existing = getHistory<TInputs>(calculatorId);

  // Check for duplicate inputs
  const duplicateIndex = existing.findIndex((e) => areInputsEqual(e.inputs, data.inputs));

  let updated: HistoryEntry<TInputs>[];

  if (duplicateIndex >= 0) {
    // Found existing entry with identical inputs:
    // Update its timestamp, formattedDate, summary, resultSummary and move to index 0
    const matched = existing[duplicateIndex];
    const refreshed: HistoryEntry<TInputs> = {
      ...matched,
      timestamp,
      formattedDate,
      summary: data.summary,
      resultSummary: data.resultSummary,
      inputs: data.inputs,
    };

    const remaining = existing.filter((_, idx) => idx !== duplicateIndex);
    updated = [refreshed, ...remaining].slice(0, MAX_HISTORY_ENTRIES);
  } else {
    // New entry
    const newEntry: HistoryEntry<TInputs> = {
      id: `calc-${calculatorId}-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
      calculatorId,
      timestamp,
      formattedDate,
      summary: data.summary,
      resultSummary: data.resultSummary,
      inputs: data.inputs,
    };

    updated = [newEntry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("calc_history_updated", {
        detail: { calculatorId },
      })
    );
  } catch {
    // Gracefully handle storage quota errors
  }

  return updated;
}

/**
 * Delete a single history entry by ID.
 */
export function deleteHistoryEntry<TInputs = Record<string, unknown>>(
  calculatorId: CalculatorId,
  entryId: string
): HistoryEntry<TInputs>[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }

  const key = HISTORY_STORAGE_KEYS[calculatorId];
  const existing = getHistory<TInputs>(calculatorId);
  const updated = existing.filter((e) => e.id !== entryId);

  try {
    window.localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("calc_history_updated", {
        detail: { calculatorId },
      })
    );
  } catch {
    // ignore
  }

  return updated;
}

/**
 * Clear all history for a specific calculator.
 */
export function clearHistory(calculatorId: CalculatorId): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const key = HISTORY_STORAGE_KEYS[calculatorId];
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent("calc_history_updated", {
        detail: { calculatorId },
      })
    );
  } catch {
    // ignore
  }
}
