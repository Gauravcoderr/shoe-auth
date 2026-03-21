import Link from "next/link";

const BRAND_GUIDES: Record<string, { name: string; intro: string; checks: { title: string; detail: string }[] }> = {
  nike: {
    name: "Nike",
    intro: "Nike is the most counterfeited sneaker brand in the world. Here are the key things to look for when authenticating Nike shoes.",
    checks: [
      { title: "Swoosh shape & placement", detail: "The Nike Swoosh should be a smooth, consistent curve. On fakes it's often too thick, too thin, or placed at the wrong angle. Check both sides — they should be mirror images." },
      { title: "Stitching around the swoosh", detail: "Authentic Nike shoes have tight, even stitching with about 10–12 stitches per inch. Fakes use longer stitch lengths to save thread, creating visible gaps." },
      { title: "Air sole unit", detail: "Nike Air units should be clearly visible through the midsole window. Fakes often have smaller, misaligned air units or none at all." },
      { title: "Tongue label font", detail: "The font on the tongue tag should be clean, crisp, and consistent. Look for bleeding ink or slightly different font weights — common in fakes." },
      { title: "Sole color", detail: "Air Force 1 soles should be a creamy off-white, not pure white. Most fakes use a bright white rubber which is immediately obvious." },
      { title: "Box label", detail: "Style code format: XXXXXX-XXX (e.g. CU8591-001). The font should be consistent throughout the label with no fuzzy edges." },
    ],
  },
  jordan: {
    name: "Air Jordan",
    intro: "Air Jordans — especially Jordan 1s — are among the most faked shoes ever made. Even 7A quality replicas struggle with these specific checkpoints.",
    checks: [
      { title: "Toe cap perforations (Jordan 1)", detail: "Authentic Jordan 1s have exactly 3 rows of 12 perforations on the toe cap. Count them. Fakes often have irregular spacing, wrong number, or slightly oval holes instead of round." },
      { title: "Jumpman logo proportions", detail: "The Jumpman silhouette has very specific proportions. On fakes the head, arms and legs are often slightly off — too large, too small, or at wrong angles." },
      { title: "Wings logo stitching", detail: "The wings logo on Jordan 1 Mid/High should have even, tight lockstitch. Fakes often use chain stitch that looks loose up close." },
      { title: "NIKE AIR on insole", detail: "The NIKE AIR text on the insole should be embossed (pressed into the foam), not just printed on. Bold, clean font. Fakes usually print it on instead." },
      { title: "Heel counter stiffness", detail: "Authentic Jordans have a firm heel counter that holds its shape. Fakes use softer plastic that collapses easily when you squeeze the heel." },
      { title: "Patent leather (Jordan 11)", detail: "Jordan 11 patent leather should have a deep, mirror-like gloss. Fakes use thinner plastic sheeting that looks shinier but feels hollow." },
    ],
  },
  adidas: {
    name: "Adidas",
    intro: "Adidas fakes have gotten better, but these checkpoints consistently reveal replicas.",
    checks: [
      { title: "3 stripe width & spacing", detail: "The three Adidas stripes should be consistent width with equal spacing between them. On fakes the stripes are often too wide, too narrow, or unevenly spaced." },
      { title: "Trefoil logo symmetry", detail: "The Adidas Trefoil (3-leaf logo) must be perfectly symmetrical. All three leaves should be identical size and shape. Fakes are almost always slightly asymmetric." },
      { title: "Primeknit weave (Ultra Boost)", detail: "The Primeknit upper on Ultra Boost has a tight, precise weave pattern. Fakes use a looser knit that looks blurry or undefined up close." },
      { title: "BOOST foam texture", detail: "Authentic Boost sole looks like hundreds of tiny irregular bumps. Fakes often use a smoother foam or regular round bumps in a grid pattern." },
      { title: "Samba gum sole", detail: "The gum sole on a Samba OG should be translucent with a warm amber tone. Fakes use opaque yellow or brown rubber that doesn't transmit light." },
      { title: "Continental sole tread", detail: "On Stan Smith and other models, the Continental tire tread pattern should be razor-sharp. Fakes have a blurred, slightly melted-looking tread." },
    ],
  },
  yeezy: {
    name: "Yeezy",
    intro: "Yeezy 350 V2 is one of the hardest shoes to fake correctly due to the Primeknit pattern. Here's what to look for.",
    checks: [
      { title: "Primeknit diagonal lines (350 V2)", detail: "The Primeknit on Yeezy 350 V2 has a specific diagonal stripe pattern. These lines must be perfectly parallel and consistently angled. Fakes almost always have slightly irregular diagonal lines." },
      { title: "BOOST sole texture", detail: "The BOOST pellets on a Yeezy should be irregular in size and loosely arranged. Fakes use uniform round pellets in a grid — a major tell." },
      { title: "Inner label lockstitch", detail: "The tongue/inner label should be sewn with a tight lockstitch that won't unravel. Fakes use chain stitch — pull a thread and it comes apart easily." },
      { title: "Heel tab alignment", detail: "The rear pull tab should sit perfectly flush against the heel counter. Fakes often have a tab that sticks out slightly or is angled." },
      { title: "Monofilament stripe", detail: "The translucent stripe running around the shoe on 350 V2 should be perfectly straight and consistent width. Fakes have wavy or inconsistent monofilament." },
      { title: "ADIDAS YEEZY insole text", detail: "Authentic Yeezy 350 insoles have the ADIDAS YEEZY text embossed (raised or pressed). Fakes print it on flat, which you can feel with your finger." },
    ],
  },
  "new-balance": {
    name: "New Balance",
    intro: "New Balance fakes are increasing. Key checkpoints for 550, 990 series and other popular models.",
    checks: [
      { title: "'N' logo font weight", detail: "The New Balance 'N' logo has a specific font weight and angle. Fakes often use a slightly different weight — too bold or too thin. Check both the 'N' on each side." },
      { title: "550 sole curvature", detail: "The 550 sole has a specific arch and rocker profile when viewed from the side. Fakes often flatten this curve, making the sole look more uniform." },
      { title: "ENCAP midsole ring (990 series)", detail: "The 990 series ENCAP system shows as a distinct white ring visible from the side, between the outer rubber and inner foam. Fakes blur this line or make it inconsistent." },
      { title: "Suede quality", detail: "The suede on NB 550 should be fine-grain and even. Run your finger against the grain — it should feel smooth and consistent. Fakes use rougher, cheaper suede." },
      { title: "Made in USA stitching", detail: "USA-made NB models have a specific internal stitch pattern and different lining material. Fakes are always made in China and lack the USA finishing details." },
    ],
  },
  puma: {
    name: "Puma",
    intro: "Key authentication checkpoints for Puma sneakers.",
    checks: [
      { title: "Formstrip width & angle", detail: "The Puma formstrip (side stripe) should be a consistent width following a specific angle. Fakes often make it too wide, too narrow, or at the wrong angle." },
      { title: "Puma cat logo", detail: "The leaping cat logo has very specific proportions. Fakes often make the cat too large, too small, or change the angle of the leap." },
      { title: "Suede texture (Suede Classic)", detail: "The Puma Suede Classic upper should have fine, even suede. Fakes use a coarser material that looks rougher and less consistent." },
      { title: "Outsole flexibility", detail: "Authentic Puma Suede soles use a slightly flexible rubber. Fakes often use a harder, more plastic-like sole that feels stiffer and sounds different when tapped." },
    ],
  },
  reebok: {
    name: "Reebok",
    intro: "Authentication guide for Reebok Classic Leather, Club C, and other popular silhouettes.",
    checks: [
      { title: "Vector logo (Union Jack)", detail: "The Reebok vector logo consists of the Union Jack design. The lines must be perfectly parallel and evenly spaced. Any waviness or uneven spacing is a fake tell." },
      { title: "Classic Leather tongue label", detail: "The tongue label font on Classic Leather should be clean with sharp edges. Check the font weight — fakes often use a slightly different weight that looks 'off'." },
      { title: "Hexalite cushioning", detail: "Hexalite cushioning shows as hexagonal shapes in the midsole. Authentic Reebok Hexalite has a precise honeycomb pattern. Fakes have irregular or blurry hexagons." },
      { title: "DMX air channels", detail: "The DMX foam channel pattern on the outsole should be clean and symmetrical. Fakes have irregular channel depths or a simplified pattern." },
    ],
  },
  asics: {
    name: "Asics",
    intro: "Asics authentication guide for Gel-Kayano 14, GT-2160, and other popular models.",
    checks: [
      { title: "Onitsuka Tiger / ASICS stripes", detail: "The stripes on Asics uppers should be consistent width at a specific angle. Fakes often get the angle slightly wrong or make the stripes too wide." },
      { title: "GEL cushioning unit", detail: "The GEL unit should be translucent silicone gel, not solid rubber. Hold the shoe up to light — you should see through the GEL area. Fakes use opaque rubber." },
      { title: "Reflective panels texture", detail: "Reflective panels on Gel-Lyte series have a fine honeycomb texture. Fakes use flat reflective material without the texture." },
      { title: "Tongue gusset", detail: "The gusset (fabric connecting tongue to upper) should be securely stitched on both sides. Fakes often omit the gusset or have it poorly attached on one side." },
    ],
  },
};

interface Props {
  params: { brand: string };
}

export default function BrandGuidePage({ params }: Props) {
  const guide = BRAND_GUIDES[params.brand];

  if (!guide) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-[#555] mb-4">Guide not found.</p>
        <Link href="/guides" className="text-white font-semibold text-sm hover:text-[#888] transition-colors">
          ← All guides
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/guides" className="text-xs text-[#444] hover:text-[#888] mb-8 inline-block uppercase tracking-widest transition-colors">
        ← All guides
      </Link>

      <div className="mb-10">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Authentication Guide</p>
        <h1 className="text-3xl font-extrabold text-white mb-3 font-syne">
          How to spot fake {guide.name} sneakers
        </h1>
        <p className="text-[#555] text-sm leading-relaxed">{guide.intro}</p>
      </div>

      <div className="space-y-3">
        {guide.checks.map((check, i) => (
          <div key={i} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-5">
            <h2 className="font-extrabold text-white mb-2 font-syne text-sm">
              <span className="text-[#333] mr-3 font-mono">{String(i + 1).padStart(2, "0")}</span>
              {check.title}
            </h2>
            <p className="text-sm text-[#666] leading-relaxed">{check.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-[#111] border border-[#1f1f1f] rounded-2xl text-center">
        <h3 className="font-extrabold text-white mb-2 font-syne">Want AI to check these for you?</h3>
        <p className="text-[#555] text-sm mb-5">Upload your shoe photos and our AI checks all these points automatically.</p>
        <Link
          href={`/check?brand=${params.brand}`}
          className="inline-block bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#e5e5e5] transition-colors font-syne"
        >
          Check a {guide.name} pair →
        </Link>
      </div>
    </div>
  );
}
