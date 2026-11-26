import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "../../..");

function readRepoFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

function collectSourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, out);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
      out.push(fullPath);
    }
  }
  return out;
}

describe("P76 Adsterra Non-Disturbing Ads Integration", () => {
  it("contains exact Adsterra Native Banner and Banner keys, dimensions, and URLs", () => {
    const slotSrc = readRepoFile("src/components/AdsterraSlot.tsx");

    // Native Banner (Code 1)
    expect(slotSrc).toContain("https://bauval.org/21/5d4ed0569885a33269e9601cab147930");
    expect(slotSrc).toContain("container-5d4ed0569885a33269e9601cab147930");
    expect(slotSrc).toContain('"fetchpriority", "high"');
    expect(slotSrc).toContain('"data-cfasync", "false"');

    // Banner 300x250 (Code 2)
    expect(slotSrc).toContain("f393f59b0c10cb05bb3226c68f168846");
    expect(slotSrc).toContain("https://bauval.org/22/f393f59b0c10cb05bb3226c68f168846");
    expect(slotSrc).toContain("width: 300");
    expect(slotSrc).toContain("height: 250");

    // Banner 320x50 (Code 3)
    expect(slotSrc).toContain("620b5f0268b5c21a77970539a202207f");
    expect(slotSrc).toContain("https://bauval.org/22/620b5f0268b5c21a77970539a202207f");
    expect(slotSrc).toContain("width: 320");
    expect(slotSrc).toContain("height: 50");

    // Banner 728x90 (Code 4)
    expect(slotSrc).toContain("dff9fe1922f15c33d5446fa743063649");
    expect(slotSrc).toContain("https://bauval.org/22/dff9fe1922f15c33d5446fa743063649");
    expect(slotSrc).toContain("width: 728");
    expect(slotSrc).toContain("height: 90");

    // Explicit "Advertisement" label and non-sticky/in-flow behavior
    expect(slotSrc).toContain("Advertisement");
    expect(slotSrc).not.toMatch(/\bfixed\b|\bsticky\b/);
    expect(slotSrc).toContain("bannerLoadQueue");
  });

  it("never installs Social Bar, Popunder, or Smartlink anywhere in src/", () => {
    const srcFiles = collectSourceFiles(path.join(rootDir, "src"));
    const forbiddenPattern =
      /social[-_\s]?bar|popunder|smartlink|effectivegatecpm|highperformanceformat|d301|invoke\.js/i;

    for (const file of srcFiles) {
      const content = fs.readFileSync(file, "utf8");
      expect(content, `Prohibited ad pattern found in ${file}`).not.toMatch(forbiddenPattern);
    }
  });

  it("places homepage slots in non-disturbing in-flow order", () => {
    const homeSrc = readRepoFile("src/app/page.tsx");
    const heroCardsIdx = homeSrc.indexOf("THE 6 CALCULATOR CARDS");
    const leaderboardIdx = homeSrc.indexOf('<AdsterraBanner variant="leaderboard-desktop"');
    const mobileStripIdx = homeSrc.indexOf('<AdsterraBanner variant="mobile-strip"');
    const howItWorksIdx = homeSrc.indexOf("HOW IT WORKS");
    const faqIdx = homeSrc.indexOf("<HomeFaqAccordion");
    const nativeIdx = homeSrc.indexOf("<AdsterraNativeBanner");

    expect(leaderboardIdx).toBeGreaterThan(-1);
    expect(mobileStripIdx).toBeGreaterThan(-1);
    expect(nativeIdx).toBeGreaterThan(-1);

    expect(leaderboardIdx).toBeLessThan(heroCardsIdx);
    expect(heroCardsIdx).toBeLessThan(mobileStripIdx);
    expect(mobileStripIdx).toBeLessThan(howItWorksIdx);
    expect(faqIdx).toBeLessThan(nativeIdx);
  });

  it("places tool page slots only after calculator/breakdown and after FAQs inside CalculatorShell", () => {
    const shellSrc = readRepoFile("src/components/CalculatorShell.tsx");
    const calcBoxIdx = shellSrc.indexOf('id="calculator"');
    const breakdownIdx = shellSrc.indexOf("{breakdownTable && (");
    const rectBannerIdx = shellSrc.indexOf('<AdsterraBanner variant="rectangle-desktop"');
    const mobileBannerIdx = shellSrc.indexOf('<AdsterraBanner variant="mobile-strip"');
    const guideIdx = shellSrc.indexOf("GUIDE / HOW TO USE");
    const disclaimerIdx = shellSrc.indexOf("{content.disclaimer}");
    const nativeIdx = shellSrc.indexOf("<AdsterraNativeBanner");

    expect(rectBannerIdx).toBeGreaterThan(-1);
    expect(mobileBannerIdx).toBeGreaterThan(-1);
    expect(nativeIdx).toBeGreaterThan(-1);

    expect(calcBoxIdx).toBeLessThan(breakdownIdx);
    expect(breakdownIdx).toBeLessThan(rectBannerIdx);
    expect(rectBannerIdx).toBeLessThan(guideIdx);
    expect(mobileBannerIdx).toBeLessThan(guideIdx);
    expect(disclaimerIdx).toBeLessThan(nativeIdx);
  });

  it("places ONLY Native Banner on the 5 info pages and zero ads on admin/offline", () => {
    const infoFiles = [
      "src/app/about/page.tsx",
      "src/app/methodology/MethodologyClient.tsx",
      "src/app/privacy-policy/page.tsx",
      "src/app/disclaimer/page.tsx",
      "src/app/contact/page.tsx",
    ];

    for (const file of infoFiles) {
      const content = readRepoFile(file);
      expect(content, `${file} should render AdsterraNativeBanner`).toContain("<AdsterraNativeBanner");
      expect(content, `${file} must NOT render AdsterraBanner`).not.toContain("AdsterraBanner");
    }

    const adminFiles = collectSourceFiles(path.join(rootDir, "src/app/admin"));
    for (const file of adminFiles) {
      expect(fs.readFileSync(file, "utf8")).not.toContain("Adsterra");
    }
    const offlineSrc = readRepoFile("src/app/offline/page.tsx");
    expect(offlineSrc).not.toContain("Adsterra");
  });

  it("retains P31 security headers and allows Adsterra domains in next.config.ts", () => {
    const nextConfig = readRepoFile("next.config.ts");
    expect(nextConfig).toContain("Strict-Transport-Security");
    expect(nextConfig).toContain("Content-Security-Policy");
    expect(nextConfig).toContain("X-Frame-Options");
    expect(nextConfig).toContain("X-Content-Type-Options");
    expect(nextConfig).toContain("Referrer-Policy");
    expect(nextConfig).toContain("Permissions-Policy");
    expect(nextConfig).toContain("frame-ancestors 'self'");
    expect(nextConfig).toContain("object-src 'none'");
    expect(nextConfig).toContain("base-uri 'self'");
    expect(nextConfig).toContain("form-action 'self'");
    expect(nextConfig).toContain("https://bauval.org");
    expect(nextConfig).toContain("https://cdn.cloudvideosa.com");
    expect(nextConfig).toContain("productionBrowserSourceMaps: false");
  });
});
