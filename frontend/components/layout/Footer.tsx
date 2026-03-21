import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-20 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <div className="font-semibold text-gray-700">
          Sneaker<span className="text-green-500">Auth</span>
        </div>
        <div className="flex gap-6">
          <Link href="/guides" className="hover:text-gray-700">Guides</Link>
          <Link href="/check" className="hover:text-gray-700">Check a shoe</Link>
          <Link href="/account" className="hover:text-gray-700">My checks</Link>
        </div>
        <p>© {new Date().getFullYear()} SneakerAuth. AI-powered authentication.</p>
      </div>
    </footer>
  );
}
