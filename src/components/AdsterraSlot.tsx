"use client";

import React, { useEffect, useRef } from "react";

export type AdsterraBannerVariant =
  | "rectangle-desktop"
  | "mobile-strip"
  | "leaderboard-desktop";

export interface AdsterraBannerSpec {
  key: string;
  format: "iframe";
  width: number;
  height: number;
  src: string;
  mediaQuery: string;
  visibilityClass: string;
}

export const ADSTERRA_NATIVE_SPEC = {
  id: "5d4ed0569885a33269e9601cab147930",
  containerId: "container-5d4ed0569885a33269e9601cab147930",
  src: "https://bauval.org/21/5d4ed0569885a33269e9601cab147930",
} as const;

export const ADSTERRA_BANNERS: Record<AdsterraBannerVariant, AdsterraBannerSpec> = {
  "rectangle-desktop": {
    key: "f393f59b0c10cb05bb3226c68f168846",
    format: "iframe",
    height: 250,
    width: 300,
    src: "https://bauval.org/22/f393f59b0c10cb05bb3226c68f168846",
    mediaQuery: "(min-width: 769px)",
    visibilityClass: "hidden min-[769px]:flex",
  },
  "mobile-strip": {
    key: "620b5f0268b5c21a77970539a202207f",
    format: "iframe",
    height: 50,
    width: 320,
    src: "https://bauval.org/22/620b5f0268b5c21a77970539a202207f",
    mediaQuery: "(max-width: 768px)",
    visibilityClass: "flex min-[769px]:hidden",
  },
  "leaderboard-desktop": {
    key: "dff9fe1922f15c33d5446fa743063649",
    format: "iframe",
    height: 90,
    width: 728,
    src: "https://bauval.org/22/dff9fe1922f15c33d5446fa743063649",
    mediaQuery: "(min-width: 769px)",
    visibilityClass: "hidden min-[769px]:flex",
  },
};

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

// Serialize global window.atOptions writes so separate banner scripts never collide.
let bannerLoadQueue: Promise<void> = Promise.resolve();

/**
 * Wait until first paint has settled so calculators and inputs always render and
 * become interactive before any ad script is scheduled.
 */
function scheduleAfterFirstPaint(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  let innerCancel: (() => void) | null = null;
  const rafId = window.requestAnimationFrame(() => {
    const win = window as Window & {
      requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback(cb, { timeout: 500 });
      innerCancel = () => win.cancelIdleCallback?.(idleId);
    } else {
      const timerId = window.setTimeout(cb, 250);
      innerCancel = () => window.clearTimeout(timerId);
    }
  });
  return () => {
    window.cancelAnimationFrame(rafId);
    innerCancel?.();
  };
}

interface AdsterraBannerProps {
  variant: AdsterraBannerVariant;
  className?: string;
}

/**
 * In-flow Adsterra iframe Banner slot rendered in SSR HTML with strict responsive CSS
 * breakpoint visibility (desktop >=769px or mobile <=768px) and an "Advertisement" label.
 * Only the matching viewport's script executes after first paint.
 */
export function AdsterraBanner({ variant, className = "" }: AdsterraBannerProps) {
  const spec = ADSTERRA_BANNERS[variant];
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = slotRef.current;
    if (!container) return;

    let cancelled = false;
    let cancelIdle: (() => void) | null = null;
    const mq = window.matchMedia(spec.mediaQuery);

    const injectBanner = () => {
      if (cancelled || !mq.matches || container.dataset.adsterraInit === "1") return;
      container.dataset.adsterraInit = "1";

      bannerLoadQueue = bannerLoadQueue.then(
        () =>
          new Promise<void>((resolve) => {
            if (cancelled || !slotRef.current || !mq.matches) {
              resolve();
              return;
            }
            window.atOptions = {
              key: spec.key,
              format: spec.format,
              height: spec.height,
              width: spec.width,
              params: {},
            };
            const script = document.createElement("script");
            script.setAttribute("data-cfasync", "false");
            script.src = spec.src;
            const done = () => resolve();
            const fallbackTimer = window.setTimeout(done, 2000);
            script.onload = () => {
              window.clearTimeout(fallbackTimer);
              done();
            };
            script.onerror = () => {
              window.clearTimeout(fallbackTimer);
              done();
            };
            container.appendChild(script);
          })
      );
    };

    const scheduleIfMatched = () => {
      if (!mq.matches || container.dataset.adsterraInit === "1") return;
      cancelIdle?.();
      cancelIdle = scheduleAfterFirstPaint(injectBanner);
    };

    scheduleIfMatched();
    mq.addEventListener("change", scheduleIfMatched);

    return () => {
      cancelled = true;
      cancelIdle?.();
      mq.removeEventListener("change", scheduleIfMatched);
    };
  }, [spec]);

  const paddingClass = /\bpx-/.test(className) ? "" : "px-4 sm:px-5 lg:px-6";

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={variant}
      data-ad-key={spec.key}
      data-ad-src={spec.src}
      data-ad-size={`${spec.width}x${spec.height}`}
      className={`w-full max-w-[1150px] mx-auto ${paddingClass} my-4 md:my-6 print:hidden ${spec.visibilityClass} flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 select-none">
        Advertisement
      </span>
      <div
        ref={slotRef}
        style={{
          width: `${spec.width}px`,
          minHeight: `${spec.height}px`,
          maxWidth: "100%",
        }}
        className="flex items-center justify-center overflow-hidden rounded-lg bg-slate-50/60 border border-slate-200/70"
      />
    </aside>
  );
}

interface AdsterraNativeBannerProps {
  className?: string;
}

/**
 * In-flow, lazily loaded Adsterra Native Banner slot rendered with its exact
 * container ID and "Advertisement" label on both desktop and mobile viewports.
 */
export function AdsterraNativeBanner({ className = "" }: AdsterraNativeBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || wrapper.dataset.adsterraInit === "1") return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let cancelIdle: (() => void) | null = null;

    const injectNative = () => {
      if (cancelled || wrapper.dataset.adsterraInit === "1") return;
      wrapper.dataset.adsterraInit = "1";

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("fetchpriority", "high");
      script.setAttribute("data-cfasync", "false");
      script.src = ADSTERRA_NATIVE_SPEC.src;
      wrapper.appendChild(script);
    };

    const startLazyLoad = () => {
      if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              observer?.disconnect();
              observer = null;
              injectNative();
            }
          },
          { rootMargin: "400px 0px" }
        );
        observer.observe(wrapper);
      } else {
        injectNative();
      }
    };

    cancelIdle = scheduleAfterFirstPaint(startLazyLoad);

    return () => {
      cancelled = true;
      cancelIdle?.();
      observer?.disconnect();
    };
  }, []);

  const paddingClass = /\bpx-/.test(className) ? "" : "px-4 sm:px-5 lg:px-6";

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot="native-banner"
      data-ad-key={ADSTERRA_NATIVE_SPEC.id}
      className={`w-full max-w-[1150px] mx-auto ${paddingClass} my-4 md:my-6 print:hidden flex flex-col items-center overflow-hidden ${className}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 select-none">
        Advertisement
      </span>
      <div
        ref={wrapperRef}
        className="w-full min-h-[100px] rounded-xl bg-slate-50/60 border border-slate-200/70 p-2 sm:p-3 overflow-hidden"
      >
        <div id={ADSTERRA_NATIVE_SPEC.containerId} />
      </div>
    </aside>
  );
}
