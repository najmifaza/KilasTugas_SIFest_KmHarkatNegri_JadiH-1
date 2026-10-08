import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import {
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  Share2,
  Play,
  Award,
} from "lucide-react";

interface CutoutItem {
  startFrame: number;
  endFrame: number;
  render: () => React.ReactNode;
}

export const AppCutoutShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const cutouts: CutoutItem[] = [
    // 1. Akses Instan & Tombol Tambah Tugas (00:07 - 00:14)
    {
      startFrame: 210,
      endFrame: 450,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#ea580c" }}>
              Akses Langsung Tanpa Registrasi
            </span>
            <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: 16, fontWeight: 700, padding: "4px 14px", borderRadius: 9999 }}>
              Guest Mode Aktif
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#ea580c",
              color: "#ffffff",
              padding: "18px 26px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(234, 88, 12, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Plus size={32} strokeWidth={2.5} />
              <span style={{ fontSize: 28, fontWeight: 800 }}>+ Tambah Tugas</span>
            </div>
            <span style={{ backgroundColor: "#ffffff", color: "#ea580c", padding: "6px 16px", borderRadius: 9999, fontSize: 16, fontWeight: 800 }}>
              1 Detik
            </span>
          </div>
        </div>
      ),
    },

    // 2. Input Modul & Kategori (00:15 - 00:30)
    {
      startFrame: 450,
      endFrame: 900,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>
              Formulir Input Tugas
            </span>
            <span style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontSize: 16, fontWeight: 700, padding: "4px 14px", borderRadius: 9999 }}>
              Target: 5 Langkah
            </span>
          </div>

          <div style={{ backgroundColor: "#f8fafc", padding: "20px 24px", borderRadius: 18, border: "1.5px solid #e2e8f0" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111113", marginBottom: 8 }}>
              Laporan Praktikum Jaringan Komputer
            </div>
            <div style={{ fontSize: 18, color: "#64748b", fontWeight: 600 }}>
              Kategori: Praktikum Lab • Tenggat: 5 Hari ke Depan
            </div>
          </div>
        </div>
      ),
    },

    // 3. AI Magic Breakdown Selesai (00:30 - 00:40)
    {
      startFrame: 900,
      endFrame: 1200,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={28} className="text-orange-600" />
              <span style={{ fontSize: 24, fontWeight: 800, color: "#111113" }}>
                AI Magic Breakdown
              </span>
            </div>
            <span style={{ backgroundColor: "#ffedd5", color: "#c2410c", fontSize: 16, fontWeight: 800, padding: "4px 14px", borderRadius: 9999 }}>
              &lt; 2.0 Detik
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "1. Hitung alokasi subnet VLSM (45 mnt)",
              "2. Konfigurasi 5 Router OSPF di Packet Tracer (40 mnt)",
              "3. Uji konektivitas ping & traceroute (30 mnt)",
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: idx === 0 ? "#fff7ed" : "#f8fafc",
                  border: idx === 0 ? "1.5px solid #ea580c" : "1.5px solid #e2e8f0",
                  padding: "14px 20px",
                  borderRadius: 14,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // 4. Status On Track & Checklist Selesai (00:40 - 01:17)
    {
      startFrame: 1200,
      endFrame: 2340,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
                fontSize: 18,
                fontWeight: 800,
                padding: "6px 18px",
                borderRadius: 9999,
              }}
            >
              🟢 Tepat Waktu (On Track)
            </span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>
              20% Selesai
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1.5px solid #bbf7d0",
              padding: "18px 24px",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <CheckCircle2 size={40} className="text-green-600" />
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#166534", textDecoration: "line-through" }}>
                1. Hitung alokasi subnet VLSM
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#15803d", marginTop: 2 }}>
                ✓ Sub-tugas selesai dicentang • Audio Bel Aktif
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 5. Pomodoro Focus Mode & Floating Timer (01:18 - 02:16)
    {
      startFrame: 2340,
      endFrame: 4110,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#111113" }}>
              Waktu Fokus 25 Menit
            </span>
            <span style={{ backgroundColor: "#ffedd5", color: "#c2410c", fontSize: 16, fontWeight: 700, padding: "4px 14px", borderRadius: 9999 }}>
              Floating Timer
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#18181b",
              color: "#ffffff",
              padding: "20px 26px",
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 52, height: 52, borderRadius: 9999, backgroundColor: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Play size={26} fill="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fb923c" }}>SISA WAKTU FOKUS</div>
                <div style={{ fontSize: 38, fontWeight: 900, fontFamily: "ui-monospace, monospace" }}>24 : 45</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#9ca3af", textAlign: "right" }}>
              Aktif di Bawah Layar<br />&amp; Judul Tab Browser
            </div>
          </div>
        </div>
      ),
    },

    // 6. Kalender & Cetak Biru (02:17 - 02:44)
    {
      startFrame: 4110,
      endFrame: 4950,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#2563eb" }}>
              Kalender &amp; Berbagi Rencana
            </span>
            <span style={{ backgroundColor: "#eff6ff", color: "#1d4ed8", fontSize: 16, fontWeight: 700, padding: "4px 14px", borderRadius: 9999 }}>
              1-Klik Impor
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ backgroundColor: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px", display: "flex", alignItems: "center", gap: 14 }}>
              <Calendar size={32} className="text-blue-600" />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111113" }}>Google Calendar</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#64748b" }}>Alarm -15 Menit</div>
              </div>
            </div>
            <div style={{ backgroundColor: "#fff7ed", border: "1.5px solid #ffedd5", borderRadius: 16, padding: "18px", display: "flex", alignItems: "center", gap: 14 }}>
              <Share2 size={32} className="text-orange-600" />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#111113" }}>Bagikan Cetak Biru</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#c2410c" }}>Tautan /p/:id</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 7. Ready to Submit & Confetti (02:45 - 03:06)
    {
      startFrame: 4950,
      endFrame: 5610,
      render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>
              Tugas Tuntas 100%
            </span>
            <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: 16, fontWeight: 800, padding: "4px 14px", borderRadius: 9999 }}>
              Confetti Selesai
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#16a34a",
              color: "#ffffff",
              padding: "20px 26px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(22, 163, 74, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Award size={40} />
              <div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>Ready to Submit 🎉</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#dcfce7" }}>Seluruh 5 Langkah Terselesaikan</div>
              </div>
            </div>
            <span style={{ backgroundColor: "#ffffff", color: "#16a34a", padding: "8px 18px", borderRadius: 9999, fontSize: 18, fontWeight: 900 }}>
              100%
            </span>
          </div>
        </div>
      ),
    },
  ];

  const currentCutout = cutouts.find((c) => frame >= c.startFrame && frame < c.endFrame);

  if (!currentCutout) return null;

  const localFrame = frame - currentCutout.startFrame;
  const duration = currentCutout.endFrame - currentCutout.startFrame;

  // Clean smooth entrance
  const enter = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exit = interpolate(localFrame, [duration - 6, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enter * (1 - exit);
  const translateY = interpolate(enter, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 310,
        left: 36,
        right: 36,
        zIndex: 82,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "24px 30px",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 16px 40px -10px rgba(0, 0, 0, 0.18)",
          maxWidth: 980,
          width: "100%",
        }}
      >
        {currentCutout.render()}
      </div>
    </div>
  );
};
