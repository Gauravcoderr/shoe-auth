"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const CARDS = [
  {
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e7e9d5e7-6edd-48cb-92cd-dd5e9c774f00/air-jordan-1-retro-high-og-shoes-2zMDWz.png",
    brand: "Air Jordan 1",
    colorway: "Chicago",
    verdict: "pass" as const,
  },
  {
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2a9d8d90-dc37-4b2b-a67c-63b5ba8f7568/dunk-high-retro-shoes-QJRbfl.png",
    brand: "Nike Dunk High",
    colorway: "Syracuse",
    verdict: "fail" as const,
  },
  {
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b0f3cc8-dc25-4e65-8f3d-c8ba1f15b2ba/dunk-low-retro-shoes-GGmM6z.png",
    brand: "Nike Dunk Low",
    colorway: "Panda",
    verdict: "pass" as const,
  },
  {
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/iupkuknl5qcx9lrzuxhz/air-jordan-1-retro-high-og-shoes.png",
    brand: "Jordan 1 High",
    colorway: "Mocha",
    verdict: "fail" as const,
  },
  {
    img: "https://nb.scene7.com/is/image/NB/ML550BE1?$pdpflexf2$&wid=500&hei=500&qlt=80&fmt=webp",
    brand: "New Balance 550",
    colorway: "White/Green",
    verdict: "pass" as const,
  },
  {
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
    brand: "Nike AF1",
    colorway: "Triple White",
    verdict: "pass" as const,
  },
  {
    img: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2938800fb7264dd99e86adf200d4ccbf_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg",
    brand: "Adidas Samba",
    colorway: "Black/White",
    verdict: "pass" as const,
  },
];

// Fan rotation angles per slot (center = 0)
const ROTATIONS = [-24, -14, -6, 0, 6, 14, 24];
const VERTICAL_OFFSETS = [28, 14, 6, 0, 6, 14, 28]; // arc lift

export default function FanCarousel() {
  const [center, setCenter] = useState(3); // which card index is in center

  // Auto-rotate every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setCenter((c) => (c + 1) % CARDS.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Build 7 visible cards centered on `center`
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
                className="rounded-2xl overflow-hidden shadow-lg border"
                style={{
                  width: 148,
                  height: 200,
                  background: "#f4f4f0",
                  borderColor: isCenter ? "#d1d5db" : "#e8e8e3",
                  boxShadow: isCenter
                    ? "0 20px 40px rgba(0,0,0,0.15)"
                    : "0 4px 16px rgba(0,0,0,0.08)",
                }}
              >
                {/* Product image */}
                <div className="relative w-full" style={{ height: 148 }}>
                  <Image
                    src={card.img}
                    alt={card.brand}
                    fill
                    className="object-cover"
                    sizes="148px"
                  />
                </div>

                {/* Verdict badge */}
                <div className="px-3 py-2.5 flex flex-col gap-1">
                  <VerdictBadge verdict={card.verdict} />
                  <p className="text-[10px] text-[#888] truncate">{card.brand}</p>
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
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
      style={{
        background: isPass ? "#dcfce7" : "#fee2e2",
        color: isPass ? "#16a34a" : "#dc2626",
      }}
    >
      <span
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-black"
        style={{ background: isPass ? "#16a34a" : "#dc2626" }}
      >
        {isPass ? "✓" : "✕"}
      </span>
      {isPass ? "Pass" : "Not Pass"}
    </span>
  );
}
