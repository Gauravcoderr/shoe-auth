import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] mt-24 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#555]">
        <div className="font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
          Sneaker<span className="text-[#22c55e]">Auth</span>
        </div>
        <div className="flex gap-6">
          <Link href="/guides" className="hover:text-[#888] transition-colors">Guides</Link>
          <Link href="/check" className="hover:text-[#888] transition-colors">Check a shoe</Link>
          <Link href="/account" className="hover:text-[#888] transition-colors">My checks</Link>
        </div>
        <p>© {new Date().getFullYear()} SneakerAuth. AI-powered authentication.</p>
      </div>
    </footer>
  );
}
