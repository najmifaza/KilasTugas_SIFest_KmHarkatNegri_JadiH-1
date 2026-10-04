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
  - Endpoint subtask update (`/api/subtasks/{subtask_id}`).
  - Endpoint AI breakdown (`/api/breakdown`).
  - Endpoint health check (`/health` & `/`).
- [x] **Integrasi AI Inference 9Router**
  - Terhubung ke 9Router lokal VPS (`http://127.0.0.1:20128/v1`).
  - Model inferensi: `ag/gemini-3.7-flash-medium` (kecepatan respon < 2 detik).
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
  - React 18, Vite 5, Tailwind CSS, Lucide Icons, Axios.
- [x] **Desain Antarmuka Mobile-First (Anti AI-Slop)**
  - Tampilan terang (*light mode*) bersih bernuansa editorial minimalis ala Notion/Linear.
  - Layout responsif: native-app view di smartphone dan smartphone container frame modern di desktop.
- [x] **Fitur Utama Antarmuka**
  - **Status Indicator Header:** Deteksi koneksi langsung (*live ping*) ke backend VPS.
  - **Filter Navigasi:** Tab *Hari Ini*, *Semua Tugas*, dan tombol bulat oranye `+`.
  - **Modal Input Tugas (Sliding Bottom Sheet):** Form input judul, matakuliah, kategori, deadline, dan instruksi modul dosen.
  - **Kartu Tugas Terstruktur:** Status pacing (*On Track* 🟢, *Behind Schedule* 🟡, *Overdue* 🔴), progress bar tipis, dan tombol hapus tugas.
  - **Subtask Checklist Interaktif:** Checkbox bulat untuk menyelesaikan langkah kerja secara instan (optimistic UI update).
  - **Detail & Focus Modal Screen:** Halaman detail sub-tugas berisikan panduan eksekusi AI, Pomodoro Timer terpadu (`25:00`), serta *floating dark bottom bar* dengan tombol Mulai, Jeda, Reset, dan Tandai Selesai.
  - **Zero-Barrier Guest Mode:** UUID anonim tersimpan otomatis di `localStorage` per peramban tanpa wajib registrasi.
- [x] **Deploy Production Frontend**
  - Live di Vercel: `https://kilastugas.vercel.app/`.
  - Berhasil diuji coba end-to-end: input tugas → AI breakdown → subtask checklist → timer Pomodoro.

---

## 🔴 BELUM DILAKUKAN (ACTION ITEMS)

### Prioritas 1: Syarat Berkas Online Round (Deadline 8 Okt 23.59 WIB)

- [ ] **1. Export Dokumen Proposal Ringkas ke PDF**
  - Sumber naskah: `docs/Proposal_KilasTugas.md`.
  - Nama file wajib: `TimKilasTugas_KilasTugas_ProposalRingkas.pdf`.
  - Ketentuan Guidebook: Maksimal 6 halaman (tidak termasuk cover).
  - Simpan di Google Drive dengan opsi berbagi *"Anyone with the link can view"*.

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

- [ ] **Audio Chime & Notifikasi Timer Pomodoro:** Bunyi bel/alarm halus ketika hitungan mundur fokus 25 menit atau istirahat 5 menit selesai.
- [ ] **Input Sub-Tugas Manual:** Tombol untuk menambah sub-tugas kustom sendiri jika pengguna ingin menyisipkan langkah tambahan di luar rekomendasi AI.
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
