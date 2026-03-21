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
  { id: "top-down", label: "Top Down", required: true, tip: "Directly above, laces visible, entire shoe." },
  { id: "heel", label: "Heel / Back", required: true, tip: "Directly behind the shoe, heel centered." },
  { id: "sole", label: "Sole (Bottom)", required: true, tip: "Flat on surface, camera directly above sole." },
  { id: "tongue", label: "Tongue Label", required: false, tip: "Close-up on tongue label text. Must be legible." },
  { id: "toe-front", label: "Toe Box (Front)", required: false, tip: "Straight-on front view, flat surface." },
  { id: "box-label", label: "Box Label", required: false, tip: "Shoe box label close-up if available." },
];

export default function UploadPage() {
  const router = useRouter();
  const [pending, setPending] = useState<{ brand: string; model: string; colorway: string } | null>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({}); // angleId → cloudinary url
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = sessionStorage.getItem("pending_check");
    if (!data) { router.push("/check"); return; }
    setPending(JSON.parse(data));
  }, []);

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
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Authenticating</div>
        <h1 className="text-xl font-bold text-gray-900">
          {pending.brand.charAt(0).toUpperCase() + pending.brand.slice(1)} — {pending.model}
          {pending.colorway && <span className="text-gray-500"> ({pending.colorway})</span>}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload at least 5 required photos. More angles = more accurate results.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8 p-3 bg-gray-50 rounded-xl">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(totalDone / ANGLES.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{totalDone}/{ANGLES.length} photos</span>
        {requiredDone && <span className="text-xs text-green-600 font-semibold">Ready to submit</span>}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
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

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!requiredDone || submitting}
        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40"
      >
        {submitting ? "Submitting..." : `Analyze ${totalDone} photo${totalDone !== 1 ? "s" : ""} →`}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        * 5 required photos minimum. Better lighting = better accuracy.
      </p>
    </div>
  );
}
