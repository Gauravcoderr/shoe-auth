import { AuthCheck, Brand, User } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

async function authRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth (local Next.js API routes → Brevo email OTP)
  sendOtp: (email: string) =>
    authRequest("/api/auth/send-otp", { method: "POST", body: JSON.stringify({ email }) }),
  verifyOtp: (email: string, otp: string) =>
    authRequest<{ user: User }>("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) }),
  refresh: () => Promise.resolve({ message: "ok" }),
  logout: () => authRequest<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  me: () => authRequest<User>("/api/auth/me"),

  // Checks
  createCheck: (body: { brand: string; model: string; colorway: string; photos: { angle: string; url: string }[] }) =>
    request<{ checkId: string }>("/checks", { method: "POST", body: JSON.stringify(body) }),
  getCheck: (id: string) => request<AuthCheck>(`/checks/${id}`),
  getHistory: () => request<{ checks: AuthCheck[] }>("/checks"),

  // Brands
  getBrands: () => request<{ brands: Brand[] }>("/brands"),
};
