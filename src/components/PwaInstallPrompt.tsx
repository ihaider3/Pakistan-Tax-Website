"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { PwaContext, usePwa } from "./PwaContext";

const PwaBanners = dynamic(() => import("./PwaBanners"), { ssr: false });

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export { usePwa };

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

    // Register Service Worker after load + idle grace period so first-paint bandwidth stays unobstructed
    let swTimer: number | undefined;
    if ("serviceWorker" in navigator) {
      const registerSW = () => {
        swTimer = window.setTimeout(() => {
          navigator.serviceWorker
            .register("/sw.js", { scope: "/" })
            .catch(() => {});
        }, 5000);
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW, { once: true });
      }
    }

    // Defer storage/UA reads cleanly off the synchronous hydration commit frame
    const initTimer = window.setTimeout(() => {
      try {
        const isStandalone =
          window.matchMedia("(display-mode: standalone)").matches ||
          (navigator as unknown as { standalone?: boolean }).standalone === true ||
          localStorage.getItem("pfc-pwa-installed") === "true";
        if (isStandalone) setIsInstalled(true);

        const ua = navigator.userAgent;
        const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
        const isSafariBrowser =
          /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
        const iosSafari = isIosDevice && isSafariBrowser;
        if (iosSafari) setIsIos(true);

        const dismissedAt = localStorage.getItem("pfc-pwa-dismissed");
        if (!dismissedAt || Date.now() - Number(dismissedAt) >= 30 * 24 * 60 * 60 * 1000) {
          setIsDismissed(false);
        }

        const iosDismissed = localStorage.getItem("pfc-pwa-ios-dismissed") === "true";
        if (iosSafari && !isStandalone && !iosDismissed) {
          setShowIosHint(true);
        }

        if (localStorage.getItem("pfc_has_used_calculator") === "true") {
          setHasUsedCalculator(true);
        }
      } catch {}
    }, 0);

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
      void import("@/lib/analytics/beacon").then(({ sendTrackBeacon }) => {
        sendTrackBeacon({ type: "tool_use", calculator: "salary" }); // safe trigger
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (swTimer !== undefined) window.clearTimeout(swTimer);
      window.clearTimeout(initTimer);
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
