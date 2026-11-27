"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const send = () => {
      void import("@/lib/analytics/beacon").then(({ trackPageView }) => {
        if (lastTrackedPath.current === null) {
          lastTrackedPath.current = pathname;
          trackPageView(pathname);
        } else if (lastTrackedPath.current !== pathname) {
          lastTrackedPath.current = pathname;
          trackPageView(pathname);
          void import("@/lib/analytics/metaPixel").then(({ trackMetaPageView }) => {
            trackMetaPageView();
          });
        }
      });
    };

    const isInitialMount = lastTrackedPath.current === null;
    const timer = window.setTimeout(send, isInitialMount ? 1500 : 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

