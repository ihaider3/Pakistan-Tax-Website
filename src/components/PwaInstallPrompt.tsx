"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import dynamic from "next/dynamic";
import { sendTrackBeacon } from "@/lib/analytics/beacon";

const PwaBanners = dynamic(() => import("./PwaBanners"), { ssr: false });

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
  const [showManualGuide, setShowManualGuide] = useState(false);

  // 1. Register Service Worker & Detect Standalone / iOS
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register Service Worker after load/idle so initial hydration yields cleanly
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        window.setTimeout(() => {
          navigator.serviceWorker
            .register("/sw.js", { scope: "/" })
            .then((reg) => {
              console.log("[PWA] Service Worker registered with scope:", reg.scope);
            })
            .catch((err) => {
              console.warn("[PWA] Service Worker registration failed:", err);
            });
        }, 0);
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW, { once: true });
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
    } else {
      setShowManualGuide(true);
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

  const showMobileBanner =
    !isInstalled && !isDismissed && hasUsedCalculator && canInstall;
  const shouldLoadBanners =
    showMobileBanner ||
    (showIosHint && !isInstalled) ||
    (showManualGuide && !isInstalled);

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
      {/* Deferred visual banners and install modals */}
      {shouldLoadBanners && (
        <PwaBanners
          showMobileBanner={showMobileBanner}
          isInstalled={isInstalled}
          onInstall={promptInstall}
          onDismiss={dismissBanner}
          showIosHint={showIosHint}
          onDismissIos={dismissIosHint}
          showManualGuide={showManualGuide}
          onDismissManual={() => setShowManualGuide(false)}
        />
      )}
    </PwaContext.Provider>
  );
}

// Subcomponent: Hero Install Button for Homepage (Visible on Mobile & Desktop)
export function HeroInstallButton() {
  const { isInstalled, promptInstall } = usePwa();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide only if app is already running as installed standalone PWA
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

// Subcomponent: Mobile Header Drawer Install Button
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
