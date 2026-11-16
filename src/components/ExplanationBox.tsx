"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface ExplanationBullet {
  en: string;
  urdu: React.ReactNode;
  urduTextPlain?: string;
}

export interface ExplanationBoxProps {
  type: "tax" | "islamic";
  englishText: string;
  urduText: React.ReactNode;
  urduTextPlain?: string;
  referenceContent: React.ReactNode;
  extraBullets?: ExplanationBullet[];
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export default function ExplanationBox({
  type,
  englishText,
  urduText,
  urduTextPlain,
  referenceContent,
  extraBullets,
  imageSrc,
  imageAlt,
  className = "",
}: ExplanationBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const bulletText =
        extraBullets && extraBullets.length > 0
          ? "\n" +
            extraBullets
              .map(
                (b) =>
                  `• EN: ${b.en}\n• اردو: ${
                    b.urduTextPlain || (typeof b.urdu === "string" ? b.urdu : "")
                  }`
              )
              .join("\n")
          : "";
      const rawUrdu =
        urduTextPlain || (typeof urduText === "string" ? urduText : "");
      const textToCopy = `How this result was calculated — یہ نتیجہ کیسے نکلا؟\n\nEnglish:\n${englishText}\n\nاردو:\n${rawUrdu}${bulletText}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isIslamic = type === "islamic";

  return (
    <div
      className={`w-full bg-white border-2 border-[#0B2A4A] rounded-[12px] p-4 sm:p-5 mt-4 text-[#1A2027] shadow-sm print:hidden ${className}`}
      aria-label="How this result was calculated"
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-5">
        {/* Desktop-Only Picture (Left Column: ~38% width, hidden on mobile/tablet) */}
        {imageSrc && (
          <div className="hidden lg:block lg:w-[38%] shrink-0 self-stretch">
            <div className="w-full h-full min-h-[340px] rounded-[16px] overflow-hidden border border-slate-200/80 shadow-[0_10px_30px_rgba(11,42,74,0.15)] relative bg-slate-50">
              <Image
                src={imageSrc}
                alt={imageAlt || "Calculation reference visual"}
                fill
                sizes="(min-width: 1024px) 380px, 0px"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Right Column (Full width on mobile/tablet, flex-1 on desktop) */}
        <div className="w-full lg:flex-1 min-w-0 space-y-3">
          {/* Header with Title & Copy Button */}
          <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-slate-100">
            <h3 className="text-[17px] font-bold text-[#0B2A4A] tracking-tight leading-snug">
              How this result was calculated — یہ نتیجہ کیسے نکلا؟
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#0B2A4A]/25 bg-slate-50 hover:bg-slate-100 text-[#0B2A4A] transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy English and Urdu explanation"
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

          {/* English Paragraph */}
          <div className="pt-1">
            <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#1A2027] font-normal">
              {englishText}
            </p>
          </div>

          {/* Urdu Paragraph (Proper Urdu Script, Nastaliq, RTL, LTR for formulas/numbers) */}
          <div className="pt-2">
            <div
              dir="rtl"
              lang="ur"
              className="font-urdu text-right text-[16px] leading-[2.0] text-[#1A2027]"
            >
              {urduText}
            </div>
          </div>

          {/* Optional Extra Bullets (e.g. Zakat & Fitrana who pays) */}
          {extraBullets && extraBullets.length > 0 && (
            <div className="pt-3 space-y-2.5">
              {extraBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="text-[14px] sm:text-[15px] leading-[1.6] bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1.5"
                >
                  <p className="text-slate-900">
                    <strong className="text-primary font-bold">EN:</strong>{" "}
                    {bullet.en}
                  </p>
                  <div
                    dir="rtl"
                    lang="ur"
                    className="font-urdu text-right text-[15px] sm:text-[16px] leading-[2.0] text-slate-800"
                  >
                    <strong className="text-primary font-bold ml-1.5 font-sans">
                      اردو:
                    </strong>{" "}
                    {bullet.urdu}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reference Strip */}
          <div
            className={`mt-3.5 p-3.5 sm:p-4 rounded-r-lg border-l-4 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1.5 ${
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
            <div className="text-slate-800 space-y-1.5">{referenceContent}</div>
          </div>

          {/* Guidance One-Liner */}
          <p className="text-xs text-slate-500 pt-2 font-medium italic">
            {isIslamic
              ? "This is guidance only. Confirm with a qualified Mufti / scholar before acting."
              : "This is guidance only. Confirm with FBR / a tax professional before acting."}
          </p>
        </div>
      </div>
    </div>
  );
}
