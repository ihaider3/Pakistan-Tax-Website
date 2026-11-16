"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import { calculatorPages } from "@/content/pages";
import { calculateFitrana, FitranaCalculationResult } from "@/lib/calc/fitrana";
import { formatRupees } from "@/lib/calc/money";
import { fitranaRates2026, StapleType, FitranaSourceKey } from "@/lib/rates/fitrana-2026";

export default function FitranaCalculatorPage() {
  const content = calculatorPages.fitrana;

  const [members, setMembers] = useState<number>(5); // Preloaded with Blueprint worked example (5 family members)
  const [membersRaw, setMembersRaw] = useState<string>("5");
  const [staple, setStaple] = useState<StapleType>("wheat");
  const [source, setSource] = useState<FitranaSourceKey>("muneeb");

  const stapleOptions: ToggleOption<StapleType>[] = [
    { value: "wheat", label: "Wheat (Gandum)", badge: "Consensus Rs 300" },
    { value: "barley", label: "Barley (Jau)", badge: "4 kg" },
    { value: "dates", label: "Dates (Khajoor)", badge: "4 kg" },
    { value: "raisins", label: "Raisins (Kishmish)", badge: "4 kg" },
  ];

  const sourceOptions: ToggleOption<FitranaSourceKey>[] = [
    { value: "muneeb", label: "Mufti Muneeb-ur-Rehman (2026)", badge: "21 Feb" },
    { value: "cii", label: "Council of Islamic Ideology (CII)", badge: "Ramadan" },
  ];

  let result: FitranaCalculationResult | null = null;
  let inputError: string | null = null;

  if (members < 1) {
    inputError = "Family members must be at least 1 person.";
  } else if (members > 50) {
    inputError = "Maximum 50 family members allowed.";
  } else {
    result = calculateFitrana(members, staple, source);
  }

  const handleMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setMembersRaw(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      setMembers(num);
    } else {
      setMembers(0);
    }
  };

  const secondaryResults: SecondaryResult[] = result
    ? [
        {
          label: "Per-Person Fitrana Rate",
          value: formatRupees(result.perPersonRate),
          subtext: `${result.stapleName} (${result.weightDescription})`,
          highlight: true,
        },
        {
          label: "Selected Scholarly Source",
          value: result.sourceName,
          subtext: `Announced: ${result.sourceDate}`,
        },
        {
          label: `Alternate Source (${result.alternateSourceName})`,
          value: formatRupees(result.alternateSourceTotal),
          subtext: `${formatRupees(result.alternateSourcePerPerson)} per person`,
        },
        {
          label: "Total Family Members",
          value: `${result.familyMembers} persons`,
          subtext: "Self + all dependent family members",
        },
      ]
    : [];

  const copySummaryText = result
    ? `Household Fitrana: ${formatRupees(result.totalFitrana)} (${result.familyMembers} persons × ${formatRupees(result.perPersonRate)} on ${result.stapleName} - ${result.sourceName}) — Pakistan Finance Calculators`
    : "";

  // Side-by-Side Rates Comparison Table
  const breakdownColumns: BreakdownColumn[] = [
    { key: "staple", header: "Staple Commodity" },
    { key: "weight", header: "Weight / Measure" },
    { key: "muneebRate", header: "Mufti Muneeb Rate", align: "right" },
    { key: "ciiRate", header: "CII Rate", align: "right" },
    { key: "familyTotal", header: `Family Total (${result ? result.familyMembers : 1} pers)`, align: "right" },
  ];

  const breakdownRows: BreakdownRow[] = [
    {
      id: "wheat",
      isHighlighted: staple === "wheat",
      cells: {
        staple: (
          <div>
            <span className="font-semibold text-primary block">Wheat (Gandum)</span>
            <span className="text-xs text-emerald-700 font-medium">Consensus Minimum Rate</span>
          </div>
        ),
        weight: "2 kg",
        muneebRate: formatRupees(fitranaRates2026.sources.muneeb.rates.wheat.amount),
        ciiRate: formatRupees(fitranaRates2026.sources.cii.rates.wheat.amount),
        familyTotal: formatRupees(
          (result ? result.familyMembers : 1) * fitranaRates2026.consensusWheatRate
        ),
      },
    },
    {
      id: "barley",
      isHighlighted: staple === "barley",
      cells: {
        staple: <span className="font-semibold text-primary">Barley (Jau)</span>,
        weight: "4 kg",
        muneebRate: formatRupees(fitranaRates2026.sources.muneeb.rates.barley.amount),
        ciiRate: formatRupees(fitranaRates2026.sources.cii.rates.barley.amount),
        familyTotal: formatRupees(
          (result ? result.familyMembers : 1) *
            fitranaRates2026.sources[source].rates.barley.amount
        ),
      },
    },
    {
      id: "dates",
      isHighlighted: staple === "dates",
      cells: {
        staple: <span className="font-semibold text-primary">Dates (Khajoor)</span>,
        weight: "4 kg",
        muneebRate: formatRupees(fitranaRates2026.sources.muneeb.rates.dates.amount),
        ciiRate: formatRupees(fitranaRates2026.sources.cii.rates.dates.amount),
        familyTotal: formatRupees(
          (result ? result.familyMembers : 1) *
            fitranaRates2026.sources[source].rates.dates.amount
        ),
      },
    },
    {
      id: "raisins",
      isHighlighted: staple === "raisins",
      cells: {
        staple: <span className="font-semibold text-primary">Raisins (Kishmish)</span>,
        weight: "4 kg",
        muneebRate: formatRupees(fitranaRates2026.sources.muneeb.rates.raisins.amount),
        ciiRate: formatRupees(fitranaRates2026.sources.cii.rates.raisins.amount),
        familyTotal: formatRupees(
          (result ? result.familyMembers : 1) *
            fitranaRates2026.sources[source].rates.raisins.amount
        ),
      },
    },
  ];

  const calculatorInputs = (
    <div className="space-y-6">
      {/* Family Members Count */}
      <div className="space-y-2">
        <label htmlFor="members-input" className="block text-sm font-bold text-primary tracking-tight">
          Number of Family Members &amp; Dependents <span className="text-red-500">*</span>
        </label>
        <div className="relative rounded-xl shadow-xs focus-within:shadow-[0_8px_20px_-3px_rgba(15,118,110,0.15)] transition-all">
          <input
            id="members-input"
            type="number"
            min="1"
            max="50"
            value={membersRaw}
            onChange={handleMembersChange}
            className={`block w-full px-4 py-3 min-h-[48px] text-base font-bold rounded-xl border text-appText bg-white transition-all ${
              inputError ? "border-red-400 focus:ring-red-400/20" : "border-slate-200/90 focus:border-accent focus:ring-2 focus:ring-accent/20"
            }`}
            placeholder="e.g. 5"
            required
          />
        </div>
        {inputError && (
          <p className="text-xs text-red-600 font-bold">{inputError}</p>
        )}
        <p className="text-xs text-appText-muted font-medium">
          Count yourself, spouse, minor children, and any other household dependents.
        </p>
      </div>

      {/* Staple Category Toggle */}
      <Toggle<StapleType>
        label="Select Staple Food Category"
        options={stapleOptions}
        value={staple}
        onChange={(st) => setStaple(st)}
      />

      {/* Scholarly Source Selector */}
      <Toggle<FitranaSourceKey>
        label="Select Scholarly Authority Announcement"
        options={sourceOptions}
        value={source}
        onChange={(src) => setSource(src)}
      />

      {/* Scholarly Difference Explanation */}
      <div className="p-4 bg-gradient-to-r from-surface via-slate-50 to-surface border border-slate-200/90 rounded-xl text-xs text-appText-muted space-y-1 shadow-2xs">
        <span className="font-bold text-primary block text-xs uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Consensus vs Discrepancy Note:
        </span>
        <p>
          Both scholars unanimously agree on <strong>Rs 300 per person</strong> for standard 2 kg Wheat (Gandum). Rates for barley, dates, and raisins vary based on quality grading and regional market surveys.
        </p>
      </div>
    </div>
  );

  const resultPanel = (
    <ResultPanel
      title={`Fitrana 2026 (${result?.stapleName || "Wheat"})`}
      mainLabel="Total Household Fitrana"
      mainValue={result ? formatRupees(result.totalFitrana) : "Rs 0"}
      mainSubtext={
        result
          ? `${result.familyMembers} persons × ${formatRupees(result.perPersonRate)} (${result.sourceName})`
          : undefined
      }
      statusBadge={
        result
          ? {
              text: staple === "wheat" ? "Consensus Rate (Rs 300)" : `${result.stapleName} Rate`,
              variant: "success",
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      copySummaryText={copySummaryText}
      isEmpty={!result || members < 1}
      emptyPrompt="Enter number of family members to calculate Fitrana"
      footnote={fitranaRates2026.disclaimerText}
    />
  );

  const breakdownSection = (
    <BreakdownTable
      title="Official 2026 Fitrana Rates Comparison"
      subtitle="Side-by-side comparison between Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology."
      columns={breakdownColumns}
      rows={breakdownRows}
      totalLabel={result ? `Selected: ${result.stapleName} (${result.sourceName})` : "Total"}
      totalValue={result ? formatRupees(result.totalFitrana) : undefined}
    />
  );

  const romanUrduSummary = result ? (
    <div className="bg-surface p-3.5 rounded-lg border border-appBorder">
      <span className="font-semibold text-primary block text-xs uppercase mb-1">
        Roman Urdu Khulasa:
      </span>
      <p className="text-xs sm:text-sm text-appText">
        Aap ke gharane ke {result.familyMembers} afrad ka {result.stapleName} ke hisab se kul Sadqa-e-Fitr (Fitrana){" "}
        <strong>{formatRupees(result.totalFitrana)}</strong> banta hai ({formatRupees(result.perPersonRate)} fi fard ba mutabiq {result.sourceName}). Yeh raqam Eid ki namaz se pehle ada karna wajib hai.
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

