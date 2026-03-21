"use client";
import { AuthCheck } from "@/types";
import VerdictBadge from "./VerdictBadge";
import CheckItemRow from "./CheckItemRow";
import Link from "next/link";

interface Props {
  check: AuthCheck;
}

// Group results by category
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
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Authentication Result</div>
        <h1 className="text-xl font-bold text-gray-900">
          {check.brand.charAt(0).toUpperCase() + check.brand.slice(1)} — {check.model}
          {check.colorway && <span className="text-gray-500"> ({check.colorway})</span>}
        </h1>
      </div>

      {/* Verdict */}
      <VerdictBadge
        verdict={check.overall_verdict as "authentic" | "fake" | "inconclusive" | "pending"}
        confidence={check.verdict_confidence}
      />

      {/* Summary */}
      {check.verdict_summary && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 leading-relaxed">{check.verdict_summary}</p>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex gap-4 mt-6 mb-8">
        <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{passCount}</div>
          <div className="text-xs text-green-700">Passed</div>
        </div>
        <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">{warnCount}</div>
          <div className="text-xs text-amber-700">Warnings</div>
        </div>
        <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{failCount}</div>
          <div className="text-xs text-red-700">Failed</div>
        </div>
      </div>

      {/* Check results by category */}
      <div className="space-y-6">
        {Object.entries(groups).map(([category, results]) => {
          const catFails = results.filter(r => r.result === "fail").length;
          return (
            <div key={category} className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-800">{category}</h3>
                {catFails > 0 && (
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
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

      {/* Uploaded photos */}
      {check.photos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Submitted photos</h3>
          <div className="grid grid-cols-4 gap-2">
            {check.photos.map(p => (
              <div key={p.angle} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
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
          className="flex-1 text-center border border-gray-200 text-gray-700 py-3 rounded-2xl text-sm font-medium hover:bg-gray-50"
        >
          Check another pair
        </Link>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Save / Print report
        </button>
      </div>
    </div>
  );
}
