import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { shouldBlockInspectShortcut } from "@/components/ContentProtection";

describe("Prompt 74 — Right-Click / Inspect / Copy Protection", () => {
  it("Fix 2: Blocks DevTools, View Source, and Save shortcuts while allowing Print, Find, Refresh, Copy/Paste", () => {
    expect(shouldBlockInspectShortcut({ key: "F12" })).toBe(true);
    expect(
      shouldBlockInspectShortcut({ key: "I", ctrlKey: true, shiftKey: true })
    ).toBe(true);
    expect(
      shouldBlockInspectShortcut({ key: "i", metaKey: true, altKey: true })
    ).toBe(true);
    expect(
      shouldBlockInspectShortcut({ key: "J", ctrlKey: true, shiftKey: true })
    ).toBe(true);
    expect(
      shouldBlockInspectShortcut({ key: "j", metaKey: true, altKey: true })
    ).toBe(true);
    expect(
      shouldBlockInspectShortcut({ key: "C", ctrlKey: true, shiftKey: true })
    ).toBe(true);
    expect(
      shouldBlockInspectShortcut({ key: "c", metaKey: true, altKey: true })
    ).toBe(true);
    expect(shouldBlockInspectShortcut({ key: "u", ctrlKey: true })).toBe(true);
    expect(shouldBlockInspectShortcut({ key: "U", metaKey: true })).toBe(true);
    expect(shouldBlockInspectShortcut({ key: "s", ctrlKey: true })).toBe(true);
    expect(shouldBlockInspectShortcut({ key: "S", metaKey: true })).toBe(true);

    // Allowed user shortcuts
    expect(shouldBlockInspectShortcut({ key: "p", ctrlKey: true })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "P", metaKey: true })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "r", ctrlKey: true })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "F5" })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "f", ctrlKey: true })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "c", ctrlKey: true })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "v", ctrlKey: true })).toBe(false);
    expect(shouldBlockInspectShortcut({ key: "a", ctrlKey: true })).toBe(false);
  });

  it("Fix 1, 3, 4 & 5: Verifies ContentProtection mount, selection rules, clipboard fallback, disabled source maps, and P31 headers", () => {
    const nextConfig = fs.readFileSync(
      path.join(process.cwd(), "next.config.ts"),
      "utf-8"
    );
    expect(nextConfig).toContain("productionBrowserSourceMaps: false");
    expect(nextConfig).toContain("Strict-Transport-Security");
    expect(nextConfig).toContain("Content-Security-Policy");
    expect(nextConfig).toContain("X-Frame-Options");
    expect(nextConfig).toContain("X-Content-Type-Options");
    expect(nextConfig).toContain("Referrer-Policy");
    expect(nextConfig).toContain("Permissions-Policy");

    const layout = fs.readFileSync(
      path.join(process.cwd(), "src/app/layout.tsx"),
      "utf-8"
    );
    expect(layout).toContain("<ContentProtection />");

    const globalsCss = fs.readFileSync(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf-8"
    );
    expect(globalsCss).toContain("user-select: none;");
    expect(globalsCss).toContain("[data-allow-select=\"true\"]");
    expect(globalsCss).toContain("-webkit-user-drag: none;");

    const resultPanel = fs.readFileSync(
      path.join(process.cwd(), "src/components/ResultPanel.tsx"),
      "utf-8"
    );
    expect(resultPanel).toContain('execCommand("copy")');
    expect(resultPanel).toContain('data-allow-select="true"');
  });
});
