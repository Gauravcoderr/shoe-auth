"use client";
import { useRef, useState, useCallback, useEffect } from "react";
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

function CameraModal({
  angle,
  onCapture,
  onClose,
}: {
  angle: Angle;
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setReady(true);
          };
        }
      } catch {
        if (!cancelled) setError("Camera access denied. Please allow camera permission and try again.");
      }
    }

    startCamera();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `${angle.id}.jpg`, { type: "image/jpeg" });
      onCapture(file);
    }, "image/jpeg", 0.92);
  }, [angle.id, onCapture]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm">
        <div>
          <p className="text-white font-bold text-sm font-syne">{angle.label}</p>
          <p className="text-[#888] text-[11px] mt-0.5">{angle.tip}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#666] hover:text-white transition-colors text-2xl leading-none p-1"
        >
          ×
        </button>
      </div>

      {/* Camera feed */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="text-4xl mb-4">📵</div>
            <p className="text-white font-semibold mb-2">Camera unavailable</p>
            <p className="text-[#666] text-sm">{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {ready && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="border-2 border-white/30 rounded-xl w-[70%] aspect-[4/3]" />
              </div>
            )}
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Capture button */}
      <div className="flex items-center justify-center py-8 bg-black/80 backdrop-blur-sm">
        <button
          type="button"
          onClick={capture}
          disabled={!ready || !!error}
          aria-label="Take photo"
          className="w-16 h-16 rounded-full bg-white disabled:opacity-30 flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-white border-2 border-[#111]" />
        </button>
      </div>
    </div>
  );
}

export default function AngleSlot({ angle, url, uploading, onFile }: Props) {
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (file: File) => {
    setShowCamera(false);
    onFile(file);
  };

  return (
    <>
      <div
        className={cn(
          "relative aspect-square border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer",
          url
            ? "border-[#16a34a]/40 bg-[#f0fdf4]"
            : "border-[#e8e8e3] bg-white hover:border-[#bbb] hover:bg-[#fafaf8]",
          uploading && "opacity-50 pointer-events-none"
        )}
        onClick={() => !uploading && setShowCamera(true)}
      >
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#e8e8e3] border-t-[#111] rounded-full animate-spin" />
          </div>
        ) : url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={angle.label} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 w-5 h-5 bg-[#16a34a] rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Retake</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 text-center font-medium">
              {angle.label}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
            <div className="text-xl mb-2 opacity-40">📷</div>
            <div className="text-[11px] font-bold text-[#111] mb-0.5 font-syne">{angle.label}</div>
            {angle.required && (
              <div className="text-[9px] text-[#dc2626] font-semibold mb-1 uppercase tracking-wider">Required</div>
            )}
            <div className="text-[9px] text-[#bbb] leading-tight">{angle.tip}</div>
          </div>
        )}
      </div>

      {showCamera && (
        <CameraModal
          angle={angle}
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
