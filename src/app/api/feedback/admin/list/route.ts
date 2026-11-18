import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import { getSupabaseAdmin } from "@/lib/feedback/supabaseServer";
import { getInMemorySubmissions } from "@/lib/feedback/inMemoryStore";
import { checkApiRateLimit, getClientIp } from "@/lib/security/apiSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Rate limit: 120 requests/minute per IP
  const ip = getClientIp(request);
  const rateLimit = checkApiRateLimit(`admin-feedback-list:${ip}`, 120, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const calculator = searchParams.get("calculator") || "all";
  const status = searchParams.get("status") || "all";
  const search = (searchParams.get("search") || "").slice(0, 100).trim().toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  const supabase = getSupabaseAdmin();

  if (supabase) {
    try {
      // 1. Fetch counts
      const countsPromise = Promise.all([
        supabase.from("feedback").select("id", { count: "exact", head: true }),
        supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
        supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "resolved"),
      ]);

      // 2. Fetch filtered items
      let query = supabase.from("feedback").select("*", { count: "exact" }).order("created_at", { ascending: false });

      if (category !== "all") {
        query = query.eq("category", category);
      }
      if (calculator !== "all") {
        query = query.eq("calculator", calculator);
      }
      if (status !== "all") {
        query = query.eq("status", status);
      }
      if (search) {
        query = query.or(`message.ilike.%${search}%,name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      query = query.range(offset, offset + limit - 1);

      const [[totalRes, pendingRes, inProgressRes, resolvedRes], { data, count, error }] = await Promise.all([
        countsPromise,
        query,
      ]);

      if (error) {
        console.error("[Admin List API] Supabase query error:", error);
        return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
      }

      return NextResponse.json({
        items: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        counts: {
          total: totalRes.count || 0,
          pending: pendingRes.count || 0,
          in_progress: inProgressRes.count || 0,
          resolved: resolvedRes.count || 0,
        },
      });
    } catch (err: unknown) {
      console.error("[Admin List API] Unexpected error:", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  // Fallback: In-memory store when Supabase is not configured
  const inMemory = getInMemorySubmissions();
  let filtered = [...inMemory];

  if (category !== "all") {
    filtered = filtered.filter((item) => item.category === category);
  }
  if (calculator !== "all") {
    filtered = filtered.filter((item) => item.calculator === calculator);
  }
  if (status !== "all") {
    filtered = filtered.filter((item) => item.status === status);
  }
  if (search) {
    filtered = filtered.filter(
      (item) =>
        item.message.toLowerCase().includes(search) ||
        item.name?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search)
    );
  }

  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    items: paginated,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
    counts: {
      total: inMemory.length,
      pending: inMemory.filter((i) => i.status === "pending").length,
      in_progress: inMemory.filter((i) => i.status === "in_progress").length,
      resolved: inMemory.filter((i) => i.status === "resolved").length,
    },
    notice: "Using local memory buffer (Supabase env vars not detected)",
  });
}
