"use client";

import React, { useState } from "react";
import { parseMoneyInput } from "@/lib/calc/money";

interface MoneyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (raw: string, numValue: number, isValid: boolean) => void;
  placeholder?: string;
  hint?: string;
  unitLabel?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function MoneyInput({
  id,
  label,
  value,
  onChange,
  placeholder = "e.g. 150,000",
  hint,
  unitLabel = "PKR",
  disabled = false,
  required = false,
  autoFocus = false,
  className = "",
}: MoneyInputProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Validate on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseMoneyInput(rawVal);

    if (parsed.isEmpty) {
      setErrorMessage(null); // Silent for empty field until blur
      setWarningMessage(null);
      onChange(rawVal, 0, false);
      return;
    }

    if (!parsed.isValid) {
      setErrorMessage(parsed.error || "Please enter a valid amount");
      setWarningMessage(null);
      onChange(rawVal, 0, false);
      return;
    }

    setErrorMessage(null);
    setWarningMessage(parsed.warning || null);
    onChange(rawVal, parsed.value, true);
  };

  const handleBlur = () => {
    if (value.trim() === "") {
      setErrorMessage("Enter an amount to see your result");
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-bold text-primary tracking-tight"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {unitLabel && (
          <span className="text-[11px] font-extrabold text-accent bg-accent-soft px-2.5 py-0.5 rounded-md border border-accent/20">
            {unitLabel}
          </span>
        )}
      </div>

      <div className="relative rounded-xl transition-all duration-200 shadow-xs focus-within:shadow-[0_8px_20px_-3px_rgba(15,118,110,0.15)]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-appText-muted font-bold text-base">
          <span className="px-2 py-1 rounded-md bg-surface text-primary text-xs font-black">
            Rs
          </span>
        </div>
        <input
          type="text"
          inputMode="decimal"
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`block w-full pl-14 pr-4 py-3 min-h-[48px] text-base font-semibold rounded-xl border text-appText placeholder:text-appText-subtle bg-white focus:outline-hidden focus:ring-2 transition-all duration-200 ${
            errorMessage
              ? "border-red-400 focus:ring-red-400/20"
              : "border-slate-200/90 focus:border-accent focus:ring-accent/20"
          }`}
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      </div>

      {hint && !errorMessage && (
        <p id={`${id}-hint`} className="text-xs text-appText-muted font-medium">
          {hint}
        </p>
      )}

      {errorMessage && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-semibold text-red-600 flex items-center gap-1.5 pt-0.5"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}

      {warningMessage && !errorMessage && (
        <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
          <svg className="w-4 h-4 shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {warningMessage}
        </p>
      )}
    </div>
  );
}
