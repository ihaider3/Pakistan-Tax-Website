"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ExplanationLang = "roman" | "en";

interface LanguageContextType {
  lang: ExplanationLang;
  setLang: (lang: ExplanationLang) => void;
  toggleLang: () => void;
}

const STORAGE_KEY = "pfc-lang";

const LanguageContext = createContext<LanguageContextType>({
  lang: "roman",
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<ExplanationLang>("roman");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "roman") {
        setLangState(saved);
      }
    } catch {
      // ignore in environments without localStorage
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "en" || e.newValue === "roman")) {
        setLangState(e.newValue);
      }
    };

    const handleCustomChange = () => {
      try {
        const current = localStorage.getItem(STORAGE_KEY);
        if (current === "en" || current === "roman") {
          setLangState(current);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("pfc-lang-change", handleCustomChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pfc-lang-change", handleCustomChange);
    };
  }, []);

  const setLang = useCallback((newLang: ExplanationLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      window.dispatchEvent(new Event("pfc-lang-change"));
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: ExplanationLang = prev === "roman" ? "en" : "roman";
      try {
        localStorage.setItem(STORAGE_KEY, next);
        window.dispatchEvent(new Event("pfc-lang-change"));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useExplanationLang() {
  return useContext(LanguageContext);
}

