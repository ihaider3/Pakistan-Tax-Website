"use client";

import React, { useState, useEffect, useCallback } from "react";

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

interface Counts {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
}

export default function AdminFeedbackClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // List data state
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [calculatorFilter, setCalculatorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Expanded items for full details
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Status updating indicator
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Deleting item ID
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch feedback items
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    const params = new URLSearchParams();
    if (categoryFilter !== "all") params.append("category", categoryFilter);
    if (calculatorFilter !== "all") params.append("calculator", calculatorFilter);
    if (statusFilter !== "all") params.append("status", statusFilter);
    if (appliedSearch) params.append("search", appliedSearch);
    params.append("page", page.toString());
    params.append("limit", "20");

    try {
      const res = await fetch(`/api/feedback/admin/list?${params.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load feedback");
      }

      setIsAuthenticated(true);
      setItems(data.items || []);
      setCounts(data.counts || { total: 0, pending: 0, in_progress: 0, resolved: 0 });
      setTotalPages(data.totalPages || 1);
    } catch (err: unknown) {
      console.error("[Admin Dashboard] Fetch error:", err);
      setFetchError(err instanceof Error ? err.message : "Error loading feedback");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, calculatorFilter, statusFilter, appliedSearch, page]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

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
        throw new Error(data?.error || "Incorrect password");
      }

      setPassword("");
      setIsAuthenticated(true);
      setPage(1);
      fetchFeedback();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Incorrect password");
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
    setItems([]);
  };

  // Handle Status Update
  const handleStatusChange = async (id: string, newStatus: "pending" | "in_progress" | "resolved") => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/feedback/admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data?.error || "Failed to update status");
        return;
      }

      // Optimistic update locally
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      // Re-fetch counts
      fetchFeedback();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this feedback?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/feedback/admin/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data?.error || "Failed to delete feedback");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      fetchFeedback();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting feedback");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle View Screenshot
  const handleOpenScreenshot = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/admin/screenshot/${id}`);
      const data = await res.json();
      if (res.ok && data.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      } else {
        alert(data?.error || "Failed to load screenshot URL.");
      }
    } catch (err) {
      console.error("Screenshot error:", err);
      alert("Could not load screenshot.");
    }
  };

  // Format PKT Date
  const formatDatePkt = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("en-PK", {
        timeZone: "Asia/Karachi",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  // Category Badge Helper
  const renderCategoryBadge = (cat: string) => {
    switch (cat) {
      case "problem":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">
            Problem
          </span>
        );
      case "feature":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
            Feature
          </span>
        );
      case "feedback":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
            Feedback
          </span>
        );
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Resolved
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
            Pending
          </span>
        );
    }
  };

  // IF NOT AUTHENTICATED: Show Login Screen
  if (isAuthenticated === false || (isAuthenticated === null && !loading && items.length === 0)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-elevated border border-appBorder space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0B2A4A] text-white rounded-xl flex items-center justify-center mx-auto shadow-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary">Admin Feedback Login</h1>
            <p className="text-xs text-appText-muted">
              Enter your master administrator password to view and manage website submissions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2.5 rounded-lg border border-appBorder focus:outline-none focus:ring-2 focus:ring-accent bg-white text-appText"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0B2A4A] hover:bg-[#0F766E] text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
            >
              {loginLoading ? "Checking..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: Show Admin Dashboard
  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-appBorder">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary text-white">
              Private Admin
            </span>
            <h1 className="text-2xl font-extrabold text-primary">Feedback &amp; Defect Inbox</h1>
          </div>
          {/* Summary counts banner */}
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold text-appText-muted mt-1.5">
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {counts.pending} pending
            </span>
            <span>·</span>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {counts.in_progress} in progress
            </span>
            <span>·</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {counts.resolved} resolved
            </span>
            <span>·</span>
            <span className="text-appText">Total: {counts.total}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={fetchFeedback}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-appBorder hover:bg-surface text-appText transition-colors flex items-center space-x-1"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-surface rounded-xl border border-appBorder space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-appText-muted mb-1 uppercase">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-appBorder bg-white"
            >
              <option value="all">All Categories</option>
              <option value="problem">Report a Problem</option>
              <option value="feedback">Share Feedback</option>
              <option value="feature">Suggest a Feature</option>
            </select>
          </div>

          {/* Calculator Filter */}
          <div>
            <label className="block text-xs font-bold text-appText-muted mb-1 uppercase">Calculator</label>
            <select
              value={calculatorFilter}
              onChange={(e) => {
                setCalculatorFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-appBorder bg-white"
            >
              <option value="all">All Calculators</option>
              <option value="general">General / Website</option>
              <option value="salary">Salary Tax</option>
              <option value="zakat">Zakat</option>
              <option value="property">Property Tax (236C/K)</option>
              <option value="gst">GST (18%)</option>
              <option value="fitrana">Fitrana</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-appText-muted mb-1 uppercase">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-appBorder bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-appText-muted mb-1 uppercase">Search</label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppliedSearch(searchQuery);
                setPage(1);
              }}
              className="flex items-center space-x-1"
            >
              <input
                type="text"
                placeholder="Search text, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-appBorder bg-white"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0F766E]"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {fetchError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {fetchError}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-xs border border-appBorder overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface text-appText-muted uppercase tracking-wider font-semibold border-b border-appBorder">
              <tr>
                <th className="py-3 px-4">Date (PKT)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Calculator</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-3">Screenshot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-appBorder">
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-appText-muted">
                    Loading submissions...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-appText-muted">
                    No feedback found matching current filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const isUpdating = updatingId === item.id;
                  const isDeleting = deletingId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-surface/50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-appText-muted font-medium">
                          {formatDatePkt(item.created_at)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {renderCategoryBadge(item.category)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-primary capitalize">
                          {item.calculator}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.rating ? (
                            <span className="text-amber-500 font-bold">★ {item.rating}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[150px] truncate">
                          <div className="font-semibold text-appText truncate">
                            {item.name || "Anonymous"}
                          </div>
                          {item.email && (
                            <div className="text-[11px] text-appText-muted truncate">
                              {item.email}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-[280px]">
                          <div
                            className={`text-appText leading-snug cursor-pointer ${
                              isExpanded ? "" : "line-clamp-2"
                            }`}
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            title="Click to view full message"
                          >
                            {item.message}
                          </div>
                          {item.message.length > 80 && (
                            <button
                              type="button"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className="text-[10px] font-bold text-accent hover:underline mt-0.5"
                            >
                              {isExpanded ? "Show less" : "Read full message"}
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.screenshot_url ? (
                            <button
                              type="button"
                              onClick={() => handleOpenScreenshot(item.id)}
                              className="px-2 py-1 rounded bg-teal-50 text-accent hover:bg-teal-100 font-semibold text-[11px] border border-teal-200"
                            >
                              View Image
                            </button>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={item.status}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleStatusChange(
                                item.id,
                                e.target.value as "pending" | "in_progress" | "resolved"
                              )
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded-md border ${
                              item.status === "resolved"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : item.status === "in_progress"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-gray-50 text-gray-800 border-gray-300"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                            title="Delete submission"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded View Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-appBorder">
                          <td colSpan={9} className="p-4 space-y-2">
                            <div className="text-xs font-bold text-primary uppercase tracking-wider">
                              Full Submission Details:
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-appBorder text-xs text-appText whitespace-pre-wrap leading-relaxed">
                              {item.message}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-appText-muted pt-1">
                              <div>
                                <span className="font-semibold text-appText">Full Name:</span>{" "}
                                {item.name || "None"}
                              </div>
                              <div>
                                <span className="font-semibold text-appText">Email:</span>{" "}
                                {item.email || "None"}
                              </div>
                              <div>
                                <span className="font-semibold text-appText">ID:</span> {item.id}
                              </div>
                              <div className="sm:col-span-3 truncate">
                                <span className="font-semibold text-appText">User Agent:</span>{" "}
                                {item.user_agent || "Not recorded"}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-surface border-t border-appBorder flex items-center justify-between text-xs text-appText-muted">
          <div>
            Showing {items.length} of {counts.total} items (Page {page} of {totalPages || 1})
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-appBorder bg-white hover:bg-surface disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded border border-appBorder bg-white hover:bg-surface disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
