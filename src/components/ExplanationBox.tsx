"use client";

import React, { useState } from "react";
import { useExplanationLang } from "./LanguageContext";
import ExplanationLangToggle from "./ExplanationLangToggle";

export interface ExplanationBullet {
  en: string;
  romanUrdu: string;
}

export interface ExplanationBoxProps {
  type: "tax" | "islamic";
  englishText: string;
  romanUrduText: string;
  referenceContentEn?: React.ReactNode;
  referenceContentRoman?: React.ReactNode;
  referenceContent?: React.ReactNode;
  extraBullets?: ExplanationBullet[];
  className?: string;
}

export default function ExplanationBox({
  type,
  englishText,
  romanUrduText,
  referenceContentEn,
  referenceContentRoman,
  referenceContent,
  extraBullets,
  className = "",
}: ExplanationBoxProps) {
  const { lang } = useExplanationLang();
  const [copied, setCopied] = useState(false);

  const isIslamic = type === "islamic";
  const isRoman = lang === "roman";

  const activeHeading = isRoman
    ? "Ye natija kaise nikla?"
    : "How this result was calculated?";

  const activeText = isRoman ? romanUrduText : englishText;

  const handleCopy = async () => {
    try {
      const bulletText =
        extraBullets && extraBullets.length > 0
          ? "\n\n" +
            extraBullets
              .map((b) => `• ${isRoman ? b.romanUrdu : b.en}`)
              .join("\n")
          : "";
      const textToCopy = `${activeHeading}\n\n${activeText}${bulletText}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const refToRender = isRoman
    ? referenceContentRoman || referenceContent
    : referenceContentEn || referenceContent;

  return (
    <div
      className={`w-full bg-white border-2 border-[#0B2A4A] rounded-[12px] p-4 sm:p-6 text-[#1A2027] shadow-sm print:hidden ${className}`}
      aria-label={activeHeading}
    >
      <div className="w-full space-y-3.5">
        {/* Header with Title, Language Toggle & Copy Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h3 className="text-[16px] sm:text-[17px] font-bold text-[#0B2A4A] tracking-tight leading-snug">
            {activeHeading}
          </h3>
          <div className="flex items-center gap-2.5 shrink-0">
            <ExplanationLangToggle />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] text-xs font-semibold rounded-md border border-[#0B2A4A]/25 bg-slate-50 hover:bg-slate-100 text-[#0B2A4A] transition-colors cursor-pointer shadow-2xs"
              title="Copy explanation"
            >
              {copied ? (
                <span className="text-emerald-700 font-bold">Copied!</span>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Copy explanation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Explanation Paragraph */}
        <div className="pt-1">
          <p className="text-[15px] sm:text-[16px] leading-[1.65] text-[#1A2027] font-normal">
            {activeText}
          </p>
        </div>

        {/* Optional Extra Bullets (e.g. Zakat & Fitrana) */}
        {extraBullets && extraBullets.length > 0 && (
          <div className="pt-2 space-y-2.5">
            {extraBullets.map((bullet, idx) => (
              <div
                key={idx}
                className="text-[14px] sm:text-[15px] leading-[1.65] bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/70"
              >
                <p className="text-slate-900 font-normal">
                  • {isRoman ? bullet.romanUrdu : bullet.en}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reference Strip */}
        {refToRender && (
          <div
            className={`mt-4 p-4 sm:p-5 rounded-r-xl border-l-4 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 ${
              isIslamic
                ? "bg-[#FFF8E1] border-[#C9A227]"
                : "bg-[#EFF6FF] border-[#0B2A4A]"
            }`}
          >
            <div className="font-bold text-[#0B2A4A] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isIslamic ? "bg-[#C9A227]" : "bg-[#0B2A4A]"
                }`}
              ></span>
              <span>Reference / Hawala:</span>
            </div>
            <div className="text-slate-800 space-y-1.5">{refToRender}</div>
          </div>
        )}

        {/* Guidance One-Liner */}
        <p className="text-xs text-slate-500 pt-2 font-medium italic">
          {isRoman
            ? isIslamic
              ? "Ye sirf rehnumai ke liye hai. Amal karne se pehle kisi mustanad Mufti ya aalim se tasdeeq karein."
              : "Ye sirf rehnumai ke liye hai. Amal karne se pehle FBR / kisi tax professional se tasdeeq karein."
            : isIslamic
            ? "This is guidance only. Confirm with a qualified Mufti / scholar before acting."
            : "This is guidance only. Confirm with FBR / a tax professional before acting."}
        </p>
      </div>
    </div>
  );
}
