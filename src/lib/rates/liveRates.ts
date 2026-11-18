import ratesData from "@/data/rates.json";

export interface LiveRatesData {
  goldPerTolaPKR: number;
  silverPerTolaPKR: number;
  goldPerGramPKR: number;
  silverPerGramPKR: number;
  nisabGoldPKR: number;
  nisabSilverPKR: number;
  usdPkr: number;
  xauUsd: number;
  xagUsd: number;
  source: string;
  lastUpdated: string; // ISO format
  lastUpdatedLabel: string; // e.g. "18 Nov 2026, 16:15 PKT"
  lastChecked: string;
  lastCheckedLabel: string;
  isLive?: boolean;
  isCached?: boolean;
  isFallback?: boolean;
}

export const TROY_OUNCE_TO_GRAMS = 31.1034768;
export const TOLA_TO_TROY_OUNCES = 0.374878; // 1 tola = 11.6638g = 0.374878 troy oz

export const GOLD_API_URL = "https://api.gold-api.com/price/XAU";
export const SILVER_API_URL = "https://api.gold-api.com/price/XAG";
export const CURRENCY_API_URL = "https://open.er-api.com/v6/latest/USD";

export const RATES_CACHE_KEY = "live-rates";
export const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

export interface CachePayload {
  data: LiveRatesData;
  cachedAt: number; // timestamp ms
}

/**
 * Format a Date in Pakistan Standard Time (PKT, UTC+5).
 */
export function formatPKTLabel(date: Date = new Date()): { iso: string; label: string } {
  try {
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
    const pktDate = new Date(utcMs + 5 * 3600000);

    const pad = (n: number) => String(n).padStart(2, "0");
    const year = pktDate.getFullYear();
    const month = pad(pktDate.getMonth() + 1);
    const day = pktDate.getDate();
    const hours = pad(pktDate.getHours());
    const minutes = pad(pktDate.getMinutes());
    const seconds = pad(pktDate.getSeconds());

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[pktDate.getMonth()];

    const iso = `${year}-${month}-${pad(day)}T${hours}:${minutes}:${seconds}+05:00`;
    const label = `${day} ${monthName} ${year}, ${hours}:${minutes} PKT`;

    return { iso, label };
  } catch {
    const fallback = new Date().toISOString();
    return { iso: fallback, label: fallback };
  }
}

/**
 * Validate fetched rate figures against safety boundaries and 10% daily jump limit.
 */
export function validateRateValues(
  xauUsd: number,
  xagUsd: number,
  usdPkr: number,
  goldPerTolaPKR: number,
  silverPerTolaPKR: number,
  previousRates?: LiveRatesData | null
): { valid: boolean; error?: string } {
  if (typeof xauUsd !== "number" || isNaN(xauUsd) || xauUsd < 2000 || xauUsd > 6000) {
    return { valid: false, error: `XAU/USD ($${xauUsd}) outside safe range [2000, 6000]` };
  }
  if (typeof xagUsd !== "number" || isNaN(xagUsd) || xagUsd < 15 || xagUsd > 100) {
    return { valid: false, error: `XAG/USD ($${xagUsd}) outside safe range [15, 100]` };
  }
  if (typeof usdPkr !== "number" || isNaN(usdPkr) || usdPkr < 200 || usdPkr > 350) {
    return { valid: false, error: `USD/PKR (Rs ${usdPkr}) outside safe range [200, 350]` };
  }
  if (goldPerTolaPKR < 250000 || goldPerTolaPKR > 600000) {
    return { valid: false, error: `Gold per tola (Rs ${goldPerTolaPKR}) outside safe range [250000, 600000]` };
  }
  if (silverPerTolaPKR < 2500 || silverPerTolaPKR > 10000) {
    return { valid: false, error: `Silver per tola (Rs ${silverPerTolaPKR}) outside safe range [2500, 10000]` };
  }

  // 10% jump guard against previous known good rates
  if (previousRates && previousRates.goldPerTolaPKR > 0) {
    const jump = Math.abs(goldPerTolaPKR - previousRates.goldPerTolaPKR) / previousRates.goldPerTolaPKR;
    if (jump > 0.10) {
      return {
        valid: false,
        error: `Gold rate jumped ${(jump * 100).toFixed(1)}% vs previous (Rs ${previousRates.goldPerTolaPKR}), exceeding 10% guard`,
      };
    }
  }

  return { valid: true };
}

/**
 * Read cached rates from localStorage if present.
 */
export function getCachedRates(): { data: LiveRatesData; cachedAt: number; isFresh: boolean } | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    const parsed: CachePayload = JSON.parse(raw);
    if (!parsed || !parsed.data || typeof parsed.data.goldPerTolaPKR !== "number") return null;

    const ageMs = Date.now() - (parsed.cachedAt || 0);
    const isFresh = ageMs < CACHE_TTL_MS;

    return {
      data: {
        ...parsed.data,
        isCached: true,
        isLive: isFresh,
      },
      cachedAt: parsed.cachedAt,
      isFresh,
    };
  } catch {
    return null;
  }
}

/**
 * Save rates to localStorage cache.
 */
export function saveCachedRates(data: LiveRatesData): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const payload: CachePayload = {
      data,
      cachedAt: Date.now(),
    };
    window.localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // quota exceeded, silently ignore
  }
}

/**
 * Get the initial fallback rates:
 * Priority: Fresh Cache -> Any Cache -> Bundled rates.json
 */
export function getInitialRates(): { data: LiveRatesData; status: "live" | "cached" | "fallback" } {
  const cached = getCachedRates();
  if (cached) {
    return {
      data: cached.data,
      status: cached.isFresh ? "live" : "cached",
    };
  }

  return {
    data: {
      ...ratesData,
      isFallback: true,
    },
    status: "fallback",
  };
}

/**
 * Fetch a JSON URL with timeout and max 1 retry.
 */
async function fetchEndpointWithRetry(url: string, timeoutMs: number = 9000): Promise<any> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      lastError = err;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError || new Error(`Failed to fetch ${url}`);
}

/**
 * Fetch live rates in browser client-side.
 * Resolves with fresh LiveRatesData or null if network/validation failed.
 */
export async function fetchLiveRates(
  previousRates?: LiveRatesData | null
): Promise<{ data: LiveRatesData; status: "live" } | null> {
  try {
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetchEndpointWithRetry(GOLD_API_URL, 9000),
      fetchEndpointWithRetry(SILVER_API_URL, 9000),
      fetchEndpointWithRetry(CURRENCY_API_URL, 9000),
    ]);

    const xauUsd = Number(Number(goldRes?.price).toFixed(2));
    const xagUsd = Number(Number(silverRes?.price).toFixed(2));
    const usdPkr = Number(Number(fxRes?.rates?.PKR).toFixed(2));

    const goldPerTolaPKR = Number((xauUsd * usdPkr * TOLA_TO_TROY_OUNCES).toFixed(2));
    const silverPerTolaPKR = Number((xagUsd * usdPkr * TOLA_TO_TROY_OUNCES).toFixed(2));
    const goldPerGramPKR = Number(((xauUsd * usdPkr) / TROY_OUNCE_TO_GRAMS).toFixed(2));
    const silverPerGramPKR = Number(((xagUsd * usdPkr) / TROY_OUNCE_TO_GRAMS).toFixed(2));

    const nisabGoldPKR = Math.round(7.5 * goldPerTolaPKR);
    const nisabSilverPKR = Math.round(52.5 * silverPerTolaPKR);

    // Validation
    const validation = validateRateValues(
      xauUsd,
      xagUsd,
      usdPkr,
      goldPerTolaPKR,
      silverPerTolaPKR,
      previousRates
    );

    if (!validation.valid) {
      console.warn("[LiveRates] Validation rejected live rates:", validation.error);
      return null;
    }

    const { iso, label } = formatPKTLabel(new Date());

    const liveData: LiveRatesData = {
      goldPerTolaPKR,
      silverPerTolaPKR,
      goldPerGramPKR,
      silverPerGramPKR,
      nisabGoldPKR,
      nisabSilverPKR,
      usdPkr,
      xauUsd,
      xagUsd,
      source: "International spot price (gold-api.com) + USD/PKR (open.er-api.com). NOT the Sarafa official rate.",
      lastUpdated: iso,
      lastUpdatedLabel: label,
      lastChecked: iso,
      lastCheckedLabel: label,
      isLive: true,
      isCached: false,
      isFallback: false,
    };

    // Save to cache
    saveCachedRates(liveData);

    return { data: liveData, status: "live" };
  } catch (err: any) {
    console.warn("[LiveRates] Failed to fetch live rates:", err?.message || err);
    return null;
  }
}

