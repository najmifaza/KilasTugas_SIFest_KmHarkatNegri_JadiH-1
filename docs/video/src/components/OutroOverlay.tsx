import React from "react";
import { staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { Globe, ArrowRight } from "lucide-react";

interface OutroOverlayProps {
  layout?: "vertical" | "landscape";
}

export const OutroOverlay: React.FC<OutroOverlayProps> = ({ layout = "vertical" }) => {
  const frame = useCurrentFrame();

  if (frame < 6930) return null;

  const localFrame = frame - 6930;

  const enter = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scale = interpolate(enter, [0, 1], [0.92, 1]);

  if (layout === "vertical") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 90,
          backgroundColor: "rgba(17, 17, 19, 0.88)",
          backdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
          opacity: enter,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 36,
            padding: "54px 40px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            textAlign: "center",
            maxWidth: 900,
            width: "100%",
            border: "1.5px solid #fed7aa",
          }}
        >
          {/* Logo */}
          <img
            src={staticFile("logo.png")}
            alt="KilasTugas"
            style={{ width: 130, height: 130, objectFit: "contain", margin: "0 auto 24px" }}
          />

          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#111113",
              letterSpacing: "-0.03em",
              margin: "0 0 10px",
            }}
          >
            KilasTugas
          </h1>
          <p
            style={{
              fontSize: 22,
              color: "#4b5563",
              fontWeight: 600,
              margin: "0 0 32px",
              lineHeight: 1.45,
            }}
          >
            Ubah Tugas Kuliah yang Berat Menjadi Langkah Kerja Nyata yang Jelas, Terukur, dan Teratur.
          </p>

          {/* Web URL CTA */}
          <div
            style={{
              backgroundColor: "#fff7ed",
              border: "2px solid #ea580c",
              borderRadius: 24,
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 36,
              boxShadow: "0 8px 24px rgba(234, 88, 12, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: "#ea580c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                }}
              >
                <Globe size={28} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#ea580c", textTransform: "uppercase" }}>
                  Akses Langsung di Browser
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#111113", fontFamily: "ui-monospace, monospace" }}>
                  kilastugas.vercel.app
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#ea580c",
                color: "#ffffff",
                padding: "12px 22px",
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              <span>Buka Web</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Team and track info */}
          <div
            style={{
              borderTop: "1px solid #f3f4f6",
              paddingTop: 28,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#9ca3af", fontWeight: 700 }}>TIM PENGEMBANG</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111113", marginTop: 2 }}>Jadi H-1</div>
            </div>
            <div style={{ height: 32, width: 1, backgroundColor: "#e5e7eb" }} />
            <div>
              <div style={{ fontSize: 14, color: "#9ca3af", fontWeight: 700 }}>KOMPETISI</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#111113", marginTop: 2 }}>SIFest DIC 2026</div>
            </div>
            <div style={{ height: 32, width: 1, backgroundColor: "#e5e7eb" }} />
            <div>
              <div style={{ fontSize: 14, color: "#9ca3af", fontWeight: 700 }}>KATEGORI</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#ea580c", marginTop: 2 }}>Education</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landscape
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: "32px",
        border: "2px solid #ffedd5",
        boxShadow: "0 12px 36px rgba(0,0,0,0.08)",
        textAlign: "center",
        opacity: enter,
        transform: `scale(${scale})`,
      }}
    >
      <img
        src={staticFile("logo.png")}
        alt="KilasTugas"
        style={{ width: 80, height: 80, objectFit: "contain", margin: "0 auto 16px" }}
      />
      <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111113", margin: "0 0 6px" }}>
        KilasTugas
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 20px" }}>
        Smart Actionable Task Breakdown & Micro-Pacing
      </p>

      <div
        style={{
          backgroundColor: "#fff7ed",
          border: "2px solid #ea580c",
          borderRadius: 16,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Globe size={22} className="text-orange-600" />
          <span style={{ fontSize: 18, fontWeight: 900, color: "#111113", fontFamily: "ui-monospace, monospace" }}>
            kilastugas.vercel.app
          </span>
        </div>
        <span
          style={{
            backgroundColor: "#ea580c",
            color: "#ffffff",
            padding: "6px 14px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Coba Sekarang
        </span>
      </div>

      <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>
        Tim Jadi H-1 • SIFest 2026 Track Education
      </div>
    </div>
  );
};
