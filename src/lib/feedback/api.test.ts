import { describe, it, expect, beforeEach } from "vitest";
import { POST as feedbackPost } from "@/app/api/feedback/route";
import { POST as loginPost } from "@/app/api/feedback/admin/login/route";
import { GET as listGet } from "@/app/api/feedback/admin/list/route";
import { PATCH as itemPatch, DELETE as itemDelete } from "@/app/api/feedback/admin/[id]/route";
import { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, generateSessionToken } from "@/lib/feedback/adminAuth";

describe("Feedback API Endpoints Integration", () => {
  const adminPass = "TestPassword9988!";
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = adminPass;
  });

  it("submits a problem report successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "problem",
        calculator: "salary",
        message: "Found an issue where slab 3 calculation needs verification.",
        name: "Test User",
        email: "test@example.com",
      }),
    });

    const res = await feedbackPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
  });

  it("submits a feedback report with rating successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "feedback",
        calculator: "zakat",
        message: "The Zakat Nisab calculator is very fast and helpful!",
        rating: 5,
        name: "Ahmad",
      }),
    });

    const res = await feedbackPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("submits a feature suggestion successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "feature",
        calculator: "general",
        message: "Please add a Freelancer Withholding Tax comparison tool.",
        rating: 4,
      }),
    });

    const res = await feedbackPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("rejects invalid messages under 10 chars with 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "feedback",
        calculator: "general",
        message: "Too short",
      }),
    });

    const res = await feedbackPost(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("at least 10 characters");
  });

  it("handles admin login correctly and sets cookie", async () => {
    const badReq = new NextRequest("http://localhost:3000/api/feedback/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "WrongPassword" }),
    });
    const badRes = await loginPost(badReq);
    expect(badRes.status).toBe(401);

    const goodReq = new NextRequest("http://localhost:3000/api/feedback/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPass }),
    });
    const goodRes = await loginPost(goodReq);
    expect(goodRes.status).toBe(200);
    expect(goodRes.cookies.get(ADMIN_COOKIE_NAME)).toBeDefined();
  });

  it("denies unauthenticated admin list access", async () => {
    const req = new NextRequest("http://localhost:3000/api/feedback/admin/list");
    const res = await listGet(req);
    expect(res.status).toBe(401);
  });

  it("permits authenticated admin list access and pagination", async () => {
    const token = generateSessionToken();
    const req = new NextRequest("http://localhost:3000/api/feedback/admin/list?page=1&limit=20", {
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${token}`,
      },
    });

    const res = await listGet(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.counts).toBeDefined();
    expect(data.counts.total).toBeGreaterThanOrEqual(1);
  });

  it("allows updating item status and deleting via admin API", async () => {
    const token = generateSessionToken();

    // 1. Submit an item to update
    const submitReq = new NextRequest("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "problem",
        calculator: "gst",
        message: "Unique test item to update and delete afterwards.",
      }),
    });
    const submitRes = await feedbackPost(submitReq);
    const { id } = await submitRes.json();

    // 2. Patch status
    const patchReq = new NextRequest(`http://localhost:3000/api/feedback/admin/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: `${ADMIN_COOKIE_NAME}=${token}`,
      },
      body: JSON.stringify({ status: "in_progress" }),
    });
    const patchRes = await itemPatch(patchReq, { params: Promise.resolve({ id }) });
    expect(patchRes.status).toBe(200);
    const patchedData = await patchRes.json();
    expect(patchedData.item.status).toBe("in_progress");

    // 3. Delete item
    const deleteReq = new NextRequest(`http://localhost:3000/api/feedback/admin/${id}`, {
      method: "DELETE",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${token}`,
      },
    });
    const deleteRes = await itemDelete(deleteReq, { params: Promise.resolve({ id }) });
    expect(deleteRes.status).toBe(200);
    const deleteData = await deleteRes.json();
    expect(deleteData.success).toBe(true);
  });
});

