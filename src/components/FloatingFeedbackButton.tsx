"use client";

import React, { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FloatingFeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* DESKTOP BUTTON: Fixed to right edge, vertically centered, vertical pill */}
      <div className="hidden sm:block fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-1.5 py-3 px-2 bg-[#0B2A4A] hover:bg-[#0F766E] text-white rounded-l-lg shadow-elevated transition-all duration-200 border-y border-l border-white/20 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F766E]/50"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          aria-label="Open feedback modal"
        >
          <span className="flex items-center space-x-1 transform rotate-180">
            <svg
              className="w-4 h-4 text-white transform -rotate-90 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="text-xs font-bold tracking-wider uppercase">Feedback</span>
          </span>
        </button>
      </div>

      {/* MOBILE BUTTON: Fixed bottom-right circular button (56px), bottom: 20px; right: 16px */}
      <div className="sm:hidden fixed bottom-5 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#0B2A4A] hover:bg-[#0F766E] active:bg-[#071B30] text-white shadow-elevated flex flex-col items-center justify-center border border-white/20 transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F766E]/50"
          aria-label="Open feedback modal"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5 leading-none">
            Feedback
          </span>
        </button>
      </div>

      {/* Modal */}
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
