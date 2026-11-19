"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { useExplanationLang } from "@/components/LanguageContext";
import PrintReport from "@/components/PrintReport";
import { buildPropertySummaryData } from "@/lib/summary/builders";
import { buildWhatsAppText } from "@/lib/summary";
import CalculatorHistory from "@/components/CalculatorHistory";
import { useCalculatorHistory } from "@/lib/history/useCalculatorHistory";

interface PropertyInputs {
  propertyValRaw: string;
  propertyValNum: number;
  transaction: PropertyTransactionType;
  filerStatus: FilerStatus;
}

export default function PropertyTaxCalculatorPage() {
  const content = calculatorPages.property;
  const { lang } = useExplanationLang();

  const [propertyValRaw, setPropertyValRaw] = useState<string>("");
  const [propertyValNum, setPropertyValNum] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  const [transaction, setTransaction] = useState<PropertyTransactionType>("buy");
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("filer");

  const { history, recordCalculation, removeEntry, clearAll } =
    useCalculatorHistory<PropertyInputs>("property");

  const handleReset = () => {
    setPropertyValRaw("");
    setPropertyValNum(0);
    setIsValid(true);
    setTransaction("buy");
    setFilerStatus("filer");
  };

  const handleExample = () => {
    setPropertyValRaw("10000000");
    setPropertyValNum(10000000);
    setIsValid(true);
    setTransaction("buy");
    setFilerStatus("filer");
  };

  const handleRestore = (saved: PropertyInputs) => {
    setTransaction(saved.transaction);
    setFilerStatus(saved.filerStatus);
    setPropertyValRaw(saved.propertyValRaw);
    setPropertyValNum(saved.propertyValNum);
    setIsValid(true);
  };

  const transactionOptions: ToggleOption<PropertyTransactionType>[] = [
    { value: "buy", label: "Buy Property (Section 236K)", badge: "Buyer" },
    { value: "sell", label: "Sell Property (Section 236C)", badge: "Seller" },
  ];

  const filerOptions: ToggleOption<FilerStatus>[] = [
    { value: "filer", label: "Active Taxpayer (Filer)", badge: "ATL" },
    { value: "non-filer", label: "Non-Filer", badge: "Non-ATL" },
  ];

  const isBlank = propertyValRaw.trim() === "";
  let result: PropertyTaxResult | null = null;
  if (isValid && !isBlank && propertyValNum > 0) {
    result = calculatePropertyTax(propertyValNum, transaction, filerStatus);
  }

  // Record valid calculation into history (debounced)
  React.useEffect(() => {
    if (isValid && !isBlank && propertyValNum > 0 && result) {
      const summary = `Property ${transaction === "buy" ? "Buy" : "Sell"} — Rs ${formatRupees(
        propertyValNum,
        { prefix: false }
      )} (${filerStatus === "filer" ? "Filer" : "Non-Filer"})`;
      const resultSummary = `Tax Rs ${formatRupees(result.taxAmount, { prefix: false })}`;

      recordCalculation({
        summary,
        resultSummary,
        inputs: {
          propertyValRaw,
          propertyValNum,
          transaction,
          filerStatus,
        },
      });
    }
  }, [
    propertyValRaw,
    propertyValNum,
    transaction,
    filerStatus,
    isValid,
    isBlank,
    result,
    recordCalculation,
  ]);

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

  const summaryData = React.useMemo(() => {
    return buildPropertySummaryData({
      propertyValueRaw: propertyValRaw,
      propertyValueNum: propertyValNum,
      transaction,
      filerStatus,
      result: result || calculatePropertyTax(0, transaction, filerStatus),
      language: lang,
    });
  }, [propertyValRaw, propertyValNum, transaction, filerStatus, result, lang]);

  const copySummaryText = React.useMemo(() => {
    return buildWhatsAppText(summaryData, lang);
  }, [summaryData, lang]);

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

      {/* Property Details Header with Try an Example Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Property Consideration</span>
        <button
          type="button"
          onClick={handleExample}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-accent bg-accent-soft hover:bg-teal-100/80 border border-accent/30 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <span>💡</span>
          <span>{lang === "roman" ? "Example try karein" : "Try an example"}</span>
        </button>
      </div>

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
          Provincial stamp duty, registration fees, and Capital Value Tax (CVT) vary by province (Punjab, Sindh, KP, Balochistan) and are NOT included in this tool. Confirm local levies with your sub-registrar office. For comprehensive statutory derivation, read our{" "}
          <Link href="/methodology" className="text-blue-700 font-semibold underline hover:text-blue-900">
            property tax methodology
          </Link>
          . You can also calculate salary withholding tax using our{" "}
          <Link href="/salary-tax-calculator" className="text-blue-700 font-semibold underline hover:text-blue-900">
            salary tax calculator
          </Link>
          .
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
      isEmpty={isBlank || !isValid || !result}
      footnote="Finance Act 2026. Late-filer category was abolished in TY2027. Filers can adjust this advance tax in their annual return."
      onReset={handleReset}
      onExample={handleExample}
    />
  );

  const isBuy = result?.transaction === "buy";
  const isFiler = result?.filerStatus === "filer";
  const rateFormatted = result ? (result.rate * 100).toFixed(2).replace(/\.00$/, "") : "";
  const filerStatusUrdu = isFiler ? "فائلر" : "نان فائلر";
  const transactionUrdu = isBuy ? "خرید رہے ہیں" : "بیچ رہے ہیں";

  const rateClean = rateFormatted;
  const buyerOrSellerEn = isBuy ? "buyer" : "seller";
  const buyerOrSellerRoman = isBuy ? "kharidar" : "farokht kaninda";
  const filerOrNonFiler = isFiler ? "filer" : "non-filer";

  const propFormatted = result ? formatRupees(result.propertyValue, { prefix: false, showPaisaIfDecimal: true }) : "0";

  const explanationBox = result ? (
    <ExplanationBox
      type="tax"
      romanUrduText={`Property ki qeemat Rs ${propFormatted} hai. Aap ${buyerOrSellerRoman} hain aur aapki category ${filerOrNonFiler} hai. Section ${result.sectionCode} ke mutabiq ${rateClean}% ki sharah lagti hai. Is tarah withholding tax Rs ${formatRupees(result.taxAmount, { prefix: false })} banta hai. ${
        isFiler
          ? `Non-filer hone par yehi tax Rs ${formatRupees(result.oppositeFilerTax, { prefix: false })} banta — filer hone se aapko Rs ${formatRupees(result.savingsVsNonFiler, { prefix: false })} ki bachat hui.`
          : `Filer hone par yehi tax sirf Rs ${formatRupees(result.oppositeFilerTax, { prefix: false })} banta.`
      }`}
      englishText={`The property value is Rs ${propFormatted}. You are the ${buyerOrSellerEn} and your category is ${filerOrNonFiler}. Under Section ${result.sectionCode} a rate of ${rateClean}% applies. The withholding tax is therefore Rs ${formatRupees(result.taxAmount, { prefix: false })}. ${
        isFiler
          ? `As a non-filer this same tax would be Rs ${formatRupees(result.oppositeFilerTax, { prefix: false })} — being a filer saves you Rs ${formatRupees(result.savingsVsNonFiler, { prefix: false })}.`
          : `As a filer this same tax would be only Rs ${formatRupees(result.oppositeFilerTax, { prefix: false })}.`
      }`}
      referenceContentEn={
        <p>
          <strong>Law:</strong> Income Tax Ordinance 2001, Sections 236C (Seller) and 236K (Buyer). Finance Act 2026. Filer buyer 1.25%, filer seller 2.75%. Late-filer category abolished in TY2027. Read our detailed{" "}
          <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
            property tax methodology &amp; statutory rules →
          </Link>
        </p>
      }
      referenceContentRoman={
        <p>
          <strong>Qanoon:</strong> Income Tax Ordinance 2001, Sections 236C (Farokht kaninda) aur 236K (Kharidar). Finance Act 2026. Filer kharidar 1.25%, filer farokht kaninda 2.75%. Late-filer category TY2027 mein khatam kar di gayi hai. Mukammal{" "}
          <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
            property tax methodology dekhein →
          </Link>
        </p>
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
      calculatorHistory={
        <CalculatorHistory<PropertyInputs>
          history={history}
          onRestore={handleRestore}
          onDelete={removeEntry}
          onClear={clearAll}
        />
      }
      explanationBox={explanationBox}
      breakdownTable={breakdownSection}
      printReport={<PrintReport data={summaryData} language={lang} />}
    />
  );
}

