import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { getSupabaseAdmin, FEEDBACK_SCREENSHOTS_BUCKET } from "@/lib/feedback/supabaseServer";
import { getInMemorySubmissions } from "@/lib/feedback/inMemoryStore";

const VALID_STATUSES = new Set(["pending", "in_progress", "resolved"]);

export async function PATCH(
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

  try {
    const body = await request.json();
    const status = body?.status;

    if (!status || !VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, in_progress, or resolved." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("[Admin Update Status API] Error:", error);
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
      }

      return NextResponse.json({ success: true, item: data });
    }

    // In-memory fallback
    const inMemory = getInMemorySubmissions();
    const item = inMemory.find((i) => i.id === id);
    if (item) {
      item.status = status;
      return NextResponse.json({ success: true, item });
    }

    return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
  } catch (err: unknown) {
    console.error("[Admin Update Status API] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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

  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      // Find screenshot path to delete if exists
      const { data: existing } = await supabase
        .from("feedback")
        .select("screenshot_url")
        .eq("id", id)
        .single();

      if (existing?.screenshot_url) {
        await supabase.storage
          .from(FEEDBACK_SCREENSHOTS_BUCKET)
          .remove([existing.screenshot_url])
          .catch((err) => console.warn("[Admin Delete API] Storage removal error:", err));
      }

      const { error } = await supabase.from("feedback").delete().eq("id", id);
      if (error) {
        console.error("[Admin Delete API] Supabase delete error:", error);
        return NextResponse.json({ error: "Failed to delete feedback" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Feedback deleted successfully" });
    }

    // In-memory fallback
    const inMemory = getInMemorySubmissions();
    const index = inMemory.findIndex((i) => i.id === id);
    if (index !== -1) {
      inMemory.splice(index, 1);
      return NextResponse.json({ success: true, message: "Feedback deleted successfully" });
    }

    return NextResponse.json({ error: "Feedback item not found" }, { status: 404 });
  } catch (err: unknown) {
    console.error("[Admin Delete API] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
