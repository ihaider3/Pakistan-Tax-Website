import React from "react";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export const metadata = {
  title: "Pakistan Financial & Islamic Calculators — Free Salary Tax, Zakat, GST & Property Calculators",
  description:
    "Free, accurate Pakistan calculators for salary tax 2026-27, Zakat, property tax 236C/236K, GST 18% and Fitrana. No login. Instant result with full breakdown in English + Roman Urdu.",
  keywords: [
    "pakistan tax calculator",
    "salary tax calculator pakistan",
    "zakat calculator pakistan",
    "gst calculator pakistan",
    "property tax calculator pakistan",
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
    description: "Add or remove 18% federal sales tax from any amount, or calculate custom provincial rates with integer paisa precision.",
    href: "/gst-calculator",
    badge: "18% STANDARD",
    badgeColor: "bg-amber-50 text-amber-950 border-amber-300",
    dotColor: "bg-amber-500",
    topGradient: "from-amber-500 via-orange-600 to-rose-600",
    iconBg: "bg-gradient-to-br from-amber-600 via-orange-700 to-stone-900 text-white shadow-amber-900/25",
    features: ["Add or Extract GST", "Provincial Rates", "Integer Paisa Math"],
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
    badge: "WHEAT RS 300",
    badgeColor: "bg-emerald-50 text-emerald-950 border-emerald-300",
    dotColor: "bg-emerald-600",
    topGradient: "from-emerald-600 via-teal-700 to-green-600",
    iconBg: "bg-gradient-to-br from-emerald-800 via-teal-900 to-[#0B3322] text-white shadow-emerald-900/25",
    features: ["5 Islamic Commodities", "Household Total", "Mufti Muneeb Rates"],
    buttonText: "Calculate Fitrana",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
];

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* =========================================================================
          HERO SECTION WITH AMBIENT ILLUMINATION & CINEMATIC DEPTH
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-white to-white border-b border-slate-200/90 pt-14 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
        {/* Subtle Ambient Radial Lighting Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.14),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-dot-mesh pointer-events-none opacity-60" />

        <div className="relative max-w-[1200px] mx-auto text-center space-y-6 sm:space-y-8">
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-accent text-xs font-black uppercase tracking-widest border border-accent/30 shadow-[0_4px_16px_rgba(15,118,110,0.18)] hover:scale-105 transition-all duration-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            <span>VERIFIED AGAINST OFFICIAL 2026–27 NOTIFICATIONS</span>
          </div>

          {/* High-Impact Main Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-primary tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Pakistan Financial &amp; Islamic Calculators{" "}
              <span className="block mt-2 bg-gradient-to-r from-primary via-[#0F5A9E] to-accent bg-clip-text text-transparent">
                — Free, Accurate, No Login
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium pt-1">
              Instant, private calculations for salary tax, Zakat, property advance tax (236C/236K), GST 18%, and Fitrana. All numbers stay in your browser.
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
        </div>
      </section>

      {/* =========================================================================
          ELEVATED HARDCOOKED TRUST STRIP (FLOATING CAPSULE WITH DEEP SHADOWS)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-20">
        <div className="backdrop-blur-2xl bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200/95 shadow-[0_22px_50px_-12px_rgba(11,42,74,0.14),0_6px_20px_rgba(0,0,0,0.04)] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="block font-black text-xs sm:text-base text-primary tracking-tight">No Login Required</span>
              <span className="text-xs font-bold text-slate-600">Open access, no signups</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 pt-4 lg:pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-600/25 ring-2 ring-teal-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="block font-black text-xs sm:text-base text-primary tracking-tight">100% Client-Side</span>
              <span className="text-xs font-bold text-slate-600">Numbers never leave phone</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 pt-4 lg:pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25 ring-2 ring-blue-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="block font-black text-xs sm:text-base text-primary tracking-tight">FBR &amp; SBP Verified</span>
              <span className="text-xs font-bold text-slate-600">Finance Act 2026 Tables</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 pt-4 lg:pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="block font-black text-xs sm:text-base text-primary tracking-tight">Last Verified</span>
              <span className="text-xs font-bold text-slate-600">14 Nov 2026 (Live Audit)</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 5 CALCULATOR CARDS (HARDCOOKED WITH TOP ACCENTS, PROMINENT TEXT & SHADOWS)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-200/90 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest bg-accent-soft px-3 py-1 rounded-full border border-accent/25 mb-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Core Statutory Suite
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tight">
              Pakistan Financial &amp; Islamic Calculators
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
          {calculators.map((calc, idx) => (
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
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 shadow-xs flex items-center gap-1.5 ${calc.badgeColor}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${calc.dotColor} animate-pulse`}></span>
                    {calc.badge}
                  </span>
                </div>

                {/* Card Title & Subtitle */}
                <h3 className="text-xl sm:text-2xl font-black text-primary group-hover:text-accent transition-colors duration-200 mb-1 leading-snug">
                  {calc.title}
                </h3>
                <span className="text-xs font-extrabold text-accent uppercase tracking-wider block mb-3">
                  {calc.subtitle}
                </span>

                {/* Prominent High-Contrast Description */}
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {calc.description}
                </p>

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
          HOW IT WORKS (HARDCOOKED 3 STEPS WITH SLEEK NUMERIC BADGES)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-surface via-slate-50 to-white rounded-3xl p-6 sm:p-12 border-2 border-slate-200/90 shadow-[0_18px_40px_-8px_rgba(11,42,74,0.08)] space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black text-accent uppercase tracking-wider bg-accent-soft px-3 py-1 rounded-full border border-accent/25">
              Frictionless Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              How It Works
            </h2>
            <p className="text-sm font-semibold text-slate-700">
              Designed for zero friction, complete confidentiality, and maximum precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-7 rounded-2xl border-2 border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(11,42,74,0.06)] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-primary/30 ring-2 ring-primary/20">
                1
              </div>
              <h3 className="font-black text-lg text-primary">1. Enter Your Numbers</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Type your monthly salary, property valuation, asset values, or family size. Number parsing ignores spaces and handles commas automatically.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border-2 border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(11,42,74,0.06)] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-accent-light text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-accent/30 ring-2 ring-accent/20">
                2
              </div>
              <h3 className="font-black text-lg text-primary">2. Instant Math &amp; Breakdown</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Results calculate live in your browser as you type. Check the complete line-by-line / slab-by-slab breakdown to verify every single rupee.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border-2 border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(11,42,74,0.06)] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-teal-700 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-accent/30 ring-2 ring-teal-200">
                3
              </div>
              <h3 className="font-black text-lg text-primary">3. Copy or Print to PDF</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                Copy a clean two-line summary for WhatsApp/email or use Print to save a clean PDF of your calculation summary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ TEASER SECTION (HARDCOOKED CARDS)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200/90 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">Common Questions</h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
              Quick answers to frequent tax and Islamic calculation queries.
            </p>
          </div>
          <Link
            href="/methodology"
            className="text-xs sm:text-sm font-black text-accent hover:text-accent-dark flex items-center gap-1.5 group"
          >
            <span>Read Full Methodology</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200/90 space-y-3 shadow-[0_10px_25px_-5px_rgba(11,42,74,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <span className="text-[11px] font-black text-accent uppercase tracking-wider bg-accent-soft px-2.5 py-0.5 rounded-full border border-accent/20 inline-block">
              Salary Tax
            </span>
            <h3 className="font-black text-base text-primary">Is salary up to Rs 50,000 exempt from tax?</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Yes. Under FBR Tax Year 2026-27 slabs, the first Rs 600,000 of annual taxable salary (Rs 50,000/month) is taxed at 0%.
            </p>
            <Link href="/salary-tax-calculator" className="text-xs text-accent font-extrabold block pt-2 hover:underline">
              View Salary Slabs →
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200/90 space-y-3 shadow-[0_10px_25px_-5px_rgba(11,42,74,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <span className="text-[11px] font-black text-accent uppercase tracking-wider bg-accent-soft px-2.5 py-0.5 rounded-full border border-accent/20 inline-block">
              Zakat Nisab
            </span>
            <h3 className="font-black text-base text-primary">Should I use Gold or Silver Nisab?</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Under Hanafi jurisprudence in Pakistan, if you own mixed assets (cash + gold/silver), the Silver Nisab (52.5 tola) is applied as a precaution to assist the poor.
            </p>
            <Link href="/zakat-calculator" className="text-xs text-accent font-extrabold block pt-2 hover:underline">
              Calculate Zakat →
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200/90 space-y-3 shadow-[0_10px_25px_-5px_rgba(11,42,74,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <span className="text-[11px] font-black text-accent uppercase tracking-wider bg-accent-soft px-2.5 py-0.5 rounded-full border border-accent/20 inline-block">
              Property Tax
            </span>
            <h3 className="font-black text-base text-primary">How much does a Filer save on property?</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              On purchasing a 1 Crore property, an active Filer pays 1.25% (Rs 125,000) whereas a Non-Filer pays 10.5% (Rs 1,050,000), saving Rs 925,000.
            </p>
            <Link href="/property-tax-calculator" className="text-xs text-accent font-extrabold block pt-2 hover:underline">
              Compare 236C &amp; 236K →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
