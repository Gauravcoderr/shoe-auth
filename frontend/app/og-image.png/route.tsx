import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Green glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(22,163,74,0.15)",
            filter: "blur(80px)",
          }}
        />
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(22,163,74,0.1)",
            border: "1px solid rgba(22,163,74,0.3)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
          <span style={{ color: "#16a34a", fontSize: 18, fontWeight: 700, letterSpacing: "0.1em" }}>
            AI AUTHENTICATION
          </span>
        </div>
        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ color: "white", fontSize: 80, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>
            Is your sneaker
          </span>
          <span style={{ color: "#a3e635", fontSize: 80, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>
            real or fake?
          </span>
        </div>
        {/* Sub */}
        <p style={{ color: "#555", fontSize: 26, marginTop: 28, letterSpacing: "0.02em" }}>
          74 AI checks · Nike · Jordan · Adidas · New Balance · 30 sec
        </p>
        {/* Domain */}
        <p style={{ color: "#333", fontSize: 20, marginTop: 48, letterSpacing: "0.1em" }}>
          SNEAKERAUTH.VERCEL.APP
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
