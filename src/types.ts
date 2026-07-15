// Shared types matching the server API

export type CategoryStat = {
  value: string;
  label: string;
  color: string;
  count: number;
  percentage: number;
};

export type MonthlyStat = {
  year: number;
  month: number;
  label: string;
  zaljivke: number;
  sovrazniGovor: number;
  groznje: number;
  total: number;
};

export type RecentReport = {
  id: string;
  anonymized_text: string;
  category: string;
  category_label: string;
  category_color: string;
  platform: string;
  created_at: string;
};

export type PlatformStat = {
  platform: string;
  count: number;
  percentage: number;
};

export type HeatmapCell = {
  day: number;
  hour: number;
  count: number;
};

export type WordFreqItem = {
  word: string;
  count: number;
};

export type DashboardStats = {
  todayCount: number;
  totalYear: number;
  totalAll: number;
  categories: CategoryStat[];
  monthly: MonthlyStat[];
  recentReports: RecentReport[];
  platforms: PlatformStat[];
  heatmap: HeatmapCell[];
  words: WordFreqItem[];
};

export type AnalyticsBreakdown = {
  value: string;
  label: string;
  count: number;
  percentage: number;
};

export type AnalyticsData = {
  gender: AnalyticsBreakdown[];
  ageGroup: AnalyticsBreakdown[];
  hasChildren: AnalyticsBreakdown[];
  attackMotive: AnalyticsBreakdown[];
  totalWithDemographics: number;
};

export type WeeklySummary = {
  total: number;
  zaljivke: number;
  sovrazniGovor: number;
  groznje: number;
  startDate: string;
  endDate: string;
  dailyAvg: number;
  topPlatform: string;
};
