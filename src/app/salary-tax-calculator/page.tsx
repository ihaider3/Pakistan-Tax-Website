"use client";

import React, { useState, useMemo, useEffect } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import ExplanationBox from "@/components/ExplanationBox";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import PrintReport from "@/components/PrintReport";
import { calculatorPages } from "@/content/pages";
import { calculateSalaryTax, SalaryTaxResult } from "@/lib/calc/salary";
import { formatRupees, formatPercentage } from "@/lib/calc/money";
import { useExplanationLang } from "@/components/LanguageContext";
import { buildSalarySummaryData } from "@/lib/summary/builders";
import { buildWhatsAppText } from "@/lib/summary";
import CalculatorHistory from "@/components/CalculatorHistory";
import { useCalculatorHistory } from "@/lib/history/useCalculatorHistory";

type SalaryFrequency = "monthly" | "annual";
type TaxYear = "2026-27" | "2025-26";

interface SalaryInputs {
  salaryRaw: string;
  salaryNum: number;
  frequency: SalaryFrequency;
  taxYear: TaxYear;
}

export default function SalaryTaxCalculatorPage() {
  const content = calculatorPages.salary;
  const { lang } = useExplanationLang();

  const [frequency, setFrequency] = useState<SalaryFrequency>("monthly");
  const [taxYear, setTaxYear] = useState<TaxYear>("2026-27");
  const [salaryRaw, setSalaryRaw] = useState<string>("");
  const [salaryNum, setSalaryNum] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  const { history, recordCalculation, removeEntry, clearAll } =
    useCalculatorHistory<SalaryInputs>("salary");

  // Dynamic document title based on tax year selection
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (taxYear === "2025-26") {
      document.title = "Salary Tax Calculator Pakistan 2025-26 | FBR Tax Slabs & Monthly Pay";
    } else {
      document.title = "Salary Tax Calculator Pakistan 2026-27 | FBR Tax Slabs & Monthly Pay";
    }
  }, [taxYear]);

  const frequencyOptions: ToggleOption<SalaryFrequency>[] = [
    { value: "monthly", label: "Monthly Gross Salary" },
    { value: "annual", label: "Annual Taxable Salary" },
  ];

  const taxYearOptions: ToggleOption<TaxYear>[] = [
    { value: "2026-27", label: "Tax Year 2026–27 (Current)", badge: "TY27" },
    { value: "2025-26", label: "Tax Year 2025–26 (Prior)", badge: "TY26" },
  ];

  const isBlank = salaryRaw.trim() === "";
  const result = useMemo(() => {
    if (isValid && !isBlank && salaryNum > 0) {
      return calculateSalaryTax(salaryNum, frequency, taxYear);
    }
    return null;
  }, [isValid, isBlank, salaryNum, frequency, taxYear]);

  // Handle salary input change
  const handleSalaryChange = (raw: string, numValue: number, valid: boolean) => {
    setSalaryRaw(raw);
    setSalaryNum(numValue);
    setIsValid(valid);
  };

  const handleReset = () => {
    setFrequency("monthly");
    setTaxYear("2026-27");
    setSalaryRaw("");
    setSalaryNum(0);
    setIsValid(true);
  };

  const handleExample = () => {
    setFrequency("monthly");
    setTaxYear("2026-27");
    setSalaryRaw("150000");
    setSalaryNum(150000);
    setIsValid(true);
  };

  const handleRestore = (saved: SalaryInputs) => {
    setFrequency(saved.frequency);
    setTaxYear(saved.taxYear);
    setSalaryRaw(saved.salaryRaw);
    setSalaryNum(saved.salaryNum);
    setIsValid(true);
  };

  // Record valid calculation into history (debounced)
  useEffect(() => {
    if (isValid && !isBlank && salaryNum > 0 && result) {
      const summary = `Salary Rs ${formatRupees(salaryNum, { prefix: false })}/${
        frequency === "monthly" ? "mo" : "yr"
      }${taxYear === "2025-26" ? " (TY2025-26)" : ""}`;
      const resultSummary = `Tax Rs ${formatRupees(
        frequency === "monthly" ? result.monthlyTax : result.annualTax,
        { prefix: false }
      )}`;
      recordCalculation({
        summary,
        resultSummary,
        inputs: {
          salaryRaw,
          salaryNum,
          frequency,
          taxYear,
        },
      });
    }
  }, [
    salaryRaw,
    salaryNum,
    frequency,
    taxYear,
    isValid,
    isBlank,
    result,
    recordCalculation,
  ]);

  // Switch frequency: converts amount smoothly
  const handleFrequencyChange = (newFreq: SalaryFrequency) => {
    if (newFreq !== frequency && salaryNum > 0) {
      if (newFreq === "annual") {
        const annualVal = salaryNum * 12;
        setSalaryNum(annualVal);
        setSalaryRaw(annualVal.toLocaleString("en-US"));
      } else {
        const monthlyVal = Math.round(salaryNum / 12);
        setSalaryNum(monthlyVal);
        setSalaryRaw(monthlyVal.toLocaleString("en-US"));
      }
    }
    setFrequency(newFreq);
  };

  // Secondary results for ResultPanel
  const secondaryResults: SecondaryResult[] = result
    ? [
        {
          label: "Annual Income Tax",
          value: formatRupees(result.annualTax),
          subtext: `Yearly deduction for ${taxYear}`,
        },
        {
          label: "Monthly Take-Home Pay",
          value: formatRupees(result.monthlyTakeHome),
          subtext: `Net cash in bank each month`,
          highlight: true,
        },
        {
          label: "Annual Take-Home Pay",
          value: formatRupees(result.annualTakeHome),
          subtext: `Total net earnings for the year`,
        },
        {
          label: "Effective Tax Rate",
          value: `${result.effectiveTaxRate}%`,
          subtext: `Overall tax on gross income`,
        },
      ]
    : [];

  const summaryData = useMemo(() => {
    return buildSalarySummaryData({
      salaryRaw,
      salaryNum,
      period: frequency,
      taxYear,
      result: result || calculateSalaryTax(0, frequency, taxYear),
      language: lang,
    });
  }, [salaryRaw, salaryNum, frequency, taxYear, result, lang]);

  const copySummaryText = useMemo(() => {
    return buildWhatsAppText(summaryData, lang);
  }, [summaryData, lang]);

  // Prepare Breakdown Table
  const breakdownColumns: BreakdownColumn[] = [
    { key: "slab", header: "Tax Slab Bracket" },
    { key: "rate", header: "Rate", align: "center" },
    { key: "taxable", header: "Taxable In Slab (PKR)", align: "right" },
    { key: "tax", header: "Tax For Slab (PKR)", align: "right" },
  ];

  const breakdownRows: BreakdownRow[] = result
    ? result.breakdown.map((item, idx) => ({
        id: idx,
        isHighlighted: item.taxableAmountInSlab > 0 && item.rate > 0,
        cells: {
          slab: (
            <div>
              <span className="font-semibold text-primary block">
                Slab {item.slabIndex}
              </span>
              <span className="text-xs text-appText-muted">{item.description}</span>
            </div>
          ),
          rate: (
            <span className="inline-block px-2 py-0.5 rounded bg-surface font-semibold text-xs text-primary">
              {item.rateLabel}
            </span>
          ),
          taxable: formatRupees(item.taxableAmountInSlab, { prefix: false }),
          tax: formatRupees(item.taxForSlab, { prefix: false, showPaisa: item.taxForSlab > 0 && item.taxForSlab < 1 }),
        },
      }))
    : [];

  const calculatorInputs = (
    <div className="space-y-5">
      {/* Scope Disclaimer Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50/50 border border-blue-200/80 rounded-xl text-xs text-blue-950 flex items-start gap-3 shadow-2xs">
        <div className="p-1.5 rounded-lg bg-blue-100/80 text-blue-700 shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="leading-relaxed">
          <strong className="font-bold text-blue-900">Salaried Individuals Scope:</strong> Applicable only to individuals where salary income exceeds 75% of total taxable income (Section 149). Not for freelancers, sole proprietors, or corporate directors.
        </p>
      </div>

      {/* Frequency Toggle */}
      <Toggle<SalaryFrequency>
        label="Input Salary Frequency"
        options={frequencyOptions}
        value={frequency}
        onChange={handleFrequencyChange}
      />

      {/* Salary Input Header with Try an Example Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Salary Details</span>
        <button
          type="button"
          onClick={handleExample}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-accent bg-accent-soft hover:bg-teal-100/80 border border-accent/30 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <span>💡</span>
          <span>{lang === "roman" ? "Example try karein" : "Try an example"}</span>
        </button>
      </div>

      {/* Salary Money Input */}
      <MoneyInput
        id="salary-input"
        label={
          frequency === "monthly"
            ? "Monthly Gross Salary — Mahana kul salary (tax se pehle)"
            : "Annual Taxable Salary — Salana kul salary (tax se pehle)"
        }
        value={salaryRaw}
        onChange={handleSalaryChange}
        placeholder={frequency === "monthly" ? "e.g. 150,000" : "e.g. 1,800,000"}
        hint="Enter gross taxable salary before tax deductions or provident fund — Mahana kul aamdani tax katne se pehle"
        unitLabel="PKR"
      />

      {/* Tax Year Selector */}
      <Toggle<TaxYear>
        label="Select Tax Year"
        options={taxYearOptions}
        value={taxYear}
        onChange={(val) => setTaxYear(val)}
      />

      {/* Prior Year Surcharge Note if relevant */}
      {result?.surchargeNote && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
          <strong>Tax Year 2025-26 Notice:</strong> {result.surchargeNote}
        </div>
      )}
    </div>
  );

  const footnoteText =
    taxYear === "2026-27"
      ? "Calculations follow Finance Act 2026 progressive slabs. Salaried surcharge is 0% in TY2027."
      : "Calculations follow Finance Act 2025 progressive slabs. Surcharge is 9% of tax on income exceeding Rs 10M under Section 4AB.";

  const resultPanel = (
    <ResultPanel
      title={`Salary Tax (${taxYear.replace("-", "\u2011")})`}
      mainLabel="Monthly Tax Deduction"
      mainValue={result ? formatRupees(result.monthlyTax) : "Rs 0"}
      mainSubtext={
        result
          ? result.monthlyTax === 0
            ? "Zero Tax (Income is within the tax-free Rs 600,000 slab)"
            : `Applied Slab: ${result.appliedSlabDescription}`
          : undefined
      }
      statusBadge={
        result
          ? {
              text: result.annualTax === 0 ? "Tax-Exempt Slab" : `Effective Tax Rate: ${result.effectiveTaxRate}%`,
              variant: result.annualTax === 0 ? "success" : "warning",
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={isBlank || !isValid || !result}
      footnote={footnoteText}
      onReset={handleReset}
      onExample={handleExample}
    />
  );

  const hasDecimal = result ? (result.monthlySalary % 1 !== 0 || result.annualSalary % 1 !== 0) : false;
  const roundingNote = hasDecimal ? " (rounded to whole rupees for the result)" : "";

  const is26 = taxYear === "2026-27";
  const refEn = is26 ? (
    <p>
      <strong>Law:</strong> Income Tax Ordinance 2001, Section 149 — Salary. Finance Act 2026, FBR Withholding Tax Rate Card TY2027. First Rs 600,000 annual (Rs 50,000/month) is 0%. Salaried surcharge is 0% in TY2027.
    </p>
  ) : (
    <p>
      <strong>Law:</strong> Income Tax Ordinance 2001, Section 149 — Salary. Finance Act 2025, FBR Withholding Tax Rate Card TY2026. First Rs 600,000 annual (Rs 50,000/month) is 0%. Salaried surcharge in TY2026 is 9% of tax on income exceeding Rs 10,000,000 (Section 4AB).
    </p>
  );

  const refRoman = is26 ? (
    <p>
      <strong>Qanoon:</strong> Income Tax Ordinance 2001, Section 149 — Salary. Finance Act 2026, FBR Withholding Tax Rate Card TY2027. Pehla Rs 600,000 salana (Rs 50,000/mahana) 0% hai. Salaried surcharge TY2027 mein 0% hai.
    </p>
  ) : (
    <p>
      <strong>Qanoon:</strong> Income Tax Ordinance 2001, Section 149 — Salary. Finance Act 2025, FBR Withholding Tax Rate Card TY2026. Pehla Rs 600,000 salana (Rs 50,000/mahana) 0% hai. Salaried surcharge TY2026 mein Rs 10M se zyada aamdani par tax ka 9% hai (Section 4AB).
    </p>
  );

  const explanationBox = result ? (
    <ExplanationBox
      type="tax"
      romanUrduText={`Aap ne mahana tankhwah Rs ${formatRupees(result.monthlySalary, { prefix: false, showPaisaIfDecimal: true })} likhi. Is se salana tankhwah Rs ${formatRupees(result.annualSalary, { prefix: false, showPaisaIfDecimal: true })} banti hai. Tax Year ${taxYear} ke slab ${result.appliedSlabIndex} ke mutabiq: ${result.appliedSlabDescription}. Kul salana tax Rs ${formatRupees(result.annualTax, { prefix: false })}${roundingNote} banta hai, jo mahana Rs ${formatRupees(result.monthlyTax, { prefix: false })} hota hai. Is tarah aapki take-home tankhwah Rs ${formatRupees(result.monthlyTakeHome, { prefix: false })} mahana banti hai.`}
      englishText={`You entered a monthly salary of Rs ${formatRupees(result.monthlySalary, { prefix: false, showPaisaIfDecimal: true })}. That makes an annual salary of Rs ${formatRupees(result.annualSalary, { prefix: false, showPaisaIfDecimal: true })}. Under Tax Year ${taxYear} slab ${result.appliedSlabIndex}: ${result.appliedSlabDescription}. Total annual tax is Rs ${formatRupees(result.annualTax, { prefix: false })}${roundingNote}, which is Rs ${formatRupees(result.monthlyTax, { prefix: false })} per month. Your take-home salary is therefore Rs ${formatRupees(result.monthlyTakeHome, { prefix: false })} per month.`}
      referenceContentEn={refEn}
      referenceContentRoman={refRoman}
    />
  ) : null;

  const breakdownSection = result ? (
    <BreakdownTable
      title={`FBR Progressive Slab Math (${taxYear})`}
      subtitle="Each tax rate applies ONLY to the income within that specific slab bracket."
      columns={breakdownColumns}
      rows={breakdownRows}
      totalLabel="Total Annual Income Tax"
      totalValue={formatRupees(result.annualTax)}
    />
  ) : null;

  const is25 = taxYear === "2025-26";

  const dynamicContent = {
    ...content,
    h1: is25 ? "Salary Tax Calculator Pakistan 2025-26" : content.h1,
    intro: is25
      ? "Calculate your monthly tax withholding and take-home salary in Pakistan for Tax Year 2025-26 (1 July 2025 to 30 June 2026) based on official FBR progressive income tax slabs under Section 149."
      : content.intro,
    englishIntro: is25
      ? "This calculator works out the tax on your monthly salary using FBR's Tax Year 2025–26 slabs (6 progressive slabs, top rate 35% above Rs 4,100,000). If your annual salary is below Rs 600,000, no tax applies. Tax is charged slab by slab, and your take-home salary appears instantly."
      : content.englishIntro,
    romanUrduIntro: is25
      ? "Ye calculator aapki mahana tankhwah par FBR ke Tax Year 2025–26 ke slabs (6 progressive slabs, Rs 4,100,000 se upar 35% aakhri rate) ke mutabiq tax nikalta hai. Agar aapki salana tankhwah Rs 600,000 se kam hai, to koi tax nahi lagta. Tax slab ke hisab se lagta hai aur aapki take-home tankhwah foran samne aa jati hai."
      : content.romanUrduIntro,
    sourceDocument: is25
      ? "Finance Act 2025, FBR Withholding Tax Rate Card TY2026, Section 149"
      : content.sourceDocument,
    formulaTitle: is25
      ? "Progressive Income Tax Formula (Section 149, Finance Act 2025)"
      : content.formulaTitle,
    workedExample: {
      ...content.workedExample,
      title:
        taxYear === "2025-26"
          ? "Worked Example: Monthly Salary of Rs 150,000 (Annual: Rs 1,800,000) [Tax Year 2025-26]"
          : "Worked Example: Monthly Salary of Rs 150,000 (Annual: Rs 1,800,000)",
      description: `How FBR computes your tax slab by slab for Tax Year ${taxYear}:`,
    },
  };

  return (
    <CalculatorShell
      content={dynamicContent}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      calculatorHistory={
        <CalculatorHistory<SalaryInputs>
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

