import type { Metadata, Viewport } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingFeedbackButton from "@/components/FloatingFeedbackButton";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { LanguageProvider } from "@/components/LanguageContext";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://pak-tax-cal.vercel.app"),
  title: {
    default: "Pakistan Finance Calculators | Tax, Zakat & GST Tools",
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
  authors: [{ name: "Pakistan Finance Calculators Team" }],
  creator: "Pakistan Finance Calculators",
  publisher: "Pakistan Finance Calculators",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://pak-tax-cal.vercel.app",
    siteName: "Pakistan Finance Calculators",
    title: "Pakistan Finance Calculators | Tax, Zakat & GST Tools",
    description:
      "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Finance Calculators | Tax, Zakat & GST Tools",
    description:
      "Free Pakistan tax, Zakat, property & GST calculators. Instant results with slab breakdown in English and Roman Urdu. No login, 100% private client-side.",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`overflow-x-hidden ${inter.variable} ${notoNastaliq.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-appText font-sans selection:bg-accent-soft selection:text-accent overflow-x-hidden w-full">
        <LanguageProvider>
          <AnalyticsTracker />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingFeedbackButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
