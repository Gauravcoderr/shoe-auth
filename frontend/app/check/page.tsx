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

  // Check free limit for anonymous users
  useEffect(() => {
    if (!user && !hasFreesRemaining()) {
      setShowGate(true);
    }
  }, [user]);

  // Load models for selected brand
  useEffect(() => {
    if (!brand) return;
    api.getBrands().then(({ brands }) => {
      const b = brands.find((b) => b.slug === brand);
      setModels(b?.models || []);
    });
  }, [brand]);

  const handleContinue = async () => {
    if (!brand || !model) return;

    // If anonymous and no frees left, show gate
    if (!user && !hasFreesRemaining()) {
      setShowGate(true);
      return;
    }

    setLoading(true);
    try {
      // Create the check record (photos will be added on upload page)
      // We pass empty photos here and will redirect to upload page
      // Store brand/model in sessionStorage for upload page
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your sneakers</h1>
          <p className="text-gray-500 text-sm">
            Select the brand and model, then upload photos from guided angles.
            {!user && (
              <span className="text-green-600 font-medium">
                {" "}{3 - getFreeCheckCount()} free check{3 - getFreeCheckCount() !== 1 ? "s" : ""} remaining.
              </span>
            )}
          </p>
        </div>

        {/* Step 1: Brand */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Step 1 — Brand</h2>
          <BrandSelector selected={brand} onSelect={setBrand} />
        </div>

        {/* Step 2: Model */}
        {brand && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Step 2 — Model</h2>
            <input
              list="models-list"
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="e.g. Air Jordan 1 Retro High OG"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <datalist id="models-list">
              {models.map(m => <option key={m} value={m} />)}
            </datalist>
          </div>
        )}

        {/* Step 3: Colorway (optional) */}
        {model && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Step 3 — Colorway <span className="text-gray-400 normal-case font-normal">(optional but helps accuracy)</span>
            </h2>
            <input
              value={colorway}
              onChange={e => setColorway(e.target.value)}
              placeholder="e.g. Chicago, University Blue, Bred..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!brand || !model || loading}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40"
        >
          {loading ? "Starting..." : "Upload photos →"}
        </button>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => { setShowGate(false); }}
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
