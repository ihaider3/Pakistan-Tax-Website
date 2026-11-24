import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import SearchBox from "@/components/SearchBox";
import { getSiteContent } from "@/lib/content/contentServer";
import { HeroInstallButton } from "@/components/PwaInstallPrompt";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "CalculationHub | Tax, Zakat & Financial Calculators",
  description:
    "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "CalculationHub | Tax, Zakat & Financial Calculators",
    description:
      "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
    url: siteUrl,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CalculationHub | Tax, Zakat & Financial Calculators",
    description:
      "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
    images: ["/images/og-share-1200x630.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "CalculationHub",
      url: siteUrl,
      description:
        "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
      inLanguage: "en-PK",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "CalculationHub",
      url: siteUrl,
      logo: `${siteUrl}/images/CalculationHub_Logo_Full.png`,
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is salary up to Rs 50,000 exempt from tax?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Under FBR Tax Year 2026-27 slabs, the first Rs 600,000 of annual taxable salary (Rs 50,000/month) is taxed at exactly 0%.",
          },
        },
        {
          "@type": "Question",
          name: "Should I use Gold or Silver Nisab?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under Hanafi jurisprudence in Pakistan, if you own mixed assets (cash + gold/silver), the Silver Nisab (52.5 tola) is applied as a precaution to assist the needy.",
          },
        },
        {
          "@type": "Question",
          name: "How much does a Filer save on property?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "On a 1 Crore property, an active Filer pays 1.25% (Rs 125,000) while a Non-Filer pays 10.5% (Rs 1,050,000), saving Rs 925,000.",
          },
        },
        {
          "@type": "Question",
          name: "Is CalculationHub an income tax calculator for Pakistan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — the Salary Tax Calculator on this site calculates income tax on salary in Pakistan using the TY2027 slabs (Finance Act 2026), and the site also offers Zakat, Property Tax, GST, Fitrana and Ushr calculators. No login, 100% private.",
          },
        },
      ],
    },
  ],
};

const calculators = [
  {
    title: "Salary Tax Calculator",
    subtitle: "Tax Year 2026–27 (TY2027)",
    description: "Calculate your monthly tax deduction, annual tax, and net take-home salary based on official FBR Section 149 slabs.",
    href: "/salary-tax-calculator",
    badge: "FBR VERIFIED",
    badgeColor: "bg-emerald-50 text-emerald-950 border-emerald-300",
    dotColor: "bg-emerald-500",
    topGradient: "from-blue-600 via-primary to-teal-500",
    iconBg: "bg-gradient-to-br from-blue-700 via-primary to-[#0A335C] text-white shadow-blue-900/25",
    features: ["Progressive Slabs", "Net Take-Home", "TY2027 Slabs"],
    buttonText: "Calculate Salary Tax",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Complete Zakat Calculator",
    subtitle: "Ramadan 2026 / 1446–47H",
    description: "Calculate 2.5% Zakat on cash, gold, silver, and business inventory with live Hanafi Nisab verification & deduction logic.",
    href: "/zakat-calculator",
    badge: "HANAFI NISAB",
    badgeColor: "bg-teal-50 text-teal-950 border-teal-300",
    dotColor: "bg-teal-500",
    topGradient: "from-teal-500 via-emerald-600 to-amber-500",
    iconBg: "bg-gradient-to-br from-teal-700 via-emerald-800 to-[#07382F] text-white shadow-teal-900/25",
    features: ["Cash, Gold & Silver", "52.5 Tola Nisab", "Debt Deduction"],
    buttonText: "Calculate Zakat",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Property Tax (236C + 236K)",
    subtitle: "Finance Act 2026",
    description: "Determine buyer advance tax (1.25%) and seller tax (2.75%) with instant Filer vs Non-Filer savings comparison.",
    href: "/property-tax-calculator",
    badge: "236C & 236K",
    badgeColor: "bg-indigo-50 text-indigo-950 border-indigo-300",
    dotColor: "bg-indigo-500",
    topGradient: "from-indigo-600 via-blue-700 to-sky-500",
    iconBg: "bg-gradient-to-br from-indigo-700 via-[#1E2E6E] to-blue-900 text-white shadow-indigo-900/25",
    features: ["Buyer Tax (236K)", "Seller Tax (236C)", "Filer vs Non-Filer"],
    buttonText: "Calculate Property Tax",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "GST Calculator (18%)",
    subtitle: "Sales Tax Act 1990",
    description: "Add or remove 18% federal sales tax from any amount, or calculate custom rates with integer paisa precision.",
    href: "/gst-calculator",
    badge: "18% STANDARD",
    badgeColor: "bg-amber-50 text-amber-950 border-amber-300",
    dotColor: "bg-amber-500",
    topGradient: "from-amber-500 via-orange-600 to-rose-600",
    iconBg: "bg-gradient-to-br from-amber-600 via-orange-700 to-stone-900 text-white shadow-amber-900/25",
    features: ["Add or Extract GST", "Custom Rate %", "Integer Paisa Math"],
    buttonText: "Calculate GST",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
      </svg>
    ),
  },
  {
    title: "Fitrana Calculator 2026",
    subtitle: "Sadqat-ul-Fitr",
    description: "Calculate household Fitrana for Eid-ul-Fitr 2026. Compare Mufti Muneeb and Council of Islamic Ideology rates side-by-side.",
    href: "/fitrana-calculator",
    badge: "Wheat Rs 300",
    badgeColor: "bg-emerald-50 text-emerald-950 border-emerald-300",
    dotColor: "bg-emerald-600",
    topGradient: "from-emerald-600 via-teal-700 to-green-600",
    iconBg: "bg-gradient-to-br from-emerald-800 via-teal-900 to-[#0B3322] text-white shadow-emerald-900/25",
    features: ["4 Islamic Commodities", "Household Total", "Mufti Muneeb Rates"],
    buttonText: "Calculate Fitrana",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Ushr Calculator",
    subtitle: "Zakat on Crops",
    description: "Zakat on crops — 10% rain-fed, 5% irrigated with authentic Shariah nisab & harvest conversion in kg/maund.",
    href: "/ushr-calculator",
    badge: "Agricultural Zakat",
    badgeColor: "bg-lime-50 text-lime-950 border-lime-300",
    dotColor: "bg-lime-600",
    topGradient: "from-lime-600 via-emerald-600 to-teal-700",
    iconBg: "bg-gradient-to-br from-lime-800 via-emerald-900 to-[#0B3322] text-white shadow-lime-900/25",
    features: ["10% Rain / 5% Tubewell", "Kg & Maund Units", "Quran 6:141 Verified"],
    buttonText: "Calculate Ushr",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const mostSearched = [
  { label: "150,000 salary tax", href: "/salary-tax-calculator" },
  { label: "Zakat nisab", href: "/zakat-calculator" },
  { label: "236C / 236K property", href: "/property-tax-calculator" },
  { label: "GST 18%", href: "/gst-calculator" },
  { label: "Fitrana per person", href: "/fitrana-calculator" },
  { label: "Ushr on crops", href: "/ushr-calculator" },
];

export default async function HomePage() {
  const content = await getSiteContent();

  const dynamicCalculators = [
    {
      ...calculators[0],
      title: content.home_card_salary_title || calculators[0].title,
      description: content.home_card_salary_desc || calculators[0].description,
    },
    {
      ...calculators[1],
      title: content.home_card_zakat_title || calculators[1].title,
      description: content.home_card_zakat_desc || calculators[1].description,
    },
    {
      ...calculators[2],
      title: content.home_card_property_title || calculators[2].title,
      description: content.home_card_property_desc || calculators[2].description,
    },
    {
      ...calculators[3],
      title: content.home_card_gst_title || calculators[3].title,
      description: content.home_card_gst_desc || calculators[3].description,
    },
    {
      ...calculators[4],
      title: content.home_card_fitrana_title || calculators[4].title,
      description: content.home_card_fitrana_desc || calculators[4].description,
    },
    {
      ...calculators[5],
      title: content.home_card_ushr_title || calculators[5].title,
      description: content.home_card_ushr_desc || calculators[5].description,
    },
  ];

  const cardContentKeys: Record<string, { titleKey: string; descKey: string }> = {
    "/salary-tax-calculator": { titleKey: "home_card_salary_title", descKey: "home_card_salary_desc" },
    "/zakat-calculator": { titleKey: "home_card_zakat_title", descKey: "home_card_zakat_desc" },
    "/property-tax-calculator": { titleKey: "home_card_property_title", descKey: "home_card_property_desc" },
    "/gst-calculator": { titleKey: "home_card_gst_title", descKey: "home_card_gst_desc" },
    "/fitrana-calculator": { titleKey: "home_card_fitrana_title", descKey: "home_card_fitrana_desc" },
    "/ushr-calculator": { titleKey: "home_card_ushr_title", descKey: "home_card_ushr_desc" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="pb-12 sm:pb-16">
        {/* =========================================================================
            HERO SECTION WITH AMBIENT ILLUMINATION & CINEMATIC DEPTH
           ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-white to-white border-b border-slate-200/90 pt-10 pb-10 sm:pt-14 sm:pb-14 px-4 sm:px-6">
          {/* Subtle Ambient Radial Lighting Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.14),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-dot-mesh pointer-events-none opacity-60" />

          <div className="relative max-w-[1150px] mx-auto text-center space-y-6 sm:space-y-8">
            {/* Glowing Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-accent text-xs font-black uppercase tracking-widest border border-accent/30 shadow-[0_4px_16px_rgba(15,118,110,0.18)] hover:scale-105 transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
              </span>
              <span data-content-key="home_hero_badge">{content.home_hero_badge || "VERIFIED AGAINST OFFICIAL 2026–27 NOTIFICATIONS"}</span>
            </div>

            {/* High-Impact Main Heading */}
            <div className="space-y-3">
              <h1
                data-content-key="home_hero_title"
                className="text-[26px] sm:text-4xl lg:text-5xl font-black text-primary tracking-tight max-w-4xl mx-auto leading-[1.2] sm:leading-[1.25]"
              >
                {content.home_hero_title && content.home_hero_title !== "CalculationHub — Free, Accurate, No Login" ? (
                  content.home_hero_title
                ) : (
                  <>
                    Free Pakistan Tax, Zakat{" "}
                    <span className="block mt-1 sm:mt-2 pb-2 sm:pb-3 leading-normal bg-gradient-to-r from-primary via-[#0F5A9E] to-accent bg-clip-text text-transparent">
                      &amp; Financial Calculators
                    </span>
                  </>
                )}
              </h1>

              <p
                data-content-key="home_hero_subtitle"
                className="text-[15px] sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium pt-1"
              >
                {content.home_hero_subtitle && !content.home_hero_subtitle.startsWith("Instant, private calculations for salary tax")
                  ? content.home_hero_subtitle
                  : "Instant, private calculations with our Pakistan tax calculator for salary tax, Zakat, property advance tax (236C/236K), GST 18%, Fitrana, and agricultural Ushr. All numbers stay in your browser."}
              </p>
            </div>

            {/* Search Box with Deep Shadow */}
            <div className="pt-2 max-w-2xl mx-auto">
              <SearchBox />
            </div>

            {/* Most Searched Quick Links with Micro-Shadows */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="font-extrabold text-primary mr-1">Most Searched:</span>
              {mostSearched.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-primary hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 font-bold shadow-xs"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Optional Hero Install App Button */}
            <div className="flex justify-center">
              <HeroInstallButton />
            </div>
          </div>
        </section>

        {/* =========================================================================
            ELEVATED HARDCOOKED TRUST STRIP (FLOATING CAPSULE WITH DEEP SHADOWS)
           ========================================================================= */}
        <section className="max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="backdrop-blur-2xl bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border-2 border-slate-200/95 shadow-[0_22px_50px_-12px_rgba(11,42,74,0.14),0_6px_20px_rgba(0,0,0,0.04)] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 sm:divide-x sm:divide-slate-100">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-none sm:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-100">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-black text-sm sm:text-base text-primary tracking-tight">No Login Required</span>
              <span className="text-xs font-semibold text-slate-600">Open access, no signups</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-none sm:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/25 ring-2 ring-teal-100">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-black text-sm sm:text-base text-primary tracking-tight">100% Client-Side</span>
              <span className="text-xs font-semibold text-slate-600">Numbers never leave phone</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/80 sm:bg-transparent border border-slate-100 sm:border-none sm:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25 ring-2 ring-blue-100">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-black text-sm sm:text-base text-primary tracking-tight">FBR &amp; SBP Checked</span>
              <span className="text-xs font-semibold text-slate-600">Finance Act 2026 Tables</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 5 CALCULATOR CARDS (HARDCOOKED WITH TOP ACCENTS, PROMINENT TEXT & SHADOWS)
         ========================================================================= */}
      <section className="max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 mt-12 sm:mt-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-200/90 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest bg-accent-soft px-3 py-1 rounded-full border border-accent/25 mb-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Free Pakistan Calculators
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tight">
              Choose a Calculator
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">
              Choose a calculator below to view instant results and full line-by-line breakdown tables.
            </p>
          </div>

          <Link
            href="/methodology"
            className="px-4 py-2 rounded-xl bg-surface hover:bg-slate-200 border border-slate-300 text-xs font-black text-primary flex items-center gap-2 group self-start sm:self-auto shadow-xs hover:shadow-md transition-all duration-200"
          >
            <span>View All Verification Tables</span>
            <span className="group-hover:translate-x-1 transition-transform text-accent font-black">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {dynamicCalculators.map((calc, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-accent/60 p-6 sm:p-7 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden"
            >
              {/* Permanent Sleek Top Accent Gradient Line with Vibrant Glow on Hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${calc.topGradient} opacity-90 group-hover:h-2.5 transition-all duration-300`}
              />

              <div>
                {/* Top Row: Icon Container + Prominent Badge */}
                <div className="flex items-center justify-between mb-5 mt-1">
                  <div
                    className={`w-14 h-14 rounded-2xl ${calc.iconBg} flex items-center justify-center transition-all duration-300 shadow-md ring-2 ring-white group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    {calc.icon}
                  </div>
                  <span
                    className={`text-[11px] font-black tracking-wider px-3 py-1 rounded-full border-2 shadow-xs flex items-center gap-1.5 ${calc.badgeColor}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${calc.dotColor} animate-pulse`}></span>
                    {calc.badge}
                  </span>
                </div>

                {/* Card Title & Subtitle */}
                <h3
                  data-content-key={cardContentKeys[calc.href]?.titleKey}
                  className="text-xl sm:text-2xl font-black text-primary group-hover:text-accent transition-colors duration-200 mb-1 leading-snug"
                >
                  {calc.title}
                </h3>
                <span className="text-xs font-extrabold text-accent uppercase tracking-wider block mb-3">
                  {calc.subtitle}
                </span>

                {/* Prominent High-Contrast Description */}
                <p
                  data-content-key={cardContentKeys[calc.href]?.descKey}
                  className="text-sm text-slate-800 leading-relaxed font-medium"
                >
                  {calc.description}
                </p>

                {calc.href === "/fitrana-calculator" && (
                  <p className="mt-2.5 text-xs text-appText-muted font-medium bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 shadow-2xs">
                    Rates announced for Ramadan 2026 — new rates will be published when announced for Ramadan 2027.
                  </p>
                )}

                {/* Micro-Features Chip Row */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {calc.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[11px] font-bold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80 group-hover:bg-slate-100 transition-colors"
                    >
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hardcooked Action Button at Bottom */}
              <div className="pt-6 border-t-2 border-slate-100 mt-6">
                <Link
                  href={calc.href}
                  className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-r from-primary via-[#0E355D] to-primary group-hover:from-accent group-hover:via-teal-600 group-hover:to-accent text-white font-extrabold text-sm transition-all duration-300 flex items-center justify-between shadow-md shadow-primary/20 group-hover:shadow-xl group-hover:shadow-accent/25"
                >
                  <span className="tracking-tight">{calc.buttonText}</span>
                  <span className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center font-black group-hover:translate-x-1 group-hover:bg-white group-hover:text-accent transition-all duration-300">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (HARDCOOKED 3-STEP ENGINE WITH CINEMATIC DEPTH & GLOW)
         ========================================================================= */}
      <section className="max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 mt-12 sm:mt-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#F4F7FB] via-white to-[#EEF4F9] rounded-3xl p-6 sm:p-12 border-2 border-slate-200/95 shadow-[0_25px_60px_-15px_rgba(11,42,74,0.12),0_4px_20px_rgba(0,0,0,0.03)] space-y-10 ring-1 ring-slate-900/5">
          {/* Ambient Radial Spotlight inside container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.12),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-dot-mesh pointer-events-none opacity-40" />

          {/* Header Block */}
          <div className="relative text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border-2 border-accent/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              How It Works — 3 Easy Steps
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              How It Works
            </h2>
            <p className="text-base sm:text-lg font-semibold text-slate-700 max-w-xl mx-auto">
              Three simple steps to calculate your financial obligations with zero friction, zero signups, and 100% privacy.
            </p>
          </div>

          {/* 3 Hardcooked Cards Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2.5 transition-all duration-300 ease-out flex flex-col justify-between text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-primary to-indigo-600 opacity-90 group-hover:h-2.5 transition-all duration-300" />
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-primary to-indigo-900 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30 ring-4 ring-blue-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-4">
                  1
                </div>
                <h3 className="font-black text-xl text-primary group-hover:text-accent transition-colors mb-2">
                  Enter Your Amount
                </h3>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  Type your salary, property value, asset balances, or family size. Number formatting handles commas and ignores spaces automatically.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                  ✦ Automatic comma &amp; space parser
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2.5 transition-all duration-300 ease-out flex flex-col justify-between text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-accent to-emerald-600 opacity-90 group-hover:h-2.5 transition-all duration-300" />
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 via-accent to-emerald-800 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30 ring-4 ring-teal-50 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 mb-4">
                  2
                </div>
                <h3 className="font-black text-xl text-primary group-hover:text-accent transition-colors mb-2">
                  Instant Result &amp; Breakdown
                </h3>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  Results calculate live in your browser as you type. Review the detailed slab-by-slab breakdown table to verify every single rupee.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                  ✦ 100% Client-side live math engine
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2.5 transition-all duration-300 ease-out flex flex-col justify-between text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-700 to-primary opacity-90 group-hover:h-2.5 transition-all duration-300" />
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-primary text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 ring-4 ring-emerald-50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-4">
                  3
                </div>
                <h3 className="font-black text-xl text-primary group-hover:text-accent transition-colors mb-2">
                  Copy or Print to PDF
                </h3>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  Copy a clean two-line summary for WhatsApp/email or use Print to save a clean PDF of your calculation summary.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  ✦ WhatsApp copy &amp; Clean Print to PDF
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ TEASER SECTION (HARDCOOKED CARDS WITH TOP ACCENTS & SHADOWS)
         ========================================================================= */}
      <section className="max-w-[1150px] mx-auto px-4 sm:px-5 lg:px-6 mt-12 sm:mt-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-200/90 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest bg-accent-soft px-3 py-1 rounded-full border border-accent/25 mb-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tight">
              Common Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">
              Quick answers to frequent tax and Islamic calculation queries.
            </p>
          </div>

          <Link
            href="/methodology"
            className="px-4 py-2.5 rounded-xl bg-surface hover:bg-slate-200 border-2 border-slate-200/90 text-xs font-black text-primary flex items-center gap-2 group self-start sm:self-auto shadow-xs hover:shadow-md transition-all duration-200"
          >
            <span>Read Full Methodology</span>
            <span className="group-hover:translate-x-1 transition-transform text-accent font-black">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* FAQ Card 1 */}
          <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 space-y-4 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-primary group-hover:h-2 transition-all duration-300" />
            <div>
              <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block shadow-2xs">
                Salary Tax • FBR Rules
              </span>
              <h3 className="font-black text-lg sm:text-xl text-primary group-hover:text-accent transition-colors mt-3 mb-2 leading-snug">
                Is salary up to Rs 50,000 exempt from tax?
              </h3>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                Yes. Under FBR Tax Year 2026-27 slabs, the first <strong className="text-primary font-black">Rs 600,000</strong> of annual taxable salary (<strong className="text-primary font-black">Rs 50,000/month</strong>) is taxed at exactly 0%.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/salary-tax-calculator"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-primary text-primary group-hover:text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-between shadow-xs group-hover:shadow-md"
              >
                <span>View Salary Slabs</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* FAQ Card 2 */}
          <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 space-y-4 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 group-hover:h-2 transition-all duration-300" />
            <div>
              <span className="text-[11px] font-black text-teal-950 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block shadow-2xs">
                Zakat Nisab • Hanafi Law
              </span>
              <h3 className="font-black text-lg sm:text-xl text-primary group-hover:text-accent transition-colors mt-3 mb-2 leading-snug">
                Should I use Gold or Silver Nisab?
              </h3>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                Under Hanafi jurisprudence in Pakistan, if you own mixed assets (cash + gold/silver), the <strong className="text-primary font-black">Silver Nisab (52.5 tola)</strong> is applied as a precaution to assist the needy.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/zakat-calculator"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-primary text-primary group-hover:text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-between shadow-xs group-hover:shadow-md"
              >
                <span>Calculate Zakat</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* FAQ Card 3 */}
          <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 space-y-4 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 to-blue-700 group-hover:h-2 transition-all duration-300" />
            <div>
              <span className="text-[11px] font-black text-indigo-950 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block shadow-2xs">
                Property Tax • Section 236C/K
              </span>
              <h3 className="font-black text-lg sm:text-xl text-primary group-hover:text-accent transition-colors mt-3 mb-2 leading-snug">
                How much does a Filer save on property?
              </h3>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                On a 1 Crore property, an active Filer pays <strong className="text-primary font-black">1.25% (Rs 125,000)</strong> while a Non-Filer pays <strong className="text-red-700 font-black">10.5% (Rs 1,050,000)</strong>, saving <strong className="text-emerald-700 font-black">Rs 925,000</strong>.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/property-tax-calculator"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-primary text-primary group-hover:text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-between shadow-xs group-hover:shadow-md"
              >
                <span>Compare 236C &amp; 236K</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* FAQ Card 4 */}
          <div className="group relative bg-white rounded-3xl border-2 border-slate-200/95 hover:border-accent/60 p-7 sm:p-8 space-y-4 shadow-[0_12px_32px_-6px_rgba(11,42,74,0.08),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_28px_60px_-12px_rgba(11,42,74,0.22),0_0_35px_rgba(15,118,110,0.18)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 via-primary to-accent group-hover:h-2 transition-all duration-300" />
            <div>
              <span className="text-[11px] font-black text-teal-950 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block shadow-2xs">
                Income Tax • Tools
              </span>
              <h3 className="font-black text-lg sm:text-xl text-primary group-hover:text-accent transition-colors mt-3 mb-2 leading-snug">
                Is CalculationHub an income tax calculator for Pakistan?
              </h3>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                Yes — the{" "}
                <Link
                  href="/salary-tax-calculator"
                  className="text-primary font-black underline hover:text-accent transition-colors"
                >
                  Salary Tax Calculator
                </Link>{" "}
                on this site calculates income tax on salary in Pakistan using the TY2027 slabs (Finance Act 2026), and the site also offers Zakat, Property Tax, GST, Fitrana and Ushr calculators. No login, 100% private.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/salary-tax-calculator"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 group-hover:bg-primary text-primary group-hover:text-white font-extrabold text-xs transition-all duration-200 flex items-center justify-between shadow-xs group-hover:shadow-md"
              >
                <span>Calculate Salary Tax</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>
);
}
