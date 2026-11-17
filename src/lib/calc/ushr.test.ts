import { describe, it, expect } from "vitest";
import { calculateUshr } from "./ushr";

describe("Ushr Calculator Logic (§8 Regression Tests)", () => {
  it("Test 1: Wheat, 1,000 kg, Rs 130/kg, Rain (10%) → total Rs 130,000, Ushr 100 kg, Rs 13,000", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });

    expect(res.ratePercentage).toBe("10%");
    expect(res.totalHarvestValue).toBe(130000);
    expect(res.ushrKind).toBe(100);
    expect(res.ushrKindUnit).toBe("kg");
    expect(res.ushrCashValue).toBe(13000);
    expect(res.ushrKindDisplay).toBe("100 kg wheat");
  });

  it("Test 2: Wheat, 1,000 kg, Rs 130/kg, Tube-well (5%) → Ushr 50 kg, Rs 6,500", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "tubewell",
    });

    expect(res.ratePercentage).toBe("5%");
    expect(res.totalHarvestValue).toBe(130000);
    expect(res.ushrKind).toBe(50);
    expect(res.ushrKindUnit).toBe("kg");
    expect(res.ushrCashValue).toBe(6500);
    expect(res.ushrKindDisplay).toBe("50 kg wheat");
  });

  it("Test 3: Rice, 2,000 kg, Rs 200/kg, Mixed (7.5%) → Ushr 150 kg, Rs 30,000", () => {
    const res = calculateUshr({
      crop: "rice",
      quantity: 2000,
      unit: "kg",
      pricePerUnit: 200,
      irrigation: "mixed",
    });

    expect(res.ratePercentage).toBe("7.5%");
    expect(res.totalHarvestValue).toBe(400000);
    expect(res.ushrKind).toBe(150);
    expect(res.ushrKindUnit).toBe("kg");
    expect(res.ushrCashValue).toBe(30000);
    expect(res.ushrKindDisplay).toBe("150 kg rice");
  });

  it("Test 4: Maund input: Wheat, 25 maund, Rs 5,200/maund, Rain → Ushr 2.5 maund (100 kg), Rs 13,000 and conversion '25 maund = 1,000 kg'", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 25,
      unit: "maund",
      pricePerUnit: 5200,
      irrigation: "rain",
    });

    expect(res.totalHarvestValue).toBe(130000);
    expect(res.ushrKind).toBe(2.5);
    expect(res.ushrKindUnit).toBe("maund");
    expect(res.ushrKindSecondary).toBe(100);
    expect(res.ushrCashValue).toBe(13000);
    expect(res.convertedQuantityDisplay).toBe("25 maund = 1,000 kg");
    expect(res.ushrKindDisplay).toBe("2.5 maund (100 kg) wheat");
  });

  it("Test 5: Small harvest: Vegetables, 100 kg, Rs 100/kg, Rain → Ushr 10 kg, Rs 1,000; Hanafi due on any quantity; majority: 100 kg is below 653 kg", () => {
    const res = calculateUshr({
      crop: "vegetables",
      quantity: 100,
      unit: "kg",
      pricePerUnit: 100,
      irrigation: "rain",
    });

    expect(res.ushrKind).toBe(10);
    expect(res.ushrCashValue).toBe(1000);
    expect(res.hanafiNisabNote).toContain("Hanafi position: Ushr is due on any quantity — no minimum nisab.");
    expect(res.majorityNisabStatus).toBe("below");
    expect(res.majorityNisabNoteEn).toContain("100 kg is below this nisab");
  });

  it("Test 6: Large harvest: Wheat, 1,000 kg → majority nisab says at or above 653 kg", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });

    expect(res.majorityNisabStatus).toBe("at_or_above");
    expect(res.majorityNisabNoteEn).toContain("1,000 kg is at or above this nisab");
  });

  it("Test 7: Boundary check: exactly 653 kg is at or above nisab", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 653,
      unit: "kg",
      pricePerUnit: 100,
      irrigation: "rain",
    });

    expect(res.majorityNisabStatus).toBe("at_or_above");
    expect(res.majorityNisabNoteEn).toContain("653 kg is at or above this nisab");
  });

  it("Test 8: Zero inputs return safe defaults", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 0,
      unit: "kg",
      pricePerUnit: 0,
      irrigation: "rain",
    });

    expect(res.ushrKind).toBe(0);
    expect(res.ushrCashValue).toBe(0);
    expect(res.totalHarvestValue).toBe(0);
  });
});

