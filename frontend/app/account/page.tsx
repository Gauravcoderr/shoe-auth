"use client";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AuthCheck } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";

const VERDICT_STYLES: Record<string, string> = {
  authentic: "text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20",
  fake: "text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20",
  inconclusive: "text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20",
  pending: "text-[#555] bg-[#1a1a1a] border border-[#222]",
};

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["check-history"],
    queryFn: () => api.getHistory(),
    enabled: !!user,
  });

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center text-[#444] text-sm">Loading...</div>
  );

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-4xl mb-4">👟</div>
        <h2 className="text-xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          Sign in to see your checks
        </h2>
        <p className="text-[#555] text-sm mb-6">Your authentication history is saved to your account.</p>
        <button
          type="button"
          onClick={() => setShowAuth(true)}
          className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#e5e5e5] transition-colors text-sm"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Sign in
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  const checks: AuthCheck[] = data?.checks || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-2">History</p>
        <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "var(--font-syne)" }}>
          My checks
        </h1>
        <p className="text-[#555] text-sm">{user.email} · {checks.length} authentication{checks.length !== 1 ? "s" : ""}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-[#111] border border-[#1f1f1f] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : checks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-[#555] text-sm mb-3">No checks yet.</p>
          <Link href="/check" className="text-white font-semibold text-sm hover:text-[#888] transition-colors">
            Check your first pair →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {checks.map((check) => (
            <Link
              key={check.id}
              href={`/check/${check.id}/results`}
              className="flex items-center gap-4 p-4 bg-[#111] border border-[#1f1f1f] rounded-xl hover:border-[#2a2a2a] hover:bg-[#161616] transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm truncate" style={{ fontFamily: "var(--font-syne)" }}>
                  {check.model}
                </div>
                <div className="text-xs text-[#444] mt-0.5 capitalize">
                  {check.brand} · {formatDate(check.created_at)}
                </div>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${VERDICT_STYLES[check.overall_verdict] || VERDICT_STYLES.pending}`}>
                {check.overall_verdict}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
