import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e8e8e3] mt-24 py-10 bg-[#f7f7f4]">
      <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#aaa]">
        <div className="font-syne font-bold text-[#111]">
          Sneaker<span className="text-[#16a34a]">Auth</span>
        </div>
        <div className="flex gap-6">
          <Link href="/guides" className="hover:text-[#666] transition-colors">Guides</Link>
          <Link href="/check" className="hover:text-[#666] transition-colors">Check a shoe</Link>
          <Link href="/account" className="hover:text-[#666] transition-colors">My checks</Link>
        </div>
        <p>© {new Date().getFullYear()} SneakerAuth</p>
      </div>
    </footer>
  );
}
