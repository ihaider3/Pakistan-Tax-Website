import React from "react";
import type { Metadata } from "next";
import AdminFeedbackClient from "./AdminFeedbackClient";

export const metadata: Metadata = {
  title: "Admin Feedback Dashboard | Pakistan Finance Calculators",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminFeedbackPage() {
  return <AdminFeedbackClient />;
}

