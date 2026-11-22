import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  META_PIXEL_ID,
  trackMetaPageView,
  trackMetaViewContent,
} from "./metaPixel";
import fs from "fs";
import path from "path";

describe("Meta Pixel Integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    (globalThis as any).window = {
      fbq: undefined,
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
  });

  it("exports exact Meta Pixel ID 1774525983843690", () => {
    expect(META_PIXEL_ID).toBe("1774525983843690");
  });

  it("safely handles trackMetaPageView when window.fbq is undefined", () => {
    expect(() => trackMetaPageView()).not.toThrow();
  });

  it("calls window.fbq with PageView on trackMetaPageView", () => {
    const mockFbq = vi.fn();
    (globalThis as any).window.fbq = mockFbq;

    trackMetaPageView();

    expect(mockFbq).toHaveBeenCalledWith("track", "PageView");
  });

  it("calls window.fbq with ViewContent and content_name on trackMetaViewContent", () => {
    const mockFbq = vi.fn();
    (globalThis as any).window.fbq = mockFbq;

    trackMetaViewContent("Zakat Calculator");

    expect(mockFbq).toHaveBeenCalledWith("track", "ViewContent", {
      content_name: "Zakat Calculator",
    });
  });

  it("never includes user input values in ViewContent payload", () => {
    const mockFbq = vi.fn();
    (globalThis as any).window.fbq = mockFbq;

    trackMetaViewContent("Salary Tax Calculator");

    const payload = mockFbq.mock.calls[0][2];
    expect(payload).toEqual({ content_name: "Salary Tax Calculator" });
    expect(payload).not.toHaveProperty("salary");
    expect(payload).not.toHaveProperty("cash");
    expect(payload).not.toHaveProperty("amount");
  });

  it("verifies next.config.ts CSP headers allow Meta Pixel domains", () => {
    const nextConfigContent = fs.readFileSync(
      path.resolve(process.cwd(), "next.config.ts"),
      "utf-8"
    );

    expect(nextConfigContent).toContain("https://connect.facebook.net");
    expect(nextConfigContent).toContain("https://www.facebook.com");
  });

  it("verifies src/app/layout.tsx contains Meta Pixel base script with correct ID", () => {
    const layoutContent = fs.readFileSync(
      path.resolve(process.cwd(), "src/app/layout.tsx"),
      "utf-8"
    );

    expect(layoutContent).toContain("fbq('init', '1774525983843690')");
    expect(layoutContent).toContain("https://connect.facebook.net/en_US/fbevents.js");
    expect(layoutContent).toContain("https://www.facebook.com/tr?id=1774525983843690");
  });
});
