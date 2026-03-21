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
  authentic: "text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0]",
  fake: "text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]",
  inconclusive: "text-[#d97706] bg-[#fffbeb] border border-[#fde68a]",
  pending: "text-[#aaa] bg-[#f0f0ec] border border-[#e8e8e3]",
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
    <div className="max-w-2xl mx-auto px-5 py-24 text-center text-[#aaa] text-sm">Loading...</div>
  );

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <div className="text-4xl mb-4">👟</div>
        <h2 className="text-xl font-extrabold text-[#111] mb-2 font-syne">Sign in to see your checks</h2>
        <p className="text-[#888] text-sm mb-6">Your authentication history is saved to your account.</p>
        <button type="button" onClick={() => setShowAuth(true)} className="btn-primary px-8 py-3 text-sm">
          Sign in
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  const checks: AuthCheck[] = data?.checks || [];

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <div className="mb-10">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">History</p>
        <h1 className="text-3xl font-extrabold text-[#111] mb-1 font-syne">My checks</h1>
        <p className="text-[#aaa] text-sm">{user.email} · {checks.length} authentication{checks.length !== 1 ? "s" : ""}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white border border-[#e8e8e3] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : checks.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-[#aaa] text-sm mb-3">No checks yet.</p>
          <Link href="/check" className="text-[#111] font-semibold text-sm hover:text-[#555] transition-colors">
            Check your first pair →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {checks.map((check) => (
            <Link
              key={check.id}
              href={`/check/${check.id}/results`}
              className="flex items-center gap-4 p-4 bg-white border border-[#e8e8e3] rounded-xl hover:border-[#bbb] hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#111] text-sm truncate font-syne">{check.model}</div>
                <div className="text-xs text-[#aaa] mt-0.5 capitalize">{check.brand} · {formatDate(check.created_at)}</div>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide font-syne ${VERDICT_STYLES[check.overall_verdict] || VERDICT_STYLES.pending}`}>
                {check.overall_verdict}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
