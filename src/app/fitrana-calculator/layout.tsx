import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Fitrana 2026 Pakistan | Per Person Rates | CalculationHub",
  description:
    "Calculate fitrana 2026 Pakistan for your family with verified per person rates for wheat, barley, dates & raisins from official scholarly announcements.",
  alternates: {
    canonical: `${siteUrl}/fitrana-calculator`,
  },
  openGraph: {
    title: "Fitrana 2026 Pakistan | Per Person Rates | CalculationHub",
    description:
      "Calculate fitrana 2026 Pakistan for your family with verified per person rates for wheat, barley, dates & raisins from official scholarly announcements.",
    url: `${siteUrl}/fitrana-calculator`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub Fitrana Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitrana 2026 Pakistan | Per Person Rates | CalculationHub",
    description:
      "Calculate fitrana 2026 Pakistan for your family with verified per person rates for wheat, barley, dates & raisins from official scholarly announcements.",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function FitranaLayout({ children }: { children: React.ReactNode }) {
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
        name: "Fitrana Calculator",
        item: `${siteUrl}/fitrana-calculator`,
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
