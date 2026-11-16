"use client";

import React from "react";

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
}

interface ToggleProps<T extends string> {
  label?: string;
  options: ToggleOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export default function Toggle<T extends string>({
  label,
  options,
  value,
  onChange,
  className = "",
}: ToggleProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <span className="block text-sm font-bold text-primary tracking-tight">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-label={label || "Selection options"}
        className="inline-flex w-full bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80 shadow-inner-soft gap-1"
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.value)}
              className={`flex-1 min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-accent ${
                isSelected
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/20 scale-[1.01]"
                  : "text-appText-muted hover:text-primary hover:bg-white/80"
              }`}
            >
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider transition-colors ${
                    isSelected
                      ? "bg-accent text-white shadow-2xs"
                      : "bg-slate-200 text-appText-muted"
                  }`}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
