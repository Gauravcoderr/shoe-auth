import Link from "next/link";
import Image from "next/image";

const GUIDES = [
  {
    slug: "nike",
    name: "Nike",
    desc: "Air Force 1, Dunk, Air Max — swoosh shape, sole color, stitching density",
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b0f3cc8-dc25-4e65-8f3d-c8ba1f15b2ba/dunk-low-retro-shoes-GGmM6z.png",
    count: 6,
  },
  {
    slug: "jordan",
    name: "Air Jordan",
    desc: "Jordan 1, 4, 11 — toe cap perforations, Jumpman proportions, heel stiffness",
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e7e9d5e7-6edd-48cb-92cd-dd5e9c774f00/air-jordan-1-retro-high-og-shoes-2zMDWz.png",
    count: 6,
  },
  {
    slug: "adidas",
    name: "Adidas",
    desc: "Samba, Stan Smith, Ultra Boost — 3-stripe spacing, BOOST foam, Primeknit weave",
    img: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
    count: 6,
  },
  {
    slug: "new-balance",
    name: "New Balance",
    desc: "550, 990 series — 'N' logo weight, ENCAP midsole ring, suede quality",
    img: "https://nb.scene7.com/is/image/NB/ML550BE1?$pdpflexf2$&wid=500&hei=500&qlt=80&fmt=webp",
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
            <div className="relative w-full h-44 bg-[#f7f7f4] overflow-hidden">
              <Image
                src={g.img}
                alt={g.name}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-3 left-4 text-white text-xs font-bold font-syne uppercase tracking-widest">
                {g.name}
              </span>
              <span className="absolute bottom-3 right-4 text-white/70 text-[10px] font-syne">
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
