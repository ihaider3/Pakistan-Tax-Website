import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Calculator Pakistan | 18% Sales Tax on Goods",
  description:
    "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total invoice amounts.",
  alternates: {
    canonical: "https://pak-tax-cal.vercel.app/gst-calculator",
  },
  openGraph: {
    title: "GST Calculator Pakistan | 18% Sales Tax on Goods",
    description:
      "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total invoice amounts.",
    url: "https://pak-tax-cal.vercel.app/gst-calculator",
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "GST Calculator Pakistan | 18% Sales Tax on Goods",
    description:
      "Calculate 18% federal GST on goods in Pakistan with integer paisa precision. Easily add or remove GST and view clear tax-exclusive and total invoice amounts.",
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
      {children}
    </>
  );
}
