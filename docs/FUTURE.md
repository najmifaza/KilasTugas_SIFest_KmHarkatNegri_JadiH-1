# Roadmap & Fitur Masa Depan: KilasTugas

### SIFest Digital Innovation Challenge 2026: Track Education

> **Visi Produk:** Mentransformasi cara mahasiswa menghadapi tugas kuliah yang kompleks, dari prokrastinasi pasif menjadi tindakan harian terukur (actionable micro-pacing).

---

## 1. Roadmap Pengembangan Produk

```
[ Tahap 1: MVP Online Round ] ────▶ [ Tahap 2: Grand Final Sprint ] ────▶ [ Tahap 3: Post-Competition Rollout ]
• AI Task Breakdown (3-8 Langkah)    • In-Memory PDF Syllabus Extractor   • Multi-Tenant Campus LMS Sync
• Visual Pacing & Progress Ring      • Dynamic Pacing Rebalancer          • Cross-Device Sync (OAuth)
• Pomodoro Focus Engine 25/5         • Always-On Web Push Notifications   • Native OS Notification Daemon
• RFC 5545 iCalendar & GCal Export   • PWA Offline-First & Sync Queue     • Audio Prompt Decomposition
• Task Blueprint Sharing (/p/:id)    • Tactile Haptic & Power Shortcuts   • Long-Term Study Analytics
• Persistent Floating Timer
```

---

## 2. Fitur Unggulan Grand Final (Fokus Perbaikan UX & TI)

### 2.1 Ekstraksi Modul & Silabus Dosen Otomatis (In-Memory PDF Reader)
* **Masalah Pengguna:** Mahasiswa enggan mengetik ulang manual deskripsi tugas saat dosen membagikan berkas panduan dalam format PDF atau DOCX tebal (5 hingga 15 halaman).
* **Solusi & Mekanisme:**
  - Komponen drag-and-drop unggah berkas (PDF / DOCX, batas ukuran 5 MB).
  - Ekstraksi teks in-memory (RAM stream 5-15 MB, 0 penulisan disk ke storage VPS) menggunakan `pypdf`.
  - Sliding Window Parser: Membuang halaman pengantar dan daftar pustaka, hanya mengambil 2.000 hingga 3.000 karakter bagian instruksi tugas dan rubrik penilaian.
  - Model AI mengonversi teks yang disaring menjadi rencana sub-tugas terukur tanpa input ketik manual.

### 2.2 Penyesuaian Ritme Kerja Adaptif (Dynamic Pacing Rebalancer)
* **Masalah Pengguna:** Saat mahasiswa tertinggal jadwal hingga status berubah menjadi Behind Schedule, sistem konvensional hanya memberi label peringatan tanpa solusi aksi nyata, memicu kepanikan baru.
* **Solusi & Mekanisme:**
  - Tombol aksi satu klik: **Re-balance Pacing**.
  - Algoritma menghitung ulang sisa sub-tugas yang belum selesai terhadap sisa hari menuju tenggat waktu.
  - Tanggal target sub-tugas yang tertunda didistribusikan ulang secara proporsional ke hari-hari kerja berikutnya yang masih kosong, mengembalikan status pengerjaan ke On Track.

### 2.3 Progressive Web App (PWA) & Offline Sync Engine
* **Masalah Pengguna:** Mahasiswa sering mengerjakan tugas di area kampus dengan koneksi internet nirkabel yang tidak stabil atau kuota terbatas.
* **Solusi & Mekanisme:**
  - Web App Manifest dan Service Worker: Pemasangan instan ke layar utama perangkat Android dan iOS (Add to Home Screen).
  - Penyimpanan lokal IndexedDB: Akses daftar tugas, centang sub-tugas, dan timer Pomodoro berjalan 100% tanpa jaringan internet.
  - Resolusi Konflik Last-Write-Wins (LWW): Mutasi offline dicatat dalam antrean lokal (`mutation_queue`) dengan stempel waktu ISO UTC. Saat jaringan aktif kembali, antrean disinkronkan ke server secara batch melalui `POST /api/tasks/sync-batch`.

### 2.4 Timer Background Persisten & Web Push Notification (Always-On Focus Engine)
* **Masalah Pengguna:** Layar ponsel terkunci atau tab peramban ditutup saat sesi Pomodoro berjalan, mengakibatkan thread JavaScript mati dan alarm tidak berbunyi.
* **Solusi & Mekanisme:**
  - Auto-Resume via State Persistence: Menyimpan target waktu selesai (`Date.now() + duration`). Saat peramban dibuka kembali, timer langsung menyesuaikan sisa waktu riil tanpa reset.
  - Server-Side Web Push Scheduler (VAPID): Jadwal akhir sesi didaftarkan ke backend VPS saat timer dimulai. Tepat pada menit ke-25, server mengirimkan Web Push berbasis Service Worker (RFC 8291/8292) sehingga alarm tetap muncul di layar pengguna kendati peramban dalam keadaan tertutup penuh.

### 2.5 Respon Taktil Ponsel & Navigasi Cepat Desktop
* **Masalah Pengguna:** Aplikasi web produktivitas sering terasa kaku di layar sentuh ponsel dan memakan waktu navigasi pada papan ketik desktop.
* **Solusi & Mekanisme:**
  - Web Vibration API: Memberikan getaran haptic halus (30-50 milidetik) pada ponsel pintar saat sub-tugas berhasil dicentang, memberikan kepuasan dopamin langsung.
  - Pintasan Papan Ketik (Keyboard Shortcuts): Tombol `Space` untuk jeda/lanjut Pomodoro, `J` dan `K` untuk berpindah antar tugas, serta `C` untuk menandai sub-tugas selesai.

---

## 3. Peningkatan Arsitektur & Keandalan Sistem

1. **In-Memory Streaming & Proteksi Beban Memori VPS:**
   - Pembatasan ukuran upload Nginx maksimal 5 MB dengan `client_max_body_size 5M`.
   - Pemrosesan berkas PDF menggunakan in-memory byte buffer (`io.BytesIO`) untuk mencegah akumulasi berkas sampah di penyimpanan VPS.

2. **Protokol Sinkronisasi Batch (Low Overhead Network):**
   - Mengelompokkan mutasi status centang sub-tugas lokal ke dalam satu transaksi jaringan, mengurangi frekuensi request HTTP bolak-balik hingga 70%.

3. **Queue Worker & Rate Limiting:**
   - Penerapan Redis dan ARQ worker asinkronus untuk menangani lonjakan antrean prompt dekomposisi pada musim ujian perguruan tinggi.

4. **Model Quantization & Fallback Lokal:**
   - Opsi model inferensi open-weight terkuantisasi (Llama-3.2-3B / Qwen-2.5-Coder) di lingkungan kontainer lokal sebagai cadangan redundansi jika API pihak ketiga mengalami gangguan.

---

*Dokumen ini merupakan panduan teknis peta jalan produk KilasTugas untuk evaluasi Dewan Juri SIFest 2026 Grand Final.*
