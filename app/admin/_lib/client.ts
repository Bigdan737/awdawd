"use client";

function getCsrfCookie(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )admin_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * Wrapper around fetch for admin API calls: attaches the CSRF header on any
 * mutating request (double-submit cookie pattern) and always sends cookies.
 */
export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (method !== "GET") {
    headers.set("x-csrf-token", getCsrfCookie());
  }
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(path, { ...options, headers, credentials: "same-origin" });
}

export async function adminJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await adminFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status}).`);
  }
  return data as T;
}
