"use client";
import { cn } from "@/lib/utils";

const BRANDS = [
  { slug: "nike", name: "Nike" },
  { slug: "jordan", name: "Jordan" },
  { slug: "adidas", name: "Adidas" },
  { slug: "new_balance", name: "New Balance" },
];

function NikeLogo({ active }: { active: boolean }) {
  return (
    <svg width="60" height="22" viewBox="0 0 200 75" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M199.9 5.4L45.5 67.8c-11 4.6-20.9 6.4-29.1 5.3C8.5 71.9 3 67.3.5 60.7c-2.5-6.6-1-14.8 6.5-22.9L199.9 5.4z"
        fill={active ? "white" : "#111"}
      />
    </svg>
  );
}

function JordanLogo({ active }: { active: boolean }) {
  const c = active ? "white" : "#111";
  return (
    <svg width="32" height="36" viewBox="0 0 100 115" fill={c} xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="50" cy="12" r="10" />
      {/* Body leaning */}
      <path d="M50 22 L28 52 L10 44 L16 60 L34 56 L50 78 L66 56 L84 60 L90 44 L72 52 Z" />
      {/* Legs */}
      <path d="M38 78 L30 105 L46 98 L50 112 L54 98 L70 105 L62 78 Z" />
    </svg>
  );
}

function AdidasLogo({ active }: { active: boolean }) {
  const c = active ? "white" : "#111";
  return (
    <svg width="44" height="30" viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three stripes mountain */}
      <path d="M70 4 L4 88 L136 88 Z" fill={c} />
      {/* Cut out stripes */}
      <rect x="30" y="60" width="10" height="28" fill={active ? "#111" : "white"} />
      <rect x="65" y="44" width="10" height="44" fill={active ? "#111" : "white"} />
      <rect x="100" y="60" width="10" height="28" fill={active ? "#111" : "white"} />
    </svg>
  );
}

function NewBalanceLogo({ active }: { active: boolean }) {
  const c = active ? "white" : "#111";
  return (
    <svg width="52" height="26" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* N */}
      <rect x="4" y="8" width="10" height="64" fill={c} />
      <path d="M4 8 L54 72 L54 8" stroke={c} strokeWidth="10" fill="none" strokeLinejoin="miter" />
      <rect x="44" y="8" width="10" height="64" fill={c} />
      {/* B */}
      <rect x="70" y="8" width="10" height="64" fill={c} />
      <path d="M80 8 Q116 8 116 26 Q116 40 80 40 Q116 40 116 58 Q116 72 80 72" stroke={c} strokeWidth="10" fill="none" />
    </svg>
  );
}

interface Props {
  selected: string;
  onSelect: (slug: string) => void;
}

export default function BrandSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {BRANDS.map((brand) => {
        const active = selected === brand.slug;
        return (
          <button
            key={brand.slug}
            type="button"
            onClick={() => onSelect(brand.slug)}
            className={cn(
              "rounded-xl py-4 px-2 text-xs font-bold transition-all text-center border font-syne flex flex-col items-center gap-3",
              active
                ? "border-[#111] bg-[#111] text-white shadow-sm"
                : "border-[#e8e8e3] bg-white text-[#666] hover:border-[#bbb] hover:text-[#111]"
            )}
          >
            <div className="h-8 flex items-center justify-center">
              {brand.slug === "nike" && <NikeLogo active={active} />}
              {brand.slug === "jordan" && <JordanLogo active={active} />}
              {brand.slug === "adidas" && <AdidasLogo active={active} />}
              {brand.slug === "new_balance" && <NewBalanceLogo active={active} />}
            </div>
            <span>{brand.name}</span>
          </button>
        );
      })}
    </div>
  );
}
