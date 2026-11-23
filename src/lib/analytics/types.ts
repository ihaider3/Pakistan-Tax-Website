export type DeviceType = "mobile" | "tablet" | "desktop";

export type CalculatorType = "salary" | "zakat" | "property" | "gst" | "fitrana" | "ushr";

export type AnalyticsRange = "7d" | "15d" | "30d" | "all" | "today";

export interface TrackPayload {
  type: "page_view" | "tool_use";
  page?: string;
  calculator?: CalculatorType;
  tool_name?: string;
  referrer?: string;
}

export interface PageViewRecord {
  id: string;
  created_at: string;
  page: string;
  visitor_hash: string;
  referrer: string | null;
  device: DeviceType;
  country?: string | null;
  city?: string | null;
}

export interface ToolUseRecord {
  id: string;
  created_at: string;
  calculator: CalculatorType;
  tool_name?: string;
  visitor_hash: string;
}

export interface DailySummaryRow {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "23 Nov"
  uniqueVisitors: number;
  pageViews: number;
  calculatorUses: number;
  isPriorToRecording: boolean;
}

export interface DailyTrendPoint {
  date: string;
  label: string;
  visitors: number;
  pageViews: number;
  calculatorUses?: number;
}

export interface ToolUsageStat {
  calculator: CalculatorType;
  label: string;
  totalUses: number;
  last30dUses: number;
  sharePercent: number;
}

export interface PageViewStat {
  page: string;
  today: number;
  last7d: number;
  last30d: number;
  allTime: number;
}

export interface DeviceSplitStat {
  mobile: { count: number; percent: number };
  tablet: { count: number; percent: number };
  desktop: { count: number; percent: number };
}

export interface CountrySplitStat {
  country: string;
  count: number;
  percent: number;
}

export interface TopReferrerStat {
  referrer: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  type: "page_view" | "tool_use";
  target: string;
  device: string;
  createdAt: string;
}

export interface MonthlyTotalItem {
  month: string; // e.g. "Nov 2026"
  visitors: number;
  pageViews: number;
  toolUses: number;
}

export interface AnalyticsMetrics {
  range: "7d" | "15d" | "30d" | "all";
  recordingStartDate: string;
  statCards: {
    visitorsToday: number;
    visitors7d: number;
    visitors30d: number;
    totalPageViews: number;
    totalToolUses: number;
    activeLast30Min: number;
    allTimeVisitors: number;
    allTimePageViews: number;
    allTimeToolUses: number;
  };
  dailyTrend: DailyTrendPoint[];
  dailySummaryTable: DailySummaryRow[];
  mostUsedTools: ToolUsageStat[];
  pageViewsTable: PageViewStat[];
  deviceSplit: DeviceSplitStat[];
  countrySplit: CountrySplitStat[];
  topReferrers: TopReferrerStat[];
  recentActivity: RecentActivityItem[];
  monthlyTotals: MonthlyTotalItem[];
}
