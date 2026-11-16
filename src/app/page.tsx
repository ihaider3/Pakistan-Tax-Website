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
    description: "Calculate your monthly tax deduction, annual tax, and take-home pay based on official FBR progressive slabs.",
    href: "/salary-tax-calculator",
    badge: "FBR Verified",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Complete Zakat Calculator",
    subtitle: "Ramadan 2026 / 1446–47H",
    description: "Calculate 2.5% Zakat on cash, gold, silver, and business inventory with live Hanafi Nisab verification.",
    href: "/zakat-calculator",
    badge: "Hanafi Nisab",
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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "GST Calculator (18%)",
    subtitle: "Sales Tax Act 1990",
    description: "Add or remove 18% federal sales tax from any amount, or enter custom provincial rates with integer paisa precision.",
    href: "/gst-calculator",
    badge: "18% Standard",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
      </svg>
    ),
  },
  {
    title: "Fitrana Calculator 2026",
    subtitle: "Sadqat-ul-Fitr",
    description: "Calculate household Fitrana for Eid-ul-Fitr 2026. Compare Mufti Muneeb and Council of Islamic Ideology rates.",
    href: "/fitrana-calculator",
    badge: "Wheat Rs 300",
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
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="bg-gradient-to-b from-surface via-white to-white border-b border-appBorder py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-semibold uppercase tracking-wider border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
            Verified Against Official 2026–27 Notifications
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight max-w-4xl mx-auto leading-tight">
            Pakistan Financial &amp; Islamic Calculators — Free, Accurate, No Login
          </h1>

          <p className="text-base sm:text-lg text-appText-muted max-w-2xl mx-auto leading-relaxed">
            Instant, private calculations for salary tax, Zakat, property advance tax (236C/236K), GST 18%, and Fitrana. All numbers stay in your browser.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <SearchBox />
          </div>

          {/* Most Searched Quick Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-appText-muted">
            <span className="font-semibold text-appText">Most Searched:</span>
            {mostSearched.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="px-2.5 py-1 rounded-md bg-white border border-appBorder text-primary hover:border-accent hover:text-accent transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          TRUST STRIP
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-xl p-4 sm:p-5 border border-appBorder flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm text-appText-muted font-medium text-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>No Login Required</span>
          </div>
          <span className="text-appBorder hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>No Data Stored (100% Client-Side)</span>
          </div>
          <span className="text-appBorder hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Verified Against FBR &amp; State Bank</span>
          </div>
          <span className="text-appBorder hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Last Verified: 14 Nov 2026</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 5 CALCULATORS GRID (Mobile 1 col, Desktop 3 cols)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Pakistan Financial &amp; Islamic Calculators</h2>
          <p className="text-sm text-appText-muted mt-1">
            Choose a calculator below to view instant results and full line-by-line breakdown tables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-appBorder hover:border-accent hover:shadow-lg transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-surface text-primary flex items-center justify-center">
                    {calc.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20">
                    {calc.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-primary mb-1">{calc.title}</h3>
                <span className="text-xs font-semibold text-accent block mb-2">{calc.subtitle}</span>
                <p className="text-sm text-appText-muted leading-relaxed">{calc.description}</p>
              </div>

              <div className="pt-6 border-t border-appBorder mt-6">
                <Link
                  href={calc.href}
                  className="w-full min-h-[44px] py-2 px-4 rounded-md bg-surface text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-between"
                >
                  <span>Calculate</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (3 STEPS)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-appBorder space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-primary">How It Works</h2>
            <p className="text-sm text-appText-muted">
              Three simple steps to calculate your financial obligations with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-appBorder text-center space-y-3 shadow-xs">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-bold text-base flex items-center justify-center mx-auto">
                1
              </span>
              <h3 className="font-bold text-base text-primary">1. Enter Your Amount</h3>
              <p className="text-xs sm:text-sm text-appText-muted">
                Type your salary, property value, asset balances, or family size. Number formatting handles commas automatically.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-appBorder text-center space-y-3 shadow-xs">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-bold text-base flex items-center justify-center mx-auto">
                2
              </span>
              <h3 className="font-bold text-base text-primary">2. Instant Result &amp; Breakdown</h3>
              <p className="text-xs sm:text-sm text-appText-muted">
                Results calculate live as you type. Review the detailed slab-by-slab breakdown table to verify every rupee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-appBorder text-center space-y-3 shadow-xs">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-bold text-base flex items-center justify-center mx-auto">
                3
              </span>
              <h3 className="font-bold text-base text-primary">3. Copy or Print to PDF</h3>
              <p className="text-xs sm:text-sm text-appText-muted">
                Copy a clean two-line summary for WhatsApp/email or use Print to save a clean PDF of your calculation summary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ TEASER SECTION (3 KEY QUESTIONS)
         ========================================================================= */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-appBorder pb-3">
          <div>
            <h2 className="text-2xl font-bold text-primary">Common Questions</h2>
            <p className="text-xs sm:text-sm text-appText-muted">
              Quick answers to frequent tax and Islamic calculation queries.
            </p>
          </div>
          <Link
            href="/methodology"
            className="text-xs sm:text-sm font-semibold text-accent hover:underline flex items-center gap-1"
          >
            Read Full Methodology →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-xl border border-appBorder space-y-2 shadow-xs">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Salary Tax</span>
            <h3 className="font-bold text-sm text-primary">Is salary up to Rs 50,000 exempt from tax?</h3>
            <p className="text-xs text-appText-muted leading-relaxed">
              Yes. Under FBR Tax Year 2026-27 slabs, the first Rs 600,000 of annual taxable salary (Rs 50,000/month) is taxed at 0%.
            </p>
            <Link href="/salary-tax-calculator" className="text-xs text-accent font-semibold block pt-2">
              View Salary Slabs →
            </Link>
          </div>

          <div className="p-5 bg-white rounded-xl border border-appBorder space-y-2 shadow-xs">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Zakat Nisab</span>
            <h3 className="font-bold text-sm text-primary">Should I use Gold or Silver Nisab?</h3>
            <p className="text-xs text-appText-muted leading-relaxed">
              Under Hanafi jurisprudence in Pakistan, if you own mixed assets (cash + gold/silver), the Silver Nisab (52.5 tola) is applied as a precaution to assist the poor.
            </p>
            <Link href="/zakat-calculator" className="text-xs text-accent font-semibold block pt-2">
              Calculate Zakat →
            </Link>
          </div>

          <div className="p-5 bg-white rounded-xl border border-appBorder space-y-2 shadow-xs">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Property Tax</span>
            <h3 className="font-bold text-sm text-primary">How much does a Filer save on property?</h3>
            <p className="text-xs text-appText-muted leading-relaxed">
              On purchasing a 1 Crore property, an active Filer pays 1.25% (Rs 125,000) whereas a Non-Filer pays 10.5% (Rs 1,050,000), saving Rs 925,000.
            </p>
            <Link href="/property-tax-calculator" className="text-xs text-accent font-semibold block pt-2">
              Compare 236C &amp; 236K →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
