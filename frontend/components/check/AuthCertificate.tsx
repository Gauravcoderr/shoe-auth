"use client";
import { useState } from "react";
import { AuthCheck } from "@/types";

interface Props {
  check: AuthCheck;
}

export default function AuthCertificate({ check }: Props) {
  const [copied, setCopied] = useState(false);

  const certId = `SA-${check.id.slice(0, 8).toUpperCase()}`;
  const passCount = check.results.filter(r => r.result === "pass").length;
  const totalChecked = check.results.filter(r => r.result !== "skipped").length;
  const formattedDate = new Date(check.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  };

  return (
    <div className="mt-6">
      <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">Certificate of Authentication</p>
      <div className="bg-white border-2 border-[#e8e8e3] rounded-2xl overflow-hidden">
        <div className="h-1 bg-[#111] w-full" />
        <div className="px-6 pt-6 pb-7">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border-2 border-[#bbf7d0] flex items-center justify-center">
              <span className="text-[#16a34a] text-xl font-black font-syne">✓</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#bbb] uppercase tracking-widest font-syne">Check ID</p>
              <p className="text-sm font-bold text-[#111] font-syne tracking-wider">{certId}</p>
            </div>
          </div>

          <p className="text-[10px] text-[#16a34a] uppercase tracking-widest font-bold font-syne mb-1">Authenticated</p>
          <h2 className="text-xl font-extrabold text-[#111] font-syne mb-1">
            {check.brand.charAt(0).toUpperCase() + check.brand.slice(1)} — {check.model}
          </h2>
          {check.colorway && <p className="text-sm text-[#aaa] mb-4">{check.colorway}</p>}

          <div className="border-t border-[#f0f0ec] my-5" />

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="text-2xl font-extrabold text-[#111] font-syne">{check.verdict_confidence}%</p>
              <p className="text-[10px] text-[#aaa] uppercase tracking-wider mt-0.5">AI Confidence</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#111] font-syne">{passCount}/{totalChecked}</p>
              <p className="text-[10px] text-[#aaa] uppercase tracking-wider mt-0.5">Checks Passed</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#111] font-syne leading-tight">{formattedDate}</p>
              <p className="text-[10px] text-[#aaa] uppercase tracking-wider mt-0.5">Date Verified</p>
            </div>
          </div>

          <div className="border-t border-[#f0f0ec] my-5" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-sm text-[#111] font-syne">
                Sneaker<span className="text-[#16a34a]">Auth</span>
              </p>
              <p className="text-[10px] text-[#bbb]">AI-powered authentication</p>
            </div>
            <button type="button" onClick={handleCopy} className="btn-outline text-xs py-2 px-4">
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
