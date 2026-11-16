"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useExplanationLang } from "@/components/LanguageContext";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryType = "problem" | "feedback" | "feature";
type CalculatorType = "general" | "salary" | "zakat" | "property" | "gst" | "fitrana";

const CATEGORY_INFO = {
  problem: {
    titleEn: "Report a Problem",
    titleRoman: "Report a Problem (Masla Batayein)",
    descEn: "Wrong calculator result, a button not working, or incorrect/outdated information.",
    descRoman: "Calculator ghalat result de raha hai, koi button kaam nahi kar raha, ya koi maloomat ghalat/purani hai.",
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    badgeColor: "bg-red-50 text-red-700 border-red-200",
  },
  feedback: {
    titleEn: "Share Your Feedback",
    titleRoman: "Share Your Feedback (Raye Dein)",
    descEn: "How did you find the website? Was it easy to use? What could be better?",
    descRoman: "Website kaisi lagi? Istemal karna easy tha? Kya behtar ho sakta hai?",
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  feature: {
    titleEn: "Suggest a Feature",
    titleRoman: "Suggest a Feature (Tajveez Dein)",
    descEn: "Suggest a new calculator or feature, or an idea to improve an existing one.",
    descRoman: "Naya calculator ya feature suggest karein, ya maujooda feature ko behtar karne ka idea dein.",
    icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const RATING_LABELS: Record<number, { en: string; roman: string }> = {
  1: { en: "Very Poor", roman: "Bohat Bura" },
  2: { en: "Poor", roman: "Bura" },
  3: { en: "Average", roman: "Theek" },
  4: { en: "Good", roman: "Acha" },
  5: { en: "Excellent", roman: "Zabardast" },
};

function getCalculatorFromPath(pathname: string): CalculatorType {
  if (pathname.includes("salary-tax-calculator")) return "salary";
  if (pathname.includes("zakat-calculator")) return "zakat";
  if (pathname.includes("property-tax-calculator")) return "property";
  if (pathname.includes("gst-calculator")) return "gst";
  if (pathname.includes("fitrana-calculator")) return "fitrana";
  return "general";
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { lang, setLang } = useExplanationLang();
  const pathname = usePathname();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<CategoryType>("feedback");
  const [calculator, setCalculator] = useState<CalculatorType>("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync default calculator when opened
  useEffect(() => {
    if (isOpen) {
      setCalculator(getCalculatorFromPath(pathname));
    }
  }, [isOpen, pathname]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !submitting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, submitting, onClose]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (screenshotPreview) {
        URL.revokeObjectURL(screenshotPreview);
      }
    };
  }, [screenshotPreview]);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: CategoryType) => {
    setCategory(cat);
    if (cat === "problem") {
      setRating(null);
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(
        lang === "en"
          ? "Screenshot must be 2 MB or smaller."
          : "Screenshot 2 MB ya us se chota hona chahiye."
      );
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage(
        lang === "en"
          ? "Only JPG, PNG, or WebP images are supported."
          : "Sirf JPG, PNG ya WebP images upload karein."
      );
      return;
    }

    setErrorMessage(null);
    setScreenshot(file);
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleRemoveScreenshot = () => {
    setScreenshot(null);
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedMsg = message.trim();
    if (trimmedMsg.length < 10) {
      setErrorMessage(
        lang === "en"
          ? "Please write at least 10 characters."
          : "Barah-e-karam kam az kam 10 haroof (characters) likhein."
      );
      return;
    }

    if (trimmedMsg.length > 3000) {
      setErrorMessage(
        lang === "en"
          ? "Message cannot exceed 3000 characters."
          : "Paigham 3000 haroof se lamba nahi ho sakta."
      );
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage(
        lang === "en"
          ? "Please enter a valid email address."
          : "Barah-e-karam sahi email address darj karein."
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("calculator", calculator);
      formData.append("message", trimmedMsg);
      if (name.trim()) formData.append("name", name.trim());
      if (email.trim()) formData.append("email", email.trim());
      if (rating && category !== "problem") formData.append("rating", rating.toString());
      if (honeypot) formData.append("website_url", honeypot);
      if (screenshot) formData.append("screenshot", screenshot);

      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Submission failed");
      }

      setStep(3); // Show success screen
    } catch (err: unknown) {
      console.error("[Feedback Modal] Submit error:", err);
      setErrorMessage(
        lang === "en"
          ? "Something went wrong — please try again."
          : "Koi masla paish aaya — barah-e-karam dobara koshish karein."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setMessage("");
    setRating(null);
    setName("");
    setEmail("");
    setHoneypot("");
    handleRemoveScreenshot();
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Overlay click to dismiss */}
      <div className="absolute inset-0" onClick={submitting ? undefined : handleResetAndClose} />

      <div
        ref={modalRef}
        className="relative w-full sm:max-w-[560px] max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200 border border-appBorder"
      >
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-appBorder flex items-center justify-between bg-surface/50">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-primary">
              {lang === "en" ? "Website Feedback & Support" : "Website Feedback aur Support"}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {/* Modal Language Toggle */}
            <div className="flex rounded-md border border-appBorder overflow-hidden text-xs font-semibold bg-white">
              <button
                type="button"
                onClick={() => setLang("roman")}
                className={`px-2 py-1 transition-colors ${
                  lang === "roman"
                    ? "bg-primary text-white"
                    : "text-appText-muted hover:text-primary hover:bg-surface"
                }`}
              >
                Roman Urdu
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 transition-colors ${
                  lang === "en"
                    ? "bg-primary text-white"
                    : "text-appText-muted hover:text-primary hover:bg-surface"
                }`}
              >
                English
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleResetAndClose}
              disabled={submitting}
              className="p-1.5 rounded-lg text-appText-muted hover:text-primary hover:bg-surface transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-65px)]">
          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-appText-muted">
                  {lang === "en"
                    ? "How can we help you today? Please choose a category:"
                    : "Hum aapki kya madad kar sakte hain? Barah-e-karam category muntakhib karein:"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {(["problem", "feedback", "feature"] as CategoryType[]).map((cat) => {
                  const info = CATEGORY_INFO[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="flex items-start space-x-3.5 p-4 rounded-xl border border-appBorder hover:border-accent/50 hover:bg-accent-soft/40 transition-all text-left group bg-white shadow-xs hover:shadow-sm"
                    >
                      <div className="p-2 rounded-lg bg-surface group-hover:bg-white border border-appBorder/50 shrink-0 mt-0.5">
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm sm:text-base text-primary group-hover:text-accent">
                            {lang === "en" ? info.titleEn : info.titleRoman}
                          </h3>
                          <span className="text-appText-muted group-hover:text-accent text-sm">→</span>
                        </div>
                        <p className="text-xs sm:text-sm text-appText-muted mt-1 leading-relaxed">
                          {lang === "en" ? info.descEn : info.descRoman}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: FORM */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category chip & back action */}
              <div className="flex items-center justify-between pb-1 border-b border-appBorder/50">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-appText-muted">
                    {lang === "en" ? "Category:" : "Category:"}
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${CATEGORY_INFO[category].badgeColor}`}
                  >
                    <span>{CATEGORY_INFO[category].icon}</span>
                    <span>{lang === "en" ? CATEGORY_INFO[category].titleEn : CATEGORY_INFO[category].titleRoman}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  {lang === "en" ? "Change Category" : "Tabdeel karein"}
                </button>
              </div>

              {/* Calculator Dropdown */}
              <div className="space-y-1">
                <label htmlFor="pfc-calc-select" className="block text-xs sm:text-sm font-semibold text-primary">
                  {lang === "en" ? "Select Calculator" : "Calculator Muntakhib Karein"}
                  {category === "problem" && <span className="text-red-500 ml-1">*</span>}
                  {category !== "problem" && (
                    <span className="text-xs text-appText-muted font-normal ml-1">
                      ({lang === "en" ? "Optional" : "Ikhtiyari"})
                    </span>
                  )}
                </label>
                <select
                  id="pfc-calc-select"
                  value={calculator}
                  onChange={(e) => setCalculator(e.target.value as CalculatorType)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-appBorder focus:outline-none focus:ring-2 focus:ring-accent/40 bg-white text-appText"
                >
                  <option value="general">{lang === "en" ? "General / Website" : "Aam / Website"}</option>
                  <option value="salary">Salary Tax Calculator</option>
                  <option value="zakat">Zakat Calculator</option>
                  <option value="property">Property Tax Calculator (236C/K)</option>
                  <option value="gst">GST Calculator (18%)</option>
                  <option value="fitrana">Fitrana Calculator</option>
                </select>
              </div>

              {/* Star Rating (Feedback & Feature only) */}
              {category !== "problem" && (
                <div className="space-y-1.5 p-3 rounded-lg bg-surface/60 border border-appBorder/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      {lang === "en" ? "Rate Your Experience (Optional)" : "Website ko Rate Karein (Ikhtiyari)"}
                    </span>
                    {rating && (
                      <span className="text-xs font-semibold text-accent">
                        {lang === "en" ? RATING_LABELS[rating].en : RATING_LABELS[rating].roman}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 pt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(rating === star ? null : star)}
                        className="p-1 focus:outline-none hover:scale-110 transition-transform"
                        aria-label={`Rate ${star} star`}
                      >
                        <svg
                          className={`w-6 h-6 ${
                            rating && rating >= star ? "text-amber-400 fill-amber-400" : "text-gray-300"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="pfc-message" className="block text-xs sm:text-sm font-semibold text-primary">
                    {category === "problem"
                      ? lang === "en"
                        ? "Describe Your Problem in Detail *"
                        : "Apna Masla Tafseel Se Batayein *"
                      : lang === "en"
                      ? "Your Message / Feedback *"
                      : "Aapka Paigham / Raye *"}
                  </label>
                  <span className={`text-xs ${message.length > 3000 ? "text-red-500 font-bold" : "text-appText-muted"}`}>
                    {message.length} / 3000
                  </span>
                </div>
                <textarea
                  id="pfc-message"
                  rows={4}
                  required
                  minLength={10}
                  maxLength={3000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === "en"
                      ? "Describe your problem or suggestion in detail…"
                      : "Apna masla ya suggestion tafseel se likhein…"
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-appBorder focus:outline-none focus:ring-2 focus:ring-accent/40 bg-white text-appText resize-y min-h-[90px]"
                />
              </div>

              {/* Name & Email (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="pfc-name" className="block text-xs sm:text-sm font-medium text-appText">
                    {lang === "en" ? "Your Name (Optional)" : "Aapka Naam (Ikhtiyari)"}
                  </label>
                  <input
                    id="pfc-name"
                    type="text"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ali Khan"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-appBorder focus:outline-none focus:ring-2 focus:ring-accent/40 bg-white text-appText"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="pfc-email" className="block text-xs sm:text-sm font-medium text-appText">
                    {lang === "en" ? "Email Address (Optional)" : "Email Address (Ikhtiyari)"}
                  </label>
                  <input
                    id="pfc-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-appBorder focus:outline-none focus:ring-2 focus:ring-accent/40 bg-white text-appText"
                  />
                </div>
              </div>

              {/* Screenshot Upload (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-appText">
                  {lang === "en"
                    ? "Attach Screenshot (Optional, max 2MB)"
                    : "Screenshot Shamil Karein (Ikhtiyari, max 2MB)"}
                </label>

                {!screenshotPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-appBorder hover:border-accent rounded-lg p-3 text-center cursor-pointer bg-surface/30 hover:bg-accent-soft/20 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-appText-muted">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{lang === "en" ? "Click to upload image (JPG, PNG, WebP)" : "Image upload karne ke liye click karein"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg border border-appBorder bg-surface">
                    <div className="flex items-center space-x-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        className="w-10 h-10 object-cover rounded-md border border-appBorder"
                      />
                      <span className="text-xs font-medium text-appText truncate max-w-[200px]">
                        {screenshot?.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1"
                    >
                      {lang === "en" ? "Remove" : "Khatam karein"}
                    </button>
                  </div>
                )}
              </div>

              {/* Honeypot field (hidden from legitimate users) */}
              <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                <label htmlFor="pfc-hp-website">Leave this field blank</label>
                <input
                  id="pfc-hp-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-appText-muted hover:text-primary transition-colors"
                >
                  {lang === "en" ? "Back" : "Wapis"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-[#0F766E] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  <span>
                    {submitting
                      ? lang === "en"
                        ? "Submitting..."
                        : "Bheja ja raha hai..."
                      : lang === "en"
                      ? "Submit Feedback"
                      : "Feedback Bhejein"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS SCREEN */}
          {step === 3 && (
            <div className="py-6 px-2 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-primary">
                  Thank you for your feedback!
                </h3>
                <p className="text-xs sm:text-sm text-appText leading-relaxed max-w-md mx-auto">
                  Aapke feedback ka bohat shukriya! Hum aapki suggestion aur problems ko seriously lete hain aur apni website ko behtar banane ki koshish karte hain.
                </p>
                <p className="text-xs text-appText-muted max-w-md mx-auto">
                  Thank you for your feedback! We take your suggestions and problems seriously and keep working to make the website better.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-[#0F766E] text-white font-bold text-sm shadow-sm transition-all"
                >
                  {lang === "en" ? "Close" : "Band Karein"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

