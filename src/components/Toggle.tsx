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
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <span className="block text-sm font-semibold text-appText">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-label={label || "Selection options"}
        className="inline-flex w-full bg-surface p-1 rounded-lg border border-appBorder"
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
              className={`flex-1 min-h-[44px] px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-accent ${
                isSelected
                  ? "bg-primary text-white shadow-xs font-semibold"
                  : "text-appText hover:text-primary hover:bg-surface-hover"
              }`}
            >
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isSelected
                      ? "bg-accent text-white"
                      : "bg-appBorder text-appText-muted"
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
