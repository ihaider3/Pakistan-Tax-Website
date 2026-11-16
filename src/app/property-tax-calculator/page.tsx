"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import { calculatorPages } from "@/content/pages";
import {
  calculatePropertyTax,
  PropertyTaxResult,
  PropertyTransactionType,
  FilerStatus,
} from "@/lib/calc/property";
import { formatRupees } from "@/lib/calc/money";

export default function PropertyTaxCalculatorPage() {
  const content = calculatorPages.property;

  const [propertyValRaw, setPropertyValRaw] = useState<string>("10000000"); // Preloaded with Blueprint worked example (1 Crore)
  const [propertyValNum, setPropertyValNum] = useState<number>(10000000);
  const [isValid, setIsValid] = useState<boolean>(true);

  const [transaction, setTransaction] = useState<PropertyTransactionType>("buy");
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("filer");

  const transactionOptions: ToggleOption<PropertyTransactionType>[] = [
    { value: "buy", label: "Buy Property (Section 236K)", badge: "Buyer" },
    { value: "sell", label: "Sell Property (Section 236C)", badge: "Seller" },
  ];

  const filerOptions: ToggleOption<FilerStatus>[] = [
    { value: "filer", label: "Active Taxpayer (Filer)", badge: "ATL" },
    { value: "non-filer", label: "Non-Filer", badge: "Non-ATL" },
  ];

  let result: PropertyTaxResult | null = null;
  if (isValid && propertyValNum > 0) {
    result = calculatePropertyTax(propertyValNum, transaction, filerStatus);
  }

  const secondaryResults: SecondaryResult[] = result
    ? [
        {
          label: "Advance Tax Rate Applied",
          value: result.ratePercentage,
          subtext: `FBR Section ${result.sectionCode} Rate`,
        },
        {
          label: result.transaction === "buy" ? "Total Buyer Outlay" : "Net Seller Realization",
          value: formatRupees(result.transaction === "buy" ? result.totalForBuyer : result.netForSeller),
          subtext: result.transaction === "buy" ? "Property price + Advance tax" : "Property price − Advance tax",
          highlight: true,
        },
        {
          label: "Filer vs Non-Filer Difference",
          value: formatRupees(result.savingsVsNonFiler),
          subtext: result.comparisonText,
        },
        {
          label: "Opposite Status Tax",
          value: formatRupees(result.oppositeFilerTax),
          subtext: result.filerStatus === "filer" ? "If non-filer" : "If active filer",
        },
      ]
    : [];

  const copySummaryText = result
    ? `Property Value: ${formatRupees(result.propertyValue)} | Advance Tax (${result.sectionCode} ${result.filerStatus}): ${formatRupees(result.taxAmount)} (${result.ratePercentage}) | Filer Savings: ${formatRupees(result.savingsVsNonFiler)} — Pakistan Finance Calculators`
    : "";

  // Breakdown Table: Side-by-Side Comparison
  const breakdownColumns: BreakdownColumn[] = [
    { key: "metric", header: "Comparison Factor" },
    { key: "filer", header: "Active Filer (ATL)", align: "right" },
    { key: "nonFiler", header: "Non-Filer", align: "right" },
    { key: "diff", header: "Filer Advantage (Savings)", align: "right" },
  ];

  let breakdownRows: BreakdownRow[] = [];
  if (result) {
    const filerCalc = calculatePropertyTax(result.propertyValue, result.transaction, "filer");
    const nonFilerCalc = calculatePropertyTax(result.propertyValue, result.transaction, "non-filer");

    breakdownRows = [
      {
        id: "rate",
        cells: {
          metric: <span className="font-semibold text-primary">Withholding Rate Applied</span>,
          filer: <span className="font-semibold text-emerald-700">{filerCalc.ratePercentage}</span>,
          nonFiler: <span className="font-semibold text-amber-800">{nonFilerCalc.ratePercentage}</span>,
          diff: (
            <span className="font-bold text-accent">
              {(nonFilerCalc.rate * 100 - filerCalc.rate * 100).toFixed(2)}% Lower
            </span>
          ),
        },
      },
      {
        id: "tax",
        isHighlighted: true,
        cells: {
          metric: (
            <div>
              <span className="font-semibold text-primary block">FBR Advance Income Tax</span>
              <span className="text-xs text-appText-muted">Section {result.sectionCode}</span>
            </div>
          ),
          filer: formatRupees(filerCalc.taxAmount, { prefix: true }),
          nonFiler: formatRupees(nonFilerCalc.taxAmount, { prefix: true }),
          diff: (
            <span className="font-bold text-accent">
              Save {formatRupees(nonFilerCalc.taxAmount - filerCalc.taxAmount)}
            </span>
          ),
        },
      },
      {
        id: "total",
        cells: {
          metric: (
            <span className="font-semibold text-primary">
              {result.transaction === "buy" ? "Total Cost to Buyer" : "Net Proceeds to Seller"}
            </span>
          ),
          filer: formatRupees(
            result.transaction === "buy" ? filerCalc.totalForBuyer : filerCalc.netForSeller,
            { prefix: true }
          ),
          nonFiler: formatRupees(
            result.transaction === "buy" ? nonFilerCalc.totalForBuyer : nonFilerCalc.netForSeller,
            { prefix: true }
          ),
          diff: (
            <span className="font-semibold text-accent">
              {formatRupees(Math.abs(nonFilerCalc.taxAmount - filerCalc.taxAmount))} benefit
            </span>
          ),
        },
      },
    ];
  }

  const calculatorInputs = (
    <div className="space-y-6">
      {/* Transaction Type Toggle */}
      <Toggle<PropertyTransactionType>
        label="Transaction Type"
        options={transactionOptions}
        value={transaction}
        onChange={(val) => setTransaction(val)}
      />

      {/* Property Value Input */}
      <MoneyInput
        id="property-value-input"
        label="FBR value / sale consideration (PKR)"
        value={propertyValRaw}
        onChange={(r, v, valid) => {
          setPropertyValRaw(r);
          setPropertyValNum(v);
          setIsValid(valid);
        }}
        placeholder="e.g. 10,000,000"
        hint="Enter the higher of actual sale price or official FBR notified valuation"
        unitLabel="PKR"
        required
      />

      {/* Filer Status Toggle */}
      <Toggle<FilerStatus>
        label="Tax Filer Status"
        options={filerOptions}
        value={filerStatus}
        onChange={(val) => setFilerStatus(val)}
      />

      {/* Provincial Notice Box */}
      <div className="p-3.5 bg-surface border border-appBorder rounded-lg text-xs text-appText-muted space-y-1">
        <span className="font-semibold text-appText block">
          Provincial Fees & Capital Gains Tax Note:
        </span>
        <p>
          Provincial stamp duty, registration fees, and Capital Value Tax (CVT) vary by province (Punjab, Sindh, KP, Balochistan) and are NOT included in this tool. Confirm local levies with your sub-registrar office. Capital Gains Tax (CGT) under Section 37 is also calculated separately.
        </p>
      </div>
    </div>
  );

  const resultPanel = (
    <ResultPanel
      title={`Property Advance Tax (${result?.sectionCode || "236"})`}
      mainLabel={`Section ${result?.sectionCode || "236"} Advance Tax`}
      mainValue={result ? formatRupees(result.taxAmount) : "Rs 0"}
      mainSubtext={
        result
          ? `${result.filerStatus === "filer" ? "Filer" : "Non-Filer"} Rate: ${result.ratePercentage} on ${formatRupees(result.propertyValue)}`
          : undefined
      }
      statusBadge={
        result
          ? {
              text: result.filerStatus === "filer" ? "Active Filer (1.25% - 2.75%)" : "Non-Filer (Higher Slab)",
              variant: result.filerStatus === "filer" ? "success" : "warning",
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={!result || propertyValNum <= 0}
      emptyPrompt="Enter property value to calculate advance tax"
      footnote="Finance Act 2026. Late-filer category was abolished in TY2027. Filers can adjust this advance tax in their annual return."
    />
  );

  const breakdownSection = result ? (
    <BreakdownTable
      title={`Section ${result.sectionCode} Comparison Table`}
      subtitle={`Side-by-side comparison for a property valued at ${formatRupees(result.propertyValue)}.`}
      columns={breakdownColumns}
      rows={breakdownRows}
      totalLabel="Filer Total Financial Benefit"
      totalValue={`Save ${formatRupees(result.savingsVsNonFiler)}`}
    />
  ) : null;

  const romanUrduSummary = result ? (
    <div className="bg-surface p-3.5 rounded-lg border border-appBorder">
      <span className="font-semibold text-primary block text-xs uppercase mb-1">
        Roman Urdu Khulasa:
      </span>
      <p className="text-xs sm:text-sm text-appText">
        {result.propertyValue.toLocaleString()} rupay ki property {result.transaction === "buy" ? "khareedne (236K)" : "bechne (236C)"} par {result.filerStatus === "filer" ? "Filer" : "Non-Filer"} hone ki hesiyat se aap par <strong>{formatRupees(result.taxAmount)}</strong> ({result.ratePercentage}) advance tax lagta hai. Filer hone ki wajah se aap non-filer ke muqablay mein <strong>{formatRupees(result.savingsVsNonFiler)}</strong> bacha rahay hain.
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
