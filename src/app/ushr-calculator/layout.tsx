import type { Metadata } from "next";
import { Noto_Nastaliq_Urdu } from "next/font/google";
import { siteUrl, siteName } from "@/config/site";

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-urdu",
  preload: false,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Ushr Calculator Pakistan — Zakat on Crops | CalculationHub",
  description:
    "Calculate Ushr (Zakat on crops) in Pakistan — 10% rain-fed, 5% tube-well, 7.5% mixed irrigation. Enter harvest in kg or maund, get Ushr in kind and rupees.",
  alternates: {
    canonical: `${siteUrl}/ushr-calculator`,
  },
  openGraph: {
    title: "Ushr Calculator Pakistan — Zakat on Crops | CalculationHub",
    description:
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% rain-fed, 5% tube-well, 7.5% mixed irrigation. Enter harvest in kg or maund, get Ushr in kind and rupees.",
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
    title: "Ushr Calculator Pakistan — Zakat on Crops | CalculationHub",
    description:
      "Calculate Ushr (Zakat on crops) in Pakistan — 10% rain-fed, 5% tube-well, 7.5% mixed irrigation. Enter harvest in kg or maund, get Ushr in kind and rupees.",
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
    <div className={notoNastaliq.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </div>
  );
}

