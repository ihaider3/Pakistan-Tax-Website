import { CalculatorType, TrackPayload } from "./types";

export function sendTrackBeacon(payload: TrackPayload): void {
  if (typeof window === "undefined") return;

  try {
    const data = JSON.stringify(payload);
    const url = "/api/track";

    // Modern fetch with keepalive ensures JSON headers are sent cleanly across all browsers
    if (typeof fetch === "function") {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {
        // Fallback to sendBeacon if fetch errors
        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
          const blob = new Blob([data], { type: "application/json" });
          navigator.sendBeacon(url, blob);
        }
      });
      return;
    }

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    }
  } catch {
    // Non-blocking
  }
}

export function trackPageView(pagePath?: string): void {
  if (typeof window === "undefined") return;
  const path = pagePath || window.location.pathname;

  // Never track admin panel itself
  if (path.startsWith("/admin") || path.startsWith("/api")) return;

  sendTrackBeacon({
    type: "page_view",
    page: path,
    referrer: document.referrer || undefined,
  });
}

export function trackToolUse(calculator: CalculatorType): void {
  sendTrackBeacon({
    type: "tool_use",
    calculator,
  });
}
