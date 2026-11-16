"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import ExplanationBox from "@/components/ExplanationBox";
import { calculatorPages } from "@/content/pages";
import { calculateGst, GstCalculationResult, GstMode } from "@/lib/calc/gst";
import { formatRupees } from "@/lib/calc/money";
import { gstRates } from "@/lib/rates/gst";

type RatePreset = "18" | "custom";

export default function GstCalculatorPage() {
  const content = calculatorPages.gst;

  const [amountRaw, setAmountRaw] = useState<string>("100000"); // Preloaded with Blueprint worked example
  const [amountNum, setAmountNum] = useState<number>(100000);
  const [isValid, setIsValid] = useState<boolean>(true);

  const [mode, setMode] = useState<GstMode>("add");
  const [ratePreset, setRatePreset] = useState<RatePreset>("18");
  const [customRateRaw, setCustomRateRaw] = useState<string>("5");
  const [customRateNum, setCustomRateNum] = useState<number>(5);

  const modeOptions: ToggleOption<GstMode>[] = [
    { value: "add", label: "Add GST", badge: "Exclusive" },
    { value: "remove", label: "Remove GST", badge: "Inclusive" },
    { value: "amount_only", label: "GST Amount Only", badge: "Tax Value" },
  ];

  const rateOptions: ToggleOption<RatePreset>[] = [
    { value: "18", label: "18% Standard (Goods)", badge: "Federal" },
    { value: "custom", label: "Custom Rate %", badge: "Services/Special" },
  ];

  const effectiveRate = ratePreset === "18" ? 18 : customRateNum;

  let result: GstCalculationResult | null = null;
  if (isValid && amountNum > 0) {
    result = calculateGst(amountNum, mode, effectiveRate);
  }

  // Secondary Results for ResultPanel
  const secondaryResults: SecondaryResult[] = result
    ? [
        {
          label: "Net Base Amount (Exclusive)",
          value: formatRupees(result.baseAmount),
          subtext: "Value of goods/services without tax",
          highlight: mode === "remove",
        },
        {
          label: `Sales Tax (${result.ratePercentage})`,
          value: formatRupees(result.gstAmount),
          subtext: "General Sales Tax payable to FBR",
          highlight: mode === "amount_only",
        },
        {
          label: "Total Gross Amount (Inclusive)",
          value: formatRupees(result.totalAmount),
          subtext: "Full invoice cost with tax",
          highlight: mode === "add",
        },
        {
          label: "Calculation Mode",
          value:
            mode === "add"
              ? "Base + 18% GST"
              : mode === "remove"
              ? "Extract Tax from Total"
              : "Tax Amount to Base",
          subtext: `Applied rate: ${result.ratePercentage}`,
        },
      ]
    : [];

  const copySummaryText = result
    ? `Base Price: ${formatRupees(result.baseAmount)} | GST (${result.ratePercentage}): ${formatRupees(result.gstAmount)} | Total Invoice: ${formatRupees(result.totalAmount)} — Pakistan Finance Calculators`
    : "";

  // Breakdown Table
  const breakdownColumns: BreakdownColumn[] = [
    { key: "item", header: "Invoice Component" },
    { key: "percentage", header: "Share %", align: "center" },
    { key: "amount", header: "Amount in PKR", align: "right" },
  ];

  const breakdownRows: BreakdownRow[] = result
    ? [
        {
          id: "base",
          isHighlighted: mode === "remove",
          cells: {
            item: (
              <div>
                <span className="font-semibold text-primary block">Net Base Amount</span>
                <span className="text-xs text-appText-muted">Product / service value before tax</span>
              </div>
            ),
            percentage: (
              <span className="font-medium text-xs text-appText">
                {result.totalAmount > 0
                  ? `${((result.baseAmount / result.totalAmount) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            ),
            amount: formatRupees(result.baseAmount),
          },
        },
        {
          id: "gst",
          isHighlighted: true,
          cells: {
            item: (
              <div>
                <span className="font-semibold text-accent block">
                  Sales Tax ({result.ratePercentage})
                </span>
                <span className="text-xs text-appText-muted">FBR General Sales Tax</span>
              </div>
            ),
            percentage: (
              <span className="font-bold text-xs text-accent">
                {result.totalAmount > 0
                  ? `${((result.gstAmount / result.totalAmount) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            ),
            amount: formatRupees(result.gstAmount),
          },
        },
      ]
    : [];

  const calculatorInputs = (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <Toggle<GstMode>
        label="Calculation Mode"
        options={modeOptions}
        value={mode}
        onChange={(m) => setMode(m)}
      />

      {/* Amount Input */}
      <MoneyInput
        id="gst-amount-input"
        label={
          mode === "add"
            ? "Base Net Amount (before tax)"
            : mode === "remove"
            ? "Total Gross Invoice Amount (with tax)"
            : "GST Tax Amount Collected / Paid"
        }
        value={amountRaw}
        onChange={(r, v, valid) => {
          setAmountRaw(r);
          setAmountNum(v);
          setIsValid(valid);
        }}
        placeholder={mode === "add" ? "e.g. 100,000" : "e.g. 118,000"}
        hint={
          mode === "add"
            ? "Tax will be added on top of this base price — Asal qeemat par tax shamil hoga"
            : mode === "remove"
            ? "Tax will be subtracted to reveal the pre-tax base price — Kul bill se tax alag kiya jayega"
            : "Base price and total invoice will be calculated from this tax — Tax se asal qeemat aur kul bill maloom hoga"
        }
        unitLabel="PKR"
        required
      />

      {/* Rate Preset Toggle */}
      <Toggle<RatePreset>
        label="Sales Tax Rate"
        options={rateOptions}
        value={ratePreset}
        onChange={(r) => setRatePreset(r)}
      />

      {/* Custom Rate Input */}
      {ratePreset === "custom" && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-surface via-slate-50 to-surface rounded-xl border border-slate-200/90 space-y-2.5 shadow-2xs">
          <label htmlFor="custom-rate-input" className="block text-sm font-bold text-primary">
            Enter Custom GST Rate (%)
          </label>
          <div className="relative">
            <input
              id="custom-rate-input"
              type="number"
              min="0"
              max="100"
              step="any"
              value={customRateRaw}
              onChange={(e) => {
                setCustomRateRaw(e.target.value);
                setCustomRateNum(parseFloat(e.target.value) || 0);
              }}
              className="w-full pl-4 pr-10 py-3 min-h-[48px] rounded-xl border border-slate-200 text-base font-bold bg-white focus:outline-hidden focus:ring-2 focus:ring-accent"
              placeholder="e.g. 5, 13, 16, 17"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-accent font-black text-sm">
              %
            </div>
          </div>
          <p className="text-xs text-appText-muted font-medium">
            Common Pakistani rates: 0% (exempt foods/medicines), 5% (concessional), 13% (Sindh SRB services), 16% (Punjab PRA services).
          </p>
        </div>
      )}

      {/* Provincial Services Scope Warning */}
      <div className="p-4 bg-gradient-to-r from-surface via-slate-50 to-surface border border-slate-200/90 rounded-xl text-xs text-appText-muted space-y-1 shadow-2xs">
        <span className="font-bold text-primary block text-xs uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Services Tax Notice:
        </span>
        <p className="leading-relaxed">{gstRates.provincialNotice}</p>
      </div>
    </div>
  );

  const resultPanel = (
    <ResultPanel
      title={`GST Result (${effectiveRate}%)`}
      mainLabel={
        mode === "add"
          ? "Total Payable (Invoice Amount)"
          : mode === "remove"
          ? "Extracted Base Price (Net)"
          : "Total Invoice Amount"
      }
      mainValue={
        result
          ? formatRupees(
              mode === "add"
                ? result.totalAmount
                : mode === "remove"
                ? result.baseAmount
                : result.totalAmount
            )
          : "Rs 0"
      }
      mainSubtext={
        result
          ? `Includes ${formatRupees(result.gstAmount)} Sales Tax @ ${result.ratePercentage}`
          : undefined
      }
      statusBadge={
        result
          ? {
              text: `Sales Tax: ${formatRupees(result.gstAmount)}`,
              variant: "warning",
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={!result || amountNum <= 0}
      emptyPrompt="Enter an amount above to see your result — Upar raqam likhein, result foran nazar aayega."
      footnote="Calculations apply standard mathematical rounding in integer paisa under the Sales Tax Act 1990."
    />
  );

  const explanationBox = result ? (
    <ExplanationBox
      type="tax"
      englishText={
        mode === "add"
          ? `You entered Rs ${formatRupees(result.baseAmount, { prefix: false })} in Add mode at ${result.ratePercentage}. GST is Rs ${formatRupees(result.baseAmount, { prefix: false })} × ${result.ratePercentage} = Rs ${formatRupees(result.gstAmount, { prefix: false })}. Total = Rs ${formatRupees(result.baseAmount, { prefix: false })} + Rs ${formatRupees(result.gstAmount, { prefix: false })} = Rs ${formatRupees(result.totalAmount, { prefix: false })}.`
          : mode === "remove"
          ? `You entered Rs ${formatRupees(result.totalAmount, { prefix: false })} in Remove mode at ${result.ratePercentage}. Base price is Rs ${formatRupees(result.totalAmount, { prefix: false })} ÷ ${(1 + effectiveRate / 100).toFixed(2).replace(/\.?0+$/, "")} = Rs ${formatRupees(result.baseAmount, { prefix: false })}. GST inside it is Rs ${formatRupees(result.totalAmount, { prefix: false })} − Rs ${formatRupees(result.baseAmount, { prefix: false })} = Rs ${formatRupees(result.gstAmount, { prefix: false })}.`
          : `You entered Rs ${formatRupees(result.gstAmount, { prefix: false })} in GST Amount mode at ${result.ratePercentage}. Base price is Rs ${formatRupees(result.baseAmount, { prefix: false })}. Total = Rs ${formatRupees(result.baseAmount, { prefix: false })} + Rs ${formatRupees(result.gstAmount, { prefix: false })} = Rs ${formatRupees(result.totalAmount, { prefix: false })}.`
      }
      urduText={
        mode === "add" ? (
          <>
            آپ نے <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.baseAmount, { prefix: false })}</span> درج کیا (Add موڈ، <span dir="ltr" className="inline-block font-sans font-semibold">{result.ratePercentage}</span>)۔ GST <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.baseAmount, { prefix: false })} × {result.ratePercentage} = روپے {formatRupees(result.gstAmount, { prefix: false })}</span> بنتا ہے۔ کل بل <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalAmount, { prefix: false })}</span> ہوگا۔
          </>
        ) : mode === "remove" ? (
          <>
            آپ نے <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalAmount, { prefix: false })}</span> درج کیا (Remove موڈ، <span dir="ltr" className="inline-block font-sans font-semibold">{result.ratePercentage}</span>)۔ اصل قیمت (بغیر ٹیکس) <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.baseAmount, { prefix: false })}</span> ہے اور GST <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalAmount, { prefix: false })} − روپے {formatRupees(result.baseAmount, { prefix: false })} = روپے {formatRupees(result.gstAmount, { prefix: false })}</span> ہے۔ کل بل <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalAmount, { prefix: false })}</span> تھا۔
          </>
        ) : (
          <>
            آپ نے <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.gstAmount, { prefix: false })}</span> درج کیا (GST Amount موڈ، <span dir="ltr" className="inline-block font-sans font-semibold">{result.ratePercentage}</span>)۔ اصل قیمت <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.baseAmount, { prefix: false })}</span> اور کل بل <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalAmount, { prefix: false })}</span> ہوگا۔
          </>
        )
      }
      urduTextPlain={
        mode === "add"
          ? `آپ نے روپے ${formatRupees(result.baseAmount, { prefix: false })} درج کیا (Add موڈ، ${result.ratePercentage})۔ GST روپے ${formatRupees(result.baseAmount, { prefix: false })} × ${result.ratePercentage} = روپے ${formatRupees(result.gstAmount, { prefix: false })} بنتا ہے۔ کل بل روپے ${formatRupees(result.totalAmount, { prefix: false })} ہوگا۔`
          : mode === "remove"
          ? `آپ نے روپے ${formatRupees(result.totalAmount, { prefix: false })} درج کیا (Remove موڈ، ${result.ratePercentage})۔ اصل قیمت (بغیر ٹیکس) روپے ${formatRupees(result.baseAmount, { prefix: false })} ہے اور GST روپے ${formatRupees(result.totalAmount, { prefix: false })} − روپے ${formatRupees(result.baseAmount, { prefix: false })} = روپے ${formatRupees(result.gstAmount, { prefix: false })} ہے۔ کل بل روپے ${formatRupees(result.totalAmount, { prefix: false })} تھا۔`
          : `آپ نے روپے ${formatRupees(result.gstAmount, { prefix: false })} درج کیا (GST Amount موڈ، ${result.ratePercentage})۔ اصل قیمت روپے ${formatRupees(result.baseAmount, { prefix: false })} اور کل بل روپے ${formatRupees(result.totalAmount, { prefix: false })} ہوگا۔`
      }
      referenceContent={
        <>
          <p>
            <strong>Law:</strong> Sales Tax Act 1990, standard rate 18% on goods. Services rates are provincial and vary — confirm with PRA / SRB / KPRA / BRA for your service.
          </p>
          <div dir="rtl" lang="ur" className="font-urdu text-right pt-1 text-slate-800">
            <strong className="text-primary font-bold ml-1.5 font-sans">قانون:</strong> سیلز ٹیکس ایکٹ 1990، اشیا پر معیاری ریٹ 18 فیصد۔ خدمات پر ریٹ صوبائی ہے اور مختلف ہوتا ہے — اپنی سروس کے لیے PRA / SRB / KPRA / BRA سے تصدیق کریں۔
          </div>
        </>
      }
    />
  ) : null;

  const breakdownSection = result ? (
    <BreakdownTable
      title={`Invoice Breakdown @ ${result.ratePercentage} GST`}
      subtitle="Complete breakdown showing pre-tax base, GST levy, and gross payable."
      columns={breakdownColumns}
      rows={breakdownRows}
      totalLabel="Total Payable Invoice Amount"
      totalValue={formatRupees(result.totalAmount)}
    />
  ) : null;

  return (
    <CalculatorShell
      content={content}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      explanationBox={explanationBox}
      breakdownTable={breakdownSection}
    />
  );
}

