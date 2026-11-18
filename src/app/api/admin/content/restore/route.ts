import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { restoreSiteContent } from "@/lib/content/contentServer";
import { checkApiRateLimit, getClientIp, validateOrigin, sanitizeApiError } from "@/lib/security/apiSecurity";

export async function POST(request: NextRequest) {
  // 1. Origin check
  const originCheck = validateOrigin(request);
  if (!originCheck.allowed) {
    return NextResponse.json({ error: originCheck.error || "Forbidden" }, { status: 403 });
  }

  // 2. Rate limit (60 requests/minute per IP)
  const ip = getClientIp(request);
  const rateLimit = checkApiRateLimit(`admin-content-restore:${ip}`, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  // 3. Auth check
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key } = body || {};

    if (!key || typeof key !== "string" || key.length > 100) {
      return NextResponse.json({ error: "Invalid key parameter" }, { status: 400 });
    }

    const result = await restoreSiteContent(key);
    try {
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.warn("[Content Restore] Revalidation error:", revalErr);
    }
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = sanitizeApiError(err, "Failed to restore content");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

