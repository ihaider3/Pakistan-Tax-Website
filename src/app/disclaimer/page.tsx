import React from "react";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/content/pages";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer & Terms — CalculationHub Tax Calculators",
  description:
    "Please read CalculationHub's official legal and religious disclaimer. All calculation estimates are for general guidance only — not tax or religious advice.",
  alternates: {
    canonical: `${siteUrl}/disclaimer`,
  },
  openGraph: {
    title: "Disclaimer & Terms — CalculationHub Tax Calculators",
    description:
      "Please read CalculationHub's official legal and religious disclaimer. All calculation estimates are for general guidance only — not tax or religious advice.",
    url: `${siteUrl}/disclaimer`,
    type: "website",
    siteName: "CalculationHub",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub — Disclaimer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer & Terms — CalculationHub Tax Calculators",
    description:
      "Please read CalculationHub's official legal and religious disclaimer. All calculation estimates are for general guidance only — not tax or religious advice.",
    images: ["/images/og-share-1200x630.png"],
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <Breadcrumb items={[{ label: "Disclaimer", href: "/disclaimer" }]} />
      <div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
          Legal &amp; Religious Disclaimer
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
          Platform Disclaimer &amp; Terms
        </h1>
        <p className="text-base text-appText-muted mt-2">
          Effective Date: Tax Year 2026–27 / Ramadan 2026. General guidance and terms of use.
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
          <h2 className="text-xl font-bold text-primary">2. Islamic Obligations (Zakat, Fitrana &amp; Ushr)</h2>
          <p>
            Our Zakat, Fitrana, and Ushr calculators reflect standard rulings under Hanafi Islamic jurisprudence and official scholarly announcements in Pakistan (including Mufti Muneeb-ur-Rehman and the Council of Islamic Ideology). However, individual circumstances—such as non-standard business arrangements, mixed debt structures, disputed agricultural tenures, or alternative school of thought rulings (Shafi&apos;i, Maliki, Hanbali, Ja&apos;fari)—require consultation with a qualified Islamic scholar or Mufti.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-primary">3. Rate Verification &amp; Limitation of Liability</h2>
          <p>
            Gold and silver prices are fetched live every time you open the Zakat page, from international spot prices (gold-api.com) and USD/PKR (open.er-api.com). Tax slabs, property rates and GST were last verified against FBR&apos;s Finance Act 2026 and Circular No. 02 of 2026-27 in November 2026. Fitrana rates are from the 21 February 2026 announcement by Mufti Muneeb-ur-Rehman.
          </p>
          <p>
            While every effort is made to maintain complete accuracy with official rate tables, {siteConfig.brandName} and its operators accept no liability for financial penalties, tax shortfalls, business decisions, or religious discrepancies arising from the use of this website.
          </p>
          <div className="text-xs sm:text-sm text-appText-muted italic bg-surface p-4 rounded-xl border border-appBorder space-y-2 mt-2">
            <p>
              <strong className="text-primary not-italic font-bold">Roman Urdu:</strong>{" "}
              Gold aur silver ki qeematein Zakat page kholne par har dafa live aati hain — international spot prices (gold-api.com) aur USD/PKR (open.er-api.com) se. Tax slabs, property rates aur GST November 2026 mein FBR ke Finance Act 2026 aur Circular No. 02 of 2026-27 se verify kiye gaye the. Fitrana ki rates 21 February 2026 ke Mufti Muneeb-ur-Rehman ke ailaan se hain.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-primary">4. Copyright</h2>
          <p>
            All content on this website — including text, explanations, design, layout, logo and code — is the property of CalculationHub and is protected by copyright law. It may not be copied, reproduced, republished or distributed, in whole or in part, without written permission from CalculationHub.
          </p>
          <p>
            Public facts and formulas — such as government tax slabs, Zakat rates and Ushr rules — are public information and are not claimed as our property. Anyone may build their own calculator using the same public rules, but they may not copy our text, design or code.
          </p>
          <p>
            If you find our content copied on another website, please report it to us at{" "}
            <a
              href="mailto:contact@calculationhubs.com"
              className="text-accent font-semibold hover:underline"
            >
              contact@calculationhubs.com
            </a>
            .
          </p>

          <div className="text-xs sm:text-sm text-appText-muted italic bg-surface p-4 rounded-xl border border-appBorder space-y-2 mt-2">
            <p>
              <strong className="text-primary not-italic font-bold">Roman Urdu:</strong>{" "}
              Is website ka tamam content — text, wazahat, design, layout, logo aur code — CalculationHub ki milkiyat hai aur copyright qanoon ke tehet mehfooz hai. Ise CalculationHub ki likhi hui ijazat ke baghair copy, dobara shaya ya taqseem nahi kiya ja sakta. Sarkari tax slabs, Zakat aur Ushr ke usool aam maloomat hain — in par hamara daawa nahi hai; koi bhi inhi usool par apna calculator bana sakta hai, lekin hamara text, design ya code copy nahi kar sakta. Agar aap ko hamara content kisi aur website par mile to{" "}
              <a
                href="mailto:contact@calculationhubs.com"
                className="text-accent font-semibold hover:underline not-italic"
              >
                contact@calculationhubs.com
              </a>{" "}
              par report karein.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

