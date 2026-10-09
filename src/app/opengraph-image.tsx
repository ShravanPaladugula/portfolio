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
          background: "#FBFBF9",
          color: "#141416",
          padding: 72,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: 20,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#6B6B73",
          }}
        >
          <span>Shravan Paladugula</span>
          <span>UC San Diego · Computer Engineering</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            I build systems that leave the screen.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 26,
              color: "#6B6B73",
              maxWidth: 840,
            }}
          >
            Embedded systems, firmware, power, and the hardware layer of team
            builds.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: "1px solid #E3E3DD",
            paddingTop: 26,
            fontSize: 22,
            color: "#6B6B73",
          }}
        >
          <span style={{ color: "#B4471F" }}>15 hackathons</span>
          <span>·</span>
          <span style={{ color: "#B4471F" }}>9 winning projects</span>
          <span>·</span>
          <span>MountainHacks president</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
