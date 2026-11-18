import { NextRequest, NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content/contentServer";
import { checkApiRateLimit, getClientIp } from "@/lib/security/apiSecurity";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkApiRateLimit(`public-content:${ip}`, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait." },
      { status: 429 }
    );
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({});
  }
}

