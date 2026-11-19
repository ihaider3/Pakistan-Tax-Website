import React from "react";
import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import MethodologyClient from "./MethodologyClient";

export const metadata: Metadata = {
  title: "Pakistan Tax Slabs 2026-27 — Methodology | CalculationHub",
  description:
    "Official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, Fitrana and agricultural Ushr rules 2026-27.",
  alternates: {
    canonical: `${siteUrl}/methodology`,
  },
  openGraph: {
    title: "Pakistan Tax Slabs 2026-27 — Methodology | CalculationHub",
    description:
      "Official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, Fitrana and agricultural Ushr rules 2026-27.",
    url: `${siteUrl}/methodology`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub — Methodology & Sources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Tax Slabs 2026-27 — Methodology | CalculationHub",
    description:
      "Official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, Fitrana and agricultural Ushr rules 2026-27.",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
