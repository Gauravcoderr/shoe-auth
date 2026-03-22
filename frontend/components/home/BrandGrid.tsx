import Link from "next/link";

const BRANDS = [
  {
    name: "Nike",
    slug: "nike",
    bgClass: "bg-[#f7f7f4]",
    logo: (
      <svg viewBox="0 0 148 57" className="w-24 h-10 fill-[#111]" aria-label="Nike">
        <path d="M14.088 57L148 10.965 98.14 0 0 34.95z" />
      </svg>
    ),
  },
  {
    name: "Air Jordan",
    slug: "jordan",
    bgClass: "bg-[#fef2f2]",
    logo: (
      // Jumpman silhouette
      <svg viewBox="0 0 100 120" className="w-12 h-14 fill-[#dc2626]" aria-label="Air Jordan">
        <path d="M50 2c-3 0-5.5 1-7.5 3-1.5 1.5-2.5 3.5-2.5 5.5 0 1.5.5 3 1.5 4.5-2-.5-3.5-.5-5 0-2.5.5-4.5 2-6 4.5-1 1.5-1 3.5-.5 5.5.5 2 2 3.5 4 4.5-2.5 1-5 2.5-7 5-2 2.5-3 5.5-2.5 8.5.5 3 2.5 5.5 5 7 1.5 1 3.5 1.5 5.5 1.5h1.5L22 70c-1.5 3.5-2 7.5-1.5 11.5s2 7.5 4.5 10.5l5.5 6.5c1 1 2 2.5 2.5 4l1.5 5c.5 1.5 1.5 3 3 4 1.5 1 3 1.5 4.5 1.5h1c1.5-.5 2.5-1.5 3-3 .5-1.5 0-3-.5-4l-2-3.5c-.5-1-1-2.5-1-4v-2l1-2.5 1.5-2c.5-1 1-2.5.5-4-.5-1.5-1.5-2.5-3-3l-2.5-.5c-.5 0-1 0-1.5-.5s-.5-1-.5-1.5c.5-2 2.5-4 5-6l7.5-5.5c3-2 5.5-4.5 7-7.5 1-2 1.5-4 1.5-6v-1.5l5 2c1.5.5 3 1 4.5 1 2.5 0 5-.5 7-2 2-1.5 3.5-3.5 4-6 .5-2.5 0-5-1.5-7-1.5-2-3.5-3.5-6-4-1-.5-2.5-.5-3.5-.5l-2 .5c1-1.5 1.5-3 1.5-5 0-2-.5-4-2-5.5C55.5 3 53 2 50 2z" />
      </svg>
    ),
  },
  {
    name: "Adidas",
    slug: "adidas",
    bgClass: "bg-[#f7f7f4]",
    logo: (
      <svg viewBox="0 0 200 80" className="w-28 h-12 fill-[#111]" aria-label="Adidas">
        {/* Trefoil-style 3 bars mountain */}
        <polygon points="100,0 145,80 55,80" />
        <polygon points="55,80 100,0 145,80" fillOpacity="0" stroke="none" />
        {/* text */}
        <text x="100" y="75" textAnchor="middle" fontSize="22" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#111" dy="-5">adidas</text>
      </svg>
    ),
  },
  {
    name: "New Balance",
    slug: "new_balance",
    bgClass: "bg-[#eff6ff]",
    logo: (
      <svg viewBox="0 0 120 60" className="w-24 h-12" aria-label="New Balance">
        <text x="10" y="48" fontSize="56" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="#1d4ed8">N</text>
        <text x="60" y="48" fontSize="24" fontFamily="Arial Black, sans-serif" fontWeight="700" fill="#111">B</text>
      </svg>
    ),
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
            <div
              className={`w-full h-28 flex items-center justify-center transition-colors duration-300 ${brand.bgClass}`}
            >
              {brand.logo}
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
