"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const { login } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.sendOtp(email);
      setStep("otp");
      setCooldown(60);
      const t = setInterval(() => setCooldown(c => { if (c <= 1) clearInterval(t); return c - 1; }), 1000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.verifyOtp(email, otp);
      login(res.user);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {step === "email" ? "Sign in to SneakerAuth" : "Enter your code"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {step === "email"
            ? "No password needed — we'll email you a code"
            : `We sent a 6-digit code to ${email}`}
        </p>

        {step === "email" ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456" maxLength={6} required autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-2xl tracking-[0.5em] text-center font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading || otp.length < 6}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify code"}
            </button>
            <div className="text-center">
              {cooldown > 0 ? (
                <p className="text-sm text-gray-400">Resend in {cooldown}s</p>
              ) : (
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Resend code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
