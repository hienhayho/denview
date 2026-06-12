import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await backendFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ detail: "Registration failed" }));
  return NextResponse.json(data, { status: res.status });
}
