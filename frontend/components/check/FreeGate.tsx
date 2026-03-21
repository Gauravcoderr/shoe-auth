interface Props {
  onLogin: () => void;
  onClose: () => void;
}

export default function FreeGate({ onLogin, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#222] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-14 h-14 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          Free checks used
        </h2>
        <p className="text-[#666] text-sm mb-6 leading-relaxed">
          You&apos;ve used your 3 free checks. Sign in for unlimited checks and saved results.
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="w-full bg-white text-black py-3 rounded-xl font-bold mb-3 hover:bg-[#e5e5e5] transition-colors"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Sign in to continue
        </button>
        <button type="button" onClick={onClose} className="text-sm text-[#444] hover:text-[#888] transition-colors">
          Back to home
        </button>
      </div>
    </div>
  );
}
