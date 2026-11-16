import React, { Suspense } from "react";
import type { Metadata } from "next";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Control Center | Pakistan Finance Calculators",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin();
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl animate-pulse">
            PK
          </div>
          <div className="text-slate-500 font-medium text-sm">
            Loading Admin Panel...
          </div>
        </div>
      }
    >
      <AdminDashboardClient initialAuth={isAuth} />
    </Suspense>
  );
}
