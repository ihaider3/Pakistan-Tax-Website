"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";
import type { SummaryData } from "@/lib/summary";

const PrintReport = lazy(() => import("./PrintReport"));

/**
 * Defers loading the A4 print layout chunk until post-load idle (or beforeprint)
 * so calculator pages stay lightweight while printing remains instant.
 */
export default function LazyPrintReport({
  data,
  language = "roman",
}: {
  data: SummaryData;
  language?: "roman" | "en";
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadNow = () => setReady(true);
    window.addEventListener("beforeprint", loadNow, { once: true });
    const timer = window.setTimeout(loadNow, 1200);
    return () => {
      window.removeEventListener("beforeprint", loadNow);
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <PrintReport data={data} language={language} />
    </Suspense>
  );
}
