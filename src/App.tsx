import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./lib/quanta-shims";
import { Card } from "./lib/quanta-shims";
import { Icon } from "./lib/quanta-shims";
import { Loader } from "./lib/quanta-shims";
import { Tabs } from "./lib/quanta-shims";
import { Textarea } from "./lib/quanta-shims";
import { Typography } from "./lib/quanta-shims";
import { Toaster, toast } from "./lib/quanta-shims";
import {
  ShieldAlert,
  MessageSquareWarning,
  Skull,
  BarChart3,
  Info,
  Lock,
  LogIn,
  Send,
  Megaphone,
  TrendingUp,
  Clock,
  Share2,
  Download,
  Sparkles,
} from "lucide-react";

// Brand SVG icons (not in lucide-react)
function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function IconTikTok({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
    </svg>
  );
}
function IconYouTube({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
import { CATEGORIES, PLATFORMS, GENDERS, AGE_GROUPS, ATTACK_MOTIVES } from "./lib/anonymize";
import type { DashboardStats, CategoryStat, MonthlyStat, RecentReport, PlatformStat, HeatmapCell, WordFreqItem } from "./lib/reports";
import { getDashboardStats, getAnalytics, submitReport, getWeeklySummary } from "./lib/reports";


const CAMPAIGN_RED = "#c0392b";
const CAMPAIGN_RED_LIGHT = "#e74c3c";
const CAMPAIGN_RED_DARK = "#922b21";
const CAT_ZALJIVKA = "#e67e22";
const CAT_SOVRAZNI = "#c0392b";
const CAT_GROZNJA = "#8e44ad";

const CATEGORY_ICONS: Record<string, typeof ShieldAlert> = {
  zaljivka: MessageSquareWarning,
  sovrazni_govor: ShieldAlert,
  groznja: Skull,
};

const DAY_NAMES_SL = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];

// ─── Helpers ───

function relativeTime(iso: string): string {
  const d = new Date(iso + (iso.endsWith("Z") ? "" : "Z"));
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);
  if (diff < 60) return "zdaj";
  if (diff < 3600) return `pred ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `pred ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `pred ${Math.floor(diff / 86400)} dni`;
  return d.toLocaleDateString("sl-SI", { day: "numeric", month: "short" });
}

function platformBadge(platform: string): { label: string; bg: string } {
  const map: Record<string, { label: string; bg: string }> = {
    "X": { label: "X", bg: "#1d1d1d" },
    "Facebook": { label: "FB", bg: "#1877f2" },
    "Instagram": { label: "IG", bg: "#e1306c" },
    "TikTok": { label: "TT", bg: "#010101" },
    "YouTube": { label: "YT", bg: "#ff0000" },
  };
  return map[platform] ?? { label: platform.slice(0, 2), bg: "#555" };
}

// ─── Animated Counter (0 → target) ───

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (target <= 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return <>{display.toLocaleString("sl-SI")}</>;
}

// ─── Hero ───

function Hero({ stats, isPending }: { stats: DashboardStats | undefined; isPending: boolean }) {
  const todayCount = stats?.todayCount ?? 0;
  const totalYear = stats?.totalYear ?? 0;

  return (
    <section className="relative overflow-hidden rounded-q-600 border border-q-border-subtle bg-q-background-secondary p-8 md:p-12">
      {/* Ključavnica — keyhole light rays */}
      <div className="gz-keyhole-bg" aria-hidden />

      <div className="relative flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-q-full"
            style={{ background: `linear-gradient(135deg, ${CAMPAIGN_RED}, ${CAMPAIGN_RED_DARK})` }}
          >
            <Icon as={Megaphone} size="sm" className="text-white" />
          </span>
          <span className="text-q-title-md-semi-bold text-q-text-primary">#GlasŽrtev</span>
        </div>

        <Typography as="p" variant="caption-sm-medium" className="uppercase tracking-wider text-q-text-tertiary">
          Danes že
        </Typography>

        {isPending ? (
          <div className="py-4">
            <Loader size="lg" color="neutral" />
          </div>
        ) : (
          <div className="gz-counter-enter">
            <span
              className="font-bold tabular-nums leading-none"
              style={{ fontSize: "clamp(3.5rem, 12vw, 7rem)", color: CAMPAIGN_RED }}
            >
              <AnimatedCounter target={todayCount} />
            </span>
          </div>
        )}

        <Typography as="p" variant="body-md-regular" color="secondary">
          prijav sovražnega govora in žaljivk danes
        </Typography>

        {totalYear > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-q-full border border-q-border-subtle px-4 py-2">
            <Icon as={TrendingUp} size="xs" className="text-q-text-tertiary" />
            <Typography as="span" variant="body-sm-regular" className="text-q-text-secondary">
              <span className="font-semibold tabular-nums">{totalYear.toLocaleString("sl-SI")}</span> prijav v {new Date().getFullYear()}
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Category Pyramid ───

function CategoryPyramid({ categories }: { categories: CategoryStat[] }) {
  // Render top→bottom: Grožnje (narrow, strong) → Sovražni govor → Žaljivke (widest, ambient)
  const order = ["groznja", "sovrazni_govor", "zaljivka"];
  const widths = ["45%", "70%", "100%"];

  return (
    <div className="flex flex-col gap-2">
      <Typography as="h3" variant="title-sm-semi-bold" className="mb-2 text-q-text-primary">
        Piramida resnosti
      </Typography>
      {order.map((catValue, i) => {
        const cat = categories.find((c) => c.value === catValue);
        if (!cat) return null;
        const IconComp = CATEGORY_ICONS[cat.value] ?? ShieldAlert;
        return (
          <div
            key={cat.value}
            className="mx-auto flex items-center gap-3 rounded-q-500 border p-4 transition-all"
            style={{
              width: widths[i],
              borderColor: `${cat.color}44`,
              backgroundColor: `${cat.color}0a`,
            }}
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-q-400"
              style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
            >
              <Icon as={IconComp} size="sm" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-q-label-lg-medium text-q-text-primary">{cat.label}</span>
                <span className="text-q-title-sm-semi-bold tabular-nums" style={{ color: cat.color }}>
                  {cat.count}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-q-full bg-q-background-tertiary">
                <div
                  className="h-full rounded-q-full transition-all duration-700"
                  style={{ width: `${Math.max(cat.percentage, 2)}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-q-caption-sm-regular text-q-text-tertiary">{cat.percentage}% vseh prijav</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stacked Area Chart ───

function StackedAreaChart({ monthly }: { monthly: MonthlyStat[] }) {
  const maxTotal = Math.max(...monthly.map((m) => m.total), 1);
  const chartW = 600;
  const chartH = 200;
  const padding = 24;
  const innerW = chartW - padding * 2;
  const innerH = chartH - padding * 2;

  const xStep = monthly.length > 1 ? innerW / (monthly.length - 1) : 0;

  function buildPath(getValue: (m: MonthlyStat) => number): string {
    const points = monthly.map((m, i) => ({
      x: padding + i * xStep,
      y: padding + innerH - (getValue(m) / maxTotal) * innerH,
    }));
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }

  function buildStackedPath(getValue: (m: MonthlyStat) => number, offsetFn: (m: MonthlyStat) => number): string {
    const points = monthly.map((m, i) => ({
      x: padding + i * xStep,
      yTop: padding + innerH - (getValue(m) / maxTotal) * innerH,
      yBot: padding + innerH - (offsetFn(m) / maxTotal) * innerH,
    }));
    const top = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yTop}`).join(" ");
    const bot = points.slice().reverse().map((p) => `L ${p.x} ${p.yBot}`).join(" ");
    return `${top} ${bot} Z`;
  }

  return (
    <Card surface="solid" className="flex flex-col gap-3 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Typography as="h3" variant="title-sm-semi-bold" className="text-q-text-primary">
          Gibanje po mesecih
        </Typography>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-q-caption-sm-regular text-q-text-tertiary">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CAT_ZALJIVKA }} /> Žaljivke
          </span>
          <span className="flex items-center gap-1 text-q-caption-sm-regular text-q-text-tertiary">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CAT_SOVRAZNI }} /> Sovražni
          </span>
          <span className="flex items-center gap-1 text-q-caption-sm-regular text-q-text-tertiary">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CAT_GROZNJA }} /> Grožnje
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ height: "auto" }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padding}
            x2={chartW - padding}
            y1={padding + innerH * t}
            y2={padding + innerH * t}
            stroke="var(--hf-color-border-subtle)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}
        {/* Stacked areas: base=žaljivke, middle=+sovrazni, top=+groznje */}
        <path
          d={buildStackedPath((m) => m.zaljivke, () => 0)}
          fill={CAT_ZALJIVKA}
          opacity="0.7"
        />
        <path
          d={buildStackedPath((m) => m.zaljivke + m.sovrazniGovor, (m) => m.zaljivke)}
          fill={CAT_SOVRAZNI}
          opacity="0.7"
        />
        <path
          d={buildStackedPath((m) => m.zaljivke + m.sovrazniGovor + m.groznje, (m) => m.zaljivke + m.sovrazniGovor)}
          fill={CAT_GROZNJA}
          opacity="0.7"
        />
        {/* X labels */}
        {monthly.map((m, i) => (
          <text
            key={`${m.year}-${m.month}`}
            x={padding + i * xStep}
            y={chartH - 4}
            textAnchor="middle"
            fill="var(--hf-color-text-tertiary)"
            fontSize="11"
          >
            {m.label}
          </text>
        ))}
      </svg>
    </Card>
  );
}

// ─── Heatmap ───

function HeatmapChart({ heatmap }: { heatmap: HeatmapCell[] }) {
  const maxCount = Math.max(...heatmap.map((c) => c.count), 1);

  function cellColor(count: number): string {
    if (count === 0) return "var(--hf-color-background-tertiary)";
    const intensity = Math.min(count / maxCount, 1);
    const alpha = 0.2 + intensity * 0.8;
    return `rgba(192, 57, 43, ${alpha})`;
  }

  return (
    <Card surface="solid" className="flex flex-col gap-3 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Typography as="h3" variant="title-sm-semi-bold" className="text-q-text-primary">
          Kdaj se zgodi
        </Typography>
        <Typography as="p" variant="caption-sm-regular" className="text-q-text-tertiary">
          Dan v tednu × ura
        </Typography>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex shrink-0 flex-col gap-[2px] pt-5">
          {DAY_NAMES_SL.map((day) => (
            <div key={day} className="flex h-4 items-center justify-end pr-1 text-q-caption-sm-regular text-q-text-tertiary" style={{ width: "28px" }}>
              {day}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-[2px]">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="flex flex-col gap-[2px]">
              {Array.from({ length: 7 }, (_, day) => {
                const cell = heatmap.find((c) => c.day === day && c.hour === hour);
                const count = cell?.count ?? 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="h-4 w-4 rounded-sm transition-colors"
                    style={{ backgroundColor: cellColor(count) }}
                    title={`${DAY_NAMES_SL[day]} ${hour}:00 — ${count} prijav`}
                  />
                );
              })}
              <div className="mt-1 text-center text-q-caption-sm-regular text-q-text-tertiary">
                {hour % 3 === 0 ? `${hour}h` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Typography as="span" variant="caption-sm-regular" className="text-q-text-tertiary">manj</Typography>
        <div className="flex gap-1">
          {[0.2, 0.4, 0.6, 0.8, 1].map((a) => (
            <div key={a} className="h-3 w-3 rounded-sm" style={{ backgroundColor: `rgba(192, 57, 43, ${a})` }} />
          ))}
        </div>
        <Typography as="span" variant="caption-sm-regular" className="text-q-text-tertiary">več</Typography>
      </div>
    </Card>
  );
}

// ─── Platform Breakdown ───

function PlatformBreakdown({ platforms }: { platforms: PlatformStat[] }) {
  const max = Math.max(...platforms.map((p) => p.count), 1);
  return (
    <Card surface="solid" className="flex flex-col gap-3 p-4 md:p-6">
      <Typography as="h3" variant="title-sm-semi-bold" className="text-q-text-primary">
        Platforme
      </Typography>
      <div className="flex flex-col gap-2">
        {platforms.map((p) => {
          const badge = platformBadge(p.platform);
          return (
            <div key={p.platform} className="flex items-center gap-3">
              <span
                className="grid h-7 min-w-7 shrink-0 place-items-center rounded-q-300 px-1.5 text-q-caption-sm-medium text-white"
                style={{ backgroundColor: badge.bg }}
              >
                {badge.label}
              </span>
              <div className="h-5 flex-1 overflow-hidden rounded-q-200 bg-q-background-tertiary">
                <div
                  className="h-full rounded-q-200 transition-all duration-500"
                  style={{ width: `${(p.count / max) * 100}%`, backgroundColor: CAMPAIGN_RED }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-q-body-sm-medium tabular-nums text-q-text-primary">
                {p.count}
              </span>
              <span className="w-10 shrink-0 text-right text-q-caption-sm-regular text-q-text-tertiary">{p.percentage}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Glasovi — Auto-scroll Feed ───

function VoicesFeed({ reports }: { reports: RecentReport[] }) {
  const [paused, setPaused] = useState(false);

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <Icon as={Info} size="lg" className="text-q-text-tertiary" />
        <Typography as="p" variant="body-sm-regular" color="secondary">
          Še ni prijav. Bodite prvi, ki delite svojo izkušnjo.
        </Typography>
      </div>
    );
  }

  // Duplicate the list for seamless loop
  const doubled = [...reports, ...reports];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <Typography as="h3" variant="title-md-semi-bold" className="text-q-text-primary">
            Glasovi
          </Typography>
          <Typography as="p" variant="body-sm-regular" color="secondary">
            Kaj ljudje doživlja danes
          </Typography>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setPaused((p) => !p)}
          start={<Icon as={Clock} size="sm" />}
        >
          {paused ? "Predvajaj" : "Ustavi"}
        </Button>
      </div>

      <div
        className="relative h-[400px] overflow-hidden rounded-q-500 border border-q-border-subtle"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className={`gz-auto-scroll ${paused ? "gz-auto-scroll-paused" : ""}`}
        >
          <div className="flex flex-col gap-2 p-3">
            {doubled.map((report, idx) => {
              const badge = platformBadge(report.platform);
              return (
                <div
                  key={`${report.id}-${idx}`}
                  className="flex flex-col gap-2 rounded-q-400 border border-q-border-subtle bg-q-background-tertiary p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="grid h-6 min-w-6 shrink-0 place-items-center rounded-q-300 px-1.5 text-q-caption-sm-medium text-white"
                        style={{ backgroundColor: badge.bg }}
                      >
                        {badge.label}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-q-caption-sm-medium"
                        style={{ backgroundColor: `${report.category_color}22`, color: report.category_color }}
                      >
                        {report.category_label}
                      </span>
                    </div>
                    <span className="text-q-caption-sm-regular text-q-text-tertiary">
                      {relativeTime(report.created_at)}
                    </span>
                  </div>
                  <p className="text-q-body-sm-regular text-q-text-secondary leading-relaxed">
                    {report.anonymized_text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-q-background-primary to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-q-background-primary to-transparent" />
      </div>

      <Typography as="p" variant="caption-sm-regular" className="text-center text-q-text-tertiary">
        Vsa besedila so anonimizirana. Imena in osebni podatki so zamenjani z ████.
      </Typography>
    </div>
  );
}

// ─── Besede, ki ranijo ───

function WordsThatHurt({ words }: { words: WordFreqItem[] }) {
  if (words.length === 0) {
    return (
      <Card surface="solid" className="flex items-center justify-center py-12">
        <Typography as="p" variant="body-sm-regular" color="secondary">
          Ni dovolj podatkov za analizo besed.
        </Typography>
      </Card>
    );
  }
  const max = words[0].count;

  return (
    <Card surface="solid" className="flex flex-col gap-4 p-4 md:p-6">
      <Typography as="h3" variant="title-md-semi-bold" className="text-q-text-primary">
        Besede, ki ranijo
      </Typography>
      <Typography as="p" variant="body-sm-regular" color="secondary">
        Najpogostejše besede v anonimiziranih prijavah
      </Typography>
      <div className="flex flex-col gap-2">
        {words.map((w, i) => (
          <div key={w.word} className="flex items-center gap-3">
            <span className="w-5 shrink-0 text-right text-q-caption-sm-regular text-q-text-tertiary tabular-nums">
              {i + 1}
            </span>
            <span className="w-32 shrink-0 truncate text-q-body-sm-medium text-q-text-primary">
              {w.word}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-q-200 bg-q-background-tertiary">
              <div
                className="flex h-full items-center rounded-q-200 px-2 transition-all duration-500"
                style={{
                  width: `${Math.max((w.count / max) * 100, 5)}%`,
                  backgroundColor: `${CAMPAIGN_RED}33`,
                  borderLeft: `3px solid ${CAMPAIGN_RED}`,
                }}
              >
                <span className="text-q-caption-sm-medium tabular-nums" style={{ color: CAMPAIGN_RED }}>
                  {w.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Weekly Shareable Card ───

function WeeklyCard() {
  const { data, isPending } = useQuery({
    queryKey: ["weekly-summary"],
    queryFn: () => getWeeklySummary(),
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function getCanvasBlob(): Promise<Blob | null> {
    if (!data || !canvasRef.current) return Promise.resolve(null);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);

    const W = 1080, H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, W, H);

    // Top bar
    ctx.fillStyle = CAMPAIGN_RED;
    ctx.fillRect(0, 0, W, 8);

    // Logo area
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px Arial, sans-serif";
    ctx.fillText("#GlasŽrtev", 60, 90);

    ctx.fillStyle = "#888888";
    ctx.font = "28px Arial, sans-serif";
    ctx.fillText(`Tedenski povzetek · ${data.startDate} – ${data.endDate}`, 60, 130);

    // Big number
    ctx.fillStyle = CAMPAIGN_RED;
    ctx.font = "bold 180px Arial, sans-serif";
    ctx.fillText(String(data.total), 60, 320);

    ctx.fillStyle = "#cccccc";
    ctx.font = "32px Arial, sans-serif";
    ctx.fillText("prijav ta teden", 60, 370);

    // Category breakdown
    const cats = [
      { label: "Žaljivke", count: data.zaljivke, color: CAT_ZALJIVKA },
      { label: "Sovražni govor", count: data.sovrazniGovor, color: CAT_SOVRAZNI },
      { label: "Grožnje", count: data.groznje, color: CAT_GROZNJA },
    ];
    cats.forEach((cat, i) => {
      const y = 460 + i * 90;
      ctx.fillStyle = cat.color;
      ctx.fillRect(60, y, 12, 60);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px Arial, sans-serif";
      ctx.fillText(String(cat.count), 100, y + 45);
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "28px Arial, sans-serif";
      ctx.fillText(cat.label, 200, y + 45);
    });

    // Bottom info
    ctx.fillStyle = "#666666";
    ctx.font = "24px Arial, sans-serif";
    ctx.fillText(`Dnevno povprečje: ${data.dailyAvg}  ·  Najpogostejša platforma: ${data.topPlatform}`, 60, 780);

    // CTA
    ctx.fillStyle = "#444444";
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText("Prijavi tudi ti → glaszrttev.higgsfield.app", 60, 1020);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  async function generateCard() {
    const blob = await getCanvasBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glaszrttev-tedenski-povzetek.png";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Kartica prenesena.");
  }

  const shareText = data
    ? `${data.total} prijav sovražnega govora ta teden v Sloveniji.\n${data.zaljivke} žaljivk, ${data.sovrazniGovor} sovražnega govora, ${data.groznje} groženj.\n#GlasŽrtev`
    : "";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://glaszrttev.higgsfield.app";

  function shareToX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  async function shareToInstagram() {
    await shareImageToPlatform("Instagramu");
  }

  async function shareToTikTok() {
    await shareImageToPlatform("TikToku");
  }

  async function shareToYouTube() {
    await shareImageToPlatform("YouTube");
  }

  async function shareImageToPlatform(platformName: string) {
    const blob = await getCanvasBlob();
    if (!blob) {
      toast.error("Napaka pri generiranju kartice.");
      return;
    }
    const file = new File([blob], "glaszrttev-tedenski-povzetek.png", { type: "image/png" });

    if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: shareText, title: "#GlasŽrtev — tedenski povzetek" });
      } catch {
        // User cancelled
      }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "glaszrttev-tedenski-povzetek.png";
      a.click();
      URL.revokeObjectURL(url);
      toast.info(`Sliko prenesite in jo objavite na ${platformName}.`);
    }
  }

  function shareCard() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "#GlasŽrtev — tedenski povzetek",
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Povezava kopirana.");
    }
  }

  return (
    <Card surface="solid" className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Typography as="h3" variant="title-md-semi-bold" className="text-q-text-primary">
            Kartica tedna
          </Typography>
          <Typography as="p" variant="body-sm-regular" color="secondary" className="mt-1">
            {isPending
              ? "Nalaganje…"
              : data
                ? `${data.startDate} – ${data.endDate} · ${data.total} prijav`
                : ""}
          </Typography>
        </div>
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-q-400"
          style={{ backgroundColor: `${CAMPAIGN_RED}22`, color: CAMPAIGN_RED }}
        >
          <Icon as={Sparkles} size="md" />
        </span>
      </div>

      {/* Preview */}
      {!isPending && data && (
        <div className="rounded-q-500 border border-q-border-subtle bg-q-background-secondary p-4">
          <div className="mb-3 h-1 rounded-full" style={{ backgroundColor: CAMPAIGN_RED }} />
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tabular-nums" style={{ color: CAMPAIGN_RED }}>{data.total}</span>
            <span className="mb-1 text-q-body-sm-regular text-q-text-tertiary">prijav ta teden</span>
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: CAT_ZALJIVKA }} />
              <span className="text-q-body-sm-regular text-q-text-secondary">Žaljivke</span>
              <span className="ml-auto text-q-body-sm-medium tabular-nums text-q-text-primary">{data.zaljivke}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: CAT_SOVRAZNI }} />
              <span className="text-q-body-sm-regular text-q-text-secondary">Sovražni govor</span>
              <span className="ml-auto text-q-body-sm-medium tabular-nums text-q-text-primary">{data.sovrazniGovor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: CAT_GROZNJA }} />
              <span className="text-q-body-sm-regular text-q-text-secondary">Grožnje</span>
              <span className="ml-auto text-q-body-sm-medium tabular-nums text-q-text-primary">{data.groznje}</span>
            </div>
          </div>
          <div className="mt-3 border-t border-q-border-subtle pt-2">
            <Typography as="p" variant="caption-sm-regular" className="text-q-text-tertiary">
              Dnevno povprečje: {data.dailyAvg} · Top: {data.topPlatform}
            </Typography>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Platform share buttons */}
      <div className="flex flex-col gap-2">
        <Typography as="p" variant="caption-sm-medium" className="text-q-text-tertiary">
          Deli na družbenih omrežjih
        </Typography>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <button
            type="button"
            disabled={isPending || !data}
            onClick={shareToX}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-q-500 px-3 py-3 text-q-label-md-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "#000000" }}
          >
            <IconX size={16} />
            X
          </button>
          <button
            type="button"
            disabled={isPending || !data}
            onClick={shareToFacebook}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-q-500 px-3 py-3 text-q-label-md-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "#1877f2" }}
          >
            <IconFacebook size={16} />
            Facebook
          </button>
          <button
            type="button"
            disabled={isPending || !data}
            onClick={() => void shareToInstagram()}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-q-500 px-3 py-3 text-q-label-md-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #405de6, #e1306c, #f77737)" }}
          >
            <IconInstagram size={16} />
            Instagram
          </button>
          <button
            type="button"
            disabled={isPending || !data}
            onClick={() => void shareToTikTok()}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-q-500 px-3 py-3 text-q-label-md-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "#010101" }}
          >
            <IconTikTok size={16} />
            TikTok
          </button>
          <button
            type="button"
            disabled={isPending || !data}
            onClick={() => void shareToYouTube()}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-q-500 px-3 py-3 text-q-label-md-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "#ff0000" }}
          >
            <IconYouTube size={16} />
            YouTube
          </button>
        </div>
      </div>

      {/* Secondary actions */}
      <div className="flex gap-2">
        <Button
          variant="tertiary"
          size="md"
          onClick={generateCard}
          disabled={isPending || !data}
          start={<Icon as={Download} size="sm" />}
        >
          Prenesi PNG
        </Button>
        <Button
          variant="tertiary"
          size="md"
          onClick={shareCard}
          disabled={isPending || !data}
          start={<Icon as={Share2} size="sm" />}
        >
          Kopiraj povezavo
        </Button>
      </div>
    </Card>
  );
}

// ─── Report Form ───

function ReportForm({ onSubmitted }: { onSubmitted: () => void }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [attackMotive, setAttackMotive] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = text.trim().length >= 3 && category != null && platform != null && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !category || !platform) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitReport({
        data: {
          text,
          category: category as "zaljivka" | "sovrazni_govor" | "groznja",
          platform,
          gender: (gender as "m" | "f" | "d" | undefined) ?? undefined,
          age_group: (ageGroup as typeof AGE_GROUPS[number] | undefined) ?? undefined,
          has_children: hasChildren ?? undefined,
          attack_motive: (attackMotive as typeof ATTACK_MOTIVES[number]["value"] | undefined) ?? undefined,
        },
      });
      if (result.ok) {
        toast.success("Prijava oddana. Hvala za vaš glas.");
        setText("");
        setCategory(null);
        setPlatform(null);
        setGender(null);
        setAgeGroup(null);
        setHasChildren(null);
        setAttackMotive(null);
        await queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        await queryClient.invalidateQueries({ queryKey: ["analytics"] });
        await queryClient.invalidateQueries({ queryKey: ["weekly-summary"] });
        onSubmitted();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Napaka pri oddaji prijave.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card surface="solid" className="flex flex-col gap-5 p-4 md:p-6">
      <div>
        <Typography as="h3" variant="title-md-semi-bold" className="text-q-text-primary">
          Prijavi primer
        </Typography>
        <Typography as="p" variant="body-sm-regular" color="secondary" className="mt-1">
          Vaša identiteta ni shranjena. Vnos se takoj anonimizira.
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-q-label-md-medium text-q-text-primary">
          Opis / citat žaljivke <span style={{ color: CAMPAIGN_RED }}>*</span>
        </label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napišite kaj je bilo rečeno / napisano…"
          rows={4}
          maxLength={1000}
        />
        <div className="flex justify-end">
          <span className="text-q-caption-sm-regular text-q-text-tertiary tabular-nums">{text.length}/1000</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-q-label-md-medium text-q-text-primary">
          Kategorija <span style={{ color: CAMPAIGN_RED }}>*</span>
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const IconComp = CATEGORY_ICONS[cat.value] ?? ShieldAlert;
            const active = category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className="flex cursor-pointer items-center gap-2 rounded-q-400 border p-3 text-left transition-all"
                style={{
                  borderColor: active ? cat.color : "var(--hf-color-border-default)",
                  backgroundColor: active ? `${cat.color}15` : "transparent",
                }}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-q-300" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
                  <Icon as={IconComp} size="sm" />
                </span>
                <span className="text-q-label-md-medium text-q-text-primary">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-q-label-md-medium text-q-text-primary">
          Platforma <span style={{ color: CAMPAIGN_RED }}>*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const active = platform === p;
            return (
              <button key={p} type="button" onClick={() => setPlatform(p)}
                className="cursor-pointer rounded-q-full border px-4 py-2 text-q-label-md-regular transition-all"
                style={{
                  borderColor: active ? CAMPAIGN_RED : "var(--hf-color-border-default)",
                  backgroundColor: active ? `${CAMPAIGN_RED}15` : "transparent",
                  color: active ? CAMPAIGN_RED : "var(--hf-color-text-primary)",
                }}
              >{p}</button>
            );
          })}
        </div>
      </div>

      <details className="rounded-q-400 border border-q-border-subtle">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-q-label-md-medium text-q-text-secondary list-none [&::-webkit-details-marker]:hidden">
          <Icon as={Info} size="sm" />
          Neobvezni podatki za analitiko ozadja
          <span className="ml-auto text-q-caption-sm-regular text-q-text-tertiary">anonimno</span>
        </summary>
        <div className="flex flex-col gap-4 border-t border-q-border-subtle p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-q-label-sm-medium text-q-text-secondary">Spol</label>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <Chip key={g.value} active={gender === g.value} onClick={() => setGender(gender === g.value ? null : g.value)}>{g.label}</Chip>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-q-label-sm-medium text-q-text-secondary">Starostna skupina</label>
              <div className="flex flex-wrap gap-2">
                {AGE_GROUPS.map((a) => (
                  <Chip key={a} active={ageGroup === a} onClick={() => setAgeGroup(ageGroup === a ? null : a)}>{a}</Chip>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-q-label-sm-medium text-q-text-secondary">Ali imate otroke?</label>
              <div className="flex flex-wrap gap-2">
                <Chip active={hasChildren === true} onClick={() => setHasChildren(hasChildren === true ? null : true)}>Da</Chip>
                <Chip active={hasChildren === false} onClick={() => setHasChildren(hasChildren === false ? null : false)}>Ne</Chip>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-q-label-sm-medium text-q-text-secondary">Zaradi česa ste bili napadeni?</label>
              <div className="flex flex-wrap gap-2">
                {ATTACK_MOTIVES.map((m) => (
                  <Chip key={m.value} active={attackMotive === m.value} onClick={() => setAttackMotive(attackMotive === m.value ? null : m.value)}>{m.label}</Chip>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-q-300 bg-q-background-tertiary px-3 py-2">
            <Icon as={Lock} size="xs" className="text-q-text-tertiary" />
            <Typography as="p" variant="caption-sm-regular" className="text-q-text-tertiary">
              Izključno za agregatno statistično analizo. Nikoli povezano z identiteto.
            </Typography>
          </div>
        </div>
      </details>

      {error && (
        <Typography as="p" variant="caption-sm-regular" color="danger" role="alert">{error}</Typography>
      )}

      <div className="flex items-center justify-between gap-3">
        <Typography as="p" variant="caption-sm-regular" className="text-q-text-tertiary">
          <Icon as={Lock} size="xs" className="inline align-middle" /> Identiteta ni shranjena
        </Typography>
        <Button variant="primary" size="md" disabled={!canSubmit} onClick={handleSubmit}>
          {submitting ? <Loader size="xs" color="neutral" /> : <>{submitting ? "Oddajam…" : "Oddaj prijavo"}<Icon as={Send} size="sm" /></>}
        </Button>
      </div>
    </Card>
  );
}

function Chip({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-q-full border px-3 py-1.5 text-q-label-sm-regular transition-all"
      style={{
        borderColor: active ? CAMPAIGN_RED : "var(--hf-color-border-default)",
        backgroundColor: active ? `${CAMPAIGN_RED}15` : "transparent",
        color: active ? CAMPAIGN_RED : "var(--hf-color-text-primary)",
      }}
    >
      {children}
    </button>
  );
}

// ─── Category Legend ───

function CategoryLegend() {
  return (
    <Card surface="solid" className="flex flex-col gap-4 p-4 md:p-6">
      <Typography as="h3" variant="title-md-semi-bold" className="text-q-text-primary">Kategorije prijav</Typography>
      <div className="flex flex-col gap-3">
        {CATEGORIES.map((cat) => {
          const IconComp = CATEGORY_ICONS[cat.value] ?? ShieldAlert;
          return (
            <div key={cat.value} className="flex gap-3 rounded-q-400 border border-q-border-subtle p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-q-400" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
                <Icon as={IconComp} size="md" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-q-label-lg-medium" style={{ color: cat.color }}>{cat.label}</span>
                <Typography as="p" variant="body-sm-regular" color="secondary">{cat.description}</Typography>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Analytics Panel ───

function AnalyticsPanel() {
  const { data, isPending, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => getAnalytics(),
  });

  if (isPending) {
    return <div className="flex items-center justify-center py-12"><Loader size="md" color="neutral" /></div>;
  }
  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Typography as="p" variant="body-sm-regular" color="danger">Napaka pri nalaganju analitike.</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card surface="solid" className="flex items-center gap-2 p-4">
        <Icon as={Info} size="sm" className="text-q-text-tertiary" />
        <Typography as="p" variant="body-sm-regular" color="secondary">
          Skupno {data.totalWithDemographics} prijav z demografskimi podatki. Vsi podatki so agregirani in anonimni.
        </Typography>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        <BreakdownCard title="Po spolu" data={data.gender} />
        <BreakdownCard title="Po starostni skupini" data={data.ageGroup} />
        <BreakdownCard title="Otroci" data={data.hasChildren} />
        <BreakdownCard title="Motiv napada" data={data.attackMotive} />
      </div>
    </div>
  );
}

function BreakdownCard({ title, data }: { title: string; data: { label: string; count: number; percentage: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <Card surface="solid" className="flex flex-col gap-3 p-4">
      <Typography as="h4" variant="title-sm-semi-bold" className="text-q-text-primary">{title}</Typography>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-q-body-sm-regular text-q-text-secondary">{d.label}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-q-200 bg-q-background-tertiary">
              <div className="h-full rounded-q-200 transition-all duration-500" style={{ width: `${Math.max((d.count / max) * 100, 2)}%`, backgroundColor: CAMPAIGN_RED }} />
            </div>
            <span className="w-12 shrink-0 text-right text-q-body-sm-medium tabular-nums text-q-text-primary">{d.count}</span>
            <span className="w-10 shrink-0 text-right text-q-caption-sm-regular text-q-text-tertiary tabular-nums">{d.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Sign-in prompt ───

function SignInPrompt() {
  return (
    <Card surface="solid" className="grid place-items-center p-8 text-center">
      <div className="flex max-w-sm flex-col items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-q-full" style={{ backgroundColor: `${CAMPAIGN_RED}22`, color: CAMPAIGN_RED }}>
          <Icon as={LogIn} size="md" />
        </span>
        <Typography as="h3" variant="title-md-semi-bold" className="text-q-text-primary">Prijava potrebna</Typography>
        <Typography as="p" variant="body-sm-regular" color="secondary">
          Za ustvarjanje vizualnega povzetka se prijavite v Higgsfield.
        </Typography>
        <a
          href="/__auth/login?return=/"
          className="inline-flex cursor-pointer items-center gap-2 rounded-q-500 px-5 py-2.5 text-q-label-md-medium text-white"
          style={{ backgroundColor: CAMPAIGN_RED }}
        >
          <Icon as={LogIn} size="sm" /> Prijavi se
        </a>
      </div>
    </Card>
  );
}

// ─── Main Layout ───

export function AppDetailTemplate() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isSignedIn = false;

  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
    refetchInterval: 30000, // refresh every 30s for "live" feel
  });

  const statsData = stats.data;

  return (
    <div className="min-h-dvh bg-q-background-primary">
      
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-q-500" style={{ background: `linear-gradient(135deg, ${CAMPAIGN_RED}, ${CAMPAIGN_RED_DARK})` }}>
            <Icon as={Megaphone} size="md" className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-q-headline-sm-semi-bold text-q-text-primary">#GlasŽrtev</h1>
            <p className="text-q-body-sm-regular text-q-text-secondary truncate">Števec sovražnega govora v Sloveniji</p>
          </div>
        </header>

        {/* Tabs */}
        <div
          variant="segmented"
          value={activeTab}
          onValueChange={(v) => setActiveTab(String(v))}
          className="flex! min-h-0 w-full flex-col gap-5"
        >
          <Tabs.List
            className="self-start"
            items={[
              { value: "dashboard", label: "Nadzorna plošča", start: <Icon size="sm" as={BarChart3} /> },
              { value: "submit", label: "Prijavi", start: <Icon size="sm" as={Send} /> },
              { value: "categories", label: "Kategorije", start: <Icon size="sm" as={Info} /> },
              { value: "analytics", label: "Analitika", start: <Icon size="sm" as={BarChart3} /> },
              { value: "visual", label: "Vizualni povzetki", start: <Icon size="sm" as={Megaphone} /> },
            ]}
          />

          {/* ─── Dashboard Tab ─── */}
          <div value="dashboard" className="flex flex-col gap-4 pt-0">
            {/* Hero — daily counter from 0 */}
            <Hero stats={statsData} isPending={stats.isPending} />

            {/* Pyramid */}
            {statsData && <CategoryPyramid categories={statsData.categories} />}

            {/* Charts row */}
            {statsData && (
              <div className="grid gap-4 lg:grid-cols-2">
                <StackedAreaChart monthly={statsData.monthly} />
                <HeatmapChart heatmap={statsData.heatmap} />
              </div>
            )}

            {/* Platform breakdown */}
            {statsData && statsData.platforms.length > 0 && (
              <PlatformBreakdown platforms={statsData.platforms} />
            )}

            {/* Voices feed */}
            {statsData && <VoicesFeed reports={statsData.recentReports} />}

            {/* Words that hurt */}
            {statsData && statsData.words.length > 0 && (
              <WordsThatHurt words={statsData.words} />
            )}

            {/* Weekly card */}
            <WeeklyCard />
          </div>

          {/* ─── Submit Tab ─── */}
          <div value="submit" className="pt-0">
            <ReportForm onSubmitted={() => setActiveTab("dashboard")} />
          </div>

          {/* ─── Categories Tab ─── */}
          <div value="categories" className="pt-0">
            <CategoryLegend />
          </div>

          {/* ─── Analytics Tab ─── */}
          <div value="analytics" className="pt-0">
            <AnalyticsPanel />
          </div>

          {/* ─── Visual Tab ─── */}
                  </div>

        {/* Footer */}
        <footer className="flex items-center justify-center gap-2 py-6 text-center">
          <Icon as={Lock} size="xs" className="text-q-text-tertiary" />
          <Typography as="p" variant="caption-sm-regular" className="text-q-text-tertiary">
            #GlasŽrtev — anonimiziran števec sovražnega govora. Imena in osebni podatki niso objavljeni.
          </Typography>
        </footer>
      </div>
    </div>
  );
}
export default AppDetailTemplate;
