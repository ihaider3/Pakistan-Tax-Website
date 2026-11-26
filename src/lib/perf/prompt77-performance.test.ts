import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../..");

describe("P77 — Performance Optimization", () => {
  it("logo in /images/ is WebP and ≤ 50 KB", () => {
    const logoWebP = path.join(rootDir, "public/images/CalculationHub_Logo_Full.webp");
    expect(fs.existsSync(logoWebP), "WebP logo must exist").toBe(true);
    const size = fs.statSync(logoWebP).size;
    expect(size, `Logo WebP must be ≤ 50 KB, got ${Math.round(size / 1024)} KB`).toBeLessThanOrEqual(51200);
  });

  it("legacy root oversized PNGs do not exist in public/", () => {
    const legacyLogo = path.join(rootDir, "public/CalculationHub_Logo_Full.png");
    const legacyIcon = path.join(rootDir, "public/CalculationHub_App_Icon.png");
    expect(fs.existsSync(legacyLogo), "Legacy 766 KB root PNG must be removed").toBe(false);
    expect(fs.existsSync(legacyIcon), "Legacy 1 MB root icon PNG must be removed").toBe(false);
  });

  it("Header and Footer use WebP logo", () => {
    const header = fs.readFileSync(path.join(rootDir, "src/components/Header.tsx"), "utf8");
    const footer = fs.readFileSync(path.join(rootDir, "src/components/Footer.tsx"), "utf8");
    expect(header).toContain("CalculationHub_Logo_Full.webp");
    expect(footer).toContain("CalculationHub_Logo_Full.webp");
    // Must NOT reference the unoptimized root-level PNG
    expect(header).not.toMatch(/src=["'][^"']*\/CalculationHub_Logo_Full\.png/);
    expect(footer).not.toMatch(/src=["'][^"']*\/CalculationHub_Logo_Full\.png/);
  });

  it("Zakat rates fetch uses Promise.all (parallel)", () => {
    const liveRates = fs.readFileSync(path.join(rootDir, "src/lib/rates/liveRates.ts"), "utf8");
    expect(liveRates).toContain("Promise.all([");
    expect(liveRates).toContain("GOLD_API_URL");
    expect(liveRates).toContain("SILVER_API_URL");
    expect(liveRates).toContain("CURRENCY_API_URL");
  });

  it("useLiveRates shows bundled/cached rates instantly on page load", () => {
    const hook = fs.readFileSync(path.join(rootDir, "src/lib/rates/useLiveRates.ts"), "utf8");
    // Must initialize from ratesData (bundled) synchronously
    expect(hook).toContain("ratesData");
    expect(hook).toContain("useState");
    // Must check cache before fetching
    expect(hook).toContain("getCachedRates");
  });

  it("Meta Pixel and AdSense are deferred (lazyOnload or interaction-triggered)", () => {
    const layout = fs.readFileSync(path.join(rootDir, "src/app/layout.tsx"), "utf8");
    expect(layout).toContain("1774525983843690"); // Pixel ID present
    expect(layout).toContain("ca-pub-9434774796732008"); // AdSense ID present
    // Must NOT be a blocking synchronous script
    expect(layout).toMatch(/lazyOnload|load3p|async.*true|setTimeout/);
  });

  it("Service worker precaches all 7 calculator pages and uses cache-first for navigation", () => {
    const sw = fs.readFileSync(path.join(rootDir, "public/sw.js"), "utf8");
    const pages = [
      "/salary-tax-calculator",
      "/zakat-calculator",
      "/property-tax-calculator",
      "/gst-calculator",
      "/fitrana-calculator",
      "/ushr-calculator",
      "/",
    ];
    for (const page of pages) {
      expect(sw, `SW must precache ${page}`).toContain(page);
    }
    // Must have stale-while-revalidate or cache-first for navigation
    expect(sw).toContain('navigate');
    expect(sw).toMatch(/cache\.match|cached/);
  });

  it("Service worker never caches admin, api, or ad scripts", () => {
    const sw = fs.readFileSync(path.join(rootDir, "public/sw.js"), "utf8");
    expect(sw).toContain("/admin");
    expect(sw).toContain("/api/");
    expect(sw).toMatch(/bauval\.org|googlesyndication/); // Ad domains are excluded
    expect(sw).toMatch(/return;/); // These must have early returns
  });

  it("next.config.ts preserves all P31 security headers and has correct cache headers", () => {
    const cfg = fs.readFileSync(path.join(rootDir, "next.config.ts"), "utf8");
    expect(cfg).toContain("Strict-Transport-Security");
    expect(cfg).toContain("Content-Security-Policy");
    expect(cfg).toContain("X-Frame-Options");
    expect(cfg).toContain("productionBrowserSourceMaps: false");
    expect(cfg).toContain("max-age=31536000, immutable"); // Static assets long cache
    expect(cfg).toContain("sw.js"); // SW must have no-cache header
    expect(cfg).toContain("max-age=0, must-revalidate"); // SW must not be cached
  });

  it("og-image.png is ≤ 50 KB", () => {
    const ogImg = path.join(rootDir, "public/og-image.png");
    if (fs.existsSync(ogImg)) {
      const size = fs.statSync(ogImg).size;
      expect(size, `og-image.png must be ≤ 50 KB, got ${Math.round(size / 1024)} KB`).toBeLessThanOrEqual(51200);
    }
  });
});
