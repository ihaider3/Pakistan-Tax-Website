import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/content/pages";
import { siteUrl } from "@/config/site";
import { AdsterraNativeBanner } from "@/components/AdsterraSlot";

export const metadata: Metadata = {
  title: "About CalculationHub — Free Pakistan Tax Calculators",
  description:
    "Learn about CalculationHub — free, transparent Pakistan tax, Zakat and financial calculators. No login, 100% private, all calculations on your device.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About CalculationHub — Free Pakistan Tax Calculators",
    description:
      "Learn about CalculationHub — free, transparent Pakistan tax, Zakat and financial calculators. No login, 100% private, all calculations on your device.",
    url: `${siteUrl}/about`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub — About",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About CalculationHub — Free Pakistan Tax Calculators",
    description:
      "Learn about CalculationHub — free, transparent Pakistan tax, Zakat and financial calculators. No login, 100% private, all calculations on your device.",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <Breadcrumb items={[{ label: "About", href: "/about" }]} />
      <div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
          About Platform
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
          About CalculationHub
        </h1>
        <p className="text-base text-appText-muted mt-2">
          Empowering Pakistani citizens and businesses with accurate, transparent, and completely private financial calculators.
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-sm sm:text-base text-appText leading-relaxed">
        <section className="bg-surface p-6 rounded-xl border border-appBorder space-y-2">
          <h2 className="text-lg font-bold text-primary">Our Core Philosophy</h2>
          <p>
            Managing taxes and fulfilling Islamic obligations in Pakistan should not require complicated spreadsheets, expensive consultations, or creating accounts that harvest personal financial data.
          </p>
          <p className="font-semibold text-accent">
            {siteConfig.privacyClaim} Every calculator on this platform runs 100% locally in your web browser.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-primary">The 6 Essential Calculators</h2>
          <p>
            Rather than building untested tools, our platform focuses strictly on 6 essential calculations verified against primary legal documents and scholarly announcements:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-appText-muted">
            <li>
              <strong>Salary Tax Calculator (Tax Year 2026–27):</strong> Progressive income tax under FBR Section 149 for salaried individuals.
            </li>
            <li>
              <strong>Complete Zakat Calculator (2026):</strong> 2.5% Zakat on cash, gold, silver, and trade inventory with automatic Hanafi Nisab checking.
            </li>
            <li>
              <strong>Property Transfer Tax Calculator:</strong> FBR Section 236K (buyer) and Section 236C (seller) advance tax with Filer vs Non-Filer comparison.
            </li>
            <li>
              <strong>GST Calculator:</strong> Federal 18% standard goods sales tax with Add, Remove, and custom rate capabilities.
            </li>
            <li>
              <strong>Fitrana Calculator (2026):</strong> Household Sadqat-ul-Fitr based on Mufti Muneeb-ur-Rehman and Council of Islamic Ideology verified rates.
            </li>
            <li>
              <strong>Ushr Calculator (Zakat on Crops 2026):</strong> Agricultural produce Zakat (10% rain-fed, 5% tube-well, 7.5% mixed) in kg, maund, and rupee valuation.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-primary">Open Methodology &amp; Trust</h2>
          <p>
            Every single calculator page displays the primary source document, legal section, and last-verified date. We do not invent or guess any tax rates; we round to whole rupees and show our working.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1 text-accent font-semibold hover:underline"
            >
              Read our full verification methodology &rarr;
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-accent font-semibold hover:underline"
            >
              Contact our team &rarr;
            </Link>
            <Link
              href="/disclaimer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-accent font-semibold hover:underline"
            >
              View legal &amp; religious disclaimer &rarr;
            </Link>
          </div>
        </section>

        <AdsterraNativeBanner className="px-0 mt-4" />
      </div>
    </div>
  );
}

