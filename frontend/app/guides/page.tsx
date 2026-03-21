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
      <div className="mb-12">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Knowledge Base</p>
        <h1 className="text-4xl font-extrabold text-white mb-3 font-syne">Fake detection guides</h1>
        <p className="text-[#555] text-sm max-w-xl">
          Learn the key tells for each brand. Our AI checks these same points when you submit a pair.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group bg-[#111] border border-[#1f1f1f] rounded-xl p-6 hover:border-[#2a2a2a] hover:bg-[#161616] transition-all"
          >
            <div className="font-extrabold text-white mb-1 font-syne group-hover:text-[#22c55e] transition-colors">
              {g.name}
            </div>
            <p className="text-sm text-[#555] mb-4">{g.desc}</p>
            <div className="text-xs text-[#333] group-hover:text-[#555] transition-colors uppercase tracking-widest">
              Read guide →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
