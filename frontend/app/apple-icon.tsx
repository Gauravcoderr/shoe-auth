import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#111111",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 16c0 0 1-6 5-8s7 1 9 1 4-2 6-1 2 5 2 6c0 2-1 3-3 3H4c-1.5 0-2-1-2-1z"
            fill="#16a34a"
          />
          <path
            d="M7 8c0 0 2-4 5-4s5 2 5 4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M4 16.5 L20 16.5"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
