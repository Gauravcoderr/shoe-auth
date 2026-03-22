import Link from "next/link";

const BRANDS = [
  {
    name: "Nike",
    slug: "nike",
    // Official Nike Swoosh — Wikimedia Commons
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    bg: "bg-white",
    models: "Air Force 1 · Dunk · Air Max",
  },
  {
    name: "Air Jordan",
    slug: "jordan",
    // Official Jumpman logo — Wikimedia
    logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg",
    bg: "bg-[#fef2f2]",
    models: "Jordan 1 · 3 · 4 · 11",
  },
  {
    name: "Adidas",
    slug: "adidas",
    // Official Adidas wordmark — Wikimedia Commons
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    bg: "bg-white",
    models: "Samba · Stan Smith · Ultra Boost",
  },
  {
    name: "New Balance",
    slug: "new_balance",
    // Official New Balance logo — Wikimedia Commons
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
    bg: "bg-white",
    models: "550 · 990 · 574 · 9060",
  },
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
            <div className={`w-full h-28 flex items-center justify-center px-6 ${brand.bg} group-hover:bg-[#f7f7f4] transition-colors`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-12 max-w-full object-contain"
              />
            </div>
            <div className="p-4">
              <div className="font-extrabold text-[#111] text-sm font-syne">{brand.name}</div>
              <div className="text-[10px] text-[#bbb] mt-0.5 truncate">{brand.models}</div>
              <div className="text-xs text-[#16a34a] mt-1.5 font-medium">✓ Supported</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
