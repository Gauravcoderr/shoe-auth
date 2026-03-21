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
    <div className="max-w-lg mx-auto px-5 py-32 text-center">
      <div className="relative w-20 h-20 mx-auto mb-10">
        <div className="absolute inset-0 border border-[#e8e8e3] rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-[#16a34a] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">👟</div>
      </div>

      <h2 className="text-2xl font-extrabold text-[#111] mb-2 font-syne">Analyzing your sneakers</h2>
      <p className="text-[#aaa] text-sm mb-10">AI is checking 50+ authentication points — about 20–30 seconds.</p>

      <div className="bg-white border border-[#e8e8e3] rounded-xl px-6 py-4 mb-8 shadow-sm">
        <p className="text-sm text-[#888] font-medium">{MESSAGES[msgIdx]}</p>
      </div>

      <div className="w-full bg-[#f0f0ec] rounded-full h-1">
        <div
          className="bg-[#16a34a] h-1 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-[#ccc] mt-2 uppercase tracking-widest">{Math.round(progress)}% complete</p>
    </div>
  );
}
