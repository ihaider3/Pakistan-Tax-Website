"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import ExplanationBox from "@/components/ExplanationBox";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import { calculatorPages } from "@/content/pages";
import { calculateZakat, ZakatCalculationResult, GoldPurity, GOLD_PURITY_CONFIG } from "@/lib/calc/zakat";
import { formatRupees, roundToPaisa } from "@/lib/calc/money";
import { zakatRates } from "@/lib/rates/zakat";
import { useExplanationLang } from "@/components/LanguageContext";
import ratesData from "@/data/rates.json";
import PrintReport from "@/components/PrintReport";
import { buildZakatSummaryData } from "@/lib/summary/builders";
import { buildWhatsAppText } from "@/lib/summary";

type MetalUnit = "tola" | "grams";

export default function ZakatCalculatorPage() {
  const content = calculatorPages.zakat;
  const { lang } = useExplanationLang();

  // Step Collapsible visibility — Step 1 open by default; Step 2 & 3 open by default on mobile (<768px), collapsed on desktop
  const [step1Open, setStep1Open] = useState<boolean>(true);
  const [step2Open, setStep2Open] = useState<boolean>(false);
  const [step3Open, setStep3Open] = useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setStep2Open(true);
      setStep3Open(true);
    }
  }, []);

  // Asset inputs state — all empty by default per Prompt 22
  const [cashRaw, setCashRaw] = useState<string>("");
  const [cashNum, setCashNum] = useState<number>(0);

  const [bankRaw, setBankRaw] = useState<string>("");
  const [bankNum, setBankNum] = useState<number>(0);

  const [goldUnit, setGoldUnit] = useState<MetalUnit>("tola");
  const [goldQtyRaw, setGoldQtyRaw] = useState<string>("");
  const [goldQtyNum, setGoldQtyNum] = useState<number>(0);
  const [goldPurity, setGoldPurity] = useState<GoldPurity>("24k");
  const [goldRateRaw, setGoldRateRaw] = useState<string>(ratesData.goldPerTolaPKR.toFixed(2));
  const [goldRateNum, setGoldRateNum] = useState<number>(ratesData.goldPerTolaPKR);

  const [silverUnit, setSilverUnit] = useState<MetalUnit>("tola");
  const [silverQtyRaw, setSilverQtyRaw] = useState<string>("");
  const [silverQtyNum, setSilverQtyNum] = useState<number>(0);
  const [silverRateRaw, setSilverRateRaw] = useState<string>(ratesData.silverPerTolaPKR.toFixed(2));
  const [silverRateNum, setSilverRateNum] = useState<number>(ratesData.silverPerTolaPKR);

  const [businessRaw, setBusinessRaw] = useState<string>("");
  const [businessNum, setBusinessNum] = useState<number>(0);

  const [investmentsRaw, setInvestmentsRaw] = useState<string>("");
  const [investmentsNum, setInvestmentsNum] = useState<number>(0);

  const [debtsRaw, setDebtsRaw] = useState<string>("");
  const [debtsNum, setDebtsNum] = useState<number>(0);

  const [alreadyPaidRaw, setAlreadyPaidRaw] = useState<string>("");
  const [alreadyPaidNum, setAlreadyPaidNum] = useState<number>(0);

  const handleReset = () => {
    setCashRaw("");
    setCashNum(0);
    setBankRaw("");
    setBankNum(0);
    setGoldUnit("tola");
    setGoldQtyRaw("");
    setGoldQtyNum(0);
    setGoldPurity("24k");
    setGoldRateRaw(ratesData.goldPerTolaPKR.toFixed(2));
    setGoldRateNum(ratesData.goldPerTolaPKR);
    setSilverUnit("tola");
    setSilverQtyRaw("");
    setSilverQtyNum(0);
    setSilverRateRaw(ratesData.silverPerTolaPKR.toFixed(2));
    setSilverRateNum(ratesData.silverPerTolaPKR);
    setBusinessRaw("");
    setBusinessNum(0);
    setInvestmentsRaw("");
    setInvestmentsNum(0);
    setDebtsRaw("");
    setDebtsNum(0);
    setAlreadyPaidRaw("");
    setAlreadyPaidNum(0);
    setStep1Open(true);
    setStep2Open(false);
    setStep3Open(false);
  };

  const handleExample = () => {
    setCashRaw("500000");
    setCashNum(500000);
    setBankRaw("");
    setBankNum(0);
    setGoldQtyRaw("");
    setGoldQtyNum(0);
    setSilverQtyRaw("");
    setSilverQtyNum(0);
    setBusinessRaw("");
    setBusinessNum(0);
    setInvestmentsRaw("");
    setInvestmentsNum(0);
    setDebtsRaw("");
    setDebtsNum(0);
    setAlreadyPaidRaw("");
    setAlreadyPaidNum(0);
    setStep1Open(true);
  };

  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isStale = React.useMemo(() => {
    try {
      const updatedMs = new Date(ratesData.lastUpdated).getTime();
      return Date.now() - updatedMs > 48 * 3600 * 1000;
    } catch {
      return false;
    }
  }, []);

  const unitOptions: ToggleOption<MetalUnit>[] = [
    { value: "tola", label: "Tola" },
    { value: "grams", label: "Grams" },
  ];

  // Perform live calculation
  const result: ZakatCalculationResult = calculateZakat({
    cashInHand: cashNum,
    bankSavings: bankNum,
    goldUnit,
    goldQuantity: goldQtyNum,
    goldRatePerTola: goldRateNum,
    goldPurity,
    silverUnit,
    silverQuantity: silverQtyNum,
    silverRatePerTola: silverRateNum,
    businessStock: businessNum,
    investments: investmentsNum,
    debtsToDeduct: debtsNum,
    alreadyPaid: alreadyPaidNum,
  });

  const hasAnyInput =
    cashNum > 0 ||
    bankNum > 0 ||
    goldQtyNum > 0 ||
    silverQtyNum > 0 ||
    businessNum > 0 ||
    investmentsNum > 0;

  // Secondary Results for ResultPanel
  const secondaryResults: SecondaryResult[] = [
    {
      label: "Net Zakatable Wealth — Kul qabil-e-zakat dolat",
      value: formatRupees(result.netZakatableWealth),
      subtext: `Total assets ${formatRupees(result.totalGrossWealth)} minus debts ${formatRupees(result.totalDebts)}`,
    },
    {
      label: "Applicable Nisab Threshold",
      value: formatRupees(result.nisabThreshold),
      subtext: result.nisabUsed === "silver" ? "Silver standard (52.5 tola)" : "Gold standard (7.5 tola)",
      highlight: true,
    },
    {
      label: "Zakat Already Paid",
      value: formatRupees(result.alreadyPaid),
      subtext: "Bank auto-deduction or prior charity",
    },
    {
      label: "Remaining Zakat Payable",
      value: formatRupees(result.remainingDue),
      subtext: "To be paid to eligible recipients",
    },
  ];

  const summaryData = React.useMemo(() => {
    return buildZakatSummaryData({
      cashInHand: cashNum,
      bankSavings: bankNum,
      goldQuantity: goldQtyNum,
      goldUnit,
      goldPurity,
      goldRatePerTola: goldRateNum,
      silverQuantity: silverQtyNum,
      silverUnit,
      silverRatePerTola: silverRateNum,
      businessStock: businessNum,
      investments: investmentsNum,
      debtsToDeduct: debtsNum,
      result,
      language: lang,
    });
  }, [
    cashNum, bankNum, goldQtyNum, goldUnit, goldPurity, goldRateNum,
    silverQtyNum, silverUnit, silverRateNum, businessNum, investmentsNum,
    debtsNum, result, lang
  ]);

  const copySummaryText = React.useMemo(() => {
    return buildWhatsAppText(summaryData, lang);
  }, [summaryData, lang]);

  // Asset Breakdown Rows
  const breakdownColumns: BreakdownColumn[] = [
    { key: "category", header: "Asset / Deduction Item" },
    { key: "detail", header: "Description / Quantity" },
    { key: "value", header: "Valuation (PKR)", align: "right" },
  ];

  const breakdownRows: BreakdownRow[] = [
    ...result.assetBreakdown
      .filter((item) => item.grossValue > 0)
      .map((item, idx) => ({
        id: `asset-${idx}`,
        cells: {
          category: <span className="font-semibold text-primary">{item.category}</span>,
          detail: <span className="text-xs text-appText-muted">{item.detail}</span>,
          value: formatRupees(item.grossValue, { prefix: false }),
        },
      })),
    ...(result.totalDebts > 0
      ? [
          {
            id: "debts",
            cells: {
              category: <span className="font-semibold text-red-700">Less: Deductible Debts</span>,
              detail: <span className="text-xs text-red-600">Immediate liabilities due</span>,
              value: `-${formatRupees(result.totalDebts, { prefix: false })}`,
            },
          },
        ]
      : []),
  ];

  // Custom Top Section: Government Bank Auto-Deduction Box
  const customTopSection = (
    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border border-amber-300 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-amber-950 space-y-2 shadow-[0_4px_20px_-2px_rgba(217,119,6,0.08)]">
      <div className="flex flex-wrap items-center gap-2.5 min-w-0">
        <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wider shadow-2xs shrink-0">
          Official Notification
        </span>
        <span className="font-extrabold text-primary text-sm sm:text-base break-words">
          Government Bank Deduction Nisab 2026: {formatRupees(zakatRates.governmentBankNisab2026.amount)}
        </span>
      </div>
      <p className="text-amber-900 leading-relaxed font-medium">
        {zakatRates.governmentBankNisab2026.explanation} Notified by the Ministry of Poverty Alleviation & SBP ({zakatRates.governmentBankNisab2026.circular}).
      </p>
    </div>
  );

  const calculatorInputs = (
    <div className="space-y-6">
      {/* =========================================================================
          STEP 1: CASH & BANK (OPEN BY DEFAULT)
         ========================================================================= */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
            <span>Step 1: Cash &amp; Bank</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExample}
              className="text-xs font-bold text-accent hover:text-accent-dark px-2.5 py-1 rounded-lg bg-white border border-accent/30 shadow-2xs cursor-pointer flex items-center gap-1 transition-colors active:scale-98"
            >
              <span>💡</span>
              <span>{lang === "roman" ? "Example try karein" : "Try an example"}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep1Open(!step1Open)}
              className="text-xs font-bold text-accent hover:text-accent-dark px-3 py-1 rounded-lg bg-white border border-accent/30 shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>{step1Open ? "Collapse" : "Expand"}</span>
              <span>{step1Open ? "▲" : "▼"}</span>
            </button>
          </div>
        </div>
        {step1Open && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
            <MoneyInput
              id="cash-input"
              label="Cash in Hand — Naqad raqam"
              value={cashRaw}
              onChange={(r, v) => {
                setCashRaw(r);
                setCashNum(v);
              }}
              placeholder="e.g. 500,000"
            />
            <MoneyInput
              id="bank-input"
              label="Bank Savings / Deposits — Bank balance"
              value={bankRaw}
              onChange={(r, v) => {
                setBankRaw(r);
                setBankNum(v);
              }}
              placeholder="e.g. 200,000"
            />
          </div>
        )}
      </div>

      {/* =========================================================================
          STEP 2: GOLD & SILVER (COLLAPSED BY DEFAULT, EXPANDABLE)
         ========================================================================= */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Step 2: Gold &amp; Silver</span>
          </h3>
          <button
            type="button"
            onClick={() => setStep2Open(!step2Open)}
            className="text-xs font-bold text-accent hover:text-accent-dark px-3 py-1 rounded-lg bg-white border border-accent/30 shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>{step2Open ? "Collapse" : "Expand"}</span>
            <span>{step2Open ? "▲" : "▼"}</span>
          </button>
        </div>

        {step2Open ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            {/* Gold Input */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gold-quantity" className="block text-xs font-bold text-primary mb-1.5">
                    Gold Quantity — Sone ki miqdaar
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-xs focus-within:ring-2 focus-within:ring-accent focus-within:border-accent overflow-hidden transition-all">
                    <input
                      id="gold-quantity"
                      type="number"
                      min="0"
                      step="any"
                      value={goldQtyRaw}
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.select();
                      }}
                      onChange={(e) => {
                        setGoldQtyRaw(e.target.value);
                        setGoldQtyNum(parseFloat(e.target.value) || 0);
                      }}
                      className="flex-1 min-w-0 px-3.5 py-2.5 min-h-[46px] text-base font-semibold text-slate-900 bg-transparent focus:outline-none"
                      placeholder="e.g. 10"
                    />
                    <div
                      role="radiogroup"
                      aria-label="Gold Unit"
                      className="flex items-center p-1 bg-slate-100/90 rounded-lg m-1 border border-slate-200/80 shrink-0 gap-0.5"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={goldUnit === "tola"}
                        onClick={() => setGoldUnit("tola")}
                        className={`min-h-[34px] px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap select-none ${
                          goldUnit === "tola"
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 hover:text-primary hover:bg-white/70"
                        }`}
                      >
                        Tola
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={goldUnit === "grams"}
                        onClick={() => setGoldUnit("grams")}
                        className={`min-h-[34px] px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap select-none ${
                          goldUnit === "grams"
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 hover:text-primary hover:bg-white/70"
                        }`}
                      >
                        Grams
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="gold-rate-per-tola" className="block text-xs font-bold text-primary mb-1.5">
                    Today&apos;s Gold Rate / Tola
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 select-none">
                      Rs
                    </span>
                    <input
                      id="gold-rate-per-tola"
                      type="text"
                      value={goldRateRaw}
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.select();
                      }}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[, \s]/g, "");
                        setGoldRateRaw(e.target.value);
                        setGoldRateNum(parseFloat(cleaned) || 0);
                      }}
                      className="w-full pl-10 pr-14 py-2.5 min-h-[46px] rounded-xl border border-slate-200 text-base font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-xs"
                      placeholder={`e.g. ${ratesData.goldPerTolaPKR.toFixed(2)}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">
                      /tola
                    </span>
                  </div>
                </div>
              </div>

              {/* Gold Purity Selector (Fix 4) */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-primary">
                  Gold Purity — Sone ki Purity (Karat)
                </label>
                <div
                  role="radiogroup"
                  aria-label="Gold Purity"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/90 shadow-inner-soft"
                >
                  {(
                    [
                      { value: "24k", label: "24K (100%)" },
                      { value: "22k", label: "22K (91.67%)" },
                      { value: "21k", label: "21K (87.5%)" },
                      { value: "18k", label: "18K (75%)" },
                    ] as const
                  ).map((p) => {
                    const isSelected = goldPurity === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setGoldPurity(p.value)}
                        className={`min-h-[40px] px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 flex items-center justify-center text-center cursor-pointer ${
                          isSelected
                            ? "bg-primary text-white shadow-sm scale-[1.01]"
                            : "text-slate-600 hover:text-primary hover:bg-white/80"
                        }`}
                      >
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-appText-muted font-medium">
                  {lang === "roman"
                    ? "22K/21K jewellery Pakistan mein aam hai — apni zewar par likhi hui purity muntakhib karein."
                    : "22K/21K jewellery is common in Pakistan — select the purity stamped on your jewellery."}
                </p>
              </div>

              <div className="text-[11px] text-amber-900 font-medium bg-amber-50/90 p-2.5 rounded-lg border border-amber-200/80">
                <p>
                  {!isOnline
                    ? `Offline — rates from ${ratesData.lastUpdatedLabel}. Gold: Rs ${ratesData.goldPerTolaPKR.toFixed(2)}/tola. Stored locally on device.`
                    : lang === "roman"
                    ? `Live rate — updated ${ratesData.lastUpdatedLabel}. Gold: Rs ${ratesData.goldPerTolaPKR.toFixed(2)}/tola. Ye international spot price se hisab hai — Sarafa official rate se thoda farq ho sakta hai.`
                    : `Live rate — updated ${ratesData.lastUpdatedLabel}. Gold: Rs ${ratesData.goldPerTolaPKR.toFixed(2)}/tola. Calculated from international spot price — may differ slightly from Sarafa official rate.`}
                </p>
              </div>
            </div>

            {/* Silver Input */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="silver-quantity" className="block text-xs font-bold text-primary mb-1.5">
                    Silver Quantity — Chandi ki miqdaar
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-xs focus-within:ring-2 focus-within:ring-accent focus-within:border-accent overflow-hidden transition-all">
                    <input
                      id="silver-quantity"
                      type="number"
                      min="0"
                      step="any"
                      value={silverQtyRaw}
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.select();
                      }}
                      onChange={(e) => {
                        setSilverQtyRaw(e.target.value);
                        setSilverQtyNum(parseFloat(e.target.value) || 0);
                      }}
                      className="flex-1 min-w-0 px-3.5 py-2.5 min-h-[46px] text-base font-semibold text-slate-900 bg-transparent focus:outline-none"
                      placeholder="e.g. 52.5"
                    />
                    <div
                      role="radiogroup"
                      aria-label="Silver Unit"
                      className="flex items-center p-1 bg-slate-100/90 rounded-lg m-1 border border-slate-200/80 shrink-0 gap-0.5"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={silverUnit === "tola"}
                        onClick={() => setSilverUnit("tola")}
                        className={`min-h-[34px] px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap select-none ${
                          silverUnit === "tola"
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 hover:text-primary hover:bg-white/70"
                        }`}
                      >
                        Tola
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={silverUnit === "grams"}
                        onClick={() => setSilverUnit("grams")}
                        className={`min-h-[34px] px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap select-none ${
                          silverUnit === "grams"
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 hover:text-primary hover:bg-white/70"
                        }`}
                      >
                        Grams
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="silver-rate-per-tola" className="block text-xs font-bold text-primary mb-1.5">
                    Today&apos;s Silver Rate / Tola
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 select-none">
                      Rs
                    </span>
                    <input
                      id="silver-rate-per-tola"
                      type="text"
                      value={silverRateRaw}
                      onFocus={(e) => {
                        if (e.target.value === "0") e.target.select();
                      }}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[, \s]/g, "");
                        setSilverRateRaw(e.target.value);
                        setSilverRateNum(parseFloat(cleaned) || 0);
                      }}
                      className="w-full pl-10 pr-14 py-2.5 min-h-[46px] rounded-xl border border-slate-200 text-base font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-accent transition-all shadow-xs"
                      placeholder={`e.g. ${ratesData.silverPerTolaPKR.toFixed(2)}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none">
                      /tola
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-amber-900 font-medium bg-amber-50/90 p-2.5 rounded-lg border border-amber-200/80">
                <p>
                  {!isOnline
                    ? `Offline — rates from ${ratesData.lastUpdatedLabel}. Silver: Rs ${ratesData.silverPerTolaPKR.toFixed(2)}/tola. Stored locally on device.`
                    : lang === "roman"
                    ? `Live rate — updated ${ratesData.lastUpdatedLabel}. Silver: Rs ${ratesData.silverPerTolaPKR.toFixed(2)}/tola. Ye international spot price se hisab hai — Sarafa official rate se thoda farq ho sakta hai.`
                    : `Live rate — updated ${ratesData.lastUpdatedLabel}. Silver: Rs ${ratesData.silverPerTolaPKR.toFixed(2)}/tola. Calculated from international spot price — may differ slightly from Sarafa official rate.`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            {"Optional: Click \"Expand\" to declare jewellery, bars, or coins. (Current: " + goldQtyNum + " " + goldUnit + " gold, " + silverQtyNum + " " + silverUnit + " silver, 2.5% Zakat Rate, 52.5 tola silver nisab)."}
          </p>
        )}
      </div>

      {/* =========================================================================
          STEP 3: BUSINESS, INVESTMENTS & DEBTS (COLLAPSED BY DEFAULT, EXPANDABLE)
         ========================================================================= */}
      <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">3</span>
            <span>Step 3: Business, Investments &amp; Debts</span>
          </h3>
          <button
            type="button"
            onClick={() => setStep3Open(!step3Open)}
            className="text-xs font-bold text-accent hover:text-accent-dark px-3 py-1 rounded-lg bg-white border border-accent/30 shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>{step3Open ? "Collapse" : "Expand"}</span>
            <span>{step3Open ? "▲" : "▼"}</span>
          </button>
        </div>

        {step3Open ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MoneyInput
                id="business-input"
                label="Business Stock / Goods for Trade — Karobari maal-e-tijarat"
                value={businessRaw}
                onChange={(r, v) => {
                  setBusinessRaw(r);
                  setBusinessNum(v);
                }}
                placeholder="e.g. 300,000"
              />
              <MoneyInput
                id="investments-input"
                label="Shares & Financial Investments — Shares aur sarmayakari"
                value={investmentsRaw}
                onChange={(r, v) => {
                  setInvestmentsRaw(r);
                  setInvestmentsNum(v);
                }}
                placeholder="e.g. 150,000"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <MoneyInput
                id="debts-input"
                label="Debts / Liabilities to Deduct — Wajib-ul-ada qarz (minus honge)"
                value={debtsRaw}
                onChange={(r, v) => {
                  setDebtsRaw(r);
                  setDebtsNum(v);
                }}
                placeholder="e.g. 50,000"
                hint="Debts due immediately or within this year"
              />
              <MoneyInput
                id="already-paid-input"
                label="Zakat Already Paid This Year — Pehle se ada shuda Zakat"
                value={alreadyPaidRaw}
                onChange={(r, v) => {
                  setAlreadyPaidRaw(r);
                  setAlreadyPaidNum(v);
                }}
                placeholder="e.g. 5,000"
                hint="Bank 1 Ramadan deduction or advance charity"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            Optional: Click &quot;+ Add Business &amp; Debts&quot; to enter commercial stock, mutual funds, or deductible liabilities.
          </p>
        )}
      </div>
    </div>
  );

  const resultPanel = (
    <div className="space-y-3">
      <ResultPanel
        title="Zakat Result (2.5%)"
        mainLabel="Total Zakat Due (Annual)"
        mainValue={formatRupees(result.zakatDue)}
        mainSubtext={result.nisabExplanation}
        statusBadge={{
          text: result.statusLabel,
          variant: result.isZakatDue ? "due" : "not_due",
        }}
        secondaryResults={secondaryResults}
        copySummaryText={copySummaryText}
        isEmpty={!hasAnyInput}
        footnote={zakatRates.disclaimerText}
        onReset={handleReset}
        onExample={handleExample}
      />

      {/* Live Rate Timestamp / 48-Hour Stale Warning */}
      {isStale ? (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <span className="text-amber-600">⚠️</span>
            <span>
              {lang === "roman"
                ? "Rates 48 ghante se purane hain — barah-e-karam aaj ka Sarafa rate khud darj karein."
                : "Rates are over 48 hours old — please enter today's local Sarafa rate manually."}
            </span>
          </div>
        </div>
      ) : !isOnline ? (
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>
              <strong className="text-amber-950">Offline — rates from {ratesData.lastUpdatedLabel}</strong>
              <span className="mx-1.5 text-amber-500">•</span>
              <span className="text-amber-800">Stored on device</span>
            </span>
          </span>
          <span className="text-[11px] text-amber-700 font-medium">
            Cached copy
          </span>
        </div>
      ) : (
        <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              <strong className="text-slate-800">Rates updated:</strong> {ratesData.lastUpdatedLabel}
              <span className="mx-1.5 text-slate-400">•</span>
              <strong className="text-slate-800">Last checked:</strong> {ratesData.lastCheckedLabel || ratesData.lastUpdatedLabel}
            </span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Source: gold-api.com + open.er-api.com
          </span>
        </div>
      )}

      {/* Cross-link to Ushr Calculator (Part 4) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-lime-50/60 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="text-xs sm:text-sm text-slate-800 leading-snug">
          <span className="font-bold text-primary block text-xs uppercase tracking-wider mb-0.5">
            {lang === "roman" ? "Zameen Ki Paidawar (Crops)" : "Agricultural Produce (Crops)"}
          </span>
          {lang === "roman"
            ? "Kya aapki fasal par Ushr banta hai? Ushr fasal uthte hi dena hota hai — 2.5% wali Zakat se alag hisab hai."
            : "Do you owe Ushr on your agricultural harvest? Ushr is due at harvest time — calculated separately from 2.5% wealth Zakat."}
        </div>
        <Link
          href="/ushr-calculator"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-slate-800 rounded-xl shrink-0 transition-colors shadow-xs"
        >
          <span>Ushr Calculator</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );

  const isAbove = result.nisabThreshold > 0 && result.netZakatableWealth >= result.nisabThreshold;
  const nisabLabelEn = result.nisabUsed === "gold" ? "gold, 7.5 tola" : "silver, 52.5 tola";
  const nisabLabelRoman = result.nisabUsed === "gold" ? "sona, 7.5 tola" : "chandi, 52.5 tola";

  const purityInfo = GOLD_PURITY_CONFIG[goldPurity] || GOLD_PURITY_CONFIG["24k"];
  const goldValuationRoman =
    goldQtyNum > 0
      ? ` Sona: ${goldQtyNum} ${goldUnit} ${purityInfo.karat}K @ Rs ${goldRateNum.toFixed(2)}/tola${goldPurity !== "24k" ? ` × ${purityInfo.percent}` : ""} = Rs ${formatRupees(result.goldValue, { prefix: false })}.`
      : "";
  const goldValuationEn =
    goldQtyNum > 0
      ? ` Gold: ${goldQtyNum} ${goldUnit} ${purityInfo.karat}K @ Rs ${goldRateNum.toFixed(2)}/tola${goldPurity !== "24k" ? ` × ${purityInfo.percent}` : ""} = Rs ${formatRupees(result.goldValue, { prefix: false })}.`
      : "";

  const nisabCalcNoteRoman =
    result.nisabUsed === "silver"
      ? ` (52.5 tola chandi @ Rs ${silverRateNum.toFixed(2)}/tola = Rs ${formatRupees(result.nisabThreshold, { prefix: false })})`
      : ` (7.5 tola sona @ Rs ${goldRateNum.toFixed(2)}/tola = Rs ${formatRupees(result.nisabThreshold, { prefix: false })})`;

  const nisabCalcNoteEn =
    result.nisabUsed === "silver"
      ? ` (52.5 tola silver @ Rs ${silverRateNum.toFixed(2)}/tola = Rs ${formatRupees(result.nisabThreshold, { prefix: false })})`
      : ` (7.5 tola gold @ Rs ${goldRateNum.toFixed(2)}/tola = Rs ${formatRupees(result.nisabThreshold, { prefix: false })})`;

  const explanationBox = (
    <ExplanationBox
      type="islamic"
      romanUrduText={`Aapke kul zakatable assets Rs ${formatRupees(result.totalGrossWealth, { prefix: false })} hain.${goldValuationRoman} Aapki eligible deductions (qarz) Rs ${formatRupees(result.totalDebts, { prefix: false })} hain. Is tarah aapki net zakatable wealth Rs ${formatRupees(result.netZakatableWealth, { prefix: false })} banti hai. Nisab (${nisabLabelRoman}) aaj ke rate par Rs ${formatRupees(result.nisabThreshold, { prefix: false })}${nisabCalcNoteRoman} hai. ${isAbove ? "Aapki wealth nisab se zyada hai, is liye Zakat farz hai." : "Aapki wealth nisab se kam hai, is liye is waqt Zakat farz nahi hai."} 2.5% ke hisab se aapki Zakat Rs ${formatRupees(result.zakatDue, { prefix: false })} banti hai.`}
      englishText={`Your total zakatable assets are Rs ${formatRupees(result.totalGrossWealth, { prefix: false })}.${goldValuationEn} Your eligible deductions (debts) are Rs ${formatRupees(result.totalDebts, { prefix: false })}, giving net zakatable wealth of Rs ${formatRupees(result.netZakatableWealth, { prefix: false })}. The nisab (${nisabLabelEn}) at today's rate is Rs ${formatRupees(result.nisabThreshold, { prefix: false })}${nisabCalcNoteEn}. ${isAbove ? "Your wealth is above the nisab, so Zakat is due." : "Your wealth is below the nisab, so no Zakat is due right now."} At 2.5%, your Zakat due is Rs ${formatRupees(result.zakatDue, { prefix: false })}.`}
      extraBullets={[
        {
          en: "Zakat is due from every adult Muslim who owns wealth at or above nisab for one full lunar year (Hawl).",
          romanUrdu:
            "Zakat har us baligh Musalman par farz hai jis ki daulat nisab ke barabar ya zyada ho aur us par poora ek qamri saal (hawl) guzar chuka ho.",
        },
        {
          en: "Zakat goes to the poor, the needy, and the other groups named in the Quran (9:60) — not to build mosques or pay salaries.",
          romanUrdu:
            "Zakat ghareebon, miskeeno aur Quran (9:60) mein bayan kiye gaye deegar mustahqeen ko di jati hai — masjid banane ya tankhwah dene ke liye nahi.",
        },
      ]}
      referenceContentEn={
        <div className="space-y-1.5">
          <p>• <strong>Quran 9:103</strong> — &quot;Take from their wealth a charity by which you purify them and cause them increase.&quot; (Sahih International translation)</p>
          <p>• <strong>Quran 9:60</strong> — Zakat is for the poor, the needy, and the other eligible groups named in this verse.</p>
          <p>• <strong>Quran 2:43</strong> — &quot;Establish prayer and give Zakat.&quot;</p>
          <p>• <strong>Hadith:</strong> &quot;Islam is built upon five [pillars]… and giving Zakat.&quot; — Sahih al-Bukhari 8; Sahih Muslim 16.</p>
          <p>• <strong>Nisab:</strong> 87.48g gold (7.5 tola) or 612.36g silver (52.5 tola). Hanafi rule in Pakistan: silver nisab for mixed wealth.</p>
          <p>• <strong>Government bank nisab 2026 (Rs 503,529)</strong> is for bank auto-deduction only — do not mix it with personal nisab.</p>
        </div>
      }
      referenceContentRoman={
        <div className="space-y-1.5">
          <p>• <strong>Quran 9:103</strong> — &quot;In ke amwaal mein se sadqa (zakat) wasool karein jis se aap inhein paak karein aur barkat dein.&quot; (Surah At-Tawbah)</p>
          <p>• <strong>Quran 9:60</strong> — Zakat ghareebon, miskeeno aur aayat mein bayan kiye gaye deegar mustahqeen ke liye hai.</p>
          <p>• <strong>Quran 2:43</strong> — &quot;Namaz qaim karo aur zakat ada karo.&quot;</p>
          <p>• <strong>Hadith:</strong> &quot;Islam ki bunyad paanch sutoonon par hai... aur zakat ada karna.&quot; — Sahih al-Bukhari 8; Sahih Muslim 16.</p>
          <p>• <strong>Nisab:</strong> 87.48g sona (7.5 tola) ya 612.36g chandi (52.5 tola). Pakistan mein Hanafi qanoon: mili juli daulat ke liye chandi ka nisab lagta hai.</p>
          <p>• <strong>Hukoomati bank nisab 2026 (Rs 503,529)</strong> sirf bank ki auto-deduction ke liye hai — zaati nisab se mix na karein.</p>
        </div>
      }
    />
  );

  const breakdownSection = hasAnyInput ? (
    <BreakdownTable
      title="Asset & Wealth Valuation Breakdown"
      subtitle="Sum of all liquid, metal, and business assets minus deductible debts."
      columns={breakdownColumns}
      rows={breakdownRows}
      totalLabel="Net Zakatable Wealth"
      totalValue={formatRupees(result.netZakatableWealth)}
    />
  ) : null;

  const exampleGoldVal = roundToPaisa(2 * goldRateNum);
  const exampleGrossVal = roundToPaisa(500000 + exampleGoldVal);
  const exampleNetVal = roundToPaisa(exampleGrossVal - 100000);
  const exampleNisabVal = Math.round(52.5 * silverRateNum);
  const exampleZakatVal = roundToPaisa(exampleNetVal * 0.025);

  const dynamicContent = {
    ...content,
    howToUseSteps: [
      "Enter your cash, bank balances, business trade goods, and investment valuations.",
      "Rates update automatically every day at 12:00 PKT from the international spot price (gold-api.com + open.er-api.com); the page shows the last update time.",
      "Add any short-term deductible liabilities/debts to calculate your Net Zakatable Wealth.",
      "Check whether your net wealth crosses the dynamic Nisab threshold, see Zakat due, and subtract any Zakat already paid.",
    ],
    workedExample: {
      ...content.workedExample,
      bulletPoints: [
        "Cash in Hand + Bank: Rs 500,000",
        `Gold: 2 tola @ market rate Rs ${goldRateNum.toFixed(2)}/tola = Rs ${formatRupees(exampleGoldVal, { prefix: false })}`,
        `Gross Zakatable Assets = Rs ${formatRupees(exampleGrossVal, { prefix: false })}`,
        "Less Debts to Deduct = Rs 100,000",
        `Net Zakatable Wealth = Rs ${formatRupees(exampleNetVal, { prefix: false })}`,
        `Silver Nisab Threshold (52.5 tola @ Rs ${silverRateNum.toFixed(2)}/tola) = Rs ${formatRupees(exampleNisabVal, { prefix: false })}`,
        `Status: Zakat Due (Net Wealth Rs ${formatRupees(exampleNetVal, { prefix: false })} exceeds Nisab Rs ${formatRupees(exampleNisabVal, { prefix: false })})`,
        `Zakat Due (2.5%) = Rs ${formatRupees(exampleNetVal, { prefix: false })} × 0.025 = Rs ${formatRupees(exampleZakatVal, { prefix: false })}`,
      ],
    },
  };

  return (
    <CalculatorShell
      content={dynamicContent}
      customTopSection={customTopSection}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      explanationBox={explanationBox}
      breakdownTable={breakdownSection}
      printReport={<PrintReport data={summaryData} language={lang} />}
    />
  );
}
