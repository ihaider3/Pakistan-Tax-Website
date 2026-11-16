import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pakistan Financial & Islamic Calculators — Free Salary Tax, Zakat, GST & Property Calculators",
  description:
    "Free, accurate Pakistan calculators for salary tax 2026-27, Zakat, property tax 236C/236K, GST 18% and Fitrana. No login. Instant result with full breakdown in English + Roman Urdu.",
  keywords: [
    "pakistan tax calculator",
    "salary tax calculator pakistan",
    "zakat calculator pakistan",
    "gst calculator pakistan",
    "property tax calculator pakistan",
  ],
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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-appText font-sans selection:bg-accent-soft selection:text-accent">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
