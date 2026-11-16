import React from "react";
import Link from "next/link";
import { siteConfig } from "@/content/pages";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-appBorder mt-16 print:hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Privacy Claim */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-sm bg-primary text-white flex items-center justify-center font-bold text-xs">
                PK
              </span>
              <span className="font-bold text-primary text-base">
                {siteConfig.brandName}
              </span>
            </div>
            <p className="text-sm text-appText-muted max-w-md">
              Free, verified, and completely private calculation utilities for Pakistan.
              All calculations run 100% locally in your web browser.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{siteConfig.privacyClaim} No server storage or tracking.</span>
            </div>
          </div>

          {/* Column 2: Calculators */}
          <div>
            <h4 className="font-semibold text-primary text-sm mb-3">Calculators</h4>
            <ul className="space-y-2 text-sm text-appText-muted">
              <li>
                <Link href="/salary-tax-calculator" className="hover:text-primary transition-colors">
                  Salary Tax 2026-27
                </Link>
              </li>
              <li>
                <Link href="/zakat-calculator" className="hover:text-primary transition-colors">
                  Complete Zakat
                </Link>
              </li>
              <li>
                <Link href="/property-tax-calculator" className="hover:text-primary transition-colors">
                  Property Tax (236C / 236K)
                </Link>
              </li>
              <li>
                <Link href="/gst-calculator" className="hover:text-primary transition-colors">
                  GST Calculator (18%)
                </Link>
              </li>
              <li>
                <Link href="/fitrana-calculator" className="hover:text-primary transition-colors">
                  Fitrana 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Info & Legal */}
          <div>
            <h4 className="font-semibold text-primary text-sm mb-3">Platform & Legal</h4>
            <ul className="space-y-2 text-sm text-appText-muted">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-primary transition-colors">
                  Methodology & Sources
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-appBorder flex flex-col sm:flex-row items-center justify-between text-xs text-appText-muted gap-3">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.brandName}. All rights reserved.
          </p>
          <p className="font-medium text-appText text-center sm:text-right">
            Estimates only — not tax, legal, or religious advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
