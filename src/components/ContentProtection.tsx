"use client";

import { useEffect } from "react";

export interface ShortcutKeyLike {
  key?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

/**
 * Returns true for DevTools, View Source, and Save Page shortcuts that should
 * be prevented, while explicitly leaving Print (Ctrl/Cmd+P), Find (Ctrl/Cmd+F),
 * Refresh (F5 / Ctrl/Cmd+R), and input editing shortcuts untouched.
 */
export function shouldBlockInspectShortcut(e: ShortcutKeyLike): boolean {
  const key = (e.key || "").toLowerCase();
  const hasModifier = Boolean(e.ctrlKey || e.metaKey);

  if (key === "f12") return true;

  // Allow Print, Find, Refresh explicitly
  if (hasModifier && (key === "p" || key === "f" || key === "r")) {
    return false;
  }

  // DevTools shortcuts: Ctrl+Shift+I/J/C (Windows/Linux) or Cmd+Option+I/J/C (macOS)
  if (
    (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
    (e.metaKey && (e.altKey || e.shiftKey) && (key === "i" || key === "j" || key === "c"))
  ) {
    return true;
  }

  // View Source (Ctrl/Cmd+U) & Save Page (Ctrl/Cmd+S)
  if (hasModifier && !e.shiftKey && !e.altKey && (key === "u" || key === "s")) {
    return true;
  }

  return false;
}

/**
 * Returns true when an event target or active selection belongs to an editable
 * control or explicitly marked selectable result value field.
 */
export function isEditableOrSelectableTarget(target: EventTarget | null): boolean {
  if (!target || typeof Element === "undefined") return false;
  const el =
    target instanceof Element
      ? target
      : target instanceof Node
      ? target.parentElement
      : null;
  if (!el) return false;

  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  ) {
    return true;
  }

  return Boolean(
    el.closest(
      'input, textarea, select, [contenteditable="true"], [data-allow-select="true"]'
    )
  );
}

/**
 * Global client-side deterrence layer for right-click context menu, inspect
 * shortcuts, image dragging, and non-input text copying.
 */
export default function ContentProtection() {
  useEffect(() => {
    console.warn("This content is protected by copyright — CalculationHub");

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldBlockInspectShortcut(e)) {
        e.preventDefault();
      }
    };

    const onCopyOrCut = (e: ClipboardEvent) => {
      if (isEditableOrSelectableTarget(e.target)) {
        return;
      }
      const selection = typeof window !== "undefined" ? window.getSelection() : null;
      if (selection && selection.anchorNode && isEditableOrSelectableTarget(selection.anchorNode)) {
        return;
      }
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      const target = e.target;
      if (target instanceof HTMLImageElement) {
        e.preventDefault();
        return;
      }
      if (!isEditableOrSelectableTarget(target)) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("copy", onCopyOrCut);
    document.addEventListener("cut", onCopyOrCut);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("copy", onCopyOrCut);
      document.removeEventListener("cut", onCopyOrCut);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
