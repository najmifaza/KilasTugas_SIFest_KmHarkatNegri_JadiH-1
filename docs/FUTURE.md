# 🚀 Roadmap & Fitur Masa Depan: KilasTugas

### SIFest Digital Innovation Challenge 2026 — Track: Education

> **Visi Produk:** Mentransformasi cara mahasiswa menghadapi tugas kuliah yang kompleks, dari prokrastinasi pasif menjadi tindakan harian terukur (_actionable micro-pacing_).

---

## 🧭 Roadmap Pengembangan Produk

```
[ Tahap 1: MVP Online Round ] ───▶ [ Tahap 2: Grand Final Sprint ] ───▶ [ Tahap 3: Post-Competition Rollout ]
• AI Magic Breakdown               • Panic Mode (Emergency Re-pacing) • LMS Kampus Integration (eLDirU/Moodle)
• Visual Pacing & Progress Ring    • Share & Clone Task Blueprint     • Collaborative Group Split
• Pomodoro Focus Mode              • Google Calendar Direct Sync      • Cross-Device Sync (OAuth)
• RFC 5545 iCalendar Export        • Burnout Guard & Load Meter       • PWA Offline-First
```

---

## 🌟 Detail Fitur Unggulan Mendatang

### 1. 🚨 Mode Darurat H-1 (_Emergency Panic Re-pacing_)

- **Masalah Pengguna:** Mahasiswa menunda pekerjaan sampai sisa 24 jam sebelum tenggat waktu. Rencana kerja 5–7 hari yang dibuat sebelumnya menjadi usang, menimbulkan kepanikan mental dan kecenderungan menyerah.
- **Mekanisme Fitur:**
  - Tombol 1-klik: `🚨 Hitung Ulang Mode Darurat`.
  - AI mengaktifkan prompt spesifik _Pareto Principle (80/20 Rule)_: memangkas 6 sub-tugas ideal menjadi 3 langkah minimum viabel yang menjamin tugas tetap memenuhi rubrik penilaian dosen.
  - Penyesuaian timer Pomodoro menjadi format sprint intensif (misal: 35 menit kerja, 5 menit evaluasi).

### 2. 🔗 Bagikan & Salin Cetak Biru Tugas (_Task Blueprint Sharing_)

- **Masalah Pengguna:** Dalam satu angkatan atau kelas, ratusan mahasiswa mengerjakan modul praktikum atau tugas besar yang sama persis.
- **Mekanisme Fitur:**
  - Tombol `Bagikan Rencana Kerja` menghasilkan link unik (misal: `kilastugas.vercel.app/p/rsa-lab-01`).
  - Mahasiswa lain dapat membuka link dan menekan tombol `Impor ke Jadwalku` dalam 1 detik.
  - Mengurangi beban komputasi AI server melalui sistem caching cetak biru tugas berbasis hash judul & modul.

### 3. 🛡️ Pengukur Beban Kognitif (_Burnout Guard_)

- **Masalah Pengguna:** Mahasiswa sering tidak menyadari bahwa jadwal sub-tugas dari 3 mata kuliah berbeda menumpuk pada hari yang sama, menyebabkan kelelahan mental (_burnout_).
- **Mekanisme Fitur:**
  - Integrasi indikator beban harian pada bilah tanggal (`DateStrip`):
    - 🟢 **Ringan** (< 1.5 jam fokus per hari)
    - 🟡 **Sedang** (1.5 – 3 jam fokus per hari)
    - 🔴 **Kritis** (> 3.5 jam fokus per hari)
  - Saran otomatis dari sistem: _"Beban belajar hari Rabu terlampau padat. Geser 1 langkah Makalah Teori ke hari Selasa?"_

### 4. 🎓 Integrasi Langsung LMS Kampus (_LMS Auto-Sync_)

- **Mekanisme Fitur:**
  - Sinkronisasi otomatis dengan portal e-learning berbasis Moodle (seperti eLDirU Universitas Jenderal Soedirman).
  - Ekstraksi otomatis judul tugas, instruksi file PDF modul, dan tanggal tenggat waktu resmi dari server kampus ke dalam formulir KilasTugas.
  - Notifikasi pengingat sebelum pengumpulan tugas ditutup oleh sistem kampus.

### 5. 👥 Pembagian Tugas Kelompok Cerdas (_Collaborative Task Split_)

- **Mekanisme Fitur:**
  - Mode tugas kelompok: Ketua tim memasukkan anggota dan peran (Analis, Pengembang, Penulis Laporan).
  - AI membagi beban kerja secara adil berdasarkan porsi kompetensi dan estimasi waktu.
  - Dasbor ketergantungan tugas (_task dependency_): Anggota B baru mulai saat Anggota A menandai sub-tugasnya selesai.

### 6. 📱 Progressive Web App (PWA) & Offline-First Mode

- **Mekanisme Fitur:**
  - Pemasangan langsung ke layar utama Android & iOS tanpa melalui App Store (_Add to Home Screen_).
  - Dukungan IndexedDB lokal: aplikasi dapat membuka jadwal, mencentang sub-tugas, dan menjalankan timer Pomodoro tanpa koneksi internet sama sekali.
  - Sinkronisasi otomatis ke server VPS saat perangkat kembali terhubung ke jaringan.

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
