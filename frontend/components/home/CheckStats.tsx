const STATS = [
  { value: "50+", label: "Checkpoints per shoe" },
  { value: "~30s", label: "Average analysis time" },
  { value: "8", label: "Brands supported" },
  { value: "Free", label: "First 3 checks" },
];

export default function CheckStats() {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-black text-green-400 mb-2">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
