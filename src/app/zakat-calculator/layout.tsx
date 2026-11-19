import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Zakat Calculator Pakistan 2026 | Nisab | CalculationHub",
  description:
    "Use our zakat calculator Pakistan to calculate 2.5% Zakat on cash, gold, silver & assets with live 2026 Nisab verification and debt deductions. Calculate now!",
  alternates: {
    canonical: `${siteUrl}/zakat-calculator`,
  },
  openGraph: {
    title: "Zakat Calculator Pakistan 2026 | Nisab | CalculationHub",
    description:
      "Use our zakat calculator Pakistan to calculate 2.5% Zakat on cash, gold, silver & assets with live 2026 Nisab verification and debt deductions. Calculate now!",
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
    title: "Zakat Calculator Pakistan 2026 | Nisab | CalculationHub",
    description:
      "Use our zakat calculator Pakistan to calculate 2.5% Zakat on cash, gold, silver & assets with live 2026 Nisab verification and debt deductions. Calculate now!",
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
