import type { Metadata } from "next";
import { siteUrl, siteName } from "@/config/site";

export const metadata: Metadata = {
  title: "Ushr Calculator Pakistan 2026 on Crops | CalculationHub",
  description:
    "Accurate ushr calculator Pakistan for agricultural produce. Calculate 5% to 10% Ushr on wheat, rice & crops in kg, maund and cash value. Calculate online!",
  alternates: {
    canonical: `${siteUrl}/ushr-calculator`,
  },
  openGraph: {
    title: "Ushr Calculator Pakistan 2026 on Crops | CalculationHub",
    description:
      "Accurate ushr calculator Pakistan for agricultural produce. Calculate 5% to 10% Ushr on wheat, rice & crops in kg, maund and cash value. Calculate online!",
    url: `${siteUrl}/ushr-calculator`,
    type: "website",
    siteName,
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub Ushr Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ushr Calculator Pakistan 2026 on Crops | CalculationHub",
    description:
      "Accurate ushr calculator Pakistan for agricultural produce. Calculate 5% to 10% Ushr on wheat, rice & crops in kg, maund and cash value. Calculate online!",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function UshrLayout({ children }: { children: React.ReactNode }) {
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
        name: "Ushr Calculator",
        item: `${siteUrl}/ushr-calculator`,
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

