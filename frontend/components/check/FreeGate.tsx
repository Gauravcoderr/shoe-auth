interface Props {
  onLogin: () => void;
  onClose: () => void;
}

export default function FreeGate({ onLogin, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Free checks used</h2>
        <p className="text-gray-500 text-sm mb-6">
          You&apos;ve used your 3 free checks. Sign in to get unlimited checks and save your results.
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold mb-3 hover:bg-gray-700 transition-colors"
        >
          Sign in to continue
        </button>
        <button type="button" onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700">
          Back to home
        </button>
      </div>
    </div>
  );
}
