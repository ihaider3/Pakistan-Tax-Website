import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin, getFailedLoginCount7Days } from "@/lib/feedback/adminAuth";
import { getAnalyticsMetrics } from "@/lib/analytics/trackerServer";
import { checkApiRateLimit, getClientIp } from "@/lib/security/apiSecurity";

export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const ip = getClientIp(request);
  const rateLimit = checkApiRateLimit(`admin-analytics:${ip}`, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait." },
      { status: 429 }
    );
  }

  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range") || "all";
    const range = ["today", "7d", "30d", "all"].includes(rangeParam)
      ? (rangeParam as "today" | "7d" | "30d" | "all")
      : "all";

    const metrics = await getAnalyticsMetrics(range);
    const failedLogins7d = getFailedLoginCount7Days();

    return NextResponse.json({
      ...metrics,
      security: {
        failedLogins7d,
      },
    });
  } catch (err: unknown) {
    console.error("[Admin Analytics API] Error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics metrics" },
      { status: 500 }
    );
  }
}

