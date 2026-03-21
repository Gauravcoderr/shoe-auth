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
        "relative border-2 border-dashed rounded-2xl overflow-hidden transition-all cursor-pointer",
        url ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-gray-400",
        uploading && "opacity-60 pointer-events-none"
      )}
      style={{ aspectRatio: "1 / 1" }}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      {uploading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        </div>
      ) : url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={angle.label} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 text-center">
            {angle.label}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <div className="text-2xl mb-2">📷</div>
          <div className="text-xs font-semibold text-gray-700 mb-1">{angle.label}</div>
          {angle.required && (
            <div className="text-[10px] text-red-500 font-medium mb-1">Required</div>
          )}
          <div className="text-[10px] text-gray-400 leading-tight">{angle.tip}</div>
        </div>
      )}
    </div>
  );
}
