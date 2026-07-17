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

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"];
function getNow() { const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() + 1 }; }

// ─── Dashboard ───
app.get("/api/dashboard", (_req, res) => {
  const db = getDB(); const now = getNow();
  const today = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE date(created_at) = date('now')").get() as {c:number}).c;
  const totalYear = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE year = ?").get(now.year) as {c:number}).c;
  const totalAll = (db.prepare("SELECT COUNT(*) as c FROM reports").get() as {c:number}).c;

  const cats = db.prepare("SELECT category, COUNT(*) as c FROM reports WHERE year = ? GROUP BY category").all(now.year) as {category:string;c:number}[];
  const cm = new Map(cats.map(r => [r.category, r.c]));
  const categories = CATEGORIES.map(cat => ({ value:cat.value, label:cat.label, color:cat.color, count:cm.get(cat.value)??0, percentage: totalYear>0?Math.round((cm.get(cat.value)??0)/totalYear*100):0 }));

  const monthly = [];
  for (let i=7;i>=0;i--) { const d=new Date(now.year,now.month-1-i,1); const y=d.getFullYear(),m=d.getMonth()+1;
    const rows = db.prepare("SELECT category, COUNT(*) as c FROM reports WHERE year = ? AND month = ? GROUP BY category").all(y,m) as {category:string;c:number}[];
    let z=0,s=0,g=0; for(const r of rows){if(r.category==="zaljivka")z=r.c;else if(r.category==="sovrazni_govor")s=r.c;else if(r.category==="groznja")g=r.c;}
    monthly.push({year:y,month:m,label:MONTH_LABELS[m-1],zaljivke:z,sovrazniGovor:s,groznje:g,total:z+s+g});
  }

  const recent = db.prepare("SELECT id, anonymized_text, category, platform, created_at FROM reports ORDER BY created_at DESC LIMIT 15").all() as any[];
  const recentReports = recent.map(r => { const cat = CATEGORIES.find(c=>c.value===r.category); return {id:r.id,anonymized_text:r.anonymized_text,category:r.category,category_label:cat?.label??r.category,category_color:cat?.color??"#888",platform:r.platform,created_at:r.created_at}; });

  const platforms = (db.prepare("SELECT platform, COUNT(*) as c FROM reports WHERE year = ? GROUP BY platform ORDER BY c DESC").all(now.year) as {platform:string;c:number}[]).map(r => { const pt = platforms_total(db, now.year); return {platform:r.platform,count:r.c,percentage:pt>0?Math.round(r.c/pt*100):0}; });
  function platforms_total(db:any, year:number) { return (db.prepare("SELECT COUNT(*) as c FROM reports WHERE year = ?").get(year) as {c:number}).c; }

  const heat = db.prepare("SELECT CAST(strftime('%w', created_at) AS INTEGER) as dow, CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as c FROM reports WHERE year = ? GROUP BY dow, hour").all(now.year) as {dow:number;hour:number;c:number}[];
  const hm = new Map(heat.map(r => [`${r.dow===0?6:r.dow-1}-${r.hour}`, r.c]));
  const heatmap = []; for(let d=0;d<7;d++) for(let h=0;h<24;h++) heatmap.push({day:d,hour:h,count:hm.get(`${d}-${h}`)??0});

  const STOP = new Set(["in","da","ne","je","na","se","za","si","ti","bi","to","tako","ali","pa","ki","kva","naj","tudi","bil","dobil","videl","vem","mislim","prav","mora","lahko","kdaj","kjer","pred","vse","vec","zdaj","pol","kaj","kdo","tale","tisti","tak","svoj","recimo","mogoce","saj","seveda","no","ja","nisem","nisi","ni","nismo","niste","niso","sem","smo","ste","so","sebo","se"]);
  const texts = db.prepare("SELECT anonymized_text FROM reports WHERE year = ? LIMIT 500").all(now.year) as {anonymized_text:string}[];
  const wc = new Map<string,number>();
  for(const t of texts) { const words = t.anonymized_text.toLowerCase().replace(/████/g," ").replace(/[^\p{L}\s]/gu," ").split(/\s+/).filter(w=>w.length>=3&&!STOP.has(w)); for(const w of words) wc.set(w,(wc.get(w)??0)+1); }
  const words = Array.from(wc.entries()).map(([word,count])=>({word,count})).sort((a,b)=>b.count-a.count).slice(0,20);

  res.json({ todayCount:today, totalYear, totalAll, categories, monthly, recentReports, platforms, heatmap, words });
});

// ─── Analytics ───
app.get("/api/analytics", (_req, res) => {
  const db = getDB();
  const total = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE gender IS NOT NULL OR age_group IS NOT NULL").get() as {c:number}).c;
  function bd(col:string, labels:{value:string;label:string}[]) {
    const rows = db.prepare(`SELECT ${col} as v, COUNT(*) as c FROM reports WHERE ${col} IS NOT NULL GROUP BY ${col}`).all() as {v:string;c:number}[];
    const m = new Map(rows.map(r=>[r.v,r.c]));
    return labels.map(l=>({value:l.value,label:l.label,count:m.get(l.value)??0,percentage:total>0?Math.round((m.get(l.value)??0)/total*100):0}));
  }
  const gender = bd("gender",[{value:"m",label:"Moški"},{value:"f",label:"Ženska"},{value:"d",label:"Drugo"}]);
  const ageGroup = bd("age_group",[{value:"18-24",label:"18–24"},{value:"25-34",label:"25–34"},{value:"35-44",label:"35–44"},{value:"45-54",label:"45–54"},{value:"55+",label:"55+"}]);
  const cr = db.prepare("SELECT has_children, COUNT(*) as c FROM reports WHERE has_children IS NOT NULL GROUP BY has_children").all() as {has_children:number;c:number}[];
  const cm = new Map(cr.map(r=>[r.has_children,r.c]));
  const hasChildren = [{value:"da",label:"Ima otroke",count:cm.get(1)??0,percentage:total>0?Math.round((cm.get(1)??0)/total*100):0},{value:"ne",label:"Nima otrok",count:cm.get(0)??0,percentage:total>0?Math.round((cm.get(0)??0)/total*100):0}];
  const attackMotive = bd("attack_motive",[{value:"videz",label:"Videz"},{value:"narodnost",label:"Narodnost / poreklo"},{value:"spol",label:"Spol"},{value:"spolna_usmerjenost",label:"Spolna usmerjenost"},{value:"vera",label:"Vera"},{value:"politicno_stalisce",label:"Politično stališče"},{value:"osebni_spor",label:"Osebni spor"},{value:"drugo",label:"Drugo"}]);
  res.json({ gender, ageGroup, hasChildren, attackMotive, totalWithDemographics: total });
});

// ─── Weekly ───
app.get("/api/weekly", (_req, res) => {
  const db = getDB(); const now = new Date();
  const day = now.getDay(); const diff = day===0?-6:1-day;
  const ws = new Date(now); ws.setDate(now.getDate()+diff); ws.setHours(0,0,0,0);
  const we = new Date(ws); we.setDate(ws.getDate()+6); we.setHours(23,59,59,999);
  const total = (db.prepare("SELECT COUNT(*) as c FROM reports WHERE created_at >= ? AND created_at <= ?").get(ws.toISOString(),we.toISOString()) as {c:number}).c;
  const cats = db.prepare("SELECT category, COUNT(*) as c FROM reports WHERE created_at >= ? AND created_at <= ? GROUP BY category").all(ws.toISOString(),we.toISOString()) as {category:string;c:number}[];
  const cm = new Map(cats.map(r=>[r.category,r.c]));
  const tp = (db.prepare("SELECT platform FROM reports WHERE created_at >= ? AND created_at <= ? GROUP BY platform ORDER BY COUNT(*) DESC LIMIT 1").get(ws.toISOString(),we.toISOString()) as {platform:string})?.platform ?? "—";
  const fmt = (d:Date) => d.toLocaleDateString("sl-SI",{day:"numeric",month:"short"});
  res.json({ total, zaljivke:cm.get("zaljivka")??0, sovrazniGovor:cm.get("sovrazni_govor")??0, groznje:cm.get("groznja")??0, startDate:fmt(ws), endDate:fmt(we), dailyAvg:total>0?Math.round(total/7):0, topPlatform:tp });
});

// ─── Submit ───
app.post("/api/reports", (req, res) => {
  const db = getDB(); const { text, category, platform, gender, age_group, has_children, attack_motive } = req.body;
  if (!text || text.trim().length < 3) return res.status(400).json({ error: "Opis je prekratek." });
  if (!["zaljivka","sovrazni_govor","groznja"].includes(category)) return res.status(400).json({ error: "Neveljavna kategorija." });
  if (!platform) return res.status(400).json({ error: "Platforma je obvezna." });
  const now = getNow(); const id = crypto.randomUUID();
  db.prepare("INSERT INTO reports (id, anonymized_text, category, platform, gender, age_group, has_children, attack_motive, year, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .run(id, anonymizeText(text), category, platform, gender??null, age_group??null, has_children==null?null:(has_children?1:0), attack_motive??null, now.year, now.month);
  res.json({ ok: true, id });
});

// ─── Static files in production ───
const clientDist = path.join(__dirname, "..", "dist", "client");
app.use(express.static(clientDist));
app.get("*", (_req, res) => { res.sendFile(path.join(clientDist, "index.html")); });

app.listen(PORT, () => { console.log(`#GlasŽrtev na http://localhost:${PORT}`); });
