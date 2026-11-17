import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/feedback/supabaseServer";
import {
  PageViewRecord,
  ToolUseRecord,
  DeviceType,
  CalculatorType,
  AnalyticsMetrics,
  DailyTrendPoint,
  ToolUsageStat,
  PageViewStat,
} from "./types";
import {
  addInMemoryPageView,
  addInMemoryToolUse,
  getInMemoryPageViews,
  getInMemoryToolUses,
} from "./inMemoryAnalyticsStore";

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

export function hashVisitor(ip: string, userAgent: string): string {
  const salt = process.env.ANALYTICS_SALT || "pfc_analytics_privacy_salt_2026";
  return crypto
    .createHash("sha256")
    .update(`${ip}::${userAgent}::${salt}`)
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

export async function recordPageView(
  page: string,
  visitorHash: string,
  referrer: string | null,
  device: DeviceType
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const record: PageViewRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    page,
    visitor_hash: visitorHash,
    referrer,
    device,
  };

  if (!supabase) {
    addInMemoryPageView(record);
    return;
  }

  try {
    const { error } = await supabase.from("page_views").insert({
      page,
      visitor_hash: visitorHash,
      referrer,
      device,
    });
    if (error) {
      console.warn("[Analytics] Supabase page_views insert error:", error.message);
      addInMemoryPageView(record);
    }
  } catch (err) {
    console.warn("[Analytics] Failed to insert page_view into Supabase:", err);
    addInMemoryPageView(record);
  }
}

export async function recordToolUse(
  calculator: CalculatorType,
  visitorHash: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const record: ToolUseRecord = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    calculator,
    visitor_hash: visitorHash,
  };

  if (!supabase) {
    addInMemoryToolUse(record);
    return;
  }

  try {
    const { error } = await supabase.from("tool_uses").insert({
      calculator,
      visitor_hash: visitorHash,
    });
    if (error) {
      console.warn("[Analytics] Supabase tool_uses insert error:", error.message);
      addInMemoryToolUse(record);
    }
  } catch (err) {
    console.warn("[Analytics] Failed to insert tool_use into Supabase:", err);
    addInMemoryToolUse(record);
  }
}

export async function getAnalyticsMetrics(
  range: "today" | "7d" | "30d" | "all" = "all"
): Promise<AnalyticsMetrics> {
  const supabase = getSupabaseAdmin();
  let pageViews: PageViewRecord[] = [];
  let toolUses: ToolUseRecord[] = [];

  if (supabase) {
    try {
      const [pvRes, tuRes] = await Promise.all([
        supabase
          .from("page_views")
          .select("id, created_at, page, visitor_hash, referrer, device")
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("tool_uses")
          .select("id, created_at, calculator, visitor_hash")
          .order("created_at", { ascending: false })
          .limit(5000),
      ]);

      if (!pvRes.error && pvRes.data) {
        pageViews = pvRes.data as PageViewRecord[];
      }
      if (!tuRes.error && tuRes.data) {
        toolUses = tuRes.data as ToolUseRecord[];
      }
    } catch (err) {
      console.warn("[Analytics] Error loading from Supabase:", err);
    }
  }

  // If no Supabase data (or fallback) combine with in-memory
  if (pageViews.length === 0) {
    pageViews = getInMemoryPageViews();
  }
  if (toolUses.length === 0) {
    toolUses = getInMemoryToolUses();
  }

  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();

  const sevenDaysAgoMs = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgoMs = now - 30 * 24 * 60 * 60 * 1000;
  const thirtyMinsAgoMs = now - 30 * 60 * 1000;

  // Distinct visitor hashes for stat cards
  const visitorsTodaySet = new Set<string>();
  const visitors7dSet = new Set<string>();
  const visitors30dSet = new Set<string>();
  const active30mSet = new Set<string>();

  for (const pv of pageViews) {
    const t = new Date(pv.created_at).getTime();
    if (t >= todayMs) visitorsTodaySet.add(pv.visitor_hash);
    if (t >= sevenDaysAgoMs) visitors7dSet.add(pv.visitor_hash);
    if (t >= thirtyDaysAgoMs) visitors30dSet.add(pv.visitor_hash);
    if (t >= thirtyMinsAgoMs) active30mSet.add(pv.visitor_hash);
  }

  for (const tu of toolUses) {
    const t = new Date(tu.created_at).getTime();
    if (t >= todayMs) visitorsTodaySet.add(tu.visitor_hash);
    if (t >= sevenDaysAgoMs) visitors7dSet.add(tu.visitor_hash);
    if (t >= thirtyDaysAgoMs) visitors30dSet.add(tu.visitor_hash);
    if (t >= thirtyMinsAgoMs) active30mSet.add(tu.visitor_hash);
  }

  // Filter dataset by selected range for tables & distributions
  let rangeFilterMs = 0;
  if (range === "today") rangeFilterMs = todayMs;
  else if (range === "7d") rangeFilterMs = sevenDaysAgoMs;
  else if (range === "30d") rangeFilterMs = thirtyDaysAgoMs;

  const filteredViews = pageViews.filter(
    (pv) => new Date(pv.created_at).getTime() >= rangeFilterMs
  );
  const filteredTools = toolUses.filter(
    (tu) => new Date(tu.created_at).getTime() >= rangeFilterMs
  );

  // Daily Trend for the last 30 days
  const dailyTrend: DailyTrendPoint[] = [];
  const daysMap = new Map<string, { visitors: Set<string>; pageViews: number }>();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    daysMap.set(dateStr, { visitors: new Set(), pageViews: 0 });
    dailyTrend.push({
      date: dateStr,
      label,
      visitors: 0,
      pageViews: 0,
    });
  }

  for (const pv of pageViews) {
    const dStr = pv.created_at.split("T")[0];
    const bucket = daysMap.get(dStr);
    if (bucket) {
      bucket.visitors.add(pv.visitor_hash);
      bucket.pageViews += 1;
    }
  }

  for (const pt of dailyTrend) {
    const bucket = daysMap.get(pt.date);
    if (bucket) {
      pt.visitors = bucket.visitors.size;
      pt.pageViews = bucket.pageViews;
    }
  }

  // Most-used tools
  const toolNameLabels: Record<CalculatorType, string> = {
    salary: "Salary Tax Calculator",
    zakat: "Zakat Calculator",
    property: "Property Tax (236C/236K)",
    gst: "GST Calculator (18%)",
    fitrana: "Fitrana Calculator 2026",
  };

  const totalToolUsesCount = toolUses.length;
  const toolStats: Record<CalculatorType, { total: number; last30d: number }> = {
    salary: { total: 0, last30d: 0 },
    zakat: { total: 0, last30d: 0 },
    property: { total: 0, last30d: 0 },
    gst: { total: 0, last30d: 0 },
    fitrana: { total: 0, last30d: 0 },
  };

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
      label: toolNameLabels[calc],
      totalUses: total,
      last30dUses: toolStats[calc].last30d,
      sharePercent,
    };
  });
  mostUsedTools.sort((a, b) => b.totalUses - a.totalUses);

  // Page views table
  const pageMap = new Map<
    string,
    { today: number; last7d: number; last30d: number; allTime: number }
  >();

  // Initialize known public routes
  const standardPages = [
    "/",
    "/salary-tax-calculator",
    "/zakat-calculator",
    "/property-tax-calculator",
    "/gst-calculator",
    "/fitrana-calculator",
    "/about",
    "/contact",
    "/methodology",
    "/privacy-policy",
    "/disclaimer",
  ];
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

  // Device split (on filtered views)
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

  // Top referrers (on filtered views)
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

  // Recent activity: latest 50 events combined (page views + tool uses)
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
      target: `${toolNameLabels[tu.calculator] || tu.calculator} (Used)`,
      device: "client",
      createdAt: tu.created_at,
    })),
  ];
  allEvents.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentActivity = allEvents.slice(0, 50);

  return {
    range,
    statCards: {
      visitorsToday: visitorsTodaySet.size,
      visitors7d: visitors7dSet.size,
      visitors30d: visitors30dSet.size,
      totalPageViews: pageViews.length,
      totalToolUses: toolUses.length,
      activeLast30Min: active30mSet.size,
    },
    dailyTrend,
    mostUsedTools,
    pageViewsTable,
    deviceSplit,
    topReferrers,
    recentActivity,
  };
}

