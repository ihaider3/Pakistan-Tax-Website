"use client";

import { createContext, useContext } from "react";

export interface PwaContextType {
  canInstall: boolean;
  isInstalled: boolean;
  isIos: boolean;
  promptInstall: () => Promise<void>;
  dismissBanner: () => void;
  showIosHint: boolean;
  dismissIosHint: () => void;
}

export const PwaContext = createContext<PwaContextType>({
  canInstall: false,
  isInstalled: false,
  isIos: false,
  promptInstall: async () => {},
  dismissBanner: () => {},
  showIosHint: false,
  dismissIosHint: () => {},
});

/** Read PWA installation state without bundling provider effects or modals. */
export function usePwa() {
  return useContext(PwaContext);
}
