import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import nextConfig from "../../../next.config";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculateGst } from "./gst";
import { calculatePropertyTax } from "./property";
import { TOLA_TO_TROY_OUNCES } from "../rates/liveRates";

describe("Prompt 66 — Performance Optimization & Full Regression Suite", () => {
  it("Test 2: Logo WebP file exists and is <= 50 KB; PNG fallbacks <= 80 KB", () => {
    const webpPath = path.join(process.cwd(), "public/images/CalculationHub_Logo_Full.webp");
    const pngPath = path.join(process.cwd(), "public/images/CalculationHub_Logo_Full.png");
    const ogPath = path.join(process.cwd(), "public/images/og-share-1200x630.png");
    const appIconWebpPath = path.join(process.cwd(), "public/images/CalculationHub_App_Icon.webp");

    expect(fs.existsSync(webpPath)).toBe(true);
    expect(fs.statSync(webpPath).size).toBeLessThanOrEqual(50 * 1024);
    expect(fs.statSync(pngPath).size).toBeLessThanOrEqual(80 * 1024);
    expect(fs.statSync(ogPath).size).toBeLessThanOrEqual(80 * 1024);
    expect(fs.statSync(appIconWebpPath).size).toBeLessThanOrEqual(50 * 1024);
  });

  it("Fix 1 references: Header, Footer, PrintReport, Homepage JSON-LD, site config, and sw.js use optimized WebP logo", () => {
    const files = [
      "src/components/Header.tsx",
      "src/components/Footer.tsx",
      "src/components/PrintReport.tsx",
      "src/app/page.tsx",
      "src/config/site.ts",
      "public/sw.js",
    ];
    for (const rel of files) {
      const content = fs.readFileSync(path.join(process.cwd(), rel), "utf-8");
      expect(content).toContain("/images/CalculationHub_Logo_Full.webp");
      expect(content).not.toContain("/images/CalculationHub_Logo_Full.png");
    }
  });

  it("Fix 2: Footer does not bundle calculatorPages; FeedbackModal and PwaBanners are code-split; AdSense & Pixel are lazyOnload", () => {
    const footer = fs.readFileSync(path.join(process.cwd(), "src/components/Footer.tsx"), "utf-8");
    expect(footer).not.toContain("@/content/pages");

    const feedbackBtn = fs.readFileSync(path.join(process.cwd(), "src/components/FloatingFeedbackButton.tsx"), "utf-8");
    expect(feedbackBtn).toContain("dynamic(() => import(\"./FeedbackModal\")");

    const pwa = fs.readFileSync(path.join(process.cwd(), "src/components/PwaInstallPrompt.tsx"), "utf-8");
    expect(pwa).toContain("dynamic(() => import(\"./PwaBanners\")");

    const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf-8");
    expect(layout).toContain('strategy="lazyOnload"');
    expect(layout).toContain("ca-pub-9434774796732008");
    expect(layout).toContain("fbq('init', '1774525983843690')");
    expect(layout).toContain("display: \"swap\"");
  });

  it("Fix 3: Zakat live rates fetch XAU, XAG, and USD in parallel and preserve exact tola formula", () => {
    const liveRates = fs.readFileSync(path.join(process.cwd(), "src/lib/rates/liveRates.ts"), "utf-8");
    expect(liveRates).toContain("Promise.all([");
    expect(TOLA_TO_TROY_OUNCES).toBe(0.374878);
  });

  it("Fix 4 & 5: next.config.ts enables inlineCss (no render-blocking external CSS) and immutable Cache-Control for /images/ and /_next/static/", async () => {
    expect(nextConfig.experimental?.inlineCss).toBe(true);
    const headersFn = nextConfig.headers;
    expect(headersFn).toBeDefined();
    const rules = await headersFn!();
    const imgRule = rules.find((r) => r.source === "/images/:path*");
    const staticRule = rules.find((r) => r.source === "/_next/static/:path*");
    expect(imgRule?.headers.find((h) => h.key === "Cache-Control")?.value).toContain("max-age=31536000, immutable");
    expect(staticRule?.headers.find((h) => h.key === "Cache-Control")?.value).toContain("max-age=31536000, immutable");
  });

  it("Test 4: Salary trap — monthly salary 123,456 -> tax Rs 3,080.16/month", () => {
    const res = calculateSalaryTax(123456, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(3080.16);
  });

  it("Test 5: Zakat trap — cash 777,777 -> Zakat Rs 19,444.43", () => {
    const res = calculateZakat({
      cashInHand: 777777,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 378524,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 4257,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(19444.43);
  });

  it("Test 6: GST trap — 100,000 inclusive Remove mode -> Base Rs 84,745.76, GST Rs 15,254.24", () => {
    const res = calculateGst(100000, "remove", 18);
    expect(res.baseAmount).toBe(84745.76);
    expect(res.gstAmount).toBe(15254.24);
  });

  it("Test 7: Property trap — buy filer Rs 10,000,000 -> buyer tax Rs 125,000", () => {
    const res = calculatePropertyTax(10000000, "buy", "filer");
    expect(res.taxAmount).toBe(125000);
  });
});
