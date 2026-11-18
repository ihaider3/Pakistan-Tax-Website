import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/feedback/adminAuth";
import { validateOrigin } from "@/lib/security/apiSecurity";

export async function POST(request: NextRequest) {
  const originCheck = validateOrigin(request);
  if (!originCheck.allowed) {
    return NextResponse.json({ error: originCheck.error || "Forbidden" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return response;
}
