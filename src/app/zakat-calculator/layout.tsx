import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Zakat Calculator Pakistan 2026 | CalculationHub",
  description:
    "Calculate 2.5% Zakat on cash, gold, silver and business assets with live Hanafi Nisab verification in Pakistan. 100% private, free, and instant breakdown.",
  alternates: {
    canonical: `${siteUrl}/zakat-calculator`,
  },
  openGraph: {
    title: "Zakat Calculator Pakistan 2026 | CalculationHub",
    description:
      "Calculate 2.5% Zakat on cash, gold, silver and business assets with live Hanafi Nisab verification in Pakistan. 100% private, free, and instant breakdown.",
    url: `${siteUrl}/zakat-calculator`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub Zakat Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zakat Calculator Pakistan 2026 | CalculationHub",
    description:
      "Calculate 2.5% Zakat on cash, gold, silver and business assets with live Hanafi Nisab verification in Pakistan. 100% private, free, and instant breakdown.",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function ZakatLayout({ children }: { children: React.ReactNode }) {
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
        name: "Zakat Calculator",
        item: `${siteUrl}/zakat-calculator`,
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
