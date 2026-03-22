const COUNTERS = [
  { value: "100+", label: "Checks completed" },
  { value: "98%", label: "Accuracy rate" },
  { value: "74", label: "Checkpoints per shoe" },
  { value: "<30s", label: "Results time" },
];

export default function TrustCounter() {
  return (
    <section className="bg-[#111]">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#222]">
          {COUNTERS.map((c) => (
            <div key={c.label} className="px-8 py-12 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2 font-syne">{c.value}</div>
              <div className="text-xs text-[#666] uppercase tracking-widest">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
