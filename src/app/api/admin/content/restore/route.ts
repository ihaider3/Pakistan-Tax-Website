import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { restoreSiteContent } from "@/lib/content/contentServer";

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key } = body || {};

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Invalid key parameter" }, { status: 400 });
    }

    const result = await restoreSiteContent(key);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to restore content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

