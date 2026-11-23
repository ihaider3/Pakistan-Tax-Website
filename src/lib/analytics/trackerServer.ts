import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/feedback/supabaseServer";
import {
  PageViewRecord,
  ToolUseRecord,
  DeviceType,
  CalculatorType,
  AnalyticsMetrics,
  DailyTrendPoint,
  DailySummaryRow,
  ToolUsageStat,
  PageViewStat,
  CountrySplitStat,
  MonthlyTotalItem,
} from "./types";
import {
  storePageView,
  storeToolUse,
  getAllPageViews,
  getAllToolUses,
  getAllDailySummaries,
} from "./persistentStore";

export const RECORDING_START_DATE = "2026-11-23";
export const RECORDING_START_LABEL = "23 Nov 2026";

const BOT_PATTERNS = [
  /bot\b/i,
  /spider\b/i,
  /crawl\b/i,
  /slurp/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /duckduckgo/i,
  /baiduspider/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /curl/i,
  /wget/i,
  /python/i,
  /node-fetch/i,
  /axios/i,
  /headless/i,
  /playwright/i,
  /puppeteer/i,
  /lighthouse/i,
  /postman/i,
  /ahrefs/i,
  /semrush/i,
];

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function detectDevice(userAgent: string | null | undefined): DeviceType {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function sanitizeReferrer(
  rawReferrer: string | null | undefined,
  currentHost?: string | null
): string | null {
  if (!rawReferrer) return null;
  try {
    const url = new URL(rawReferrer);
    const domain = url.hostname.replace(/^www\./, "").toLowerCase();
    if (
      currentHost &&
      (domain === currentHost.replace(/^www\./, "").toLowerCase() ||
        domain.includes("localhost") ||
        domain.includes("127.0.0.1") ||
        domain.includes("vercel.app"))
    ) {
      return null; // internal navigation
    }
    return domain;
  } catch {
    return null;
  }
}

/**
 * Generates a privacy-first visitor hash.
 * Hashed from: IP + User-Agent + Day (YYYY-MM-DD) + Salt.
 * RAW IP and RAW User-Agent are NEVER stored or returned.
 * Deduplicates per day: refreshing does not create a new visitor.
 */
export function hashVisitor(ip: string, userAgent: string, day?: string): string {
  const salt = process.env.ANALYTICS_SALT || "pfc_analytics_privacy_salt_2026";
  const dateStr = day || new Date().toISOString().slice(0, 10);
  return crypto
    .createHash("sha256")
    .update(`${ip}::${userAgent}::${dateStr}::${salt}`)
    .digest("hex");
}

// In-memory sliding rate limiter: max 60 events per visitor hash per hour
const visitorEventsMap = new Map<string, number[]>();
const ONE_HOUR_MS = 60 * 60 * 1000;
const MAX_EVENTS_PER_HOUR = 60;

export function checkVisitorRateLimit(visitorHash: string): boolean {
  const now = Date.now();
  const timestamps = visitorEventsMap.get(visitorHash) || [];
  const filtered = timestamps.filter((t) => now - t < ONE_HOUR_MS);

  if (filtered.length >= MAX_EVENTS_PER_HOUR) {
    return false;
  }

  filtered.push(now);
  visitorEventsMap.set(visitorHash, filtered);
  return true;
}

export const CALCULATOR_TITLES: Record<CalculatorType, string> = {
  salary: "Salary Tax Calculator",
  zakat: "Zakat Calculator",
  property: "Property Tax Calculator",
  gst: "GST Calculator",
  fitrana: "Fitrana Calculator",
  ushr: "Ushr Calculator",
};

/**
 * Records a page view with strict privacy rules.
 */
export async function recordPageView(
  page: string,
  visitorHash: string,
  referrer: string | null,
  device: DeviceType,
  country?: string | null,
  city?: string | null
): Promise<void> {
  const record: PageViewRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    page,
    visitor_hash: visitorHash,
    referrer,
    device,
    country: country || null,
    city: city || null,
  };

  // 1. Store in persistent storage (Vercel Blob + local cache)
  await storePageView(record);

  // 2. If Supabase is configured, also persist to Supabase
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from("page_views").insert({
        page,
        visitor_hash: visitorHash,
        referrer,
        device,
        country: country || null,
        city: city || null,
      });

      // Update daily summary in Supabase
      const todayStr = record.created_at.slice(0, 10);
      try {
        await supabase.rpc("increment_daily_summary", {
          summary_date: todayStr,
          is_new_visitor: false, // can be handled via query
        });
      } catch {
        // Fallback upsert
        const { data } = await supabase
          .from("daily_analytics_summary")
          .select("page_views")
          .eq("date", todayStr)
          .single();

        const currentPvs = data?.page_views || 0;
        await supabase.from("daily_analytics_summary").upsert({
          date: todayStr,
          page_views: currentPvs + 1,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("[Analytics] Supabase page_views insert error:", err);
    }
  }
}

/**
 * Records a calculator usage event with strict privacy rules.
 * NEVER stores inputs or result amounts — only tool name, calculator type, timestamp, visitor hash.
 */
export async function recordToolUse(
  calculator: CalculatorType,
  visitorHash: string,
  toolName?: string
): Promise<void> {
  const resolvedToolName = toolName || CALCULATOR_TITLES[calculator] || "Calculator";
  const record: ToolUseRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    calculator,
    tool_name: resolvedToolName,
    visitor_hash: visitorHash,
  };

  // 1. Store in persistent storage (Vercel Blob + local cache)
  await storeToolUse(record);

  // 2. If Supabase is configured, also persist to Supabase
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from("tool_uses").insert({
        calculator,
        tool_name: resolvedToolName,
        visitor_hash: visitorHash,
      });

      const todayStr = record.created_at.slice(0, 10);
      const { data } = await supabase
        .from("daily_analytics_summary")
        .select("calculator_uses")
        .eq("date", todayStr)
        .single();

      const currentUses = data?.calculator_uses || 0;
      await supabase.from("daily_analytics_summary").upsert({
        date: todayStr,
        calculator_uses: currentUses + 1,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("[Analytics] Supabase tool_uses insert error:", err);
    }
  }
}

/**
 * Computes analytics metrics for admin dashboard.
 * Supports ranges: "7d" | "15d" | "30d" | "all" (default: "30d").
 */
export async function getAnalyticsMetrics(
  range: "7d" | "15d" | "30d" | "all" = "30d"
): Promise<AnalyticsMetrics> {
  const supabase = getSupabaseAdmin();
  let pageViews: PageViewRecord[] = [];
  let toolUses: ToolUseRecord[] = [];

  // 1. Try fetching from Supabase if configured
  if (supabase) {
    try {
      const [pvRes, tuRes] = await Promise.all([
        supabase
          .from("page_views")
          .select("id, created_at, page, visitor_hash, referrer, device, country, city")
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("tool_uses")
          .select("id, created_at, calculator, tool_name, visitor_hash")
          .order("created_at", { ascending: false })
          .limit(5000),
      ]);

      if (!pvRes.error && pvRes.data && pvRes.data.length > 0) {
        pageViews = pvRes.data as PageViewRecord[];
      }
      if (!tuRes.error && tuRes.data && tuRes.data.length > 0) {
        toolUses = tuRes.data as ToolUseRecord[];
      }
    } catch (err) {
      console.warn("[Analytics] Supabase query error, fallback to persistent store:", err);
    }
  }

  // 2. Fallback to persistent store (Vercel Blob / local disk)
  if (pageViews.length === 0) {
    pageViews = await getAllPageViews();
  }
  if (toolUses.length === 0) {
    toolUses = await getAllToolUses();
  }

  const storedDailySummaries = await getAllDailySummaries();

  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();

  const sevenDaysAgoMs = now - 7 * 24 * 60 * 60 * 1000;
  const fifteenDaysAgoMs = now - 15 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoMs = now - 30 * 24 * 60 * 60 * 1000;
  const thirtyMinsAgoMs = now - 30 * 60 * 1000;

  // Distinct visitor hashes for stat cards
  const visitorsTodaySet = new Set<string>();
  const visitors7dSet = new Set<string>();
  const visitors30dSet = new Set<string>();
  const active30mSet = new Set<string>();
  const allTimeVisitorsSet = new Set<string>();

  for (const pv of pageViews) {
    const t = new Date(pv.created_at).getTime();
    allTimeVisitorsSet.add(pv.visitor_hash);
    if (t >= todayMs) visitorsTodaySet.add(pv.visitor_hash);
    if (t >= sevenDaysAgoMs) visitors7dSet.add(pv.visitor_hash);
    if (t >= thirtyDaysAgoMs) visitors30dSet.add(pv.visitor_hash);
    if (t >= thirtyMinsAgoMs) active30mSet.add(pv.visitor_hash);
  }

  // Determine range cutoff
  let rangeDays = 30;
  if (range === "7d") rangeDays = 7;
  else if (range === "15d") rangeDays = 15;
  else if (range === "30d") rangeDays = 30;
  else if (range === "all") rangeDays = 60; // show all available up to 60 days

  let rangeFilterMs = now - rangeDays * 24 * 60 * 60 * 1000;
  if (range === "all") rangeFilterMs = 0;

  const filteredViews = pageViews.filter(
    (pv) => new Date(pv.created_at).getTime() >= rangeFilterMs
  );
  const filteredTools = toolUses.filter(
    (tu) => new Date(tu.created_at).getTime() >= rangeFilterMs
  );

  // Daily Trend & Daily Summary Table
  const dailyTrend: DailyTrendPoint[] = [];
  const dailySummaryTable: DailySummaryRow[] = [];

  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const isPrior = dateStr < RECORDING_START_DATE;

    const summary = storedDailySummaries[dateStr];
    let uniqueVisitors = 0;
    let pvs = 0;
    let toolCount = 0;

    if (!isPrior) {
      if (summary) {
        uniqueVisitors = summary.uniqueVisitors;
        pvs = summary.pageViews;
        toolCount = summary.calculatorUses;
      } else {
        // Fallback calculation from filtered raw records
        const dayPvs = pageViews.filter((pv) => pv.created_at.startsWith(dateStr));
        const dayTus = toolUses.filter((tu) => tu.created_at.startsWith(dateStr));
        pvs = dayPvs.length;
        toolCount = dayTus.length;
        const vSet = new Set(dayPvs.map((p) => p.visitor_hash));
        uniqueVisitors = vSet.size;
      }
    }

    dailyTrend.push({
      date: dateStr,
      label,
      visitors: uniqueVisitors,
      pageViews: pvs,
      calculatorUses: toolCount,
    });

    dailySummaryTable.push({
      date: dateStr,
      label,
      uniqueVisitors,
      pageViews: pvs,
      calculatorUses: toolCount,
      isPriorToRecording: isPrior,
    });
  }

  // Reverse summary table so newest date is on top
  dailySummaryTable.reverse();

  // Most-used tools ranked
  const toolStats: Record<CalculatorType, { total: number; last30d: number }> = {
    salary: { total: 0, last30d: 0 },
    zakat: { total: 0, last30d: 0 },
    property: { total: 0, last30d: 0 },
    gst: { total: 0, last30d: 0 },
    fitrana: { total: 0, last30d: 0 },
    ushr: { total: 0, last30d: 0 },
  };

  const totalToolUsesCount = toolUses.length;

  for (const tu of toolUses) {
    if (toolStats[tu.calculator]) {
      toolStats[tu.calculator].total += 1;
      if (new Date(tu.created_at).getTime() >= thirtyDaysAgoMs) {
        toolStats[tu.calculator].last30d += 1;
      }
    }
  }

  const mostUsedTools: ToolUsageStat[] = (
    Object.keys(toolStats) as CalculatorType[]
  ).map((calc) => {
    const total = toolStats[calc].total;
    const sharePercent =
      totalToolUsesCount > 0 ? Math.round((total / totalToolUsesCount) * 100) : 0;
    return {
      calculator: calc,
      label: CALCULATOR_TITLES[calc],
      totalUses: total,
      last30dUses: toolStats[calc].last30d,
      sharePercent,
    };
  });
  mostUsedTools.sort((a, b) => b.totalUses - a.totalUses);

  // Page views table
  const standardPages = [
    "/",
    "/salary-tax-calculator",
    "/zakat-calculator",
    "/property-tax-calculator",
    "/gst-calculator",
    "/fitrana-calculator",
    "/ushr-calculator",
    "/about",
    "/contact",
    "/methodology",
    "/privacy-policy",
    "/disclaimer",
  ];

  const pageMap = new Map<
    string,
    { today: number; last7d: number; last30d: number; allTime: number }
  >();

  for (const p of standardPages) {
    pageMap.set(p, { today: 0, last7d: 0, last30d: 0, allTime: 0 });
  }

  for (const pv of pageViews) {
    const p = pv.page || "/";
    if (!pageMap.has(p)) {
      pageMap.set(p, { today: 0, last7d: 0, last30d: 0, allTime: 0 });
    }
    const stat = pageMap.get(p)!;
    const t = new Date(pv.created_at).getTime();
    stat.allTime += 1;
    if (t >= thirtyDaysAgoMs) stat.last30d += 1;
    if (t >= sevenDaysAgoMs) stat.last7d += 1;
    if (t >= todayMs) stat.today += 1;
  }

  const pageViewsTable: PageViewStat[] = Array.from(pageMap.entries()).map(
    ([page, counts]) => ({
      page,
      ...counts,
    })
  );
  pageViewsTable.sort((a, b) => b.allTime - a.allTime);

  // Device split
  let mobileCount = 0;
  let tabletCount = 0;
  let desktopCount = 0;
  const targetViews = filteredViews.length > 0 ? filteredViews : pageViews;

  for (const pv of targetViews) {
    if (pv.device === "mobile") mobileCount++;
    else if (pv.device === "tablet") tabletCount++;
    else desktopCount++;
  }
  const totalDev = targetViews.length || 1;

  const deviceSplit = [
    {
      mobile: {
        count: mobileCount,
        percent: Math.round((mobileCount / totalDev) * 100),
      },
      tablet: {
        count: tabletCount,
        percent: Math.round((tabletCount / totalDev) * 100),
      },
      desktop: {
        count: desktopCount,
        percent: Math.round((desktopCount / totalDev) * 100),
      },
    },
  ];

  // Country split (only countries actually recorded)
  const countryCounts = new Map<string, number>();
  for (const pv of targetViews) {
    if (pv.country) {
      countryCounts.set(pv.country, (countryCounts.get(pv.country) || 0) + 1);
    }
  }

  const countrySplit: CountrySplitStat[] = Array.from(countryCounts.entries())
    .map(([country, count]) => ({
      country,
      count,
      percent: Math.round((count / (targetViews.length || 1)) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Top referrers
  const refMap = new Map<string, number>();
  for (const pv of targetViews) {
    if (pv.referrer) {
      refMap.set(pv.referrer, (refMap.get(pv.referrer) || 0) + 1);
    }
  }
  const topReferrers = Array.from(refMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Recent activity
  const allEvents = [
    ...pageViews.map((pv) => ({
      id: pv.id,
      type: "page_view" as const,
      target: pv.page,
      device: pv.device,
      createdAt: pv.created_at,
    })),
    ...toolUses.map((tu) => ({
      id: tu.id,
      type: "tool_use" as const,
      target: `${tu.tool_name || CALCULATOR_TITLES[tu.calculator]} (Calculated)`,
      device: "client",
      createdAt: tu.created_at,
    })),
  ];
  allEvents.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentActivity = allEvents.slice(0, 50);

  // Monthly totals from permanent summaries
  const monthlyMap = new Map<
    string,
    { visitorsSet: Set<string>; pageViews: number; toolUses: number }
  >();

  for (const [day, summary] of Object.entries(storedDailySummaries)) {
    const monthKey = day.slice(0, 7); // YYYY-MM
    const dateObj = new Date(day + "T00:00:00Z");
    const monthLabel = dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!monthlyMap.has(monthLabel)) {
      monthlyMap.set(monthLabel, { visitorsSet: new Set(), pageViews: 0, toolUses: 0 });
    }
    const m = monthlyMap.get(monthLabel)!;
    m.pageViews += summary.pageViews;
    m.toolUses += summary.calculatorUses;
    for (const h of summary.visitorHashes || []) {
      m.visitorsSet.add(h);
    }
  }

  const monthlyTotals: MonthlyTotalItem[] = Array.from(monthlyMap.entries()).map(
    ([month, data]) => ({
      month,
      visitors: data.visitorsSet.size,
      pageViews: data.pageViews,
      toolUses: data.toolUses,
    })
  );

  return {
    range,
    recordingStartDate: RECORDING_START_LABEL,
    statCards: {
      visitorsToday: visitorsTodaySet.size,
      visitors7d: visitors7dSet.size,
      visitors30d: visitors30dSet.size,
      totalPageViews: pageViews.length,
      totalToolUses: toolUses.length,
      activeLast30Min: active30mSet.size,
      allTimeVisitors: allTimeVisitorsSet.size,
      allTimePageViews: pageViews.length,
      allTimeToolUses: toolUses.length,
    },
    dailyTrend,
    dailySummaryTable,
    mostUsedTools,
    pageViewsTable,
    deviceSplit,
    countrySplit,
    topReferrers,
    recentActivity,
    monthlyTotals,
  };
}
