import React from "react";
import { siteConfig } from "@/content/pages";

export const metadata = {
  title: "Privacy Policy — Pakistan Financial & Islamic Calculators",
  description:
    "100% Client-Side Privacy Policy. Your numbers never leave your phone. No backend, no database, no server-side storage of any user input.",
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
            In the MVP version of this platform, we do not deploy invasive marketing trackers, advertising cookies, or third-party behavioral fingerprinting. Standard anonymous server access logs (IP address, browser user agent) are handled securely by our hosting provider (Vercel) solely to serve website files over HTTPS.
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
      </div>
    </div>
  );
}

