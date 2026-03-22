import Image from "next/image";
import Link from "next/link";

export default function WhatSetsUsApart() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20 border-t border-[#e8e8e3]">
      <div className="text-center mb-12">
        <p className="text-xs text-[#bbb] uppercase tracking-widest font-syne">What sets us apart</p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-auto">

        {/* Row 1 */}

        {/* Card 1 — Large shoe card with AI badge */}
        <div className="sm:row-span-2 bg-[#f0f0ec] border border-[#e8e8e3] rounded-2xl overflow-hidden relative flex flex-col justify-between min-h-[340px]">
          <div className="relative flex-1 w-full">
            <Image
              src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b0f3cc8-dc25-4e65-8f3d-c8ba1f15b2ba/dunk-low-retro-shoes-GGmM6z.png"
              alt="Sneaker authentication"
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            {/* Floating AI checker badges */}
            <div className="absolute top-6 left-5 bg-white/90 backdrop-blur-sm text-[#111] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm font-syne border border-[#e8e8e3]">
              AI Checker ✓
            </div>
            <div className="absolute bottom-16 right-5 bg-white/90 backdrop-blur-sm text-[#111] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm font-syne border border-[#e8e8e3]">
              AI Checker ✓
            </div>
          </div>
          <div className="p-5 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-extrabold text-[#111] font-syne mb-1">AI-powered authentication</h3>
            <p className="text-sm text-[#888]">50+ checkpoints analyzed per shoe in under 30 seconds.</p>
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

        {/* Card 3 — Pricing / Free tier */}
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

        {/* Row 2 */}

        {/* Card 4 — 50+ checkpoints */}
        <div className="bg-white border border-[#e8e8e3] rounded-2xl p-7">
          <p className="text-xs text-[#bbb] uppercase tracking-widest font-syne mb-4">Coverage</p>
          <div className="text-5xl font-extrabold text-[#111] font-syne mb-2">50+</div>
          <p className="text-base font-extrabold text-[#111] font-syne mb-2">Checkpoints per shoe</p>
          <p className="text-sm text-[#888] leading-relaxed">
            Shape, stitching, logos, sole tread, tongue labels, heel tabs, serial numbers — checked automatically.
          </p>
        </div>

        {/* Card 5 — Product image */}
        <div className="relative bg-[#f7f7f4] border border-[#e8e8e3] rounded-2xl overflow-hidden min-h-[200px]">
          <Image
            src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c5adc7bc-8bd9-4cf2-accc-81d63b0d73ea/dunk-low-retro-shoes-GGmM6z.png"
            alt="Sneakers on display"
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-white font-extrabold text-base font-syne">Certificate of Authentication</p>
            <p className="text-white/60 text-xs mt-1">Issued for every authentic pair</p>
          </div>
        </div>

      </div>
    </section>
  );
}
