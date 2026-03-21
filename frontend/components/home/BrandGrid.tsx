import Link from "next/link";
import Image from "next/image";

const BRANDS = [
  { name: "Nike", slug: "nike", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80" },
  { name: "Air Jordan", slug: "jordan", img: "https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=300&q=80" },
  { name: "Adidas", slug: "adidas", img: "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=300&q=80" },
  { name: "Yeezy", slug: "yeezy", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80" },
  { name: "New Balance", slug: "new_balance", img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=300&q=80" },
  { name: "Puma", slug: "puma", img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80" },
  { name: "Reebok", slug: "reebok", img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&q=80" },
  { name: "Asics", slug: "asics", img: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=300&q=80" },
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
            <div className="relative w-full h-28 bg-[#f7f7f4] overflow-hidden">
              <Image
                src={brand.img}
                alt={brand.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
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
