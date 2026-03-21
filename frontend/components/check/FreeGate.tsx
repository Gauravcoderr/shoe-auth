interface Props {
  onLogin: () => void;
  onClose: () => void;
}

export default function FreeGate({ onLogin, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-[#e8e8e3] rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
        <div className="w-14 h-14 bg-[#f0f0ec] border border-[#e8e8e3] rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
          🔒
        </div>
        <h2 className="text-xl font-extrabold text-[#111] mb-2 font-syne">Free checks used</h2>
        <p className="text-[#888] text-sm mb-6 leading-relaxed">
          You&apos;ve used your 3 free checks. Sign in for unlimited checks and saved results.
        </p>
        <button type="button" onClick={onLogin} className="btn-primary w-full mb-3">
          Sign in to continue
        </button>
        <button type="button" onClick={onClose} className="text-sm text-[#bbb] hover:text-[#666] transition-colors">
          Back to home
        </button>
      </div>
    </div>
  );
}
