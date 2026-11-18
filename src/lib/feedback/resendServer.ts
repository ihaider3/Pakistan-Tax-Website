import { Resend } from "resend";
import { siteUrl } from "@/config/site";

export interface EmailNotificationPayload {
  category: "problem" | "feedback" | "feature";
  calculator: string;
  name?: string | null;
  email?: string | null;
  message: string;
  rating?: number | null;
  createdAt?: string;
  id?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  problem: "Report a Problem",
  feedback: "Share Your Feedback",
  feature: "Suggest a Feature",
};

const CALCULATOR_LABELS: Record<string, string> = {
  general: "General / Website",
  salary: "Salary Tax",
  zakat: "Zakat",
  property: "Property Tax (236C/K)",
  gst: "GST (18%)",
  fitrana: "Fitrana",
};

export async function sendFeedbackNotificationEmail(payload: EmailNotificationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Feedback Notification] RESEND_API_KEY not configured. Skipping email.");
    return { skipped: true, reason: "RESEND_API_KEY missing" };
  }

  const recipient = process.env.FEEDBACK_NOTIFY_EMAIL || "contact@calculationhubs.com";
  const resend = new Resend(apiKey);

  const categoryName = CATEGORY_LABELS[payload.category] || payload.category;
  const calculatorName = CALCULATOR_LABELS[payload.calculator] || payload.calculator;

  // Format Pakistan Standard Time (PKT, UTC+5)
  const now = new Date();
  const pktDateStr = new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    dateStyle: "full",
    timeStyle: "medium",
  }).format(now);

  const adminUrl = `${siteUrl}/admin/feedback`;

  const emailLines = [
    `New feedback received on CalculationHub:`,
    ``,
    `--------------------------------------------------`,
    `Date & Time (PKT): ${pktDateStr}`,
    `Category:          ${categoryName}`,
    `Calculator:        ${calculatorName}`,
    `Rating:            ${payload.rating ? `${payload.rating} / 5 stars` : "Not provided / N/A"}`,
    `Name:              ${payload.name?.trim() ? payload.name : "Not provided (Anonymous)"}`,
    `Email:             ${payload.email?.trim() ? payload.email : "Not provided"}`,
    `--------------------------------------------------`,
    ``,
    `User Message:`,
    payload.message,
    ``,
    `--------------------------------------------------`,
    `Manage all submissions in your Admin Dashboard:`,
    adminUrl,
    `--------------------------------------------------`,
  ];

  const subject = `[Pak Tax Cal] New ${categoryName} — ${calculatorName}`;

  try {
    const response = await resend.emails.send({
      from: "CalculationHub <onboarding@resend.dev>",
      to: recipient,
      subject,
      text: emailLines.join("\n"),
    });

    return { success: true, data: response };
  } catch (err: unknown) {
    console.error("[Feedback Notification] Resend email delivery failed:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

