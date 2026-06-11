import { ImageResponse } from "next/og";

// Branded delingsbillede (1200×630). Next genererer og:image- og
// twitter:image-tags automatisk ud fra denne fil og bruger den som fallback
// for alle sider, der ikke selv definerer et.
export const alt = "Esmark – Sommerhuse ved Vestkysten";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const brand = "#0e2a47";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: brand,
          color: "white",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "0.05em" }}>
          ESMARK
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            Sommerhuse ved Vestkysten
          </div>
          <div style={{ fontSize: 36, color: "rgba(255,255,255,0.85)" }}>
            Hundevenlige feriehuse med plads til hele familien
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
