import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";

  const res = await backendFetch("/auth/me", {}, cookie);

  if (!res.ok) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
