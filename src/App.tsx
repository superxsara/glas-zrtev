import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { api } from "./lib/api";
import {
  CATEGORIES, PLATFORMS, GENDERS, AGE_GROUPS, ATTACK_MOTIVES,
} from "./lib/anonymize";
import type {
  DashboardStats, AnalyticsData, WeeklySummary, AnalyticsBreakdown,
  CategoryStat, MonthlyStat, RecentReport, PlatformStat, HeatmapCell, WordFreqItem,
} from "./types";

const CAMPAIGN_RED = "#c0392b";
const CAMPAIGN_RED_LIGHT = "#e74c3c";
const CAMPAIGN_RED_DARK = "#922b21";
const CAT_ZALJIVKA = "#e67e22";
const CAT_SOVRAZNI = "#c0392b";
const CAT_GROZNJA = "#8e44ad";
const DAY_NAMES_SL = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];

function relativeTime(iso: string): string {
  const d = new Date(iso + (iso.endsWith("Z") ? "" : "Z"));
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "zdaj";
  if (diff < 3600) return `pred ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `pred ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `pred ${Math.floor(diff / 86400)} dni`;
  return d.toLocaleDateString("sl-SI", { day: "numeric", month: "short" });
}

function platformBadge(p: string) {
  const m: Record<string, { l: string; b: string }> = { X: { l: "X", b: "#1d1d1d" }, Facebook: { l: "FB", b: "#1877f2" }, Instagram: { l: "IG", b: "#e1306c" }, TikTok: { l: "TT", b: "#010101" }, YouTube: { l: "YT", b: "#ff0000" } };
  return m[p] ?? { l: p.slice(0, 2), b: "#555" };
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (target <= 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return <>{display.toLocaleString("sl-SI")}</>;
}

function Chip({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-all" style={{ borderColor: active ? CAMPAIGN_RED : "#262626", backgroundColor: active ? `${CAMPAIGN_RED}15` : "transparent", color: active ? CAMPAIGN_RED : "#e5e5e5" }}>{children}</button>;
}

function BreakdownCard({ title, data }: { title: string; data: AnalyticsBreakdown[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <h4 className="mb-3 text-sm font-semibold text-white">{title}</h4>
      <div className="flex flex-col gap-2">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-neutral-400">{d.label}</span>
            <div className="h-5 flex-1 overflow-hidden rounded bg-neutral-800"><div className="h-full rounded transition-all duration-500" style={{ width: `${Math.max((d.count / max) * 100, 2)}%`, backgroundColor: CAMPAIGN_RED }} /></div>
            <span className="w-12 text-right text-sm font-medium tabular-nums text-white">{d.count}</span>
            <span className="w-10 text-right text-xs text-neutral-500 tabular-nums">{d.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const loadStats = useCallback(async () => {
    try { setStats(await api.getDashboardStats()); }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [loadStats]);

  useEffect(() => {
    if (tab === "analytics" && !analytics) api.getAnalytics().then(setAnalytics);
  }, [tab, analytics]);

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-8">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `linear-gradient(135deg, ${CAMPAIGN_RED}, ${CAMPAIGN_RED_DARK})` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3 10v4a1 1 0 001 1h3l3.3 3.3a1 1 0 001.7-.7V6.4a1 1 0 00-1.7-.7L7 9H4a1 1 0 00-1 1zm10 2a3 3 0 002 2.83v2.05A5 5 0 0113 12zm2-5.66v2.06A3 3 0 0113 6a5 5 0 012-4.66z"/></svg>
          </div>
          <div><h1 className="text-lg font-bold text-white">#GlasŽrtev</h1><p className="text-sm text-neutral-400">Števec sovražnega govora v Sloveniji</p></div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {([["dashboard","Nadzorna plošča"],["submit","Prijavi"],["categories","Kategorije"],["analytics","Analitika"]] as const).map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)} className="cursor-pointer whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all" style={{ backgroundColor: tab === v ? CAMPAIGN_RED : "transparent", color: tab === v ? "white" : "#a3a3a3", border: `1px solid ${tab === v ? CAMPAIGN_RED : "#262626"}` }}>{l}</button>
          ))}
        </div>

        {tab === "dashboard" && (
          <div className="flex flex-col gap-4">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-8 md:p-12">
              <div className="keyhole-bg" />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: `linear-gradient(135deg, ${CAMPAIGN_RED}, ${CAMPAIGN_RED_DARK})` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 10v4a1 1 0 001 1h3l3.3 3.3a1 1 0 001.7-.7V6.4a1 1 0 00-1.7-.7L7 9H4a1 1 0 00-1 1zm10 2a3 3 0 002 2.83v2.05A5 5 0 0113 12zm2-5.66v2.06A3 3 0 0113 6a5 5 0 012-4.66z"/></svg>
                  </span>
                  <span className="text-lg font-semibold text-white">#GlasŽrtev</span>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Danes že</p>
                {statsLoading ? <div className="h-20 w-20 animate-pulse rounded-full bg-neutral-800" /> : (
                  <div className="count-up-enter">
                    <span className="font-bold tabular-nums leading-none" style={{ fontSize: "clamp(3.5rem, 12vw, 7rem)", color: CAMPAIGN_RED }}>
                      <AnimatedCounter target={stats?.todayCount ?? 0} />
                    </span>
                  </div>
                )}
                <p className="text-base text-neutral-400">prijav sovražnega govora in žaljivk danes</p>
                {stats && stats.totalYear > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-full border border-neutral-800 px-4 py-2">
                    <span className="text-sm text-neutral-400"><b className="tabular-nums text-white">{stats.totalYear.toLocaleString("sl-SI")}</b> prijav v {new Date().getFullYear()}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Pyramid */}
            {stats && (
              <div className="flex flex-col gap-2">
                <h3 className="mb-2 text-sm font-semibold text-white">Piramida resnosti</h3>
                {(["groznja","sovrazni_govor","zaljivka"] as const).map((v, i) => {
                  const cat = stats.categories.find(c => c.value === v); if (!cat) return null;
                  const widths = ["45%","70%","100%"];
                  return (
                    <div key={v} className="mx-auto flex w-full items-center gap-3 rounded-xl border p-4 transition-all" style={{ width: widths[i], borderColor: `${cat.color}44`, backgroundColor: `${cat.color}0a` }}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}><span className="text-sm font-bold">{cat.label[0]}</span></span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium text-white">{cat.label}</span><span className="text-sm font-bold tabular-nums" style={{ color: cat.color }}>{cat.count}</span></div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(cat.percentage, 2)}%`, backgroundColor: cat.color }} /></div>
                        <span className="text-xs text-neutral-500">{cat.percentage}% vseh prijav</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Charts */}
            {stats && (
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Stacked Area Chart */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Gibanje po mesecih</h3>
                    <div className="flex gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: CAT_ZALJIVKA }} /> Žaljivke</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: CAT_SOVRAZNI }} /> Sovražni</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: CAT_GROZNJA }} /> Grožnje</span>
                    </div>
                  </div>
                  <StackedChart monthly={stats.monthly} />
                </div>
                {/* Heatmap */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
                  <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-white">Kdaj se zgodi</h3><span className="text-xs text-neutral-500">Dan × ura</span></div>
                  <HeatmapGrid heatmap={stats.heatmap} />
                </div>
              </div>
            )}

            {/* Platforms */}
            {stats && stats.platforms.length > 0 && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
                <h3 className="mb-3 text-sm font-semibold text-white">Platforme</h3>
                <div className="flex flex-col gap-2">
                  {stats.platforms.map(p => {
                    const b = platformBadge(p.platform); const max = Math.max(...stats.platforms.map(x => x.count), 1);
                    return (
                      <div key={p.platform} className="flex items-center gap-3">
                        <span className="grid h-7 min-w-7 place-items-center rounded px-1.5 text-xs font-medium text-white" style={{ backgroundColor: b.b }}>{b.l}</span>
                        <div className="h-5 flex-1 overflow-hidden rounded bg-neutral-800"><div className="h-full rounded transition-all duration-500" style={{ width: `${(p.count / max) * 100}%`, backgroundColor: CAMPAIGN_RED }} /></div>
                        <span className="w-12 text-right text-sm font-medium tabular-nums text-white">{p.count}</span><span className="w-10 text-right text-xs text-neutral-500">{p.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Voices Feed */}
            {stats && <VoicesFeed reports={stats.recentReports} />}

            {/* Words */}
            {stats && stats.words.length > 0 && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
                <h3 className="text-base font-semibold text-white">Besede, ki ranijo</h3>
                <p className="mb-4 text-sm text-neutral-400">Najpogostejše besede v anonimiziranih prijavah</p>
                <div className="flex flex-col gap-2">
                  {stats.words.map((w, i) => { const max = stats.words[0].count; return (
                    <div key={w.word} className="flex items-center gap-3">
                      <span className="w-5 text-right text-xs text-neutral-500 tabular-nums">{i + 1}</span>
                      <span className="w-32 truncate text-sm font-medium text-white">{w.word}</span>
                      <div className="h-6 flex-1 overflow-hidden rounded bg-neutral-800">
                        <div className="flex h-full items-center rounded px-2 transition-all duration-500" style={{ width: `${Math.max((w.count / max) * 100, 5)}%`, backgroundColor: `${CAMPAIGN_RED}33`, borderLeft: `3px solid ${CAMPAIGN_RED}` }}>
                          <span className="text-xs font-medium tabular-nums" style={{ color: CAMPAIGN_RED }}>{w.count}</span>
                        </div>
                      </div>
                    </div>
                  ); })}
                </div>
              </div>
            )}

            {/* Weekly Card */}
            <WeeklyCardSection />
          </div>
        )}

        {tab === "submit" && <ReportFormSection onSubmitted={() => { setTab("dashboard"); loadStats(); }} />}
        {tab === "categories" && <CategoryLegend />}
        {tab === "analytics" && analytics && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-400">
              Skupno {analytics.totalWithDemographics} prijav z demografskimi podatki. Vsi podatki so agregirani in anonimni.
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <BreakdownCard title="Po spolu" data={analytics.gender} />
              <BreakdownCard title="Po starostni skupini" data={analytics.ageGroup} />
              <BreakdownCard title="Otroci" data={analytics.hasChildren} />
              <BreakdownCard title="Motiv napada" data={analytics.attackMotive} />
            </div>
          </div>
        )}

        <footer className="flex items-center justify-center gap-2 py-6 text-center">
          <span className="text-xs text-neutral-600">#GlasŽrtev — anonimiziran števec sovražnega govora. Imena in osebni podatki niso objavljeni.</span>
        </footer>
      </div>
    </div>
  );
}

// ─── Stacked Chart ───
function StackedChart({ monthly }: { monthly: MonthlyStat[] }) {
  const maxTotal = Math.max(...monthly.map(m => m.total), 1);
  const W = 600, H = 200, pad = 24, iW = W - pad * 2, iH = H - pad * 2;
  const step = monthly.length > 1 ? iW / (monthly.length - 1) : 0;
  function path(getVal: (m: MonthlyStat) => number, offset: (m: MonthlyStat) => number) {
    const pts = monthly.map((m, i) => ({ x: pad + i * step, yT: pad + iH - (getVal(m) / maxTotal) * iH, yB: pad + iH - (offset(m) / maxTotal) * iH }));
    return `${pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yT}`).join(" ")} ${pts.reverse().map(p => `L ${p.x} ${p.yB}`).join(" ")} Z`;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0,0.25,0.5,0.75,1].map(t => <line key={t} x1={pad} x2={W-pad} y1={pad+iH*t} y2={pad+iH*t} stroke="#262626" strokeWidth="1" strokeDasharray="2 4" />)}
      <path d={path(m => m.zaljivke, () => 0)} fill={CAT_ZALJIVKA} opacity="0.7" />
      <path d={path(m => m.zaljivke + m.sovrazniGovor, m => m.zaljivke)} fill={CAT_SOVRAZNI} opacity="0.7" />
      <path d={path(m => m.zaljivke + m.sovrazniGovor + m.groznje, m => m.zaljivke + m.sovrazniGovor)} fill={CAT_GROZNJA} opacity="0.7" />
      {monthly.map((m, i) => <text key={i} x={pad+i*step} y={H-4} textAnchor="middle" fill="#666" fontSize="11">{m.label}</text>)}
    </svg>
  );
}

// ─── Heatmap ───
function HeatmapGrid({ heatmap }: { heatmap: HeatmapCell[] }) {
  const max = Math.max(...heatmap.map(c => c.count), 1);
  const color = (c: number) => c === 0 ? "#171717" : `rgba(192,57,43,${0.2 + Math.min(c/max,1)*0.8})`;
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      <div className="flex shrink-0 flex-col gap-[2px] pt-5">
        {DAY_NAMES_SL.map(d => <div key={d} className="flex h-4 items-center justify-end pr-1 text-xs text-neutral-500" style={{ width: "28px" }}>{d}</div>)}
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="flex flex-col gap-[2px]">
            {Array.from({ length: 7 }, (_, d) => { const c = heatmap.find(x => x.day === d && x.hour === h); return <div key={d} className="h-4 w-4 rounded-sm" style={{ backgroundColor: color(c?.count ?? 0) }} title={`${DAY_NAMES_SL[d]} ${h}:00 — ${c?.count ?? 0}`} />; })}
            <div className="mt-1 text-center text-xs text-neutral-600">{h % 3 === 0 ? `${h}h` : ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Voices Feed ───
function VoicesFeed({ reports }: { reports: RecentReport[] }) {
  const [paused, setPaused] = useState(false);
  if (!reports.length) return <div className="py-12 text-center text-neutral-500">Še ni prijav.</div>;
  const doubled = [...reports, ...reports];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div><h3 className="text-base font-semibold text-white">Glasovi</h3><p className="text-sm text-neutral-400">Kaj ljudje doživlja danes</p></div>
        <button onClick={() => setPaused(p => !p)} className="cursor-pointer rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800">{paused ? "Predvajaj" : "Ustavi"}</button>
      </div>
      <div className="relative h-[400px] overflow-hidden rounded-xl border border-neutral-800" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
        <div className={`auto-scroll ${paused ? "auto-scroll-paused" : ""}`}>
          <div className="flex flex-col gap-2 p-3">
            {doubled.map((r, idx) => { const b = platformBadge(r.platform); return (
              <div key={`${r.id}-${idx}`} className="flex flex-col gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 min-w-6 place-items-center rounded px-1.5 text-xs font-medium text-white" style={{ backgroundColor: b.b }}>{b.l}</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${r.category_color}22`, color: r.category_color }}>{r.category_label}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{relativeTime(r.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-300">{r.anonymized_text}</p>
              </div>
            ); })}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-neutral-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>
      <p className="text-center text-xs text-neutral-500">Vsa besedila so anonimizirana. Imena so zamenjana z ████.</p>
    </div>
  );
}

// ─── Weekly Card ───
function WeeklyCardSection() {
  const [data, setData] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => { api.getWeeklySummary().then(setData).finally(() => setLoading(false)); }, []);

  const shareText = data ? `${data.total} prijav sovražnega govora ta teden v Sloveniji.\n${data.zaljivke} žaljivk, ${data.sovrazniGovor} sovražnega govora, ${data.groznje} groženj.\n#GlasŽrtev` : "";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function getBlob(): Promise<Blob | null> {
    if (!data || !canvasRef.current) return Promise.resolve(null);
    const c = canvasRef.current, ctx = c.getContext("2d"); if (!ctx) return Promise.resolve(null);
    c.width = 1080; c.height = 1080;
    ctx.fillStyle = "#181818"; ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = CAMPAIGN_RED; ctx.fillRect(0, 0, 1080, 8);
    ctx.fillStyle = "#fff"; ctx.font = "bold 56px Arial"; ctx.fillText("#GlasŽrtev", 60, 90);
    ctx.fillStyle = "#888"; ctx.font = "28px Arial"; ctx.fillText(`Tedenski povzetek · ${data.startDate} – ${data.endDate}`, 60, 130);
    ctx.fillStyle = CAMPAIGN_RED; ctx.font = "bold 180px Arial"; ctx.fillText(String(data.total), 60, 320);
    ctx.fillStyle = "#ccc"; ctx.font = "32px Arial"; ctx.fillText("prijav ta teden", 60, 370);
    [[CAT_ZALJIVKA,"Žaljivke",data.zaljivke],[CAT_SOVRAZNI,"Sovražni govor",data.sovrazniGovor],[CAT_GROZNJA,"Grožnje",data.groznje]].forEach(([c,l,n],i) => {
      const y = 460+i*90; ctx.fillStyle = c as string; ctx.fillRect(60,y,12,60);
      ctx.fillStyle = "#fff"; ctx.font = "bold 36px Arial"; ctx.fillText(String(n),100,y+45);
      ctx.fillStyle = "#aaa"; ctx.font = "28px Arial"; ctx.fillText(l as string,200,y+45);
    });
    ctx.fillStyle = "#666"; ctx.font = "24px Arial"; ctx.fillText(`Dnevno povprečje: ${data.dailyAvg} · Top: ${data.topPlatform}`, 60, 780);
    return new Promise(r => c.toBlob(b => r(b), "image/png"));
  }

  async function download() { const b = await getBlob(); if (!b) return; const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "glaszrttev.png"; a.click(); URL.revokeObjectURL(u); }
  function shareX() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank"); }
  function shareFB() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank"); }
  async function shareImg(name: string) {
    const b = await getBlob(); if (!b) return; const f = new File([b], "glaszrttev.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [f] })) { try { await navigator.share({ files: [f], text: shareText }); } catch {} }
    else { const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "glaszrttev.png"; a.click(); URL.revokeObjectURL(u); alert(`Sliko prenesite in jo objavite na ${name}.`); }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white">Kartica tedna</h3>
      <p className="mb-3 mt-1 text-sm text-neutral-400">{loading ? "Nalaganje…" : data ? `${data.startDate} – ${data.endDate} · ${data.total} prijav` : ""}</p>
      {!loading && data && (
        <div className="mb-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="mb-3 h-1 rounded-full" style={{ backgroundColor: CAMPAIGN_RED }} />
          <div className="flex items-end gap-2"><span className="text-4xl font-bold tabular-nums" style={{ color: CAMPAIGN_RED }}>{data.total}</span><span className="mb-1 text-sm text-neutral-500">prijav ta teden</span></div>
          <div className="mt-3 flex flex-col gap-1">
            {[[CAT_ZALJIVKA,"Žaljivke",data.zaljivke],[CAT_SOVRAZNI,"Sovražni govor",data.sovrazniGovor],[CAT_GROZNJA,"Grožnje",data.groznje]].map(([c,l,n]) => (
              <div key={l as string} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ backgroundColor: c as string }} /><span className="text-sm text-neutral-400">{l as string}</span><span className="ml-auto text-sm font-medium tabular-nums text-white">{n as number}</span></div>
            ))}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <p className="mb-2 text-xs font-medium text-neutral-500">Deli na družbenih omrežjih</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        <button onClick={shareX} disabled={loading} className="rounded-lg px-3 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: "#000" }}>X</button>
        <button onClick={shareFB} disabled={loading} className="rounded-lg px-3 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: "#1877f2" }}>Facebook</button>
        <button onClick={() => shareImg("Instagramu")} disabled={loading} className="rounded-lg px-3 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg,#405de6,#e1306c,#f77737)" }}>Instagram</button>
        <button onClick={() => shareImg("TikToku")} disabled={loading} className="rounded-lg px-3 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: "#010101" }}>TikTok</button>
        <button onClick={() => shareImg("YouTube")} disabled={loading} className="rounded-lg px-3 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: "#ff0000" }}>YouTube</button>
      </div>
      <button onClick={download} disabled={loading} className="mt-2 w-full rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-40">Prenesi PNG</button>
    </div>
  );
}

// ─── Report Form ───
function ReportFormSection({ onSubmitted }: { onSubmitted: () => void }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [attackMotive, setAttackMotive] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const canSubmit = text.trim().length >= 3 && category && platform && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !category || !platform) return;
    setSubmitting(true); setError(null);
    try {
      await api.submitReport({ text, category, platform, gender: gender ?? undefined, age_group: ageGroup ?? undefined, has_children: hasChildren ?? undefined, attack_motive: attackMotive ?? undefined });
      setText(""); setCategory(null); setPlatform(null); setGender(null); setAgeGroup(null); setHasChildren(null); setAttackMotive(null);
      setSuccess(true); setTimeout(() => onSubmitted(), 1500);
    } catch (e) { setError(e instanceof Error ? e.message : "Napaka pri oddaji."); }
    finally { setSubmitting(false); }
  };

  if (success) return <div className="rounded-xl border border-green-800 bg-green-950 p-8 text-center"><p className="text-lg font-medium text-green-400">Prijava oddana. Hvala za vaš glas.</p></div>;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
      <h3 className="text-base font-semibold text-white">Prijavi primer</h3>
      <p className="mb-4 mt-1 text-sm text-neutral-400">Vaša identiteta ni shranjena. Vnos se takoj anonimizira.</p>
      <label className="mb-1 block text-sm font-medium text-white">Opis / citat žaljivke <span style={{ color: CAMPAIGN_RED }}>*</span></label>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Napišite kaj je bilo rečeno…" rows={4} maxLength={1000} className="mb-1 w-full resize-none rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-sm text-white placeholder-neutral-600 focus:border-campaign-red focus:outline-none" />
      <div className="mb-4 flex justify-end"><span className="text-xs text-neutral-500 tabular-nums">{text.length}/1000</span></div>
      <label className="mb-2 block text-sm font-medium text-white">Kategorija <span style={{ color: CAMPAIGN_RED }}>*</span></label>
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        {CATEGORIES.map(cat => (
          <button key={cat.value} type="button" onClick={() => setCategory(cat.value)} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-left transition-all" style={{ borderColor: category === cat.value ? cat.color : "#262626", backgroundColor: category === cat.value ? `${cat.color}15` : "transparent" }}>
            <span className="grid h-7 w-7 place-items-center rounded" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}><span className="text-xs font-bold">{cat.label[0]}</span></span>
            <span className="text-sm font-medium text-white">{cat.label}</span>
          </button>
        ))}
      </div>
      <label className="mb-2 block text-sm font-medium text-white">Platforma <span style={{ color: CAMPAIGN_RED }}>*</span></label>
      <div className="mb-4 flex flex-wrap gap-2">{PLATFORMS.map(p => <button key={p} type="button" onClick={() => setPlatform(p)} className="cursor-pointer rounded-full border px-4 py-2 text-sm transition-all" style={{ borderColor: platform === p ? CAMPAIGN_RED : "#262626", backgroundColor: platform === p ? `${CAMPAIGN_RED}15` : "transparent", color: platform === p ? CAMPAIGN_RED : "#e5e5e5" }}>{p}</button>)}</div>
      <details className="mb-4 rounded-lg border border-neutral-800">
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-300 list-none">Neobvezni podatki za analitiko ozadja <span className="ml-auto text-xs text-neutral-500">anonimno</span></summary>
        <div className="grid gap-4 border-t border-neutral-800 p-4 sm:grid-cols-2">
          <div><label className="mb-2 block text-xs font-medium text-neutral-400">Spol</label><div className="flex flex-wrap gap-2">{GENDERS.map(g => <Chip key={g.value} active={gender === g.value} onClick={() => setGender(gender === g.value ? null : g.value)}>{g.label}</Chip>)}</div></div>
          <div><label className="mb-2 block text-xs font-medium text-neutral-400">Starostna skupina</label><div className="flex flex-wrap gap-2">{AGE_GROUPS.map(a => <Chip key={a} active={ageGroup === a} onClick={() => setAgeGroup(ageGroup === a ? null : a)}>{a}</Chip>)}</div></div>
          <div><label className="mb-2 block text-xs font-medium text-neutral-400">Ali imate otroke?</label><div className="flex flex-wrap gap-2"><Chip active={hasChildren === true} onClick={() => setHasChildren(hasChildren === true ? null : true)}>Da</Chip><Chip active={hasChildren === false} onClick={() => setHasChildren(hasChildren === false ? null : false)}>Ne</Chip></div></div>
          <div className="sm:col-span-2"><label className="mb-2 block text-xs font-medium text-neutral-400">Zaradi čega ste bili napadeni?</label><div className="flex flex-wrap gap-2">{ATTACK_MOTIVES.map(m => <Chip key={m.value} active={attackMotive === m.value} onClick={() => setAttackMotive(attackMotive === m.value ? null : m.value)}>{m.label}</Chip>)}</div></div>
        </div>
      </details>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-neutral-500">🔒 Identiteta ni shranjena</span>
        <button onClick={handleSubmit} disabled={!canSubmit} className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: CAMPAIGN_RED }}>{submitting ? "Oddajam…" : "Oddaj prijavo"}</button>
      </div>
    </div>
  );
}

// ─── Category Legend ───
function CategoryLegend() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 md:p-6">
      <h3 className="mb-4 text-base font-semibold text-white">Kategorije prijav</h3>
      <div className="flex flex-col gap-3">
        {CATEGORIES.map(cat => (
          <div key={cat.value} className="flex gap-3 rounded-lg border border-neutral-800 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${cat.color}22`, color: cat.color }}><span className="text-sm font-bold">{cat.label[0]}</span></span>
            <div className="flex flex-col gap-1"><span className="text-sm font-medium" style={{ color: cat.color }}>{cat.label}</span><p className="text-sm text-neutral-400">{cat.description}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
