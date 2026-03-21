"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFreesRemaining } from "@/lib/freeCheckTracker";

const VERDICTS = [
  { label: "AUTHENTIC", color: "text-green-500", bg: "bg-green-50" },
  { label: "FAKE", color: "text-red-500", bg: "bg-red-50" },
  { label: "INCONCLUSIVE", color: "text-amber-500", bg: "bg-amber-50" },
];

export default function HeroSection() {
  const [verdictIdx, setVerdictIdx] = useState(0);
  const [freesLeft, setFreesLeft] = useState(3);

  useEffect(() => {
    setFreesLeft(getFreesRemaining());
    const t = setInterval(() => setVerdictIdx(i => (i + 1) % VERDICTS.length), 2000);
    return () => clearInterval(t);
  }, []);

  const v = VERDICTS[verdictIdx];

  return (
    <section className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
      {/* Animated verdict badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${v.bg} mb-8 transition-colors duration-500`}>
        <span className={`w-2 h-2 rounded-full ${v.color.replace("text", "bg")} animate-pulse`} />
        <span className={`text-sm font-bold tracking-widest ${v.color}`}>{v.label}</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-tight mb-6">
        Is your sneaker real<br className="hidden sm:block" /> or fake?
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
        Upload photos from 5 angles. Our AI checks 50+ points — stitching, color, sole pattern, logo, badge, tongue label — and gives you a verdict in under 30 seconds.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <Link
          href="/check"
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg"
        >
          Check your pair →
        </Link>
        <Link href="/guides" className="text-gray-500 hover:text-gray-800 text-sm">
          Learn how to spot fakes
        </Link>
      </div>

      {freesLeft > 0 ? (
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-green-500">{freesLeft} free check{freesLeft !== 1 ? "s" : ""}</span> remaining — no account needed
        </p>
      ) : (
        <p className="text-sm text-gray-400">Free checks used — sign in to continue</p>
      )}

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs text-gray-400 uppercase tracking-wider">
        <span>AI-powered</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <span>50+ checkpoints</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <span>Nike · Jordan · Adidas · Yeezy · NB</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full" />
        <span>Results in ~30s</span>
      </div>
    </section>
  );
}
