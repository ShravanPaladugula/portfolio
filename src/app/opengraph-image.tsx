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
          background: "#FFFFFF",
          color: "#000000",
          padding: 72,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#6E6E6E",
          }}
        >
          <span>Shravan Paladugula</span>
          <span>UC San Diego · Computer Engineering</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            maxWidth: 940,
          }}
        >
          I build systems that leave the screen.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderTop: "3px solid #000000",
            paddingTop: 24,
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>15 hackathons</span>
          <span style={{ color: "#C4C4C4" }}>/</span>
          <span>9 winning projects</span>
          <span style={{ color: "#C4C4C4" }}>/</span>
          <span>Embedded + firmware</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
