const STATS = [
  { value: "50+", label: "Checkpoints per shoe" },
  { value: "~30s", label: "Average analysis time" },
  { value: "8", label: "Brands supported" },
  { value: "Free", label: "First 3 checks" },
];

export default function CheckStats() {
  return (
    <section className="border-t border-[#e8e8e3] bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#e8e8e3]">
          {STATS.map((s) => (
            <div key={s.label} className="px-8 py-12 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#111] mb-2 font-syne">{s.value}</div>
              <div className="text-xs text-[#aaa] uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
