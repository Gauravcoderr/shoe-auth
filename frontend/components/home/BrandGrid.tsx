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

function ShoeIcon() {
  return (
    <svg width="32" height="22" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22c0 0 2-10 8-12s10 2 14 2 10-4 14-2 4 8 4 10c0 3-2 4-4 4H6c-2 0-2-2-2-2z" fill="#f0f0ec" stroke="#ddd" strokeWidth="1.5"/>
      <path d="M12 10c0 0 4-6 10-6s8 4 8 6" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 18c4 0 8-2 12-2s8 2 12 2" stroke="#ddd" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

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
            className="group bg-white border border-[#e8e8e3] rounded-xl p-5 text-center hover:border-[#111] hover:shadow-sm transition-all"
          >
            <div className="flex justify-center mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <ShoeIcon />
            </div>
            <div className="font-extrabold text-[#111] text-sm font-syne">{brand.name}</div>
            <div className="text-xs text-[#16a34a] mt-1 font-medium">✓ Supported</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
