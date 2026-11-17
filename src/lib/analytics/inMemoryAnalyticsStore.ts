import fs from "fs";
import path from "path";
import { PageViewRecord, ToolUseRecord } from "./types";

const inMemoryPageViews: PageViewRecord[] = [];
const inMemoryToolUses: ToolUseRecord[] = [];

const TMP_DIR = process.env.TMPDIR || process.env.TEMP || "/tmp";
const PV_FILE = path.join(TMP_DIR, "pfc_analytics_pv.json");
const TU_FILE = path.join(TMP_DIR, "pfc_analytics_tu.json");

function loadFromDisk<T>(filePath: string): T[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data) || [];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveToDisk<T>(filePath: string, items: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(items.slice(0, 1000)), "utf8");
  } catch {
    // ignore
  }
}

export function addInMemoryPageView(record: PageViewRecord): void {
  inMemoryPageViews.unshift(record);
  if (inMemoryPageViews.length > 5000) {
    inMemoryPageViews.pop();
  }
  const disk = loadFromDisk<PageViewRecord>(PV_FILE);
  disk.unshift(record);
  saveToDisk(PV_FILE, disk);
}

export function addInMemoryToolUse(record: ToolUseRecord): void {
  inMemoryToolUses.unshift(record);
  if (inMemoryToolUses.length > 5000) {
    inMemoryToolUses.pop();
  }
  const disk = loadFromDisk<ToolUseRecord>(TU_FILE);
  disk.unshift(record);
  saveToDisk(TU_FILE, disk);
}

export function getInMemoryPageViews(): PageViewRecord[] {
  const disk = loadFromDisk<PageViewRecord>(PV_FILE);
  const map = new Map<string, PageViewRecord>();
  for (const item of inMemoryPageViews) map.set(item.id, item);
  for (const item of disk) map.set(item.id, item);
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getInMemoryToolUses(): ToolUseRecord[] {
  const disk = loadFromDisk<ToolUseRecord>(TU_FILE);
  const map = new Map<string, ToolUseRecord>();
  for (const item of inMemoryToolUses) map.set(item.id, item);
  for (const item of disk) map.set(item.id, item);
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function resetInMemoryAnalytics(): void {
  inMemoryPageViews.length = 0;
  inMemoryToolUses.length = 0;
  try {
    if (fs.existsSync(PV_FILE)) fs.unlinkSync(PV_FILE);
    if (fs.existsSync(TU_FILE)) fs.unlinkSync(TU_FILE);
  } catch {
    // ignore
  }
}
