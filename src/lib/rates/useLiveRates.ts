"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  LiveRatesData,
  getInitialRates,
  getCachedRates,
  fetchLiveRates,
} from "./liveRates";

export type RatesStatus = "live" | "cached" | "fallback";

export function useLiveRates() {
  // 1. Synchronous initial state from fresh cache or fallback bundled rates.json
  const [rates, setRates] = useState<LiveRatesData>(() => getInitialRates().data);
  const [status, setStatus] = useState<RatesStatus>(() => getInitialRates().status);
  const [isFetching, setIsFetching] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const cached = getCachedRates();
    return !cached || !cached.isFresh;
  });
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

    // Check if initial cache is fresh; if not, fetch in background without blocking
    const cached = getCachedRates();
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

