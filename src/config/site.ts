/**
 * Central site configuration for CalculationHub.
 * Read dynamically across Copy Summary, Print reports, Web App Manifest,
 * and platform metadata.
 */

export const brandName = "CalculationHub";
export const siteName = "CalculationHub";
export const siteShortName = "Calc Hub";
export const siteDescription =
  "Free, accurate Pakistan tax, Zakat, property, GST, Fitrana and Ushr calculators by CalculationHub — no login, private by design.";
export const themeColor = "#0B2A4A";
export const backgroundColor = "#0B2A4A";

export const logoFull = "/images/CalculationHub_Logo_Full.png";
export const logoIcon = "/images/CalculationHub_App_Icon.png";
export const ogImage = "/images/og-share-1200x630.png";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pak-tax-cal.vercel.app";

// Host part of siteUrl with protocol and trailing slash removed (e.g. pak-tax-cal.vercel.app)
export const siteDomain = siteUrl
  .replace(/^https?:\/\//i, "")
  .replace(/\/+$/, "");

export const contactEmail = "contact@pakfinancecalc.org";


