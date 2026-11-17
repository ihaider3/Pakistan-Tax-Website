import type { Metadata } from "next";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Property Tax Calculator Pakistan | 236C and 236K",
  description:
    "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax savings instantly.",
  alternates: {
    canonical: `${siteUrl}/property-tax-calculator`,
  },
  openGraph: {
    title: "Property Tax Calculator Pakistan | 236C and 236K",
    description:
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax savings instantly.",
    url: `${siteUrl}/property-tax-calculator`,
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Tax Calculator Pakistan | 236C and 236K",
    description:
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax savings instantly.",
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
