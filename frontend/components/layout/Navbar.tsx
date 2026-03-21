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
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">
            Sneaker<span className="text-green-500">Auth</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/guides" className="text-sm text-gray-500 hover:text-gray-800 hidden sm:block">
              Guides
            </Link>
            <Link
              href="/check"
              className="text-sm bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              Check a shoe
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/account" className="text-sm text-gray-500 hover:text-gray-800">
                  History
                </Link>
                <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-700">
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm text-gray-500 hover:text-gray-800"
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
