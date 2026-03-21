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
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
        How it works
      </h2>
      <div className="grid sm:grid-cols-3 gap-8">
        {STEPS.map((step) => (
          <div key={step.num} className="relative">
            <div className="text-4xl mb-4">{step.icon}</div>
            <div className="text-xs font-bold text-gray-300 mb-2 tracking-widest">STEP {step.num}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
