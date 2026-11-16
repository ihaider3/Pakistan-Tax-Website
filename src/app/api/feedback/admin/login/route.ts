import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  generateSessionToken,
  ADMIN_COOKIE_NAME,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from "@/lib/feedback/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Check IP rate limit (max 5 failed attempts per 15 min, 15 min lockout)
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts, please try again later" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const password = body?.password;

    if (!password || typeof password !== "string") {
      recordFailedLogin(ip);
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      recordFailedLogin(ip);
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Success: reset failed attempts for this IP
    recordSuccessfulLogin(ip);

    const token = generateSessionToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: unknown) {
    console.error("[Admin Login API] Error:", err);
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
}
