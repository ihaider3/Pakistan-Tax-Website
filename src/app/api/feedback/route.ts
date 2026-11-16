import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin, FEEDBACK_SCREENSHOTS_BUCKET } from "@/lib/feedback/supabaseServer";
import { sendFeedbackNotificationEmail } from "@/lib/feedback/resendServer";
import { checkSpamAndRateLimit } from "@/lib/feedback/spamProtection";
import { addInMemorySubmission } from "@/lib/feedback/inMemoryStore";

const VALID_CATEGORIES = new Set(["problem", "feedback", "feature"]);
const VALID_CALCULATORS = new Set(["general", "salary", "zakat", "property", "gst", "fitrana"]);
const MAX_SCREENSHOT_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || null;

    let category = "feedback";
    let calculator = "general";
    let name: string | null = null;
    let email: string | null = null;
    let message = "";
    let rating: number | null = null;
    let honeypot: string | null = null;
    let screenshotFile: File | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      category = (formData.get("category") as string) || "feedback";
      calculator = (formData.get("calculator") as string) || "general";
      name = (formData.get("name") as string)?.trim() || null;
      email = (formData.get("email") as string)?.trim() || null;
      message = (formData.get("message") as string)?.trim() || "";
      const rawRating = formData.get("rating");
      if (rawRating) {
        const parsed = parseInt(rawRating as string, 10);
        if (parsed >= 1 && parsed <= 5) rating = parsed;
      }
      honeypot = (formData.get("website_url") as string) || null;

      const fileEntry = formData.get("screenshot");
      if (fileEntry && typeof fileEntry === "object" && "arrayBuffer" in fileEntry) {
        const file = fileEntry as File;
        if (file.size > 0) {
          screenshotFile = file;
        }
      }
    } else {
      const json = await request.json();
      category = json.category || "feedback";
      calculator = json.calculator || "general";
      name = json.name?.trim() || null;
      email = json.email?.trim() || null;
      message = json.message?.trim() || "";
      if (json.rating && typeof json.rating === "number" && json.rating >= 1 && json.rating <= 5) {
        rating = json.rating;
      }
      honeypot = json.website_url || null;
    }

    // 1. Spam & Rate Limiting Check
    const spamCheck = checkSpamAndRateLimit(ip, honeypot, message);
    if (spamCheck.isHoneypot) {
      // Honeypot trapped: silently return success without storing
      return NextResponse.json({
        success: true,
        message: "Thank you for your feedback!",
      });
    }

    if (!spamCheck.allowed) {
      return NextResponse.json(
        { error: spamCheck.error || "Submission rejected." },
        { status: 429 }
      );
    }

    // 2. Validation
    if (!VALID_CATEGORIES.has(category)) {
      return NextResponse.json({ error: "Invalid category selected." }, { status: 400 });
    }

    if (!VALID_CALCULATORS.has(calculator)) {
      return NextResponse.json({ error: "Invalid calculator selected." }, { status: 400 });
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        { error: "Message cannot exceed 3000 characters." },
        { status: 400 }
      );
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Rating is NOT applicable to 'problem' category
    if (category === "problem") {
      rating = null;
    }

    // 3. Screenshot validation and upload
    let screenshotUrl: string | null = null;
    if (screenshotFile) {
      if (screenshotFile.size > MAX_SCREENSHOT_BYTES) {
        return NextResponse.json(
          { error: "Screenshot file size must be 2 MB or less." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.has(screenshotFile.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, and WebP images are supported." },
          { status: 400 }
        );
      }

      const extension = screenshotFile.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const filePath = `screenshots/${fileName}`;

      const supabase = getSupabaseAdmin();
      if (supabase) {
        const fileBuffer = Buffer.from(await screenshotFile.arrayBuffer());
        const { error: uploadError } = await supabase.storage
          .from(FEEDBACK_SCREENSHOTS_BUCKET)
          .upload(filePath, fileBuffer, {
            contentType: screenshotFile.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("[Feedback API] Supabase storage upload failed:", uploadError);
          // Non-fatal: still continue with text feedback if storage fails
        } else {
          screenshotUrl = filePath;
        }
      } else {
        console.warn("[Feedback API] Supabase not configured. Screenshot storage skipped.");
      }
    }

    // 4. Insert into database
    let feedbackId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data, error: insertError } = await supabase
        .from("feedback")
        .insert([
          {
            id: feedbackId,
            category,
            calculator,
            name,
            email,
            message,
            rating,
            screenshot_url: screenshotUrl,
            status: "pending",
            user_agent: userAgent,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("[Feedback API] Supabase insert failed:", insertError);
        return NextResponse.json(
          { error: "Failed to save feedback to database. Please try again." },
          { status: 500 }
        );
      }

      if (data?.id) {
        feedbackId = data.id;
      }
    } else {
      console.warn("[Feedback API] Supabase not configured. Storing in local memory buffer.");
      addInMemorySubmission({
        id: feedbackId,
        created_at: createdAt,
        category,
        calculator,
        name,
        email,
        message,
        rating,
        screenshot_url: screenshotUrl,
        status: "pending",
        user_agent: userAgent,
      });
    }

    // 5. Send Email Notification via Resend (async, never blocks or fails user request)
    sendFeedbackNotificationEmail({
      category: category as "problem" | "feedback" | "feature",
      calculator,
      name,
      email,
      message,
      rating,
      createdAt,
      id: feedbackId,
    }).catch((emailErr) => {
      console.error("[Feedback API] Background email dispatch caught error:", emailErr);
    });

    return NextResponse.json({
      success: true,
      id: feedbackId,
      message: "Thank you for your feedback!",
    });
  } catch (err: unknown) {
    console.error("[Feedback API] Unexpected error handling submission:", err);
    return NextResponse.json(
      { error: "Something went wrong — please try again." },
      { status: 500 }
    );
  }
}
