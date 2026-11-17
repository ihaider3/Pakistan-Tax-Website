import { NextRequest, NextResponse } from "next/server";
import {
  isBot,
  detectDevice,
  sanitizeReferrer,
  hashVisitor,
  checkVisitorRateLimit,
  recordPageView,
  recordToolUse,
} from "@/lib/analytics/trackerServer";
import { CalculatorType } from "@/lib/analytics/types";

const VALID_CALCULATORS: CalculatorType[] = [
  "salary",
  "zakat",
  "property",
  "gst",
  "fitrana",
  "ushr",
];

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "";

    // 1. Filter out known bots/crawlers
    if (isBot(userAgent)) {
      return NextResponse.json({ success: true, ignored: "bot" });
    }

    // 2. Extract visitor hash (privacy-first: raw IP is NEVER stored)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const visitorHash = hashVisitor(ip, userAgent);

    // 3. Sliding rate limit (max 60 events/hour per visitor)
    if (!checkVisitorRateLimit(visitorHash)) {
      return NextResponse.json({ success: true, rateLimited: true });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { type, page, calculator, referrer } = body;

    // Handle Page View event
    if (type === "page_view") {
      if (typeof page !== "string" || !page.startsWith("/") || page.length > 200) {
        return NextResponse.json({ error: "Invalid page" }, { status: 400 });
      }

      // Ignore admin page views in public tracking
      if (page.startsWith("/admin") || page.startsWith("/api")) {
        return NextResponse.json({ success: true, ignored: "admin" });
      }

      const host = request.headers.get("host");
      const cleanReferrer = sanitizeReferrer(referrer, host);
      const device = detectDevice(userAgent);

      await recordPageView(page, visitorHash, cleanReferrer, device);
      return NextResponse.json({ success: true });
    }

    // Handle Tool Use event
    if (type === "tool_use") {
      if (!calculator || !VALID_CALCULATORS.includes(calculator as CalculatorType)) {
        return NextResponse.json({ error: "Invalid calculator" }, { status: 400 });
      }

      await recordToolUse(calculator as CalculatorType, visitorHash);
      return NextResponse.json({ success: true });
    }

    // Handle generic PWA install tracking
    if (type === "pwa_install") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
  } catch (err) {
    console.warn("[Track API] Non-fatal error:", err);
    return NextResponse.json({ success: true }); // Never fail client
  }
}

