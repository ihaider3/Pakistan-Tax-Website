import type { Metadata } from "next";
import { siteUrl, siteName } from "@/config/site";

export const metadata: Metadata = {
  title: "Ushr Calculator 2026 | CalculationHub",
  description:
    "Calculate Ushr (Zakat on crops) in Pakistan — 10% for rain-fed, 5% for tube-well irrigated, 7.5% for mixed irrigation. Enter your harvest in kg or maund and get the Ushr in kind and in rupees.",
  alternates: {
    canonical: `${siteUrl}/ushr-calculator`,
  },
  openGraph: {
    title: "Ushr Calculator 2026 | CalculationHub",
    description:
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% for rain-fed, 5% for tube-well irrigated, 7.5% for mixed irrigation. Enter your harvest in kg or maund and get the Ushr in kind and in rupees.",
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
    title: "Ushr Calculator 2026 | CalculationHub",
    description:
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% for rain-fed, 5% for tube-well irrigated, 7.5% for mixed irrigation. Enter your harvest in kg or maund and get the Ushr in kind and in rupees.",
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

