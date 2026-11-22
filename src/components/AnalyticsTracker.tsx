"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics/beacon";
import { trackMetaPageView } from "@/lib/analytics/metaPixel";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pathname;
      trackPageView(pathname);
    } else if (lastTrackedPath.current !== pathname) {
      lastTrackedPath.current = pathname;
      trackPageView(pathname);
      trackMetaPageView();
    }
  }, [pathname]);

  return null;
}

