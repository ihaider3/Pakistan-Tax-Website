"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
export interface VisualContentItem {
  key: string;
  page: string;
  fieldLabel: string;
  isTextarea?: boolean;
  defaultValue: string;
  currentValue: string;
  updatedAt: string;
  hasHistory: boolean;
  previousValue?: string;
}

interface VisualContentEditorProps {
  contentList: VisualContentItem[];
  contentValues: Record<string, string>;
  setContentValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSave: (key: string, customVal?: string) => Promise<boolean>;
  onRestore: (key: string) => Promise<boolean>;
  savingKey: string | null;
  restoringKey: string | null;
}

interface PageOption {
  id: string;
  label: string;
  url: string;
  category: "calculator" | "general" | "legal";
}

const PAGES: PageOption[] = [
  { id: "homepage", label: "Homepage", url: "/", category: "general" },
  { id: "salary", label: "Salary Tax Calculator", url: "/salary-tax-calculator", category: "calculator" },
  { id: "zakat", label: "Zakat Calculator", url: "/zakat-calculator", category: "calculator" },
  { id: "property", label: "Property Tax (236C/236K)", url: "/property-tax-calculator", category: "calculator" },
  { id: "gst", label: "GST Calculator (18%)", url: "/gst-calculator", category: "calculator" },
  { id: "fitrana", label: "Fitrana Calculator", url: "/fitrana-calculator", category: "calculator" },
  { id: "ushr", label: "Ushr Calculator (Crops)", url: "/ushr-calculator", category: "calculator" },
  { id: "about", label: "About Us & Mission", url: "/about", category: "legal" },
  { id: "methodology", label: "Methodology & Statutory Sources", url: "/methodology", category: "legal" },
  { id: "privacy", label: "Privacy Policy", url: "/privacy-policy", category: "legal" },
  { id: "disclaimer", label: "Legal & Religious Disclaimer", url: "/disclaimer", category: "legal" },
  { id: "contact", label: "Contact & Bug Reports", url: "/contact", category: "general" },
  { id: "footer", label: "Footer Section", url: "/#footer", category: "general" },
];

export default function VisualContentEditor({
  contentList,
  contentValues,
  setContentValues,
  onSave,
  onRestore,
  savingKey,
  restoringKey,
}: VisualContentEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedPage, setSelectedPage] = useState<string>("homepage");
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop");
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  // Hover Tooltip State
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    type: "editable" | "locked";
    x: number;
    y: number;
  }>({ visible: false, text: "", type: "editable", x: 0, y: 0 });

  // Popover Editing State
  const [activeEditingKey, setActiveEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState<string>("");
  const [initialValueOnOpen, setInitialValueOnOpen] = useState<string>("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const currentPageOption = PAGES.find((p) => p.id === selectedPage) || PAGES[0];

  // Reload the iframe
  const handleReload = () => {
    setIframeLoaded(false);
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.location.reload();
      } catch {
        iframeRef.current.src = currentPageOption.url;
      }
    }
  };

  // Open editor for key
  const openEditorForKey = useCallback(
    (key: string) => {
      const item = contentList.find((c) => c.key === key);
      const currentVal = contentValues[key] ?? item?.currentValue ?? item?.defaultValue ?? "";
      setActiveEditingKey(key);
      setDraftValue(currentVal);
      setInitialValueOnOpen(currentVal);
      setShowDiscardConfirm(false);
      setSaveSuccessNotice(null);
    },
    [contentList, contentValues]
  );

  // Close editor with unsaved check
  const requestCloseEditor = () => {
    if (draftValue !== initialValueOnOpen) {
      setShowDiscardConfirm(true);
    } else {
      setActiveEditingKey(null);
      setShowDiscardConfirm(false);
    }
  };

  // Discard changes
  const handleDiscard = () => {
    setShowDiscardConfirm(false);
    setActiveEditingKey(null);
  };

  // Save changes from popover
  const handleSaveModal = async () => {
    if (!activeEditingKey) return;
    const ok = await onSave(activeEditingKey, draftValue);
    if (ok) {
      // 1. Instantly update element in iframe DOM
      try {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-content-key="${activeEditingKey}"]`);
          if (el) {
            el.textContent = draftValue;
          }
        }
      } catch (err) {
        console.warn("[Visual Editor] DOM update:", err);
      }

      // 2. Post message to iframe for state sync
      try {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "ADMIN_CONTENT_UPDATE",
            key: activeEditingKey,
            value: draftValue,
          },
          "*"
        );
      } catch (err) {
        console.warn("[Visual Editor] postMessage:", err);
      }

      setInitialValueOnOpen(draftValue);
      setSaveSuccessNotice("Saved — live on the site now!");
      setTimeout(() => {
        setSaveSuccessNotice(null);
        setActiveEditingKey(null);
      }, 900);
    }
  };

  // Restore action
  const handleRestoreModal = async () => {
    if (!activeEditingKey) return;
    const ok = await onRestore(activeEditingKey);
    if (ok) {
      const item = contentList.find((c) => c.key === activeEditingKey);
      const restored = item?.previousValue ?? item?.defaultValue ?? "";
      setDraftValue(restored);
      setInitialValueOnOpen(restored);

      try {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-content-key="${activeEditingKey}"]`);
          if (el) el.textContent = restored;
        }
      } catch {}

      setSaveSuccessNotice("Restored successfully!");
      setTimeout(() => {
        setSaveSuccessNotice(null);
      }, 1200);
    }
  };

  // Restore to default (codebase)
  const handleRestoreDefaultModal = async () => {
    if (!activeEditingKey) return;
    const item = contentList.find((c) => c.key === activeEditingKey);
    const def = item?.defaultValue || "";
    setDraftValue(def);
    const ok = await onSave(activeEditingKey, def);
    if (ok) {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
          const el = doc.querySelector(`[data-content-key="${activeEditingKey}"]`);
          if (el) el.textContent = def;
        }
      } catch {}

      setSaveSuccessNotice("Restored to codebase default!");
      setTimeout(() => {
        setSaveSuccessNotice(null);
      }, 1200);
    }
  };

  // Attach hover and click listeners to iframe
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Inject visual inspector CSS
      const styleEl = doc.createElement("style");
      styleEl.id = "admin-visual-editor-styles";
      styleEl.textContent = `
        [data-content-key] {
          cursor: pointer !important;
          transition: all 0.15s ease-in-out !important;
          border-radius: 4px !important;
        }
        [data-content-key]:hover {
          outline: 2px dashed #0F766E !important;
          outline-offset: 4px !important;
          background-color: rgba(15, 118, 110, 0.08) !important;
        }
        [data-statutory="true"], [data-statutory="true"] * {
          user-select: none !important;
        }
        [data-statutory="true"] input,
        [data-statutory="true"] button,
        [data-statutory="true"] select {
          cursor: not-allowed !important;
        }
      `;
      doc.head.appendChild(styleEl);

      // Handle Mousemove for Tooltips
      const handleMouseMove = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Check if statutory
        const statutory = target.closest('[data-statutory="true"], input, select, [data-result], [data-breakdown]');
        if (statutory) {
          const iframeRect = iframe.getBoundingClientRect();
          setTooltip({
            visible: true,
            text: "🔒 Statutory — cannot be edited here",
            type: "locked",
            x: iframeRect.left + e.clientX,
            y: iframeRect.top + e.clientY - 34,
          });
          return;
        }

        // Check if editable
        const editable = target.closest("[data-content-key]") as HTMLElement | null;
        if (editable) {
          const iframeRect = iframe.getBoundingClientRect();
          const key = editable.getAttribute("data-content-key") || "";
          const item = contentList.find((c) => c.key === key);
          const label = item ? item.fieldLabel : key;
          setTooltip({
            visible: true,
            text: `✏️ Click to edit: ${label}`,
            type: "editable",
            x: iframeRect.left + e.clientX,
            y: iframeRect.top + e.clientY - 34,
          });
          return;
        }

        setTooltip((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      };

      const handleMouseLeave = () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
      };

      // Handle Click inside iframe
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // If clicking inside statutory calculation area, prevent edit
        const statutory = target.closest('[data-statutory="true"]');
        if (statutory) {
          // If it's a statutory area and not explicitly an editable text inside it, block
          const editable = target.closest("[data-content-key]") as HTMLElement | null;
          if (!editable) {
            e.preventDefault();
            return;
          }
        }

        const editable = target.closest("[data-content-key]") as HTMLElement | null;
        if (editable) {
          e.preventDefault();
          e.stopPropagation();
          const key = editable.getAttribute("data-content-key");
          if (key) {
            openEditorForKey(key);
          }
        }
      };

      doc.addEventListener("mousemove", handleMouseMove, true);
      doc.addEventListener("mouseleave", handleMouseLeave, true);
      doc.addEventListener("click", handleClick, true);

      // If page was selected as footer, scroll to footer
      if (selectedPage === "footer") {
        setTimeout(() => {
          const footerEl = doc.querySelector("footer");
          footerEl?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch (err) {
      console.warn("[Visual Content Editor] Cross-origin or document access error:", err);
    }
  };

  const activeItem = contentList.find((c) => c.key === activeEditingKey);

  return (
    <div className="space-y-4">
      {/* =========================================================================
          CONTROL BAR: Page Selector, Width Toggle & Reload
         ========================================================================= */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Left: Page Selector */}
        <div className="flex items-center gap-2.5 min-w-[280px]">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview Page:</span>
          <select
            value={selectedPage}
            onChange={(e) => {
              setSelectedPage(e.target.value);
              setIframeLoaded(false);
            }}
            className="flex-1 bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent focus:outline-none cursor-pointer"
          >
            <optgroup label="Calculators">
              {PAGES.filter((p) => p.category === "calculator").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="General Pages">
              {PAGES.filter((p) => p.category === "general").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Legal & Statutory">
              {PAGES.filter((p) => p.category === "legal").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Center: Instruction Chip */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
          <span className="text-accent font-bold">💡 How it works:</span> Hover and click any highlighted text below to edit in place.
        </div>

        {/* Right: Width Toggle & Reload Button */}
        <div className="flex items-center gap-2">
          {/* Desktop/Mobile Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setPreviewWidth("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                previewWidth === "desktop"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Desktop (1440px)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewWidth("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                previewWidth === "mobile"
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Mobile (390px)</span>
            </button>
          </div>

          {/* Reload Button */}
          <button
            type="button"
            onClick={handleReload}
            title="Reload live preview"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PREVIEW CANVAS WRAPPER
         ========================================================================= */}
      <div className="relative bg-slate-900/5 p-4 sm:p-6 rounded-3xl border border-slate-200 flex justify-center overflow-x-auto min-h-[780px]">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-10 rounded-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
              <span>Loading live preview of {currentPageOption.label}...</span>
            </div>
          </div>
        )}

        <div
          style={{
            width: previewWidth === "desktop" ? "100%" : "390px",
            maxWidth: previewWidth === "desktop" ? "1440px" : "390px",
            transition: "all 0.3s ease-in-out",
          }}
          className={`bg-white rounded-2xl shadow-xl border overflow-hidden relative ${
            previewWidth === "mobile" ? "border-slate-800 ring-8 ring-slate-800" : "border-slate-300"
          }`}
        >
          {/* Mobile Phone Mock Header (Only in Mobile Mode) */}
          {previewWidth === "mobile" && (
            <div className="h-6 bg-slate-800 flex items-center justify-center">
              <div className="w-20 h-3 bg-black rounded-full" />
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={currentPageOption.url}
            onLoad={handleIframeLoad}
            title="Live Preview"
            className="w-full h-[750px] border-none"
          />
        </div>
      </div>

      {/* =========================================================================
          FLOATING TOOLTIP
         ========================================================================= */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg transition-all animate-in fade-in duration-150 flex items-center gap-1.5 ${
            tooltip.type === "locked"
              ? "bg-amber-800/95 border border-amber-500"
              : "bg-primary/95 border border-accent shadow-accent/20"
          }`}
        >
          <span>{tooltip.text}</span>
        </div>
      )}

      {/* =========================================================================
          INLINE POPOVER / MODAL TEXT EDITOR
         ========================================================================= */}
      {activeEditingKey && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                  <h3 className="text-base font-extrabold text-primary">{activeItem.fieldLabel}</h3>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {activeItem.key}
                  </span>
                  <span>•</span>
                  <span>Page: <strong className="capitalize">{activeItem.page}</strong></span>
                  <span>•</span>
                  <span>Last updated: {activeItem.updatedAt}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={requestCloseEditor}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success notification */}
            {saveSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <span>✓</span>
                <span>{saveSuccessNotice}</span>
              </div>
            )}

            {/* Input field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Text Content:
              </label>
              {activeItem.isTextarea ? (
                <textarea
                  rows={4}
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal focus:outline-none focus:ring-2 focus:ring-accent"
                />
              ) : (
                <input
                  type="text"
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-accent"
                />
              )}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <span>{draftValue.length} characters</span>
                {draftValue !== activeItem.defaultValue && (
                  <span className="text-amber-700 font-medium">Differs from codebase default</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {activeItem.hasHistory && (
                  <button
                    type="button"
                    onClick={handleRestoreModal}
                    disabled={restoringKey === activeItem.key || savingKey === activeItem.key}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {restoringKey === activeItem.key ? "Restoring..." : "Restore Previous"}
                  </button>
                )}
                {draftValue !== activeItem.defaultValue && (
                  <button
                    type="button"
                    onClick={handleRestoreDefaultModal}
                    disabled={savingKey === activeItem.key || restoringKey === activeItem.key}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Restore Codebase Default
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={requestCloseEditor}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  disabled={savingKey === activeItem.key || restoringKey === activeItem.key}
                  className="px-5 py-2 text-xs font-bold text-white bg-accent hover:bg-[#0D625C] rounded-xl shadow-md shadow-accent/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {savingKey === activeItem.key ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          UNSAVED CHANGES DISCARD CONFIRMATION DIALOG
         ========================================================================= */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm">
              <span className="text-lg">⚠️</span>
              <span>Unsaved Changes</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You have edited this text without saving. If you close now, your draft edits will be discarded.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
