"use client";
import { cn } from "@/lib/utils";

const BRANDS = [
  {
    slug: "nike",
    name: "Nike",
    // verified HTTP 200, image/svg+xml
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  },
  {
    slug: "jordan",
    name: "Jordan",
    // verified HTTP 200, image/svg+xml
    logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg",
  },
  {
    slug: "adidas",
    name: "Adidas",
    // verified HTTP 200, image/svg+xml
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  },
  {
    slug: "new_balance",
    name: "New Balance",
    // verified HTTP 200, image/png (SVG served as xml — use PNG thumbnail)
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/New_Balance_logo.svg/300px-New_Balance_logo.svg.png",
  },
];

interface Props {
  selected: string;
  onSelect: (slug: string) => void;
}

export default function BrandSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {BRANDS.map((brand) => {
        const active = selected === brand.slug;
        return (
          <button
            key={brand.slug}
            type="button"
            onClick={() => onSelect(brand.slug)}
            className={cn(
              "rounded-xl py-5 px-3 text-xs font-bold transition-all text-center border font-syne flex flex-col items-center gap-3",
              active
                ? "border-[#111] bg-[#111] text-white shadow-lg scale-[1.02]"
                : "border-[#e8e8e3] bg-white text-[#666] hover:border-[#bbb] hover:text-[#111] hover:shadow-sm"
            )}
          >
            <div className="h-10 w-full flex items-center justify-center px-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={brand.name}
                className={cn("max-h-10 max-w-full object-contain", active ? "brightness-0 invert" : "brightness-0")}
              />
            </div>
            <span className="tracking-wide">{brand.name}</span>
          </button>
        );
      })}
    </div>
  );
}
