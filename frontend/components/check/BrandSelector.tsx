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
    <div className="grid grid-cols-4 gap-3">
      {BRANDS.map((brand) => (
        <button
          key={brand.slug}
          onClick={() => onSelect(brand.slug)}
          className={cn(
            "border rounded-xl py-3 px-2 text-xs font-semibold transition-all text-center",
            selected === brand.slug
              ? "border-gray-900 bg-gray-900 text-white shadow-sm"
              : "border-gray-200 text-gray-600 hover:border-gray-400"
          )}
        >
          <div className="text-lg mb-1">👟</div>
          {brand.name}
        </button>
      ))}
    </div>
  );
}
