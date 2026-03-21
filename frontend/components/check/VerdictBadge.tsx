interface Props {
  verdict: "authentic" | "fake" | "inconclusive" | "pending";
  confidence: number;
}

const CONFIG = {
  authentic: { label: "AUTHENTIC", icon: "✓", className: "bg-[#f0fdf4] border-[#bbf7d0] text-[#16a34a]" },
  fake: { label: "FAKE", icon: "✗", className: "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]" },
  inconclusive: { label: "INCONCLUSIVE", icon: "~", className: "bg-[#fffbeb] border-[#fde68a] text-[#d97706]" },
  pending: { label: "ANALYZING", icon: "…", className: "bg-[#f0f0ec] border-[#e8e8e3] text-[#aaa]" },
};

export default function VerdictBadge({ verdict, confidence }: Props) {
  const c = CONFIG[verdict] || CONFIG.inconclusive;
  return (
    <div className={`rounded-2xl p-8 text-center border ${c.className}`}>
      <div className="text-5xl font-black mb-3 font-syne">{c.icon}</div>
      <div className="text-4xl font-extrabold tracking-widest mb-3 font-syne">{c.label}</div>
      {verdict !== "pending" && (
        <div className="text-sm opacity-70">
          AI Confidence: <span className="font-bold opacity-100">{confidence}%</span>
        </div>
      )}
    </div>
  );
}
