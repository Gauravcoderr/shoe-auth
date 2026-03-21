"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Angle {
  id: string;
  label: string;
  required: boolean;
  tip: string;
}

interface Props {
  angle: Angle;
  url?: string;
  uploading: boolean;
  onFile: (file: File) => void;
}

export default function AngleSlot({ angle, url, uploading, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) onFile(file);
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer",
        url
          ? "border-[#22c55e]/50 bg-[#22c55e]/5"
          : "border-[#222] bg-[#111] hover:border-[#333] hover:bg-[#161616]",
        uploading && "opacity-50 pointer-events-none"
      )}
      style={{ aspectRatio: "1 / 1" }}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file" accept="image/*" className="hidden" aria-label={`Upload ${angle.label} photo`}
        onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      {uploading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" />
        </div>
      ) : url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={angle.label} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 w-5 h-5 bg-[#22c55e] rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1 text-center font-medium">
            {angle.label}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <div className="text-xl mb-2 opacity-40">📷</div>
          <div className="text-[11px] font-bold text-white mb-0.5">{angle.label}</div>
          {angle.required && (
            <div className="text-[9px] text-[#ef4444] font-semibold mb-1 uppercase tracking-wider">Required</div>
          )}
          <div className="text-[9px] text-[#444] leading-tight">{angle.tip}</div>
        </div>
      )}
    </div>
  );
}
