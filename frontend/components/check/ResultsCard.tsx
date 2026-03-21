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
    <div className="max-w-2xl mx-auto px-5 py-14">
      <div className="mb-6">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-2 font-syne">Authentication Result</p>
        <h1 className="text-3xl font-extrabold text-[#111] font-syne">
          {check.brand.charAt(0).toUpperCase() + check.brand.slice(1)} — {check.model}
          {check.colorway && <span className="text-[#aaa] font-normal"> ({check.colorway})</span>}
        </h1>
      </div>

      <VerdictBadge
        verdict={check.overall_verdict as "authentic" | "fake" | "inconclusive" | "pending"}
        confidence={check.verdict_confidence}
      />

      {check.verdict_summary && (
        <div className="mt-4 p-4 bg-white border border-[#e8e8e3] rounded-xl shadow-sm">
          <p className="text-sm text-[#666] leading-relaxed">{check.verdict_summary}</p>
        </div>
      )}

      <div className="flex gap-3 mt-6 mb-8">
        <div className="flex-1 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-[#16a34a] font-syne">{passCount}</div>
          <div className="text-[10px] text-[#16a34a]/70 uppercase tracking-wider mt-0.5">Passed</div>
        </div>
        <div className="flex-1 bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-[#d97706] font-syne">{warnCount}</div>
          <div className="text-[10px] text-[#d97706]/70 uppercase tracking-wider mt-0.5">Warnings</div>
        </div>
        <div className="flex-1 bg-[#fef2f2] border border-[#fecaca] rounded-xl p-4 text-center">
          <div className="text-2xl font-extrabold text-[#dc2626] font-syne">{failCount}</div>
          <div className="text-[10px] text-[#dc2626]/70 uppercase tracking-wider mt-0.5">Failed</div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groups).map(([category, results]) => {
          const catFails = results.filter(r => r.result === "fail").length;
          return (
            <div key={category} className="bg-white border border-[#e8e8e3] rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0ec]">
                <h3 className="font-bold text-sm text-[#111] font-syne">{category}</h3>
                {catFails > 0 && (
                  <span className="text-[10px] font-bold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] px-2 py-0.5 rounded-full uppercase tracking-wide font-syne">
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

      {check.photos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-bold text-[#bbb] uppercase tracking-widest mb-3 font-syne">Submitted photos</h3>
          <div className="grid grid-cols-4 gap-2">
            {check.photos.map(p => (
              <div key={p.angle} className="aspect-square rounded-xl overflow-hidden bg-[#f0f0ec] border border-[#e8e8e3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.angle} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <Link href="/check" className="flex-1 text-center btn-outline py-3 text-sm">
          Check another pair
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 btn-primary text-center py-3 text-sm"
        >
          Save / Print report
        </button>
      </div>
    </div>
  );
}
