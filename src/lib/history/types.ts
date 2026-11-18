export type CalculatorId = "salary" | "zakat" | "property" | "gst" | "fitrana" | "ushr";

export interface HistoryEntry<TInputs = Record<string, unknown>> {
  id: string;
  calculatorId: CalculatorId;
  timestamp: number; // epoch ms
  formattedDate: string; // e.g. "18 Nov 2026, 01:33 PM"
  summary: string; // 1-line inputs summary
  resultSummary: string; // final result summary
  inputs: TInputs; // typed inputs object for live re-calculation
}

export const HISTORY_STORAGE_KEYS: Record<CalculatorId, string> = {
  salary: "calc-history-salary",
  zakat: "calc-history-zakat",
  property: "calc-history-property",
  gst: "calc-history-gst",
  fitrana: "calc-history-fitrana",
  ushr: "calc-history-ushr",
};

export const MAX_HISTORY_ENTRIES = 10;
