import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitrana Calculator 2026 Pakistan | Per Person Rate",
  description:
    "Calculate household Fitrana for Ramadan 2026 in Pakistan. Compare Mufti Muneeb and CII per-person rates for wheat, barley, dates and raisins instantly.",
  alternates: {
    canonical: "https://pak-tax-cal.vercel.app/fitrana-calculator",
  },
  openGraph: {
    title: "Fitrana Calculator 2026 Pakistan | Per Person Rate",
    description:
      "Calculate household Fitrana for Ramadan 2026 in Pakistan. Compare Mufti Muneeb and CII per-person rates for wheat, barley, dates and raisins instantly.",
    url: "https://pak-tax-cal.vercel.app/fitrana-calculator",
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitrana Calculator 2026 Pakistan | Per Person Rate",
    description:
      "Calculate household Fitrana for Ramadan 2026 in Pakistan. Compare Mufti Muneeb and CII per-person rates for wheat, barley, dates and raisins instantly.",
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
        item: "https://pak-tax-cal.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fitrana Calculator",
        item: "https://pak-tax-cal.vercel.app/fitrana-calculator",
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
