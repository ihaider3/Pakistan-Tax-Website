"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useExplanationLang } from "./LanguageContext";
import { sendTrackBeacon } from "@/lib/analytics/beacon";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaContextType {
  canInstall: boolean;
  isInstalled: boolean;
  isIos: boolean;
  promptInstall: () => Promise<void>;
  dismissBanner: () => void;
  showIosHint: boolean;
  dismissIosHint: () => void;
}

const PwaContext = createContext<PwaContextType>({
  canInstall: false,
  isInstalled: false,
  isIos: false,
  promptInstall: async () => {},
  dismissBanner: () => {},
  showIosHint: false,
  dismissIosHint: () => {},
});

export function usePwa() {
  return useContext(PwaContext);
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [hasUsedCalculator, setHasUsedCalculator] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  // 1. Register Service Worker & Detect Standalone / iOS
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register Service Worker with robust readyState timing
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((reg) => {
            console.log("[PWA] Service Worker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // Detect if already installed / standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      localStorage.getItem("pfc-pwa-installed") === "true";

    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafariBrowser =
      /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
    const iosSafari = isIosDevice && isSafariBrowser;
    setIsIos(iosSafari);

    // Check 30-day banner dismissal
    const dismissedAt = localStorage.getItem("pfc-pwa-dismissed");
    if (dismissedAt) {
      const diffMs = Date.now() - Number(dismissedAt);
      if (diffMs < 30 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      } else {
        setIsDismissed(false);
      }
    } else {
      setIsDismissed(false);
    }

    // Check iOS dismissed
    const iosDismissed = localStorage.getItem("pfc-pwa-ios-dismissed") === "true";
    if (iosSafari && !isStandalone && !iosDismissed) {
      setShowIosHint(true);
    }

    // Check if user has used calculator before
    const used = localStorage.getItem("pfc_has_used_calculator") === "true";
    setHasUsedCalculator(used);

    const handleToolUsed = () => {
      setHasUsedCalculator(true);
      try {
        localStorage.setItem("pfc_has_used_calculator", "true");
      } catch {}
    };

    window.addEventListener("pfc_tool_used", handleToolUsed);

    // Handle beforeinstallprompt (Chrome / Edge / Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      setShowIosHint(false);
      try {
        localStorage.setItem("pfc-pwa-installed", "true");
      } catch {}
      sendTrackBeacon({ type: "tool_use", calculator: "salary" }); // safe trigger
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("pfc_tool_used", handleToolUsed);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Trigger Install Prompt
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
          setCanInstall(false);
          try {
            localStorage.setItem("pfc-pwa-installed", "true");
          } catch {}
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn("[PWA] Prompt error:", err);
      }
    } else if (isIos) {
      setShowIosHint(true);
    }
  }, [deferredPrompt, isIos]);

  // Dismiss Mobile Banner for 30 Days
  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem("pfc-pwa-dismissed", Date.now().toString());
    } catch {}
  }, []);

  // Dismiss iOS hint
  const dismissIosHint = useCallback(() => {
    setShowIosHint(false);
    try {
      localStorage.setItem("pfc-pwa-ios-dismissed", "true");
    } catch {}
  }, []);

  return (
    <PwaContext.Provider
      value={{
        canInstall,
        isInstalled,
        isIos,
        promptInstall,
        dismissBanner,
        showIosHint,
        dismissIosHint,
      }}
    >
      {children}
      {/* Visual Banners and Cards */}
      <PwaBanners
        canInstall={canInstall}
        isInstalled={isInstalled}
        isDismissed={isDismissed}
        hasUsedCalculator={hasUsedCalculator}
        onInstall={promptInstall}
        onDismiss={dismissBanner}
        showIosHint={showIosHint}
        onDismissIos={dismissIosHint}
      />
    </PwaContext.Provider>
  );
}

// Subcomponent: Hero Install Button for Homepage
export function HeroInstallButton() {
  const { canInstall, isInstalled, isIos, promptInstall } = usePwa();

  if (isInstalled) return null;
  if (!canInstall && !isIos) return null;

  return (
    <div className="pt-2 animate-in fade-in duration-300">
      <button
        type="button"
        onClick={promptInstall}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-primary via-[#0E355D] to-primary text-white border border-slate-700/60 shadow-md shadow-primary/25 hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
      >
        <span className="text-sm">📲</span>
        <span>Install App (Free)</span>
      </button>
    </div>
  );
}

// Subcomponent: Mobile Bottom Banner & iOS Safari Hint Card
function PwaBanners({
  canInstall,
  isInstalled,
  isDismissed,
  hasUsedCalculator,
  onInstall,
  onDismiss,
  showIosHint,
  onDismissIos,
}: {
  canInstall: boolean;
  isInstalled: boolean;
  isDismissed: boolean;
  hasUsedCalculator: boolean;
  onInstall: () => void;
  onDismiss: () => void;
  showIosHint: boolean;
  onDismissIos: () => void;
}) {
  const { lang } = useExplanationLang();
  const isRoman = lang === "roman";

  // 1. Mobile Bottom Banner: Shown only AFTER first calculator use on mobile
  const showMobileBanner =
    !isInstalled && !isDismissed && hasUsedCalculator && canInstall;

  return (
    <>
      {/* Mobile Dismissible Bottom Banner */}
      {showMobileBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-45 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          <div className="bg-[#0B2A4A] text-white p-4 rounded-2xl border border-teal-500/30 shadow-[0_12px_40px_rgba(11,42,74,0.4)] flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-accent text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              PK
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
                  {isRoman ? "App Install Karein (Free)" : "Install Finance Calculators"}
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
                {isRoman
                  ? "Baghair browser address bar ke full screen chalayein — offline bhi kaam karta hai."
                  : "Add to home screen for full-screen access — works 100% offline with zero login."}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onInstall}
                  className="px-3.5 py-1.5 rounded-lg bg-accent hover:bg-teal-600 text-white font-black text-xs transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  {isRoman ? "Abhi Install Karein" : "Install App"}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                >
                  {isRoman ? "Baad Mein" : "Not now"}
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
                  {isRoman ? "iPhone Par Install Karein" : "Install on iPhone"}
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
                {isRoman ? (
                  <>
                    Safari ke neechay <strong>Share (⎋)</strong> dabayein aur phir{" "}
                    <strong>&apos;Add to Home Screen&apos; (+)</strong> chunein.
                  </>
                ) : (
                  <>
                    Tap <strong>Share (⎋)</strong> at the bottom of Safari, then choose{" "}
                    <strong>&apos;Add to Home Screen&apos; (+)</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
