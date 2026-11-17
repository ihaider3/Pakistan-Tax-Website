import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { getContentListForAdmin } from "@/lib/content/contentServer";

export async function GET(request: NextRequest) {
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

