import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/feedback/supabaseServer";
import {
  DEFAULT_SITE_CONTENT,
  EDITABLE_KEYS,
  getDefaultContentMap,
  ContentFieldConfig,
} from "./defaultContent";

export interface AdminContentItem extends ContentFieldConfig {
  currentValue: string;
  updatedAt: string;
  hasHistory: boolean;
  previousValue?: string;
}

// In-memory fallback content & history stores for local dev or tests
const inMemorySiteContent = new Map<string, { value: string; updatedAt: string }>();
const inMemoryHistory: Array<{
  id: string;
  content_key: string;
  old_value: string;
  new_value: string;
  changed_at: string;
}> = [];

const requestCache: <T extends (...args: never[]) => unknown>(fn: T) => T =
  typeof cache === "function" ? cache : (fn) => fn;

/**
 * Return ONLY non-default custom overrides (in-memory or Supabase) so RootLayout
 * does not serialize all default site copy into every SSR RSC payload.
 */
export const getSiteContentOverrides = requestCache(
  async (): Promise<Record<string, string>> => {
    const overrides: Record<string, string> = {};

    for (const [key, entry] of inMemorySiteContent.entries()) {
      overrides[key] = entry.value;
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return overrides;
    }

    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("key, value")
        .limit(100);

      if (!error && data) {
        for (const row of data) {
          if (typeof row.value === "string") {
            overrides[row.key] = row.value;
          }
        }
      }
    } catch (err) {
      console.warn("[Content Server] Fallback overrides:", err);
    }

    return overrides;
  }
);

export async function getSiteContent(): Promise<Record<string, string>> {
  const contentMap = getDefaultContentMap();
  const overrides = await getSiteContentOverrides();
  return { ...contentMap, ...overrides };
}

export async function getContentListForAdmin(): Promise<AdminContentItem[]> {
  const supabase = getSupabaseAdmin();
  const dbContentMap = new Map<string, { value: string; updatedAt: string }>();
  const historyKeySet = new Set<string>();
  const lastHistoryMap = new Map<string, string>();

  // In-memory keys
  for (const [k, v] of inMemorySiteContent.entries()) {
    dbContentMap.set(k, v);
  }
  for (const h of inMemoryHistory) {
    historyKeySet.add(h.content_key);
    lastHistoryMap.set(h.content_key, h.old_value);
  }

  if (supabase) {
    try {
      const [contentRes, historyRes] = await Promise.all([
        supabase.from("site_content").select("key, value, updated_at"),
        supabase
          .from("content_history")
          .select("content_key, old_value, changed_at")
          .order("changed_at", { ascending: false }),
      ]);

      if (!contentRes.error && contentRes.data) {
        for (const row of contentRes.data) {
          dbContentMap.set(row.key, {
            value: row.value,
            updatedAt: row.updated_at,
          });
        }
      }

      if (!historyRes.error && historyRes.data) {
        for (const row of historyRes.data) {
          historyKeySet.add(row.content_key);
          if (!lastHistoryMap.has(row.content_key)) {
            lastHistoryMap.set(row.content_key, row.old_value);
          }
        }
      }
    } catch (err) {
      console.warn("[Content Server] Error fetching admin content list:", err);
    }
  }

  return DEFAULT_SITE_CONTENT.map((config) => {
    const dbEntry = dbContentMap.get(config.key);
    return {
      ...config,
      currentValue: dbEntry ? dbEntry.value : config.defaultValue,
      updatedAt: dbEntry ? dbEntry.updatedAt : "Default (Codebase)",
      hasHistory: historyKeySet.has(config.key),
      previousValue: lastHistoryMap.get(config.key),
    };
  });
}

export async function updateSiteContent(
  key: string,
  newValue: string
): Promise<{ success: boolean; key: string; value: string; updatedAt: string }> {
  if (!EDITABLE_KEYS.has(key)) {
    throw new Error(
      "Tax rates, slabs, nisab, Fitrana amounts, and calculation formulas are statutory and cannot be edited from this panel."
    );
  }

  const supabase = getSupabaseAdmin();
  const config = DEFAULT_SITE_CONTENT.find((c) => c.key === key);
  const page = config?.page || "general";
  const fieldLabel = config?.fieldLabel || key;
  const now = new Date().toISOString();

  // Find current/old value
  let oldValue = config?.defaultValue || "";
  if (inMemorySiteContent.has(key)) {
    oldValue = inMemorySiteContent.get(key)!.value;
  }

  if (supabase) {
    try {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (data && typeof data.value === "string") {
        oldValue = data.value;
      }
    } catch (err) {
      console.warn("[Content Server] Failed to query existing value:", err);
    }
  }

  // 1. Record old value in content_history
  inMemoryHistory.unshift({
    id: crypto.randomUUID(),
    content_key: key,
    old_value: oldValue,
    new_value: newValue,
    changed_at: now,
  });

  // 2. Update site_content
  inMemorySiteContent.set(key, { value: newValue, updatedAt: now });

  if (supabase) {
    try {
      await Promise.all([
        supabase.from("content_history").insert({
          content_key: key,
          old_value: oldValue,
          new_value: newValue,
          changed_at: now,
        }),
        supabase.from("site_content").upsert({
          key,
          page,
          field_label: fieldLabel,
          value: newValue,
          updated_at: now,
        }),
      ]);
    } catch (err) {
      console.warn("[Content Server] Supabase update error:", err);
    }
  }

  return { success: true, key, value: newValue, updatedAt: now };
}

export async function restoreSiteContent(
  key: string
): Promise<{ success: boolean; restoredValue: string }> {
  if (!EDITABLE_KEYS.has(key)) {
    throw new Error("Invalid content key.");
  }

  const supabase = getSupabaseAdmin();
  let candidateOldValue: string | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("content_history")
        .select("old_value, changed_at")
        .eq("content_key", key)
        .order("changed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data && typeof data.old_value === "string") {
        candidateOldValue = data.old_value;
      }
    } catch (err) {
      console.warn("[Content Server] Error querying history from Supabase:", err);
    }
  }

  if (candidateOldValue === null) {
    const memoryRecord = inMemoryHistory.find((h) => h.content_key === key);
    if (memoryRecord) {
      candidateOldValue = memoryRecord.old_value;
    }
  }

  if (candidateOldValue === null) {
    // If no history, restore to code default
    const config = DEFAULT_SITE_CONTENT.find((c) => c.key === key);
    candidateOldValue = config?.defaultValue || "";
  }

  await updateSiteContent(key, candidateOldValue);

  return { success: true, restoredValue: candidateOldValue };
}

export function resetInMemoryContent(): void {
  inMemorySiteContent.clear();
  inMemoryHistory.length = 0;
}

