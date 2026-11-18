import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { getContentListForAdmin } from "@/lib/content/contentServer";
import { checkApiRateLimit, getClientIp } from "@/lib/security/apiSecurity";

export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const ip = getClientIp(request);
  const rateLimit = checkApiRateLimit(`admin-content:${ip}`, 60, 60 * 1000);
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
    const list = await getContentListForAdmin();
    return NextResponse.json({ items: list });
  } catch (err: unknown) {
    console.error("[Admin Content API] Error:", err);
    return NextResponse.json(
      { error: "Failed to load content list" },
      { status: 500 }
    );
  }
}

