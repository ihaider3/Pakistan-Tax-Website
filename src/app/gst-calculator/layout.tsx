import type { Metadata } from "next";
import { calculatorPages } from "@/content/pages";

const page = calculatorPages.gst;

export const metadata: Metadata = {
  title: "GST Calculator Pakistan | 18% Sales Tax on Goods",
  description:
    "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total amounts.",
  alternates: {
    canonical: "https://pak-tax-cal.vercel.app/gst-calculator",
  },
  openGraph: {
    title: "GST Calculator Pakistan | 18% Sales Tax on Goods",
    description:
      "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total amounts.",
    url: "https://pak-tax-cal.vercel.app/gst-calculator",
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Calculator Pakistan | 18% Sales Tax on Goods",
    description:
      "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total amounts.",
  },
};

export default function GstLayout({ children }: { children: React.ReactNode }) {
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
        name: "GST Calculator",
        item: "https://pak-tax-cal.vercel.app/gst-calculator",
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
