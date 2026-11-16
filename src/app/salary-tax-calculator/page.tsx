"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import { calculatorPages } from "@/content/pages";
import { calculateSalaryTax, SalaryTaxResult } from "@/lib/calc/salary";
import { formatRupees, formatPercentage } from "@/lib/calc/money";

type SalaryFrequency = "monthly" | "annual";
type TaxYear = "2026-27" | "2025-26";

export default function SalaryTaxCalculatorPage() {
  const content = calculatorPages.salary;

  const [frequency, setFrequency] = useState<SalaryFrequency>("monthly");
  const [taxYear, setTaxYear] = useState<TaxYear>("2026-27");
  const [salaryRaw, setSalaryRaw] = useState<string>("150000"); // Preloaded with Blueprint worked example
  const [salaryNum, setSalaryNum] = useState<number>(150000);
  const [isValid, setIsValid] = useState<boolean>(true);

  const frequencyOptions: ToggleOption<SalaryFrequency>[] = [
    { value: "monthly", label: "Monthly Gross Salary" },
    { value: "annual", label: "Annual Taxable Salary" },
  ];

  const taxYearOptions: ToggleOption<TaxYear>[] = [
    { value: "2026-27", label: "Tax Year 2026–27 (Current)", badge: "TY27" },
    { value: "2025-26", label: "Tax Year 2025–26 (Prior)", badge: "TY26" },
  ];

  let result: SalaryTaxResult | null = null;
  if (isValid && salaryNum > 0) {
    result = calculateSalaryTax(salaryNum, frequency, taxYear);
  }

  // Handle salary input change
  const handleSalaryChange = (raw: string, numValue: number, valid: boolean) => {
    setSalaryRaw(raw);
    setSalaryNum(numValue);
    setIsValid(valid);
  };

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

  const copySummaryText = result
    ? `Monthly Tax: ${formatRupees(result.monthlyTax)} | Monthly Take-Home: ${formatRupees(result.monthlyTakeHome)} (Annual Tax: ${formatRupees(result.annualTax)} | Rate: ${result.effectiveTaxRate}%) — Pakistan Finance Calculators`
    : "";

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

      {/* Salary Money Input */}
      <MoneyInput
        id="salary-input"
        label={frequency === "monthly" ? "Monthly Gross Salary" : "Annual Taxable Salary"}
        value={salaryRaw}
        onChange={handleSalaryChange}
        placeholder={frequency === "monthly" ? "e.g. 150,000" : "e.g. 1,800,000"}
        hint="Enter gross taxable salary before tax deductions or provident fund"
        unitLabel="PKR"
        required
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

  const resultPanel = (
    <ResultPanel
      title={`Salary Tax (${taxYear})`}
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
              text: result.annualTax === 0 ? "Tax-Exempt Slab" : `Tax Payable: ${result.effectiveTaxRate}%`,
              variant: result.annualTax === 0 ? "success" : "warning",
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={!result || salaryNum <= 0}
      emptyPrompt="Enter your salary to calculate tax"
      footnote="Calculations follow Finance Act 2026 progressive slabs. Salaried surcharge is 0% in TY2027."
    />
  );

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

  const romanUrduSummary = result ? (
    <div className="bg-surface p-3.5 rounded-lg border border-appBorder">
      <span className="font-semibold text-primary block text-xs uppercase mb-1">
        Roman Urdu Khulasa:
      </span>
      <p className="text-xs sm:text-sm text-appText">
        Aap ki mahana salary <strong>{formatRupees(result.monthlySalary)}</strong> par mahana tax{" "}
        <strong>{formatRupees(result.monthlyTax)}</strong> katega. Aap ko har mahinay net{" "}
        <strong>{formatRupees(result.monthlyTakeHome)}</strong> take-home salary milegi. Saal ka kul tax{" "}
        <strong>{formatRupees(result.annualTax)}</strong> banta hai (Effective rate: {result.effectiveTaxRate}%).
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

