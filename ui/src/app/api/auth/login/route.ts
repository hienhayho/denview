import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await backendFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    return NextResponse.json(err, { status: res.status });
  }

  const data = await res.json();

  // Forward the httpOnly cookie from FastAPI to the browser
  const setCookie = res.headers.get("set-cookie");
  const response = NextResponse.json(data);
  if (setCookie) response.headers.set("set-cookie", setCookie);

  return response;
}
