import Link from "next/link";

const BRANDS = [
  { name: "Nike", slug: "nike" },
  { name: "Air Jordan", slug: "jordan" },
  { name: "Adidas", slug: "adidas" },
  { name: "Yeezy", slug: "yeezy" },
  { name: "New Balance", slug: "new_balance" },
  { name: "Puma", slug: "puma" },
  { name: "Reebok", slug: "reebok" },
  { name: "Asics", slug: "asics" },
];

export default function BrandGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20 border-t border-[#1a1a1a]">
      <div className="text-center mb-12">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Coverage</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-syne)" }}>
          Supported brands
        </h2>
        <p className="text-[#555] text-sm">Brand-specific fake indicators + model-level authentication checks</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/check?brand=${brand.slug}`}
            className="group bg-[#111] border border-[#1f1f1f] rounded-xl p-5 text-center hover:border-[#2a2a2a] hover:bg-[#161616] transition-all"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200">👟</div>
            <div className="font-bold text-white text-sm mb-1" style={{ fontFamily: "var(--font-syne)" }}>{brand.name}</div>
            <div className="text-xs text-[#22c55e]">✓ Supported</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
