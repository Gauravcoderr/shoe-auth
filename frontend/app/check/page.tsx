"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasFreesRemaining, getFreeCheckCount } from "@/lib/freeCheckTracker";
import { api } from "@/lib/api";
import AuthModal from "@/components/auth/AuthModal";
import FreeGate from "@/components/check/FreeGate";
import BrandSelector from "@/components/check/BrandSelector";

function CheckPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [brand, setBrand] = useState(params.get("brand") || "");
  const [model, setModel] = useState("");
  const [colorway, setColorway] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && !hasFreesRemaining()) setShowGate(true);
  }, [user]);

  useEffect(() => {
    if (!brand) return;
    api.getBrands().then(({ brands }) => {
      const b = brands.find((b) => b.slug === brand);
      setModels(b?.models || []);
    });
  }, [brand]);

  const handleContinue = async () => {
    if (!brand || !model) return;
    if (!user && !hasFreesRemaining()) { setShowGate(true); return; }
    setLoading(true);
    try {
      sessionStorage.setItem("pending_check", JSON.stringify({ brand, model, colorway }));
      router.push(`/check/start`);
    } finally {
      setLoading(false);
    }
  };

  if (showGate) {
    return (
      <FreeGate
        onLogin={() => { setShowGate(false); setShowAuth(true); }}
        onClose={() => router.push("/")}
      />
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-2">Authentication</p>
          <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
            Check your sneakers
          </h1>
          <p className="text-[#666] text-sm">
            Select the brand and model, then upload photos from guided angles.
            {!user && (
              <span className="text-[#22c55e] font-semibold">
                {" "}{3 - getFreeCheckCount()} free check{3 - getFreeCheckCount() !== 1 ? "s" : ""} remaining.
              </span>
            )}
          </p>
        </div>

        {/* Step 1 */}
        <div className="mb-8">
          <p className="text-xs font-bold text-[#444] mb-3 uppercase tracking-widest">Step 01 — Brand</p>
          <BrandSelector selected={brand} onSelect={setBrand} />
        </div>

        {/* Step 2 */}
        {brand && (
          <div className="mb-8">
            <p className="text-xs font-bold text-[#444] mb-3 uppercase tracking-widest">Step 02 — Model</p>
            <input
              list="models-list"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g. Air Jordan 1 Retro High OG"
              className="input-dark"
            />
            <datalist id="models-list">
              {models.map(m => <option key={m} value={m} />)}
            </datalist>
          </div>
        )}

        {/* Step 3 */}
        {model && (
          <div className="mb-8">
            <p className="text-xs font-bold text-[#444] mb-3 uppercase tracking-widest">
              Step 03 — Colorway <span className="text-[#333] normal-case font-normal">(optional)</span>
            </p>
            <input
              value={colorway}
              onChange={e => setColorway(e.target.value)}
              placeholder="e.g. Chicago, University Blue, Bred..."
              className="input-dark"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!brand || !model || loading}
          className="w-full bg-white text-black py-4 rounded-xl font-extrabold hover:bg-[#e5e5e5] transition-colors disabled:opacity-30 text-sm font-syne"
        >
          {loading ? "Starting..." : "Upload photos →"}
        </button>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowGate(false)}
        />
      )}
    </>
  );
}

export default function CheckPageWrapper() {
  return (
    <Suspense>
      <CheckPage />
    </Suspense>
  );
}
