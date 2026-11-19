"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import CalculatorShell from "@/components/CalculatorShell";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import ExplanationBox from "@/components/ExplanationBox";
import PrintReport from "@/components/PrintReport";
import { useExplanationLang } from "@/components/LanguageContext";
import { calculatorPages } from "@/content/pages";
import { calculateUshr, UshrCalculationResult } from "@/lib/calc/ushr";
import {
  UshrIrrigationType,
  UshrUnit,
  USHR_CROPS,
  ushrRates,
} from "@/lib/rates/ushr";
import { formatRupees } from "@/lib/calc/money";
import { buildWhatsAppText } from "@/lib/summary";
import { buildUshrSummaryData } from "@/lib/summary/builders";
import CalculatorHistory from "@/components/CalculatorHistory";
import { useCalculatorHistory } from "@/lib/history/useCalculatorHistory";

interface UshrInputs {
  crop: string;
  unit: UshrUnit;
  quantityRaw: string;
  quantityNum: number;
  priceRaw: string;
  priceNum: number;
  irrigation: UshrIrrigationType;
}

export default function UshrCalculatorPage() {
  const content = calculatorPages.ushr;
  const { lang } = useExplanationLang();
  const isRoman = lang === "roman";

  // Form State
  const [crop, setCrop] = useState<string>("wheat");
  const [unit, setUnit] = useState<UshrUnit>("kg");
  const [quantityRaw, setQuantityRaw] = useState<string>("");
  const [quantityNum, setQuantityNum] = useState<number>(0);
  const [priceRaw, setPriceRaw] = useState<string>("");
  const [priceNum, setPriceNum] = useState<number>(0);
  const [irrigation, setIrrigation] = useState<UshrIrrigationType>("rain");

  const { history, recordCalculation, removeEntry, clearAll } =
    useCalculatorHistory<UshrInputs>("ushr");

  const handleReset = () => {
    setCrop("wheat");
    setUnit("kg");
    setQuantityRaw("");
    setQuantityNum(0);
    setPriceRaw("");
    setPriceNum(0);
    setIrrigation("rain");
  };

  const handleExample = () => {
    setCrop("wheat");
    setUnit("kg");
    setQuantityRaw("1000");
    setQuantityNum(1000);
    setPriceRaw("130");
    setPriceNum(130);
    setIrrigation("rain");
  };

  const handleRestore = (saved: UshrInputs) => {
    setCrop(saved.crop);
    setUnit(saved.unit);
    setQuantityRaw(saved.quantityRaw);
    setQuantityNum(saved.quantityNum);
    setPriceRaw(saved.priceRaw);
    setPriceNum(saved.priceNum);
    setIrrigation(saved.irrigation);
  };

  const handleUnitToggle = (newUnit: UshrUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    if (newUnit === "maund") {
      // 1000 kg -> 25 maund
      const convertedQty = quantityNum / ushrRates.kgPerMaund;
      const convertedPrice = priceNum * ushrRates.kgPerMaund;
      setQuantityNum(convertedQty);
      setQuantityRaw(convertedQty.toString());
      setPriceNum(convertedPrice);
      setPriceRaw(convertedPrice.toString());
    } else {
      // 25 maund -> 1000 kg
      const convertedQty = quantityNum * ushrRates.kgPerMaund;
      const convertedPrice = priceNum / ushrRates.kgPerMaund;
      setQuantityNum(convertedQty);
      setQuantityRaw(convertedQty.toString());
      setPriceNum(convertedPrice);
      setPriceRaw(convertedPrice.toString());
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setQuantityRaw(raw);
    const num = parseFloat(raw.replace(/,/g, ""));
    setQuantityNum(isNaN(num) || num < 0 ? 0 : num);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPriceRaw(raw);
    const num = parseFloat(raw.replace(/,/g, ""));
    setPriceNum(isNaN(num) || num < 0 ? 0 : num);
  };

  const isBlankOrZero = !quantityRaw.trim() || quantityNum <= 0;

  let result: UshrCalculationResult | null = null;
  if (!isBlankOrZero) {
    result = calculateUshr({
      crop,
      quantity: quantityNum,
      unit,
      pricePerUnit: priceNum,
      irrigation,
    });
  }

  // Record valid calculation into history (debounced)
  React.useEffect(() => {
    if (!isBlankOrZero && quantityNum > 0 && priceNum > 0 && result) {
      const cropName = USHR_CROPS.find((c) => c.id === crop)?.nameEn || crop;
      const summary = `Ushr — ${cropName} ${quantityNum.toLocaleString()} ${unit}, ${
        irrigation === "rain"
          ? "Rain"
          : irrigation === "tubewell"
          ? "Canal/Tube"
          : "Half/Half"
      }`;
      const resultSummary = `Ushr ${result.ushrKind.toLocaleString()} ${
        result.ushrKindUnit
      }, Rs ${formatRupees(result.ushrCashValue, { prefix: false })}`;

      recordCalculation({
        summary,
        resultSummary,
        inputs: {
          crop,
          unit,
          quantityRaw,
          quantityNum,
          priceRaw,
          priceNum,
          irrigation,
        },
      });
    }
  }, [
    crop,
    unit,
    quantityRaw,
    quantityNum,
    priceRaw,
    priceNum,
    irrigation,
    isBlankOrZero,
    result,
    recordCalculation,
  ]);

  // Unit Options
  const unitOptions: ToggleOption<UshrUnit>[] = [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "maund", label: "Maund (Mun)" },
  ];

  // Secondary Results for ResultPanel
  const secondaryResults: SecondaryResult[] = result
    ? [
        {
          label: isRoman ? "Kul Fasal Qeemat" : "Total Harvest Value",
          value: formatRupees(result.totalHarvestValue),
          subtext: `${result.quantity.toLocaleString()} ${unit} @ ${formatRupees(result.pricePerUnit)}/${unit}`,
          highlight: true,
        },
        {
          label: isRoman ? "Laagu Ushr Sharah" : "Applicable Ushr Rate",
          value: result.ratePercentage,
          subtext: isRoman ? result.irrigationLabelRoman : result.irrigationLabelEn,
        },
        {
          label: isRoman ? "Fasal Ki Qisam" : "Selected Crop",
          value: isRoman ? result.cropNameRoman : result.cropNameEn,
          subtext: "Agricultural produce",
        },
        {
          label: isRoman ? "Pani Ka Zariya" : "Irrigation Method",
          value: irrigation === "rain" ? "Rain / River" : irrigation === "tubewell" ? "Tube-well / Well" : "Mixed Water",
          subtext: result.ratePercentage,
        },
      ]
    : [];

  // Summary Data for Copy & Print
  const summaryData = useMemo(() => {
    const safeResult =
      result ||
      calculateUshr({
        crop,
        quantity: isBlankOrZero ? 0 : quantityNum,
        unit,
        pricePerUnit: priceNum,
        irrigation,
      });

    return buildUshrSummaryData({
      cropName: crop,
      quantity: isBlankOrZero ? 0 : quantityNum,
      unit,
      pricePerUnit: priceNum,
      irrigation,
      result: safeResult,
      language: lang,
    });
  }, [crop, isBlankOrZero, quantityNum, unit, priceNum, irrigation, result, lang]);

  const copySummaryText = useMemo(() => {
    return buildWhatsAppText(summaryData, lang);
  }, [summaryData, lang]);

  // Conversion line: e.g. "25 maund = 1,000 kg" or "1,000 kg = 25 maund"
  const convertedDisplay = useMemo(() => {
    if (quantityNum <= 0) return null;
    if (unit === "maund") {
      const inKg = quantityNum * 40;
      return `${quantityNum.toLocaleString()} maund = ${inKg.toLocaleString()} kg`;
    } else {
      const inMaund = quantityNum / 40;
      return `${quantityNum.toLocaleString()} kg = ${inMaund.toLocaleString()} maund`;
    }
  }, [quantityNum, unit]);

  // Inputs Section
  const calculatorInputs = (
    <div className="space-y-6">
      {/* Try an Example Header */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Harvest Details</span>
        <button
          type="button"
          onClick={handleExample}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-accent bg-accent-soft hover:bg-teal-100/80 border border-accent/30 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <span>💡</span>
          <span>{lang === "roman" ? "Example try karein" : "Try an example"}</span>
        </button>
      </div>

      {/* 1. Crop Selection */}
      <div className="space-y-1.5">
        <label htmlFor="ushr-crop-select" className="block text-xs sm:text-sm font-bold text-primary">
          {isRoman ? "1. Fasal Ki Qisam (Select Crop)" : "1. Select Agricultural Produce / Crop"}
        </label>
        <select
          id="ushr-crop-select"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm sm:text-base font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-2xs"
        >
          {USHR_CROPS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameRoman}
            </option>
          ))}
        </select>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
          {isRoman
            ? "Hanafi fiqh ke mutabiq har qisam ki paidawar (gandum, chawal, sabzi, phal waghera) par Ushr wajib hai."
            : "Under Hanafi fiqh, Ushr applies to all harvested crops, grains, vegetables, and fruits."}
        </p>
      </div>

      {/* 2. Total Harvest Quantity & Unit */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="ushr-qty-input" className="block text-xs sm:text-sm font-bold text-primary">
            {isRoman ? "2. Kul Paidawar (Total Harvest Quantity)" : "2. Total Harvest Quantity"}
          </label>
          <span className="text-[11px] text-slate-500 font-semibold">1 maund = 40 kg</span>
        </div>

        <div className="space-y-2">
          <Toggle
            label=""
            options={unitOptions}
            value={unit}
            onChange={handleUnitToggle}
          />

          <div className="relative">
            <input
              id="ushr-qty-input"
              type="text"
              inputMode="decimal"
              value={quantityRaw}
              onChange={handleQuantityChange}
              placeholder={unit === "kg" ? "e.g. 1,000" : "e.g. 25"}
              className="w-full px-3.5 py-2.5 pr-16 text-base sm:text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-2xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600 uppercase">
              {unit}
            </div>
          </div>

          {convertedDisplay && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs font-bold text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>{convertedDisplay}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Market Price */}
      <div className="space-y-1.5">
        <label htmlFor="ushr-price-input" className="block text-xs sm:text-sm font-bold text-primary">
          {isRoman
            ? `3. Mandi Bhao (Market Price per ${unit})`
            : `3. Local Market / Mandi Price (PKR per ${unit})`}
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
            Rs
          </span>
          <input
            id="ushr-price-input"
            type="text"
            inputMode="decimal"
            value={priceRaw}
            onChange={handlePriceChange}
            placeholder={unit === "kg" ? "e.g. 130" : "e.g. 5,200"}
            className="w-full pl-10 pr-20 py-2.5 text-base sm:text-lg font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/40 shadow-2xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
            /{unit}
          </div>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
          {isRoman
            ? "Mandi ki moojooda qeemat darj karein taake naqd Ushr ki raqam nikal sake."
            : "Used to compute obligatory cash value if paying Ushr in rupees instead of produce."}
        </p>
      </div>

      {/* 4. Irrigation Method (Radio Cards) */}
      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-bold text-primary">
          {isRoman ? "4. Pani Ka Tareeqa (Irrigation Method)" : "4. Irrigation Water Source"}
        </label>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Option 1: Rain / River (10%) */}
          <label
            onClick={() => setIrrigation("rain")}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
              irrigation === "rain"
                ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="irrigation"
              checked={irrigation === "rain"}
              onChange={() => setIrrigation("rain")}
              className="mt-1 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  {isRoman ? "Barish / Nehri Pani — 10%" : "Rain / River / Spring — 10%"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  1/10th (10%)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isRoman
                  ? "Qudrati barish, darya ya chashmon se sairab (Sahih al-Bukhari 1483)."
                  : "Naturally watered crops with zero artificial extraction expense."}
              </p>
            </div>
          </label>

          {/* Option 2: Tube-well / Well (5%) */}
          <label
            onClick={() => setIrrigation("tubewell")}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
              irrigation === "tubewell"
                ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="irrigation"
              checked={irrigation === "tubewell"}
              onChange={() => setIrrigation("tubewell")}
              className="mt-1 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  {isRoman ? "Tube-well / Khud Pani — 5%" : "Tube-well / Well / Drawn water — 5%"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  1/20th (5%)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isRoman
                  ? "Kuen, tube-well ya diesel pump jis par kharcha ya mehnat lagti hai."
                  : "Artificially irrigated crops involving cost, labor, or fuel."}
              </p>
            </div>
          </label>

          {/* Option 3: Mixed (7.5%) */}
          <label
            onClick={() => setIrrigation("mixed")}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
              irrigation === "mixed"
                ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="irrigation"
              checked={irrigation === "mixed"}
              onChange={() => setIrrigation("mixed")}
              className="mt-1 text-emerald-600 focus:ring-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  {isRoman ? "Mixed — Dono Barabar — 7.5%" : "Mixed — both methods — 7.5%"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  3/40th (7.5%)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {isRoman
                  ? "7.5% tab lagu hota hai jab dono tareeqon se barabar pani diya gaya ho. Agar koi ek tareeqa ghalib raha ho to usi ka rate chunein."
                  : "7.5% applies when both methods watered the crop about equally. If one method was dominant, choose that method above."}
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  // Result Panel with prominent dual display (Kind + Cash)
  const resultPanel = (
    <div className="space-y-4">
      {result ? (
        <div className="space-y-4">
          <ResultPanel
            title={`Ushr Result (${result.ratePercentage})`}
            mainLabel="Ushr Due (In Kind)"
            mainValue={result.ushrKindDisplay}
            mainSubtext={`Obligatory produce share (${result.ratePercentage} of harvest)`}
            statusBadge={{
              text: `Ushr Due: ${result.ratePercentage}`,
              variant: "due",
            }}
            secondaryResults={[
              {
                label: isRoman ? "Naqd Qeemat (Cash Value)" : "Ushr Cash Value (PKR)",
                value: formatRupees(result.ushrCashValue),
                subtext: `At mandi rate ${formatRupees(result.pricePerUnit)}/${unit}`,
                highlight: true,
              },
              ...secondaryResults,
            ]}
            copySummaryText={copySummaryText}
            isEmpty={false}
            footnote="Ushr is due immediately upon harvest (Quran 6:141). Seed, fertiliser, and harvesting expenses are not deductible."
            onReset={handleReset}
            onExample={handleExample}
          />

          {/* Prominent Cash Value Accent Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4 border border-slate-800 shadow-md">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                {isRoman ? "FINAL USHR (NAQD QEEMAT)" : "OBLIGATORY CASH VALUE"}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-0.5 block">
                {formatRupees(result.ushrCashValue)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isRoman ? "Fasal Mein Hissa:" : "In-Kind Share:"}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-300">
                {result.ushrKindDisplay}
              </span>
            </div>
          </div>

          {/* Nisab Status Card (Hanafi Default + Majority Position) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/90 text-xs text-amber-950 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <strong className="text-sm font-extrabold text-slate-900">
                {isRoman ? "Nisab Ki Shariah Wazahat:" : "Shariah Nisab Verification:"}
              </strong>
            </div>

            <div className="space-y-1.5 pl-4 border-l-2 border-amber-300 text-slate-800 font-medium leading-relaxed">
              <p>
                <strong className="text-slate-900">1. Hanafi position (Pakistan standard):</strong>{" "}
                {result.hanafiNisabNote}
              </p>
              <p>
                <strong className="text-slate-900">2. Majority position (Shafi&apos;i, Maliki, Hanbali):</strong>{" "}
                {isRoman ? result.majorityNisabNoteRoman : result.majorityNisabNoteEn}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ResultPanel
          title="Ushr Result"
          mainLabel="Obligatory Ushr"
          mainValue="Rs 0"
          statusBadge={{
            text: "Awaiting Input",
            variant: "not_due",
          }}
          secondaryResults={[]}
          copySummaryText={copySummaryText}
          isEmpty={true}
          footnote="Ushr is due immediately upon harvest (Quran 6:141). Seed, fertiliser, and harvesting expenses are not deductible."
          onReset={handleReset}
          onExample={handleExample}
        />
      )}

      {/* Part 4 Reverse Cross-link: Link back to Zakat Calculator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/90 via-sky-50/50 to-emerald-50/60 border border-teal-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="text-xs sm:text-sm text-slate-800 leading-snug">
          <span className="font-bold text-primary block text-xs uppercase tracking-wider mb-0.5">
            {isRoman ? "Bachat Aur Tijarat Par Zakat" : "Wealth & Savings Zakat"}
          </span>
          {isRoman
            ? "Cash, gold ya business par Zakat? → Zakat Calculator"
            : "Need to calculate 2.5% Zakat on cash, gold, silver, or business inventory?"}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/methodology"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-primary bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <span>Methodology</span>
          </Link>
          <Link
            href="/zakat-calculator"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            <span>Zakat Calculator</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );

  // Dynamic ExplanationBox
  const explanationBox = result ? (
    <ExplanationBox
      type="islamic"
      romanUrduText={`Aapki ${result.quantity.toLocaleString()} ${unit} ${result.cropNameRoman} ki fasal par, jo ${result.irrigationLabelRoman} se hui, ${result.ratePercentage} ke hisaab se ${result.ushrKind.toLocaleString()} ${unit} Ushr banta hai, jiski naqd qeemat Rs ${result.ushrCashValue.toLocaleString()} hai. Ushr fasal uthte hi dena hota hai, saal guzarna zaroori nahi. Beej, khaad ya katai ka kharcha kaat kar hisab nahi hota.`}
      englishText={`On your harvest of ${result.quantity.toLocaleString()} ${unit} ${result.cropNameEn.toLowerCase()}, irrigated by ${result.irrigationLabelEn}, Ushr is ${result.ushrKind.toLocaleString()} ${unit} at ${result.ratePercentage}, with a cash value of Rs ${result.ushrCashValue.toLocaleString()}. Ushr is due upon harvest — no one-year holding period (Hawl) applies. Costs for seeds, fertiliser, or harvesting are not deducted.`}
      extraBullets={[
        {
          en: "Ushr is due immediately on the day of harvest (Quran 6:141) — no one-year holding period (Hawl) applies.",
          romanUrdu: "Ushr fasal katne ke din hi wajib ho jata hai (Quran 6:141) — is ke liye saal guzarna (Hawl) shart nahi.",
        },
        {
          en: "Costs for seeds, chemical fertiliser, machinery, and harvesting labor are NOT deducted from the harvest.",
          romanUrdu: "Beej, khaad, tractor ya katai ka kharcha harvest se minha nahi hota. Shariat ne artificial pani ki riayat mein rate 10% se 5% kar diya hai.",
        },
        {
          en: "Under Pakistan's Zakat & Ushr Ordinance 1980, official recovery may apply at a uniform 5%. This tool calculates your religious obligation.",
          romanUrdu: "Pakistan mein Zakat & Ushr Ordinance 1980 ke tehat hukoomati wasooli mukhtalif ho sakti hai. Ye calculator aapki mazhabi zimmedari ka hisab karta hai.",
        },
      ]}
      referenceContentEn={
        <div className="space-y-1.5">
          <p>
            • <strong>Quran 6:141</strong> — &quot;…and give its due on the day of its harvest.&quot;
          </p>
          <p>
            • <strong>Sahih al-Bukhari 1483</strong> — &quot;On a land irrigated by rain water or by natural water channels… Ushr (one-tenth) is compulsory; and on the land irrigated by the well, half of an Ushr (one-twentieth) is compulsory.&quot;
          </p>
          <p>
            • <strong>Sahih Muslim 979 (Majority Nisab)</strong> — &quot;There is no Zakat on less than five Wasqs.&quot; (5 Wasq ≈ 653 kg / 16.3 maund).
          </p>
          <p>
            • <strong>Cost Deduction:</strong> Islamic Fiqh Academy resolution: Production costs are not deducted; the lower 5% rate already compensates for irrigation overhead.
          </p>
          <p>
            • <strong>Methodology:</strong> Read our complete{" "}
            <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
              Ushr calculation methodology &amp; agricultural Nisab rules
            </Link>.
          </p>
          <p>
            • <strong>Related Obligations:</strong> Calculate 2.5% wealth Zakat on our{" "}
            <Link href="/zakat-calculator" className="text-accent underline font-semibold hover:text-teal-700">
              Zakat calculator
            </Link>{" "}
            or return to the{" "}
            <Link href="/" className="text-accent underline font-semibold hover:text-teal-700">
              CalculationHub homepage
            </Link>.
          </p>
        </div>
      }
      referenceContentRoman={
        <div className="space-y-1.5">
          <p>
            • <strong>Quran 6:141</strong> — &quot;…aur fasal katne ke din uska haq (Ushr) ada karo.&quot; (Surah Al-An&apos;am)
          </p>
          <p>
            • <strong>Sahih al-Bukhari 1483</strong> — &quot;Jis zameen ko barish ya qudrati chashmon ne sairab kiya ho us par Ushr (10%) hai, aur jo zameen kuen (ya masnooi tareeqe) se sairab ki jaye us par aadha Ushr (5%) hai.&quot;
          </p>
          <p>
            • <strong>Sahih Muslim 979 (Jumhoor Nisab)</strong> — 5 wasq (taqreeban 653 kg ya 16.3 maund) se kam par Ushr nahi (Jumhoor mauqaf). Hanafi fiqh mein har miqdaar par wajib hai.
          </p>
          <p>
            • <strong>Kharcha Minha:</strong> Islamic Fiqh Academy ka faisla: beej aur khaad ka kharcha minha nahi hota kyunke 10% se 5% rate pehle hi kharche ki riayat hai.
          </p>
          <p>
            • <strong>Tariqa-e-Kaar:</strong> Tafseeli ahkam samajhne ke liye hamari{" "}
            <Link href="/methodology" className="text-accent underline font-semibold hover:text-teal-700">
              Ushr methodology
            </Link>{" "}
            mulaheza karein.
          </p>
          <p>
            • <strong>Deegar Faraiz:</strong> Salana daulat par 2.5% Zakat ke liye{" "}
            <Link href="/zakat-calculator" className="text-accent underline font-semibold hover:text-teal-700">
              Zakat calculator
            </Link>{" "}
            ya tamam tools ke liye{" "}
            <Link href="/" className="text-accent underline font-semibold hover:text-teal-700">
              CalculationHub homepage
            </Link>{" "}
            par jayein.
          </p>
        </div>
      }
    />
  ) : null;

  return (
    <CalculatorShell
      content={content}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      calculatorHistory={
        <CalculatorHistory<UshrInputs>
          history={history}
          onRestore={handleRestore}
          onDelete={removeEntry}
          onClear={clearAll}
        />
      }
      explanationBox={explanationBox}
      printReport={<PrintReport data={summaryData} language={lang} />}
    />
  );
}

