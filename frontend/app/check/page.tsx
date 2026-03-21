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

  const freesLeft = 3 - getFreeCheckCount();

  return (
    <>
      <div className="max-w-2xl mx-auto px-5 py-14">
        <div className="mb-10">
          <p className="text-xs text-[#bbb] uppercase tracking-widest mb-3 font-syne">Authentication</p>
          <h1 className="text-4xl font-extrabold text-[#111] mb-2 font-syne">Check your sneakers</h1>
          <p className="text-[#888] text-sm">
            Select the brand and model, then upload photos from guided angles.
            {!user && freesLeft > 0 && (
              <span className="text-[#16a34a] font-semibold"> {freesLeft} free check{freesLeft !== 1 ? "s" : ""} remaining.</span>
            )}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-bold text-[#bbb] mb-3 uppercase tracking-widest font-syne">Step 01 — Brand</p>
            <BrandSelector selected={brand} onSelect={setBrand} />
          </div>

          {brand && (
            <div>
              <p className="text-[10px] font-bold text-[#bbb] mb-3 uppercase tracking-widest font-syne">Step 02 — Model</p>
              <input
                list="models-list"
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="e.g. Air Jordan 1 Retro High OG"
                className="input-field"
              />
              <datalist id="models-list">
                {models.map(m => <option key={m} value={m} />)}
              </datalist>
            </div>
          )}

          {model && (
            <div>
              <p className="text-[10px] font-bold text-[#bbb] mb-3 uppercase tracking-widest font-syne">
                Step 03 — Colorway <span className="text-[#ccc] normal-case font-normal">(optional)</span>
              </p>
              <input
                value={colorway}
                onChange={e => setColorway(e.target.value)}
                placeholder="e.g. Chicago, University Blue, Bred..."
                className="input-field"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!brand || !model || loading}
          className="btn-primary w-full mt-10 text-center"
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
