"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import ExplanationBox from "@/components/ExplanationBox";
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
        label="Property Value / Consideration (PKR) — FBR ki tay shuda ya actual qeemat"
        value={propertyValRaw}
        onChange={(r, v, valid) => {
          setPropertyValRaw(r);
          setPropertyValNum(v);
          setIsValid(valid);
        }}
        placeholder="e.g. 10,000,000"
        hint="Enter the higher of actual sale price or official FBR notified valuation — FBR rate ya asal qeemat"
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
      <div className="p-4 bg-gradient-to-r from-surface via-slate-50 to-surface border border-slate-200/90 rounded-xl text-xs text-appText-muted space-y-1 shadow-2xs">
        <span className="font-bold text-primary block text-xs uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Provincial Fees &amp; Capital Gains Tax Note:
        </span>
        <p className="leading-relaxed">
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
              text:
                result.filerStatus === "filer"
                  ? `Filer ${result.ratePercentage}`
                  : `Non-Filer ${result.ratePercentage}`,
              variant: result.filerStatus === "filer" ? "success" : "warning",
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={!result || propertyValNum <= 0}
      emptyPrompt="Enter an amount above to see your result — Upar raqam likhein, result foran nazar aayega."
      footnote="Finance Act 2026. Late-filer category was abolished in TY2027. Filers can adjust this advance tax in their annual return."
    />
  );

  const isBuy = result?.transaction === "buy";
  const isFiler = result?.filerStatus === "filer";
  const rateFormatted = result ? (result.rate * 100).toFixed(2).replace(/\.00$/, "") : "";
  const filerStatusUrdu = isFiler ? "فائلر" : "نان فائلر";
  const transactionUrdu = isBuy ? "خرید رہے ہیں" : "بیچ رہے ہیں";

  const explanationBox = result ? (
    <ExplanationBox
      type="tax"
      imageSrc="/images/explanation/property-tax.webp"
      imageAlt="Modern house and keys for property purchase"
      englishText={`You are ${isBuy ? "buying" : "selling"} a property worth Rs ${formatRupees(result.propertyValue, { prefix: false })} as a ${isFiler ? "Filer" : "Non-Filer"}. The ${result.sectionCode} rate for you is ${rateFormatted}%. Your advance tax is Rs ${formatRupees(result.propertyValue, { prefix: false })} × ${rateFormatted}% = Rs ${formatRupees(result.taxAmount, { prefix: false })}. ${isBuy ? `Your total cost is Rs ${formatRupees(result.propertyValue, { prefix: false })} + Rs ${formatRupees(result.taxAmount, { prefix: false })} = Rs ${formatRupees(result.totalForBuyer, { prefix: false })}.` : `You will receive Rs ${formatRupees(result.propertyValue, { prefix: false })} − Rs ${formatRupees(result.taxAmount, { prefix: false })} = Rs ${formatRupees(result.netForSeller, { prefix: false })}.`} As a Filer you save Rs ${formatRupees(result.savingsVsNonFiler, { prefix: false })} compared to a Non-Filer on this property.`}
      urduText={
        <>
          آپ <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.propertyValue, { prefix: false })}</span> کی پراپرٹی {transactionUrdu} اور آپ {filerStatusUrdu} ہیں۔ آپ کے لیے {result.sectionCode} کا ریٹ <span dir="ltr" className="inline-block font-sans font-semibold">{rateFormatted}%</span> ہے۔ ایڈوانس ٹیکس <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.propertyValue, { prefix: false })} × {rateFormatted}% = روپے {formatRupees(result.taxAmount, { prefix: false })}</span> بنتا ہے۔ {isBuy ? (
            <>خریداری پر: کل خرچہ <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalForBuyer, { prefix: false })}</span> ہوگا۔</>
          ) : (
            <>بیچنے پر: آپ کو <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.netForSeller, { prefix: false })}</span> ملیں گے۔</>
          )} {isFiler ? (
            <>فائلر ہونے سے آپ کو اس پراپرٹی پر <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.savingsVsNonFiler, { prefix: false })}</span> کی بچت ہوتی ہے۔</>
          ) : (
            <>فائلر بن کر آپ اس پراپرٹی پر <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.savingsVsNonFiler, { prefix: false })}</span> کی بچت کر سکتے ہیں۔</>
          )}
        </>
      }
      urduTextPlain={`آپ روپے ${formatRupees(result.propertyValue, { prefix: false })} کی پراپرٹی ${transactionUrdu} اور آپ ${filerStatusUrdu} ہیں۔ آپ کے لیے ${result.sectionCode} کا ریٹ ${rateFormatted}% ہے۔ ایڈوانس ٹیکس روپے ${formatRupees(result.propertyValue, { prefix: false })} × ${rateFormatted}% = روپے ${formatRupees(result.taxAmount, { prefix: false })} بنتا ہے۔ ${isBuy ? `خریداری پر: کل خرچہ روپے ${formatRupees(result.totalForBuyer, { prefix: false })} ہوگا۔` : `بیچنے پر: آپ کو روپے ${formatRupees(result.netForSeller, { prefix: false })} ملیں گے۔`} ${isFiler ? `فائلر ہونے سے آپ کو اس پراپرٹی پر روپے ${formatRupees(result.savingsVsNonFiler, { prefix: false })} کی بچت ہوتی ہے۔` : `فائلر بن کر آپ اس پراپرٹی پر روپے ${formatRupees(result.savingsVsNonFiler, { prefix: false })} کی بچت کر سکتے ہیں۔`}`}
      referenceContent={
        <>
          <p><strong>Law:</strong> Income Tax Ordinance 2001, Sections 236C (Seller) and 236K (Buyer). Finance Act 2026. Filer buyer 1.25%, filer seller 2.75%. Late-filer category abolished in TY2027.</p>
          <div dir="rtl" lang="ur" className="font-urdu text-right pt-1 text-slate-800">
            <strong className="text-primary font-bold ml-1.5 font-sans">قانون:</strong> انکم ٹیکس آرڈیننس 2001، سیکشن 236C (فروخت کنندہ) اور 236K (خریدار)۔ فنانس ایکٹ 2026۔ فائلر خریدار 1.25 فیصد، فائلر فروخت کنندہ 2.75 فیصد۔ لیٹ فائلر کیٹیگری TY2027 میں ختم کر دی گئی ہے۔
          </div>
        </>
      }
    />
  ) : null;

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

