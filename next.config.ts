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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://adservice.google.com https://ep1.adtrafficquality.google.com https://tpc.googlesyndication.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.gold-api.com https://open.er-api.com https://*.supabase.co https://va.vercel-scripts.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://ep1.adtrafficquality.google.com https://googleads.g.doubleclick.net",
      "frame-src 'self' https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.google.com https://tpc.googlesyndication.com",
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
  images: {
    formats: ["image/avif", "image/webp"],
  },
  redirects: async () => [
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
