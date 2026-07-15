import Database from "better-sqlite3";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "data", "glaszrtev.db");

let _db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
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
}
