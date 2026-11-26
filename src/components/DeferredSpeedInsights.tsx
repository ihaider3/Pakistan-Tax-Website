"use client";

import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false }
);

/**
 * Lazy-loaded SpeedInsights wrapper so telemetry chunk stays off the critical first-paint bundle.
 */
export default function DeferredSpeedInsights() {
  return <SpeedInsights />;
}
