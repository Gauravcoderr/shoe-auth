import { cn } from "@/lib/utils";

const BRANDS = [
  { slug: "nike", name: "Nike" },
  { slug: "jordan", name: "Jordan" },
  { slug: "adidas", name: "Adidas" },
  { slug: "yeezy", name: "Yeezy" },
  { slug: "new_balance", name: "New Balance" },
  { slug: "puma", name: "Puma" },
  { slug: "reebok", name: "Reebok" },
  { slug: "asics", name: "Asics" },
];

function ShoeIcon() {
  return (
    <svg width="24" height="16" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22c0 0 2-10 8-12s10 2 14 2 10-4 14-2 4 8 4 10c0 3-2 4-4 4H6c-2 0-2-2-2-2z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5"/>
      <path d="M12 10c0 0 4-6 10-6s8 4 8 6" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

interface Props {
  selected: string;
  onSelect: (slug: string) => void;
}

export default function BrandSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {BRANDS.map((brand) => (
        <button
          key={brand.slug}
          type="button"
          onClick={() => onSelect(brand.slug)}
          className={cn(
            "rounded-xl py-3 px-2 text-xs font-bold transition-all text-center border font-syne",
            selected === brand.slug
              ? "border-[#111] bg-[#111] text-white shadow-sm"
              : "border-[#e8e8e3] bg-white text-[#666] hover:border-[#bbb] hover:text-[#111]"
          )}
        >
          <div className="flex justify-center mb-1.5">
            <ShoeIcon />
          </div>
          {brand.name}
        </button>
      ))}
    </div>
  );
}
