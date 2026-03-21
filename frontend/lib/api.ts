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

export const api = {
  // Auth
  sendOtp: (email: string) =>
    request("/auth/send-otp", { method: "POST", body: JSON.stringify({ email }) }),
  verifyOtp: (email: string, otp: string, name?: string, phone?: string) =>
    request<{ user: User }>("/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, otp, name, phone }) }),
  refresh: () => request<{ message: string }>("/auth/refresh", { method: "POST" }),
  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
  me: () => request<User>("/auth/me"),

  // Checks
  createCheck: (body: { brand: string; model: string; colorway: string; photos: { angle: string; url: string }[] }) =>
    request<{ checkId: string }>("/checks", { method: "POST", body: JSON.stringify(body) }),
  getCheck: (id: string) => request<AuthCheck>(`/checks/${id}`),
  getHistory: () => request<{ checks: AuthCheck[] }>("/checks"),

  // Brands
  getBrands: () => request<{ brands: Brand[] }>("/brands"),
};
