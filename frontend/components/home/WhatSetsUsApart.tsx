import Link from "next/link";

export default function WhatSetsUsApart() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20 border-t border-[#e8e8e3]">
      <div className="text-center mb-12">
        <p className="text-xs text-[#bbb] uppercase tracking-widest font-syne">What sets us apart</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-auto">

        {/* Card 1 — AI authentication visual */}
        <div className="sm:row-span-2 bg-[#111] border border-[#222] rounded-2xl overflow-hidden relative flex flex-col justify-between min-h-[340px]">
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
            {/* Animated scan lines */}
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-2xl border-2 border-[#16a34a]/40" />
              <div className="absolute inset-2 rounded-xl border border-[#16a34a]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">👟</span>
              </div>
              {/* Corner marks */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#16a34a] rounded-tl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#16a34a] rounded-tr" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#16a34a] rounded-bl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#16a34a] rounded-br" />
            </div>
            <div className="bg-[#16a34a]/10 border border-[#16a34a]/30 rounded-full px-4 py-1.5">
              <span className="text-[#16a34a] text-xs font-bold font-syne">AI Scanning · 74 Checkpoints</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
              <span className="text-white/60 text-xs font-syne">Result in &lt; 30 seconds</span>
            </div>
          </div>
          <div className="p-5 border-t border-white/10">
            <h3 className="text-lg font-extrabold text-white font-syne mb-1">AI-powered authentication</h3>
            <p className="text-sm text-[#555]">74 checkpoints analyzed per shoe in under 30 seconds.</p>
          </div>
        </div>

        {/* Card 2 — Speed */}
        <div className="bg-white border border-[#e8e8e3] rounded-2xl p-7 flex flex-col justify-between">
          <div>
            <p className="text-[#aaa] text-2xl font-extrabold font-syne leading-tight mb-1">Real results.</p>
            <p className="text-[#16a34a] text-2xl font-extrabold font-syne leading-tight">Lightning Fast.</p>
          </div>
          <div className="mt-6 inline-flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-4 py-2.5 self-start">
            <span className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-xs font-extrabold font-syne flex-shrink-0">30s</span>
            <span className="text-sm text-[#16a34a] font-semibold">Results in under 30 seconds</span>
          </div>
        </div>

        {/* Card 3 — Pricing */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-7 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#555] uppercase tracking-widest font-syne mb-3">Pricing</p>
            <h3 className="text-2xl font-extrabold text-white font-syne leading-snug mb-1">
              First 3 checks<br />
              <span className="text-[#16a34a]">always free.</span>
            </h3>
          </div>
          <div className="mt-6">
            <p className="text-sm text-[#555] mb-4">No credit card needed. Sign in after your free checks to unlock unlimited authentication.</p>
            <Link href="/check" className="inline-block bg-white text-black text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-[#e5e5e5] transition-colors font-syne">
              Start free →
            </Link>
          </div>
        </div>

        {/* Card 4 — 50+ checkpoints */}
        <div className="bg-white border border-[#e8e8e3] rounded-2xl p-7">
          <p className="text-xs text-[#bbb] uppercase tracking-widest font-syne mb-4">Coverage</p>
          <div className="text-5xl font-extrabold text-[#111] font-syne mb-2">74</div>
          <p className="text-base font-extrabold text-[#111] font-syne mb-2">Checkpoints per shoe</p>
          <p className="text-sm text-[#888] leading-relaxed">
            Shape, stitching, logos, sole tread, tongue labels, heel tabs, serial numbers — all checked automatically.
          </p>
        </div>

        {/* Card 5 — Certificate */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-7 flex flex-col justify-between min-h-[200px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-lg font-black">✓</div>
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-widest font-syne">Authenticated</span>
          </div>
          <div>
            <p className="text-[#111] font-extrabold text-base font-syne mb-1">Certificate of Authentication</p>
            <p className="text-[#16a34a]/70 text-xs">Issued for every verified authentic pair</p>
          </div>
        </div>

      </div>
    </section>
  );
}
