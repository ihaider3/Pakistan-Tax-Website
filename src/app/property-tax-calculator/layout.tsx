import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Property Tax Calculator Pakistan 236C 236K | CalculationHub",
  description:
    "Accurate property tax calculator Pakistan for buyers (236K) and sellers (236C). Compare Filer vs Non-Filer tax rates and calculate your savings in seconds!",
  alternates: {
    canonical: `${siteUrl}/property-tax-calculator`,
  },
  openGraph: {
    title: "Property Tax Calculator Pakistan 236C 236K | CalculationHub",
    description:
      "Accurate property tax calculator Pakistan for buyers (236K) and sellers (236C). Compare Filer vs Non-Filer tax rates and calculate your savings in seconds!",
    url: `${siteUrl}/property-tax-calculator`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub Property Tax Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Tax Calculator Pakistan 236C 236K | CalculationHub",
    description:
      "Accurate property tax calculator Pakistan for buyers (236K) and sellers (236C). Compare Filer vs Non-Filer tax rates and calculate your savings in seconds!",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function PropertyTaxLayout({ children }: { children: React.ReactNode }) {
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
        name: "Property Tax Calculator",
        item: `${siteUrl}/property-tax-calculator`,
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
