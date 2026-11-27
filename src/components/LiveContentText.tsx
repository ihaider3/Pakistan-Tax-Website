"use client";

import React from "react";
import { useSiteContent } from "./SiteContentContext";

interface LiveContentTextProps {
  contentKey: string;
  fallback: string;
  className?: string;
}

export default function LiveContentText({
  contentKey,
  fallback,
  className = "",
}: LiveContentTextProps) {
  const { getContent } = useSiteContent();
  return (
    <span data-content-key={contentKey} className={className}>
      {getContent(contentKey, fallback)}
    </span>
  );
}
