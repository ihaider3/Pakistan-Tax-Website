import { describe, it, expect } from "vitest";
import { buildWhatsAppText } from "./index";
import {
  buildSalarySummaryData,
  buildZakatSummaryData,
  buildPropertySummaryData,
  buildGstSummaryData,
  buildFitranaSummaryData,
  buildUshrSummaryData,
} from "./builders";
import { calculateSalaryTax } from "@/lib/calc/salary";
import { calculateZakat } from "@/lib/calc/zakat";
import { calculatePropertyTax } from "@/lib/calc/property";
import { calculateGst } from "@/lib/calc/gst";
import { calculateFitrana } from "@/lib/calc/fitrana";
import { calculateUshr } from "@/lib/calc/ushr";
import { siteDomain } from "@/config/site";
import ratesData from "@/data/rates.json";

describe("Summary and Copy System Regression Tests (§7)", () => {
  const goldRate = ratesData.goldPerTolaPKR;
  const silverRate = ratesData.silverPerTolaPKR;

  it("Test 1: Zakat — assets 500,000, deductions 50,000 matches Part C worked example exactly", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 50000,
    });

    const data = buildZakatSummaryData({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 50000,
      result: res,
      language: "en",
    });

    const text = buildWhatsAppText(data, "en");

    expect(data.finalValue).toBe("Rs 11,250");
    expect(text).toContain("*ZAKAT CALCULATION SUMMARY*");
    expect(text).toContain("*Your Financial Details*\nTotal Assets: Rs 500,000\nEligible Deductions: Rs 50,000\nNet Zakatable Wealth: Rs 450,000");
    expect(text).toContain("*Calculation Breakdown*\nApplicable Zakat Rate: 2.5%\n\nCalculation:\nRs 450,000 × 2.5% = Rs 11,250");
    expect(text).toContain("*FINAL ZAKAT AMOUNT*\n\n*Rs 11,250*");
    expect(text).toContain("*Calculation Explanation:*\nYour Zakat has been calculated based on your entered assets, eligible deductions and selected calculation method, subject to the applicable Nisab conditions.");
    expect(text).toContain(`*Website:* ${siteDomain}`);
  });

  it("Test 2: Zakat — cash 500,000 only → final Rs 12,500; nisab line shows live silver rate", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });

    const data = buildZakatSummaryData({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      result: res,
      language: "en",
    });

    expect(data.finalValue).toBe("Rs 12,500");
    const nisabKv = data.keyValues.find((k) => k.label.includes("Nisab"));
    expect(nisabKv).toBeDefined();
    expect(nisabKv?.label).toContain(`Rs ${silverRate.toFixed(2)}/tola`);
  });

  it("Test 3: Salary — 150,000/month, TY2027 → monthly tax Rs 6,000, take-home Rs 144,000, annual tax Rs 72,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    const data = buildSalarySummaryData({
      salaryRaw: "150000",
      salaryNum: 150000,
      period: "monthly",
      taxYear: "2026-27",
      result: res,
      language: "en",
    });

    const text = buildWhatsAppText(data, "en");
    expect(res.monthlyTax).toBe(6000);
    expect(res.monthlyTakeHome).toBe(144000);
    expect(res.annualTax).toBe(72000);
    expect(data.finalValue).toBe("Rs 6,000");
    expect(text).toContain("Slab 3");
    expect(text).toContain("Annual Tax: Rs 72,000");
    expect(text).toContain("Monthly Take-Home: Rs 144,000");
  });

  it("Test 4: Salary — 99,999.99/month → summary says 'Rs 99,999.99' (not 'Rs 100,000')", () => {
    const res = calculateSalaryTax(99999.99, "monthly", "2026-27");
    const data = buildSalarySummaryData({
      salaryRaw: "99999.99",
      salaryNum: 99999.99,
      period: "monthly",
      taxYear: "2026-27",
      result: res,
      language: "en",
    });

    const text = buildWhatsAppText(data, "en");
    expect(text).toContain("Rs 99,999.99");
    expect(text).not.toContain("Rs 100,000");
  });

  it("Test 5: Property — Buy Filer 10M → 125,000, outlay 10,125,000; Sell Filer 10M → 275,000, net 9,725,000", () => {
    const buyRes = calculatePropertyTax(10000000, "buy", "filer");
    const buyData = buildPropertySummaryData({
      propertyValueRaw: "10000000",
      propertyValueNum: 10000000,
      transactionType: "buy",
      filerStatus: "filer",
      result: buyRes,
      language: "en",
    });
    expect(buyData.finalValue).toBe("Rs 125,000");
    expect(buyData.keyValues.find((k) => k.label === "Total Outlay")?.value).toBe("Rs 10,125,000");

    const sellRes = calculatePropertyTax(10000000, "sell", "filer");
    const sellData = buildPropertySummaryData({
      propertyValueRaw: "10000000",
      propertyValueNum: 10000000,
      transactionType: "sell",
      filerStatus: "filer",
      result: sellRes,
      language: "en",
    });
    expect(sellData.finalValue).toBe("Rs 275,000");
    expect(sellData.keyValues.find((k) => k.label === "Net Proceeds")?.value).toBe("Rs 9,725,000");
  });

  it("Test 6: GST — Add 18% on 100,000 → 18,000 / 118,000; Custom 5% on 100,000 → 5,000 / 105,000 with 5% rate line", () => {
    const add18 = calculateGst(100000, "add", 18);
    const data18 = buildGstSummaryData({
      amountRaw: "100000",
      amountNum: 100000,
      mode: "add",
      ratePercent: 18,
      result: add18,
      language: "en",
    });
    expect(data18.finalValue).toBe("Rs 118,000");
    expect(data18.keyValues.find((k) => k.label === "GST Amount")?.value).toBe("Rs 18,000");

    const custom5 = calculateGst(100000, "add", 5);
    const data5 = buildGstSummaryData({
      amountRaw: "100000",
      amountNum: 100000,
      mode: "add",
      ratePercent: 5,
      result: custom5,
      language: "en",
    });
    const text5 = buildWhatsAppText(data5, "en");
    expect(data5.finalValue).toBe("Rs 105,000");
    expect(data5.rateValue).toBe("5%");
    expect(text5).toContain("Applicable GST Rate: 5%");
    expect(text5).not.toContain("18%");
  });

  it("Test 7: GST — 99,999.99 → total Rs 117,999.99", () => {
    const res = calculateGst(99999.99, "add", 18);
    const data = buildGstSummaryData({
      amountRaw: "99999.99",
      amountNum: 99999.99,
      mode: "add",
      ratePercent: 18,
      result: res,
      language: "en",
    });
    expect(data.finalValue).toBe("Rs 117,999.99");
  });

  it("Test 8: Fitrana — 5 wheat (Mufti Muneeb) → Rs 1,500; 3 raisins → Rs 21,600 with CII alternate Rs 11,400; switch to CII → Rs 11,400", () => {
    const fit1 = calculateFitrana(5, "wheat", "muneeb");
    const data1 = buildFitranaSummaryData({
      members: 5,
      stapleName: "Wheat (Gandum)",
      sourceName: "Mufti Muneeb-ur-Rehman",
      sourceKey: "muneeb",
      result: fit1,
      language: "en",
    });
    expect(data1.finalValue).toBe("Rs 1,500");

    const fit3 = calculateFitrana(3, "raisins", "muneeb");
    const data3 = buildFitranaSummaryData({
      members: 3,
      stapleName: "Raisins (Kishmish)",
      sourceName: "Mufti Muneeb-ur-Rehman",
      sourceKey: "muneeb",
      result: fit3,
      language: "en",
    });
    const text3 = buildWhatsAppText(data3, "en");
    expect(data3.finalValue).toBe("Rs 21,600");
    expect(data3.keyValues.find((k) => k.label === "CII alternate")?.value).toBe("Rs 11,400");
    expect(text3).toContain("CII alternate: Rs 11,400");
    expect(data3.rateValue).toContain("Rs 7,200 (Raisins, Mufti Muneeb)");

    const fitCii = calculateFitrana(3, "raisins", "cii");
    const dataCii = buildFitranaSummaryData({
      members: 3,
      stapleName: "Raisins (Kishmish)",
      sourceName: "Council of Islamic Ideology (CII)",
      sourceKey: "cii",
      result: fitCii,
      language: "en",
    });
    expect(dataCii.finalValue).toBe("Rs 11,400");
  });

  it("Test 9: Language — with Roman Urdu selected, Zakat headings are Aapki Tafseelat / Calculation Ki Tafseel / Calculation Ki Wazahat", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 50000,
    });

    const data = buildZakatSummaryData({
      cashInHand: 500000,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 50000,
      result: res,
      language: "roman",
    });

    const text = buildWhatsAppText(data, "roman");
    expect(text).toContain("*Aapki Tafseelat*");
    expect(text).toContain("*Calculation Ki Tafseel*");
    expect(text).toContain("*Calculation Ki Wazahat:*");
    expect(text).toContain("*Tayyar kiya gaya:*");
    expect(text).toContain("*FINAL ZAKAT AMOUNT*");
    expect(text).toContain("Rs 11,250");
  });

  it("Test 10: Domain — summary ends with configured domain", () => {
    const res = calculateSalaryTax(100000, "monthly", "2026-27");
    const data = buildSalarySummaryData({
      salaryRaw: "100000",
      salaryNum: 100000,
      period: "monthly",
      taxYear: "2026-27",
      result: res,
      language: "en",
    });

    const text = buildWhatsAppText(data, "en");
    expect(text).toContain(`*Website:* ${siteDomain}`);
    expect(data.domain).toBe(siteDomain);
  });

  it("Test 11: Zakat with all zeros produces 'FINAL ZAKAT AMOUNT: Rs 0 (Below Nisab)'", () => {
    const res = calculateZakat({
      cashInHand: 0,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });

    const data = buildZakatSummaryData({
      cashInHand: 0,
      bankSavings: 0,
      goldQuantity: 0,
      goldUnit: "tola",
      goldPurity: "24k",
      goldRatePerTola: goldRate,
      silverQuantity: 0,
      silverUnit: "tola",
      silverRatePerTola: silverRate,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      result: res,
      language: "en",
    });

    expect(data.finalValue).toBe("Rs 0 (Below Nisab)");
    const text = buildWhatsAppText(data, "en");
    expect(text).toContain("*FINAL ZAKAT AMOUNT*\n\n*Rs 0 (Below Nisab)*");
  });

  it("Test 12: Ushr — Wheat 1,000 kg, Rs 130/kg, Rain (10%) generates correct WhatsApp text and dual result", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });

    const data = buildUshrSummaryData({
      cropName: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
      result: res,
      language: "en",
    });

    const text = buildWhatsAppText(data, "en");
    expect(data.finalValue).toBe("100 kg wheat (Rs 13,000)");
    expect(text).toContain("*USHR CALCULATION SUMMARY*");
    expect(text).toContain("Crop: Wheat");
    expect(text).toContain("Total Harvest: 1,000 kg");
    expect(text).toContain("Market Price: Rs 130 / kg");
    expect(text).toContain("100 kg wheat (Rs 13,000)");
    expect(text).toContain("10%");
    expect(text).toContain(`*Website:* ${siteDomain}`);
  });

  it("Test 13: Ushr — Roman Urdu headings and strings follow Part 5", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });

    const data = buildUshrSummaryData({
      cropName: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
      result: res,
      language: "roman",
    });

    const text = buildWhatsAppText(data, "roman");
    expect(text).toContain("*USHR CALCULATION SUMMARY*");
    expect(text).toContain("*Aapki Tafseelat*");
    expect(text).toContain("*Calculation Ki Tafseel*");
    expect(text).toContain("*Calculation Ki Wazahat:*");
    expect(text).toContain("*Tayyar kiya gaya:*");
    expect(text).toContain("FINAL USHR");
    expect(text).toContain("Rs 13,000");
  });

  it("Test 14: Domain config — custom NEXT_PUBLIC_SITE_URL is respected across summaries", () => {
    const res = calculateSalaryTax(100000, "monthly", "2026-27");
    const data = buildSalarySummaryData({
      salaryRaw: "100000",
      salaryNum: 100000,
      period: "monthly",
      taxYear: "2026-27",
      result: res,
      language: "en",
    });

    data.domain = "my-custom-pak-tax.pk";
    const text = buildWhatsAppText(data, "en");
    expect(text).toContain("*Website:* my-custom-pak-tax.pk");
  });
});
