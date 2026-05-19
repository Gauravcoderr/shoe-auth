"use client";
import { useState } from "react";
import { AuthCheck } from "@/types";
import VerdictBadge from "./VerdictBadge";
import CheckItemRow from "./CheckItemRow";
import AuthCertificate from "./AuthCertificate";
import ConditionBadge from "./ConditionBadge";
import Link from "next/link";

interface Props {
  check: AuthCheck;
}

const BRAND_GUIDE_SLUGS: Record<string, string> = {
  nike: "nike", jordan: "jordan", adidas: "adidas", new_balance: "new-balance",
};

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

  // Categories with failures default open, others default closed
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const open = new Set<string>();
    for (const [cat, results] of Object.entries(groupByCategory(check.results))) {
      if (results.some(r => r.result === "fail" || r.result === "warning")) open.add(cat);
    }
    return open;
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
      return next;
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      {/* Image authenticity warning */}
      {typeof check.image_authenticity_score === "number" && check.image_authenticity_score < 70 && (
        <div className="mb-5 p-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl flex items-start gap-3">
          <span className="text-[#d97706] text-lg mt-0.5">⚠</span>
          <p className="text-sm text-[#92400e] leading-relaxed">
            <strong>Photo quality warning:</strong> Some submitted photos may not show a real physical shoe (possible stock image or screenshot). Results may be less accurate — please resubmit with fresh camera photos of the actual shoe.
          </p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-2 font-syne">Authentication Result</p>
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-3xl font-extrabold text-[#111] font-syne">
            {check.brand.charAt(0).toUpperCase() + check.brand.slice(1)} — {check.model}
            {check.colorway && <span className="text-[#aaa] font-normal"> ({check.colorway})</span>}
          </h1>
          {check.condition && (
            <div className="mt-1.5">
              <ConditionBadge condition={check.condition} />
            </div>
          )}
        </div>
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

      {/* Certificate — only for authentic */}
      {check.overall_verdict === "authentic" && (
        <AuthCertificate check={check} />
      )}

      {/* Stats */}
      <div className="flex gap-3 mt-6 mb-6">
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

      {/* Risk & Consistency scores */}
      {(typeof check.risk_score === "number" || typeof check.consistency_score === "number") && (
        <div className="flex gap-3 mb-6">
          {typeof check.risk_score === "number" && (
            <div className="flex-1 bg-white border border-[#e8e8e3] rounded-xl p-4 text-center shadow-sm">
              <div className={`text-2xl font-extrabold font-syne ${
                check.risk_score >= 60 ? "text-[#dc2626]" : check.risk_score >= 30 ? "text-[#d97706]" : "text-[#16a34a]"
              }`}>
                {check.risk_score}
              </div>
              <div className="text-[10px] text-[#bbb] uppercase tracking-wider mt-0.5">Risk Score</div>
            </div>
          )}
          {typeof check.consistency_score === "number" && (
            <div className="flex-1 bg-white border border-[#e8e8e3] rounded-xl p-4 text-center shadow-sm">
              <div className={`text-2xl font-extrabold font-syne ${
                check.consistency_score >= 80 ? "text-[#16a34a]" : check.consistency_score >= 50 ? "text-[#d97706]" : "text-[#dc2626]"
              }`}>
                {check.consistency_score}
              </div>
              <div className="text-[10px] text-[#bbb] uppercase tracking-wider mt-0.5">Consistency</div>
            </div>
          )}
        </div>
      )}

      {/* Expert tips callout */}
      {failCount > 0 && (
        <div className="mb-8 p-5 bg-[#fffbeb] border border-[#fde68a] rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fde68a] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#d97706] text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#111] mb-1 font-syne">
                Our AI found {failCount} issue{failCount !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-[#888] leading-relaxed mb-3">
                Here&apos;s what to look for when buying this shoe second-hand.
              </p>
              {BRAND_GUIDE_SLUGS[check.brand] && (
                <Link
                  href={`/guides/${BRAND_GUIDE_SLUGS[check.brand]}`}
                  className="text-xs font-bold text-[#d97706] hover:text-[#b45309] transition-colors uppercase tracking-wider font-syne"
                >
                  View {check.brand.replace("_", " ")} fake detection guide →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results by category */}
      <div className="space-y-2">
        {Object.entries(groups).map(([category, results]) => {
          const catFails = results.filter(r => r.result === "fail").length;
          const catWarns = results.filter(r => r.result === "warning").length;
          const catPass = results.filter(r => r.result === "pass").length;
          const isOpen = openCategories.has(category);
          return (
            <div key={category} className="bg-white border border-[#e8e8e3] rounded-xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#fafaf9] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                  <h3 className="font-bold text-sm text-[#111] font-syne">{category}</h3>
                  <span className="text-[10px] text-[#bbb]">({results.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {catFails > 0 && (
                    <span className="text-[10px] font-bold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] px-2 py-0.5 rounded-full uppercase tracking-wide font-syne">
                      {catFails} fail{catFails > 1 ? "s" : ""}
                    </span>
                  )}
                  {catWarns > 0 && (
                    <span className="text-[10px] font-bold text-[#d97706] bg-[#fffbeb] border border-[#fde68a] px-2 py-0.5 rounded-full uppercase tracking-wide font-syne">
                      {catWarns} warn
                    </span>
                  )}
                  {catFails === 0 && catWarns === 0 && (
                    <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full uppercase tracking-wide font-syne">
                      {catPass} ✓
                    </span>
                  )}
                </div>
              </button>
              {isOpen && (
                <div className="px-4 border-t border-[#f0f0ec]">
                  {results.map(r => <CheckItemRow key={r.check_id} result={r} />)}
                </div>
              )}
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
        <button type="button" onClick={() => window.print()} className="flex-1 btn-primary text-center py-3 text-sm">
          Save / Print report
        </button>
      </div>
    </div>
  );
}
