import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { getAnalyticsMetrics } from "@/lib/analytics/trackerServer";

export async function GET(request: NextRequest) {
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
    return NextResponse.json(metrics);
  } catch (err: unknown) {
    console.error("[Admin Analytics API] Error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics metrics" },
      { status: 500 }
    );
  }
}

