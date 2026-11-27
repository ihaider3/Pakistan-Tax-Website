"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false }
);

/**
 * Lazy-loaded SpeedInsights wrapper mounted after window load/idle so telemetry
 * chunk stays off the critical first-paint and mobile hydration window.
 */
export default function DeferredSpeedInsights() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let timerId: number | undefined;
    const mount = () => {
      timerId = window.setTimeout(() => setReady(true), 4500);
    };
    if (document.readyState === "complete") {
      mount();
    } else {
      window.addEventListener("load", mount, { once: true });
    }
    return () => {
      window.removeEventListener("load", mount);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  return ready ? <SpeedInsights /> : null;
}
