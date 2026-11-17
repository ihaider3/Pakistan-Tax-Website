/**
 * Central site configuration for Pakistan Finance Calculators.
 * Read dynamically across Copy Summary, Print reports, Web App Manifest,
 * and platform metadata.
 */

export const siteName = "Pakistan Finance Calculators";
export const siteShortName = "Finance Calc";
export const siteDescription =
  "Free, accurate Pakistan tax, Zakat, property, GST, Fitrana and Ushr calculators — no login, private by design.";
export const themeColor = "#0B2A4A";
export const backgroundColor = "#0B2A4A";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pak-tax-cal.vercel.app";

// Host part of siteUrl with protocol and trailing slash removed (e.g. pak-tax-cal.vercel.app)
export const siteDomain = siteUrl
  .replace(/^https?:\/\//i, "")
  .replace(/\/+$/, "");

export const contactEmail = "contact@pakfinancecalc.org";


