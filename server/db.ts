import Database from "better-sqlite3";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });
const DB_PATH = join(dataDir, "glaszrtev.db");

let _db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      anonymized_text TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('zaljivka', 'sovrazni_govor', 'groznja')),
      platform TEXT NOT NULL,
      gender TEXT,
      age_group TEXT,
      has_children INTEGER,
      attack_motive TEXT,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_reports_year_month ON reports(year, month);
    CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
    CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
  `);
  return _db;
}
