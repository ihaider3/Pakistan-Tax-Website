"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ratesData from "@/data/rates.json";
import { useLiveRates } from "@/lib/rates/useLiveRates";
import VisualContentEditor from "@/components/admin/VisualContentEditor";

export type AdminTab = "overview" | "feedback" | "content" | "analytics";

interface FeedbackItem {
  id: string;
  created_at: string;
  category: "problem" | "feedback" | "feature";
  calculator: string;
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  screenshot_url: string | null;
  status: "pending" | "in_progress" | "resolved";
  user_agent: string | null;
}

interface FeedbackCounts {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
}

interface ContentFieldItem {
  key: string;
  page: string;
  fieldLabel: string;
  isTextarea?: boolean;
  defaultValue: string;
  currentValue: string;
  updatedAt: string;
  hasHistory: boolean;
  previousValue?: string;
}

interface AnalyticsData {
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
  dailyTrend: Array<{
    date: string;
    label: string;
    visitors: number;
    pageViews: number;
    calculatorUses?: number;
  }>;
  dailySummaryTable: Array<{
    date: string;
    label: string;
    uniqueVisitors: number;
    pageViews: number;
    calculatorUses: number;
    isPriorToRecording: boolean;
  }>;
  mostUsedTools: Array<{
    calculator: string;
    label: string;
    totalUses: number;
    last30dUses: number;
    sharePercent: number;
  }>;
  pageViewsTable: Array<{
    page: string;
    today: number;
    last7d: number;
    last30d: number;
    allTime: number;
  }>;
  deviceSplit: Array<{
    mobile: { count: number; percent: number };
    tablet: { count: number; percent: number };
    desktop: { count: number; percent: number };
  }>;
  countrySplit: Array<{
    country: string;
    count: number;
    percent: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    count: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "page_view" | "tool_use";
    target: string;
    device: string;
    createdAt: string;
  }>;
  monthlyTotals: Array<{
    month: string;
    visitors: number;
    pageViews: number;
    toolUses: number;
  }>;
  security?: {
    failedLogins7d: number;
  };
}

interface AdminDashboardClientProps {
  initialAuth?: boolean;
}

export default function AdminDashboardClient({ initialAuth }: AdminDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const tabParam = (searchParams.get("tab") || "overview") as AdminTab;
  const activeTab: AdminTab = ["overview", "feedback", "content", "analytics"].includes(
    tabParam
  )
    ? tabParam
    : "overview";

  // Authentication State
  const { rates: liveRates } = useLiveRates();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    typeof initialAuth === "boolean" ? initialAuth : null
  );
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab Switching
  const handleTabChange = (newTab: AdminTab) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", newTab);
      router.push(`/admin?${params.toString()}`);
    });
  };

  // Feedback State
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [feedbackCounts, setFeedbackCounts] = useState<FeedbackCounts>({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [calculatorFilter, setCalculatorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(null);
  const [screenshotModalUrl, setScreenshotModalUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Content State
  const [contentList, setContentList] = useState<ContentFieldItem[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentPageFilter, setContentPageFilter] = useState<string>("all");
  const [contentValues, setContentValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveSuccessKey, setSaveSuccessKey] = useState<string | null>(null);
  const [restoringKey, setRestoringKey] = useState<string | null>(null);
  const [contentMode, setContentMode] = useState<"visual" | "form">("visual");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState<"7d" | "15d" | "30d" | "all">("30d");

  // Verify initial session
  useEffect(() => {
    if (isAuthenticated === null) {
      fetch("/api/feedback/admin/list?limit=1")
        .then((res) => {
          setIsAuthenticated(res.ok);
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/feedback/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.error || "Incorrect password");
        return;
      }

      setIsAuthenticated(true);
      setPassword("");
    } catch {
      setLoginError("Incorrect password");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/feedback/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      router.refresh();
    }
  };

  // Fetch Feedback Items
  const loadFeedback = useCallback(async () => {
    if (!isAuthenticated) return;
    setFeedbackLoading(true);
    const params = new URLSearchParams();
    if (categoryFilter !== "all") params.append("category", categoryFilter);
    if (calculatorFilter !== "all") params.append("calculator", calculatorFilter);
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (appliedSearch) params.append("search", appliedSearch);
    params.append("limit", "50");

    try {
      const res = await fetch(`/api/feedback/admin/list?${params.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setFeedbackItems(data.items || []);
        setFeedbackCounts(data.counts || { total: 0, pending: 0, in_progress: 0, resolved: 0 });
      }
    } catch (err) {
      console.warn("Feedback load error:", err);
    } finally {
      setFeedbackLoading(false);
    }
  }, [isAuthenticated, categoryFilter, calculatorFilter, statusFilter, appliedSearch]);

  // Fetch Content Items
  const loadContent = useCallback(async () => {
    if (!isAuthenticated) return;
    setContentLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        setContentList(data.items);
        const map: Record<string, string> = {};
        for (const item of data.items) {
          map[item.key] = item.currentValue;
        }
        setContentValues(map);
      }
    } catch (err) {
      console.warn("Content load error:", err);
    } finally {
      setContentLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Analytics Metrics
  const loadAnalytics = useCallback(async (silent = false) => {
    if (!isAuthenticated) return;
    if (!silent) setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${analyticsRange}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.warn("Analytics load error:", err);
    } finally {
      if (!silent) setAnalyticsLoading(false);
    }
  }, [isAuthenticated, analyticsRange]);

  // Load data based on active tab or for overview
  useEffect(() => {
    if (isAuthenticated) {
      loadFeedback();
      loadAnalytics();
      if (activeTab === "content") {
        loadContent();
      }
    }
  }, [isAuthenticated, activeTab, loadFeedback, loadAnalytics, loadContent]);

  // Auto-refresh "Active in last 30 min" and metrics every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      loadAnalytics(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadAnalytics]);

  // Handle Save Content Field
  const handleSaveContent = async (key: string, customVal?: string): Promise<boolean> => {
    setSavingKey(key);
    setSaveSuccessKey(null);
    try {
      const value = customVal !== undefined ? customVal : (contentValues[key] ?? "");
      const res = await fetch("/api/admin/content/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (res.ok) {
        setContentValues((prev) => ({ ...prev, [key]: value }));
        setSaveSuccessKey(key);
        setTimeout(() => setSaveSuccessKey(null), 3500);
        await loadContent();
        return true;
      } else {
        alert(data.error || "Save failed");
        return false;
      }
    } catch {
      alert("Error saving content");
      return false;
    } finally {
      setSavingKey(null);
    }
  };

  // Handle Restore Content Field
  const handleRestoreContent = async (key: string): Promise<boolean> => {
    setRestoringKey(key);
    try {
      const res = await fetch("/api/admin/content/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (res.ok) {
        setContentValues((prev) => ({ ...prev, [key]: data.restoredValue }));
        setSaveSuccessKey(key);
        setTimeout(() => setSaveSuccessKey(null), 3500);
        await loadContent();
        return true;
      } else {
        alert(data.error || "Restore failed");
        return false;
      }
    } catch {
      alert("Error restoring content");
      return false;
    } finally {
      setRestoringKey(null);
    }
  };

  // Handle Feedback Status Change
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/feedback/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadFeedback();
      }
    } catch {
      alert("Failed to update status");
    }
  };

  // Handle Feedback Deletion
  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this feedback?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/feedback/admin/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadFeedback();
      }
    } catch {
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // 1. NEUTRAL LOADING STATE (Prevent flash of dashboard before auth check)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl animate-pulse">
          CH
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
          <svg className="w-5 h-5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  // 2. UNATHENTICATED LOGIN FORM
  if (isAuthenticated === false) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-primary">Master Admin Login</h1>
            <p className="text-xs text-slate-500">
              Enter administrator password to access visitor analytics, content editor, and user feedback.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-primary hover:bg-[#071F36] active:scale-98 text-white transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? "Checking Password..." : "Sign In to Admin Panel"}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Session is secured with encrypted HTTP-only cookie.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTHENTICATED ADMIN DASHBOARD
  const mostUsedWeeklyTool =
    analyticsData?.mostUsedTools?.find((tool) => tool.totalUses > 0) || null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Bar: Title & Sign Out */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">
              CH
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-primary">Admin Control Center | CalculationHub</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Authenticated
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real visitor analytics, live content management, and user defect inbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 border border-slate-200 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Overview | Feedback | Content | Analytics) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => handleTabChange("overview")}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "border-accent text-accent bg-accent-soft/40"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabChange("feedback")}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "feedback"
              ? "border-accent text-accent bg-accent-soft/40"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <span>Feedback</span>
          {feedbackCounts.pending > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-white">
              {feedbackCounts.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange("content")}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "content"
              ? "border-accent text-accent bg-accent-soft/40"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          Content Editor
        </button>
        <button
          onClick={() => handleTabChange("analytics")}
          className={`px-4 py-2.5 rounded-t-xl text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "analytics"
              ? "border-accent text-accent bg-accent-soft/40"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          Visitor Analytics
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW
         ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Visitors Today
              </span>
              <div className="text-2xl sm:text-3xl font-black text-primary">
                {analyticsData?.statCards.visitorsToday ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 block">Unique visitors since midnight</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Visitors (7 Days)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-primary">
                {analyticsData?.statCards.visitors7d ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 block">Weekly unique visitors</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Calculator Uses
              </span>
              <div className="text-2xl sm:text-3xl font-black text-primary">
                {analyticsData?.statCards.totalToolUses ?? 0}
              </div>
              <span className="text-[11px] text-slate-400 block">Calculations executed</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending Feedback
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                {feedbackCounts.pending}
              </div>
              <span className="text-[11px] text-slate-400 block">Requires your review</span>
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Used Tool Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-accent">
                  Most-Used Tool This Week
                </span>
                <span className="text-[11px] text-slate-500">Based on tool_uses</span>
              </div>
              {mostUsedWeeklyTool ? (
                <div>
                  <h3 className="text-lg font-black text-primary">{mostUsedWeeklyTool.label}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>{mostUsedWeeklyTool.totalUses}</strong> total calculations recorded (
                    {mostUsedWeeklyTool.sharePercent}% of all platform calculator usage).
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No tool usage recorded yet.</p>
              )}
            </div>

            {/* Read-Only Live Rates Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 to-white border border-amber-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Current Live Rates (Read-Only)
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {liveRates.lastUpdatedLabel || ratesData.lastUpdatedLabel || "Verified"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-amber-200/60">
                  <span className="text-slate-500 block text-[10px]">Gold Rate (24K / tola)</span>
                  <strong className="text-primary font-bold">
                    Rs {liveRates.goldPerTolaPKR.toLocaleString()}
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-amber-200/60">
                  <span className="text-slate-500 block text-[10px]">Silver Rate (tola)</span>
                  <strong className="text-primary font-bold">
                    Rs {liveRates.silverPerTolaPKR.toLocaleString()}
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-amber-200/60">
                  <span className="text-slate-500 block text-[10px]">Hanafi Nisab (52.5 tola)</span>
                  <strong className="text-primary font-bold">
                    Rs {liveRates.nisabSilverPKR.toLocaleString()}
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-amber-200/60">
                  <span className="text-slate-500 block text-[10px]">Fitrana Consensus (Wheat)</span>
                  <strong className="text-primary font-bold">Rs 300 / person</strong>
                </div>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                ℹ️ Rates and formulas are statutory. They update via verified code releases and are intentionally not editable from this panel.
              </p>
            </div>
          </div>

          {/* Security & Audit Overview Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-800">Security Hardening Status: Active</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Rate Limiting, CSP &amp; Session Isolation Enforced</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Failed Login Attempts (Last 7 Days):</span>
              <span className={`px-2 py-0.5 rounded font-black text-xs ${
                (analyticsData?.security?.failedLogins7d ?? 0) > 0
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}>
                {analyticsData?.security?.failedLogins7d ?? 0}
              </span>
            </div>
          </div>

          {/* Latest 5 Feedback Submissions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-primary">Latest Feedback &amp; Defect Reports</h2>
              <button
                onClick={() => handleTabChange("feedback")}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all in Feedback Tab</span>
                <span>→</span>
              </button>
            </div>

            {feedbackItems.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No user submissions yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                {feedbackItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            item.category === "problem"
                              ? "bg-red-100 text-red-800"
                              : item.category === "feature"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-700 capitalize">
                          {item.calculator}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 line-clamp-1">{item.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                      <button
                        onClick={() => handleTabChange("feedback")}
                        className="text-xs text-slate-500 hover:text-primary font-semibold cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FEEDBACK MANAGER
         ========================================================================= */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          {/* Counts overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Total</span>
              <div className="text-xl font-black text-primary">{feedbackCounts.total}</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-800">Pending</span>
              <div className="text-xl font-black text-amber-800">{feedbackCounts.pending}</div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-blue-800">In Progress</span>
              <div className="text-xl font-black text-blue-800">{feedbackCounts.in_progress}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800">Resolved</span>
              <div className="text-xl font-black text-emerald-800">{feedbackCounts.resolved}</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="problem">Problem / Bug</option>
              <option value="feedback">User Feedback</option>
              <option value="feature">Feature Request</option>
            </select>

            <select
              value={calculatorFilter}
              onChange={(e) => setCalculatorFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Calculators</option>
              <option value="general">General</option>
              <option value="salary">Salary Tax</option>
              <option value="zakat">Zakat</option>
              <option value="property">Property Tax</option>
              <option value="gst">GST 18%</option>
              <option value="fitrana">Fitrana</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <div className="flex-1 min-w-[200px] flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setAppliedSearch(searchQuery)}
                placeholder="Search message or email..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
              />
              <button
                onClick={() => setAppliedSearch(searchQuery)}
                className="px-3 py-2 rounded-lg text-xs font-bold bg-primary text-white cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          {/* Feedback Items Table */}
          {feedbackLoading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading submissions...</div>
          ) : feedbackItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              No submissions match current filters.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100">
                {feedbackItems.map((item) => (
                  <div key={item.id} className="p-4 space-y-3 hover:bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            item.category === "problem"
                              ? "bg-red-100 text-red-800"
                              : item.category === "feature"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-700 capitalize">
                          {item.calculator}
                        </span>
                        {item.rating && (
                          <span className="text-xs text-amber-500 font-bold">
                            {"★".repeat(item.rating)}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleString("en-PK")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="text-xs font-bold px-2 py-1 rounded border border-slate-300 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          onClick={() => handleDeleteFeedback(item.id)}
                          disabled={deletingId === item.id}
                          className="text-xs text-red-600 hover:underline px-2 py-1 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {item.message}
                    </p>

                    {(item.name || item.email || item.screenshot_url) && (
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                        {item.name && <span>User: <strong>{item.name}</strong></span>}
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="text-accent hover:underline">
                            {item.email}
                          </a>
                        )}
                        {item.screenshot_url && (
                          <button
                            onClick={() => setScreenshotModalUrl(item.screenshot_url)}
                            className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            📷 View Screenshot
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screenshot Modal */}
          {screenshotModalUrl && (
            <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-4 max-w-3xl w-full max-h-[90vh] overflow-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-primary">Attached Screenshot</h3>
                  <button
                    onClick={() => setScreenshotModalUrl(null)}
                    className="text-xs font-bold text-slate-600 hover:text-black cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotModalUrl}
                  alt="User screenshot"
                  className="max-w-full rounded-lg border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: CONTENT EDITOR
         ========================================================================= */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* Mode Switch Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                <h3 className="text-base sm:text-lg font-black text-primary tracking-tight">
                  Website Content Editor
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit website text visually on a live interactive preview or through standard form fields.
              </p>
            </div>

            {/* Mode Toggle Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setContentMode("visual")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentMode === "visual" && !isSmallScreen
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>👁️ Visual Editor</span>
              </button>

              <button
                type="button"
                onClick={() => setContentMode("form")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  contentMode === "form" || isSmallScreen
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📝 Form Editor</span>
              </button>
            </div>
          </div>

          {/* Small Screen Advisory */}
          {isSmallScreen && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs font-medium text-blue-900">
              <span className="text-base">📱</span>
              <span>Visual editing works best on a desktop or laptop. Showing Form Editor.</span>
            </div>
          )}

          {/* Statutory Protection Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="text-xs text-amber-900 space-y-1">
              <strong className="font-bold block text-sm">
                Statutory Calculation Protection Active
              </strong>
              <p>
                Tax rates, progressive tax slabs, Hanafi Nisab standards, Fitrana figures, and mathematical formulas are statutory and <strong>CANNOT be edited</strong> from this panel. They are strictly governed by Finance Act legislation and verified code updates to prevent financial calculation errors.
              </p>
              <p className="text-amber-800">
                You can safely edit website headings, hero text, card summaries, Wazahat intro explanations, and footer notices below.
              </p>
            </div>
          </div>

          {/* VISUAL EDITOR MODE */}
          {contentMode === "visual" && !isSmallScreen ? (
            contentLoading ? (
              <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-xs">
                Loading visual content editor...
              </div>
            ) : (
              <VisualContentEditor
                contentList={contentList}
                contentValues={contentValues}
                setContentValues={setContentValues}
                onSave={handleSaveContent}
                onRestore={handleRestoreContent}
                savingKey={savingKey}
                restoringKey={restoringKey}
              />
            )
          ) : (
            /* FORM EDITOR MODE (FALLBACK) */
            <div className="space-y-6">
              {/* Page Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { id: "all", label: "All Pages" },
                  { id: "homepage", label: "Homepage" },
                  { id: "salary", label: "Salary Tax" },
                  { id: "zakat", label: "Zakat" },
                  { id: "property", label: "Property Tax" },
                  { id: "gst", label: "GST 18%" },
                  { id: "fitrana", label: "Fitrana" },
                  { id: "ushr", label: "Ushr" },
                  { id: "footer", label: "Footer" },
                  { id: "contact", label: "Contact" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setContentPageFilter(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      contentPageFilter === p.id
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Content Field Editor Cards */}
              {contentLoading ? (
                <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
                  Loading content fields...
                </div>
              ) : (
                <div className="space-y-4">
                  {contentList
                    .filter((item) => contentPageFilter === "all" || item.page === contentPageFilter)
                    .map((item) => {
                      const currentValue = contentValues[item.key] ?? item.currentValue;
                      const isModified = currentValue !== item.defaultValue;
                      const isSaving = savingKey === item.key;
                      const isRestoring = restoringKey === item.key;
                      const isSaved = saveSuccessKey === item.key;

                      return (
                        <div
                          key={item.key}
                          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary">{item.fieldLabel}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {item.key}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 block">
                                Page: <strong className="capitalize">{item.page}</strong> | Last updated: {item.updatedAt}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSaved && (
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
                                  ✓ Saved — live on the site now
                                </span>
                              )}
                              {item.hasHistory && (
                                <button
                                  onClick={() => handleRestoreContent(item.key)}
                                  disabled={isRestoring || isSaving}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 disabled:opacity-50 transition-all cursor-pointer"
                                >
                                  {isRestoring ? "Restoring..." : "Restore Previous"}
                                </button>
                              )}
                              <button
                                onClick={() => handleSaveContent(item.key)}
                                disabled={isSaving || isRestoring}
                                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-accent hover:bg-[#0D625C] active:scale-98 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                              >
                                {isSaving ? "Saving..." : "Save Field"}
                              </button>
                            </div>
                          </div>

                          {item.isTextarea ? (
                            <textarea
                              rows={3}
                              value={currentValue}
                              onChange={(e) =>
                                setContentValues((prev) => ({ ...prev, [item.key]: e.target.value }))
                              }
                              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed font-normal focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          ) : (
                            <input
                              type="text"
                              value={currentValue}
                              onChange={(e) =>
                                setContentValues((prev) => ({ ...prev, [item.key]: e.target.value }))
                              }
                              className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          )}

                          {isModified && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                              <span>Custom content active (differs from codebase default).</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: VISITOR ANALYTICS
         ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Header filter & Live Now Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-600 px-2">Date Range:</span>
              {(["7d", "15d", "30d", "all"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setAnalyticsRange(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    analyticsRange === r
                      ? "bg-primary text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {r === "7d"
                    ? "7 Days"
                    : r === "15d"
                    ? "15 Days"
                    : r === "30d"
                    ? "30 Days (Default)"
                    : "All Time (Lifetime)"}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Active in last 30 min:</span>
              <strong className="font-extrabold text-emerald-950">
                {analyticsData?.statCards.activeLast30Min ?? 0}
              </strong>
              <span className="text-[10px] text-emerald-700 font-normal">(refreshes every 30s)</span>
            </div>
          </div>

          {/* Stat Cards (6 total) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Visitors Today</span>
              <div className="text-xl font-black text-primary">
                {analyticsData?.statCards.visitorsToday ?? 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Visitors (7d)</span>
              <div className="text-xl font-black text-primary">
                {analyticsData?.statCards.visitors7d ?? 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Visitors (30d)</span>
              <div className="text-xl font-black text-primary">
                {analyticsData?.statCards.visitors30d ?? 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Page Views</span>
              <div className="text-xl font-black text-primary">
                {analyticsData?.statCards.totalPageViews ?? 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Tool Uses</span>
              <div className="text-xl font-black text-primary">
                {analyticsData?.statCards.totalToolUses ?? 0}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Active (30 min)</span>
              <div className="text-xl font-black text-emerald-950">
                {analyticsData?.statCards.activeLast30Min ?? 0}
              </div>
            </div>
          </div>

          {/* Daily Trend Chart - Pure CSS Bar Chart */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary">Daily Unique Visitors ({analyticsRange === "7d" ? "7 Days" : analyticsRange === "15d" ? "15 Days" : analyticsRange === "30d" ? "30 Days" : "All Time"})</h3>
                <span className="text-[11px] text-slate-400">Hover on each bar to view exact counts</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                Recording started: {analyticsData?.recordingStartDate || "23 Nov 2026"}
              </span>
            </div>

            {analyticsData && analyticsData.dailyTrend.length > 0 ? (
              (() => {
                const maxVal = Math.max(
                  1,
                  ...analyticsData.dailyTrend.map((d) => d.visitors)
                );
                return (
                  <div className="h-48 flex items-end gap-1.5 pt-6 pb-2 border-b border-slate-100 overflow-x-auto">
                    {analyticsData.dailyTrend.map((pt, idx) => {
                      const heightPercent = Math.max(6, Math.round((pt.visitors / maxVal) * 100));
                      return (
                        <div
                          key={idx}
                          className="group relative flex-1 min-w-[14px] flex flex-col items-center justify-end h-full"
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 transition-opacity">
                            <span className="font-bold block">{pt.label}</span>
                            <span>{pt.visitors} visitors · {pt.pageViews} views · {pt.calculatorUses || 0} calcs</span>
                          </div>

                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t transition-all ${
                              pt.visitors > 0
                                ? "bg-accent hover:bg-emerald-600"
                                : "bg-slate-100 hover:bg-slate-200"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-slate-400">
                No trend data recorded yet.
              </div>
            )}
          </div>

          {/* Daily Table (Date, Unique Visitors, Total Page Views, Calculator Uses) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-primary">Daily Visitor &amp; Calculator Record</h3>
                <p className="text-xs text-slate-500">
                  Real anonymous visitor counts and calculations executed each day.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                <span>Recording started on {analyticsData?.recordingStartDate || "23 Nov 2026"}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Unique Visitors</th>
                    <th className="py-2.5 px-3 text-right">Total Page Views</th>
                    <th className="py-2.5 px-3 text-right">Calculator Uses</th>
                    <th className="py-2.5 px-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {analyticsData?.dailySummaryTable && analyticsData.dailySummaryTable.length > 0 ? (
                    analyticsData.dailySummaryTable.map((row) => (
                      <tr key={row.date} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-primary font-sans">
                          {row.label} <span className="text-[10px] text-slate-400 font-mono">({row.date})</span>
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700 font-bold">
                          {row.uniqueVisitors}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          {row.pageViews}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-700">
                          {row.calculatorUses}
                        </td>
                        <td className="py-2.5 px-3 text-left font-sans">
                          {row.isPriorToRecording ? (
                            <span className="text-[10px] text-slate-400 italic">
                              Recording started on 23 Nov 2026
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 font-sans">
                        No daily records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ranked Table: Most-Used Tools (kitne logo ne kon sa tool use kiya) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-primary">Most-Used Tools (Ranked by Calculations)</h3>
              <p className="text-xs text-slate-500">
                Real anonymous usage recorded whenever a visitor performs a calculation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3"># Rank</th>
                    <th className="py-2.5 px-3">Calculator</th>
                    <th className="py-2.5 px-3 text-right">Total Uses</th>
                    <th className="py-2.5 px-3 text-right">Last 30 Days</th>
                    <th className="py-2.5 px-3">Usage Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analyticsData?.mostUsedTools.map((tool, idx) => (
                    <tr key={tool.calculator} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-400">#{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-primary">{tool.label}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-800">
                        {tool.totalUses}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                        {tool.last30dUses}
                      </td>
                      <td className="py-3 px-3 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              style={{ width: `${tool.sharePercent}%` }}
                              className="h-full bg-accent rounded-full"
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-700 w-8">
                            {tool.sharePercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Views Table */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-primary">Page Views by Route</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Page Path</th>
                    <th className="py-2.5 px-3 text-right">Today</th>
                    <th className="py-2.5 px-3 text-right">Last 7 Days</th>
                    <th className="py-2.5 px-3 text-right">Last 30 Days</th>
                    <th className="py-2.5 px-3 text-right">All Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {analyticsData?.pageViewsTable.map((row) => (
                    <tr key={row.page} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-primary font-sans">{row.page}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{row.today}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{row.last7d}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{row.last30d}</td>
                      <td className="py-2.5 px-3 text-right font-black text-primary">{row.allTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Split & Top Referrers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Split */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-primary">Device Type Distribution</h3>
              {analyticsData?.deviceSplit[0] ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Mobile</span>
                      <span>
                        {analyticsData.deviceSplit[0].mobile.count} (
                        {analyticsData.deviceSplit[0].mobile.percent}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${analyticsData.deviceSplit[0].mobile.percent}%` }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Tablet</span>
                      <span>
                        {analyticsData.deviceSplit[0].tablet.count} (
                        {analyticsData.deviceSplit[0].tablet.percent}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${analyticsData.deviceSplit[0].tablet.percent}%` }}
                        className="h-full bg-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Desktop</span>
                      <span>
                        {analyticsData.deviceSplit[0].desktop.count} (
                        {analyticsData.deviceSplit[0].desktop.percent}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${analyticsData.deviceSplit[0].desktop.percent}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">No device data yet.</div>
              )}
            </div>

            {/* Top Referrers */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-primary">Top Referrer Domains</h3>
              {analyticsData && analyticsData.topReferrers.length > 0 ? (
                <div className="space-y-2">
                  {analyticsData.topReferrers.map((ref, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50"
                    >
                      <span className="font-semibold text-slate-700">{ref.referrer}</span>
                      <strong className="text-primary">{ref.count} views</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  Direct visits (no external referrer recorded yet).
                </div>
              )}
            </div>
          </div>

          {/* Geographic Distribution (Coarse Country from Edge Headers) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-primary">Visitor Geographic Distribution</h3>
              <p className="text-xs text-slate-500">Coarse country data derived from Edge network headers (zero IP logging).</p>
            </div>
            {analyticsData && analyticsData.countrySplit.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analyticsData.countrySplit.map((c) => (
                  <div key={c.country} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-primary">{c.country}</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{c.count} views</span>
                      <span className="text-[10px] text-slate-400 block">({c.percent}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400">No country data recorded yet.</div>
            )}
          </div>

          {/* Monthly & Lifetime Summary (Permanent Retention) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-primary">Lifetime &amp; Monthly Summary (Permanent Retention)</h3>
                <p className="text-xs text-slate-500">Aggregated monthly summaries preserved permanently without expiration.</p>
              </div>
              <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
                <span>Lifetime Visitors: <strong className="text-primary">{analyticsData?.statCards.allTimeVisitors || 0}</strong></span>
                <span>•</span>
                <span>Lifetime Views: <strong className="text-primary">{analyticsData?.statCards.allTimePageViews || 0}</strong></span>
                <span>•</span>
                <span>Lifetime Calcs: <strong className="text-emerald-700">{analyticsData?.statCards.allTimeToolUses || 0}</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-right">Unique Visitors</th>
                    <th className="py-2.5 px-3 text-right">Page Views</th>
                    <th className="py-2.5 px-3 text-right">Calculator Uses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {analyticsData?.monthlyTotals && analyticsData.monthlyTotals.length > 0 ? (
                    analyticsData.monthlyTotals.map((m) => (
                      <tr key={m.month} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-primary font-sans">{m.month}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700 font-bold">{m.visitors}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{m.pageViews}</td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-700">{m.toolUses}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 font-sans">
                        No monthly records yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity: Latest 50 Events */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-primary">Recent Anonymous Activity (Latest 50 Events)</h3>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold sticky top-0 bg-white">
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Event Type</th>
                    <th className="py-2 px-3">Target / Action</th>
                    <th className="py-2 px-3">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analyticsData?.recentActivity.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(event.createdAt).toLocaleTimeString("en-PK", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            event.type === "tool_use"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {event.type.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{event.target}</td>
                      <td className="py-2 px-3 text-slate-500 capitalize">{event.device}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

