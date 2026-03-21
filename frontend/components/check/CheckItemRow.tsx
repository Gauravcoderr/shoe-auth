import { cn } from "@/lib/utils";
import { CheckResult } from "@/types";

const RESULT_CONFIG = {
  pass: { label: "Pass", color: "text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20", bar: "bg-[#22c55e]" },
  fail: { label: "Fail", color: "text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20", bar: "bg-[#ef4444]" },
  warning: { label: "Warning", color: "text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20", bar: "bg-[#f59e0b]" },
  skipped: { label: "Skipped", color: "text-[#555] bg-[#1a1a1a] border border-[#222]", bar: "bg-[#333]" },
};

interface Props {
  result: CheckResult;
}

export default function CheckItemRow({ result }: Props) {
  const cfg = RESULT_CONFIG[result.result] || RESULT_CONFIG.skipped;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1a1a1a] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[#ccc]">{result.label}</span>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", cfg.color)}>
            {cfg.label}
          </span>
        </div>
        {result.notes && (
          <p className="text-xs text-[#555] leading-relaxed">{result.notes}</p>
        )}
        {result.result !== "skipped" && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-[#1a1a1a] rounded-full h-1">
              <div
                className={cn("h-1 rounded-full transition-all", cfg.bar)}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            <span className="text-[10px] text-[#444]">{result.confidence}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
