import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { salaryRates2026_27 } from "@/lib/rates/salary-2026-27";
import { propertyRates2026_27 } from "@/lib/rates/property-2026-27";
import { gstRates } from "@/lib/rates/gst";
import { zakatRates } from "@/lib/rates/zakat";
import { fitranaRates2026 } from "@/lib/rates/fitrana-2026";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Methodology & Sources | CalculationHub",
  description:
    "Read official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, and Fitrana calculation rules.",
  alternates: {
    canonical: `${siteUrl}/methodology`,
  },
  openGraph: {
    title: "Methodology & Sources | CalculationHub",
    description:
      "Read official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, and Fitrana calculation rules.",
    url: `${siteUrl}/methodology`,
    type: "website",
    siteName: "CalculationHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Methodology & Sources | CalculationHub",
    description:
      "Read official statutory methodology and legal references for Pakistan salary tax, Zakat, 236C/236K property tax, GST, and Fitrana calculation rules.",
  },
};

export default function MethodologyPage() {
  return (
    <div className="max-w-[850px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
          Statutory Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
          Methodology &amp; Statutory Sources
        </h1>
        <p className="text-base text-appText-muted mt-2 leading-relaxed">
          How our calculation engines operate, which legal and religious statutes govern them, and exactly what is included or excluded.
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-appText leading-relaxed">
        {/* Salary Tax */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">1. Salary Tax Calculator (Section 149)</h2>
            <span className="text-xs font-semibold text-accent">{salaryRates2026_27.taxYearCode}</span>
          </div>
          <p>
            <strong>Statutory Reference:</strong> {salaryRates2026_27.metadata.sourceDocument}. Last verified: {salaryRates2026_27.metadata.lastVerified}.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            <p>
              <strong>Calculation Mechanics:</strong> Tax is computed progressively across 8 statutory slabs. Each tax rate applies strictly to the slice of income within that respective slab bracket. Monthly tax deduction is calculated as annual tax divided by 12. Monthly take-home is gross salary minus monthly tax.
            </p>
            <p>
              <strong>What is Included:</strong> Progressive rates from 0% (up to Rs 600,000) to 35% (above Rs 7,000,000). Salaried surcharge is confirmed abolished for Tax Year 2027.
            </p>
            <p>
              <strong>What is Excluded:</strong> Non-salaried income, commercial profits, freelance contract receipts under Section 154A, rental income under Section 15, and capital gains.
            </p>
          </div>
          <Link href="/salary-tax-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Salary Tax Calculator &rarr;
          </Link>
        </div>

        {/* Zakat Calculator */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">2. Complete Zakat Calculator</h2>
            <span className="text-xs font-semibold text-accent">Hanafi Standard</span>
          </div>
          <p>
            <strong>Statutory &amp; Religious Reference:</strong> {zakatRates.metadata.sourceDocument}. Last verified: {zakatRates.metadata.lastVerified}.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            <p>
              <strong>Nisab Rule:</strong> Gold Nisab is 87.48 grams (7.5 tola). Silver Nisab is 612.36 grams (52.5 tola). In accordance with the prevalent Hanafi school in Pakistan, if wealth is mixed (cash + gold + investments), the Silver Nisab threshold is applied as a precaution to benefit the poor.
            </p>
            <p>
              <strong>Market Rates:</strong> Rates update automatically every day at 12:00 PKT from the international spot price (gold-api.com + open.er-api.com); the page shows the last update time.
            </p>
            <p>
              <strong>Bank Deduction Distinction:</strong> The government notified threshold of Rs 503,529 (SBP Circular 03/2026) is strictly for automatic bank deductions from savings accounts on 1 Ramadan, NOT personal Shariah Nisab.
            </p>
            <p>
              <strong>What is Excluded:</strong> Agricultural Ushr (5%–10%), livestock (An&apos;am), and complex business partnerships which require direct consultation with a qualified Mufti.
            </p>
          </div>
          <Link href="/zakat-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Zakat Calculator &rarr;
          </Link>
        </div>

        {/* Property Advance Tax */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">3. Property Advance Tax (236C &amp; 236K)</h2>
            <span className="text-xs font-semibold text-accent">{propertyRates2026_27.taxYearCode}</span>
          </div>
          <p>
            <strong>Statutory Reference:</strong> {propertyRates2026_27.metadata.sourceDocument}. Last verified: {propertyRates2026_27.metadata.lastVerified}.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            <p>
              <strong>Buyer Advance Tax (Section 236K):</strong> Active Filer (ATL) rate is 1.25% flat. Non-filer rate is tiered: 10.5% (up to Rs 50M), 14.5% (Rs 50M to 100M), and 18.5% (above Rs 100M).
            </p>
            <p>
              <strong>Seller Advance Tax (Section 236C):</strong> Active Filer rate is 2.75% flat. Non-filer rate is 11.5% flat.
            </p>
            <p>
              <strong>Late-Filer Note:</strong> The late-filer rate was abolished in Finance Act 2026; taxpayers are categorized strictly as Filer or Non-Filer.
            </p>
            <p>
              <strong>What is Excluded:</strong> Provincial stamp duties, Capital Value Tax (CVT), local registration charges, and Capital Gains Tax (CGT) under Section 37.
            </p>
          </div>
          <Link href="/property-tax-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Property Tax Calculator &rarr;
          </Link>
        </div>

        {/* GST */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">4. General Sales Tax (GST)</h2>
            <span className="text-xs font-semibold text-accent">Federal 18%</span>
          </div>
          <p>
            <strong>Statutory Reference:</strong> {gstRates.metadata.sourceDocument}. Last verified: {gstRates.metadata.lastVerified}.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            <p>
              <strong>Calculation Formulas:</strong> Add GST computes tax as Base &times; (Rate / 100). Remove GST extracts base as Total / (1 + Rate / 100). All rupee calculations are rounded in integer paisa to eliminate floating point distortion.
            </p>
            <p>
              <strong>Services Discrepancy:</strong> Federal GST on goods is fixed at 18%. Services taxes are governed provincially (Sindh Revenue Board, Punjab Revenue Authority, KPRA, BRA) with varying rates (13%–16%). Therefore, provincial rates are supported via the Custom Rate input rather than hardcoded presets.
            </p>
          </div>
          <Link href="/gst-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open GST Calculator &rarr;
          </Link>
        </div>

        {/* Fitrana */}
        <div className="bg-white p-6 rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-appBorder pb-2">
            <h2 className="text-lg font-bold text-primary">5. Fitrana (Sadqat-ul-Fitr)</h2>
            <span className="text-xs font-semibold text-accent">Ramadan 2026</span>
          </div>
          <p>
            <strong>Scholarly Sources:</strong> {fitranaRates2026.metadata.sourceDocument}. Last verified: {fitranaRates2026.metadata.lastVerified}.
          </p>
          <div className="space-y-2 text-sm text-appText-muted">
            <p>
              <strong>Consensus vs Conflicting Rates:</strong> Both Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology (CII) unanimously agree on <strong>Rs 300 per person</strong> for 2 kg Wheat (Gandum). For Barley (Rs 1,160 vs Rs 1,100), Dates (Rs 2,800 vs Rs 1,600), and Raisins (Rs 7,200 vs Rs 3,800), rates diverge based on retail market samples. Our calculator displays both tables side-by-side with full transparency.
            </p>
            <p>
              <strong>What is Excluded:</strong> Fidya for missed fasts due to chronic illness and Kaffara for broken fasts/oaths.
            </p>
          </div>
          <Link href="/fitrana-calculator" className="text-xs font-bold text-accent hover:underline block pt-1">
            Open Fitrana Calculator &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

