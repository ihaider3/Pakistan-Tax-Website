"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileDrawerInstallButton } from "./MobileDrawerInstallButton";

interface NavLinkItem {
  name: string;
  href: string;
}

interface MobileNavDrawerProps {
  navLinks: NavLinkItem[];
  pathname: string | null;
  onClose: () => void;
}

/** Code-split mobile navigation drawer mounted only when the menu toggle is opened. */
export default function MobileNavDrawer({ navLinks, pathname, onClose }: MobileNavDrawerProps) {
  const router = useRouter();
  return (
    <div className="md:hidden border-t border-slate-200/80 backdrop-blur-xl bg-white/95 px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-60px)] overflow-y-auto">
      <div className="text-[11px] font-bold uppercase tracking-wider text-accent px-3 py-1">
        Navigation &amp; Calculators
      </div>

      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            onTouchStart={() => router.prefetch(link.href)}
            onClick={onClose}
            className={`px-4 py-3 text-base font-semibold rounded-xl min-h-[44px] flex items-center justify-between transition-all ${
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/20 font-bold"
                : "text-slate-800 hover:bg-slate-100 hover:text-primary"
            }`}
          >
            <span>{link.name}</span>
            <span className="text-xs text-slate-400">→</span>
          </Link>
        );
      })}

      {/* Mobile Drawer Install App (Free) Button */}
      <div className="pt-2">
        <MobileDrawerInstallButton onAfterClick={onClose} />
      </div>

      <div className="pt-3 mt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
        <Link
          href="/about"
          prefetch={false}
          onClick={onClose}
          className="p-2.5 rounded-lg bg-slate-50 text-center font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80"
        >
          About Platform
        </Link>
        <Link
          href="/methodology"
          prefetch={false}
          onClick={onClose}
          className="p-2.5 rounded-lg bg-slate-50 text-center font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80"
        >
          Methodology
        </Link>
      </div>
    </div>
  );
}
