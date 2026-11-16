"use client";

import React from "react";
import { useExplanationLang } from "./LanguageContext";

interface ExplanationLangToggleProps {
  className?: string;
}

export default function ExplanationLangToggle({
  className = "",
}: ExplanationLangToggleProps) {
  const { lang, toggleLang } = useExplanationLang();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full text-xs font-bold tracking-tight bg-accent-soft text-accent border border-accent/25 hover:bg-teal-100/80 active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer ${className}`}
      aria-label={
        lang === "roman"
          ? "Switch explanation to English"
          : "Switch explanation to Roman Urdu"
      }
      title={
        lang === "roman"
          ? "Switch explanation to English"
          : "Switch explanation to Roman Urdu"
      }
    >
      <span className="text-sm leading-none" aria-hidden="true">
        🌐
      </span>
      <span>{lang === "roman" ? "English" : "Roman Urdu"}</span>
    </button>
  );
}

