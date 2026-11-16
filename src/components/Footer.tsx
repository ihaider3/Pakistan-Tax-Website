import React from "react";
import Link from "next/link";
import { siteConfig } from "@/content/pages";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-surface via-[#F0F3F7] to-slate-100 border-t border-slate-200/90 mt-20 print:hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Column 1: Brand & Privacy Claim */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-black text-xs shadow-md shadow-primary/20">
                PK
              </div>
              <span className="font-extrabold text-primary text-lg tracking-tight">
                {siteConfig.brandName}
              </span>
            </div>
            <p className="text-sm text-appText-muted max-w-md leading-relaxed">
              Free, verified, and completely private calculation utilities for Pakistan.
              All calculations run 100% locally in your web browser with zero server data storage.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-accent text-xs font-bold border border-slate-200 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>{siteConfig.privacyClaim} No server tracking.</span>
            </div>
          </div>

          {/* Column 2: Calculators */}
          <div>
            <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider mb-4">
              Calculators
            </h4>
            <ul className="space-y-2.5 text-sm text-appText-muted font-medium">
              <li>
                <Link href="/salary-tax-calculator" className="hover:text-accent transition-colors">
                  Salary Tax 2026-27
                </Link>
              </li>
              <li>
                <Link href="/zakat-calculator" className="hover:text-accent transition-colors">
                  Complete Zakat (2.5%)
                </Link>
              </li>
              <li>
                <Link href="/property-tax-calculator" className="hover:text-accent transition-colors">
                  Property Tax (236C / 236K)
                </Link>
              </li>
              <li>
                <Link href="/gst-calculator" className="hover:text-accent transition-colors">
                  GST Calculator (18%)
                </Link>
              </li>
              <li>
                <Link href="/fitrana-calculator" className="hover:text-accent transition-colors">
                  Fitrana 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Info & Legal */}
          <div>
            <h4 className="font-extrabold text-primary text-sm uppercase tracking-wider mb-4">
              Platform &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-appText-muted font-medium">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-accent transition-colors">
                  Methodology &amp; Sources
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-accent transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact &amp; Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-appText-muted gap-3">
          <p className="font-medium">
            © {siteConfig.copyrightYear} {siteConfig.brandName}. All rights reserved.
          </p>
          <p className="font-bold text-primary text-center sm:text-right">
            Estimates only — not tax, legal, or religious advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
