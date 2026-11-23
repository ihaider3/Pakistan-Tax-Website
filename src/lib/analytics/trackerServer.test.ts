import { describe, it, expect, beforeEach } from "vitest";
import {
  hashVisitor,
  detectDevice,
  isBot,
  sanitizeReferrer,
  recordPageView,
  recordToolUse,
  getAnalyticsMetrics,
  RECORDING_START_DATE,
  RECORDING_START_LABEL,
} from "./trackerServer";
import { resetPersistentStore, getAllPageViews, getAllToolUses } from "./persistentStore";

describe("Privacy-First Analytics Tracker (P61)", () => {
  beforeEach(() => {
    resetPersistentStore();
  });

  describe("hashVisitor & Privacy", () => {
    it("deduplicates the same visitor on the same day", () => {
      const hash1 = hashVisitor("192.168.1.100", "Mozilla/5.0 Chrome", "2026-11-23");
      const hash2 = hashVisitor("192.168.1.100", "Mozilla/5.0 Chrome", "2026-11-23");
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });

    it("produces different hashes on different days (daily rotation)", () => {
      const hashDay1 = hashVisitor("192.168.1.100", "Mozilla/5.0 Chrome", "2026-11-23");
      const hashDay2 = hashVisitor("192.168.1.100", "Mozilla/5.0 Chrome", "2026-11-24");
      expect(hashDay1).not.toBe(hashDay2);
    });

    it("produces different hashes for different IP or User-Agent", () => {
      const h1 = hashVisitor("1.1.1.1", "Mozilla", "2026-11-23");
      const h2 = hashVisitor("1.1.1.2", "Mozilla", "2026-11-23");
      expect(h1).not.toBe(h2);
    });

    it("never contains raw IP or User-Agent in the hash", () => {
      const ip = "203.0.113.195";
      const ua = "Mozilla/5.0 iPhone";
      const hash = hashVisitor(ip, ua, "2026-11-23");
      expect(hash).not.toContain(ip);
      expect(hash).not.toContain("iPhone");
    });
  });

  describe("Device Detection & Bot Filtering", () => {
    it("detects mobile devices", () => {
      expect(detectDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)")).toBe("mobile");
      expect(detectDevice("Mozilla/5.0 (Linux; Android 14; Mobile)")).toBe("mobile");
    });

    it("detects desktop devices", () => {
      expect(detectDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
      expect(detectDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("desktop");
    });

    it("identifies crawler bots", () => {
      expect(isBot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe(true);
      expect(isBot("curl/7.88.1")).toBe(true);
      expect(isBot("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0")).toBe(false);
    });
  });

  describe("Referrer Sanitization", () => {
    it("strips internal domains", () => {
      expect(sanitizeReferrer("https://calculationhubs.com/zakat", "calculationhubs.com")).toBeNull();
      expect(sanitizeReferrer("https://calculationhub-official.vercel.app/admin", "calculationhubs.com")).toBeNull();
    });

    it("extracts clean external domain", () => {
      expect(sanitizeReferrer("https://www.google.com/search?q=pak+tax", "calculationhubs.com")).toBe("google.com");
      expect(sanitizeReferrer("https://facebook.com/l.php?u=xyz", "calculationhubs.com")).toBe("facebook.com");
    });
  });

  describe("Data Storage Privacy — Zero Calculator Inputs Logged", () => {
    it("stores page views without storing raw IP or sensitive data", async () => {
      const hash = hashVisitor("203.0.113.5", "Mozilla/5.0 Android", "2026-11-23");
      await recordPageView(
        "/salary-tax-calculator",
        hash,
        null,
        "mobile",
        "PK",
        "Karachi"
      );

      const records = await getAllPageViews();
      expect(records.length).toBe(1);
      const rec = records[0];
      expect(rec.page).toBe("/salary-tax-calculator");
      expect(rec.device).toBe("mobile");
      expect(rec.country).toBe("PK");
      expect(rec.city).toBe("Karachi");
      expect((rec as any).ip).toBeUndefined();
    });

    it("stores tool usage without logging any calculator amounts or inputs", async () => {
      const hash = hashVisitor("203.0.113.6", "Mozilla/5.0 Windows", "2026-11-23");
      await recordToolUse(
        "zakat",
        hash,
        "Zakat Calculator"
      );

      const records = await getAllToolUses();
      expect(records.length).toBe(1);
      const rec = records[0];
      expect(rec.calculator).toBe("zakat");
      expect(rec.tool_name).toBe("Zakat Calculator");
      expect((rec as any).salary).toBeUndefined();
      expect((rec as any).cash).toBeUndefined();
      expect((rec as any).gold).toBeUndefined();
      expect((rec as any).result).toBeUndefined();
      expect((rec as any).ip).toBeUndefined();
    });
  });

  describe("Analytics Metrics Computation", () => {
    it("returns correct structure with recordingStartDate and prior dates flagged", async () => {
      const metrics = await getAnalyticsMetrics("30d");
      expect(metrics.recordingStartDate).toBe(RECORDING_START_LABEL);
      expect(metrics.range).toBe("30d");
      expect(metrics.dailySummaryTable.length).toBe(30);

      // Days before RECORDING_START_DATE should have isPriorToRecording = true
      const preDate = metrics.dailySummaryTable.find((d) => d.date < RECORDING_START_DATE);
      if (preDate) {
        expect(preDate.isPriorToRecording).toBe(true);
        expect(preDate.uniqueVisitors).toBe(0);
      }
    });

    it("supports 7d, 15d, 30d, and all ranges", async () => {
      const m7 = await getAnalyticsMetrics("7d");
      expect(m7.dailySummaryTable.length).toBe(7);

      const m15 = await getAnalyticsMetrics("15d");
      expect(m15.dailySummaryTable.length).toBe(15);

      const m30 = await getAnalyticsMetrics("30d");
      expect(m30.dailySummaryTable.length).toBe(30);

      const mAll = await getAnalyticsMetrics("all");
      expect(mAll.dailySummaryTable.length).toBeGreaterThanOrEqual(1);
    });
  });
});
