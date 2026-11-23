import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";
import {
  PageViewRecord,
  ToolUseRecord,
  DailySummaryRow,
} from "./types";

export interface StoredDailySummary {
  date: string; // YYYY-MM-DD
  uniqueVisitors: number;
  pageViews: number;
  calculatorUses: number;
  visitorHashes: string[]; // only hashes used to calculate unique visitors for the day
}

interface AnalyticsBlobData {
  version: number;
  updatedAt: string;
  dailySummaries: Record<string, StoredDailySummary>;
  pageViews: PageViewRecord[];
  toolUses: ToolUseRecord[];
}

const BLOB_PATH = "pfc-analytics/data-v1.json";
const TMP_DIR = process.env.TMPDIR || process.env.TEMP || "/tmp";
const LOCAL_CACHE_FILE = path.join(TMP_DIR, "pfc_analytics_local_data.json");

// In-memory cache
let inMemoryData: AnalyticsBlobData = {
  version: 1,
  updatedAt: new Date().toISOString(),
  dailySummaries: {},
  pageViews: [],
  toolUses: [],
};

let isLoaded = false;
let isSyncing = false;
let pendingSync = false;

// 90 days in ms for raw records retention
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;

function loadFromLocalDisk(): AnalyticsBlobData | null {
  try {
    if (fs.existsSync(LOCAL_CACHE_FILE)) {
      const content = fs.readFileSync(LOCAL_CACHE_FILE, "utf8");
      return JSON.parse(content);
    }
  } catch {
    // ignore
  }
  return null;
}

function saveToLocalDisk(data: AnalyticsBlobData): void {
  try {
    fs.writeFileSync(LOCAL_CACHE_FILE, JSON.stringify(data), "utf8");
  } catch {
    // ignore
  }
}

/**
 * Initializes and loads analytics data from Vercel Blob or local fallback.
 */
export async function ensureAnalyticsLoaded(): Promise<AnalyticsBlobData> {
  if (isLoaded) return inMemoryData;

  // 1. Try loading from local disk first (fast)
  const local = loadFromLocalDisk();
  if (local && typeof local.dailySummaries === "object") {
    inMemoryData = local;
  }

  // 2. If Vercel Blob token is available, fetch latest blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({
        prefix: BLOB_PATH,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }).catch(() => ({ blobs: [] }));

      if (blobs && blobs.length > 0 && blobs[0].url) {
        const res = await fetch(blobs[0].url, { cache: "no-store" });
        if (res.ok) {
          const remoteData = (await res.json()) as AnalyticsBlobData;
          if (remoteData && typeof remoteData.dailySummaries === "object") {
            inMemoryData = remoteData;
            saveToLocalDisk(inMemoryData);
          }
        }
      }
    } catch (err) {
      console.warn("[Analytics Store] Remote blob load fallback to local:", err);
    }
  }

  isLoaded = true;
  return inMemoryData;
}

/**
 * Persists current in-memory data to Vercel Blob and local disk.
 */
export async function syncAnalytics(): Promise<void> {
  if (isSyncing) {
    pendingSync = true;
    return;
  }

  isSyncing = true;
  inMemoryData.updatedAt = new Date().toISOString();
  saveToLocalDisk(inMemoryData);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put(BLOB_PATH, JSON.stringify(inMemoryData), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    } catch (err) {
      console.warn("[Analytics Store] Remote blob sync error:", err);
    }
  }

  isSyncing = false;
  if (pendingSync) {
    pendingSync = false;
    setTimeout(() => {
      syncAnalytics().catch(() => {});
    }, 1000);
  }
}

/**
 * Cleans up raw visit & tool-use entries older than 90 days.
 * Daily summaries are NEVER deleted.
 */
function purgeStaleRawData(): void {
  const cutoff = Date.now() - RETENTION_MS;
  inMemoryData.pageViews = inMemoryData.pageViews.filter(
    (pv) => new Date(pv.created_at).getTime() >= cutoff
  );
  inMemoryData.toolUses = inMemoryData.toolUses.filter(
    (tu) => new Date(tu.created_at).getTime() >= cutoff
  );
}

/**
 * Records a page view and updates the permanent daily summary.
 */
export async function storePageView(record: PageViewRecord): Promise<void> {
  await ensureAnalyticsLoaded();

  // 1. Append to raw page views
  inMemoryData.pageViews.unshift(record);

  // 2. Update permanent daily summary (YYYY-MM-DD)
  const day = record.created_at.slice(0, 10);
  if (!inMemoryData.dailySummaries[day]) {
    inMemoryData.dailySummaries[day] = {
      date: day,
      uniqueVisitors: 0,
      pageViews: 0,
      calculatorUses: 0,
      visitorHashes: [],
    };
  }

  const summary = inMemoryData.dailySummaries[day];
  summary.pageViews += 1;
  if (!summary.visitorHashes.includes(record.visitor_hash)) {
    summary.visitorHashes.push(record.visitor_hash);
    summary.uniqueVisitors = summary.visitorHashes.length;
  }

  purgeStaleRawData();
  syncAnalytics().catch(() => {});
}

/**
 * Records a calculator usage event and updates the permanent daily summary.
 */
export async function storeToolUse(record: ToolUseRecord): Promise<void> {
  await ensureAnalyticsLoaded();

  // 1. Append to raw tool uses
  inMemoryData.toolUses.unshift(record);

  // 2. Update permanent daily summary (YYYY-MM-DD)
  const day = record.created_at.slice(0, 10);
  if (!inMemoryData.dailySummaries[day]) {
    inMemoryData.dailySummaries[day] = {
      date: day,
      uniqueVisitors: 0,
      pageViews: 0,
      calculatorUses: 0,
      visitorHashes: [],
    };
  }

  inMemoryData.dailySummaries[day].calculatorUses += 1;

  purgeStaleRawData();
  syncAnalytics().catch(() => {});
}

/**
 * Returns all raw page views.
 */
export async function getAllPageViews(): Promise<PageViewRecord[]> {
  await ensureAnalyticsLoaded();
  return inMemoryData.pageViews;
}

/**
 * Returns all raw tool uses.
 */
export async function getAllToolUses(): Promise<ToolUseRecord[]> {
  await ensureAnalyticsLoaded();
  return inMemoryData.toolUses;
}

/**
 * Returns all permanent daily summaries.
 */
export async function getAllDailySummaries(): Promise<Record<string, StoredDailySummary>> {
  await ensureAnalyticsLoaded();
  return inMemoryData.dailySummaries;
}

/**
 * Reset helper for testing
 */
export function resetPersistentStore(): void {
  inMemoryData = {
    version: 1,
    updatedAt: new Date().toISOString(),
    dailySummaries: {},
    pageViews: [],
    toolUses: [],
  };
  isLoaded = true;
  try {
    if (fs.existsSync(LOCAL_CACHE_FILE)) {
      fs.unlinkSync(LOCAL_CACHE_FILE);
    }
  } catch {
    // ignore
  }
}
