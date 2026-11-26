"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { useExplanationLang } from "@/components/LanguageContext";
import PrintReport from "@/components/PrintReport";
import { buildGstSummaryData } from "@/lib/summary/builders";
import { buildWhatsAppText } from "@/lib/summary";
import CalculatorHistory from "@/components/CalculatorHistory";
import { useCalculatorHistory } from "@/lib/history/useCalculatorHistory";

type RatePreset = "18" | "custom";

interface GstInputs {
  amountRaw: string;
  amountNum: number;
  mode: GstMode;
  ratePreset: RatePreset;
  customRateRaw: string;
  customRateNum: number;
}

export default function GstCalculatorPage() {
  const content = calculatorPages.gst;
  const { lang } = useExplanationLang();

  const [amountRaw, setAmountRaw] = useState<string>("");
  const [amountNum, setAmountNum] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  const [mode, setMode] = useState<GstMode>("add");
  const [ratePreset, setRatePreset] = useState<RatePreset>("18");
  const [customRateRaw, setCustomRateRaw] = useState<string>("5");
  const [customRateNum, setCustomRateNum] = useState<number>(5);

  const { history, recordCalculation, removeEntry, clearAll } =
    useCalculatorHistory<GstInputs>("gst");

  const handleReset = () => {
    setAmountRaw("");
    setAmountNum(0);
    setIsValid(true);
    setMode("add");
    setRatePreset("18");
    setCustomRateRaw("5");
    setCustomRateNum(5);
  };

  const handleExample = () => {
    setAmountRaw("100000");
    setAmountNum(100000);
    setIsValid(true);
    setMode("add");
    setRatePreset("18");
  };

  const handleRestore = (saved: GstInputs) => {
    setMode(saved.mode);
    setRatePreset(saved.ratePreset);
    setCustomRateRaw(saved.customRateRaw);
    setCustomRateNum(saved.customRateNum);
    setAmountRaw(saved.amountRaw);
    setAmountNum(saved.amountNum);
    setIsValid(true);
  };

  const modeOptions: ToggleOption<GstMode>[] = [
    { value: "add", label: "Add GST", badge: "Exclusive" },
    { value: "remove", label: "Remove GST", badge: "Inclusive" },
    { value: "amount_only", label: "GST Only", badge: "Tax Value" },
  ];

  const rateOptions: ToggleOption<RatePreset>[] = [
    { value: "18", label: "18% Standard", badge: "Federal" },
    { value: "custom", label: "Custom Rate", badge: "Services/Special" },
  ];

  const effectiveRate = ratePreset === "18" ? 18 : customRateNum;

  const isBlank = amountRaw.trim() === "";
  let result: GstCalculationResult | null = null;
  if (isValid && !isBlank && amountNum > 0) {
    result = calculateGst(amountNum, mode, effectiveRate);
  }

  // Record valid calculation into history (debounced)
  React.useEffect(() => {
    if (isValid && !isBlank && amountNum > 0 && result) {
      const summary = `GST ${effectiveRate}% — Rs ${formatRupees(amountNum, {
        prefix: false,
      })} (${mode === "add" ? "Add GST" : mode === "remove" ? "Remove GST" : "GST Only"})`;
      const resultSummary = `Tax Rs ${formatRupees(result.gstAmount, {
        prefix: false,
        showPaisaIfDecimal: true,
      })} / Total Rs ${formatRupees(result.totalAmount, {
        prefix: false,
        showPaisaIfDecimal: true,
      })}`;

      recordCalculation({
        summary,
        resultSummary,
        inputs: {
          amountRaw,
          amountNum,
          mode,
          ratePreset,
          customRateRaw,
          customRateNum,
        },
      });
    }
  }, [
    amountRaw,
    amountNum,
    mode,
    ratePreset,
    customRateRaw,
    customRateNum,
    effectiveRate,
    isValid,
    isBlank,
    result,
    recordCalculation,
  ]);

  // Secondary Results for ResultPanel
  const secondaryResults: SecondaryResult[] = result
    ? [
      {
        label: "Net Base Amount (Exclusive)",
        value: formatRupees(result.baseAmount, { showPaisaIfDecimal: true }),
        subtext: "Value of goods/services without tax",
        highlight: mode === "remove",
      },
      {
        label: `Sales Tax (${result.ratePercentage})`,
        value: formatRupees(result.gstAmount, { showPaisaIfDecimal: true }),
        subtext: "General Sales Tax payable to FBR",
        highlight: mode === "amount_only",
      },
      {
        label: "Total Gross Amount (Inclusive)",
        value: formatRupees(result.totalAmount, { showPaisaIfDecimal: true }),
        subtext: "Full invoice cost with tax",
        highlight: mode === "add",
      },
      {
        label: "Calculation Mode",
        value:
          mode === "add"
            ? `Base + ${result.ratePercentage} GST`
            : mode === "remove"
              ? `Base − ${result.ratePercentage} GST`
              : `GST @ ${result.ratePercentage}`,
        subtext: `Applied rate: ${result.ratePercentage}`,
      },
    ]
    : [];

  const summaryData = React.useMemo(() => {
    return buildGstSummaryData({
      amountRaw,
      amountNum,
      mode,
      ratePercent: effectiveRate,
      result: result || calculateGst(0, mode, effectiveRate),
      language: lang,
    });
  }, [amountRaw, amountNum, mode, effectiveRate, result, lang]);

  const copySummaryText = React.useMemo(() => {
    return buildWhatsAppText(summaryData, lang);
  }, [summaryData, lang]);

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
          amount: formatRupees(result.baseAmount, { showPaisaIfDecimal: true }),
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
          amount: formatRupees(result.gstAmount, { showPaisaIfDecimal: true }),
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

      {/* Amount Input Header with Try an Example Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Invoice Amount</span>
        <button
          type="button"
          onClick={handleExample}
          className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1 text-xs font-bold text-accent bg-accent-soft hover:bg-teal-100/80 border border-accent/30 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <span>💡</span>
          <span>{lang === "roman" ? "Example try karein" : "Try an example"}</span>
        </button>
      </div>

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
        <p className="pt-1 text-[11px] text-slate-500">
          Compare with personal income tax on our{" "}
          <Link href="/salary-tax-calculator" className="text-accent underline font-semibold hover:text-teal-700">
            salary tax calculator
          </Link>{" "}
          or learn more in our{" "}
          <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
            GST calculation methodology
          </Link>.
        </p>
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
                : result.totalAmount,
            { showPaisaIfDecimal: true }
          )
          : "Rs 0"
      }
      mainSubtext={
        result
          ? `Includes ${formatRupees(result.gstAmount, { showPaisaIfDecimal: true })} Sales Tax @ ${result.ratePercentage}`
          : undefined
      }
      statusBadge={
        result
          ? {
            text: `Sales Tax: ${formatRupees(result.gstAmount, { showPaisaIfDecimal: true })}`,
            variant: "warning",
          }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={isBlank || !isValid || !result}
      footnote="Calculations apply standard mathematical rounding in integer paisa under the Sales Tax Act 1990."
      onReset={handleReset}
      onExample={handleExample}
    />
  );

  const baseFormatted = result ? formatRupees(result.baseAmount, { prefix: false, showPaisaIfDecimal: true }) : "0";
  const gstFormatted = result ? formatRupees(result.gstAmount, { prefix: false, showPaisaIfDecimal: true }) : "0";
  const totalFormatted = result ? formatRupees(result.totalAmount, { prefix: false, showPaisaIfDecimal: true }) : "0";
  const rateLabel = result ? (result.ratePercentage === "18%" ? "18%" : result.ratePercentage) : "18%";

  const explanationBox = result ? (
    <ExplanationBox
      type="tax"
      romanUrduText={
        mode === "add"
          ? `Aap ne raqam Rs ${baseFormatted} likhi. Add mode mein ${rateLabel} GST Rs ${gstFormatted} banta hai. Kul raqam Rs ${baseFormatted} + Rs ${gstFormatted} = Rs ${totalFormatted} banti hai.`
          : mode === "remove"
            ? `Aap ne kul raqam Rs ${totalFormatted} likhi. Is mein se ${rateLabel} GST nikaalne par asal raqam Rs ${baseFormatted} aur GST Rs ${gstFormatted} banta hai.`
            : `Aap ne raqam Rs ${baseFormatted} likhi. Is par ${rateLabel} GST Rs ${gstFormatted} banta hai.`
      }
      englishText={
        mode === "add"
          ? `You entered Rs ${baseFormatted}. In Add mode, ${rateLabel} GST is Rs ${gstFormatted}. Total = Rs ${baseFormatted} + Rs ${gstFormatted} = Rs ${totalFormatted}.`
          : mode === "remove"
            ? `You entered a total of Rs ${totalFormatted}. Removing ${rateLabel} GST gives a base amount of Rs ${baseFormatted} and GST of Rs ${gstFormatted}.`
            : `You entered Rs ${baseFormatted}. GST at ${rateLabel} on this amount is Rs ${gstFormatted}.`
      }
      referenceContentEn={
        <div className="space-y-1.5">
          <p>
            <strong>Law:</strong> Sales Tax Act 1990, standard rate 18% on goods. Services rates are provincial and vary — confirm with PRA / SRB / KPRA / BRA for your specific service.
          </p>
          <p>
            • <strong>Methodology:</strong> Read our detailed{" "}
            <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
              GST calculation methodology
            </Link>{" "}
            to understand integer paisa rounding and formula proofs.
          </p>
          <p>
            • <strong>Related Tax Tools:</strong> Calculate your annual income tax with our{" "}
            <Link href="/salary-tax-calculator" className="text-accent underline font-semibold hover:text-teal-700">
              salary tax calculator
            </Link>{" "}
            or return to the{" "}
            <Link href="/" className="text-accent underline font-semibold hover:text-teal-700">
              CalculationHub homepage
            </Link>{" "}
            for all 6 verified calculators.
          </p>
        </div>
      }
      referenceContentRoman={
        <div className="space-y-1.5">
          <p>
            <strong>Qanoon:</strong> Sales Tax Act 1990, goods par standard rate 18%. Services par rate soobay ke mutabiq alag hota hai — apni service ke liye PRA / SRB / KPRA / BRA se tasdeeq karein.
          </p>
          <p>
            • <strong>Tariqa-e-Kaar:</strong> Paisa rounding aur hisab ke qawaneen samajhne ke liye hamari{" "}
            <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
              GST calculation methodology
            </Link>{" "}
            mulaheza karein.
          </p>
          <p>
            • <strong>Mutaliqa Tools:</strong> Apni tankhwah ka tax janne ke liye{" "}
            <Link href="/salary-tax-calculator" className="text-accent underline font-semibold hover:text-teal-700">
              salary tax calculator
            </Link>{" "}
            istemal karein ya tamam tools ke liye{" "}
            <Link href="/" className="text-accent underline font-semibold hover:text-teal-700">
              CalculationHub homepage
            </Link>{" "}
            par jayein.
          </p>
        </div>
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
      totalValue={formatRupees(result.totalAmount, { showPaisaIfDecimal: true })}
    />
  ) : null;

  const dynamicContent = {
    ...content,
    faqs: content.faqs.map((faq) => {
      if (faq.question === "How is GST credit calculated in Pakistan?") {
        return {
          question: "How is GST credit calculated in Pakistan?",
          answer:
            lang === "roman"
              ? "Pakistan mein GST-registered karobar apni khareedari par GST ada karta hai (input tax) aur apni bikri par GST wasool karta hai (output tax); ada shuda input tax ko wasool shuda output tax ke samne adjust kiya jata hai, aur baqaya raqam Sales Tax Act 1990 ke teht mahana sales tax return ke sath FBR ko jama karwai jati hai. Yeh calculator 18% goods rate (GST shamil karein / GST alag karein) par kaam karta hai."
              : "A GST-registered business pays GST on its purchases (input tax) and charges GST on its sales (output tax); the input tax paid can be adjusted against the output tax charged, and the balance is paid to FBR with the monthly sales tax return under the Sales Tax Act 1990. This calculator itself works on the 18% goods rate (add GST / remove GST from an inclusive price).",
        };
      }
      return faq;
    }),
  };

  return (
    <CalculatorShell
      content={dynamicContent}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      calculatorHistory={
        <CalculatorHistory<GstInputs>
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

