import { cn } from "@/lib/utils";
import { CheckResult } from "@/types";

const RESULT_CONFIG = {
  pass: { label: "Pass", color: "text-green-700 bg-green-100", bar: "bg-green-500" },
  fail: { label: "Fail", color: "text-red-700 bg-red-100", bar: "bg-red-500" },
  warning: { label: "Warning", color: "text-amber-700 bg-amber-100", bar: "bg-amber-400" },
  skipped: { label: "Skipped", color: "text-gray-500 bg-gray-100", bar: "bg-gray-300" },
};

interface Props {
  result: CheckResult;
}

export default function CheckItemRow({ result }: Props) {
  const cfg = RESULT_CONFIG[result.result] || RESULT_CONFIG.skipped;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{result.label}</span>
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", cfg.color)}>
            {cfg.label}
          </span>
        </div>
        {result.notes && (
          <p className="text-xs text-gray-500 leading-relaxed">{result.notes}</p>
        )}
        {/* Confidence bar */}
        {result.result !== "skipped" && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className={cn("h-1.5 rounded-full", cfg.bar)}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400">{result.confidence}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
