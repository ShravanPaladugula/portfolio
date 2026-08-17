import { ImageResponse } from "next/og";

export const alt = "Shravan Paladugula — Computer Engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0B0D",
          color: "#F1F2F4",
          padding: "64px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: 22,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#3DFFC8",
          }}
        >
          <span>SP</span>
          <span style={{ color: "#8B909A" }}>UC San Diego CE</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
            }}
          >
            <span>SHRAVAN</span>
            <span>PALADUGULA</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#8B909A" }}>
            I build systems that leave the screen.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 3,
            width: 220,
            background: "#3DFFC8",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
