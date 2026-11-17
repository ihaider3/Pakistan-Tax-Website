import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { updateSiteContent } from "@/lib/content/contentServer";

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body || {};

    if (!key || typeof key !== "string" || typeof value !== "string") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const result = await updateSiteContent(key, value);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

