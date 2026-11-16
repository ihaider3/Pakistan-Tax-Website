"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import ExplanationBox from "@/components/ExplanationBox";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import { calculatorPages } from "@/content/pages";
import { calculateZakat, ZakatCalculationResult } from "@/lib/calc/zakat";
import { formatRupees } from "@/lib/calc/money";
import { zakatRates } from "@/lib/rates/zakat";

type MetalUnit = "tola" | "grams";

export default function ZakatCalculatorPage() {
  const content = calculatorPages.zakat;

  // Step 2 & 3 Collapsible visibility
  const [step2Open, setStep2Open] = useState<boolean>(false);
  const [step3Open, setStep3Open] = useState<boolean>(false);

  // Asset inputs state — all initialized to 0 per user requirement
  const [cashRaw, setCashRaw] = useState<string>("0");
  const [cashNum, setCashNum] = useState<number>(0);

  const [bankRaw, setBankRaw] = useState<string>("0");
  const [bankNum, setBankNum] = useState<number>(0);

  const [goldUnit, setGoldUnit] = useState<MetalUnit>("tola");
  const [goldQtyRaw, setGoldQtyRaw] = useState<string>("0");
  const [goldQtyNum, setGoldQtyNum] = useState<number>(0);
  const [goldRateRaw, setGoldRateRaw] = useState<string>("0");
  const [goldRateNum, setGoldRateNum] = useState<number>(0);

  const [silverUnit, setSilverUnit] = useState<MetalUnit>("tola");
  const [silverQtyRaw, setSilverQtyRaw] = useState<string>("0");
  const [silverQtyNum, setSilverQtyNum] = useState<number>(0);
  const [silverRateRaw, setSilverRateRaw] = useState<string>("0");
  const [silverRateNum, setSilverRateNum] = useState<number>(0);

  const [businessRaw, setBusinessRaw] = useState<string>("0");
  const [businessNum, setBusinessNum] = useState<number>(0);

  const [investmentsRaw, setInvestmentsRaw] = useState<string>("0");
  const [investmentsNum, setInvestmentsNum] = useState<number>(0);

  const [debtsRaw, setDebtsRaw] = useState<string>("0");
  const [debtsNum, setDebtsNum] = useState<number>(0);

  const [alreadyPaidRaw, setAlreadyPaidRaw] = useState<string>("0");
  const [alreadyPaidNum, setAlreadyPaidNum] = useState<number>(0);

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

  const copySummaryText = `Zakat Status: ${result.statusLabel} | Zakat Due: ${formatRupees(result.zakatDue)} | Remaining: ${formatRupees(result.remainingDue)} (Net Wealth: ${formatRupees(result.netZakatableWealth)} vs Nisab: ${formatRupees(result.nisabThreshold)}) — Pakistan Finance Calculators`;

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
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Open
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyInput
            id="cash-input"
            label="Cash in Hand — Naqad raqam"
            value={cashRaw}
            onChange={(r, v) => {
              setCashRaw(r);
              setCashNum(v);
            }}
            placeholder="0"
          />
          <MoneyInput
            id="bank-input"
            label="Bank Savings / Deposits — Bank balance"
            value={bankRaw}
            onChange={(r, v) => {
              setBankRaw(r);
              setBankNum(v);
            }}
            placeholder="0"
          />
        </div>
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
            <span>{step2Open ? "Collapse Step 2" : "+ Add Gold / Silver"}</span>
            <span>{step2Open ? "▲" : "▼"}</span>
          </button>
        </div>

        {step2Open ? (
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            {/* Gold Input */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label htmlFor="gold-quantity" className="block text-xs font-bold text-primary mb-1">
                    Gold Quantity — Sone ki miqdaar
                  </label>
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
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-slate-200 text-base font-semibold bg-white focus:ring-2 focus:ring-accent"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Toggle<MetalUnit>
                    options={unitOptions}
                    value={goldUnit}
                    onChange={(u) => setGoldUnit(u)}
                  />
                </div>
                <div className="sm:col-span-4">
                  <label htmlFor="gold-rate-per-tola" className="block text-xs font-bold text-primary mb-1">
                    Today&apos;s Gold Rate / Tola
                  </label>
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
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-slate-200 text-base font-semibold bg-white focus:ring-2 focus:ring-accent"
                    placeholder="e.g. 400,000"
                  />
                </div>
              </div>
              <p className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded border border-amber-200/70">
                Example rate — enter today&apos;s Sarafa rate / Misal rate hai — aaj ka Sarafa rate likhein.
              </p>
            </div>

            {/* Silver Input */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label htmlFor="silver-quantity" className="block text-xs font-bold text-primary mb-1">
                    Silver Quantity — Chandi ki miqdaar
                  </label>
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
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-slate-200 text-base font-semibold bg-white focus:ring-2 focus:ring-accent"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Toggle<MetalUnit>
                    options={unitOptions}
                    value={silverUnit}
                    onChange={(u) => setSilverUnit(u)}
                  />
                </div>
                <div className="sm:col-span-4">
                  <label htmlFor="silver-rate-per-tola" className="block text-xs font-bold text-primary mb-1">
                    Today&apos;s Silver Rate / Tola
                  </label>
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
                    className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-slate-200 text-base font-semibold bg-white focus:ring-2 focus:ring-accent"
                    placeholder="e.g. 5,500"
                  />
                </div>
              </div>
              <p className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded border border-amber-200/70">
                Example rate — enter today&apos;s Sarafa rate / Misal rate hai — aaj ka Sarafa rate likhein.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            Optional: Click &quot;+ Add Gold / Silver&quot; to declare jewellery, bars, or coins. (Current: {goldQtyNum} {goldUnit} gold, {silverQtyNum} {silverUnit} silver).
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
            <span>{step3Open ? "Collapse Step 3" : "+ Add Business & Debts"}</span>
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
                placeholder="0"
              />
              <MoneyInput
                id="investments-input"
                label="Shares & Financial Investments — Shares aur sarmayakari"
                value={investmentsRaw}
                onChange={(r, v) => {
                  setInvestmentsRaw(r);
                  setInvestmentsNum(v);
                }}
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
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
      emptyPrompt="Enter an amount above to see your result — Upar raqam likhein, result foran nazar aayega."
      footnote={zakatRates.disclaimerText}
    />
  );

  const isAbove = result.nisabThreshold > 0 && result.netZakatableWealth >= result.nisabThreshold;

  const explanationBox = (
    <ExplanationBox
      type="islamic"
      imageSrc="/images/explanation/zakat.webp"
      imageAlt="Giving Zakat charity with gold coins"
      englishText={`Zakat is 2.5% of your net zakatable wealth. Your net wealth is Rs ${formatRupees(result.netZakatableWealth, { prefix: false })} (total assets Rs ${formatRupees(result.totalGrossWealth, { prefix: false })} minus debts Rs ${formatRupees(result.totalDebts, { prefix: false })}). Your nisab is Rs ${formatRupees(result.nisabThreshold, { prefix: false })} (${result.nisabUsed === "gold" ? "Gold standard" : "Silver standard"}, ${result.nisabUsed === "gold" ? "7.5" : "52.5"} tola). Because Rs ${formatRupees(result.netZakatableWealth, { prefix: false })} is ${isAbove ? "above" : "below"} the nisab, your Zakat is Rs ${formatRupees(result.zakatDue, { prefix: false })} (2.5% of Rs ${formatRupees(result.netZakatableWealth, { prefix: false })}). If you already paid Rs ${formatRupees(result.alreadyPaid, { prefix: false })}, the remaining amount is Rs ${formatRupees(result.remainingDue, { prefix: false })}.`}
      urduText={
        <>
          زکوٰۃ آپ کی کل قابلِ زکوٰۃ دولت کا <span dir="ltr" className="inline-block font-sans font-semibold">2.5%</span> ہوتی ہے۔ آپ کی نیٹ دولت <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.netZakatableWealth, { prefix: false })}</span> ہے (کل اثاثے <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalGrossWealth, { prefix: false })}</span> منفی قرض <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.totalDebts, { prefix: false })}</span>)۔ آپ کا نصاب <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.nisabThreshold, { prefix: false })}</span> ہے ({result.nisabUsed === "gold" ? "سونا اسٹینڈرڈ، 7.5 تولہ" : "چاندی اسٹینڈرڈ، 52.5 تولہ"})۔ چونکہ آپ کی دولت نصاب سے {isAbove ? "زیادہ" : "کم"} ہے، اس لیے آپ پر زکوٰۃ <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.zakatDue, { prefix: false })}</span> بنتی ہے (<span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.netZakatableWealth, { prefix: false })} کا 2.5%</span>)۔ اگر آپ نے <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.alreadyPaid, { prefix: false })}</span> ادا کر دیے ہیں تو باقی <span dir="ltr" className="inline-block font-sans font-semibold">روپے {formatRupees(result.remainingDue, { prefix: false })}</span> رہ جاتے ہیں۔
        </>
      }
      urduTextPlain={`زکوٰۃ آپ کی کل قابلِ زکوٰۃ دولت کا 2.5 فیصد ہوتی ہے۔ آپ کی نیٹ دولت روپے ${formatRupees(result.netZakatableWealth, { prefix: false })} ہے (کل اثاثے روپے ${formatRupees(result.totalGrossWealth, { prefix: false })} منفی قرض روپے ${formatRupees(result.totalDebts, { prefix: false })})۔ آپ کا نصاب روپے ${formatRupees(result.nisabThreshold, { prefix: false })} ہے (${result.nisabUsed === "gold" ? "سونا اسٹینڈرڈ، 7.5 تولہ" : "چاندی اسٹینڈرڈ، 52.5 تولہ"})۔ چونکہ آپ کی دولت نصاب سے ${isAbove ? "زیادہ" : "کم"} ہے، اس لیے آپ پر زکوٰۃ روپے ${formatRupees(result.zakatDue, { prefix: false })} بنتی ہے (روپے ${formatRupees(result.netZakatableWealth, { prefix: false })} کا 2.5 فیصد)۔ اگر آپ نے روپے ${formatRupees(result.alreadyPaid, { prefix: false })} ادا کر دیے ہیں تو باقی روپے ${formatRupees(result.remainingDue, { prefix: false })} رہ جاتے ہیں۔`}
      extraBullets={[
        {
          en: "Zakat is due from every adult Muslim who owns wealth at or above nisab for one full lunar year (Hawl).",
          urdu: "زکوٰۃ ہر اس بالغ مسلمان پر فرض ہے جس کی دولت نصاب کے برابر یا زیادہ ہو اور اس پر پورا ایک قمری سال (حول) گزر چکا ہو۔",
          urduTextPlain: "زکوٰۃ ہر اس بالغ مسلمان پر فرض ہے جس کی دولت نصاب کے برابر یا زیادہ ہو اور اس پر پورا ایک قمری سال (حول) گزر چکا ہو۔",
        },
        {
          en: "Zakat goes to the poor, the needy, and the other groups named in the Quran (9:60) — not to build mosques or pay salaries.",
          urdu: "زکوٰۃ غریبوں، مسکینوں اور قرآن (9:60) میں بتائے گئے مستحق لوگوں کو دی جاتی ہے — مسجد بنانے یا تنخواہ دینے کے لیے نہیں۔",
          urduTextPlain: "زکوٰۃ غریبوں، مسکینوں اور قرآن (9:60) میں بتائے گئے مستحق لوگوں کو دی جاتی ہے — مسجد بنانے یا تنخواہ دینے کے لیے نہیں۔",
        },
      ]}
      referenceContent={
        <div className="space-y-1.5">
          <p>• <strong>Quran 9:103</strong> — &quot;Take from their wealth a charity by which you purify them and cause them increase.&quot; (Sahih International translation)</p>
          <p>• <strong>Quran 9:60</strong> — Zakat is for the poor, the needy, and the other eligible groups named in this verse.</p>
          <p>• <strong>Quran 2:43</strong> — &quot;Establish prayer and give Zakat.&quot;</p>
          <p>• <strong>Hadith:</strong> &quot;Islam is built upon five [pillars]… and giving Zakat.&quot; — Sahih al-Bukhari 8; Sahih Muslim 16.</p>
          <div dir="rtl" lang="ur" className="font-urdu text-right text-slate-800 pr-2">
            • &quot;اسلام پانچ [ستونوں] پر قائم ہے… اور زکوٰۃ دینا۔&quot; — صحیح البخاری 8؛ صحیح مسلم 16 (Sahih al-Bukhari 8; Sahih Muslim 16)
          </div>
          <p>• <strong>Nisab:</strong> 87.48g gold (7.5 tola) or 612.36g silver (52.5 tola). Hanafi rule in Pakistan: silver nisab for mixed wealth.</p>
          <div dir="rtl" lang="ur" className="font-urdu text-right text-slate-800 pr-2">
            • نصاب: 87.48 گرام سونا (7.5 تولہ) یا 612.36 گرام چاندی (52.5 تولہ)۔ پاکستان میں حنفی اصول: ملی جلی دولت کے لیے چاندی کا نصاب۔
          </div>
          <p>• <strong>Government bank nisab 2026 (Rs 503,529)</strong> is for bank auto-deduction only — do not mix it with personal nisab.</p>
          <div dir="rtl" lang="ur" className="font-urdu text-right text-slate-800 pr-2">
            • حکومتی بینک نصاب 2026 (<span dir="ltr" className="inline-block font-sans font-semibold">روپے 503,529</span>) صرف بینک کی خودکار کٹوتی کے لیے ہے — اسے ذاتی نصاب سے نہ ملائیں۔
          </div>
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
  );

  return (
    <CalculatorShell
      content={content}
      customTopSection={customTopSection}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      explanationBox={explanationBox}
      breakdownTable={breakdownSection}
    />
  );
}
