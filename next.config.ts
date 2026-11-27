import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://adservice.google.com https://*.googleadservices.com https://*.googletagservices.com https://*.doubleclick.net https://ep1.adtrafficquality.google.com https://ep1.adtrafficquality.google https://tpc.googlesyndication.com https://connect.facebook.net https://bauval.org https://*.bauval.org https://cdn.cloudvideosa.com https://static.nresystems.com https://*.nresystems.com https://cdn.storageimagedisplay.com",
      "script-src-elem 'self' 'unsafe-inline' https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://adservice.google.com https://*.googleadservices.com https://*.googletagservices.com https://*.doubleclick.net https://ep1.adtrafficquality.google.com https://ep1.adtrafficquality.google https://tpc.googlesyndication.com https://connect.facebook.net https://bauval.org https://*.bauval.org https://cdn.cloudvideosa.com https://static.nresystems.com https://*.nresystems.com https://cdn.storageimagedisplay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http://cdn.storageimagedisplay.com",
      "connect-src 'self' https://api.gold-api.com https://open.er-api.com https://*.supabase.co https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://adservice.google.com https://*.googleadservices.com https://*.googletagservices.com https://ep1.adtrafficquality.google.com https://ep1.adtrafficquality.google https://googleads.g.doubleclick.net https://*.doubleclick.net https://www.facebook.com https://connect.facebook.net https://bauval.org https://*.bauval.org https://cdn.cloudvideosa.com https://static.nresystems.com https://*.nresystems.com https://cdn.storageimagedisplay.com",
      "frame-src 'self' https://googleads.g.doubleclick.net https://*.doubleclick.net https://*.googlesyndication.com https://*.google.com https://*.googleadservices.com https://tpc.googlesyndication.com https://www.facebook.com https://bauval.org https://*.bauval.org https://cdn.cloudvideosa.com https://static.nresystems.com https://*.nresystems.com https://cdn.storageimagedisplay.com",
      "frame-ancestors 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  rewrites: async () => ({
    beforeFiles: [],
    afterFiles: [],
    fallback: [],
  }),
  redirects: async () => [
    // Suppress legacy oversized root PNGs (deleted from repo; redirect to optimised /images/ versions)
    {
      source: "/CalculationHub_Logo_Full.png",
      destination: "/images/CalculationHub_Logo_Full.webp",
      permanent: true,
    },
    {
      source: "/CalculationHub_App_Icon.png",
      destination: "/images/CalculationHub_App_Icon.webp",
      permanent: true,
    },
    {
      source: "/privacy",
      destination: "/privacy-policy",
      permanent: true,
    },
    {
      source: "/zakat",
      destination: "/zakat-calculator",
      permanent: true,
    },
    {
      source: "/salary",
      destination: "/salary-tax-calculator",
      permanent: true,
    },
    {
      source: "/property",
      destination: "/property-tax-calculator",
      permanent: true,
    },
    {
      source: "/gst",
      destination: "/gst-calculator",
      permanent: true,
    },
    {
      source: "/fitrana",
      destination: "/fitrana-calculator",
      permanent: true,
    },
    {
      source: "/ushr",
      destination: "/ushr-calculator",
      permanent: true,
    },
    {
      source: "/salary-calculator",
      destination: "/salary-tax-calculator",
      permanent: true,
    },
    {
      source: "/property-calculator",
      destination: "/property-tax-calculator",
      permanent: true,
    },
    {
      source: "/income-tax-calculator",
      destination: "/salary-tax-calculator",
      permanent: true,
    },
    {
      source: "/income-tax-calculator-2025-26",
      destination: "/salary-tax-calculator",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders,
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/images/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/sw.js",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
        {
          key: "Service-Worker-Allowed",
          value: "/",
        },
      ],
    },
    {
      source: "/manifest.json",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
    {
      source: "/(robots.txt|sitemap.xml)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=86400",
        },
      ],
    },
  ],
};

export default nextConfig;
