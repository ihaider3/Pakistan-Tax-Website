import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import manifest from "@/app/manifest";
import { siteName, siteShortName, siteDescription, themeColor, backgroundColor } from "@/config/site";
import { calculateSalaryTax } from "@/lib/calc/salary";
import { calculateZakat } from "@/lib/calc/zakat";
import { calculateUshr } from "@/lib/calc/ushr";
import { calculatePropertyTax } from "@/lib/calc/property";
import { calculateGst } from "@/lib/calc/gst";
import { calculateFitrana } from "@/lib/calc/fitrana";

describe("Web App Manifest Validation", () => {
  const m = manifest();

  it("reads app name and short name from central site config", () => {
    expect(m.name).toBe(siteName);
    expect(m.name).toBe("Pakistan Finance Calculators");
    expect(m.short_name).toBe(siteShortName);
    expect(m.short_name).toBe("Finance Calc");
    expect(m.short_name.length).toBeLessThanOrEqual(12);
  });

  it("has exact required standalone display and brand theme colors", () => {
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/");
    expect(m.scope).toBe("/");
    expect(m.theme_color).toBe(themeColor);
    expect(m.theme_color).toBe("#0B2A4A");
    expect(m.background_color).toBe(backgroundColor);
    expect(m.background_color).toBe("#0B2A4A");
    expect(m.lang).toBe("en");
    expect(m.categories).toContain("finance");
    expect(m.categories).toContain("utilities");
  });

  it("includes all 4 required icons (192, 512, 512-maskable, 180 apple)", () => {
    const icons = m.icons || [];
    expect(icons.length).toBeGreaterThanOrEqual(4);

    const icon192 = icons.find((i) => i.sizes === "192x192");
    expect(icon192).toBeDefined();
    expect(icon192?.src).toBe("/icon-192x192.png");

    const icon512 = icons.find((i) => i.sizes === "512x512" && i.purpose !== "maskable");
    expect(icon512).toBeDefined();
    expect(icon512?.src).toBe("/icon-512x512.png");

    const iconMaskable = icons.find((i) => i.purpose === "maskable");
    expect(iconMaskable).toBeDefined();
    expect(iconMaskable?.src).toBe("/icon-512x512-maskable.png");
    expect(iconMaskable?.sizes).toBe("512x512");

    const appleIcon = icons.find((i) => i.sizes === "180x180" || i.src.includes("apple"));
    expect(appleIcon).toBeDefined();
  });

  it("verifies static manifest.json matches manifest.ts", () => {
    const manifestJsonPath = path.join(process.cwd(), "public", "manifest.json");
    expect(fs.existsSync(manifestJsonPath)).toBe(true);

    const jsonContent = JSON.parse(fs.readFileSync(manifestJsonPath, "utf-8"));
    expect(jsonContent.name).toBe("Pakistan Finance Calculators");
    expect(jsonContent.short_name).toBe("Finance Calc");
    expect(jsonContent.display).toBe("standalone");
    expect(jsonContent.background_color).toBe("#0B2A4A");
    expect(jsonContent.theme_color).toBe("#0B2A4A");
  });
});

describe("Service Worker & Offline Fallback Integrity", () => {
  const swPath = path.join(process.cwd(), "public", "sw.js");

  it("verifies service worker file exists in public directory", () => {
    expect(fs.existsSync(swPath)).toBe(true);
  });

  it("strictly enforces never-cache security rule for /admin and /api/*", () => {
    const swCode = fs.readFileSync(swPath, "utf-8");
    expect(swCode).toContain('url.pathname.startsWith("/admin")');
    expect(swCode).toContain('url.pathname.startsWith("/api/")');
  });

  it("verifies network-first strategy for rates.json and HTML navigations", () => {
    const swCode = fs.readFileSync(swPath, "utf-8");
    expect(swCode).toContain('url.pathname.includes("rates.json")');
    expect(swCode).toContain('req.mode === "navigate"');
    expect(swCode).toContain('caches.match("/offline")');
  });

  it("verifies precache includes all core pages and offline page", () => {
    const swCode = fs.readFileSync(swPath, "utf-8");
    expect(swCode).toContain('"/salary-tax-calculator"');
    expect(swCode).toContain('"/zakat-calculator"');
    expect(swCode).toContain('"/property-tax-calculator"');
    expect(swCode).toContain('"/gst-calculator"');
    expect(swCode).toContain('"/fitrana-calculator"');
    expect(swCode).toContain('"/ushr-calculator"');
    expect(swCode).toContain('"/offline"');
  });
});

describe("PWA Prompt 19 — 6 Core Calculator Regression Tests", () => {
  it("Regression 1: Salary monthly 150,000 -> monthly tax Rs 6,000, take-home Rs 144,000", () => {
    const result = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(result.monthlyTax).toBe(6000);
    expect(result.monthlyTakeHome).toBe(144000);
    expect(result.annualTax).toBe(72000);
  });

  it("Regression 2: Zakat cash 500,000 -> Zakat Rs 12,500 (online)", () => {
    const result = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 402009.88,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4920.48,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
    });
    expect(result.zakatDue).toBe(12500);
    expect(result.isZakatDue).toBe(true);
  });

  it("Regression 3: Ushr wheat 1,000 kg, Rs 130/kg, Rain -> Ushr 100 kg, Rs 13,000", () => {
    const result = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });
    expect(result.ushrKind).toBe(100);
    expect(result.ushrCashValue).toBe(13000);
    expect(result.ratePercentage).toBe("10%");
  });

  it("Regression 4: Property Buy, Filer, 10,000,000 -> Rs 125,000 (Section 236K at 1.25%)", () => {
    const result = calculatePropertyTax(10000000, "buy", "filer");
    expect(result.rate).toBe(0.0125);
    expect(result.taxAmount).toBe(125000);
    expect(result.sectionCode).toBe("236K");
  });

  it("Regression 5: GST 100,000, Add GST 18% -> Rs 18,000 / Rs 118,000", () => {
    const result = calculateGst(100000, "add", 18);
    expect(result.gstAmount).toBe(18000);
    expect(result.totalAmount).toBe(118000);
  });

  it("Regression 6: Fitrana 5 persons, wheat -> Rs 1,500 (at Rs 300/person)", () => {
    const result = calculateFitrana(5, "wheat", "muneeb");
    expect(result.totalFitrana).toBe(1500);
    expect(result.perPersonRate).toBe(300);
  });
});
