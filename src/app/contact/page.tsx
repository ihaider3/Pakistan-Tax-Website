import React from "react";
import { siteConfig } from "@/content/pages";

export const metadata = {
  title: "Contact Us — Pakistan Financial & Islamic Calculators",
  description:
    "Get in touch with the team behind Pakistan Financial & Islamic Calculators. Report rate changes, suggest enhancements, or send feedback.",
};

export default function ContactPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
          Contact &amp; Feedback
        </h1>
        <p className="text-base text-appText-muted mt-2">
          Notice a rate change in a new FBR circular or scholarly announcement? Let us know so we can update the platform within 48 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-surface text-primary flex items-center justify-center font-bold">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-primary">Email Support &amp; Rate Tips</h2>
          <p className="text-sm text-appText-muted">
            Send inquiries, bug reports, or official gazette notifications directly to our verification team:
          </p>
          <a
            href="mailto:contact@pakfinancecalc.org"
            className="text-accent font-semibold text-sm hover:underline block"
          >
            contact@pakfinancecalc.org
          </a>
        </div>

        <div className="p-6 bg-white rounded-xl border border-appBorder shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-surface text-primary flex items-center justify-center font-bold">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-primary">Maintenance SLA</h2>
          <p className="text-sm text-appText-muted">
            Following every Federal Budget (June) and pre-Ramadan announcements, our policy is to verify and push updated rates within <strong>48 hours</strong> of official gazette publication.
          </p>
        </div>
      </div>

      <div className="p-5 bg-surface rounded-xl border border-appBorder text-xs sm:text-sm text-appText-muted space-y-2">
        <h3 className="font-bold text-primary">Need Professional Representation?</h3>
        <p>
          Please note that {siteConfig.brandName} is an independent digital tool platform. We do not provide one-on-one tax filing services, IRIS submission assistance, or religious issuing of fatwas. Please contact a licensed member of ICAP/ICMAP or your local Dar-ul-Ifta.
        </p>
      </div>
    </div>
  );
}
