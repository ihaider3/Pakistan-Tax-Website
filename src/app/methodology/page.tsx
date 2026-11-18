import React from "react";
import type { Metadata } from "next";
import { siteUrl } from "@/config/site";
import MethodologyClient from "./MethodologyClient";

export const metadata: Metadata = {
  title: "Methodology & Sources | CalculationHub",
  description:
    "Read official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, Fitrana, and agricultural Ushr calculation rules.",
  alternates: {
    canonical: `${siteUrl}/methodology`,
  },
  openGraph: {
    title: "Methodology & Sources | CalculationHub",
    description:
      "Read official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, Fitrana, and agricultural Ushr calculation rules.",
    url: `${siteUrl}/methodology`,
    type: "website",
    siteName: "CalculationHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Methodology & Sources | CalculationHub",
    description:
      "Read official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, Fitrana, and agricultural Ushr calculation rules.",
  },
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
