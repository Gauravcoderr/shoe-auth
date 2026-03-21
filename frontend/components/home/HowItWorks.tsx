const STEPS = [
  {
    num: "01",
    title: "Pick your brand & model",
    desc: "Select the sneaker brand and model you want to authenticate. We support Nike, Jordan, Adidas, Yeezy, New Balance, Puma, Reebok and Asics.",
    icon: "👟",
  },
  {
    num: "02",
    title: "Upload 5–8 photos",
    desc: "Follow our guided angle templates — side, sole, tongue, heel, toe. We'll show you exactly where to point your camera for each shot.",
    icon: "📸",
  },
  {
    num: "03",
    title: "Get your verdict",
    desc: "Our AI analyzes 50+ checkpoints — stitching density, color accuracy, logo placement, sole pattern and more — and returns a detailed pass/fail breakdown.",
    icon: "✅",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Process</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white" style={{ fontFamily: "var(--font-syne)" }}>
          How it works
        </h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-px bg-[#1a1a1a] rounded-2xl overflow-hidden">
        {STEPS.map((step, i) => (
          <div key={step.num} className="bg-[#0a0a0a] p-8 relative">
            <div className="text-3xl mb-5">{step.icon}</div>
            <div className="text-xs font-bold text-[#333] mb-3 tracking-widest uppercase">Step {step.num}</div>
            <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-syne)" }}>{step.title}</h3>
            <p className="text-sm text-[#666] leading-relaxed">{step.desc}</p>
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-[#1a1a1a]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
