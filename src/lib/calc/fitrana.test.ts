import { describe, it, expect } from "vitest";
import { calculateFitrana } from "./fitrana";

describe("Fitrana Calculator (2026 - Mufti Muneeb & CII Rates)", () => {
  // Test 1: 5 persons wheat Mufti Rs 300 -> 1,500
  it("computes 5 persons wheat Mufti Rs 300 -> 1,500", () => {
    const res = calculateFitrana(5, "wheat", "muneeb");
    expect(res.perPersonRate).toBe(300);
    expect(res.totalFitrana).toBe(1500);
    expect(res.alternateSourcePerPerson).toBe(300);
    expect(res.alternateSourceTotal).toBe(1500);
  });

  // Test 2: 4 persons barley Mufti Rs 1,160 -> 4,640
  it("computes 4 persons barley Mufti Rs 1,160 -> 4,640", () => {
    const res = calculateFitrana(4, "barley", "muneeb");
    expect(res.perPersonRate).toBe(1160);
    expect(res.totalFitrana).toBe(4640);
    expect(res.alternateSourcePerPerson).toBe(1100);
    expect(res.alternateSourceTotal).toBe(4400);
  });

  // Test 3: 6 persons dates Mufti Rs 2,800 -> 16,800
  it("computes 6 persons dates Mufti Rs 2,800 -> 16,800", () => {
    const res = calculateFitrana(6, "dates", "muneeb");
    expect(res.perPersonRate).toBe(2800);
    expect(res.totalFitrana).toBe(16800);
  });

  // Test 4: 5 persons wheat CII Rs 300 -> 1,500
  it("computes 5 persons wheat CII Rs 300 -> 1,500", () => {
    const res = calculateFitrana(5, "wheat", "cii");
    expect(res.perPersonRate).toBe(300);
    expect(res.totalFitrana).toBe(1500);
  });

  // Test 5: 5 persons barley CII Rs 1,100 -> 5,500
  it("computes 5 persons barley CII Rs 1,100 -> 5,500", () => {
    const res = calculateFitrana(5, "barley", "cii");
    expect(res.perPersonRate).toBe(1100);
    expect(res.totalFitrana).toBe(5500);
    expect(res.alternateSourcePerPerson).toBe(1160);
    expect(res.alternateSourceTotal).toBe(5800);
  });

  // Test 6: 0 persons -> error
  it("throws error on 0 persons", () => {
    expect(() => calculateFitrana(0, "wheat", "muneeb")).toThrow(
      "Number of family members must be at least 1"
    );
  });

  // Test 7: Negative persons -> error
  it("throws error on negative persons", () => {
    expect(() => calculateFitrana(-3, "wheat", "muneeb")).toThrow(
      "Number of family members must be at least 1"
    );
  });

  // Test 8: Non-integer persons -> error
  it("throws error on decimal persons", () => {
    expect(() => calculateFitrana(2.5, "wheat", "muneeb")).toThrow(
      "Number of family members must be at least 1"
    );
  });

  // Test 9: Over 50 persons -> error
  it("throws error when members exceed maximum 50", () => {
    expect(() => calculateFitrana(51, "wheat", "muneeb")).toThrow(
      "Maximum family members allowed is 50"
    );
  });

  // Test 10: 1 person wheat Mufti Rs 300
  it("computes 1 person minimum wheat -> 300", () => {
    const res = calculateFitrana(1, "wheat", "muneeb");
    expect(res.totalFitrana).toBe(300);
  });

  // Test 11: 3 persons raisins Mufti Rs 7,200 -> 21,600
  it("computes 3 persons raisins Mufti Rs 7,200 -> 21,600", () => {
    const res = calculateFitrana(3, "raisins", "muneeb");
    expect(res.perPersonRate).toBe(7200);
    expect(res.totalFitrana).toBe(21600);
  });

  // Test 12: 5 persons raisins CII Rs 3,800 -> 19,000
  it("computes 5 persons raisins CII Rs 3,800 -> 19,000", () => {
    const res = calculateFitrana(5, "raisins", "cii");
    expect(res.perPersonRate).toBe(3800);
    expect(res.totalFitrana).toBe(19000);
  });

  // Test 13: 5 persons dates CII Rs 1,600 -> 8,000
  it("computes 5 persons dates CII Rs 1,600 -> 8,000", () => {
    const res = calculateFitrana(5, "dates", "cii");
    expect(res.perPersonRate).toBe(1600);
    expect(res.totalFitrana).toBe(8000);
  });

  // Test 14: Maximum allowed 50 persons calculation
  it("calculates upper limit boundary 50 persons successfully", () => {
    const res = calculateFitrana(50, "wheat", "muneeb");
    expect(res.totalFitrana).toBe(15000);
  });

  // Test 15: Wheat consensus check between Mufti and CII
  it("verifies consensus wheat rate of Rs 300 in both scholarly sources", () => {
    const muneeb = calculateFitrana(1, "wheat", "muneeb");
    const cii = calculateFitrana(1, "wheat", "cii");
    expect(muneeb.perPersonRate).toBe(300);
    expect(cii.perPersonRate).toBe(300);
  });

  // Test 16: Dates discrepancy check between Mufti and CII
  it("accurately contrasts dates rates between Mufti (2,800) and CII (1,600)", () => {
    const muneeb = calculateFitrana(1, "dates", "muneeb");
    const cii = calculateFitrana(1, "dates", "cii");
    expect(muneeb.perPersonRate).toBe(2800);
    expect(cii.perPersonRate).toBe(1600);
  });

  // Test 17: Raisins discrepancy check between Mufti and CII
  it("accurately contrasts raisins rates between Mufti (7,200) and CII (3,800)", () => {
    const muneeb = calculateFitrana(1, "raisins", "muneeb");
    const cii = calculateFitrana(1, "raisins", "cii");
    expect(muneeb.perPersonRate).toBe(7200);
    expect(cii.perPersonRate).toBe(3800);
  });

  // Test 18: Barley discrepancy check between Mufti and CII
  it("accurately contrasts barley rates between Mufti (1,160) and CII (1,100)", () => {
    const muneeb = calculateFitrana(1, "barley", "muneeb");
    const cii = calculateFitrana(1, "barley", "cii");
    expect(muneeb.perPersonRate).toBe(1160);
    expect(cii.perPersonRate).toBe(1100);
  });

  // Test 19: Source metadata verification in result
  it("returns proper source metadata and announcement date", () => {
    const res = calculateFitrana(2, "wheat", "muneeb");
    expect(res.sourceName).toBe("Mufti Muneeb-ur-Rehman");
    expect(res.sourceDate).toBe("21 Feb 2026");
  });

  // Test 20: Staple weight description check
  it("returns weight description for wheat (2 kg)", () => {
    const res = calculateFitrana(2, "wheat", "muneeb");
    expect(res.weightDescription).toBe("2 kg");
  });
});

