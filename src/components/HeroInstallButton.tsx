"use client";

import React, { useEffect, useState } from "react";
import { usePwa } from "./PwaContext";

/** Lightweight homepage hero CTA that reads PWA context without bundling installer runtime. */
export function HeroInstallButton() {
  const { isInstalled, promptInstall } = usePwa();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && isInstalled) return null;

  return (
    <div className="pt-2 animate-in fade-in duration-300">
      <button
        type="button"
        onClick={promptInstall}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-primary via-[#0E355D] to-primary text-white border border-slate-700/60 shadow-md shadow-primary/25 hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
        aria-label="Install CalculationHub App"
      >
        <span className="text-sm">📲</span>
        <span>Install App (Free)</span>
      </button>
    </div>
  );
}
