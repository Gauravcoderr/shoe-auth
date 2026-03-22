"use client";
import { useEffect, useState } from "react";

const CARDS = [
  { brand: "Air Jordan 1", colorway: "Chicago", verdict: "pass" as const, bg: "#f5e6e6", accent: "#cc0000" },
  { brand: "Nike Dunk High", colorway: "Syracuse", verdict: "fail" as const, bg: "#fff3e0", accent: "#e65100" },
  { brand: "Nike Dunk Low", colorway: "Panda", verdict: "pass" as const, bg: "#f5f5f5", accent: "#111" },
  { brand: "Jordan 1 High", colorway: "Mocha", verdict: "fail" as const, bg: "#ede0d4", accent: "#5d4037" },
  { brand: "New Balance 550", colorway: "White/Green", verdict: "pass" as const, bg: "#e8f5e9", accent: "#1b5e20" },
  { brand: "Nike AF1", colorway: "Triple White", verdict: "pass" as const, bg: "#fafafa", accent: "#111" },
  { brand: "Adidas Samba", colorway: "Black/White", verdict: "pass" as const, bg: "#212121", accent: "#fff" },
];

const ROTATIONS = [-24, -14, -6, 0, 6, 14, 24];
const VERTICAL_OFFSETS = [28, 14, 6, 0, 6, 14, 28];

export default function FanCarousel() {
  const [center, setCenter] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setCenter((c) => (c + 1) % CARDS.length), 2500);
    return () => clearInterval(t);
  }, []);

  const visible = ROTATIONS.map((_, slot) => {
    const idx = (center - 3 + slot + CARDS.length * 5) % CARDS.length;
    return { card: CARDS[idx], slot, rotation: ROTATIONS[slot], lift: VERTICAL_OFFSETS[slot] };
  });

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ height: 340 }}>
      <div className="absolute inset-0 flex items-end justify-center pb-6">
        {visible.map(({ card, slot, rotation, lift }) => {
          const isCenter = slot === 3;
          const scale = isCenter ? 1.08 : slot === 2 || slot === 4 ? 0.96 : slot === 1 || slot === 5 ? 0.88 : 0.78;
          const opacity = slot === 0 || slot === 6 ? 0.45 : slot === 1 || slot === 5 ? 0.72 : 1;
          const zIndex = isCenter ? 30 : slot === 2 || slot === 4 ? 20 : slot === 1 || slot === 5 ? 10 : 5;

          return (
            <div
              key={`${slot}-${card.brand}`}
              onClick={() => setCenter((center - 3 + slot + CARDS.length * 5) % CARDS.length)}
              className="absolute cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                transform: `translateX(${(slot - 3) * 118}px) translateY(${lift}px) rotate(${rotation}deg) scale(${scale})`,
                opacity,
                zIndex,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="rounded-2xl overflow-hidden shadow-lg border flex flex-col"
                style={{
                  width: 148,
                  height: 200,
                  borderColor: isCenter ? "#d1d5db" : "#e8e8e3",
                  boxShadow: isCenter ? "0 20px 40px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.08)",
                  background: card.bg,
                }}
              >
                {/* Brand visual block */}
                <div className="flex-1 flex flex-col items-center justify-center px-3 py-4 gap-1">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest font-syne"
                    style={{ color: card.accent }}
                  >
                    {card.brand.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span
                    className="text-[28px] font-black font-syne leading-none"
                    style={{ color: card.accent }}
                  >
                    {card.brand.split(" ").pop()}
                  </span>
                  <span
                    className="text-[9px] mt-1 font-medium opacity-60"
                    style={{ color: card.accent }}
                  >
                    {card.colorway}
                  </span>
                </div>

                {/* Verdict badge */}
                <div className="px-3 pb-3 pt-1 border-t border-black/5">
                  <VerdictBadge verdict={card.verdict} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f7f7f4] to-transparent pointer-events-none z-40" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f7f7f4] to-transparent pointer-events-none z-40" />
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: "pass" | "fail" }) {
  const isPass = verdict === "pass";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${isPass ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"}`}>
      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-black ${isPass ? "bg-[#16a34a]" : "bg-[#dc2626]"}`}>
        {isPass ? "✓" : "✕"}
      </span>
      {isPass ? "Authentic" : "Fake"}
    </span>
  );
}
