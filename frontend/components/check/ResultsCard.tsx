"use client";
import { AuthCheck } from "@/types";
import VerdictBadge from "./VerdictBadge";
import CheckItemRow from "./CheckItemRow";
import Link from "next/link";

interface Props {
  check: AuthCheck;
}

function groupByCategory(results: AuthCheck["results"]) {
  const groups: Record<string, AuthCheck["results"]> = {};
  for (const r of results) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  }
  return groups;
}

export default function ResultsCard({ check }: Props) {
  const groups = groupByCategory(check.results);
  const failCount = check.results.filter(r => r.result === "fail").length;
  const passCount = check.results.filter(r => r.result === "pass").length;
  const warnCount = check.results.filter(r => r.result === "warning").length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Authentication Result</p>
        <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-syne)" }}>
          {check.brand.charAt(0).toUpperCase() + check.brand.slice(1)} — {check.model}
          {check.colorway && <span className="text-[#555]"> ({check.colorway})</span>}
        </h1>
      </div>

      {/* Verdict */}
      <VerdictBadge
        verdict={check.overall_verdict as "authentic" | "fake" | "inconclusive" | "pending"}
        confidence={check.verdict_confidence}
      />

      {/* Summary */}
      {check.verdict_summary && (
        <div className="mt-4 p-4 bg-[#111] border border-[#1f1f1f] rounded-xl">
          <p className="text-sm text-[#888] leading-relaxed">{check.verdict_summary}</p>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex gap-3 mt-6 mb-8">
        <div className="flex-1 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-[#22c55e]" style={{ fontFamily: "var(--font-syne)" }}>{passCount}</div>
          <div className="text-[10px] text-[#22c55e]/70 uppercase tracking-wider mt-0.5">Passed</div>
        </div>
        <div className="flex-1 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-[#f59e0b]" style={{ fontFamily: "var(--font-syne)" }}>{warnCount}</div>
          <div className="text-[10px] text-[#f59e0b]/70 uppercase tracking-wider mt-0.5">Warnings</div>
        </div>
        <div className="flex-1 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-[#ef4444]" style={{ fontFamily: "var(--font-syne)" }}>{failCount}</div>
          <div className="text-[10px] text-[#ef4444]/70 uppercase tracking-wider mt-0.5">Failed</div>
        </div>
      </div>

      {/* Results by category */}
      <div className="space-y-4">
        {Object.entries(groups).map(([category, results]) => {
          const catFails = results.filter(r => r.result === "fail").length;
          return (
            <div key={category} className="bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
                <h3 className="font-bold text-sm text-white" style={{ fontFamily: "var(--font-syne)" }}>{category}</h3>
                {catFails > 0 && (
                  <span className="text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {catFails} issue{catFails > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="px-4">
                {results.map(r => <CheckItemRow key={r.check_id} result={r} />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photos */}
      {check.photos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-bold text-[#555] uppercase tracking-widest mb-3">Submitted photos</h3>
          <div className="grid grid-cols-4 gap-2">
            {check.photos.map(p => (
              <div key={p.angle} className="aspect-square rounded-xl overflow-hidden bg-[#111] border border-[#1f1f1f]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.angle} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/check"
          className="flex-1 text-center border border-[#222] text-[#888] py-3 rounded-xl text-sm font-semibold hover:border-[#333] hover:text-white transition-all"
        >
          Check another pair
        </Link>
        <button
          type="button" onClick={() => window.print()}
          className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-bold hover:bg-[#e5e5e5] transition-colors"
        >
          Save / Print report
        </button>
      </div>
    </div>
  );
}
