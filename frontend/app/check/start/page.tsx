"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { compressImage, uploadImage } from "@/lib/uploadImage";
import { incrementFreeCheck } from "@/lib/freeCheckTracker";
import AngleSlot from "@/components/check/AngleSlot";

const ANGLES = [
  { id: "side-lateral", label: "Lateral Side", required: true, tip: "Outer side of shoe at eye level. Full shoe in frame." },
  { id: "side-medial", label: "Medial Side", required: true, tip: "Inner (arch) side at eye level." },
  { id: "top-down", label: "Top Down", required: true, tip: "Directly above, laces visible, entire shoe in frame." },
  { id: "heel", label: "Heel / Back", required: true, tip: "Directly behind shoe, heel centered, both sides symmetric." },
  { id: "sole", label: "Sole (Bottom)", required: true, tip: "Flat on surface, camera directly above sole." },
  { id: "tongue", label: "Tongue Label", required: false, tip: "Close-up on tongue label text. Must be fully legible." },
  { id: "toe-front", label: "Toe Box (Front)", required: false, tip: "Straight-on front view, shoe flat, toe centered." },
  { id: "box-label", label: "Box Label", required: false, tip: "Shoe box label close-up. All text must be legible." },
];

export default function UploadPage() {
  const router = useRouter();
  const [pending, setPending] = useState<{ brand: string; model: string; colorway: string } | null>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  useEffect(() => {
    const data = sessionStorage.getItem("pending_check");
    if (!data) { router.push("/check"); return; }
    const parsed = JSON.parse(data);
    setPending(parsed);

    // Fetch reference images for this shoe in background
    const params = new URLSearchParams({
      brand: parsed.brand,
      model: parsed.model,
      colorway: parsed.colorway || "",
    });
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/checks/reference-images?${params}`)
      .then(r => r.ok ? r.json() : { images: [] })
      .then(data => {
        if (data.images?.length) setReferenceImages(data.images);
      })
      .catch(() => {});
  }, [router]);

  const handleFile = async (angleId: string, file: File) => {
    setUploading(u => ({ ...u, [angleId]: true }));
    try {
      const compressed = await compressImage(file, 1400);
      const url = await uploadImage(compressed, `shoe-auth/checks`);
      setPhotos(p => ({ ...p, [angleId]: url }));
    } catch (e) {
      setError(`Upload failed for ${angleId}: ${(e as Error).message}`);
    } finally {
      setUploading(u => ({ ...u, [angleId]: false }));
    }
  };

  const requiredDone = ANGLES.filter(a => a.required).every(a => photos[a.id]);
  const totalDone = Object.keys(photos).length;
  const requiredCount = ANGLES.filter(a => a.required).length;
  const requiredDoneCount = ANGLES.filter(a => a.required && photos[a.id]).length;

  const handleSubmit = async () => {
    if (!pending || !requiredDone) return;
    setSubmitting(true); setError("");
    try {
      const photoList = Object.entries(photos).map(([angle, url]) => ({ angle, url }));
      const { checkId } = await api.createCheck({
        brand: pending.brand,
        model: pending.model,
        colorway: pending.colorway,
        photos: photoList,
      });
      incrementFreeCheck();
      sessionStorage.removeItem("pending_check");
      router.push(`/check/${checkId}/results`);
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  };

  if (!pending) return null;

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <div className="mb-8">
        <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">Upload Photos</p>
        <h1 className="text-3xl font-extrabold text-[#111] mb-1 font-syne">
          {pending.brand.charAt(0).toUpperCase() + pending.brand.slice(1)} — {pending.model}
          {pending.colorway && <span className="text-[#aaa] font-normal"> ({pending.colorway})</span>}
        </h1>
        <p className="text-sm text-[#888]">Upload at least 5 required photos. More angles = more accurate results.</p>
      </div>

      {/* Reference Images Panel */}
      {referenceImages.length > 0 && (
        <div className="bg-white border border-[#e8e8e3] rounded-xl p-4 mb-6">
          <p className="text-[10px] text-[#aaa] uppercase tracking-widest font-syne mb-3">
            ✓ Authentic Reference · Compare your photos against these
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {referenceImages.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`Authentic reference ${i + 1}`}
                className="h-28 w-28 object-cover rounded-lg flex-shrink-0 border border-[#e8e8e3]"
              />
            ))}
          </div>
          <p className="text-[9px] text-[#ccc] mt-2">
            These are official product images of the authentic {pending.model}. Your photos should match these closely.
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="bg-white border border-[#e8e8e3] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#aaa] uppercase tracking-widest font-syne">Required: {requiredDoneCount}/{requiredCount}</span>
          <span className="text-xs text-[#aaa]">{totalDone}/{ANGLES.length} total</span>
        </div>
        <div className="w-full bg-[#f0f0ec] rounded-full h-1.5">
          <div
            className="bg-[#16a34a] h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(requiredDoneCount / requiredCount) * 100}%` }}
          />
        </div>
        {requiredDone && (
          <p className="text-xs text-[#16a34a] font-semibold mt-2">✓ Ready to submit</p>
        )}
      </div>

      {/* Upload grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {ANGLES.map((angle) => (
          <AngleSlot
            key={angle.id}
            angle={angle}
            url={photos[angle.id]}
            uploading={uploading[angle.id] || false}
            onFile={(file) => handleFile(angle.id, file)}
          />
        ))}
      </div>

      {error && <p className="text-[#dc2626] text-sm mb-4">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!requiredDone || submitting}
        className="btn-primary w-full text-center"
      >
        {submitting ? "Submitting..." : `Analyze ${totalDone} photo${totalDone !== 1 ? "s" : ""} →`}
      </button>

      <p className="text-center text-xs text-[#ccc] mt-4">
        5 required angles minimum · Better lighting = better accuracy
      </p>
    </div>
  );
}
