import Link from "next/link";

const GUIDES = [
  { slug: "nike", name: "Nike", desc: "Air Force 1, Dunk, Air Max — common fake tells" },
  { slug: "jordan", name: "Air Jordan", desc: "Jordan 1, 4, 11 — perforation counts, Jumpman proportions" },
  { slug: "adidas", name: "Adidas", desc: "Samba, Stan Smith, Ultra Boost — 3-stripe spacing" },
  { slug: "yeezy", name: "Yeezy", desc: "350 V2, 700 — Primeknit patterns, BOOST sole" },
  { slug: "new-balance", name: "New Balance", desc: "550, 990 — 'N' logo, ENCAP midsole" },
  { slug: "puma", name: "Puma", desc: "Suede Classic — formstrip width, cat logo" },
  { slug: "reebok", name: "Reebok", desc: "Classic Leather, Club C — vector logo" },
  { slug: "asics", name: "Asics", desc: "Gel-Kayano, GT-2160 — GEL unit, stripe angles" },
];

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Fake detection guides</h1>
      <p className="text-gray-500 mb-10">
        Learn the key tells for each brand. Our AI checks these same points when you submit a pair.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="border border-gray-200 rounded-2xl p-5 hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <div className="font-bold text-gray-900 mb-1">{g.name}</div>
            <p className="text-sm text-gray-500">{g.desc}</p>
            <div className="text-xs text-gray-400 mt-3">Read guide →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
