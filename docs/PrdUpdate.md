# Product Requirement Document (PRD) — Versi 2.0 (Terkini)
## KilasTugas: Smart Actionable Task Breakdown & Micro-Pacing for Students

---

> **Versi Dokumen:** 2.0.0 (Production & Submission Ready)  
> **Penyusun:** Tim KilasTugas (Adridinan Najmi Faza, Timotius Willy Narendra, Fardizza Finda Rahman)  
> **Institusi:** Jurusan Informatika, Universitas Jenderal Soedirman  
> **Kompetisi:** SIFest Digital Innovation Challenge 2026 (Track: Education)  
> **Batas Akhir Online Round:** 8 Oktober 2026 pukul 23.59 WIB  
> **Jadwal Grand Final (Zoom):** 11 Oktober 2026  
> **Tautan Repositori:** https://github.com/najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1  
> **Live Demo Vercel:** https://kilastugas.vercel.app  
> **Live API VPS:** https://api-kilastugas.najmifaza.my.id  

---

## 1. Executive Summary

**KilasTugas** adalah platform produktivitas akademik berbasis web cerdas yang mentransformasikan instruksi tugas kuliah yang panjang, padat, dan abstrak menjadi urutan rencana aksi harian konkret, berbobot mikro, dan langsung dapat dieksekusi oleh mahasiswa.

Platform ini memecahkan sindrom psikologis **Task Paralysis** (kondisi di mana mahasiswa menunda pengerjaan bukan karena malas, melainkan akibat *cognitive overload* saat membaca silabus tugas tebal belasan halaman). KilasTugas memadukan mesin inferensi kecerdasan buatan (*9Router ag/gemini-3.7-flash-medium*), *Smart Caching* instan (<20ms), *Deterministic Fallback Engine* kurikulum, visualisasi *Micro-Pacing*, *Floating Pomodoro Focus Engine* persisten, integrasi kalender otomatis (Google Calendar & RFC 5545 iCalendar), serta fitur viral *Task Blueprint Sharing* (/p/:id).

**Filosofi Inti Produk:** *"Problem First, Technology Second: Jangan tanya 'kapan selesai', tanyakan 'apa aksi konkret yang dikerjakan hari ini'."*

---

## 2. Problem Statement & Background

### 2.1 Konteks Masalah
Mahasiswa aktif perguruan tinggi rata-rata menempuh 4 hingga 7 mata kuliah per semester dengan variasi beban penugasan: makalah riset, laporan praktikum, proyek pemrograman perangkat lunak, dan presentasi kelompok.

Sebagian besar tugas diserahkan dosen dalam silabus panjang 5–15 halaman tanpa struktur tahapan kerja. Hal ini memicu kebuntuan kognitif (*Task Paralysis / Overwhelm Freeze*). Mahasiswa terjebak dalam pertanyaan *"Mulai dari mana?"* yang memicu ilusi waktu luang semu hingga berujung pada sistem kebut semalam di malam H-1 deadline.

### 2.2 Gap Analisis Alat Produktivitas Eksisting
1. **Pasif & Deadline-Centric (Notion, Google Tasks, Todoist):** Hanya mencatat nama tugas dan tanggal tenggat, menyerahkan 100% beban perincian langkah kepada mahasiswa yang sedang kewalahan.
2. **Ketiadaan Pacing Harian:** Tidak ada instrumen yang menghitung ritme kerja harian aman berdasarkan selisih hari menuju tenggat waktu.
3. **Friksi Awal Terlalu Tinggi:** Aplikasi manajemen proyek formal (Trello, Jira, Asana) menuntut registrasi dan konfigurasi database yang melelahkan mahasiswa sebelum mulai bekerja.

### 2.3 Rumusan Masalah Formal
> *"Bagaimana merancang platform digital yang mampu mengeliminasi Task Paralysis pada mahasiswa dengan mengonversi instruksi tugas kuliah tebal menjadi rencana aksi harian mikro yang konkret, terdistribusi merata, serta terintegrasi langsung dengan timer eksekusi fokus dan sistem berbagi rencana kerja?"*

---

## 3. Validasi Masalah & Data Empiris

Validasi masalah KilasTugas mengadopsi triangulasi data:
1. **Kajian Literatur Akademis Internasional:**
   - *American Psychological Association (APA / Onwuegbuzie & Jiao, 2000):* Prokrastinasi akademik dialami 80%–95% mahasiswa perguruan tinggi.
   - *Journal of Educational Psychology:* Teknik pemecahan tugas bertahap (*Task Chunking*) meningkatkan rasio penyelesaian tugas hingga 60%.
   - *Stanford d.school Research:* Konsep *Micro-Commitment* (tindakan mikro 25–45 menit) mereduksi kecemasan tugas dan memicu *action momentum*.
2. **Survei Lapangan Kuantitatif (28 Mahasiswa Aktif Sains & Teknologi):**
   - **78,6%** mahasiswa sering mengerjakan tugas pada malam H-1 / H-0 deadline.
   - **64,3%** menunda tugas karena bingung mulai dari mana dan kewalahan membaca instruksi panjang.
   - **53,6%** pernah gagal mengumpulkan tugas tepat waktu minimal 1 kali per semester.
   - **57,1%** pengguna to-do list konvensional merasa alat mereka tidak efektif mendorong eksekusi.
3. **Wawancara Kualitatif Langsung:**
   - Mahasiswa Informatika Semester 5: *"Masalah utamanya bukan tidak mau mengerjakan, tapi pas buka modul 15 halaman langsung pusing. Andai ada yang kasih tahu 'Hari ini kamu cukup tulis pendahuluan 30 menit dulu', pasti langsung dikerjakan."*

---

## 4. Target Pengguna & Karakteristik

- **Target Primer:** Mahasiswa aktif D3/D4/S1 perguruan tinggi (usia 18–24 tahun) dengan beban praktikum dan proyek padat.
- **Target Sekunder:** Siswa SMA/SMK sederajat dan peserta program pelatihan intensif (*coding bootcamp*).
- **Karakteristik Akses:**
  - Mengutamakan akses instan peramban web ponsel pintar dan laptop.
  - Membutuhkan antarmuka yang ringan (<100KB gzip), hemat kuota, dan cepat.
  - Desain editorial terang (*clean light mode*) yang fokus pada keterbacaan teks tanpa gangguan elemen visual generik.

---

## 5. Spesifikasi Fitur Produk

### 5.1 Fitur Aktif MVP (Tahap 1: Online Round Submission — Selesai)

| ID Fitur | Nama Fitur | Deskripsi Teknis & Fungsionalitas | Status |
|:---|:---|:---|:---:|
| **F-01** | **Form Input Tugas Cerdas** | Input terpadu: Judul, Mata Kuliah, Tanggal & Jam Deadline, Kategori (Praktikum, Makalah, Coding, Presentasi, Custom), Deskripsi Instruksi, serta Selektor Langkah Kerja (Otomatis AI atau custom 3/4/5/6/8 langkah). | Selesai |
| **F-02** | **AI Task Decomposition** | Terhubung ke 9Router gateway port 20128 (`ag/gemini-3.7-flash-medium`). Menghasilkan JSON array sub-tugas terstruktur dengan kata kerja aktif, panduan 1–2 kalimat, estimasi 25–90 menit, dan distribusi hari merata. Respon < 2 detik. | Selesai |
| **F-03** | **Smart Caching Engine** | Jika instruksi atau judul tugas serupa pernah dipecahkan mahasiswa seangkatan, sistem menyajikan cetak biru instan dari MariaDB (<20ms, 0 konsumsi token AI). | Selesai |
| **F-04** | **Deterministic Fallback Engine** | Kurasi template lokal untuk 5 kategori tugas akademik. Menjamin zero downtime jika jaringan internet atau API AI mengalami gangguan. | Selesai |
| **F-05** | **Checklist Sub-Tugas Interaktif** | Kartu sub-tugas harian dengan checkbox bulat instan, tombol tambah langkah manual inline, tombol hapus langkah, dan modal inline edit teks/durasi. | Selesai |
| **F-06** | **Visual Micro-Pacing & Progress Ring** | Hero Circular Progress Gauge menghitung rasio penyelesaian riil. Kartu tugas dilengkapi badge dinamis: On Track (hijau), Behind Schedule (kuning), Overdue (merah). | Selesai |
| **F-07** | **Persistent Floating Pomodoro Engine** | Timer 25 menit kerja fokus / 5 menit istirahat berjalan di background dengan akurasi timestamp `Date.now()`. Dilengkapi Floating Mini-Timer pill melayang di bawah layar, countdown di judul tab browser, audio chime synthesizer Web Audio API, haptic feedback ponsel, dan Web Notification API desktop. | Selesai |
| **F-08** | **Integrasi Kalender Nyata** | Tombol ekspor berkas `.ics` standar RFC 5545 dengan alarm 15 menit, serta Direct Google Calendar web/app intent di ponsel pintar. | Selesai |
| **F-09** | **Task Blueprint Sharing (/p/:id)** | Fitur viral berbagi rencana tugas via URL unik `/p/:id`. Rekan sekelas dapat melihat pratinjau langkah dan mengimpor rencana tugas ke jadwal pribadi dalam 1 detik. | Selesai |
| **F-10** | **Zero-Barrier Guest Mode** | Akses instan tanpa kewajiban registrasi akun. Identitas dikelola via UUID anonim dengan sinkronisasi dual-layer antara browser `localStorage` dan MariaDB VPS. | Selesai |
| **F-11** | **Dopamine Feedback System** | Letupan konfeti visual (*canvas-confetti*) dan status otomatis `Ready to Submit 🎉` saat seluruh sub-tugas berhasil diselesaikan. | Selesai |

---

### 5.2 Fitur Pengembangan Grand Final (Tahap 2: Grand Final Product Sprint)

Fitur-fitur lanjutan ini dialokasikan untuk dikembangkan pada sesi Product Sprint Grand Final (11 Oktober 2026), mewakili sisa ~50% peta jalan inovasi:

| ID Fitur | Nama Fitur | Deskripsi Teknis & Mekanisme Kerja | Prioritas |
|:---|:---|:---|:---:|
| **GF-01** | **AI Syllabus & PDF/DOCX Reader** | Komponen unggah drag-and-drop berkas modul/silabus dosen (PDF/DOCX tebal 5–15 halaman). Parser backend membaca teks in-memory stream, mengekstrak rubrik penugasan, dan langsung membedahnya menjadi sub-tugas nir-ketik. | P1 |
| **GF-02** | **Collaborative Group Task Split** | Pembagian porsi kerja kelompok anti *free-rider*. Ketua memasukkan anggota dan peran (Analis, Programmer, Penulis Laporan). AI membagi porsi kerja secara proporsional dengan dasbor ketergantungan tugas (*task dependency*). | P1 |
| **GF-03** | **PWA Offline-First Mode** | Dukungan Progressive Web App (*Add to Home Screen*) dan IndexedDB lokal. Mahasiswa dapat membuka jadwal, mencentang tugas, dan menjalankan timer tanpa koneksi internet sama sekali, dengan sinkronisasi otomatis ke VPS saat online. | P2 |
| **GF-04** | **Always-On Focus Engine & Web Push** | Integrasi Server-Side Web Push Scheduler (VAPID Service Worker) di backend VPS. Server mengirim notifikasi tepat saat sesi fokus berakhir meskipun peramban web pengguna ditutup total. | P2 |
| **GF-05** | **Analitik Pomodoro ke Basis Data** | Pencatatan durasi riwayat fokus aktual ke tabel `pomodoro_sessions` di basis data MariaDB untuk evaluasi ritme produktivitas harian mahasiswa. | P3 |

---

## 6. Arsitektur Sistem & Ekosistem Teknologi

### 6.1 Topologi Sistem
```
┌────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (SPA)                   │
│      React 18 + Vite + Tailwind CSS + Lucide React     │
│      Hosted on Vercel Edge Global Content Delivery     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS REST API / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                  BACKEND ENGINE LAYER                  │
│       Python 3.12 + FastAPI Async Web Framework        │
│    Deployed on Ubuntu VPS via Nginx + Let's Encrypt    │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   AI INFERENCE ENGINE    │  │     PERSISTENCE DATA     │
│  9Router Proxy (v1 API)  │  │  MariaDB Enterprise RDBMS │
│  ag/gemini-3.7-flash-med │  │  (Tasks + Smart Cache)   │
└──────────────────────────┘  └──────────────────────────┘
```

### 6.2 Rincian Tech Stack
- **Frontend:** React 18, Vite 5, Tailwind CSS, Lucide React, Axios, Canvas Confetti. (Bundle size <90KB gzip, render instan).
- **Backend:** FastAPI (Python 3.12), Pydantic v2 validation, aiomysql async pool, Uvicorn ASGI server.
- **AI Gateway:** 9Router local reverse proxy port 20128 (`ag/gemini-3.7-flash-medium`), latensi respons <2 detik.
- **Database:** MariaDB 10.x Enterprise RDBMS dengan konfigurasi hemat memori `99-lowmem.cnf`.
- **Infrastruktur Produksi:**
  - Frontend: Vercel Edge Global Network (`https://kilastugas.vercel.app`).
  - Backend: Ubuntu VPS Host (IP 48.193.41.19), Nginx reverse proxy port 8001, SSL Let's Encrypt (`https://api-kilastugas.najmifaza.my.id`).

---

## 7. Skema Basis Data Relasional (MariaDB)

```sql
-- Tabel Sesi Pengguna Anonim
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Tugas Utama
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    category ENUM('lab', 'paper', 'coding', 'presentation', 'custom') DEFAULT 'custom',
    deadline DATETIME NOT NULL,
    description TEXT,
    source ENUM('ai', 'template', 'shared', 'manual') DEFAULT 'ai',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

-- Tabel Sub-Tugas Harian
CREATE TABLE IF NOT EXISTS subtasks (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    day_offset INT NOT NULL,
    guide TEXT,
    order_index INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Tabel Riwayat Sesi Fokus Pomodoro
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id VARCHAR(64) PRIMARY KEY,
    subtask_id VARCHAR(64) NOT NULL,
    duration INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE
);
```

---

## 8. Spesifikasi Antarmuka & Desain Sistem

### 8.1 Standar Desain Editorial Minimalis (Anti-Slop)
- **Skema Warna:** Bersih netral (*Light Mode Editorial*). Background putih/slate-50, teks Slate-900 kontras tinggi, aksen border Slate-200, dan status bar emerald/amber/rose.
- **Tanpa Bottom Dock:** Navigasi mobile menggunakan Floating Action Button (FAB `+`) hitam melingkar di pojok kanan bawah yang hemat ruang pandang.
- **Tipografi Rapi:** Inter / Segoe UI modern, bebas gradien artifisial ungu/pink klise AI marketing.

### 8.2 Layout Responsif
- **Ponsel Pintar (<768px):** Layar penuh tepi-ke-tepi (*edge-to-edge*), FAB `+` kanan bawah, Floating Mini-Timer melayang di bagian bawah dengan safe padding.
- **Tablet (768px–1024px):** Layout grid tugas 2-kolom seimbang dengan hero progress ring proporsional.
- **Desktop (>1024px):** Container terpusat max-w-6xl, tombol tambah tugas di navbar atas, dan modal fokus tengah layar.

---

## 9. Rencana Implementasi & Deliverables Lomba

### 9.1 Status Deliverables Online Round (Batas Akhir: 8 Oktober 2026 23.59 WIB)
1. **Proposal Ringkas (PDF):** `docs/TimKilasTugas_KilasTugas_ProposalRingkas.pdf` (Tepat 7 halaman: 1 cover + 6 halaman isi sesuai Bab 7.2 Guidebook).
2. **Repositori GitHub Publik:** `https://github.com/najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1` (Akses publik juri).
3. **Video Walkthrough Demo Produk:** Berkas `TimKilasTugas_KilasTugas_VideoDemo.mp4` dirender berbasis Remotion dengan naskah terstruktur di `docs/SCRIPT_VIDEO_DEMO.md` (durasi ~5 menit 45 detik, di bawah batas maksimal 10 menit).
4. **Live Deployment:** Frontend aktif di Vercel dan backend aktif di VPS Ubuntu dengan sertifikat SSL resmi.

### 9.2 Timeline Grand Final (11 Oktober 2026)
- **09.00–12.00 WIB (Product Sprint Sesi I):** Implementasi modul ekstraksi modul silabus PDF/DOCX (GF-01) dan Collaborative Task Split (GF-02).
- **13.00–15.00 WIB (Product Sprint Sesi II):** Penerapan offline-first PWA (GF-03) dan penyempurnaan analitik Pomodoro ke MariaDB (GF-05).
- **15.45–18.00 WIB (Demo Day & Product Defense):** Walkthrough langsung solusi end-to-end dan pemaparan pitch deck 10 slide di hadapan dewan juri Zoom.

---

*Dokumen ini merupakan spesifikasi kebutuhan produk resmi yang menjadi acuan integrasi teknis, evaluasi desain, dan penilaian dewan juri SIFest Digital Innovation Challenge 2026.*
