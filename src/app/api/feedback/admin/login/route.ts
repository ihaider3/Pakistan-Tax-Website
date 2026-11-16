import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  generateSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/feedback/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

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
