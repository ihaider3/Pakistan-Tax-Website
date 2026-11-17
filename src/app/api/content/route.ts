import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content/contentServer";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({});
  }
}

