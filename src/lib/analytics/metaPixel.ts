export const META_PIXEL_ID = "1774525983843690";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Fires a PageView event in Meta Pixel.
 */
export function trackMetaPageView(): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Fires a ViewContent event in Meta Pixel when a calculator result is shown.
 * NOTE: As per strict prompt requirements:
 * - Do NOT log calculator inputs — only the event name and page URL.
 */
export function trackMetaViewContent(contentName: string): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", "ViewContent", {
        content_name: contentName,
      });
    }
  } catch {
    // Non-blocking
  }
}

