import { cn } from "@/lib/utils";
import { CheckResult } from "@/types";

const RESULT_CONFIG = {
  pass: { label: "Pass", color: "text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0]", bar: "bg-[#16a34a]" },
  fail: { label: "Fail", color: "text-[#dc2626] bg-[#fef2f2] border border-[#fecaca]", bar: "bg-[#dc2626]" },
  warning: { label: "Warning", color: "text-[#d97706] bg-[#fffbeb] border border-[#fde68a]", bar: "bg-[#d97706]" },
  skipped: { label: "Skipped", color: "text-[#aaa] bg-[#f0f0ec] border border-[#e8e8e3]", bar: "bg-[#ddd]" },
};

interface Props {
  result: CheckResult;
}

export default function CheckItemRow({ result }: Props) {
  const cfg = RESULT_CONFIG[result.result] || RESULT_CONFIG.skipped;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#f0f0ec] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[#333]">{result.label}</span>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide font-syne", cfg.color)}>
            {cfg.label}
          </span>
        </div>
        {result.notes && (
          <p className="text-xs text-[#888] leading-relaxed">{result.notes}</p>
        )}
        {result.result !== "skipped" && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-[#f0f0ec] rounded-full h-1">
              <div
                className={cn("h-1 rounded-full transition-all", cfg.bar)}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            <span className="text-[10px] text-[#bbb]">{result.confidence}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
