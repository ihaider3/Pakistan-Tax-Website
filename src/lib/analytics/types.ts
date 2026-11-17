export type DeviceType = "mobile" | "tablet" | "desktop";

export type CalculatorType = "salary" | "zakat" | "property" | "gst" | "fitrana";

export interface TrackPayload {
  type: "page_view" | "tool_use";
  page?: string;
  calculator?: CalculatorType;
  referrer?: string;
}

export interface PageViewRecord {
  id: string;
  created_at: string;
  page: string;
  visitor_hash: string;
  referrer: string | null;
  device: DeviceType;
}

export interface ToolUseRecord {
  id: string;
  created_at: string;
  calculator: CalculatorType;
  visitor_hash: string;
}

export interface DailyTrendPoint {
  date: string;
  label: string;
  visitors: number;
  pageViews: number;
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

export interface AnalyticsMetrics {
  range: "today" | "7d" | "30d" | "all";
  statCards: {
    visitorsToday: number;
    visitors7d: number;
    visitors30d: number;
    totalPageViews: number;
    totalToolUses: number;
    activeLast30Min: number;
  };
  dailyTrend: DailyTrendPoint[];
  mostUsedTools: ToolUsageStat[];
  pageViewsTable: PageViewStat[];
  deviceSplit: DeviceSplitStat[];
  topReferrers: TopReferrerStat[];
  recentActivity: RecentActivityItem[];
}

