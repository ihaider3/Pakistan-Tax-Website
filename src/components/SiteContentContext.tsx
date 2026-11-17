"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteContentContextValue {
  content: Record<string, string>;
  getContent: (key: string, fallback?: string) => string;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: {},
  getContent: (_key: string, fallback = "") => fallback,
});

export function SiteContentProvider({
  initialContent,
  children,
}: {
  initialContent: Record<string, string>;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<Record<string, string>>(initialContent || {});

  useEffect(() => {
    setContent(initialContent || {});
  }, [initialContent]);

  // Listen for live update messages from admin visual editor in same-origin preview
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "ADMIN_CONTENT_UPDATE" && e.data.key) {
        setContent((prev) => ({
          ...prev,
          [e.data.key]: e.data.value,
        }));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getContent = (key: string, fallback = ""): string => {
    if (content[key] !== undefined && content[key] !== "") {
      return content[key];
    }
    return fallback;
  };

  return (
    <SiteContentContext.Provider value={{ content, getContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
