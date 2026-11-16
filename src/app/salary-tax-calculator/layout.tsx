import type { Metadata } from "next";
import { calculatorPages } from "@/content/pages";

const page = calculatorPages.salary;

export const metadata: Metadata = {
  title: "Salary Tax Calculator Pakistan 2026-27 | Monthly & Annual Tax",
  description:
    "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs. See monthly tax, annual tax, and take-home pay instantly with slab breakdown.",
  alternates: {
    canonical: "https://pak-tax-cal.vercel.app/salary-tax-calculator",
  },
  openGraph: {
    title: "Salary Tax Calculator Pakistan 2026-27 | Monthly & Annual Tax",
    description:
      "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs. See monthly tax, annual tax, and take-home pay instantly with slab breakdown.",
    url: "https://pak-tax-cal.vercel.app/salary-tax-calculator",
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Tax Calculator Pakistan 2026-27 | Monthly & Annual Tax",
    description:
      "Calculate your Pakistan salary tax for 2026-27 with official FBR slabs. See monthly tax, annual tax, and take-home pay instantly with slab breakdown.",
  },
};

export default function SalaryTaxLayout({ children }: { children: React.ReactNode }) {
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
        name: "Salary Tax Calculator",
        item: "https://pak-tax-cal.vercel.app/salary-tax-calculator",
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
