import { describe, it, expect } from "vitest";
import { parseMoneyInput, formatRupees, formatPercentage, roundToPaisa } from "./money";

describe("Money Utilities", () => {
  it("formats integer amounts with thousand separators and Rs prefix", () => {
    expect(formatRupees(144000)).toBe("Rs 144,000");
    expect(formatRupees(0)).toBe("Rs 0");
    expect(formatRupees(1000000)).toBe("Rs 1,000,000");
  });

  it("rounds decimal rupees to nearest integer in main display", () => {
    expect(formatRupees(34666.67)).toBe("Rs 34,667");
    expect(formatRupees(265333.33)).toBe("Rs 265,333");
  });

  it("formats with exact paisa when requested", () => {
    expect(formatRupees(0.01, { showPaisa: true, prefix: true })).toBe("Rs 0.01");
    expect(formatRupees(1234.5, { showPaisa: true, prefix: true })).toBe("Rs 1,234.50");
  });

  it("parses strings with commas and whitespace", () => {
    const res = parseMoneyInput(" 1,500,000 ");
    expect(res.isValid).toBe(true);
    expect(res.value).toBe(1500000);
    expect(res.paisa).toBe(150000000);
  });

  it("handles empty or null inputs gracefully with prompt error", () => {
    expect(parseMoneyInput("").error).toBe("Enter an amount to see your result");
    expect(parseMoneyInput("   ").error).toBe("Enter an amount to see your result");
    expect(parseMoneyInput(undefined).error).toBe("Enter an amount to see your result");
  });

  it("rejects negative numbers with a friendly error", () => {
    const res = parseMoneyInput("-50000");
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Amount cannot be negative");
  });

  it("rejects non-numeric characters with inline error", () => {
    const res = parseMoneyInput("50000abc");
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Please enter a valid numeric amount");
  });

  it("enforces maximum limit Rs 999,999,999", () => {
    const res = parseMoneyInput("1000000000");
    expect(res.isValid).toBe(false);
    expect(res.error).toBe("Maximum amount is Rs 999,999,999");
  });

  it("gives warning when amount > Rs 100,000,000", () => {
    const res = parseMoneyInput("100000001");
    expect(res.isValid).toBe(true);
    expect(res.warning).toBe("Check with a tax professional — surcharge / other rules may apply.");
  });

  it("formats percentages correctly", () => {
    expect(formatPercentage(0.18)).toBe("18%");
    expect(formatPercentage(0.0125)).toBe("1.25%");
    expect(formatPercentage(0.025)).toBe("2.5%");
    expect(formatPercentage(0.145)).toBe("14.5%");
  });

  it("rounds to integer paisa without floating point drift", () => {
    expect(roundToPaisa(0.1 + 0.2)).toBe(0.3);
    expect(roundToPaisa(100.004)).toBe(100);
    expect(roundToPaisa(100.005)).toBe(100.01);
  });
});
