import Link from "next/link";

const GUIDES = [
  {
    slug: "nike",
    name: "Nike",
    desc: "Air Force 1, Dunk, Air Max — swoosh shape, sole color, stitching density",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    bg: "bg-[#f7f7f4]",
    accent: "text-[#111]",
    count: 6,
  },
  {
    slug: "jordan",
    name: "Air Jordan",
    desc: "Jordan 1, 4, 11 — toe cap perforations, Jumpman proportions, heel stiffness",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg",
    bg: "bg-[#fef2f2]",
    accent: "text-[#cc0000]",
    count: 6,
  },
  {
    slug: "adidas",
    name: "Adidas",
    desc: "Samba, Stan Smith, Ultra Boost — 3-stripe spacing, BOOST foam, Primeknit weave",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    bg: "bg-[#f7f7f4]",
    accent: "text-[#111]",
    count: 6,
  },
  {
    slug: "new-balance",
    name: "New Balance",
    desc: "550, 990 series — 'N' logo weight, ENCAP midsole ring, suede quality",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg",
    bg: "bg-[#eff6ff]",
    accent: "text-[#1d4ed8]",
    count: 5,
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <div className="mb-14">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">Knowledge Base</p>
        <h1 className="text-4xl font-extrabold text-[#111] mb-3 font-syne">Fake detection guides</h1>
        <p className="text-[#888] text-sm max-w-xl leading-relaxed">
          Learn the key tells for each brand. Our AI checks these same points when you submit a pair.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="group bg-white border border-[#e8e8e3] rounded-2xl overflow-hidden hover:border-[#111] hover:shadow-md transition-all"
          >
            <div className={`w-full h-44 ${g.bg} flex flex-col items-center justify-center gap-3 relative overflow-hidden`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.logo}
                alt={g.name}
                className="h-16 w-16 object-contain"
              />
              <span className={`text-xs font-black uppercase tracking-widest font-syne ${g.accent}`}>
                {g.name}
              </span>
              <span className="absolute bottom-3 right-4 text-[10px] text-[#bbb] font-syne">
                {g.count} checkpoints
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#666] leading-relaxed mb-4">{g.desc}</p>
              <div className="text-xs font-bold text-[#111] group-hover:text-[#16a34a] transition-colors uppercase tracking-widest font-syne">
                Read guide →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-[#111] rounded-2xl p-8 text-center">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-3 font-syne">Skip the reading</p>
        <h2 className="text-2xl font-extrabold text-white mb-2 font-syne">Let AI do the checking</h2>
        <p className="text-[#666] text-sm mb-6 max-w-sm mx-auto">
          Upload your shoe photos and our AI runs all these checkpoints automatically in under 30 seconds.
        </p>
        <Link href="/check" className="inline-block bg-white text-black px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#e5e5e5] transition-colors font-syne">
          Start a check →
        </Link>
      </div>
    </div>
  );
}
