import React from "react";
import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import MethodologyClient from "./MethodologyClient";

export const metadata: Metadata = {
  title: "Pakistan Tax Slabs 2026-27 & Methodology | CalculationHub",
  description:
    "Explore Pakistan tax slabs 2026-27, statutory FBR references, Zakat Nisab rules, 236C/236K property laws, GST & agricultural Ushr formulas on CalculationHub.",
  alternates: {
    canonical: `${siteUrl}/methodology`,
  },
  openGraph: {
    title: "Pakistan Tax Slabs 2026-27 & Methodology | CalculationHub",
    description:
      "Explore Pakistan tax slabs 2026-27, statutory FBR references, Zakat Nisab rules, 236C/236K property laws, GST & agricultural Ushr formulas on CalculationHub.",
    url: `${siteUrl}/methodology`,
    type: "website",
    siteName: "CalculationHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Tax Slabs 2026-27 & Methodology | CalculationHub",
    description:
      "Explore Pakistan tax slabs 2026-27, statutory FBR references, Zakat Nisab rules, 236C/236K property laws, GST & agricultural Ushr formulas on CalculationHub.",
  },
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
