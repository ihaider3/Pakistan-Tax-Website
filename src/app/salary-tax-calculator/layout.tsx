import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Salary Tax Calculator Pakistan 2026-27 | FBR Tax",
  description:
    "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs. See monthly tax, annual tax, and take-home pay instantly with slab breakdown.",
  alternates: {
    canonical: `${siteUrl}/salary-tax-calculator`,
  },
  openGraph: {
    title: "Salary Tax Calculator Pakistan 2026-27 | FBR Tax",
    description:
      "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs. See monthly tax, annual tax, and take-home pay instantly with slab breakdown.",
    url: `${siteUrl}/salary-tax-calculator`,
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Tax Calculator Pakistan 2026-27 | FBR Tax",
    description:
      "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs. See monthly tax, annual tax, and take-home pay instantly with slab breakdown.",
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
