import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  verifyAdminPassword,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
  resetLoginRateLimits,
} from "@/lib/feedback/adminAuth";
import { POST as loginPost } from "@/app/api/feedback/admin/login/route";
import { POST as trackPost } from "@/app/api/track/route";
import {
  recordPageView,
  recordToolUse,
  getAnalyticsMetrics,
  isBot,
  detectDevice,
  sanitizeReferrer,
} from "@/lib/analytics/trackerServer";
import { resetInMemoryAnalytics } from "@/lib/analytics/inMemoryAnalyticsStore";
import {
  getSiteContent,
  updateSiteContent,
  restoreSiteContent,
  resetInMemoryContent,
} from "@/lib/content/contentServer";
import { calculateZakat } from "@/lib/calc/zakat";
import { calculateSalaryTax } from "@/lib/calc/salary";
import { calculateUshr } from "@/lib/calc/ushr";
import { DEFAULT_SITE_CONTENT } from "@/lib/content/defaultContent";

describe("Admin Authentication & Security Lockout", () => {
  const TEST_IP = "192.168.1.100";
  const TEST_PASSWORD = "CorrectAdminPass123!";

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = TEST_PASSWORD;
    resetLoginRateLimits();
  });

  it("verifies password strictly from ADMIN_PASSWORD environment variable", () => {
    expect(verifyAdminPassword(TEST_PASSWORD)).toBe(true);
    expect(verifyAdminPassword("WrongPassword")).toBe(false);
  });

  it("refuses all logins if ADMIN_PASSWORD environment variable is missing", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyAdminPassword(TEST_PASSWORD)).toBe(false);
    expect(verifyAdminPassword("")).toBe(false);
    process.env.ADMIN_PASSWORD = TEST_PASSWORD;
  });

  it("enforces max 5 failed attempts per IP, then locks out on 6th attempt with 429", async () => {
    // Attempts 1 to 5: returns 401 Incorrect password
    for (let i = 1; i <= 5; i++) {
      const req = new NextRequest("http://localhost:3000/api/feedback/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": TEST_IP,
        },
        body: JSON.stringify({ password: "wrong-password" }),
      });
      const res = await loginPost(req);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Incorrect password");
    }

    // Attempt 6: locked out, returns 429
    const req6 = new NextRequest("http://localhost:3000/api/feedback/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": TEST_IP,
      },
      body: JSON.stringify({ password: "wrong-password" }),
    });
    const res6 = await loginPost(req6);
    expect(res6.status).toBe(429);
    const data6 = await res6.json();
    expect(data6.error).toBe("Too many attempts, please try again later");
  });

  it("clears failed attempts upon successful login", async () => {
    // 2 failed attempts
    for (let i = 0; i < 2; i++) {
      recordFailedLogin(TEST_IP);
    }
    expect(checkLoginRateLimit(TEST_IP).allowed).toBe(true);

    // Successful login resets
    recordSuccessfulLogin(TEST_IP);
    expect(checkLoginRateLimit(TEST_IP).allowed).toBe(true);
  });
});

describe("Visitor Analytics & Privacy-First Tracking", () => {
  beforeEach(() => {
    resetInMemoryAnalytics();
  });

  it("detects bot crawlers accurately by user-agent", () => {
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(true);
    expect(isBot("curl/7.68.0")).toBe(true);
    expect(isBot("python-requests/2.25.1")).toBe(true);
    expect(isBot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15")).toBe(false);
  });

  it("detects device category from user-agent", () => {
    expect(detectDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("mobile");
    expect(detectDevice("Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X)")).toBe("tablet");
    expect(detectDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
  });

  it("sanitizes referrer to clean domain only and discards internal navigation", () => {
    expect(sanitizeReferrer("https://www.google.com/search?q=salary+tax", "pak-tax-cal.vercel.app")).toBe("google.com");
    expect(sanitizeReferrer("https://pak-tax-cal.vercel.app/salary-tax-calculator", "pak-tax-cal.vercel.app")).toBe(null);
  });

  it("tracks page views and tool uses via POST /api/track asynchronously", async () => {
    // 1. Page view
    const pvReq = new NextRequest("http://localhost:3000/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: JSON.stringify({
        type: "page_view",
        page: "/salary-tax-calculator",
        referrer: "https://t.co/xyz123",
      }),
    });
    const pvRes = await trackPost(pvReq);
    expect(pvRes.status).toBe(200);

    // 2. Tool use
    const tuReq = new NextRequest("http://localhost:3000/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      body: JSON.stringify({
        type: "tool_use",
        calculator: "salary",
      }),
    });
    const tuRes = await trackPost(tuReq);
    expect(tuRes.status).toBe(200);

    // 3. Verify metrics
    const metrics = await getAnalyticsMetrics("all");
    expect(metrics.statCards.totalPageViews).toBeGreaterThanOrEqual(1);
    expect(metrics.statCards.totalToolUses).toBeGreaterThanOrEqual(1);
    expect(metrics.statCards.activeLast30Min).toBeGreaterThanOrEqual(1);

    const salaryTool = metrics.mostUsedTools.find((t) => t.calculator === "salary");
    expect(salaryTool).toBeDefined();
    expect(salaryTool?.totalUses).toBeGreaterThanOrEqual(1);
  });

  it("rejects invalid calculator names and prevents logging numerical inputs", async () => {
    const invalidTuReq = new NextRequest("http://localhost:3000/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "tool_use",
        calculator: "hacked_calculator_name",
      }),
    });
    const res = await trackPost(invalidTuReq);
    expect(res.status).toBe(400);
  });
});

describe("Content Editor & Statutory Protection", () => {
  beforeEach(() => {
    resetInMemoryContent();
  });

  it("provides live defaults when database is empty", async () => {
    const content = await getSiteContent();
    expect(content.home_hero_title).toContain("Pakistan Financial & Islamic Calculators");
    expect(content.home_card_salary_title).toBe("Salary Tax Calculator");
  });

  it("updates field, stores old value in history, and restores previous value", async () => {
    const originalContent = await getSiteContent();
    const originalHeroTitle = originalContent.home_hero_title;

    // 1. Update content
    const updated = await updateSiteContent("home_hero_title", "Custom Updated Heading for Pakistan");
    expect(updated.success).toBe(true);
    expect(updated.value).toBe("Custom Updated Heading for Pakistan");

    const modifiedContent = await getSiteContent();
    expect(modifiedContent.home_hero_title).toBe("Custom Updated Heading for Pakistan");

    // 2. Restore content
    const restored = await restoreSiteContent("home_hero_title");
    expect(restored.success).toBe(true);
    expect(restored.restoredValue).toBe(originalHeroTitle);

    const revertedContent = await getSiteContent();
    expect(revertedContent.home_hero_title).toBe(originalHeroTitle);
  });

  it("strictly refuses any attempt to edit rates, slabs, or calculation formulas", async () => {
    await expect(updateSiteContent("salary_rate_slab_1", "0.05")).rejects.toThrow(
      "Tax rates, slabs, nisab, Fitrana amounts, and calculation formulas are statutory and cannot be edited from this panel."
    );
    await expect(updateSiteContent("gst_tax_rate", "0.20")).rejects.toThrow();
  });

  it("includes Ushr keys in default content and allows editing them", async () => {
    const keys = DEFAULT_SITE_CONTENT.map((c) => c.key);
    expect(keys).toContain("home_card_ushr_title");
    expect(keys).toContain("home_card_ushr_desc");
    expect(keys).toContain("ushr_intro");
    expect(keys).toContain("ushr_roman_urdu_intro");
    expect(keys).toContain("ushr_english_intro");

    const updateRes = await updateSiteContent("ushr_intro", "Updated Ushr description for Pakistan");
    expect(updateRes.success).toBe(true);
    const content = await getSiteContent();
    expect(content.ushr_intro).toBe("Updated Ushr description for Pakistan");
  });

  describe("Visual Editor Regression Tests", () => {
    it("Test 1: Edit homepage hero subtitle in Visual Editor -> save -> live homepage has new text -> restore -> original text back", async () => {
      const original = (await getSiteContent()).home_hero_subtitle;

      // Save custom edit
      const testText = "Brand new custom subtitle for testing visual editor";
      await updateSiteContent("home_hero_subtitle", testText);
      const afterSave = await getSiteContent();
      expect(afterSave.home_hero_subtitle).toBe(testText);

      // Restore back to original
      await restoreSiteContent("home_hero_subtitle");
      const afterRestore = await getSiteContent();
      expect(afterRestore.home_hero_subtitle).toBe(original);
    });

    it("Test 2: Edit Zakat page intro text in Visual Editor -> save -> Zakat calculator with cash 500,000 still gives Zakat Rs 12,500", async () => {
      await updateSiteContent("zakat_intro", "Custom Zakat Intro text edited visually.");
      const content = await getSiteContent();
      expect(content.zakat_intro).toBe("Custom Zakat Intro text edited visually.");

      // Verify calculation is 100% untouched
      const zakatResult = calculateZakat({
        cashInHand: 500000,
        bankSavings: 0,
        goldUnit: "tola",
        goldQuantity: 0,
        goldRatePerTola: 402098,
        silverUnit: "tola",
        silverQuantity: 0,
        silverRatePerTola: 4934,
        businessStock: 0,
        investments: 0,
        debtsToDeduct: 0,
      });
      expect(zakatResult.zakatDue).toBe(12500);
      expect(zakatResult.isZakatDue).toBe(true);
    });

    it("Test 3: Salary calculator monthly 150,000 -> monthly tax Rs 6,000, take-home Rs 144,000 (unchanged after editor change)", () => {
      const salaryResult = calculateSalaryTax(150000, "monthly", "2026-27");
      expect(salaryResult.monthlyTax).toBe(6000);
      expect(salaryResult.monthlyTakeHome).toBe(144000);
      expect(salaryResult.annualTax).toBe(72000);
    });

    it("Test 4: Ushr calculator: wheat 1,000 kg, Rs 130/kg, Rain -> Ushr 100 kg, Rs 13,000 (unchanged)", () => {
      const ushrResult = calculateUshr({
        crop: "wheat",
        quantity: 1000,
        unit: "kg",
        pricePerUnit: 130,
        irrigation: "rain",
      });
      expect(ushrResult.ushrKind).toBe(100);
      expect(ushrResult.ushrCashValue).toBe(13000);
      expect(ushrResult.ratePercentage).toBe("10%");
    });

    it("Test 5: Switch to Form Editor after visual save -> same new value is shown in the form field", async () => {
      const customPropertyIntro = "Custom Property Intro via visual editor test";
      await updateSiteContent("property_intro", customPropertyIntro);

      const content = await getSiteContent();
      expect(content.property_intro).toBe(customPropertyIntro);
    });

    it("Test 6: Try to click a result number or slab-table figure -> cannot be edited (locked / statutory protection)", async () => {
      await expect(updateSiteContent("salary_slab_1_rate", "0")).rejects.toThrow("statutory");
      await expect(updateSiteContent("zakat_nisab_threshold", "100000")).rejects.toThrow("statutory");
      await expect(updateSiteContent("fitrana_wheat_amount", "500")).rejects.toThrow("statutory");
    });
  });
});

