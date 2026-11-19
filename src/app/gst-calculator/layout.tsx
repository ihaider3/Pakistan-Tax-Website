import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "GST Calculator Pakistan 18% Sales Tax | CalculationHub",
  description:
    "Fast GST calculator Pakistan for 18% standard sales tax. Add or remove GST from invoice totals with exact paisa precision and clear line-by-line breakdown.",
  alternates: {
    canonical: `${siteUrl}/gst-calculator`,
  },
  openGraph: {
    title: "GST Calculator Pakistan 18% Sales Tax | CalculationHub",
    description:
      "Fast GST calculator Pakistan for 18% standard sales tax. Add or remove GST from invoice totals with exact paisa precision and clear line-by-line breakdown.",
    url: `${siteUrl}/gst-calculator`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub GST Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Calculator Pakistan 18% Sales Tax | CalculationHub",
    description:
      "Fast GST calculator Pakistan for 18% standard sales tax. Add or remove GST from invoice totals with exact paisa precision and clear line-by-line breakdown.",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function GstLayout({ children }: { children: React.ReactNode }) {
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
        name: "GST Calculator",
        item: `${siteUrl}/gst-calculator`,
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
