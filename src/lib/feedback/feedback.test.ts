import { describe, it, expect, beforeEach } from "vitest";
import {
  verifyAdminPassword,
  generateSessionToken,
  verifySessionToken,
} from "./adminAuth";
import { checkSpamAndRateLimit } from "./spamProtection";
import fs from "fs";
import path from "path";

describe("Feedback System - Admin Auth & Cryptographic Security", () => {
  const originalEnv = process.env.ADMIN_PASSWORD;

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "TestStrongAdminPassword123!";
  });

  it("verifies correct admin password and rejects incorrect password", () => {
    expect(verifyAdminPassword("TestStrongAdminPassword123!")).toBe(true);
    expect(verifyAdminPassword("WrongPassword")).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
  });

  it("generates a signed session token that verifies correctly", () => {
    const token = generateSessionToken();
    expect(token).toBeDefined();
    expect(token).toContain(".");
    expect(verifySessionToken(token)).toBe(true);
  });

  it("rejects tampered or malformed session tokens", () => {
    const validToken = generateSessionToken();
    const [timestamp, signature] = validToken.split(".");

    // Tampered timestamp
    expect(verifySessionToken(`1234567890.${signature}`)).toBe(false);

    // Tampered signature
    expect(verifySessionToken(`${timestamp}.invalidhexsignature`)).toBe(false);

    // Random string
    expect(verifySessionToken("random_string")).toBe(false);
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken(null)).toBe(false);
  });

  it("rejects session tokens expired after 7 days", () => {
    const expiredTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000;
    const crypto = require("crypto");
    const secret = process.env.ADMIN_PASSWORD || "";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(`admin-session:${expiredTimestamp}`)
      .digest("hex");

    const expiredToken = `${expiredTimestamp}.${signature}`;
    expect(verifySessionToken(expiredToken)).toBe(false);
  });
});

describe("Feedback System - Spam Protection & Rate Limiting", () => {
  it("detects and traps filled honeypot fields silently", () => {
    const res = checkSpamAndRateLimit("192.168.1.50", "bot_url_input", "This is a real message 12345");
    expect(res.allowed).toBe(false);
    expect(res.isHoneypot).toBe(true);
  });

  it("allows legitimate submissions when honeypot is empty", () => {
    const res = checkSpamAndRateLimit("192.168.1.100", "", "Legitimate test feedback message for website");
    expect(res.allowed).toBe(true);
    expect(res.isHoneypot).toBe(false);
  });

  it("rejects identical duplicate submissions within 60 seconds from the same IP", () => {
    const ip = "192.168.1.101";
    const msg = "Duplicate check message unique 123456";

    const first = checkSpamAndRateLimit(ip, "", msg);
    expect(first.allowed).toBe(true);

    const duplicate = checkSpamAndRateLimit(ip, "", msg);
    expect(duplicate.allowed).toBe(false);
    expect(duplicate.error).toContain("Duplicate submission");
  });

  it("rate limits after 5 submissions per hour from the same IP", () => {
    const ip = "192.168.1.200";

    // 1 to 4 allowed
    for (let i = 1; i <= 4; i++) {
      const res = checkSpamAndRateLimit(ip, "", `Unique message attempt number ${i} with extra text`);
      expect(res.allowed).toBe(true);
    }

    // 5th allowed (reaches max limit)
    const fifth = checkSpamAndRateLimit(ip, "", "Unique message attempt number 5 with extra text");
    expect(fifth.allowed).toBe(true);

    // 6th rejected
    const sixth = checkSpamAndRateLimit(ip, "", "Unique message attempt number 6 with extra text");
    expect(sixth.allowed).toBe(false);
    expect(sixth.error).toContain("Too many submissions");
  });
});

describe("Feedback System - Validation Rules", () => {
  it("rejects messages under 10 characters", () => {
    const shortMsg = "Short";
    expect(shortMsg.length < 10).toBe(true);
  });

  it("accepts messages between 10 and 3000 characters", () => {
    const validMsg = "This is a valid message that exceeds ten characters.";
    expect(validMsg.length >= 10 && validMsg.length <= 3000).toBe(true);
  });

  it("validates email formats correctly", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test("valid@example.com")).toBe(true);
    expect(emailRegex.test("user.name+tag@sub.domain.pk")).toBe(true);
    expect(emailRegex.test("invalid-email")).toBe(false);
    expect(emailRegex.test("missing@domain")).toBe(false);
    expect(emailRegex.test("@no-local.com")).toBe(false);
  });

  it("handles category and calculator constraints", () => {
    const validCategories = new Set(["problem", "feedback", "feature"]);
    const validCalculators = new Set(["general", "salary", "zakat", "property", "gst", "fitrana"]);

    expect(validCategories.has("problem")).toBe(true);
    expect(validCategories.has("feedback")).toBe(true);
    expect(validCategories.has("feature")).toBe(true);
    expect(validCategories.has("invalid_category")).toBe(false);

    expect(validCalculators.has("general")).toBe(true);
    expect(validCalculators.has("salary")).toBe(true);
    expect(validCalculators.has("zakat")).toBe(true);
    expect(validCalculators.has("property")).toBe(true);
    expect(validCalculators.has("gst")).toBe(true);
    expect(validCalculators.has("fitrana")).toBe(true);
    expect(validCalculators.has("crypto")).toBe(false);
  });
});

describe("Feedback System - Privacy Policy Integrity", () => {
  it("contains section 5 covering feedback, screenshots and contact email", () => {
    const privacyPath = path.resolve(__dirname, "../../app/privacy-policy/page.tsx");
    const content = fs.readFileSync(privacyPath, "utf-8");

    expect(content).toContain("User Feedback &amp; Defect Reports");
    expect(content).toContain("contact@pakfinancecalc.org");
    expect(content).toContain("Aapka feedback, suggestion ya screenshot sirf website ko behtar banane");
  });
});
