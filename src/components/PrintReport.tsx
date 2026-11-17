"use client";

import React from "react";
import { SummaryData } from "@/lib/summary";
import { siteName, siteDomain } from "@/config/site";

interface PrintReportProps {
  data: SummaryData;
  language?: "roman" | "en";
}

/**
 * PrintReport: Professional, readable, spacious A4 calculation report.
 * Rendered ONLY during @media print (hidden on screen).
 * Complies with strict Part D typography & color guidelines:
 * - Brand: 20 pt bold (#0B2A4A) with thin gold rule (#D4AF37) repeated on page 2
 * - Title: 21 pt bold (#0B2A4A)
 * - Section headings: 13 pt bold (#0B2A4A)
 * - Body and table text: 11.5 pt (never below 10 pt)
 * - Table row padding: 8-10 px, line-height 1.4
 * - Section gaps: 16-20 pt
 * - Final result: 27 pt bold in 16-20 px padded navy (#0B2A4A) bordered box
 * - Disclaimer and footer: 10 pt
 * - Clean page breaks and repeated header via semantic print table
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
      className="hidden print:block w-full text-slate-900 bg-white"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <table className="w-full border-collapse">
        {/* REPEATING BRAND HEADER ON EVERY PAGE */}
        <thead>
          <tr>
            <td className="p-0 border-none pb-3">
              <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-2.5">
                <div>
                  <div className="text-[20pt] font-black tracking-tight text-[#0B2A4A] leading-tight">
                    {siteName}
                  </div>
                  <div className="text-[10pt] text-[#0F766E] font-bold mt-0.5 tracking-wide">
                    Official Pakistan Statutory &amp; Islamic Calculation Engine
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12pt] font-bold text-[#0B2A4A] font-mono">
                    {domain}
                  </div>
                  <div className="text-[10pt] text-slate-500 font-medium">
                    100% Client-Side Verified
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </thead>

        {/* REPEATING FOOTER ON EVERY PAGE */}
        <tfoot>
          <tr>
            <td className="p-0 border-none pt-3">
              <div className="border-t border-slate-300 pt-2 flex items-center justify-between text-[10pt] text-slate-500">
                <div>
                  Official Verification Report • <strong className="text-[#0B2A4A]">{domain}</strong>
                </div>
                <div>
                  Generated on: {data.generatedAt}
                </div>
              </div>
            </td>
          </tr>
        </tfoot>

        {/* REPORT CONTENT BODY */}
        <tbody>
          <tr>
            <td className="p-0 border-none">
              {/* 2 & 3. REPORT TITLE & METADATA */}
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-2.5 mb-4 pt-1 break-inside-avoid">
                <div>
                  <h1 className="text-[21pt] font-bold text-[#0B2A4A] tracking-tight leading-tight">
                    {data.title}
                  </h1>
                  <p className="text-[11.5pt] text-slate-600 font-medium mt-0.5">
                    {data.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10pt] uppercase font-bold tracking-wider text-slate-500 block">
                    {isRoman ? "Tayyar Shuda:" : "Calculation Date:"}
                  </span>
                  <span className="text-[11.5pt] font-bold text-[#0B2A4A]">
                    {data.generatedAt}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* 4. USER ENTERED DETAILS TABLE */}
                <section className="break-inside-avoid">
                  <h2 className="text-[13pt] font-bold text-[#0B2A4A] mb-1.5 pb-0.5 border-b border-[#0F766E]/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E] inline-block"></span>
                    1. {sectionHeadings.details}
                  </h2>
                  <table className="w-full text-[11.5pt] border border-slate-200 leading-[1.4]">
                    <tbody>
                      {data.inputs.map((inp, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}
                          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                        >
                          <td className="py-2 px-3 font-medium text-slate-700 border-b border-slate-200 w-1/2">
                            {inp.label}
                          </td>
                          <td className="py-2 px-3 font-bold text-[#0B2A4A] text-right border-b border-slate-200 w-1/2">
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
                    <h2 className="text-[13pt] font-bold text-[#0B2A4A] mb-1.5 pb-0.5 border-b border-[#0F766E]/30 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] inline-block"></span>
                      2. {sectionHeadings.keyValues}
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5 text-[11.5pt] leading-[1.4]">
                      {data.keyValues.map((kv, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded border border-slate-200 bg-[#F8FAFC] flex items-center justify-between"
                          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                        >
                          <span className="font-medium text-slate-700">
                            {kv.label}:
                          </span>
                          <span className="font-bold text-[#0B2A4A]">
                            {kv.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. CALCULATION BREAKDOWN */}
                <section className="break-inside-avoid">
                  <div className="flex items-baseline justify-between border-b border-[#0F766E]/30 pb-0.5 mb-1.5">
                    <h2 className="text-[13pt] font-bold text-[#0B2A4A] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] inline-block"></span>
                      3. {sectionHeadings.breakdown}
                    </h2>
                    {data.calculatorKey === "salary" && (
                      <span className="text-[10pt] italic text-slate-500 font-medium">
                        Applied slabs only — full table on the website
                      </span>
                    )}
                  </div>
                  <table className="w-full text-[11.5pt] border border-slate-200 leading-[1.4]">
                    <tbody>
                      {data.breakdown.length > 0 ? (
                        data.breakdown.map((row, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}
                            style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                          >
                            <td className="py-2 px-3 font-medium text-slate-700 border-b border-slate-200">
                              {row.label}
                            </td>
                            <td className="py-2 px-3 font-bold text-[#0B2A4A] text-right border-b border-slate-200">
                              {row.value}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr
                          className="bg-[#F8FAFC]"
                          style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                        >
                          <td className="py-2 px-3 font-medium text-slate-700">
                            {data.rateLabel || "Applicable Rate"}
                          </td>
                          <td className="py-2 px-3 font-bold text-[#0B2A4A] text-right">
                            {data.rateValue || "Standard Rate"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>

                {/* 7. FORMULA & APPLICABLE RATE */}
                <section
                  className="break-inside-avoid bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-[11.5pt] leading-[1.4] flex items-center justify-between gap-4"
                  style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                >
                  <div>
                    <span className="font-bold text-[#0F766E] block text-[10pt] uppercase tracking-wider">
                      {data.rateLabel}:
                    </span>
                    <span className="font-bold text-[#0B2A4A]">
                      {data.rateValue}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-600 block text-[10pt] uppercase tracking-wider">
                      Formula:
                    </span>
                    <span className="font-mono font-bold text-[#0B2A4A]">
                      {data.formula}
                    </span>
                  </div>
                </section>

                {/* 8. FINAL RESULT PROMINENT BOX (NAVY BORDER, TEXT & ACCENTS, NO HEAVY BLACK FILL) */}
                <section
                  className="break-inside-avoid border-2 border-[#0B2A4A] bg-[#F8FAFC] p-4 rounded-xl text-center my-2"
                  style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                >
                  <div className="text-[13pt] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    {data.finalLabel}
                  </div>
                  <div className="text-[27pt] font-black tracking-tight text-[#0B2A4A] mt-0.5">
                    {data.finalValue}
                  </div>
                </section>

                {/* 9 & 10. EXPLANATION & DISCLAIMER */}
                <section className="break-inside-avoid space-y-2 pt-0.5">
                  <div
                    className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200 text-[11.5pt] text-slate-800 leading-[1.55]"
                    style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
                  >
                    <strong className="text-[#0B2A4A] block mb-0.5 text-[10pt] uppercase tracking-wider font-bold">
                      {sectionHeadings.explanation}:
                    </strong>
                    {data.explanation}
                  </div>

                  {data.disclaimer && (
                    <div className="text-[10pt] text-slate-600 leading-[1.5] italic border-l-2 border-[#0F766E] pl-3 py-0.5">
                      <strong className="text-[#0B2A4A]">Notice:</strong> {data.disclaimer}
                    </div>
                  )}
                </section>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
