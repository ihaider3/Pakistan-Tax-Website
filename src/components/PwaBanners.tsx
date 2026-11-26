"use client";

import React from "react";

export interface PwaBannersProps {
  showMobileBanner: boolean;
  isInstalled: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  showIosHint: boolean;
  onDismissIos: () => void;
  showManualGuide: boolean;
  onDismissManual: () => void;
}

/**
 * Deferred visual banners and install modals for PWA onboarding.
 * Dynamically loaded only when a prompt or guide needs to render.
 */
export default function PwaBanners({
  showMobileBanner,
  isInstalled,
  onInstall,
  onDismiss,
  showIosHint,
  onDismissIos,
  showManualGuide,
  onDismissManual,
}: PwaBannersProps) {
  return (
    <>
      {/* Mobile Dismissible Bottom Banner */}
      {showMobileBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-45 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          <div className="bg-[#0B2A4A] text-white p-4 rounded-2xl border border-teal-500/30 shadow-[0_12px_40px_rgba(11,42,74,0.4)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-md p-1 overflow-hidden">
              <img
                src="/images/CalculationHub_App_Icon.webp"
                alt="CalculationHub"
                width={1536}
                height={1024}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
                  Install App (Free)
                </span>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Dismiss install banner"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
                Use full screen without browser address bar — works offline too.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onInstall}
                  className="px-3.5 py-1.5 rounded-lg bg-accent hover:bg-teal-600 text-white font-black text-xs transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  Install Now
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Dismissible Instruction Card */}
      {showIosHint && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-45 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          <div className="bg-[#0B2A4A] text-white p-4 rounded-2xl border border-teal-500/30 shadow-2xl flex items-start gap-3">
            <span className="text-xl shrink-0">📲</span>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-xs text-white">
                  Install on iPhone / iPad
                </span>
                <button
                  type="button"
                  onClick={onDismissIos}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Dismiss iPhone hint"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Tap <strong>Share (⎋)</strong> at the bottom of Safari, then choose{" "}
                <strong>&apos;Add to Home Screen&apos; (+)</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Universal Step-by-Step Install Guide Modal (Mobile & Desktop Fallback) */}
      {showManualGuide && !isInstalled && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full border-2 border-slate-200/90 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/images/CalculationHub_App_Icon.webp"
                    alt="CalculationHub"
                    width={1536}
                    height={1024}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-primary">Install CalculationHub</h4>
                  <p className="text-[11px] font-semibold text-accent">Free &amp; Offline Ready</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onDismissManual}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <span>Tap your browser menu (<strong className="text-primary font-bold">⋮</strong> 3 dots in Chrome/Android or <strong className="text-primary font-bold">Share ⎋</strong> in Safari).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <span>Select <strong className="text-primary font-bold">&quot;Install app&quot;</strong> or <strong className="text-primary font-bold">&quot;Add to Home screen&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <span>Launch CalculationHub instantly from your home screen anytime!</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onDismissManual}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-[#071F36] text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
