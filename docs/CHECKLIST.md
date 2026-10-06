# 📋 Checklist Progres KilasTugas
### SIFest Digital Innovation Challenge 2026 — Track: Education
> **Batas Akhir Online Round Submission:** **Kamis, 8 Oktober 2026, pukul 23.59 WIB**  
> **Jadwal Grand Final (Top 3 Finalis):** **Minggu, 11 Oktober 2026 (Full Online via Zoom)**

---

## 🟢 SUDAH DILAKUKAN (SELESAI)

### 1. Fondasi Dokumen & Perencanaan
- [x] **Penyusunan PRD Lengkap** (`docs/PRD (2).md`)
  - Problem Statement (*Task Paralysis / Overwhelm Freeze*).
  - Validasi masalah (triangulasi riset APA, Journal of Educational Psych, Stanford d.school, survei 28 mhs, wawancara).
  - Spesifikasi fitur MVP F-01 s/d F-07.
  - Skema database MariaDB & arsitektur sistem.
- [x] **Penyusunan Naskah Proposal Ringkas** (`docs/Proposal_KilasTugas.md`)
  - Mengikuti 100% struktur resmi Guidebook Bab 16.1 (10 bab wajib).
  - Susunan tim resmi: Adridinan Najmi Faza (Ketua), Timotius Willy Narendra, Fardizza Finda Rahman.
  - Deklarasi AI Usage (*AI Usage Declaration*) sesuai Bab 5.3 & 5.6.
  - Repositori GitHub resmi dicantumkan.
  - Estimasi panjang dokumen 4–5 halaman (aman di bawah batas maksimal 6 halaman).

### 2. Backend & Database (VPS Deployment)
- [x] **Scaffolding Backend FastAPI (Python 3.12)**
  - Endpoint session guest (`/api/session`).
  - Endpoint CRUD tugas (`/api/tasks`, `/api/tasks/{session_id}`, `/api/tasks/{task_id}`).
  - Endpoint CRUD subtask mandiri (`/api/tasks/{task_id}/subtasks`, `/api/subtasks/{subtask_id}`).
  - Endpoint AI breakdown (`/api/breakdown`) dengan opsi kustomisasi jumlah langkah (3–8 langkah).
  - Endpoint Task Blueprint Sharing & 1-Click Clone (`/api/blueprint/{task_id}`, `/api/blueprint/{task_id}/clone`).
  - Endpoint health check (`/health` & `/`).
- [x] **Integrasi AI Inference 9Router & Smart Cache**
  - Terhubung ke 9Router lokal VPS (`http://127.0.0.1:20128/v1`).
  - Model inferensi: `ag/gemini-3.7-flash-medium` (kecepatan respon < 2 detik).
  - Smart Caching MariaDB: jika tugas serupa pernah dipecah seangkatan, pakai cetak biru instan (<20ms, 0 token).
  - System prompt tervalidasi menghasilkan JSON array terstruktur.
- [x] **Mesin Fallback Template Deterministik**
  - Template bawaan untuk 5 kategori: *Laporan Lab, Makalah, Coding, Presentasi, Custom*.
  - Menjamin zero downtime jika API AI mengalami gangguan.
- [x] **Setup Basis Data MariaDB VPS**
  - Database `kilastugas_db` aktif dengan user `kilas_user`.
  - Tabel terpasang: `sessions`, `tasks`, `subtasks`, `pomodoro_sessions`.
  - Profil hemat memori dipasang di `/etc/mysql/mariadb.conf.d/99-lowmem.cnf`.
- [x] **Infrastruktur Web Server & Domain**
  - Nginx reverse proxy aktif mengarah ke Uvicorn port 8001.
  - Sertifikat SSL HTTPS Let's Encrypt aktif di `https://api-kilastugas.najmifaza.my.id`.
  - Background daemon systemd `kilastugas.service` aktif (auto-restart saat reboot).
  - CORS terkonfigurasi untuk mengizinkan `http://localhost:5173` dan `https://kilastugas.vercel.app`.

### 3. Frontend Client (React + Vite + Tailwind)
- [x] **Scaffolding Proyek Frontend**
  - React 18, Vite 5, Tailwind CSS, Lucide Icons, Axios, Canvas Confetti.
- [x] **Desain Antarmuka Mobile-First Editorial (Anti AI-Slop)**
  - Tampilan terang (*clean light mode*) bebas glitch/slop bernuansa editorial minimalis ala Linear/Notion.
  - Branding resmi logo 3D K: favicon multi-ukuran (16x16 s/d 64x64, `.ico`, `.png`), apple-touch-icon 180x180, dan logo app header.
  - Layout responsif 3 breakpoint: Mobile (<768px edge-to-edge + FAB), Tablet (768–1024px grid 2-kolom), Desktop (>1024px container max-w-6xl).
- [x] **Fitur Utama Antarmuka**
  - **Status Indicator Header:** Deteksi koneksi langsung (*live ping*) ke backend VPS + branding logo 3D K.
  - **Hero Circular Progress Gauge:** Visualisasi lingkaran progres dinamis berbasis rasio total subtask riil.
  - **DateStrip Interaktif:** Carousel strip tanggal horizontal (-2 s/d +4 hari) dengan penanda hari ini.
  - **Filter Navigasi Ringkas:** Tab chips *Target Mendesak*, *Semua Tugas*, dan *Selesai*.
  - **Modal Input Tugas:** Form input judul, matakuliah, kategori, split date/time picker, instruksi, dan selektor jumlah langkah kerja (Otomatis AI vs 3/4/5/6/8 langkah).
  - **Kartu Tugas Terstruktur (Default Collapsed):** Progress bar ramping, status tenggat, dropdown menu `•••` bebas clutter, dan tombol konfeti mini.
  - **Subtask Checklist Interaktif:** Checkbox bulat instan, tombol tambah manual inline, dan tombol hapus langkah.
  - **Persistent Pomodoro Focus Engine:**
    - Timer berjalan di background aplikasi (`Date.now()` timestamp accuracy).
    - Floating Mini-Timer Pill melayang di bawah layar saat modal ditutup.
    - Sinkronisasi countdown langsung ke tab title browser.
    - Bel audio synthesizer Web Audio API, haptic feedback, dan Browser Desktop Notification saat timer tuntas.
  - **Integrasi Eksternal Kalender:**
    - Direct Google Calendar intent (langsung buka app G-Calendar di HP / tab web di PC).
    - Ekspor berkas standar iCalendar RFC 5545 (`.ics`) dengan alarm reminder 15 menit otomatis.
  - **Task Blueprint Sharing:**
    - Salin link unik rencana kerja (`/p/:id`).
    - Modal pratinjau cetak biru + tombol impor satu detik ke jadwal mahasiswa penerima.
  - **Zero-Barrier Guest Mode:** UUID anonim tersimpan otomatis di `localStorage` per peramban tanpa registrasi.
- [x] **Deploy Production Frontend**
  - Live di Vercel: `https://kilastugas.vercel.app/`.
  - Berhasil diuji coba end-to-end secara live.

---

## 🔴 BELUM DILAKUKAN (ACTION ITEMS)

### Prioritas 1: Syarat Berkas Online Round (Deadline 8 Okt 23.59 WIB)

- [x] **1. Export Dokumen Proposal Ringkas ke PDF**
  - Sumber naskah: `docs/Proposal_KilasTugasFIKS.docx` & `docs/Proposal_KilasTugas.md`.
  - Nama file resmi: `docs/TimKilasTugas_KilasTugas_ProposalRingkas.pdf`.
  - Ketentuan Guidebook: Tepat 7 halaman (1 cover + 6 halaman isi).
  - Status: Selesai dan siap diunggah ke Google Drive dengan akses *"Anyone with the link can view"*.

- [ ] **2. Perekaman & Upload Video Demo Produk**
  - Durasi maksimal: 10 menit (disarankan 5–7 menit padat).
  - Platform upload: YouTube (status *Unlisted*).
  - Penamaan video: `TimKilasTugas_KilasTugas_VideoDemo`.
  - Alur isi video (merangkap *informal pitch* sesuai Guidebook Bab 7.2):
    1. **Masalah (1-2 menit):** Pengenalan fenomena *Task Paralysis* / *Overwhelm Freeze* pada mahasiswa saat menerima modul tugas tebal.
    2. **Solusi & Demo Live (4-5 menit):**
       - Buka `https://kilastugas.vercel.app` (tampilkan tampilan mobile responsif).
       - Input contoh tugas nyata (misal: Laporan Praktikum Jarkom / Projek Coding).
       - Klik *"Pecah Tugas Jadi Aksi Harian"* dan tunjukkan hasil breakdown AI yang instan (<2 detik).
       - Walkthrough sub-tugas harian, micro-pacing bar (*On Track*), dan buka *Focus Mode (Pomodoro Timer)*.
       - Centang sub-tugas yang selesai dan tunjukkan progres naik.
    3. **Penutup (1 menit):** Filosofi *"Problem First, Technology Second"*, penegasan dampak bagi mahasiswa, dan ucapan terima kasih.

- [ ] **3. Perapian Halaman Repositori GitHub (`README.md`)**
  - Tulis `README.md` utama pada repositori:
    - Judul & tagline produk.
    - Badges tech stack (FastAPI, React, MariaDB, 9Router, Vercel).
    - Latar belakang singkat & tautan live demo (`https://kilastugas.vercel.app`).
    - Panduan menjalankan di lokal (*Local Development Setup*).
    - Dokumentasi ringkas REST API.
    - Informasi anggota tim pengembang.
  - Pastikan repositori GitHub bersifat **Public** agar dewan juri dapat memeriksa kode sumber.

- [ ] **4. Pengisian Formulir Pendaftaran / Submission SIFest 2026**
  - Lengkapi formulir resmi panitia sebelum 8 Oktober 2026 pukul 23.59 WIB.
  - Masukkan:
    - Link Google Drive PDF Proposal Ringkas.
    - Link YouTube Video Demo (Unlisted).
    - Link Repositori GitHub.

---

### Prioritas 2: Penyempurnaan Produk Tambahan (Opsional / Polish)

- [x] **Responsivitas Multi-Device (Mobile, Tablet, Desktop)**
  - Mobile (<768px): Layar edge-to-edge, single-column task cards, Floating Action Button (FAB `+`) pojok kanan bawah.
  - Tablet (768px–1024px): Layout cockpit 2-kolom kartu tugas, hero banner & progress ring seimbang.
  - Desktop (>1024px): Max-width 6xl, grid 2-kolom tugas, floating mini-timer centered di bawah, tombol CTA langsung di navbar atas.
- [x] **Ekspor Jadwal ke Google / Apple Calendar (`.ics` & Direct G-Calendar Intent)** (PRD F-09)
  - Tombol *"Unduh Berkas .ics"* menghasilkan berkas standar iCalendar RFC 5545 dengan reminder 15 menit otomatis.
  - Tombol *"Buka di Google Calendar"* membuka template web/app intent langsung di perangkat.
- [x] **Checklist Interaktif & Manajemen Sub-Tugas Mandiri (PRD F-03)**
  - Tampil sebagai kartu berurutan dengan durasi menit dan target hari.
  - Tambah sub-tugas manual via tombol `+ Tambah Langkah Manual` di dalam kartu.
  - Hapus sub-tugas secara selektif via icon trash merah.
  - Edit inline teks sub-tugas (judul, estimasi durasi, dan panduan) via modal detail.
  - Pilihan jumlah langkah saat pembuatan tugas (Otomatis AI atau 3–8 langkah).
  - Optimistic UI updates terhubung ke API backend (`/api/subtasks`).
- [x] **Focus Mode Pomodoro Timer & Background Persistence (PRD F-04)**
  - Hitungan mundur 25 menit fokus / 5 menit istirahat dengan format waktu MM:SS berbasis timestamp `Date.now()`.
  - Floating mini-timer pill melayang di bawah layar saat modal fokus ditutup, memungkinkan navigasi bebas.
  - Judul tab browser otomatis menampilkan sisa waktu detik demi detik.
  - Synthesizer suara bel (*Web Audio API*) saat timer selesai.
  - Haptic feedback (*navigator.vibrate*) untuk smartphone.
  - Web Browser Notification API saat timer tuntas (ketika user membuka aplikasi lain).
- [x] **Task Blueprint Sharing & 1-Click Clone**
  - Tombol *"Bagikan Cetak Biru"* di menu `•••` menghasilkan link unik `/p/:id`.
  - Pratinjau langkah kerja dan tombol *"Impor ke Jadwalku (1 Detik)"* bagi teman sekelas.
  - Smart Cache di server MariaDB: nol token LLM dan latensi <20ms untuk tugas yang sama di angkatan.
- [x] **Status 100% "Ready to Submit 🎉" & Dopamine Feedback** (PRD F-05 & PRD 13.1)
  - Badge otomatis berubah menjadi `Ready to Submit 🎉` saat semua sub-tugas tuntas.
  - Progress bar hijau penuh dan tombol mini *"Rayakan 🎉"* untuk letupan konfeti ulang.
  - Efek ledakan konfeti (*canvas-confetti*) otomatis menyala saat sub-tugas terakhir dicentang.
- [ ] **Penyimpanan Riwayat Sesi Pomodoro:** Sinkronisasi waktu aktual pengerjaan ke tabel `pomodoro_sessions` di basis data MariaDB untuk analitik masa depan.

---

### Prioritas 3: Persiapan Grand Final (Jika Masuk Top 3 Finalis — 11 Oktober 2026)

- [ ] **Penyusunan Pitch Deck 10 Slide** (Sesuai panduan Guidebook Bab 16.2):
  1. *Slide 1: Problem*
  2. *Slide 2: Why Important*
  3. *Slide 3: Existing Solution*
  4. *Slide 4: Gap*
  5. *Slide 5: Our Solution*
  6. *Slide 6: Demo*
  7. *Slide 7: Technology*
  8. *Slide 8: Business Model*
  9. *Slide 9: Impact*
  10. *Slide 10: Roadmap*
- [ ] **Simulasi Product Defense & Uji Coba Perangkat:**
  - Uji coba Zoom share screen dan kamera aktif sesuai ketentuan Bab 14.
  - Siapkan koneksi cadangan (tethering seluler).
