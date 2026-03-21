const STEPS = [
  { num: "01", title: "Submit", desc: "Pick your brand and model, then upload photos from our guided angle templates.", detail: "5 required angles", icon: "→" },
  { num: "02", title: "AI Scan", desc: "50+ checkpoints analyzed automatically — stitching, logos, soles, colorways.", detail: "50+ checkpoints", icon: "◎" },
  { num: "03", title: "Verdict", desc: "Receive AUTHENTIC, FAKE, or INCONCLUSIVE with a confidence percentage.", detail: "~30 seconds", icon: "✓" },
  { num: "04", title: "Report", desc: "Full category-by-category breakdown. Certificate of Authentication for genuine pairs.", detail: "Certificate issued", icon: "↓" },
];

export default function OurProcess() {
  return (
    <section className="bg-white border-t border-[#e8e8e3]">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-14">
          <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">Our Process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111] font-syne">How we authenticate</h2>
          <p className="text-[#aaa] text-sm mt-3 max-w-md mx-auto">
            A systematic inspection at every angle, not a single-pass scan.
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-8 sm:gap-0 relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[#e8e8e3] z-0" />

          {STEPS.map((step) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-12 h-12 rounded-full bg-[#f7f7f4] border-2 border-[#e8e8e3] flex items-center justify-center mb-4">
                <span className="text-base text-[#111] font-bold font-syne">{step.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-[#ccc] tracking-widest font-syne mb-1">STEP {step.num}</span>
              <h3 className="text-base font-extrabold text-[#111] font-syne mb-2">{step.title}</h3>
              <p className="text-sm text-[#888] leading-relaxed mb-3">{step.desc}</p>
              <span className="text-[10px] font-bold text-[#aaa] bg-[#f0f0ec] border border-[#e8e8e3] px-3 py-1 rounded-full font-syne uppercase tracking-wider">
                {step.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
