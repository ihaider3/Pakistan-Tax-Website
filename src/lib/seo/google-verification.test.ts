import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Google Site Verification & SEO Sitemap Suite", () => {
  it("Verify 1: Google verification HTML file exists with exact required content", () => {
    const filePath = path.join(process.cwd(), "public/googleb95bc473fa354448.html");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8").trim();
    expect(content).toBe("google-site-verification: googleb95bc473fa354448.html");
  });

  it("Verify 2: Robots.txt points to calculationhubs.com sitemap and disallows sensitive routes", () => {
    const robotsPath = path.join(process.cwd(), "public/robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);
    const content = fs.readFileSync(robotsPath, "utf-8");
    expect(content).toContain("Sitemap: https://calculationhubs.com/sitemap.xml");
    expect(content).toContain("Disallow: /admin/");
    expect(content).toContain("Disallow: /api/");
  });

  it("Verify 3: Sitemap.xml contains all 11 public pages with https://calculationhubs.com and valid lastmod", () => {
    const sitemapPath = path.join(process.cwd(), "public/sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);
    const sitemap = fs.readFileSync(sitemapPath, "utf-8");

    const requiredUrls = [
      "https://calculationhubs.com/",
      "https://calculationhubs.com/salary-tax-calculator",
      "https://calculationhubs.com/zakat-calculator",
      "https://calculationhubs.com/property-tax-calculator",
      "https://calculationhubs.com/gst-calculator",
      "https://calculationhubs.com/fitrana-calculator",
      "https://calculationhubs.com/ushr-calculator",
      "https://calculationhubs.com/methodology",
      "https://calculationhubs.com/about",
      "https://calculationhubs.com/contact",
      "https://calculationhubs.com/privacy-policy",
      "https://calculationhubs.com/disclaimer",
    ];

    for (const url of requiredUrls) {
      expect(sitemap).toContain(`<loc>${url}</loc>`);
    }

    expect(sitemap).not.toContain("pak-tax-cal.vercel.app");
    expect(sitemap).toContain("<lastmod>2026-11-19</lastmod>");
  });

  it("Verify 4: Layout metadata includes google-site-verification", () => {
    const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
    const layout = fs.readFileSync(layoutPath, "utf-8");
    expect(layout).toContain("googleb95bc473fa354448");
  });
});

