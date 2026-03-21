"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyzing shape and silhouette...",
  "Checking color accuracy...",
  "Inspecting logo placement...",
  "Examining stitching quality...",
  "Checking sole tread pattern...",
  "Reading tongue label...",
  "Verifying heel tab...",
  "Checking serial number format...",
  "Analyzing material texture...",
  "Inspecting hardware details...",
  "Running final checks...",
];

export default function AnalysisLoader() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const mt = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(mt);
  }, []);

  const progress = ((msgIdx + 1) / MESSAGES.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-4 py-32 text-center">
      {/* Spinner */}
      <div className="relative w-20 h-20 mx-auto mb-10">
        <div className="absolute inset-0 border border-[#1f1f1f] rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-[#22c55e] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">👟</div>
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
        Analyzing your sneakers
      </h2>
      <p className="text-[#555] text-sm mb-10">
        AI is checking 50+ authentication points — about 20–30 seconds.
      </p>

      {/* Message */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-xl px-6 py-4 mb-8">
        <p className="text-sm text-[#888] font-medium transition-all">
          {MESSAGES[msgIdx]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#1a1a1a] rounded-full h-0.5">
        <div
          className="bg-[#22c55e] h-0.5 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-[#333] mt-2 uppercase tracking-widest">{Math.round(progress)}% complete</p>
    </div>
  );
}
