"use client";

import React, { useEffect, useState } from "react";
import { usePwa } from "./PwaContext";

/** Mobile drawer CTA button for installing CalculationHub as a PWA. */
export function MobileDrawerInstallButton({ onAfterClick }: { onAfterClick?: () => void }) {
  const { isInstalled, promptInstall } = usePwa();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && isInstalled) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (onAfterClick) onAfterClick();
        promptInstall();
      }}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-primary via-[#0E355D] to-primary text-white border border-slate-700/60 shadow-md shadow-primary/25 hover:shadow-lg active:scale-98 transition-all cursor-pointer"
      aria-label="Install CalculationHub App on Mobile"
    >
      <span className="text-sm">📲</span>
      <span>Install App (Free)</span>
    </button>
  );
}
