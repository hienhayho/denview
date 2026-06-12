const BACKEND_URL = process.env.BACKEND_URL!;

export async function backendFetch(
  path: string,
  init: RequestInit = {},
  cookieHeader?: string,
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (cookieHeader) headers["Cookie"] = cookieHeader;

  return fetch(`${BACKEND_URL}${path}`, { ...init, headers });
}
