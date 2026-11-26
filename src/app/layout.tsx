import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingFeedbackButton from "@/components/FloatingFeedbackButton";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { LanguageProvider } from "@/components/LanguageContext";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { PwaProvider } from "@/components/PwaInstallPrompt";
import { getSiteContentOverrides } from "@/lib/content/contentServer";
import DeferredSpeedInsights from "@/components/DeferredSpeedInsights";
import ContentProtection from "@/components/ContentProtection";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-urdu",
  preload: false,
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CalculationHub | Free Financial & Islamic Calculators",
    template: "%s",
  },
  description:
    "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
  keywords: [
    "pakistan tax calculator",
    "salary tax calculator pakistan",
    "zakat calculator pakistan",
    "gst calculator pakistan",
    "property tax calculator pakistan",
    "fitrana calculator pakistan",
    "fbr tax slabs 2026-27",
  ],
  authors: [{ name: "CalculationHub Team" }],
  creator: "CalculationHub",
  publisher: "CalculationHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Calc Hub",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "CalculationHub",
    title: "CalculationHub | Free Financial & Islamic Calculators",
    description:
      "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
    images: [
      {
        url: "/images/og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CalculationHub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CalculationHub | Free Financial & Islamic Calculators",
    description:
      "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
    images: ["/images/og-share-1200x630.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleb95bc473fa354448",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B2A4A",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialContent = await getSiteContentOverrides();

  return (
    <html lang="en" suppressHydrationWarning className={`overflow-x-clip ${inter.variable} ${notoNastaliq.variable}`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-appText font-sans selection:bg-accent-soft selection:text-accent overflow-x-clip w-full">
        <Script
          id="meta-pixel-and-ads"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `!function(f,n){if(!f.fbq){n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}fbq('init', '1774525983843690');fbq('track', 'PageView');var loaded=false;function load3p(){if(loaded)return;loaded=true;['pointerdown','touchstart','keydown','scroll'].forEach(function(ev){window.removeEventListener(ev,load3p)});var b=document,t=b.createElement('script');t.async=true;t.src='https://connect.facebook.net/en_US/fbevents.js';b.head.appendChild(t);var a=b.createElement('script');a.async=true;a.crossOrigin='anonymous';a.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9434774796732008';b.head.appendChild(a);}['pointerdown','touchstart','keydown','scroll'].forEach(function(ev){window.addEventListener(ev,load3p,{passive:true,once:true})});setTimeout(load3p,6000);}(window);`,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1774525983843690&ev=PageView&noscript=1" alt="" />`,
          }}
        />
        <SiteContentProvider initialContent={initialContent}>
          <LanguageProvider>
            <PwaProvider>
              <ContentProtection />
              <AnalyticsTracker />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <FloatingFeedbackButton />
              <DeferredSpeedInsights />
            </PwaProvider>
          </LanguageProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
