import { cn } from "@/lib/utils";

interface Props {
  verdict: "authentic" | "fake" | "inconclusive" | "pending";
  confidence: number;
}

const CONFIG = {
  authentic: { label: "AUTHENTIC", emoji: "✓", className: "verdict-authentic glow-green" },
  fake: { label: "FAKE", emoji: "✗", className: "verdict-fake glow-red" },
  inconclusive: { label: "INCONCLUSIVE", emoji: "~", className: "verdict-inconclusive glow-amber" },
  pending: { label: "ANALYZING", emoji: "…", className: "verdict-pending" },
};

export default function VerdictBadge({ verdict, confidence }: Props) {
  const c = CONFIG[verdict] || CONFIG.inconclusive;
  return (
    <div className={cn("rounded-2xl p-8 text-center", c.className)}>
      <div className="text-5xl font-black mb-3" style={{ fontFamily: "var(--font-syne)" }}>{c.emoji}</div>
      <div className="text-4xl font-extrabold tracking-widest mb-3" style={{ fontFamily: "var(--font-syne)" }}>{c.label}</div>
      {verdict !== "pending" && (
        <div className="text-sm opacity-70">
          AI Confidence: <span className="font-bold opacity-100">{confidence}%</span>
        </div>
      )}
    </div>
  );
}
