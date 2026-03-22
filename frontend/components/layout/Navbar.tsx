"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#f7f7f4]/95 backdrop-blur-md border-b border-[#e8e8e3]">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="font-syne font-extrabold text-base tracking-tight text-[#111] shrink-0">
            Sneaker<span className="text-[#16a34a]">Auth</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-5">
            <Link href="/guides" className="text-sm text-[#666] hover:text-[#111] transition-colors">Guides</Link>
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

          {/* Mobile: CTA + 3-dot menu */}
          <div className="flex sm:hidden items-center gap-2">
            <Link href="/check" className="text-xs bg-[#111] text-white px-3 py-2 rounded-lg font-semibold font-syne shrink-0">
              Check →
            </Link>

            {/* 3-dot button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMenuOpen(o => !o)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#ededea] transition-colors"
              >
                {menuOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#111]">
                    <line x1="4" y1="4" x2="20" y2="20" />
                    <line x1="20" y1="4" x2="4" y2="20" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#555]">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white border border-[#e8e8e3] rounded-xl shadow-lg py-1.5 z-50">
                  <Link
                    href="/guides"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-[#444] hover:bg-[#f7f7f4] transition-colors"
                  >
                    Guides
                  </Link>
                  {user ? (
                    <>
                      <Link
                        href="/account"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#444] hover:bg-[#f7f7f4] transition-colors"
                      >
                        History
                      </Link>
                      <div className="border-t border-[#f0f0ec] my-1" />
                      <button
                        type="button"
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#aaa] hover:bg-[#f7f7f4] transition-colors"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-[#f0f0ec] my-1" />
                      <button
                        type="button"
                        onClick={() => { setShowAuth(true); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#111] hover:bg-[#f7f7f4] transition-colors"
                      >
                        Sign in / Sign up
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </nav>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
