"use client";

import React, { useState, useId, lazy, Suspense } from "react";

const SearchBoxDropdown = lazy(() => import("./SearchBoxDropdown"));
const preloadDropdown = () => {
  void import("./SearchBoxDropdown");
};

export default function SearchBox({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();

  return (
    <div className={`relative max-w-2xl mx-auto w-full ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search a calculator
      </label>

      {/* Elevated Search Card with Glow Focus */}
      <div className="relative group rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(11,42,74,0.08),0_4px_10px_-2px_rgba(11,42,74,0.03)] focus-within:shadow-[0_16px_40px_-6px_rgba(15,118,110,0.2)]">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-appText-muted group-focus-within:text-accent transition-colors">
          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center group-focus-within:bg-accent-soft transition-colors">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            preloadDropdown();
          }}
          onFocus={() => {
            setIsOpen(true);
            preloadDropdown();
          }}
          onPointerEnter={preloadDropdown}
          placeholder="Search a calculator — e.g. salary tax, zakat, 236C, GST 18%, fitrana…"
          className="w-full pl-14 pr-24 py-3.5 sm:py-4 min-h-[52px] text-sm sm:text-base rounded-2xl border border-slate-200/90 bg-white text-appText shadow-inner-soft focus:outline-hidden focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all placeholder:text-appText-subtle font-medium"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-appText-muted hover:text-appText transition-colors"
            aria-label="Clear search query"
          >
            <div className="p-1 rounded-full bg-slate-100 hover:bg-slate-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-[11px] font-semibold text-appText-muted/70 bg-surface px-2 py-0.5 rounded-md border border-appBorder">
              Instant
            </span>
          </div>
        )}
      </div>

      {/* Results Dropdown (lazy-loaded on interaction) */}
      {isOpen && query.trim() !== "" && (
        <Suspense fallback={null}>
          <SearchBoxDropdown query={query} onSelect={() => setIsOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
