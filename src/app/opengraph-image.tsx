import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MotorMatch - Motor Selection & Sizing Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "#f8fafc",
          border: "16px solid #2563eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
              MotorMatch
            </span>
            <span style={{ fontSize: 18, color: "#64748b" }}>Motor Selection & Sizing Tool</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 36,
            fontWeight: 700,
            color: "#1e293b",
            lineHeight: 1.2,
          }}
        >
          Kalkulator Sizing Motor Servo, Stepper & Induksi + VFD
        </div>
        <div style={{ marginTop: 16, fontSize: 20, color: "#475569", lineHeight: 1.4 }}>
          13 mekanisme • Katalog Mitsubishi, Yaskawa, Delta • Hitung torsi, inertia ratio & RMS torque
          gratis
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 12,
            fontSize: 16,
            color: "#2563eb",
          }}
        >
          <span
            style={{
              background: "#dbeafe",
              padding: "8px 16px",
              borderRadius: 999,
            }}
          >
            Ball Screw
          </span>
          <span style={{ background: "#dbeafe", padding: "8px 16px", borderRadius: 999 }}>
            Conveyor
          </span>
          <span style={{ background: "#dbeafe", padding: "8px 16px", borderRadius: 999 }}>
            Rotary Table
          </span>
          <span style={{ background: "#dbeafe", padding: "8px 16px", borderRadius: 999 }}>
            + 10 lagi
          </span>
        </div>
      </div>
    ),
    size
  );
}
