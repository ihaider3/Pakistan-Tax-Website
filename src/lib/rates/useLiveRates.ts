"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ratesData from "@/data/rates.json";
import {
  LiveRatesData,
  getCachedRates,
  fetchLiveRates,
} from "./liveRates";

export type RatesStatus = "live" | "cached" | "fallback";

export function useLiveRates() {
  // Initialize synchronously from bundled rates.json so SSR & first paint match with 0ms block and zero hydration mismatch
  const [rates, setRates] = useState<LiveRatesData>(() => ({
    ...ratesData,
    isFallback: true,
  }));
  const [status, setStatus] = useState<RatesStatus>("fallback");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const fetchedRef = useRef<boolean>(false);
  const ratesRef = useRef<LiveRatesData>(rates);
  ratesRef.current = rates;

  const fetchRates = useCallback(async (force: boolean = false) => {
    if (typeof window === "undefined") return;

    // Check cache freshness unless forced
    if (!force) {
      const cached = getCachedRates();
      if (cached && cached.isFresh) {
        setRates(cached.data);
        setStatus("live");
        setIsFetching(false);
        return;
      }
    }

    setIsFetching(true);
    try {
      const result = await fetchLiveRates(ratesRef.current);
      if (result && result.data) {
        setRates(result.data);
        setStatus("live");
      } else {
        // Fallback to whatever cached or bundled rates are available
        const cached = getCachedRates();
        if (cached) {
          setRates(cached.data);
          setStatus("cached");
        } else {
          setStatus("fallback");
        }
      }
    } catch {
      setStatus("fallback");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Apply any cached rates immediately, then background-refresh if stale or missing
    const cached = getCachedRates();
    if (cached) {
      setRates(cached.data);
      setStatus(cached.isFresh ? "live" : "cached");
    }
    if (!cached || !cached.isFresh) {
      fetchRates(false);
    } else {
      setIsFetching(false);
    }
  }, [fetchRates]);

  return {
    rates,
    status,
    isFetching,
    refetch: () => fetchRates(true),
  };
}

