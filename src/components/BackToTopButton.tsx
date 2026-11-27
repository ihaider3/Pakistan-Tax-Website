"use client";

import React from "react";

export default function BackToTopButton() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/10 hover:bg-accent text-white font-extrabold text-xs transition-all duration-200 border border-white/20 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
    >
      <span>Back to Top</span>
      <span className="group-hover:-translate-y-1 transition-transform">↑</span>
    </button>
  );
}
