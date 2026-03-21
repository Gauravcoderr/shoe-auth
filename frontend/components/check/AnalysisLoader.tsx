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
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const mt = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2200);
    const dt = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => { clearInterval(mt); clearInterval(dt); };
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="relative w-20 h-20 mx-auto mb-8">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-gray-900 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">👟</div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3">Analyzing your sneakers</h2>
      <p className="text-gray-500 text-sm mb-8">
        Our AI is checking 50+ authentication points. This takes about 20–30 seconds.
      </p>

      <div className="bg-gray-50 rounded-2xl px-6 py-4 inline-block min-w-64">
        <p className="text-sm text-gray-700 font-medium transition-all">
          {MESSAGES[msgIdx]}{dots}
        </p>
      </div>

      <div className="flex justify-center gap-1.5 mt-8">
        {MESSAGES.slice(0, 8).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === msgIdx % 8 ? "bg-gray-900" : "bg-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
