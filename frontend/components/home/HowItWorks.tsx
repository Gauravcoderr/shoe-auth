const STEPS = [
  { num: "01", title: "Pick your brand & model", desc: "Select from Nike, Jordan, Adidas, Yeezy, New Balance, Puma, Reebok and Asics. We support model-level authentication.", icon: "↗" },
  { num: "02", title: "Upload 5–8 photos", desc: "Follow guided angle templates — side, sole, tongue, heel, toe. We show you exactly where to point your camera.", icon: "⤴" },
  { num: "03", title: "Get your verdict", desc: "AI checks 50+ points — stitching, color accuracy, logo placement, sole pattern — and returns a detailed pass/fail breakdown.", icon: "✓" },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <div className="text-center mb-14">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">How it works</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111] font-syne">Three steps to a verdict</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {STEPS.map((step) => (
          <div key={step.num} className="bg-white border border-[#e8e8e3] rounded-2xl p-7 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold text-[#ccc] tracking-widest font-syne">STEP {step.num}</span>
              <span className="text-xl text-[#ccc]">{step.icon}</span>
            </div>
            <h3 className="text-base font-extrabold text-[#111] mb-2 font-syne">{step.title}</h3>
            <p className="text-sm text-[#888] leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
