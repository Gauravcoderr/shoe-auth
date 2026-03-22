import Link from "next/link";

const BRANDS = [
  { name: "Nike",        slug: "nike",        bgClass: "bg-white",     logo: "/logos/nike.svg",        logoClass: "w-28 h-10 object-contain" },
  { name: "Air Jordan",  slug: "jordan",      bgClass: "bg-[#fef2f2]", logo: "/logos/jordan.svg",      logoClass: "w-16 h-20 object-contain" },
  { name: "Adidas",      slug: "adidas",      bgClass: "bg-white",     logo: "/logos/adidas.svg",      logoClass: "w-24 h-16 object-contain" },
  { name: "New Balance", slug: "new_balance", bgClass: "bg-[#eff6ff]", logo: "/logos/new-balance.svg", logoClass: "w-32 h-14 object-contain" },
];

export default function BrandGrid() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20 border-t border-[#e8e8e3]">
      <div className="text-center mb-12">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">Coverage</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111] mb-2 font-syne">Supported brands</h2>
        <p className="text-[#aaa] text-sm">Brand-specific fake indicators + model-level checks</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/check?brand=${brand.slug}`}
            className="group bg-white border border-[#e8e8e3] rounded-xl overflow-hidden hover:border-[#111] hover:shadow-sm transition-all"
          >
            <div className={`w-full h-28 flex items-center justify-center ${brand.bgClass}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo} alt={brand.name} className={brand.logoClass} />
            </div>
            <div className="p-4">
              <div className="font-extrabold text-[#111] text-sm font-syne">{brand.name}</div>
              <div className="text-xs text-[#16a34a] mt-1 font-medium">✓ Supported</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
