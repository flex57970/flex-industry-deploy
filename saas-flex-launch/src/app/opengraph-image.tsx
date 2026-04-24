import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FLEX Launch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0D0D0D 0%, #1A1507 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#F5F5F0", gap: 12 }}>
          <span>FLEX</span>
          <span style={{ color: "#D4AF37" }}>Launch</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 84, fontWeight: 700, color: "#F5F5F0", lineHeight: 1.1, maxWidth: 900 }}>
          Ta landing page <span style={{ color: "#D4AF37" }}>premium</span> en 60 secondes.
        </div>
        <div style={{ marginTop: 32, fontSize: 26, color: "#A0A098" }}>
          Décris ton produit. L'IA s'occupe du reste.
        </div>
      </div>
    ),
    size,
  );
}
