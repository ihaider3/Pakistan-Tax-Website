import { describe, it, expect, beforeEach } from "vitest";
import {
  checkApiRateLimit,
  resetApiRateLimits,
  validateOrigin,
  validateImageMagicBytes,
  sanitizeApiError,
} from "./apiSecurity";
import {
  recordFailedLogin,
  getFailedLoginCount7Days,
  resetLoginRateLimits,
  verifySessionToken,
  generateSessionToken,
} from "@/lib/feedback/adminAuth";
import { calculateSalaryTax } from "@/lib/calc/salary";
import { calculateZakat, ZakatInputs } from "@/lib/calc/zakat";
import { calculatePropertyTax } from "@/lib/calc/property";
import { calculateGst } from "@/lib/calc/gst";
import { calculateFitrana } from "@/lib/calc/fitrana";
import { calculateUshr } from "@/lib/calc/ushr";
import { NextRequest } from "next/server";

describe("Prompt 31 — Full Website Security Hardening", () => {
  beforeEach(() => {
    resetApiRateLimits();
    resetLoginRateLimits();
  });

  describe("1. In-Memory API Rate Limiter", () => {
    it("allows requests under the rate limit", () => {
      const res1 = checkApiRateLimit("test-ip-1", 5, 10000);
      expect(res1.allowed).toBe(true);
      expect(res1.remaining).toBe(4);

      const res2 = checkApiRateLimit("test-ip-1", 5, 10000);
      expect(res2.allowed).toBe(true);
      expect(res2.remaining).toBe(3);
    });

    it("blocks requests that exceed the rate limit and specifies retryAfter", () => {
      for (let i = 0; i < 3; i++) {
        checkApiRateLimit("test-ip-2", 3, 10000);
      }
      const blocked = checkApiRateLimit("test-ip-2", 3, 10000);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  describe("2. Origin & CORS Validation", () => {
    it("allows requests with matching host or known trusted domains", () => {
      const reqSameOrigin = new NextRequest("https://calculationhub-official.vercel.app/api/feedback", {
        headers: {
          host: "calculationhub-official.vercel.app",
          origin: "https://calculationhub-official.vercel.app",
        },
      });
      expect(validateOrigin(reqSameOrigin).allowed).toBe(true);

      const reqLocalhost = new NextRequest("http://localhost:3000/api/feedback", {
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        },
      });
      expect(validateOrigin(reqLocalhost).allowed).toBe(true);
    });

    it("rejects untrusted third-party origins attempting cross-site POST", () => {
      const reqMalicious = new NextRequest("https://calculationhub-official.vercel.app/api/feedback", {
        headers: {
          host: "calculationhub-official.vercel.app",
          origin: "https://evil-hacker-site.com",
        },
      });
      const check = validateOrigin(reqMalicious);
      expect(check.allowed).toBe(false);
      expect(check.error).toBeDefined();
    });
  });

  describe("3. Server-Side Image Magic Byte Inspection", () => {
    it("accepts authentic JPEG header (FF D8 FF)", () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      const res = validateImageMagicBytes(jpegBuffer);
      expect(res.valid).toBe(true);
      expect(res.mime).toBe("image/jpeg");
    });

    it("accepts authentic PNG header (89 50 4E 47 0D 0A 1A 0A)", () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
      const res = validateImageMagicBytes(pngBuffer);
      expect(res.valid).toBe(true);
      expect(res.mime).toBe("image/png");
    });

    it("accepts authentic WebP header (RIFF....WEBP)", () => {
      const webpBuffer = Buffer.from("RIFF\x00\x00\x00\x00WEBPVP8 ");
      const res = validateImageMagicBytes(webpBuffer);
      expect(res.valid).toBe(true);
      expect(res.mime).toBe("image/webp");
    });

    it("rejects malicious or spoofed files (e.g. HTML / script disguised as image)", () => {
      const fakeImage = Buffer.from("<script>alert('xss')</script>");
      const res = validateImageMagicBytes(fakeImage);
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe("4. Error Sanitization", () => {
    it("never leaks database schema or stack trace details in public errors", () => {
      const internalDbError = new Error("relation \"supabase_internal_feedback\" does not exist at line 4 column 12");
      const safe = sanitizeApiError(internalDbError, "Something went wrong — please try again.");
      expect(safe).toBe("Something went wrong — please try again.");
      expect(safe).not.toContain("supabase_internal_feedback");
      expect(safe).not.toContain("relation");
    });
  });

  describe("5. Admin Session Hardening & Security Audit Logging", () => {
    it("tracks failed login attempts in 7-day window without storing raw IP", () => {
      expect(getFailedLoginCount7Days()).toBe(0);
      recordFailedLogin("192.168.1.1");
      recordFailedLogin("192.168.1.2");
      expect(getFailedLoginCount7Days()).toBe(2);
    });

    it("generates and verifies HMAC-signed session tokens with 7-day expiration", () => {
      const token = generateSessionToken();
      expect(token).toContain(".");
      expect(verifySessionToken(token)).toBe(true);

      // Tampered token fails
      expect(verifySessionToken(token + "tampered")).toBe(false);

      // Expired token (8 days ago) fails
      const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
      expect(verifySessionToken(`${eightDaysAgo}.invalidsig`)).toBe(false);
    });
  });

  describe("6. Calculator Integrity & Jurisprudence Math Regressions", () => {
    it("Regression 2 — Salary: 150,000 -> Monthly tax Rs 6,000, take-home Rs 144,000", () => {
      const res = calculateSalaryTax(150000, "monthly", "2026-27");
      expect(res.monthlyTax).toBe(6000);
      expect(res.monthlyTakeHome).toBe(144000);
    });

    it("Regression 3 — Zakat: Cash 500,000 -> Zakat Rs 12,500 (Nisab ~248k)", () => {
      const baseInput: ZakatInputs = {
        cashInHand: 500000,
        bankSavings: 0,
        goldUnit: "tola",
        goldQuantity: 0,
        goldRatePerTola: 390684,
        silverUnit: "tola",
        silverQuantity: 0,
        silverRatePerTola: 4722.74,
        businessStock: 0,
        investments: 0,
        debtsToDeduct: 0,
        alreadyPaid: 0,
      };
      const res = calculateZakat(baseInput);
      expect(res.netZakatableWealth).toBe(500000);
      expect(res.zakatDue).toBe(12500);
      expect(res.isZakatDue).toBe(true);
    });

    it("Regression 4 — Ushr: Wheat 1,000 kg @ Rs 130/kg Rain -> Ushr 100 kg, Rs 13,000", () => {
      const res = calculateUshr({
        crop: "wheat",
        quantity: 1000,
        unit: "kg",
        pricePerUnit: 130,
        irrigation: "rain",
      });
      expect(res.ushrKind).toBe(100);
      expect(res.ushrCashValue).toBe(13000);
      expect(res.ratePercentage).toBe("10%");
    });

    it("Regression 5 — Property: Buy, Filer, 10,000,000 -> Rs 125,000 (1.25%)", () => {
      const res = calculatePropertyTax(10000000, "buy", "filer");
      expect(res.taxAmount).toBe(125000);
      expect(res.ratePercentage).toBe("1.25%");
    });

    it("Regression 6 — GST: 100,000, Add GST 18% -> Rs 18,000 / Rs 118,000", () => {
      const res = calculateGst(100000, "add", 18);
      expect(res.gstAmount).toBe(18000);
      expect(res.totalAmount).toBe(118000);
    });

    it("Regression 7 — Fitrana: 5 persons, wheat -> Rs 1,500", () => {
      const res = calculateFitrana(5, "wheat", "muneeb");
      expect(res.totalFitrana).toBe(1500);
      expect(res.perPersonRate).toBe(300);
    });
  });
});
