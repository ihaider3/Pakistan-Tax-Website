import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { getSupabaseAdmin, FEEDBACK_SCREENSHOTS_BUCKET } from "@/lib/feedback/supabaseServer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing feedback ID" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase storage is not configured." },
      { status: 503 }
    );
  }

  try {
    const { data: record, error: findError } = await supabase
      .from("feedback")
      .select("screenshot_url")
      .eq("id", id)
      .single();

    if (findError || !record?.screenshot_url) {
      return NextResponse.json({ error: "Screenshot not found." }, { status: 404 });
    }

    // Generate signed URL valid for 5 minutes (300 seconds)
    const { data: signedData, error: signError } = await supabase.storage
      .from(FEEDBACK_SCREENSHOTS_BUCKET)
      .createSignedUrl(record.screenshot_url, 300);

    if (signError || !signedData?.signedUrl) {
      console.error("[Screenshot API] Signed URL creation failed:", signError);
      return NextResponse.json({ error: "Failed to generate screenshot URL." }, { status: 500 });
    }

    // If client requested via standard browser link, redirect to the signed URL
    const acceptHeader = request.headers.get("accept") || "";
    if (acceptHeader.includes("text/html")) {
      return NextResponse.redirect(signedData.signedUrl);
    }

    return NextResponse.json({ signedUrl: signedData.signedUrl });
  } catch (err: unknown) {
    console.error("[Screenshot API] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
