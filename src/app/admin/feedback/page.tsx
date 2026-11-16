import React from "react";
import type { Metadata } from "next";
import { isAuthenticatedAdmin } from "@/lib/feedback/adminAuth";
import AdminFeedbackClient from "./AdminFeedbackClient";

export const metadata: Metadata = {
  title: "Admin Feedback Dashboard | Pakistan Finance Calculators",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const isAuth = await isAuthenticatedAdmin();
  return <AdminFeedbackClient initialAuth={isAuth} />;
}

