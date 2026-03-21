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
      <nav className="sticky top-0 z-50 bg-[#f7f7f4]/95 backdrop-blur-md border-b border-[#e8e8e3]">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-syne font-extrabold text-base tracking-tight text-[#111]">
            Sneaker<span className="text-[#16a34a]">Auth</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/guides" className="text-sm text-[#666] hover:text-[#111] transition-colors hidden sm:block">Guides</Link>
            {user ? (
              <>
                <Link href="/account" className="text-sm text-[#666] hover:text-[#111] transition-colors">History</Link>
                <button type="button" onClick={logout} className="text-sm text-[#aaa] hover:text-[#666] transition-colors">Sign out</button>
              </>
            ) : (
              <button type="button" onClick={() => setShowAuth(true)} className="text-sm text-[#666] hover:text-[#111] transition-colors">Sign in</button>
            )}
            <Link href="/check" className="text-sm bg-[#111] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#333] transition-colors font-syne">
              Start a check
            </Link>
          </div>
        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
