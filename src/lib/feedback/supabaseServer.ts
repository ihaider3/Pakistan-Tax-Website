import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const FEEDBACK_SCREENSHOTS_BUCKET = "feedback-screenshots";

export interface FeedbackRecord {
  id: string;
  created_at: string;
  category: "problem" | "feedback" | "feature";
  calculator: "general" | "salary" | "zakat" | "property" | "gst" | "fitrana";
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  screenshot_url: string | null;
  status: "pending" | "in_progress" | "resolved";
  user_agent: string | null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}
