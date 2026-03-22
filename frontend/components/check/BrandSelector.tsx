"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

const BRANDS = [
  {
    slug: "nike",
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  },
  {
    slug: "jordan",
    name: "Jordan",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg",
  },
  {
    slug: "adidas",
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  },
  {
    slug: "new_balance",
    name: "New Balance",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
  },
];

interface Props {
  selected: string;
  onSelect: (slug: string) => void;
}

export default function BrandSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {BRANDS.map((brand) => (
        <button
          key={brand.slug}
          type="button"
          onClick={() => onSelect(brand.slug)}
          className={cn(
            "rounded-xl py-4 px-2 text-xs font-bold transition-all text-center border font-syne flex flex-col items-center gap-3",
            selected === brand.slug
              ? "border-[#111] bg-[#111] shadow-sm"
              : "border-[#e8e8e3] bg-white text-[#666] hover:border-[#bbb] hover:text-[#111]"
          )}
        >
          <div className="h-9 w-full flex items-center justify-center">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={72}
              height={36}
              className={cn(
                "object-contain max-h-9 w-auto",
                selected === brand.slug ? "brightness-0 invert" : "brightness-0"
              )}
              unoptimized
            />
          </div>
          <span className={selected === brand.slug ? "text-white" : "text-[#666]"}>
            {brand.name}
          </span>
        </button>
      ))}
    </div>
  );
}
