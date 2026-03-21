import Link from "next/link";

const BRANDS = [
  { name: "Nike", slug: "nike", emoji: "✔" },
  { name: "Air Jordan", slug: "jordan", emoji: "✔" },
  { name: "Adidas", slug: "adidas", emoji: "✔" },
  { name: "Yeezy", slug: "yeezy", emoji: "✔" },
  { name: "New Balance", slug: "new_balance", emoji: "✔" },
  { name: "Puma", slug: "puma", emoji: "✔" },
  { name: "Reebok", slug: "reebok", emoji: "✔" },
  { name: "Asics", slug: "asics", emoji: "✔" },
];

export default function BrandGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3">
        Supported brands
      </h2>
      <p className="text-center text-gray-500 text-sm mb-10">
        Brand-specific fake indicators + model-level authentication checks
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/check?brand=${brand.slug}`}
            className="border border-gray-200 rounded-2xl p-5 text-center hover:border-gray-400 hover:shadow-sm transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👟</div>
            <div className="font-semibold text-gray-900 text-sm">{brand.name}</div>
            <div className="text-xs text-green-500 mt-1">{brand.emoji} Supported</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
