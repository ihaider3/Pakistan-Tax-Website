import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { calculateSalaryTax } from "./salary";
import { calculateZakat } from "./zakat";
import { calculateUshr } from "./ushr";

describe("Prompt 36 — Sticky Glass Navbar & Regression Suite", () => {
  const headerPath = path.join(process.cwd(), "src/components/Header.tsx");
  const headerContent = fs.readFileSync(headerPath, "utf-8");

  const feedbackModalPath = path.join(process.cwd(), "src/components/FeedbackModal.tsx");
  const feedbackModalContent = fs.readFileSync(feedbackModalPath, "utf-8");

  const globalsCssPath = path.join(process.cwd(), "src/app/globals.css");
  const globalsCssContent = fs.readFileSync(globalsCssPath, "utf-8");

  const calcShellPath = path.join(process.cwd(), "src/components/CalculatorShell.tsx");
  const calcShellContent = fs.readFileSync(calcShellPath, "utf-8");

  it("Fix 1: Main navbar is sticky with glass effect, backdrop-blur, and z-40", () => {
    expect(headerContent).toMatch(/<header[^>]*sticky top-0 z-40/);
    expect(headerContent).toContain("backdrop-blur-md");
    expect(headerContent).toContain("bg-white/80");
    expect(headerContent).toContain("border-b");
  });

  it("Fix 2: Top announcement bar is NOT sticky and sits outside <header> so it scrolls off with the page", () => {
    const announcementIndex = headerContent.indexOf("100% Client-Side Privacy");
    const headerStickyIndex = headerContent.indexOf("<header");
    expect(announcementIndex).toBeGreaterThan(-1);
    expect(headerStickyIndex).toBeGreaterThan(announcementIndex);

    // Announcement bar itself has no sticky class
    const announcementSnippet = headerContent.substring(announcementIndex - 200, announcementIndex);
    expect(announcementSnippet).not.toContain("sticky");
  });

  it("Fix 3: Mobile navbar has compact logo and functional mobile menu", () => {
    expect(headerContent).toContain("h-8 sm:h-9 md:h-12");
    expect(headerContent).toContain("setMobileMenuOpen(!mobileMenuOpen)");
    expect(headerContent).toContain("setMobileMenuOpen(false)");
  });

  it("Fix 4: Anchor jumps have scroll margin / padding offset for sticky navbar", () => {
    expect(globalsCssContent).toContain("scroll-padding-top: 5rem;");
    expect(globalsCssContent).toContain("scroll-padding-top: 6rem;");
    expect(calcShellContent).toContain("scroll-mt-20 sm:scroll-mt-24");
  });

  it("Modal stacking: FeedbackModal z-index is higher than navbar z-40", () => {
    expect(feedbackModalContent).toContain("z-[60]");
  });

  it("Test 6: Salary calculation regression — Rs 150,000 monthly -> monthly tax Rs 6,000, take-home Rs 144,000", () => {
    const res = calculateSalaryTax(150000, "monthly", "2026-27");
    expect(res.monthlyTax).toBe(6000);
    expect(res.annualTax).toBe(72000);
    expect(res.monthlyTakeHome).toBe(144000);
  });

  it("Test 7: Zakat calculation regression — Cash Rs 500,000 -> Rs 12,500", () => {
    const res = calculateZakat({
      cashInHand: 500000,
      bankSavings: 0,
      goldUnit: "tola",
      goldQuantity: 0,
      goldRatePerTola: 400000,
      silverUnit: "tola",
      silverQuantity: 0,
      silverRatePerTola: 5000,
      businessStock: 0,
      investments: 0,
      debtsToDeduct: 0,
      alreadyPaid: 0,
    });
    expect(res.netZakatableWealth).toBe(500000);
    expect(res.isZakatDue).toBe(true);
    expect(res.zakatDue).toBe(12500);
  });

  it("Test 8: Ushr calculation regression — wheat 1,000 kg, Rs 130/kg, rain -> 100 kg, Rs 13,000", () => {
    const res = calculateUshr({
      crop: "wheat",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 130,
      irrigation: "rain",
    });
    expect(res.ratePercentage).toBe("10%");
    expect(res.totalHarvestValue).toBe(130000);
    expect(res.ushrKind).toBe(100);
    expect(res.ushrCashValue).toBe(13000);
  });
});

