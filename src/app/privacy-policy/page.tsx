import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/content/pages";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | 100% Client-Side Private Calculators",
  description:
    "Read our 100% client-side privacy policy. Your financial numbers never leave your phone or browser. Zero server storage, no database, and no cookies.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | 100% Client-Side Private Calculators",
    description:
      "Read our 100% client-side privacy policy. Your financial numbers never leave your phone or browser. Zero server storage, no database, and no cookies.",
    url: `${siteUrl}/privacy-policy`,
    type: "website",
    siteName: "Pakistan Finance Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | 100% Client-Side Private Calculators",
    description:
      "Read our 100% client-side privacy policy. Your financial numbers never leave your phone or browser. Zero server storage, no database, and no cookies.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent-soft px-2.5 py-1 rounded-full border border-accent/20">
          Privacy Policy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-2">
          Your Numbers Never Leave Your Device
        </h1>
        <p className="text-base text-appText-muted mt-2">
          Last updated: 14 Nov 2026. Read how we protect your personal financial privacy.
        </p>
      </div>

      <div className="space-y-6 text-sm sm:text-base text-appText leading-relaxed">
        <div className="p-5 bg-accent-soft rounded-xl border border-accent/30 space-y-2">
          <h2 className="text-lg font-bold text-accent">Zero Server Storage Guarantee</h2>
          <p className="text-appText">
            When you enter your salary, cash balances, property valuations, or family size into any calculator on <strong>{siteConfig.brandName}</strong>, that information is processed exclusively inside your device&apos;s web browser memory.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">1. No Backend &amp; No Database</h2>
          <p>
            This website does not have a backend database or user account system. We do not store your name, CNIC, salary figures, bank balances, or real estate values. When you close or refresh your browser tab, your entered numbers are gone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">2. No Account Registration or Login</h2>
          <p>
            You will never be asked to sign up, provide an email address, or log in to use our calculators. All tools are 100% free and open for public benefit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">3. Analytics &amp; Cookies</h2>
          <p>
            The site counts visits and calculator uses to improve the website. It records only the page visited, the tool used, the device type, and the referrer domain. It uses no cookies, stores no IP address, name, or email for analytics, and never records the numbers entered into a calculator.
          </p>
          <p className="text-xs sm:text-sm text-appText-muted italic bg-surface p-3 rounded-lg border border-appBorder">
            <strong>Roman Urdu:</strong> Website par sirf visit count aur calculator istemal ka record rakha jata hai taa ke service behtar ki ja sake; koi zaati maloomat, IP address ya calculator mein likhi gayi raqam kabhi save nahi ki jati.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">4. Contacting Us</h2>
          <p>
            If you have questions regarding this privacy policy or our technical architecture, please reach out via our{" "}
            <a href="/contact" className="text-accent font-semibold hover:underline">
              Contact Page
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-primary">5. User Feedback &amp; Defect Reports</h2>
          <p>
            When you voluntarily submit a bug report, feedback, or feature suggestion using our on-site feedback button, we collect your selected category, calculator context, message, optional rating, optional name, optional email address, optional screenshot, and submission date. This information is collected solely to fix technical defects, verify statutory tax calculations, and improve the website.
          </p>
          <p>
            Feedback submissions are never published publicly and are accessible exclusively to the website administrator in a password-protected dashboard. Screenshots are stored in private cloud storage and never exposed to the public. Providing your name or email is completely optional; if provided, your email is never shared, sold, or used for marketing. You can request permanent deletion of any feedback you submitted at any time by emailing us at{" "}
            <a href="mailto:contact@pakfinancecalc.org" className="text-accent font-semibold hover:underline">
              contact@pakfinancecalc.org
            </a>
            .
          </p>
          <p className="text-xs sm:text-sm text-appText-muted italic bg-surface p-3 rounded-lg border border-appBorder">
            <strong>Roman Urdu:</strong> Aapka feedback, suggestion ya screenshot sirf website ko behtar banane aur masail hal karne ke liye istemal hota hai, kabhi public nahi kiya jata, aur aap contact@pakfinancecalc.org par email kar ke apna data delete karwa sakte hain.
          </p>
        </section>
      </div>
    </div>
  );
}

