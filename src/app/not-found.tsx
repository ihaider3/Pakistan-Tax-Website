import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | CalculationHub",
  description: "The requested page could not be found. Return to CalculationHub homepage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-[#0E355E] to-accent text-white flex items-center justify-center font-black text-2xl mb-6 shadow-lg shadow-primary/20">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-2">
        Page Not Found — Safha Dastiyab Nahi
      </h1>
      <p className="text-sm text-slate-600 max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-[#071F36] active:scale-98 text-white font-bold text-sm transition-all shadow-md shadow-primary/25 cursor-pointer"
      >
        <span>←</span>
        <span>Back to Homepage</span>
      </Link>
    </div>
  );
}

