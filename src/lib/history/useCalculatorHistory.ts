"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CalculatorId, HistoryEntry } from "./types";
import {
  getHistory,
  saveHistoryEntry,
  deleteHistoryEntry,
  clearHistory,
} from "./storage";
import { trackMetaViewContent } from "@/lib/analytics/metaPixel";

const CALCULATOR_TITLES: Record<CalculatorId, string> = {
  salary: "Salary Tax Calculator",
  zakat: "Zakat Calculator",
  property: "Property Tax Calculator",
  gst: "GST Calculator",
  fitrana: "Fitrana Calculator",
  ushr: "Ushr Calculator",
};

export function useCalculatorHistory<TInputs = Record<string, unknown>>(
  calculatorId: CalculatorId
) {
  const [history, setHistory] = useState<HistoryEntry<TInputs>[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state from storage
  const refreshHistory = useCallback(() => {
    setHistory(getHistory<TInputs>(calculatorId));
  }, [calculatorId]);

  // Initial load & event listeners
  useEffect(() => {
    refreshHistory();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ calculatorId: CalculatorId }>;
      if (!customEvent.detail || customEvent.detail.calculatorId === calculatorId) {
        refreshHistory();
      }
    };

    window.addEventListener("calc_history_updated", handleUpdate);
    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener("calc_history_updated", handleUpdate);
      window.removeEventListener("storage", refreshHistory);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [calculatorId, refreshHistory]);

  /**
   * Save a valid calculation into history (debounced for live typing).
   */
  const recordCalculation = useCallback(
    (params: {
      summary: string;
      resultSummary: string;
      inputs: TInputs;
      immediate?: boolean;
    }) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const save = () => {
        const updated = saveHistoryEntry<TInputs>(calculatorId, {
          summary: params.summary,
          resultSummary: params.resultSummary,
          inputs: params.inputs,
        });
        setHistory([...updated]);
        const calcTitle = CALCULATOR_TITLES[calculatorId];
        if (calcTitle) {
          trackMetaViewContent(calcTitle);
        }
      };

      if (params.immediate) {
        save();
      } else {
        debounceTimerRef.current = setTimeout(save, 150);
      }
    },
    [calculatorId]
  );

  /**
   * Delete single entry
   */
  const removeEntry = useCallback(
    (id: string) => {
      const updated = deleteHistoryEntry<TInputs>(calculatorId, id);
      setHistory(updated);
    },
    [calculatorId]
  );

  /**
   * Clear all entries for this calculator
   */
  const clearAll = useCallback(() => {
    clearHistory(calculatorId);
    setHistory([]);
  }, [calculatorId]);

  return {
    history,
    recordCalculation,
    removeEntry,
    clearAll,
    refreshHistory,
  };
}

