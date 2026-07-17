import type { DashboardStats, AnalyticsData, WeeklySummary } from "../types";

const API = "/api";
async function f<T>(url: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(`${API}${url}`, { headers: { "Content-Type": "application/json" }, ...opts });
  if (!r.ok) throw new Error(`API: ${r.status}`);
  return r.json();
}

// These match the exact signatures of the TanStack Start server functions
// so the app-detail.tsx code works unchanged.
export const getDashboardStats = () => f<DashboardStats>("/dashboard");
export const getAnalytics = () => f<AnalyticsData>("/analytics");
export const getChildrenStats = () => f<ChildrenStats>("/children");
export const getWeeklySummary = () => f<WeeklySummary>("/weekly");
export const submitReport = (args: { data: Record<string, unknown> }) =>
  f<{ ok: boolean; id: string }>("/reports", { method: "POST", body: JSON.stringify(args.data) });
