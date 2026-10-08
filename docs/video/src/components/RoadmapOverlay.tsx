import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { FileText, Smartphone, BellRing, Sparkles } from "lucide-react";

interface RoadmapOverlayProps {
  layout?: "vertical" | "landscape";
}

export const RoadmapOverlay: React.FC<RoadmapOverlayProps> = ({ layout = "vertical" }) => {
  const frame = useCurrentFrame();

  // Active during section 7: 5610 to 6930
  if (frame < 5610 || frame >= 6930) return null;

  const localFrame = frame - 5610;

  // Global overlay fade-in & fade-out
  const overlayOpacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Which pillar is active right now?
  // Pillar 1: 5760 - 6060
  // Pillar 2: 6060 - 6480
  // Pillar 3: 6480 - 6930
  const activePillar =
    frame >= 6480 ? 3 : frame >= 6060 ? 2 : frame >= 5760 ? 1 : 0;

  const pillars = [
    {
      id: 1,
      title: "1. AI Syllabus Reader",
      subtitle: "Ekstraksi Modul & Silabus Otomatis",
      desc: "Unggah dokumen PDF/DOCX silabus dosen. AI otomatis mengekstrak instruksi & rubrik tugas menjadi sub-langkah harian tanpa ketik manual.",
      icon: FileText,
      badge: "PDF / DOCX",
      color: "#2563eb",
      lightBg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      id: 2,
      title: "2. PWA Offline-First",
      subtitle: "Akses Penuh Tanpa Internet",
      desc: "Dukungan IndexedDB lokal untuk membuka jadwal, mencentang checklist, dan timer offline. Sinkronisasi otomatis ke cloud saat online.",
      icon: Smartphone,
      badge: "IndexedDB Engine",
      color: "#16a34a",
      lightBg: "#f0fdf4",
      border: "#bbf7d0",
    },
    {
      id: 3,
      title: "3. Always-On Focus Engine",
      subtitle: "Web Push & Auto-Resume",
      desc: "Timer Pomodoro tetap berjalan saat tab atau browser ditutup via Web Push Notification (VAPID) tingkat sistem operasi.",
      icon: BellRing,
      badge: "Web Push VAPID",
      color: "#ea580c",
      lightBg: "#fff7ed",
      border: "#fed7aa",
    },
  ];

  if (layout === "vertical") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 70,
          backgroundColor: "rgba(17, 17, 19, 0.88)",
          backdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
          opacity: overlayOpacity,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44, width: "100%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#ffedd5",
              color: "#ea580c",
              padding: "8px 20px",
              borderRadius: 9999,
              fontSize: 16,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 16,
            }}
          >
            <Sparkles size={18} />
            Rencana Pengembangan Mendatang
          </div>
          <h2
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Tiga Fitur Inovasi Masa Depan
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 960 }}>
          {pillars.map((p) => {
            const isActive = activePillar === p.id;
            const Icon = p.icon;

            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.94)",
                  borderRadius: 24,
                  padding: "28px 32px",
                  border: isActive ? `3px solid ${p.color}` : "1.5px solid rgba(229, 231, 235, 0.8)",
                  boxShadow: isActive
                    ? `0 16px 40px ${p.color}40, 0 4px 12px rgba(0,0,0,0.1)`
                    : "0 8px 24px rgba(0,0,0,0.08)",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        backgroundColor: p.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 26, fontWeight: 800, color: "#111113", margin: 0 }}>
                        {p.title}
                      </h3>
                      <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 600 }}>
                        {p.subtitle}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      backgroundColor: p.lightBg,
                      color: p.color,
                      fontSize: 14,
                      fontWeight: 700,
                      padding: "6px 14px",
                      borderRadius: 9999,
                      border: `1px solid ${p.border}`,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>

                <p style={{ fontSize: 19, color: "#374151", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Landscape Layout (side panel infographic)
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        borderRadius: 22,
        padding: "24px 26px",
        border: "1.5px solid #fed7aa",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        opacity: overlayOpacity,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Sparkles size={16} className="text-orange-600" />
        <span style={{ fontSize: 13, fontWeight: 800, color: "#ea580c", textTransform: "uppercase" }}>
          Grand Final Innovation Sprint
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {pillars.map((p) => {
          const isActive = activePillar === p.id;
          const Icon = p.icon;

          return (
            <div
              key={p.id}
              style={{
                backgroundColor: isActive ? p.lightBg : "#ffffff",
                border: isActive ? `2px solid ${p.color}` : `1px solid #e5e7eb`,
                borderRadius: 16,
                padding: "14px 18px",
                transform: isActive ? "scale(1.02)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={18} color={p.color} />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#111113" }}>{p.title}</span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: p.color,
                    backgroundColor: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    border: `1px solid ${p.border}`,
                  }}
                >
                  {p.badge}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", margin: 0, lineHeight: 1.45 }}>{p.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
