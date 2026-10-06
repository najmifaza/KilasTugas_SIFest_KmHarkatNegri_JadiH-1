# 🚀 Roadmap & Fitur Masa Depan: KilasTugas

### SIFest Digital Innovation Challenge 2026 — Track: Education

> **Visi Produk:** Mentransformasi cara mahasiswa menghadapi tugas kuliah yang kompleks, dari prokrastinasi pasif menjadi tindakan harian terukur (_actionable micro-pacing_).

---

## 🧭 Roadmap Pengembangan Produk

```
[ Tahap 1: MVP Online Round ] ───▶ [ Tahap 2: Grand Final Sprint ] ───▶ [ Tahap 3: Post-Competition Rollout ]
• AI Magic Breakdown               • Collaborative Group Task Split   • Multi-Tenant Campus Workspace
• Visual Pacing & Progress Ring    • Always-On Web Push Notifications • Cross-Device Sync (OAuth)
• Pomodoro Focus Mode              • PWA Offline-First Engine         • Native OS Notification Daemon
• RFC 5545 iCalendar Export        • Adaptive Step Timing Analytics   • Voice/Audio Prompt Decomposition
• Task Blueprint Sharing (Active)
• Persistent Floating Timer
```

---

## 🌟 Detail Fitur Unggulan Mendatang

### 1. 👥 Pembagian Tugas Kelompok Cerdas (_Collaborative Task Split_)

- **Mekanisme Fitur:**
  - Mode tugas kelompok: Ketua tim memasukkan anggota dan peran (Analis, Pengembang, Penulis Laporan).
  - AI membagi beban kerja secara adil berdasarkan porsi kompetensi dan estimasi waktu.
  - Dasbor ketergantungan tugas (_task dependency_): Anggota B baru mulai saat Anggota A menandai sub-tugasnya selesai.

### 2. 📱 Progressive Web App (PWA) & Offline-First Mode

- **Mekanisme Fitur:**
  - Pemasangan langsung ke layar utama Android & iOS tanpa melalui App Store (_Add to Home Screen_).
  - Dukungan IndexedDB lokal: aplikasi dapat membuka jadwal, mencentang sub-tugas, dan menjalankan timer Pomodoro tanpa koneksi internet sama sekali.
  - Sinkronisasi otomatis ke server VPS saat perangkat kembali terhubung ke jaringan.

### 3. ⏱️ Timer Background Persisten & Web Push Notification (_Always-On Focus Engine_)

- **Masalah Pengguna:** Mahasiswa menutup tab browser atau laptop/layar ponsel mati saat sesi fokus Pomodoro berjalan. Ketika thread JavaScript browser mati, timer hilang dan alarm audio bawaan browser tidak berbunyi.
- **Mekanisme Fitur:**
  - **Auto-Resume via State Persistence (`localStorage`):** Menyimpan timestamp target tuntas (`endTime = Date.now() + duration`). Saat browser atau tab dibuka kembali kapan saja, timer otomatis menghitung sisa waktu nyata tanpa reset atau freeze.
  - **Server-Side Web Push Scheduler (VAPID):** Saat timer dimulai, jadwal tuntas didaftarkan ke backend VPS. Server akan mengirimkan notifikasi Web Push berbasis Service Worker tepat saat 25 menit berakhir, memastikan alarm dan notifikasi tetap meletup di layar ponsel/laptop pengguna meskipun peramban web sedang ditutup secara total.
  - **Native OS Calendar Alarm Fallback:** Integrasi direct sync Google Calendar & Apple Calendar (.ics) dengan alarm otomatis 0 menit & -15 menit sebagai cadangan andal di tingkat sistem operasi (_OS-level hardware alarm_).

---

## 🛠️ Peningkatan Arsitektur Teknologi

1. **Queue Worker & Rate Limiting:**
   - Implementasi Redis + Celery/ARQ untuk menangani antrean prompt dekomposisi saat ribuan mahasiswa menggunakan sistem secara bersamaan di musim UTS/UAS.
2. **Model Quantization & Local LLM Fallback:**
   - Opsi penggunaan model open-weight terkuantisasi (misal: Llama-3.2-3B / Qwen-2.5-Coder) yang dapat dijalankan secara lokal pada perangkat atau VPS low-resource.
3. **Analitik Privasi Pengguna:**
   - Telemetri tanpa pelacak data pribadi untuk mengidentifikasi kategori mata kuliah yang paling rentan memicu prokrastinasi di kalangan mahasiswa.

---

_Dokumen ini merupakan bagian dari peta jalan inovasi KilasTugas untuk evaluasi Dewan Juri SIFest 2026._
