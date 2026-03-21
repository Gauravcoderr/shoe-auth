import { cn } from "@/lib/utils";

interface Props {
  verdict: "authentic" | "fake" | "inconclusive" | "pending";
  confidence: number;
}

const CONFIG = {
  authentic: { label: "AUTHENTIC", emoji: "✅", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500" },
  fake: { label: "FAKE", emoji: "❌", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500" },
  inconclusive: { label: "INCONCLUSIVE", emoji: "⚠️", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  pending: { label: "ANALYZING", emoji: "⏳", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-500", dot: "bg-gray-400" },
};

export default function VerdictBadge({ verdict, confidence }: Props) {
  const c = CONFIG[verdict] || CONFIG.inconclusive;
  return (
    <div className={cn("border-2 rounded-2xl p-6 text-center", c.bg, c.border)}>
      <div className="text-4xl mb-3">{c.emoji}</div>
      <div className={cn("text-3xl font-black tracking-widest mb-2", c.text)}>{c.label}</div>
      {verdict !== "pending" && (
        <div className="text-sm text-gray-500">
          AI Confidence: <span className="font-bold text-gray-700">{confidence}%</span>
        </div>
      )}
    </div>
  );
}
