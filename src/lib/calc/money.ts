/**
 * Money utilities for Pakistan Financial & Islamic Calculators.
 * Handles parsing, integer paisa rounding, formatting with thousand separators,
 * and input validation according to MVP specifications.
 */

export interface MoneyParseResult {
  value: number; // In rupees
  paisa: number; // Value in integer paisa (rupees * 100)
  isValid: boolean;
  isEmpty: boolean;
  error?: string;
  warning?: string;
}

/**
 * Parses user money input string.
 * Allows commas, removes spaces, checks for negative numbers, invalid characters,
 * and maximum limit Rs 999,999,999.
 */
export function parseMoneyInput(raw: string | number | undefined | null): MoneyParseResult {
  if (raw === undefined || raw === null) {
    return { value: 0, paisa: 0, isValid: false, isEmpty: true, error: "Enter an amount above to see your result — Upar raqam likhein, result foran nazar aayega." };
  }

  const str = String(raw).trim();
  if (str === "") {
    return { value: 0, paisa: 0, isValid: false, isEmpty: true, error: "Enter an amount above to see your result — Upar raqam likhein, result foran nazar aayega." };
  }

  // Check for negative numbers
  if (str.includes("-")) {
    return { value: 0, paisa: 0, isValid: false, isEmpty: false, error: "Please enter a positive number — Sirf positive number likhein." };
  }

  // Clean out commas and whitespace
  const cleaned = str.replace(/[, \s]/g, "");

  // Check if string is a valid positive number
  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return { value: 0, paisa: 0, isValid: false, isEmpty: false, error: "Please enter a positive number — Sirf positive number likhein." };
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) {
    return { value: 0, paisa: 0, isValid: false, isEmpty: false, error: "Please enter a positive number — Sirf positive number likhein." };
  }

  // Max input check Rs 999,999,999
  if (num > 999999999) {
    return {
      value: num,
      paisa: Math.round(num * 100),
      isValid: false,
      isEmpty: false,
      error: "Maximum amount is Rs 999,999,999",
    };
  }

  // Convert to integer paisa to avoid floating-point inaccuracies
  const paisa = Math.round(num * 100);
  const normalizedValue = paisa / 100;

  let warning: string | undefined = undefined;
  if (normalizedValue > 100000000) {
    warning = "Check with a tax professional — surcharge / other rules may apply.";
  }

  return {
    value: normalizedValue,
    paisa,
    isValid: true,
    isEmpty: false,
    warning,
  };
}

/**
 * Format number with thousand separators (e.g. Rs 144,000).
 * Main results are rounded to the nearest integer rupee.
 */
export function formatRupees(
  amount: number | null | undefined,
  options?: {
    prefix?: boolean;
    showPaisa?: boolean;
    showPaisaIfDecimal?: boolean;
  }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return options?.prefix === false ? "0" : "Rs 0";
  }

  const prefix = options?.prefix === false ? "" : "Rs ";
  const paisaVal = roundToPaisa(amount);

  if (options?.showPaisa || (options?.showPaisaIfDecimal && paisaVal % 1 !== 0)) {
    // Exact paisa formatted
    const parts = paisaVal.toFixed(2).split(".");
    const integerPart = Number(parts[0]).toLocaleString("en-US");
    return `${prefix}${integerPart}.${parts[1]}`;
  }

  // Display rupees rounded to nearest rupee
  const rounded = Math.round(amount);
  return `${prefix}${rounded.toLocaleString("en-US")}`;
}

/**
 * Format rate as percentage string, e.g. 0.0125 -> "1.25%", 0.18 -> "18%"
 */
export function formatPercentage(rate: number, maxDecimals: number = 2): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return "0%";
  }
  // Avoid IEEE 754 precision drift (e.g. 0.29 * 100 = 28.999999999999996)
  const percent = Number(Math.round(Number(rate * 100 + "e+4")) + "e-4");
  // If integer, don't show decimal points
  if (Number.isInteger(percent)) {
    return `${percent}%`;
  }
  // Otherwise up to maxDecimals decimal places, trimming trailing zeros
  return `${parseFloat(percent.toFixed(maxDecimals))}%`;
}

/**
 * Round rupees in integer paisa with floating point precision guard.
 */
export function roundToPaisa(amount: number): number {
  return Number(Math.round(Number(amount + "e+2")) + "e-2");
}
