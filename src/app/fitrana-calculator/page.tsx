"use client";

import React, { useState } from "react";
import Link from "next/link";
import CalculatorShell from "@/components/CalculatorShell";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import ExplanationBox from "@/components/ExplanationBox";
import LazyPrintReport from "@/components/LazyPrintReport";
import { useExplanationLang } from "@/components/LanguageContext";
import { buildWhatsAppText } from "@/lib/summary";
import { buildFitranaSummaryData } from "@/lib/summary/builders";
import { calculatorPages } from "@/content/pages";
import { calculateFitrana, FitranaCalculationResult } from "@/lib/calc/fitrana";
import { formatRupees } from "@/lib/calc/money";
import { fitranaRates2026, StapleType, FitranaSourceKey } from "@/lib/rates/fitrana-2026";
import CalculatorHistory from "@/components/CalculatorHistory";
import { useCalculatorHistory } from "@/lib/history/useCalculatorHistory";

interface FitranaInputs {
  membersRaw: string;
  members: number;
  staple: StapleType;
  source: FitranaSourceKey;
}

export default function FitranaCalculatorPage() {
  const content = calculatorPages.fitrana;

  const [members, setMembers] = useState<number>(0);
  const [membersRaw, setMembersRaw] = useState<string>("");
  const [staple, setStaple] = useState<StapleType>("wheat");
  const [source, setSource] = useState<FitranaSourceKey>("muneeb");

  const { history, recordCalculation, removeEntry, clearAll } =
    useCalculatorHistory<FitranaInputs>("fitrana");

  const { lang } = useExplanationLang();

  const currentRates = fitranaRates2026.sources[source].rates;
  const stapleOptions: ToggleOption<StapleType>[] = [
    { value: "wheat", label: "Wheat (Gandum)", badge: `Rs ${currentRates.wheat.amount.toLocaleString()}` },
    { value: "barley", label: "Barley (Jau)", badge: `Rs ${currentRates.barley.amount.toLocaleString()}` },
    { value: "dates", label: "Dates (Khajoor)", badge: `Rs ${currentRates.dates.amount.toLocaleString()}` },
    { value: "raisins", label: "Raisins (Kishmish)", badge: `Rs ${currentRates.raisins.amount.toLocaleString()}` },
  ];

  const sourceOptions: ToggleOption<FitranaSourceKey>[] = [
    { value: "muneeb", label: "Mufti Muneeb\u2011ur\u2011Rehman (2026)", badge: "21 Feb" },
    { value: "cii", label: "Council of Islamic Ideology (CII)", badge: "Ramadan" },
  ];

  const isBlank = membersRaw.trim() === "";
  let result: FitranaCalculationResult | null = null;
  let inputError: string | null = null;

  if (isBlank) {
    inputError = null;
    result = null;
  } else if (members < 1) {
    inputError = "Family members must be at least 1 person.";
  } else if (members > 50) {
    inputError = "Maximum 50 family members allowed.";
  } else {
    result = calculateFitrana(members, staple, source);
  }

  const handleReset = () => {
    setMembersRaw("");
    setMembers(0);
    setStaple("wheat");
    setSource("muneeb");
  };

  const handleExample = () => {
    setMembersRaw("5");
    setMembers(5);
    setStaple("wheat");
    setSource("muneeb");
  };

  const handleRestore = (saved: FitranaInputs) => {
    setStaple(saved.staple);
    setSource(saved.source);
    setMembersRaw(saved.membersRaw);
    setMembers(saved.members);
  };

  // Record valid calculation into history (debounced)
  React.useEffect(() => {
    if (!isBlank && members >= 1 && members <= 50 && result) {
      const summary = `Fitrana — ${members} ${
        members === 1 ? "person" : "persons"
      }, ${currentRates[staple]?.name || staple}`;
      const resultSummary = `Fitrana Rs ${formatRupees(result.totalFitrana, {
        prefix: false,
      })}`;

      recordCalculation({
        summary,
        resultSummary,
        inputs: {
          membersRaw,
          members,
          staple,
          source,
        },
      });
    }
  }, [
    membersRaw,
    members,
    staple,
    source,
    isBlank,
    result,
    currentRates,
    recordCalculation,
  ]);

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
          value: result.sourceName.replace(/Mufti Muneeb-ur-Rehman/g, "Mufti Muneeb\u2011ur\u2011Rehman"),
          subtext: `Announced: ${result.sourceDate}`,
        },
        {
          label: "Alternate Source (CII)",
          value: formatRupees(result.alternateSourceTotal),
          subtext: `${formatRupees(result.alternateSourcePerPerson)} per person (Council of Islamic Ideology)`,
        },
        {
          label: "Total Family Members",
          value: `${result.familyMembers} ${result.familyMembers === 1 ? "person" : "persons"}`,
          subtext: "Self + all dependent family members",
        },
      ]
    : [];

  const summaryData = React.useMemo(() => {
    return buildFitranaSummaryData({
      members: isNaN(members) || members < 1 ? 1 : members,
      stapleName: fitranaRates2026.sources[source].rates[staple].name,
      sourceName: fitranaRates2026.sources[source].name,
      sourceKey: source,
      result: result || calculateFitrana(1, staple, source),
      language: lang,
    });
  }, [members, staple, source, result, lang]);

  const copySummaryText = React.useMemo(() => {
    return buildWhatsAppText(summaryData, lang);
  }, [summaryData, lang]);

  // Side-by-Side Rates Comparison Table
  const breakdownColumns: BreakdownColumn[] = [
    { key: "staple", header: "Staple Commodity" },
    { key: "weight", header: "Weight / Measure" },
    { key: "muneebRate", header: "Mufti Muneeb Rate", align: "right" },
    { key: "ciiRate", header: "CII Rate", align: "right" },
    { key: "familyTotal", header: `Family Total (${result ? result.familyMembers : 1} ${result && result.familyMembers > 1 ? "persons" : "person"})`, align: "right" },
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
        <div className="flex items-center justify-between">
          <label htmlFor="members-input" className="block text-sm font-bold text-primary tracking-tight">
            Number of Family Members &amp; Dependents — Gharane ke afrad
          </label>
          <button
            type="button"
            onClick={handleExample}
            className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1 text-xs font-bold text-accent bg-accent-soft hover:bg-teal-100/80 border border-accent/30 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <span>💡</span>
            <span>{lang === "roman" ? "Example try karein" : "Try an example"}</span>
          </button>
        </div>
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
        <p className="pt-1 text-[11px] text-slate-500">
          Also calculate your annual wealth obligation with our{" "}
          <Link href="/zakat-calculator" className="text-accent underline font-semibold hover:text-teal-700">
            Zakat calculator
          </Link>{" "}
          or read the full{" "}
          <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
            Fitrana methodology &amp; Hadith rulings
          </Link>.
        </p>
      </div>
    </div>
  );

  const resultPanel = (
    <ResultPanel
      title={`Fitrana 2026 — ${result?.stapleName || "Wheat (Gandum)"}`}
      mainLabel="Total Household Fitrana"
      mainValue={result ? formatRupees(result.totalFitrana) : "Rs 0"}
      mainSubtext={
        result
          ? `${result.familyMembers} ${result.familyMembers === 1 ? "person" : "persons"} × ${formatRupees(result.perPersonRate)} (${result.sourceName.replace(/Mufti Muneeb-ur-Rehman/g, "Mufti Muneeb\u2011ur\u2011Rehman")})`
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
      isEmpty={isBlank || !result || members < 1}
      footnote={fitranaRates2026.disclaimerText}
      onReset={handleReset}
      onExample={handleExample}
    />
  );

  const fitranaBullets = [
    {
      en: "Fitrana is due from every Muslim who has food in excess of their needs on Eid day — paid for oneself and all dependents (including children).",
      romanUrdu:
        "Fitrana har us Musalman par wajib hai jis ke paas Eid ke din apni zaroorat se zyada anaaj ho — yeh apni taraf se aur apne tamam zer-e-kafalat afraad (bachon samet) ki taraf se ada kiya jata hai.",
    },
    {
      en: "Must be paid before the Eid-ul-Fitr prayer so the poor can celebrate Eid.",
      romanUrdu:
        "Eid ki namaz se pehle ada karna zaroori hai taakay ghareeb log bhi Eid ki khushiyon mein shareek ho sakein.",
    },
  ];

  const personWordEn = result ? (result.familyMembers === 1 ? "person" : "persons") : "persons";
  const personWordRoman = result ? (result.familyMembers === 1 ? "shakhs" : "afraad") : "afraad";

  const explanationBox = result ? (
    <ExplanationBox
      type="islamic"
      romanUrduText={`Aap ne ${result.familyMembers} ${personWordRoman} aur ${result.stapleName} muntakhib kiya. Fi shakhs raqam Rs ${formatRupees(result.perPersonRate, { prefix: false })} hai (${result.sourceName}). Kul Fitrana ${result.familyMembers} × Rs ${formatRupees(result.perPersonRate, { prefix: false })} = Rs ${formatRupees(result.totalFitrana, { prefix: false })} banta hai.${
        staple !== "wheat"
          ? ` CII ke mutabiq is ki alternate raqam Rs ${formatRupees(result.alternateSourcePerPerson, { prefix: false })} per shakhs hai.`
          : ""
      }`}
      englishText={`You selected ${result.familyMembers} ${personWordEn} and ${result.stapleName}. The rate per person is Rs ${formatRupees(result.perPersonRate, { prefix: false })} (${result.sourceName}). Total Fitrana = ${result.familyMembers} × Rs ${formatRupees(result.perPersonRate, { prefix: false })} = Rs ${formatRupees(result.totalFitrana, { prefix: false })}.${
        staple !== "wheat"
          ? ` The CII alternate rate for this staple is Rs ${formatRupees(result.alternateSourcePerPerson, { prefix: false })} per person.`
          : ""
      }`}
      extraBullets={fitranaBullets}
      referenceContentEn={
        <div className="space-y-1.5">
          <p>
            <strong>Hadith:</strong> &ldquo;Allah&apos;s Messenger (ﷺ) enjoined the payment of one Sa&apos; of dates or one Sa&apos; of barley as Zakat-ul-Fitr on every Muslim, slave or free, male or female, young or old, and he ordered that it be paid before the people went out to offer the &apos;Id prayer.&rdquo; — Sahih al-Bukhari 1503; Sahih Muslim 984.
          </p>
          <div className="pt-1.5 border-t border-[#C9A227]/30 text-xs space-y-1">
            <p className="text-slate-700">
              <strong>Note:</strong> Wheat Rs 300 per person is the agreed minimum (Mufti Muneeb + CII both). Barley, dates and raisins rates differ by source — the calculator already shows both.
            </p>
            <p className="text-slate-700">
              • <strong>Methodology:</strong> Read our complete{" "}
              <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
                Fitrana methodology &amp; Hadith references
              </Link>.
            </p>
            <p className="text-slate-700">
              • <strong>Related Dues:</strong> Also calculate your annual{" "}
              <Link href="/zakat-calculator" className="text-accent underline font-semibold hover:text-teal-700">
                Zakat
              </Link>{" "}
              or return to the{" "}
              <Link href="/" className="text-accent underline font-semibold hover:text-teal-700">
                CalculationHub homepage
              </Link>.
            </p>
          </div>
        </div>
      }
      referenceContentRoman={
        <div className="space-y-1.5">
          <p>
            <strong>Hadith:</strong> Hazrat Abdullah bin Umar (R.A) se riwayat hai ke Rasool Allah (ﷺ) ne Sadqa-e-Fitr har ghulam, azaad, mard, aurat, chhotay aur baray Musalman par khajoor ya jau ka ek saa farz farmaya, aur logon ke namaz ke liye nikalne se pehle ada karne ka hukm diya. — Sahih al-Bukhari 1503; Sahih Muslim 984.
          </p>
          <div className="pt-1.5 border-t border-[#C9A227]/30 text-xs space-y-1">
            <p className="text-slate-700">
              <strong>Note:</strong> Gandum Rs 300 fi shakhs متفقہ (agreed) kam az kam raqam hai (Mufti Muneeb aur CII dono). Jau, khajoor aur kishmish ke rates mein dono ka thoda farq hai jo calculator mein wazeh dikhaya gaya hai.
            </p>
            <p className="text-slate-700">
              • <strong>Tariqa-e-Kaar:</strong> Mukammal ahkam ke liye hamari{" "}
              <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
                Fitrana methodology
              </Link>{" "}
              parhein.
            </p>
            <p className="text-slate-700">
              • <strong>Deegar Faraiz:</strong> Salana daulat par{" "}
              <Link href="/zakat-calculator" className="text-accent underline font-semibold hover:text-teal-700">
                Zakat calculator
              </Link>{" "}
              ya tamam calculators ke liye{" "}
              <Link href="/" className="text-accent underline font-semibold hover:text-teal-700">
                CalculationHub homepage
              </Link>{" "}
              par jayein.
            </p>
          </div>
        </div>
      }
    />
  ) : null;

  const breakdownSection = result ? (
    <div className="space-y-3">
      <BreakdownTable
        title="Official 2026 Fitrana Rates Comparison"
        subtitle="Side-by-side comparison between Mufti Muneeb\u2011ur\u2011Rehman and the Council of Islamic Ideology."
        columns={breakdownColumns}
        rows={breakdownRows}
        totalLabel={`Selected: ${result.stapleName} (${result.sourceName.replace(/Mufti Muneeb-ur-Rehman/g, "Mufti Muneeb\u2011ur\u2011Rehman")})`}
        totalValue={formatRupees(result.totalFitrana)}
      />
      <div className="p-3.5 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1.5 shadow-2xs">
        <p className="font-semibold text-slate-900">
          <strong>Note:</strong> Rates differ because market prices and quality differ by source. Wheat Rs 300 is agreed by both.
        </p>
        <div dir="rtl" lang="ur" className="font-urdu text-right text-slate-800 text-[14px] leading-[1.9]">
          <strong className="text-primary font-bold ml-1.5 font-sans">وضاحت:</strong> ریٹس میں فرق مارکیٹ قیمت اور کوالٹی کے لحاظ سے ہے — گندم روپے 300 پر دونوں کا اتفاق ہے۔
        </div>
      </div>
    </div>
  ) : null;

  const seasonalNote = (
    <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-appText-muted font-medium shadow-2xs">
      Rates announced for Ramadan 2026 — new rates will be published when announced for Ramadan 2027.
    </div>
  );

  return (
    <CalculatorShell
      content={content}
      customTopSection={seasonalNote}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      calculatorHistory={
        <CalculatorHistory<FitranaInputs>
          history={history}
          onRestore={handleRestore}
          onDelete={removeEntry}
          onClear={clearAll}
        />
      }
      explanationBox={explanationBox}
      breakdownTable={breakdownSection}
      printReport={<LazyPrintReport data={summaryData} language={lang} />}
    />
  );
}

