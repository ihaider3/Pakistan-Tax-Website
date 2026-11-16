import { describe, it, expect } from "vitest";
import { calculateGst } from "./gst";

describe("GST Calculator (18% & Custom Rate)", () => {
  // Test 1: Base 100,000 add 18% -> GST 18,000, Total 118,000
  it("computes Base 100,000 add 18% -> GST 18,000, Total 118,000", () => {
    const res = calculateGst(100000, "add", 18);
    expect(res.baseAmount).toBe(100000);
    expect(res.gstAmount).toBe(18000);
    expect(res.totalAmount).toBe(118000);
  });

  // Test 2: Total 118,000 remove 18% -> Base 100,000, GST 18,000
  it("computes Total 118,000 remove 18% -> Base 100,000, GST 18,000", () => {
    const res = calculateGst(118000, "remove", 18);
    expect(res.baseAmount).toBe(100000);
    expect(res.gstAmount).toBe(18000);
    expect(res.totalAmount).toBe(118000);
  });

  // Test 3: Base 50,000 custom 5% -> GST 2,500, Total 52,500
  it("computes Base 50,000 custom 5% -> GST 2,500, Total 52,500", () => {
    const res = calculateGst(50000, "add", 5);
    expect(res.baseAmount).toBe(50000);
    expect(res.gstAmount).toBe(2500);
    expect(res.totalAmount).toBe(52500);
  });

  // Test 4: Base 50,000 add 18% -> GST 9,000, Total 59,000
  it("computes Base 50,000 add 18% -> GST 9,000, Total 59,000", () => {
    const res = calculateGst(50000, "add", 18);
    expect(res.baseAmount).toBe(50000);
    expect(res.gstAmount).toBe(9000);
    expect(res.totalAmount).toBe(59000);
  });

  // Test 5: Total 59,000 remove 18% -> Base 50,000, GST 9,000
  it("computes Total 59,000 remove 18% -> Base 50,000, GST 9,000", () => {
    const res = calculateGst(59000, "remove", 18);
    expect(res.baseAmount).toBe(50000);
    expect(res.gstAmount).toBe(9000);
    expect(res.totalAmount).toBe(59000);
  });

  // Test 6: Custom 0% (exempt goods)
  it("computes custom 0% (zero-rated goods)", () => {
    const res = calculateGst(25000, "add", 0);
    expect(res.baseAmount).toBe(25000);
    expect(res.gstAmount).toBe(0);
    expect(res.totalAmount).toBe(25000);
  });

  // Test 7: Custom 17% (prior standard rate)
  it("computes custom 17% rate accurately", () => {
    const res = calculateGst(100000, "add", 17);
    expect(res.gstAmount).toBe(17000);
    expect(res.totalAmount).toBe(117000);
  });

  // Test 8: Total remove with custom 17%
  it("removes custom 17% GST accurately", () => {
    const res = calculateGst(117000, "remove", 17);
    expect(res.baseAmount).toBe(100000);
    expect(res.gstAmount).toBe(17000);
  });

  // Test 9: GST amount only mode at 18%
  it("reconstructs base and total from GST amount only (18,000 @ 18%)", () => {
    const res = calculateGst(18000, "amount_only", 18);
    expect(res.baseAmount).toBe(100000);
    expect(res.gstAmount).toBe(18000);
    expect(res.totalAmount).toBe(118000);
  });

  // Test 10: GST amount only mode at 5%
  it("reconstructs base and total from GST amount only (2,500 @ 5%)", () => {
    const res = calculateGst(2500, "amount_only", 5);
    expect(res.baseAmount).toBe(50000);
    expect(res.gstAmount).toBe(2500);
    expect(res.totalAmount).toBe(52500);
  });

  // Test 11: Base 1,000 add 18%
  it("computes Base 1,000 add 18% -> GST 180, Total 1,180", () => {
    const res = calculateGst(1000, "add", 18);
    expect(res.gstAmount).toBe(180);
    expect(res.totalAmount).toBe(1180);
  });

  // Test 12: Base 10,000,000 add 18%
  it("computes large commercial base 10,000,000 @ 18%", () => {
    const res = calculateGst(10000000, "add", 18);
    expect(res.gstAmount).toBe(1800000);
    expect(res.totalAmount).toBe(11800000);
  });

  // Test 13: Paisa rounding test on remove mode
  it("rounds remove mode calculations to integer paisa without floating residue", () => {
    const res = calculateGst(1000, "remove", 18);
    // 1000 / 1.18 = 847.4576... -> 847.46
    expect(res.baseAmount).toBe(847.46);
    expect(res.gstAmount).toBe(152.54);
    expect(res.totalAmount).toBe(1000);
  });

  // Test 14: Rate percentage string formatting
  it("formats ratePercentage string properly", () => {
    expect(calculateGst(100, "add", 18).ratePercentage).toBe("18%");
    expect(calculateGst(100, "add", 13).ratePercentage).toBe("13%");
  });

  // Test 15: Remove with 0% rate
  it("handles remove mode with 0% rate safely", () => {
    const res = calculateGst(5000, "remove", 0);
    expect(res.baseAmount).toBe(5000);
    expect(res.gstAmount).toBe(0);
    expect(res.totalAmount).toBe(5000);
  });

  // Test 16: Custom 16% (common provincial services rate)
  it("calculates custom 16% rate", () => {
    const res = calculateGst(50000, "add", 16);
    expect(res.gstAmount).toBe(8000);
    expect(res.totalAmount).toBe(58000);
  });

  // Test 17: Custom 13% (Sindh SRB services rate)
  it("calculates custom 13% rate", () => {
    const res = calculateGst(100000, "add", 13);
    expect(res.gstAmount).toBe(13000);
    expect(res.totalAmount).toBe(113000);
  });

  // Test 18: Custom 15% (Balochistan BRA rate)
  it("calculates custom 15% rate", () => {
    const res = calculateGst(200000, "add", 15);
    expect(res.gstAmount).toBe(30000);
    expect(res.totalAmount).toBe(230000);
  });

  // Test 19: All three outputs always present in add mode
  it("ensures Base, GST and Total are populated in add mode", () => {
    const res = calculateGst(300, "add", 18);
    expect(res.baseAmount).toBe(300);
    expect(res.gstAmount).toBe(54);
    expect(res.totalAmount).toBe(354);
  });

  // Test 20: Amount only with 0% rate edge case
  it("handles amount_only mode with 0% without crashing", () => {
    const res = calculateGst(100, "amount_only", 0);
    expect(res.baseAmount).toBe(0);
    expect(res.gstAmount).toBe(100);
  });
});

