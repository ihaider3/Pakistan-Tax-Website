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
    badge: "FBR Verified",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    gradient: "from-blue-600/10 via-teal-500/5 to-transparent",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Complete Zakat Calculator",
    subtitle: "Ramadan 2026 / 1446–47H",
    description: "Calculate 2.5% Zakat on cash, gold, silver, and business inventory with live Hanafi Nisab verification & deduction logic.",
    href: "/zakat-calculator",
    badge: "Hanafi Nisab",
    badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
    gradient: "from-teal-600/10 via-emerald-500/5 to-transparent",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
    gradient: "from-indigo-600/10 via-blue-500/5 to-transparent",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "GST Calculator (18%)",
    subtitle: "Sales Tax Act 1990",
    description: "Add or remove 18% federal sales tax from any amount, or calculate custom provincial rates with integer paisa precision.",
    href: "/gst-calculator",
    badge: "18% Standard",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    gradient: "from-amber-600/10 via-orange-500/5 to-transparent",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    gradient: "from-emerald-600/10 via-teal-500/5 to-transparent",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F7FA] via-white to-white border-b border-slate-200/80 pt-14 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
        {/* Subtle Ambient Radial Lighting Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-dot-mesh pointer-events-none opacity-60" />

        <div className="relative max-w-[1200px] mx-auto text-center space-y-6 sm:space-y-8">
          {/* Glowing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-accent text-xs font-extrabold uppercase tracking-widest border border-accent/25 shadow-[0_2px_12px_rgba(15,118,110,0.18)] hover:scale-105 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
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

            <p className="text-base sm:text-lg text-appText-muted max-w-2xl mx-auto leading-relaxed font-normal pt-1">
              Instant, private calculations for salary tax, Zakat, property advance tax (236C/236K), GST 18%, and Fitrana. All numbers stay in your browser.
            </p>
          </div>

          {/* Search Box with Deep Shadow */}
          <div className="pt-2 max-w-2xl mx-auto">
            <SearchBox />
          </div>

          {/* Most Searched Quick Links with Micro-Shadows */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-appText-muted">
            <span className="font-bold text-primary mr-1">Most Searched:</span>
            {mostSearched.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-200/90 text-primary hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 font-semibold shadow-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ELEVATED TRUST STRIP
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-20">
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_15px_35px_-5px_rgba(11,42,74,0.08),0_5px_15px_-3px_rgba(11,42,74,0.04)] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <span className="block font-bold text-xs sm:text-sm text-primary">No Login Required</span>
              <span className="text-[11px] text-appText-muted">Open access, no signups</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-4 lg:pt-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 shadow-xs border border-teal-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="block font-bold text-xs sm:text-sm text-primary">100% Client-Side Privacy</span>
              <span className="text-[11px] text-appText-muted">Numbers never leave phone</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-4 lg:pt-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 shadow-xs border border-blue-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="block font-bold text-xs sm:text-sm text-primary">FBR &amp; SBP Verified</span>
              <span className="text-[11px] text-appText-muted">Finance Act 2026 Tables</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 pt-4 lg:pt-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs border border-indigo-100">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="block font-bold text-xs sm:text-sm text-primary">Last Verified</span>
              <span className="text-[11px] text-appText-muted">14 Nov 2026 (Live Audit)</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 5 CALCULATOR CARDS (HARDCOOKED WITH HOVER ELEVATIONS & SHADOWS)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Core Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">
              Pakistan Financial &amp; Islamic Calculators
            </h2>
            <p className="text-sm text-appText-muted mt-1">
              Select any calculator below for instant calculations and complete slab-by-slab breakdown tables.
            </p>
          </div>

          <Link
            href="/methodology"
            className="text-xs font-bold text-accent hover:text-accent-dark flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Verification Tables</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {calculators.map((calc, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-accent/50 p-6 sm:p-7 shadow-[0_10px_30px_-5px_rgba(11,42,74,0.06),0_4px_10px_-2px_rgba(11,42,74,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(11,42,74,0.18)] hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Gradient Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-accent to-accent-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-surface to-slate-100 text-primary group-hover:from-accent-soft group-hover:to-teal-100/60 group-hover:text-accent flex items-center justify-center transition-all duration-300 shadow-sm ring-1 ring-slate-200/70 group-hover:scale-105 group-hover:shadow-md group-hover:ring-accent/30 p-3">
                    {calc.icon}
                  </div>
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${calc.badgeColor}`}
                  >
                    {calc.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-200 mb-1">
                  {calc.title}
                </h3>
                <span className="text-xs font-semibold text-accent block mb-2.5">
                  {calc.subtitle}
                </span>
                <p className="text-sm text-appText-muted leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <Link
                  href={calc.href}
                  className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-surface group-hover:bg-primary text-primary group-hover:text-white font-bold text-sm transition-all duration-300 flex items-center justify-between shadow-xs group-hover:shadow-md"
                >
                  <span>Open Calculator</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (3 STEPS WITH SLEEK NUMERIC BADGES)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-surface via-slate-50 to-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-[0_15px_35px_-5px_rgba(11,42,74,0.06)] space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Simple Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-appText-muted">
              Designed for zero friction, complete confidentiality, and maximum precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-[0_8px_20px_-4px_rgba(11,42,74,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/20">
                1
              </div>
              <h3 className="font-bold text-base text-primary">1. Enter Your Numbers</h3>
              <p className="text-xs sm:text-sm text-appText-muted leading-relaxed">
                Type your monthly salary, property valuation, asset values, or family size. Number parsing ignores spaces and handles commas automatically.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-[0_8px_20px_-4px_rgba(11,42,74,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-accent-light text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-accent/25">
                2
              </div>
              <h3 className="font-bold text-base text-primary">2. Instant Math &amp; Breakdown</h3>
              <p className="text-xs sm:text-sm text-appText-muted leading-relaxed">
                Results calculate live in your browser as you type. Check the complete line-by-line / slab-by-slab breakdown to verify every single rupee.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-[0_8px_20px_-4px_rgba(11,42,74,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-teal-700 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-accent/20">
                3
              </div>
              <h3 className="font-bold text-base text-primary">3. Copy or Print to PDF</h3>
              <p className="text-xs sm:text-sm text-appText-muted leading-relaxed">
                Copy a clean two-line summary for WhatsApp/email or use Print to save a clean PDF of your calculation summary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ TEASER SECTION
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">Common Questions</h2>
            <p className="text-xs sm:text-sm text-appText-muted mt-0.5">
              Quick answers to frequent tax and Islamic calculation queries.
            </p>
          </div>
          <Link
            href="/methodology"
            className="text-xs sm:text-sm font-bold text-accent hover:underline flex items-center gap-1"
          >
            Read Full Methodology →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-[0_8px_20px_-4px_rgba(11,42,74,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Salary Tax</span>
            <h3 className="font-bold text-sm text-primary">Is salary up to Rs 50,000 exempt from tax?</h3>
            <p className="text-xs text-appText-muted leading-relaxed">
              Yes. Under FBR Tax Year 2026-27 slabs, the first Rs 600,000 of annual taxable salary (Rs 50,000/month) is taxed at 0%.
            </p>
            <Link href="/salary-tax-calculator" className="text-xs text-accent font-bold block pt-2 hover:underline">
              View Salary Slabs →
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-[0_8px_20px_-4px_rgba(11,42,74,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Zakat Nisab</span>
            <h3 className="font-bold text-sm text-primary">Should I use Gold or Silver Nisab?</h3>
            <p className="text-xs text-appText-muted leading-relaxed">
              Under Hanafi jurisprudence in Pakistan, if you own mixed assets (cash + gold/silver), the Silver Nisab (52.5 tola) is applied as a precaution to assist the poor.
            </p>
            <Link href="/zakat-calculator" className="text-xs text-accent font-bold block pt-2 hover:underline">
              Calculate Zakat →
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/90 space-y-2.5 shadow-[0_8px_20px_-4px_rgba(11,42,74,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Property Tax</span>
            <h3 className="font-bold text-sm text-primary">How much does a Filer save on property?</h3>
            <p className="text-xs text-appText-muted leading-relaxed">
              On purchasing a 1 Crore property, an active Filer pays 1.25% (Rs 125,000) whereas a Non-Filer pays 10.5% (Rs 1,050,000), saving Rs 925,000.
            </p>
            <Link href="/property-tax-calculator" className="text-xs text-accent font-bold block pt-2 hover:underline">
              Compare 236C &amp; 236K →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
