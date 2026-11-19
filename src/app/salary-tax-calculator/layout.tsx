import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Salary Tax Calculator Pakistan 2026-27 | CalculationHub",
  description:
    "Calculate your salary tax calculator Pakistan 2026-27 with official FBR slabs. See monthly tax, annual deductions & take-home pay instantly. Calculate now!",
  alternates: {
    canonical: `${siteUrl}/salary-tax-calculator`,
  },
  openGraph: {
    title: "Salary Tax Calculator Pakistan 2026-27 | CalculationHub",
    description:
      "Calculate your salary tax calculator Pakistan 2026-27 with official FBR slabs. See monthly tax, annual deductions & take-home pay instantly. Calculate now!",
    url: `${siteUrl}/salary-tax-calculator`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub Salary Tax Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Tax Calculator Pakistan 2026-27 | CalculationHub",
    description:
      "Calculate your salary tax calculator Pakistan 2026-27 with official FBR slabs. See monthly tax, annual deductions & take-home pay instantly. Calculate now!",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function SalaryTaxLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salary Tax Calculator",
        item: `${siteUrl}/salary-tax-calculator`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
