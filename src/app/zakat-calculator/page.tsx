"use client";

import React, { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import MoneyInput from "@/components/MoneyInput";
import Toggle, { ToggleOption } from "@/components/Toggle";
import ResultPanel, { SecondaryResult } from "@/components/ResultPanel";
import BreakdownTable, { BreakdownColumn, BreakdownRow } from "@/components/BreakdownTable";
import { calculatorPages } from "@/content/pages";
import { calculateZakat, ZakatCalculationResult } from "@/lib/calc/zakat";
import { formatRupees } from "@/lib/calc/money";
import { zakatRates } from "@/lib/rates/zakat";

type MetalUnit = "tola" | "grams";

export default function ZakatCalculatorPage() {
  const content = calculatorPages.zakat;

  // Asset inputs state
  const [cashRaw, setCashRaw] = useState<string>("500000"); // Preloaded with Blueprint worked example
  const [cashNum, setCashNum] = useState<number>(500000);

  const [bankRaw, setBankRaw] = useState<string>("0");
  const [bankNum, setBankNum] = useState<number>(0);

  const [goldUnit, setGoldUnit] = useState<MetalUnit>("tola");
  const [goldQtyRaw, setGoldQtyRaw] = useState<string>("2");
  const [goldQtyNum, setGoldQtyNum] = useState<number>(2);
  const [goldRateRaw, setGoldRateRaw] = useState<string>("400000"); // User editable market rate
  const [goldRateNum, setGoldRateNum] = useState<number>(400000);

  const [silverUnit, setSilverUnit] = useState<MetalUnit>("tola");
  const [silverQtyRaw, setSilverQtyRaw] = useState<string>("0");
  const [silverQtyNum, setSilverQtyNum] = useState<number>(0);
  const [silverRateRaw, setSilverRateRaw] = useState<string>("5500"); // User editable market rate
  const [silverRateNum, setSilverRateNum] = useState<number>(5500);

  const [businessRaw, setBusinessRaw] = useState<string>("0");
  const [businessNum, setBusinessNum] = useState<number>(0);

  const [investmentsRaw, setInvestmentsRaw] = useState<string>("0");
  const [investmentsNum, setInvestmentsNum] = useState<number>(0);

  const [debtsRaw, setDebtsRaw] = useState<string>("100000");
  const [debtsNum, setDebtsNum] = useState<number>(100000);

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

  // Secondary results for ResultPanel
  const secondaryResults: SecondaryResult[] = [
    {
      label: "Total Zakatable Wealth (Net)",
      value: formatRupees(result.netZakatableWealth),
      subtext: `After deducting ${formatRupees(result.totalDebts)} liabilities`,
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
      subtext: "To be paid before year ends",
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
    <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-4 sm:p-5 text-xs sm:text-sm text-amber-950 space-y-1.5 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs uppercase tracking-wider">
          Official Notification
        </span>
        <span className="font-bold text-primary">
          Government Bank Deduction Nisab 2026: {formatRupees(zakatRates.governmentBankNisab2026.amount)}
        </span>
      </div>
      <p className="text-amber-900 leading-relaxed">
        {zakatRates.governmentBankNisab2026.explanation} Notified by the Ministry of Poverty Alleviation & SBP ({zakatRates.governmentBankNisab2026.circular}).
      </p>
    </div>
  );

  const calculatorInputs = (
    <div className="space-y-6">
      {/* Liquid Cash Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-appBorder pb-1">
          1. Cash & Bank Balances
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyInput
            id="cash-input"
            label="Cash in Hand"
            value={cashRaw}
            onChange={(r, v) => {
              setCashRaw(r);
              setCashNum(v);
            }}
            placeholder="0"
          />
          <MoneyInput
            id="bank-input"
            label="Bank Savings / Deposits"
            value={bankRaw}
            onChange={(r, v) => {
              setBankRaw(r);
              setBankNum(v);
            }}
            placeholder="0"
          />
        </div>
      </div>

      {/* Gold & Silver Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-appBorder pb-1">
          2. Gold & Silver (User-Entered Rates)
        </h3>
        <div className="bg-surface p-4 rounded-lg border border-appBorder space-y-4">
          {/* Gold Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label htmlFor="gold-quantity" className="block text-xs font-semibold text-appText mb-1">
                Gold Quantity
              </label>
              <input
                id="gold-quantity"
                type="number"
                min="0"
                step="any"
                value={goldQtyRaw}
                onChange={(e) => {
                  setGoldQtyRaw(e.target.value);
                  setGoldQtyNum(parseFloat(e.target.value) || 0);
                }}
                className="w-full px-3 py-2.5 min-h-[44px] rounded-md border border-appBorder text-base bg-white"
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
              <label htmlFor="gold-rate-per-tola" className="block text-xs font-semibold text-appText mb-1">
                Today&apos;s Gold Rate / Tola
              </label>
              <input
                id="gold-rate-per-tola"
                type="text"
                value={goldRateRaw}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[, \s]/g, "");
                  setGoldRateRaw(e.target.value);
                  setGoldRateNum(parseFloat(cleaned) || 0);
                }}
                className="w-full px-3 py-2.5 min-h-[44px] rounded-md border border-appBorder text-base bg-white"
                placeholder="400,000"
              />
            </div>
          </div>

          {/* Silver Input */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-3 border-t border-appBorder">
            <div className="sm:col-span-5">
              <label htmlFor="silver-quantity" className="block text-xs font-semibold text-appText mb-1">
                Silver Quantity
              </label>
              <input
                id="silver-quantity"
                type="number"
                min="0"
                step="any"
                value={silverQtyRaw}
                onChange={(e) => {
                  setSilverQtyRaw(e.target.value);
                  setSilverQtyNum(parseFloat(e.target.value) || 0);
                }}
                className="w-full px-3 py-2.5 min-h-[44px] rounded-md border border-appBorder text-base bg-white"
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
              <label htmlFor="silver-rate-per-tola" className="block text-xs font-semibold text-appText mb-1">
                Today&apos;s Silver Rate / Tola
              </label>
              <input
                id="silver-rate-per-tola"
                type="text"
                value={silverRateRaw}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[, \s]/g, "");
                  setSilverRateRaw(e.target.value);
                  setSilverRateNum(parseFloat(cleaned) || 0);
                }}
                className="w-full px-3 py-2.5 min-h-[44px] rounded-md border border-appBorder text-base bg-white"
                placeholder="5,500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business & Investments */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-appBorder pb-1">
          3. Business Goods & Investments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyInput
            id="business-input"
            label="Business Stock / Goods for Trade"
            value={businessRaw}
            onChange={(r, v) => {
              setBusinessRaw(r);
              setBusinessNum(v);
            }}
            placeholder="0"
          />
          <MoneyInput
            id="investments-input"
            label="Shares & Financial Investments"
            value={investmentsRaw}
            onChange={(r, v) => {
              setInvestmentsRaw(r);
              setInvestmentsNum(v);
            }}
            placeholder="0"
          />
        </div>
      </div>

      {/* Liabilities & Deductions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-appBorder pb-1">
          4. Debts & Already Paid Zakat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MoneyInput
            id="debts-input"
            label="Debts / Liabilities to Deduct"
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
            label="Zakat Already Paid This Year"
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
      emptyPrompt="Enter your assets above to compute Zakat & Nisab"
      footnote={zakatRates.disclaimerText}
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

  const romanUrduSummary = (
    <div className="bg-surface p-3.5 rounded-lg border border-appBorder">
      <span className="font-semibold text-primary block text-xs uppercase mb-1">
        Roman Urdu Khulasa:
      </span>
      <p className="text-xs sm:text-sm text-appText">
        Aap ki kul qabil-e-zakat dolat <strong>{formatRupees(result.netZakatableWealth)}</strong> banti hai. Aaj ke rates ke mutabiq Nisab threshold <strong>{formatRupees(result.nisabThreshold)}</strong> hai.{" "}
        {result.isZakatDue ? (
          <span>
            Chunkay aap ki dolat Nisab se zyada hai, is liye aap par <strong>{formatRupees(result.zakatDue)}</strong> Zakat farz banti hai (2.5%). Agar aap ne pehle kuch ada kiya hai to baqi wajib-ul-ada raqam <strong>{formatRupees(result.remainingDue)}</strong> hai.
          </span>
        ) : (
          <span>
            Chunkay aap ki dolat Nisab threshold se kam hai, is liye is waqt aap par <strong>Zakat wajib nahi</strong> hai.
          </span>
        )}
      </p>
    </div>
  );

  return (
    <CalculatorShell
      content={content}
      customTopSection={customTopSection}
      calculatorInputs={calculatorInputs}
      resultPanel={resultPanel}
      breakdownTable={breakdownSection}
      romanUrduSummary={romanUrduSummary}
    />
  );
}
