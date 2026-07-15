import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getDB } from "./db.js";
// NOTE: seeding removed from auto-run. Run `npm run db:seed` manually and only
// for local/dev testing — never against the live/public database, since seed
// data is fabricated example text, not real reports.
import { anonymizeText, CATEGORIES } from "../src/lib/anonymize.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database starts empty. Real reports accumulate from actual user submissions only.

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];
const MONTH_NAMES_FULL = ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"];

function getNow() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// ─── Dashboard Stats ───
app.get("/api/dashboard", (_req, res) => {
  const db = getDB();
  const now = getNow();

  const todayCount = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE date(created_at) = date('now')").get() as { c: number }).c;
  const totalYear = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE year = ?").get(now.year) as { c: number }).c;
  const totalAll = (db.prepare("SELECT COUNT(*) as c FROM reports").get() as { c: number }).c;

  // Categories
  const catRows = db.prepare("SELECT category, COUNT(*) as c FROM reports WHERE year = ? GROUP BY category").all(now.year) as { category: string; c: number }[];
  const catMap = new Map(catRows.map(r => [r.category, r.c]));
  const categories = CATEGORIES.map(cat => ({
    value: cat.value, label: cat.label, color: cat.color,
    count: catMap.get(cat.value) ?? 0,
    percentage: totalYear > 0 ? Math.round((catMap.get(cat.value) ?? 0) / totalYear * 100) : 0,
  }));

  // Monthly — last 8 months
  const monthly = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.year, now.month - 1 - i, 1);
    const y = d.getFullYear(), m = d.getMonth() + 1;
    const rows = db.prepare("SELECT category, COUNT(*) as c FROM reports WHERE year = ? AND month = ? GROUP BY category").all(y, m) as { category: string; c: number }[];
    let z = 0, s = 0, g = 0;
    for (const r of rows) { if (r.category === "zaljivka") z = r.c; else if (r.category === "sovrazni_govor") s = r.c; else if (r.category === "groznja") g = r.c; }
    monthly.push({ year: y, month: m, label: MONTH_LABELS[m - 1], zaljivke: z, sovrazniGovor: s, groznje: g, total: z + s + g });
  }

  // Recent reports
  const recentRows = db.prepare("SELECT id, anonymized_text, category, platform, created_at FROM reports ORDER BY created_at DESC LIMIT 15").all() as any[];
  const recentReports = recentRows.map(r => {
    const cat = CATEGORIES.find(c => c.value === r.category);
    return { id: r.id, anonymized_text: r.anonymized_text, category: r.category, category_label: cat?.label ?? r.category, category_color: cat?.color ?? "#888", platform: r.platform, created_at: r.created_at };
  });

  // Platforms
  const platformRows = db.prepare("SELECT platform, COUNT(*) as c FROM reports WHERE year = ? GROUP BY platform ORDER BY c DESC").all(now.year) as { platform: string; c: number }[];
  const platformTotal = platformRows.reduce((s, r) => s + r.c, 0);
  const platforms = platformRows.map(r => ({ platform: r.platform, count: r.c, percentage: platformTotal > 0 ? Math.round(r.c / platformTotal * 100) : 0 }));

  // Heatmap
  const heatRows = db.prepare("SELECT CAST(strftime('%w', created_at) AS INTEGER) as dow, CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as c FROM reports WHERE year = ? GROUP BY dow, hour").all(now.year) as { dow: number; hour: number; c: number }[];
  const heatMap = new Map(heatRows.map(r => [`${r.dow === 0 ? 6 : r.dow - 1}-${r.hour}`, r.c]));
  const heatmap = [];
  for (let day = 0; day < 7; day++) for (let hour = 0; hour < 24; hour++) heatmap.push({ day, hour, count: heatMap.get(`${day}-${hour}`) ?? 0 });

  // Word frequency
  const textRows = db.prepare("SELECT anonymized_text FROM reports WHERE year = ? LIMIT 500").all(now.year) as { anonymized_text: string }[];
  const STOP = new Set(["in","da","ne","je","na","se","za","si","ti","bi","to","tako","ali","pa","ki","kva","naj","tudi","bil","dobil","videl","vem","mislim","prav","mora","lahko","kdaj","kjer","pred","vse","vec","zdaj","pol","kaj","kdo","tale","tisti","tak","svoj","recimo","mogoce","saj","seveda","no","ja","nisem","nisi","ni","nismo","niste","niso","sem","smo","ste","so","sebo","se"]);
  const wordCounts = new Map<string, number>();
  for (const r of textRows) {
    const words = r.anonymized_text.toLowerCase().replace(/████/g, " ").replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter(w => w.length >= 3 && !STOP.has(w));
    for (const w of words) wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1);
  }
  const words = Array.from(wordCounts.entries()).map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count).slice(0, 20);

  res.json({ todayCount, totalYear, totalAll, categories, monthly, recentReports, platforms, heatmap, words });
});

// ─── Analytics ───
app.get("/api/analytics", (_req, res) => {
  const db = getDB();
  const totalWithDemo = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE gender IS NOT NULL OR age_group IS NOT NULL").get() as { c: number }).c;

  function breakdown(col: string, labels: { value: string; label: string }[]) {
    const rows = db.prepare(`SELECT ${col} as v, COUNT(*) as c FROM reports WHERE ${col} IS NOT NULL GROUP BY ${col}`).all() as { v: string; c: number }[];
    const map = new Map(rows.map(r => [r.v, r.c]));
    return labels.map(l => ({ value: l.value, label: l.label, count: map.get(l.value) ?? 0, percentage: totalWithDemo > 0 ? Math.round((map.get(l.value) ?? 0) / totalWithDemo * 100) : 0 }));
  }

  const gender = breakdown("gender", [{ value: "m", label: "Moški" }, { value: "f", label: "Ženska" }, { value: "d", label: "Drugo" }]);
  const ageGroup = breakdown("age_group", [{ value: "18-24", label: "18–24" }, { value: "25-34", label: "25–34" }, { value: "35-44", label: "35–44" }, { value: "45-54", label: "45–54" }, { value: "55+", label: "55+" }]);
  const childRows = db.prepare("SELECT has_children, COUNT(*) as c FROM reports WHERE has_children IS NOT NULL GROUP BY has_children").all() as { has_children: number; c: number }[];
  const childMap = new Map(childRows.map(r => [r.has_children, r.c]));
  const hasChildren = [
    { value: "da", label: "Ima otroke", count: childMap.get(1) ?? 0, percentage: totalWithDemo > 0 ? Math.round((childMap.get(1) ?? 0) / totalWithDemo * 100) : 0 },
    { value: "ne", label: "Nima otrok", count: childMap.get(0) ?? 0, percentage: totalWithDemo > 0 ? Math.round((childMap.get(0) ?? 0) / totalWithDemo * 100) : 0 },
  ];
  const attackMotive = breakdown("attack_motive", [
    { value: "videz", label: "Videz" }, { value: "narodnost", label: "Narodnost / poreklo" },
    { value: "spol", label: "Spol" }, { value: "spolna_usmerjenost", label: "Spolna usmerjenost" },
    { value: "vera", label: "Vera" }, { value: "politicno_stalisce", label: "Politično stališče" },
    { value: "osebni_spor", label: "Osebni spor" }, { value: "drugo", label: "Drugo" },
  ]);

  res.json({ gender, ageGroup, hasChildren, attackMotive, totalWithDemographics: totalWithDemo });
});

// ─── Weekly Summary ───
app.get("/api/weekly", (_req, res) => {
  const db = getDB();
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(now); weekStart.setDate(now.getDate() + diff); weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6); weekEnd.setHours(23, 59, 59, 999);

  const total = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE created_at >= ? AND created_at <= ?").get(weekStart.toISOString(), weekEnd.toISOString()) as { c: number }).c;
  const catRows = db.prepare("SELECT category, COUNT(*) as c FROM reports WHERE created_at >= ? AND created_at <= ? GROUP BY category").all(weekStart.toISOString(), weekEnd.toISOString()) as { category: string; c: number }[];
  const catMap = new Map(catRows.map(r => [r.category, r.c]));
  const topPlatformRow = db.prepare("SELECT platform, COUNT(*) as c FROM reports WHERE created_at >= ? AND created_at <= ? GROUP BY platform ORDER BY c DESC LIMIT 1").get(weekStart.toISOString(), weekEnd.toISOString()) as { platform: string } | undefined;

  const fmt = (d: Date) => d.toLocaleDateString("sl-SI", { day: "numeric", month: "short" });
  res.json({
    total,
    zaljivke: catMap.get("zaljivka") ?? 0,
    sovrazniGovor: catMap.get("sovrazni_govor") ?? 0,
    groznje: catMap.get("groznja") ?? 0,
    startDate: fmt(weekStart), endDate: fmt(weekEnd),
    dailyAvg: total > 0 ? Math.round(total / 7) : 0,
    topPlatform: topPlatformRow?.platform ?? "—",
  });
});

// ─── Submit Report ───
app.post("/api/reports", (req, res) => {
  const db = getDB();
  const { text, category, platform, gender, age_group, has_children, attack_motive } = req.body;

  if (!text || text.trim().length < 3) return res.status(400).json({ error: "Opis je prekratek." });
  if (!["zaljivka", "sovrazni_govor", "groznja"].includes(category)) return res.status(400).json({ error: "Neveljavna kategorija." });
  if (!platform) return res.status(400).json({ error: "Platforma je obvezna." });

  const anonymized = anonymizeText(text);
  const now = getNow();
  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO reports (id, anonymized_text, category, platform, gender, age_group, has_children, attack_motive, year, month)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, anonymized, category, platform, gender ?? null, age_group ?? null,
    has_children == null ? null : (has_children ? 1 : 0), attack_motive ?? null, now.year, now.month);

  res.json({ ok: true, id });
});

// ─── Serve static files in production ───
const clientDist = path.join(__dirname, "..", "dist", "client");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`#GlasŽrtev strežnik teče na http://localhost:${PORT}`);
});
