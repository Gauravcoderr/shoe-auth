"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-syne font-800 text-lg tracking-tight text-white">
            Sneaker<span className="text-[#22c55e]">Auth</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/guides" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block font-medium">
              Guides
            </Link>
            <Link
              href="/check"
              className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-bold hover:bg-[#e5e5e5] transition-colors"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Check a shoe
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/account" className="text-sm text-[#888] hover:text-white transition-colors">
                  History
                </Link>
                <button onClick={logout} className="text-sm text-[#555] hover:text-[#888] transition-colors">
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm text-[#888] hover:text-white transition-colors"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
