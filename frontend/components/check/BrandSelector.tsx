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
          onClick={() => onSelect(brand.slug)}
          className={cn(
            "rounded-xl py-3 px-2 text-xs font-bold transition-all text-center border",
            selected === brand.slug
              ? "border-white bg-white text-black"
              : "border-[#222] bg-[#111] text-[#888] hover:border-[#333] hover:text-white"
          )}
        >
          <div className="text-lg mb-1">👟</div>
          {brand.name}
        </button>
      ))}
    </div>
  );
}
