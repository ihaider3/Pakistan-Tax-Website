import { PageViewRecord, ToolUseRecord } from "./types";

const inMemoryPageViews: PageViewRecord[] = [];
const inMemoryToolUses: ToolUseRecord[] = [];

export function addInMemoryPageView(record: PageViewRecord): void {
  inMemoryPageViews.unshift(record);
  if (inMemoryPageViews.length > 5000) {
    inMemoryPageViews.pop();
  }
}

export function addInMemoryToolUse(record: ToolUseRecord): void {
  inMemoryToolUses.unshift(record);
  if (inMemoryToolUses.length > 5000) {
    inMemoryToolUses.pop();
  }
}

export function getInMemoryPageViews(): PageViewRecord[] {
  return inMemoryPageViews;
}

export function getInMemoryToolUses(): ToolUseRecord[] {
  return inMemoryToolUses;
}

export function resetInMemoryAnalytics(): void {
  inMemoryPageViews.length = 0;
  inMemoryToolUses.length = 0;
}

