"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
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
            ? "Tax will be added on top of this base price"
            : mode === "remove"
            ? "Tax will be subtracted to reveal the pre-tax base price"
            : "Base price and total invoice will be calculated from this tax"
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
        <div className="p-4 bg-surface rounded-lg border border-appBorder space-y-2">
          <label htmlFor="custom-rate-input" className="block text-sm font-semibold text-appText">
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
              className="w-full px-3 py-2.5 min-h-[44px] rounded-md border border-appBorder text-base bg-white"
              placeholder="e.g. 5, 13, 16, 17"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-appText-muted font-bold">
              %
            </div>
          </div>
          <p className="text-xs text-appText-muted">
            Common Pakistani rates: 0% (exempt foods/medicines), 5% (concessional), 13% (Sindh SRB services), 16% (Punjab PRA services).
          </p>
        </div>
      )}

      {/* Provincial Services Scope Warning */}
      <div className="p-3 bg-surface border border-appBorder rounded-lg text-xs text-appText-muted space-y-1">
        <span className="font-semibold text-appText block">Services Tax Notice:</span>
        <p>{gstRates.provincialNotice}</p>
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
      emptyPrompt="Enter an amount to see base, tax & total"
      footnote="Calculations apply standard mathematical rounding in integer paisa under the Sales Tax Act 1990."
    />
  );

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

  const romanUrduSummary = result ? (
    <div className="bg-surface p-3.5 rounded-lg border border-appBorder">
      <span className="font-semibold text-primary block text-xs uppercase mb-1">
        Roman Urdu Khulasa:
      </span>
      <p className="text-xs sm:text-sm text-appText">
        Asal base price <strong>{formatRupees(result.baseAmount)}</strong> par {result.ratePercentage} GST tax{" "}
        <strong>{formatRupees(result.gstAmount)}</strong> banta hai. Kul invoice bill{" "}
        <strong>{formatRupees(result.totalAmount)}</strong> ada karna hoga.
      </p>
    </div>
  ) : null;

  return (
    <CalculatorShell
      content={content}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      breakdownTable={breakdownSection}
      romanUrduSummary={romanUrduSummary}
    />
  );
}
