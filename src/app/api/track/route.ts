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
import { validateOrigin } from "@/lib/security/apiSecurity";

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
    const originCheck = validateOrigin(request);
    if (!originCheck.allowed) {
      return NextResponse.json({ success: true, ignored: "cross_origin" });
    }

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

    const country = request.headers.get("x-vercel-ip-country") || null;
    const city = request.headers.get("x-vercel-ip-city") || null;

    const visitorHash = hashVisitor(ip, userAgent);

    // 3. Sliding rate limit (max 60 events/hour per visitor)
    if (!checkVisitorRateLimit(visitorHash)) {
      return NextResponse.json({ success: true, rateLimited: true });
    }

    let body: any = null;
    try {
      body = await request.json();
    } catch {
      try {
        const text = await request.text();
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }
    }

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

      await recordPageView(page, visitorHash, cleanReferrer, device, country, city);
      return NextResponse.json({ success: true });
    }

    // Handle Tool Use event
    if (type === "tool_use") {
      if (!calculator || !VALID_CALCULATORS.includes(calculator as CalculatorType)) {
        return NextResponse.json({ error: "Invalid calculator" }, { status: 400 });
      }

      const { tool_name } = body;
      await recordToolUse(calculator as CalculatorType, visitorHash, tool_name);
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

