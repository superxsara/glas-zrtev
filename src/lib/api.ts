import type { DashboardStats, AnalyticsData, WeeklySummary } from "../types";

const API_BASE = "/api";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API napaka: ${res.status}`);
  return res.json();
}

export const api = {
  getDashboardStats: () => fetchJSON<DashboardStats>("/dashboard"),
  getAnalytics: () => fetchJSON<AnalyticsData>("/analytics"),
  getWeeklySummary: () => fetchJSON<WeeklySummary>("/weekly"),
  submitReport: (data: {
    text: string;
    category: string;
    platform: string;
    gender?: string;
    age_group?: string;
    has_children?: boolean;
    attack_motive?: string;
  }) =>
    fetchJSON<{ ok: boolean; id: string }>("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
