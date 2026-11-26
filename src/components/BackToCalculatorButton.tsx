"use client";

import React, { useEffect, useState } from "react";
import { useExplanationLang } from "./LanguageContext";

/**
 * Floating mobile-only pill that lets users jump back up to #calculator once
 * they scroll down into explanations, tables, or FAQs. Hidden on desktop.
 */
export default function BackToCalculatorButton() {
  const [visible, setVisible] = useState(false);
  const { lang } = useExplanationLang();

  useEffect(() => {
    const updateVisibility = () => {
      if (typeof window === "undefined") return;
      const calcEl = document.getElementById("calculator");
      if (!calcEl) {
        setVisible(false);
        return;
      }
      const rect = calcEl.getBoundingClientRect();
      // Show once the top of the calculator form has scrolled well above viewport
      setVisible(rect.bottom < 180 || window.scrollY > rect.height + 220);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  if (!visible) return null;

  const handleScrollToCalculator = () => {
    const calcEl = document.getElementById("calculator");
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 left-3 z-40 print:hidden">
      <button
        type="button"
        onClick={handleScrollToCalculator}
        aria-label={lang === "roman" ? "Calculator par wapas jayein" : "Back to Calculator"}
        className="flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 bg-accent hover:bg-teal-800 active:scale-95 text-white text-xs font-extrabold rounded-full shadow-lg border border-white/25 backdrop-blur-xs transition-all cursor-pointer"
      >
        <span aria-hidden="true">↑</span>
        <span>{lang === "roman" ? "Calculator par wapas" : "Calculator"}</span>
      </button>
    </div>
  );
}
