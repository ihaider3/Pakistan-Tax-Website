import type { Metadata } from "next";
import { calculatorPages } from "@/content/pages";

const page = calculatorPages.property;

export const metadata: Metadata = {
  title: "Property Tax Calculator Pakistan | 236C & 236K Advance Tax",
  description:
    "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax savings instantly.",
  alternates: {
    canonical: "https://pak-tax-cal.vercel.app/property-tax-calculator",
  },
  openGraph: {
    title: "Property Tax Calculator Pakistan | 236C & 236K Advance Tax",
    description:
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax savings instantly.",
    url: "https://pak-tax-cal.vercel.app/property-tax-calculator",
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Tax Calculator Pakistan | 236C & 236K Advance Tax",
    description:
      "Calculate Pakistan property advance tax under Sections 236C and 236K for buyers and sellers. Compare active Filer vs Non-Filer tax savings instantly.",
  },
};

export default function PropertyTaxLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pak-tax-cal.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Property Tax Calculator",
        item: "https://pak-tax-cal.vercel.app/property-tax-calculator",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
