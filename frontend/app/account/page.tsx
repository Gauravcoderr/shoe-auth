"use client";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { AuthCheck } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";

const VERDICT_STYLES = {
  authentic: "text-green-700 bg-green-100",
  fake: "text-red-700 bg-red-100",
  inconclusive: "text-amber-700 bg-amber-100",
  pending: "text-gray-500 bg-gray-100",
};

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["check-history"],
    queryFn: () => api.getHistory(),
    enabled: !!user,
  });

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">👟</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to see your checks</h2>
        <p className="text-gray-500 text-sm mb-6">Your authentication history is saved to your account.</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700"
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My checks</h1>
      <p className="text-gray-500 text-sm mb-8">{user.email} · {checks.length} authentication{checks.length !== 1 ? "s" : ""}</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : checks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-500 text-sm">No checks yet.</p>
          <Link href="/check" className="text-gray-900 font-medium text-sm hover:underline mt-2 inline-block">
            Check your first pair →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {checks.map((check) => (
            <Link
              key={check.id}
              href={`/check/${check.id}/results`}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{check.model}</div>
                <div className="text-xs text-gray-400 mt-0.5">{check.brand} · {formatDate(check.created_at)}</div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${VERDICT_STYLES[check.overall_verdict] || VERDICT_STYLES.pending}`}>
                {check.overall_verdict.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
