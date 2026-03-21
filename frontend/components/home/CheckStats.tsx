const STATS = [
  { value: "50+", label: "Checkpoints per shoe" },
  { value: "~30s", label: "Average analysis time" },
  { value: "8", label: "Brands supported" },
  { value: "Free", label: "First 3 checks" },
];

export default function CheckStats() {
  return (
    <section className="border-t border-b border-[#1a1a1a] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1a1a1a]">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#0a0a0a] px-8 py-10 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#22c55e] mb-2 font-syne">{s.value}</div>
              <div className="text-xs text-[#555] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
