import React from "react";
import { siteConfig } from "@/content/pages";

export const metadata = {
  title: "Disclaimer — Pakistan Financial & Islamic Calculators",
  description:
    "Estimates only disclaimer for Pakistan Finance Calculators. Calculations are provided for informational guidance and do not constitute legal, tax, or religious rulings.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
          Legal &amp; Religious Disclaimer
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
          Platform Disclaimer &amp; Terms
        </h1>
        <p className="text-base text-appText-muted mt-2">
          Effective Date: Tax Year 2026–27 / Ramadan 2026.
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-appText leading-relaxed">
        <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 space-y-2">
          <h2 className="text-lg font-bold text-amber-900">General Notice: Estimates Only</h2>
          <p>
            All calculations generated on <strong>{siteConfig.brandName}</strong> are computerized mathematical estimates based on publicly available statutory schedules and announcements. They do not constitute certified tax advice, legal counsel, or formal Islamic legal rulings (fatwas).
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">1. Income &amp; Property Tax Calculations</h2>
          <p>
            Tax laws in Pakistan, particularly under the Federal Board of Revenue (FBR) and provincial revenue authorities, are subject to statutory amendments, circulars, judicial interpretations, and specific taxpayer circumstances. You must confirm your final tax liability and filing status with a licensed Chartered Accountant (CA), tax advocate, or directly via FBR IRIS before filing returns or executing transactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">2. Islamic Obligations (Zakat &amp; Fitrana)</h2>
          <p>
            Our Zakat and Fitrana calculators reflect standard rulings under Hanafi Islamic jurisprudence and official scholarly announcements in Pakistan (including Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology). However, individual circumstances—such as non-standard business arrangements, mixed debt structures, disputed assets, or alternative school of thought rulings (Shafi&apos;i, Maliki, Hanbali, Ja&apos;fari)—require consultation with a qualified Islamic scholar or Mufti.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">3. Limitation of Liability</h2>
          <p>
            While every effort is made to maintain complete accuracy with official rate tables (last verified: 14 Nov 2026), {siteConfig.brandName} and its operators accept no liability for financial penalties, tax shortfalls, business decisions, or religious discrepancies arising from the use of this website.
          </p>
        </section>
      </div>
    </div>
  );
}

