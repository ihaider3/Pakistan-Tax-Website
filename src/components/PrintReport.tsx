"use client";

import React from "react";
import { SummaryData } from "@/lib/summary";
import { siteName, siteDomain } from "@/config/site";

interface PrintReportProps {
  data: SummaryData;
  language?: "roman" | "en";
}

/**
 * PrintReport: Professional, compact one-page A4 calculation report.
 * Rendered ONLY during @media print (hidden on screen).
 */
export default function PrintReport({
  data,
  language = "roman",
}: PrintReportProps) {
  const isRoman = language === "roman";

  const domain = data.domain || siteDomain;

  const sectionHeadings = {
    details: isRoman ? "Aapki Tafseelat (Your Details)" : "Your Entered Details",
    keyValues: isRoman ? "Ahem Nateeja (Key Summary)" : "Key Summary Figures",
    breakdown: isRoman ? "Calculation Ki Tafseel (Breakdown)" : "Calculation Breakdown",
    formula: isRoman ? "Hisab Ka Tareeqa (Formula & Rate)" : "Formula & Applicable Rate",
    explanation: isRoman ? "Calculation Ki Wazahat (Explanation)" : "Calculation Explanation",
    disclaimer: isRoman ? "Qanooni / Deeni Wazahat (Notice)" : "Notice & Guidance",
  };

  return (
    <div
      id="print-report"
      className="hidden print:block w-full max-w-[190mm] mx-auto text-slate-900 bg-white leading-normal"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* 1. BRAND HEADER */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 mb-3">
        <div>
          <div className="text-[17pt] font-black tracking-tight text-slate-900 leading-none">
            {siteName}
          </div>
          <div className="text-[8.5pt] text-slate-600 font-semibold mt-0.5">
            Official Pakistan Statutory &amp; Islamic Calculation Engine
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11pt] font-bold text-slate-800 font-mono">
            {domain}
          </div>
          <div className="text-[8pt] text-slate-500">
            100% Client-Side Verified
          </div>
        </div>
      </div>

      {/* 2 & 3. REPORT TITLE & METADATA */}
      <div className="flex items-baseline justify-between mb-3 border-b border-slate-200 pb-2">
        <div>
          <h1 className="text-[15pt] font-extrabold text-slate-900 tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-[8.5pt] text-slate-600 font-medium">
            {data.description}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[8pt] uppercase font-bold tracking-wider text-slate-500 block">
            {isRoman ? "Tayyar Shuda:" : "Calculation Date:"}
          </span>
          <span className="text-[9pt] font-bold text-slate-800">
            {data.generatedAt}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* 4. USER ENTERED DETAILS TABLE */}
        <section className="break-inside-avoid">
          <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-0.5">
            1. {sectionHeadings.details}
          </h2>
          <table className="w-full text-[9pt] border border-slate-200">
            <tbody>
              {data.inputs.map((inp, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}
                >
                  <td className="py-1 px-2.5 font-medium text-slate-700 border-b border-slate-200 w-1/2">
                    {inp.label}
                  </td>
                  <td className="py-1 px-2.5 font-bold text-slate-900 text-right border-b border-slate-200 w-1/2">
                    {inp.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 5. KEY VALUES SUMMARY */}
        {data.keyValues.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-800 mb-1 border-b border-slate-300 pb-0.5">
              2. {sectionHeadings.keyValues}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-[9pt]">
              {data.keyValues.map((kv, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-700 text-[8.5pt]">
                    {kv.label}:
                  </span>
                  <span className="font-bold text-slate-900 text-[9pt]">
                    {kv.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. CALCULATION BREAKDOWN */}
        <section className="break-inside-avoid">
          <div className="flex items-baseline justify-between border-b border-slate-300 pb-0.5 mb-1">
            <h2 className="text-[10pt] font-bold uppercase tracking-wider text-slate-800">
              3. {sectionHeadings.breakdown}
            </h2>
            {data.calculatorKey === "salary" && (
              <span className="text-[7.5pt] italic text-slate-500">
                Applied slabs only — full table on the website
              </span>
            )}
          </div>
          <table className="w-full text-[9pt] border border-slate-200">
            <tbody>
              {data.breakdown.length > 0 ? (
                data.breakdown.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-slate-50/70" : "bg-white"}
                  >
                    <td className="py-1 px-2.5 font-medium text-slate-700 border-b border-slate-200">
                      {row.label}
                    </td>
                    <td className="py-1 px-2.5 font-bold text-slate-900 text-right border-b border-slate-200">
                      {row.value}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-slate-50/70">
                  <td className="py-1 px-2.5 font-medium text-slate-700">
                    {data.rateLabel || "Applicable Rate"}
                  </td>
                  <td className="py-1 px-2.5 font-bold text-slate-900 text-right">
                    {data.rateValue || "Standard Rate"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 7. FORMULA & APPLICABLE RATE */}
        <section className="break-inside-avoid bg-slate-50 p-2 rounded border border-slate-200 text-[8.5pt] flex items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-700 block text-[8pt] uppercase">
              {data.rateLabel}:
            </span>
            <span className="font-bold text-slate-900 text-[9pt]">
              {data.rateValue}
            </span>
          </div>
          <div className="text-right">
            <span className="font-bold text-slate-700 block text-[8pt] uppercase">
              Formula:
            </span>
            <span className="font-mono font-bold text-slate-900 text-[9pt]">
              {data.formula}
            </span>
          </div>
        </section>

        {/* 8. FINAL RESULT PROMINENT BOX */}
        <section className="break-inside-avoid border-2 border-slate-900 bg-slate-900 text-white p-3 rounded text-center my-1.5 shadow-xs">
          <div className="text-[10pt] font-extrabold uppercase tracking-widest text-emerald-300">
            {data.finalLabel}
          </div>
          <div className="text-[20pt] font-black tracking-tight text-white mt-0.5">
            {data.finalValue}
          </div>
        </section>

        {/* 9 & 10. EXPLANATION & DISCLAIMER */}
        <section className="break-inside-avoid space-y-1.5 pt-0.5">
          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[8.5pt] text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-0.5 text-[8pt] uppercase tracking-wider">
              {sectionHeadings.explanation}:
            </strong>
            {data.explanation}
          </div>

          {data.disclaimer && (
            <div className="text-[7.5pt] text-slate-500 italic border-l-2 border-slate-400 pl-2 py-0.5">
              <strong>Notice:</strong> {data.disclaimer}
            </div>
          )}
        </section>
      </div>

      {/* 11. FOOTER */}
      <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[8pt] text-slate-500">
        <div>
          Official Verification Report • <strong>{domain}</strong>
        </div>
        <div>
          Generated: {data.generatedAt} • Page 1 of 1
        </div>
      </div>
    </div>
  );
}

