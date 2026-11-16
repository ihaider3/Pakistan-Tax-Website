"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import ExplanationBox from "@/components/ExplanationBox";
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
    { value: "wheat", label: "Wheat (Gandum)", badge: "Rs 300" },
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
          Number of Family Members &amp; Dependents — Gharane ke afrad <span className="text-red-500">*</span>
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
          Count yourself, spouse, minor children, and any other household dependents — Apne aap ko, shareek-e-hayat, bachay aur zer-e-kafalat afrad shamil karein.
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
        columns={1}
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
      emptyPrompt="Enter number of family members above to see your result — Afrad ki tadaad likhein, result foran nazar aayega."
      footnote={fitranaRates2026.disclaimerText}
    />
  );

  const fitranaBullets = [
    {
      en: "Fitrana is due from every Muslim who has food in excess of their needs on Eid day — paid for oneself and all dependents (including children).",
      ru: "Fitrana har us Musalman par wajib hai jis ke paas Eid ke din apni zaroorat se zyada anaaj ho — yeh apni taraf se aur apne tamam zer-e-kafalat afrad (bachon samet) ki taraf se ada kiya jata hai.",
    },
    {
      en: "Must be paid before the Eid-ul-Fitr prayer so the poor can celebrate Eid.",
      ru: "Eid ki namaz se pehle ada karna zaroori hai taakay ghareeb log bhi Eid ki khushiyon mein shareek ho sakein.",
    },
  ];

  const explanationBox = result ? (
    <ExplanationBox
      type="islamic"
      englishText={`Fitrana is paid per person before the Eid prayer. Your family has ${result.familyMembers} persons. At Rs ${formatRupees(result.perPersonRate, { prefix: false })} per person (${result.stapleName}, ${result.sourceName}), your total Fitrana is ${result.familyMembers} × Rs ${formatRupees(result.perPersonRate, { prefix: false })} = Rs ${formatRupees(result.totalFitrana, { prefix: false })}.`}
      romanUrduText={`Fitrana har fard ke hisab se Eid ki namaz se pehle ada karna hota hai. Aap ke gharane mein ${result.familyMembers} afrad hain. Rs ${formatRupees(result.perPersonRate, { prefix: false })} fi fard (${result.stapleName}, ${result.sourceName}) ke hisab se kul Fitrana ${result.familyMembers} × Rs ${formatRupees(result.perPersonRate, { prefix: false })} = Rs ${formatRupees(result.totalFitrana, { prefix: false })} banta hai.`}
      extraBullets={fitranaBullets}
      referenceContent={
        <>
          <p>
            <strong>Hadith:</strong> &ldquo;Allah&apos;s Messenger (ﷺ) enjoined the payment of one Sa&apos; of dates or one Sa&apos; of barley as Zakat-ul-Fitr on every Muslim, slave or free, male or female, young or old, and he ordered that it be paid before the people went out to offer the &apos;Id prayer.&rdquo; — Sahih al-Bukhari 1503; Sahih Muslim 984.
          </p>
          <p>
            <strong>Roman Urdu:</strong> &ldquo;Rasool Allah ﷺ ne har Musalman par, aazad ho ya ghulam, mard ho ya aurat, chhota ho ya bara, ek Sa&apos; khajoor ya ek Sa&apos; jau ke barabar Sadqa-e-Fitr farz farmaya, aur hukm diya ke ye Eid ki namaz se pehle ada kiya jaye.&rdquo; — Sahih al-Bukhari 1503.
          </p>
          <p className="text-xs pt-1 border-t border-[#C9A227]/30 text-slate-700">
            <strong>Note:</strong> Wheat Rs 300 per person is the agreed minimum (Mufti Muneeb + CII both). Barley, dates and raisins rates differ by source — the calculator already shows both.
          </p>
        </>
      }
    />
  ) : null;

  const breakdownSection = (
    <div className="space-y-3">
      <BreakdownTable
        title="Official 2026 Fitrana Rates Comparison"
        subtitle="Side-by-side comparison between Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology."
        columns={breakdownColumns}
        rows={breakdownRows}
        totalLabel={result ? `Selected: ${result.stapleName} (${result.sourceName})` : "Total"}
        totalValue={result ? formatRupees(result.totalFitrana) : undefined}
      />
      <div className="p-3.5 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1 shadow-2xs">
        <p className="font-semibold text-slate-900">
          <strong>Note:</strong> Rates differ because market prices and quality differ by source. Wheat Rs 300 is agreed by both.
        </p>
        <p className="text-slate-800">
          <strong>Wazahat:</strong> Rates mein farq market qeemat aur quality ki wajah se hai. Gandum Rs 300 par dono ka ittefaq hai.
        </p>
      </div>
    </div>
  );

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

