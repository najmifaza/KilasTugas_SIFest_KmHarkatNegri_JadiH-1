# 📄 Product Requirement Document (PRD)
## KilasTugas — Smart Actionable Task Breakdown & Micro-Pacing for Students

---

> **Versi:** 1.0.0  
> **Dibuat oleh:** Najmi Faza  
> **Tanggal:** 1 Oktober 2026  
> **Kompetisi:** SIFest Digital Innovation Challenge 2026 — Track: Education  
> **Deadline Submission:** 5 Oktober 2026, 23.59 WIB  

---

## 📋 Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Problem Validation](#3-problem-validation)
4. [Target Pengguna & Persona](#4-target-pengguna--persona)
5. [Solusi & Value Proposition](#5-solusi--value-proposition)
6. [Fitur Produk](#6-fitur-produk)
7. [User Flow](#7-user-flow)
8. [Arsitektur Sistem](#8-arsitektur-sistem)
9. [Tech Stack](#9-tech-stack)
10. [Skema Database](#10-skema-database)
11. [API Specification](#11-api-specification)
12. [AI Integration (9Router)](#12-ai-integration-9router)
13. [UI/UX Guidelines](#13-uiux-guidelines)
14. [Kriteria Penilaian & Mapping Fitur](#14-kriteria-penilaian--mapping-fitur)
15. [Timeline Pengerjaan](#15-timeline-pengerjaan)
16. [Deliverables Submission](#16-deliverables-submission)
17. [Risiko & Mitigasi](#17-risiko--mitigasi)
18. [Glosarium](#18-glosarium)

---

## 1. Executive Summary

**KilasTugas** adalah web aplikasi berbasis AI yang membantu mahasiswa dan pelajar mengubah instruksi tugas kuliah yang panjang dan kompleks menjadi sub-tugas harian yang konkret, terukur, dan langsung dapat dieksekusi.

Produk ini menjawab masalah *Task Paralysis* — kondisi di mana mahasiswa menunda mengerjakan tugas bukan karena malas, melainkan karena kewalahan (*overwhelmed*) oleh beban tugas yang tidak terstruktur. Dengan memanfaatkan AI (via 9Router di VPS lokal) dan database MySQL (MariaDB), KilasTugas menghasilkan rencana kerja per hari yang dipersonalisasi, dilengkapi dengan timer fokus Pomodoro dan visual progress pacing.

**Filosofi produk:** *"Jangan tanya 'kapan selesai' — tanya 'apa yang dikerjakan hari ini'."*

---

## 2. Problem Statement

### 2.1 Latar Belakang

Mahasiswa rata-rata menghadapi 4–7 mata kuliah per semester dengan tugas yang beragam bentuknya: makalah teori, laporan praktikum, projek kelompok coding, presentasi jurnal, hingga kuis mingguan. Ketika beban tugas menumpuk, terjadi fenomena yang dikenal dalam psikologi sebagai **Task Paralysis** atau **Overwhelm Freeze** — individu justru tidak mengerjakan apa pun karena tidak tahu harus mulai dari mana.

### 2.2 Masalah Spesifik

| No | Masalah | Dampak |
|----|---------|--------|
| 1 | Tugas yang diberikan dosen sering berupa instruksi panjang tanpa breakdown langkah. | Mahasiswa tidak tahu harus mulai dari mana. |
| 2 | To-do list konvensional (Notion, Google Keep) hanya mencatat nama tugas & deadline, bukan cara mengerjakannya. | Task tetap menumpuk, tidak ada eksekusi nyata. |
| 3 | Prokrastinasi H-1 / H-0 menjadi budaya umum di kalangan mahasiswa. | Kualitas hasil tugas menurun drastis. |
| 4 | Tidak ada alat yang secara aktif memandu *pace* pengerjaan sesuai sisa hari menuju deadline. | Mahasiswa sadar terlambat saat deadline sudah dekat. |

### 2.3 Problem Statement Formal

> *"Mahasiswa membutuhkan alat yang dapat mengubah instruksi tugas kuliah menjadi rencana aksi harian yang konkret dan adaptif, sehingga mereka dapat memulai dan menyelesaikan tugas secara konsisten tanpa prokrastinasi."*

---

## 3. Problem Validation

### 3.1 Data Survei (Target: 25–30 Responden Mahasiswa)

Survei dilakukan via Google Form kepada mahasiswa aktif dengan pertanyaan:

| Pertanyaan | Temuan Target |
|------------|--------------|
| Seberapa sering kamu mengerjakan tugas H-1 atau H-0 deadline? | >75% menjawab "Sering / Selalu" |
| Apa alasan utama menunda tugas? | >60% menjawab "Bingung mulai dari mana / kewalahan" |
| Apakah kamu pernah gagal mengumpulkan tugas tepat waktu? | >50% menjawab "Ya, setidaknya sekali per semester" |
| Apakah kamu menggunakan to-do list? Apakah efektif? | >65% menggunakan, namun >55% merasa tidak efektif jangka panjang |

### 3.2 Referensi Akademis & Data Eksternal

- **American Psychological Association (APA):** Prokrastinasi akademik dialami oleh 80–95% mahasiswa, dengan 50% menganggap hal ini sebagai masalah serius *(Onwuegbuzie & Jiao, 2000)*.
- **Journal of Educational Psychology:** Teknik pemecahan tugas (*task chunking*) meningkatkan tingkat penyelesaian tugas hingga 60% dibandingkan dengan metode to-do list konvensional.
- **Stanford d.school Research:** Pendekatan *micro-commitment* (komitmen terhadap aksi kecil) terbukti secara signifikan mengurangi anxiety task dan meningkatkan output produktivitas.

### 3.3 Validasi Lapangan

- Wawancara ringan dengan 5–10 mahasiswa di lingkungan Unsoed Purwokerto (jurusan Informatika/SI).
- Observasi kebiasaan pengerjaan tugas di grup WhatsApp angkatan (tugas dikumpulkan mepet deadline, pertanyaan mendadak di malam hari sebelum deadline).

---

## 4. Target Pengguna & Persona

### 4.1 Target Demografis

- **Usia:** 17–25 tahun
- **Status:** Pelajar SMA/SMK, Mahasiswa D3/D4/S1 aktif, Fresh Graduate
- **Lokasi:** Seluruh Indonesia (khususnya daerah dengan akses internet terbatas)
- **Device:** Mobile-first (smartphone Android/iOS) + Desktop browser

### 4.2 User Persona

---

**🧑‍💻 Persona 1: Reza — Mahasiswa Informatika Semester 5**

- **Latar belakang:** Reza adalah mahasiswa aktif dengan 6 mata kuliah + 2 praktikum. Aktif di organisasi kampus sehingga waktu belajar tidak terstruktur.
- **Masalah utama:** Selalu mengerjakan laporan praktikum H-1 karena bingung harus mulai dari bagian mana. Pernah tidak mengumpulkan tugas karena lupa ada deadline.
- **Kebutuhan:** Alat yang bisa otomatis memecah tugas besar menjadi to-do list kecil yang bisa dikerjakan 30–45 menit per hari.
- **Kutipan:** *"Bukan males ngerjain, tapi bingung mau mulai dari mana dulu."*

---

**👩‍🏫 Persona 2: Siti — Siswi SMA Kelas 12 di Daerah Pinggiran**

- **Latar belakang:** Siti bersekolah di SMA yang jauh dari kota. Akses internet terbatas (kuota pas-pasan), tidak memiliki bimbingan belajar.
- **Masalah utama:** Kesulitan menyelesaikan tugas mandiri dari guru karena instruksi tidak jelas dan tidak ada yang membimbing langkah per langkah.
- **Kebutuhan:** Aplikasi ringan yang bisa memandu belajar mandiri tanpa internet stabil.
- **Kutipan:** *"Kalau bisa ada yang kasih tahu harus ngapain dulu, baru ngapain, pasti lebih gampang."*

---

## 5. Solusi & Value Proposition

### 5.1 Solusi Inti

KilasTugas memecah tugas besar menjadi sub-tugas harian menggunakan AI, lalu memandu eksekusi melalui:
1. **Checklist interaktif** dengan target tanggal per sub-tugas.
2. **Focus Mode (Pomodoro Timer)** terintegrasi pada setiap sub-tugas.
3. **Visual Pacing Bar** yang menampilkan status *On Track*, *Behind Schedule*, atau *Ready to Submit*.

### 5.2 Value Proposition

| Nilai | Deskripsi |
|-------|-----------|
| ⚡ Instan | Input tugas → sub-tugas siap dalam < 3 detik via AI. |
| 🎯 Konkret | Sub-tugas bukan sekedar label, tapi aksi spesifik yang bisa langsung dikerjakan. |
| 📅 Adaptif | Jadwal sub-tugas disesuaikan otomatis berdasarkan jarak ke deadline. |
| 🔒 Privasi | Tidak perlu daftar/login untuk mulai (Guest Mode berbasis localStorage). |
| 📴 Ringan | Berjalan di browser, tidak perlu install, bisa diakses dari HP murah sekalipun. |

### 5.3 Diferensiasi dari Kompetitor

| Fitur | KilasTugas | Notion | Todoist | Google Tasks |
|-------|:----------:|:------:|:-------:|:------------:|
| AI Task Breakdown | ✅ | ❌ | ❌ (fitur terbatas) | ❌ |
| Pomodoro Timer Terintegrasi | ✅ | ❌ | ❌ | ❌ |
| Template Khusus Tugas Kuliah | ✅ | Manual | ❌ | ❌ |
| Visual Pacing (On Track?) | ✅ | ❌ | Sebagian | ❌ |
| Guest Mode (Tanpa Daftar) | ✅ | ❌ | ❌ | ❌ |
| Mobile Responsive | ✅ | ✅ | ✅ | ✅ |

---

## 6. Fitur Produk

### 6.1 Scope MVP (Target Selesai: 5 Oktober 2026)

#### F-01: Halaman Input Tugas
- Form input: Judul Tugas, Deskripsi/Instruksi Dosen, Mata Kuliah, Tanggal Deadline.
- Pilihan Kategori Template: `Laporan Lab`, `Makalah Teori`, `Projek Coding`, `Presentasi`, `Custom AI`.
- Tombol **"Pecah Tugasku"** → trigger API AI breakdown.

#### F-02: Magic Task Breakdown (AI)
- Request ke backend → 9Router (`ag/gemini-3.7-flash-medium`) → parse JSON.
- Output: 4–6 sub-tugas dengan judul, deskripsi aksi spesifik, estimasi durasi (menit), dan target hari.
- Fallback: Jika AI gagal, gunakan template preset berdasarkan kategori.

#### F-03: Checklist Interaktif Sub-Tugas
- Tampil sebagai kartu (card) berurutan per hari.
- Edit teks sub-tugas secara inline (double-click to edit).
- Tandai selesai (checkbox) → kartu berubah warna + progress bar update.
- Hapus / tambah sub-tugas manual.

#### F-04: Focus Mode (Pomodoro Timer)
- Tombol **"Mulai Kerjakan"** pada setiap sub-tugas → masuk Focus Mode.
- Timer Pomodoro: 25 menit fokus → 5 menit istirahat (loop otomatis).
- Notifikasi browser saat sesi selesai.
- Sub-tugas aktif ditampilkan full-screen agar tidak distraksi.

#### F-05: Visual Pacing Dashboard
- Progress bar persentase penyelesaian keseluruhan.
- Status indicator:
  - 🟢 **On Track** — sesuai jadwal atau lebih cepat.
  - 🟡 **Behind Schedule** — tertinggal dari jadwal ideal.
  - 🔴 **Overdue Alert** — deadline sudah lewat, ada sub-tugas belum selesai.
- Countdown timer ke deadline (hari, jam, menit).

#### F-06: Persistensi Data (Guest Mode)
- Semua data disimpan di **localStorage** browser → tidak hilang saat refresh.
- Data juga disimpan di **MariaDB VPS** via REST API (endpoint POST `/api/tasks`).
- Session berbasis UUID anonim (tidak perlu login).

#### F-07: Template Preset (Fallback Non-AI)
- 4 template bawaan: Laporan Lab, Makalah Teori, Projek Coding, Presentasi.
- Tiap template punya struktur sub-tugas default yang sudah terbukti logis.
- User bisa edit template setelah dipilih.

---

### 6.2 Scope Grand Final (Target: 11 Oktober 2026, Jika Lolos Top 3)

#### F-08: Akun & Autentikasi
- Login via Google OAuth (Supabase Auth / NextAuth.js).
- Data task tersimpan per akun, bisa diakses dari berbagai device.

#### F-09: Export ke Google Calendar
- Sub-tugas diekspor sebagai event `.ics` / langsung ke Google Calendar via API.
- Tiap sub-tugas jadi satu event dengan alarm 30 menit sebelumnya.

#### F-10: Tugas Kelompok (Collaborative Task Split)
- Invite anggota tim via link/email.
- Pembagian porsi sub-tugas per anggota.
- Real-time progress update anggota (via WebSocket / polling).

#### F-11: Analitik Produktivitas Pribadi
- Grafik riwayat penyelesaian tugas per minggu/bulan.
- Rata-rata waktu eksekusi per kategori tugas.
- Mata kuliah dengan tingkat prokrastinasi tertinggi.

---

## 7. User Flow

### 7.1 Flow Utama (Happy Path — Guest User)

```
[Buka kilastugas.vercel.app]
        │
        ▼
[Halaman Beranda / Landing]
  → CTA: "Mulai Pecah Tugasmu Sekarang"
        │
        ▼
[Form Input Tugas]
  → Isi: Judul, Deskripsi, Mata Kuliah, Deadline
  → Pilih Kategori (atau "Analisis Otomatis oleh AI")
  → Klik "Pecah Tugasku"
        │
        ▼
[Loading State — 2–3 detik]
  → AI memproses breakdown via 9Router
        │
        ▼
[Halaman Hasil Breakdown]
  → Tampil kartu sub-tugas berurutan
  → Setiap kartu berisi: Judul, Deskripsi Aksi, Estimasi Durasi, Target Hari
  → Progress bar awal: 0%
        │
        ▼
[User memilih sub-tugas pertama]
  → Klik "Mulai Kerjakan"
        │
        ▼
[Focus Mode — Pomodoro Timer aktif]
  → Timer 25 menit berjalan
  → Sub-tugas ditampilkan fullscreen
  → Setelah timer → notifikasi "Istirahat 5 menit"
        │
        ▼
[User kembali ke Dashboard]
  → Tandai sub-tugas selesai (✅)
  → Progress bar naik (misal: 17%)
  → Status: "On Track 🟢"
        │
        ▼
[Ulangi sampai semua sub-tugas selesai]
  → Progress bar 100%
  → Status: "Ready to Submit 🎉"
```

### 7.2 Flow Fallback (AI Gagal)

```
[AI Request Timeout / Error]
        │
        ▼
[Toast Notification: "AI sedang sibuk, menggunakan template otomatis"]
        │
        ▼
[Sistem memilih template preset berdasarkan kategori yang dipilih user]
        │
        ▼
[Halaman Hasil Breakdown — dari Template]
  → Alur sama seperti happy path
```

---

## 8. Arsitektur Sistem

### 8.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                  │
│          React + Vite — Vercel (Static SPA)         │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │   Input  │   │Dashboard │   │  Focus Mode    │  │
│  │  Form    │   │Checklist │   │  Pomodoro UI   │  │
│  └────┬─────┘   └────┬─────┘   └────────────────┘  │
└───────┼──────────────┼─────────────────────────────┘
        │ HTTP REST (Axios)
        ▼
┌──────────────────────────────────────────────────────┐
│         BACKEND (FastAPI + Python 3.12)              │
│   Port 8001 — VPS via Cloudflare Tunnel              │
│   https://api-kilastugas.domain.com                  │
│                                                     │
│  ┌─────────────────┐   ┌────────────────────────┐   │
│  │ POST /breakdown │   │ GET/POST/PATCH /tasks   │   │
│  │ (AI Controller) │   │ (Task CRUD Controller)  │   │
│  └───────┬─────────┘   └──────────┬─────────────┘   │
│          │  Auto Swagger UI /docs  │                  │
└──────────┼────────────────────────┼─────────────────┘
           │                        │
           ▼                        ▼
┌────────────────────┐   ┌─────────────────────────┐
│  9Router Proxy     │   │     MariaDB              │
│  localhost:20128   │   │     localhost:3306       │
│  (AI Inference)    │   │     kilastugas_db        │
│                    │   │                          │
│  Model:            │   │  ┌─────────────────┐    │
│  ag/gemini-3.7-    │   │  │ tasks           │    │
│  flash-medium      │   │  │ subtasks        │    │
│                    │   │  │ sessions        │    │
└────────────────────┘   │  └─────────────────┘    │
                         └─────────────────────────┘
```

### 8.2 Deployment Strategy

| Environment | Frontend | Backend | Database | AI |
|-------------|----------|---------|----------|----|
| **Development** | `localhost:5173` (Vite) | `localhost:8001` (Uvicorn) | MariaDB VPS | 9Router Port 20128 |
| **Production** | Vercel (Static SPA) | VPS Port 8001 + Cloudflare Tunnel | MariaDB VPS | 9Router Port 20128 |

---

## 9. Tech Stack

### 9.1 Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **React** | 18+ | UI Library |
| **Vite** | 5.x | Build tool & Dev Server (lebih ringan dari Next.js untuk SPA) |
| **Tailwind CSS** | 3.x | Utility-first Styling |
| **shadcn/ui** | Latest | Komponen UI siap pakai (Button, Card, Progress, Dialog) |
| **Lucide React** | Latest | Icon Library |
| **Zustand** | 4.x | State Management ringan |
| **Axios** | Latest | HTTP Client ke Backend API |

### 9.2 Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Python** | 3.12 (sudah di VPS) | Runtime Backend |
| **FastAPI** | 0.111+ | HTTP Framework async, auto Swagger UI di `/docs` |
| **Uvicorn** | Latest | ASGI Server untuk menjalankan FastAPI |
| **aiomysql** | Latest | Driver MariaDB async untuk Python |
| **openai** | Latest | OpenAI-compatible SDK untuk panggil 9Router |
| **pydantic** | v2 (bawaan FastAPI) | Validasi request/response otomatis |
| **python-dotenv** | Latest | Environment Variable Management |
| **uuid** | stdlib | Generate UUID untuk ID task/session |

### 9.3 Database

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **MariaDB** | 10.x (sudah aktif di VPS) | Database Relasional |

### 9.4 AI & Infrastruktur

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **9Router** | Running (Port 20128) | Proxy AI multi-provider sudah aktif di VPS |
| **Cloudflare Tunnel** | `cloudflared` | Ekspos backend FastAPI VPS ke publik tanpa buka port firewall |
| **Vercel** | Free Tier | Hosting frontend React + Vite (static SPA) |

---

## 10. Skema Database

### 10.1 Setup Database

```sql
-- Buat database
CREATE DATABASE IF NOT EXISTS kilastugas_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE kilastugas_db;

-- Buat user khusus
CREATE USER IF NOT EXISTS 'kilas_user'@'localhost' IDENTIFIED BY 'KilasPass2026!';
GRANT ALL PRIVILEGES ON kilastugas_db.* TO 'kilas_user'@'localhost';
FLUSH PRIVILEGES;
```

### 10.2 Tabel `sessions`

```sql
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,                    -- UUID anonim (Guest Mode)
    user_agent VARCHAR(512),                       -- Browser info
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 10.3 Tabel `tasks`

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY,                    -- UUID
    session_id VARCHAR(36) NOT NULL,               -- FK ke sessions
    title VARCHAR(255) NOT NULL,                   -- Judul tugas kuliah
    description TEXT,                              -- Instruksi dosen / deskripsi lengkap
    subject VARCHAR(100),                          -- Nama mata kuliah
    category ENUM(
        'laporan_lab',
        'makalah',
        'coding',
        'presentasi',
        'custom'
    ) DEFAULT 'custom',
    deadline DATETIME NOT NULL,                    -- Batas waktu pengumpulan
    is_completed BOOLEAN DEFAULT FALSE,            -- Status selesai keseluruhan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_deadline (deadline)
);
```

### 10.4 Tabel `subtasks`

```sql
CREATE TABLE IF NOT EXISTS subtasks (
    id VARCHAR(36) PRIMARY KEY,                    -- UUID
    task_id VARCHAR(36) NOT NULL,                  -- FK ke tasks
    step_number INT NOT NULL,                      -- Urutan langkah (1, 2, 3, ...)
    title VARCHAR(255) NOT NULL,                   -- Judul sub-tugas singkat
    description TEXT,                              -- Deskripsi aksi spesifik
    duration_minutes INT DEFAULT 25,               -- Estimasi waktu pengerjaan (menit)
    target_date DATE,                              -- Target tanggal dikerjakan
    is_completed BOOLEAN DEFAULT FALSE,            -- Status selesai sub-tugas ini
    completed_at TIMESTAMP NULL,                   -- Waktu selesai (untuk analitik)
    source ENUM('ai', 'template', 'manual')        -- Sumber sub-tugas
        DEFAULT 'ai',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task_id (task_id),
    INDEX idx_target_date (target_date)
);
```

### 10.5 Tabel `pomodoro_sessions` (Opsional, untuk Analitik)

```sql
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id VARCHAR(36) PRIMARY KEY,
    subtask_id VARCHAR(36) NOT NULL,               -- FK ke subtasks
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    duration_actual_minutes INT,                   -- Durasi aktual (bisa berbeda dari estimasi)
    is_completed BOOLEAN DEFAULT FALSE,            -- Selesai full 25 menit atau dipotong?
    FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE
);
```

### 10.6 Entity Relationship Diagram (ERD)

```
sessions (id PK)
    │
    │ 1:N
    ▼
tasks (id PK, session_id FK)
    │
    │ 1:N
    ▼
subtasks (id PK, task_id FK)
    │
    │ 1:N
    ▼
pomodoro_sessions (id PK, subtask_id FK)
```

---

## 11. API Specification

**Base URL (Development):** `http://localhost:3001/api`  
**Base URL (Production):** `https://api-kilastugas.yourdomain.com/api`

### 11.1 Session

#### `POST /api/session`
Membuat sesi anonim baru untuk Guest Mode.

**Request Body:**
```json
{
  "user_agent": "Mozilla/5.0..."
}
```

**Response 201:**
```json
{
  "success": true,
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 11.2 Tasks

#### `POST /api/tasks`
Membuat tugas baru dan menyimpan ke database.

**Request Body:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Laporan Praktikum Jaringan Komputer",
  "description": "Buat laporan praktikum subnetting VLSM dengan studi kasus kantor 3 divisi. Format: BAB I Pendahuluan, BAB II Dasar Teori, BAB III Langkah Percobaan, BAB IV Analisis, BAB V Kesimpulan. Deadline: 5 Oktober 2026.",
  "subject": "Jaringan Komputer",
  "category": "laporan_lab",
  "deadline": "2026-10-05T23:59:00"
}
```

**Response 201:**
```json
{
  "success": true,
  "task_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

#### `GET /api/tasks/:session_id`
Ambil semua tugas dalam satu sesi.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-...",
      "title": "Laporan Praktikum Jaringan Komputer",
      "subject": "Jaringan Komputer",
      "deadline": "2026-10-05T23:59:00",
      "is_completed": false,
      "progress_percent": 33,
      "subtasks_total": 6,
      "subtasks_done": 2
    }
  ]
}
```

---

#### `PATCH /api/tasks/:task_id`
Update status selesai tugas.

**Request Body:**
```json
{
  "is_completed": true
}
```

---

#### `DELETE /api/tasks/:task_id`
Hapus tugas beserta seluruh sub-tugasnya.

---

### 11.3 Subtasks

#### `GET /api/tasks/:task_id/subtasks`
Ambil seluruh sub-tugas dari satu tugas.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc12345-...",
      "step_number": 1,
      "title": "Studi Dasar Teori VLSM",
      "description": "Baca materi subnetting VLSM di buku/modul praktikum. Catat rumus dan contoh perhitungan dasar.",
      "duration_minutes": 45,
      "target_date": "2026-10-03",
      "is_completed": false,
      "source": "ai"
    },
    {
      "id": "def67890-...",
      "step_number": 2,
      "title": "Kerjakan Perhitungan Subnetting Studi Kasus",
      "description": "Hitung subnet untuk 3 divisi sesuai instruksi dosen. Tulis hasil dalam tabel IP Address.",
      "duration_minutes": 60,
      "target_date": "2026-10-03",
      "is_completed": false,
      "source": "ai"
    }
  ]
}
```

---

#### `PATCH /api/subtasks/:subtask_id`
Update status selesai sub-tugas atau edit teks.

**Request Body:**
```json
{
  "is_completed": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Subtask updated"
}
```

---

### 11.4 AI Breakdown

#### `POST /api/breakdown`
Trigger AI untuk memecah tugas menjadi sub-tugas. Menyimpan hasil ke tabel `subtasks`.

**Request Body:**
```json
{
  "task_id": "123e4567-...",
  "title": "Laporan Praktikum Jaringan Komputer",
  "description": "Buat laporan praktikum subnetting VLSM...",
  "category": "laporan_lab",
  "deadline": "2026-10-05T23:59:00"
}
```

**Response 200:**
```json
{
  "success": true,
  "source": "ai",
  "data": [
    {
      "step": 1,
      "title": "Studi Dasar Teori VLSM",
      "description": "Baca materi subnetting VLSM di buku/modul. Catat rumus dan contoh perhitungan.",
      "duration_minutes": 45,
      "target_day_offset": 0
    },
    {
      "step": 2,
      "title": "Kerjakan Perhitungan Subnetting Studi Kasus",
      "description": "Hitung subnet untuk 3 divisi sesuai instruksi. Tulis hasil dalam tabel IP Address.",
      "duration_minutes": 60,
      "target_day_offset": 0
    },
    {
      "step": 3,
      "title": "Tulis BAB I & BAB II",
      "description": "Susun Pendahuluan (latar belakang, tujuan, manfaat) dan Dasar Teori (VLSM, subnetting, IP addressing).",
      "duration_minutes": 90,
      "target_day_offset": 1
    },
    {
      "step": 4,
      "title": "Tulis BAB III: Langkah Percobaan",
      "description": "Dokumentasikan langkah simulasi di Cisco Packet Tracer beserta screenshot konfigurasi.",
      "duration_minutes": 75,
      "target_day_offset": 1
    },
    {
      "step": 5,
      "title": "Tulis BAB IV & BAB V",
      "description": "Analisis hasil percobaan dan kaitkan dengan teori. Tulis kesimpulan singkat 3–5 poin.",
      "duration_minutes": 60,
      "target_day_offset": 2
    },
    {
      "step": 6,
      "title": "Review, Format & Submit",
      "description": "Cek format penulisan (font, margin, daftar pustaka). Konversi ke PDF dan upload ke eLDirU.",
      "duration_minutes": 30,
      "target_day_offset": 2
    }
  ]
}
```

**Response 200 (Fallback Template):**
```json
{
  "success": true,
  "source": "template",
  "message": "AI tidak tersedia. Menggunakan template laporan_lab.",
  "data": [ ... ]
}
```

---

## 12. AI Integration (9Router)

### 12.1 Konfigurasi Koneksi

```python
# config/ai.py
from openai import AsyncOpenAI
import os

ai_client = AsyncOpenAI(
    base_url=os.getenv("NINE_ROUTER_URL", "http://127.0.0.1:20128/v1"),
    api_key=os.getenv("NINE_ROUTER_KEY", "not-needed-localhost"),
    timeout=15.0,
)

AI_MODEL = os.getenv("AI_MODEL", "ag/gemini-3.7-flash-medium")
```

### 12.2 System Prompt

```
Kamu adalah asisten perencana belajar mahasiswa Indonesia yang sangat memahami pola pengerjaan tugas kuliah.

Tugasmu HANYA satu: memecah instruksi tugas kuliah yang diberikan menjadi 4–6 sub-tugas harian yang:
1. Konkret dan spesifik (bukan sekadar label seperti "kerjakan tugas")
2. Berurutan secara logis (setiap sub-tugas adalah prasyarat sub-tugas berikutnya)
3. Realistis dalam estimasi waktu (25–120 menit per sub-tugas)
4. Berbahasa Indonesia yang santun dan mudah dipahami

Keluarkan output HANYA berupa JSON array murni tanpa teks tambahan apapun, tanpa markdown, tanpa backtick.
Format output:
[
  {
    "step": 1,
    "title": "Judul sub-tugas singkat (max 60 karakter)",
    "description": "Deskripsi aksi konkret yang harus dilakukan (1–3 kalimat)",
    "duration_minutes": 45,
    "target_day_offset": 0
  }
]

"target_day_offset" adalah berapa hari dari hari ini sub-tugas ini idealnya dikerjakan (0 = hari ini, 1 = besok, dst), distribusikan secara merata berdasarkan sisa hari menuju deadline.
```

### 12.3 Controller Breakdown

```python
# routers/breakdown.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import json

from config.ai import ai_client, AI_MODEL
from config.db import get_db
from templates import get_template_by_category

router = APIRouter()

SYSTEM_PROMPT = "..." # prompt di atas

class BreakdownRequest(BaseModel):
    task_id: str
    title: str
    description: str
    category: str
    deadline: datetime

@router.post("/api/breakdown")
async def breakdown(req: BreakdownRequest):
    days_left = (req.deadline - datetime.now()).days + 1

    user_prompt = f"""
Judul Tugas: {req.title}
Kategori: {req.category}
Instruksi/Deskripsi: {req.description}
Sisa Hari Menuju Deadline: {days_left} hari
Tanggal Deadline: {req.deadline.strftime('%A, %d %B %Y')}
    """.strip()

    source = "ai"
    subtasks = []

    try:
        response = await ai_client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=1500,
        )
        raw = response.choices[0].message.content.strip()
        subtasks = json.loads(raw)

        if not isinstance(subtasks, list) or len(subtasks) == 0:
            raise ValueError("Invalid AI response format")

    except Exception:
        # Fallback ke template
        source = "template"
        subtasks = get_template_by_category(req.category, days_left)

    # Simpan ke MariaDB
    async with get_db() as db:
        for s in subtasks:
            await db.execute(
                """INSERT INTO subtasks (id, task_id, step_number, title, description,
                   duration_minutes, target_date, source)
                   VALUES (UUID(), %s, %s, %s, %s, %s,
                   DATE_ADD(CURDATE(), INTERVAL %s DAY), %s)""",
                (req.task_id, s["step"], s["title"], s["description"],
                 s["duration_minutes"], s["target_day_offset"], source)
            )

    return {"success": True, "source": source, "data": subtasks}
```

---

## 13. UI/UX Guidelines

### 13.1 Prinsip Desain

- **Mobile-First:** Prioritas tampilan pada layar 360px–430px (Android/iPhone).
- **Minimal Cognitive Load:** Satu layar = satu aksi utama.
- **Dark Mode Default:** Mengurangi kelelahan mata saat digunakan malam hari (jam belajar mahasiswa).
- **Micro-animations:** Checklist yang ditandai selesai memberikan animasi checkmark + konfetti kecil untuk memberikan *dopamine feedback*.

### 13.2 Color Palette

| Token | Warna | Hex | Kegunaan |
|-------|-------|-----|----------|
| `primary` | Indigo | `#6366F1` | CTA Button, Highlight |
| `success` | Emerald | `#10B981` | Status On Track, Completed |
| `warning` | Amber | `#F59E0B` | Status Behind Schedule |
| `danger` | Rose | `#F43F5E` | Status Overdue, Delete |
| `surface` | Zinc 900 | `#18181B` | Background Utama |
| `card` | Zinc 800 | `#27272A` | Background Kartu |
| `text` | Zinc 100 | `#F4F4F5` | Teks Utama |
| `muted` | Zinc 400 | `#A1A1AA` | Teks Sekunder |

### 13.3 Komponen Utama

```
┌──────────────────────────────────────┐
│  🎯 Laporan Praktikum Jarkom         │  ← Task Card Header
│  Jaringan Komputer  •  5 Okt, 23:59  │
│                                       │
│  ████████████░░░░░░░░  40%           │  ← Progress Bar
│  🟡 Behind Schedule • 2 hari lagi    │  ← Status Indicator
│                                       │
│  ✅ Studi Dasar Teori VLSM    45 min │  ← Subtask (Done)
│  ⬜ Kerjakan Perhitungan      60 min │  ← Subtask (Active)
│  ⬜ Tulis BAB I & II          90 min │  ← Subtask (Upcoming)
│                                       │
│  [ ▶ Mulai Kerjakan ]                │  ← CTA Button
└──────────────────────────────────────┘
```

---

## 14. Kriteria Penilaian & Mapping Fitur

| Kriteria Juri | Bobot | Dibuktikan Oleh |
|---------------|:-----:|-----------------|
| **Solution & Innovation** | 30% | AI Task Breakdown yang unik (belum ada di market lokal), kombinasi AI + Pomodoro + Pacing dalam satu alat. |
| **Problem Identification** | 25% | Proposal Ringkas: data survei mahasiswa, fenomena Task Paralysis, gap analisis vs to-do list konvensional. |
| **Problem Validation** | 15% | Data survei Google Form, referensi jurnal APA & Stanford, wawancara lapangan mahasiswa Unsoed. |
| **User Experience** | 10% | Dark mode, mobile responsive, Guest Mode (tanpa daftar), animasi feedback, alur 3 klik. |
| **Technical Implementation** | 10% | MVP berjalan stabil di Vercel, backend Node.js aktif di VPS, MariaDB tersimpan dengan benar, koneksi 9Router. |
| **Presentation & Demo** | 10% | Video Demo 5–8 menit: narasi masalah jelas, walkthrough fitur lengkap, demo AI breakdown secara real-time. |

---

## 15. Timeline Pengerjaan

### Sprint Plan (1–5 Oktober 2026)

| Hari | Tanggal | Task | PIC | Target Selesai |
|------|---------|------|-----|----------------|
| **Hari 1** | Rabu, 1 Okt | Setup repo GitHub, inisialisasi React + Vite + Tailwind + shadcn/ui | Dev | EOD |
| **Hari 1** | Rabu, 1 Okt | Setup database MariaDB (buat schema SQL) | Dev | EOD |
| **Hari 1** | Rabu, 1 Okt | Setup backend FastAPI + koneksi MariaDB + uvicorn | Dev | EOD |
| **Hari 2** | Kamis, 2 Okt | Implementasi UI: Halaman Input Tugas (F-01) | Dev | EOD |
| **Hari 2** | Kamis, 2 Okt | Implementasi AI Breakdown Controller (F-02) + test via Postman | Dev | EOD |
| **Hari 3** | Jumat, 3 Okt | Implementasi Checklist Interaktif (F-03) | Dev | EOD |
| **Hari 3** | Jumat, 3 Okt | Implementasi Pomodoro Timer / Focus Mode (F-04) | Dev | EOD |
| **Hari 3** | Jumat, 3 Okt | Implementasi Visual Pacing Dashboard (F-05) | Dev | EOD |
| **Hari 4** | Sabtu, 4 Okt | Polish UI/UX (dark mode, animasi, mobile responsiveness) | Dev | Siang |
| **Hari 4** | Sabtu, 4 Okt | Setup Cloudflare Tunnel untuk ekspos backend VPS | Dev | Siang |
| **Hari 4** | Sabtu, 4 Okt | Deploy frontend ke Vercel | Dev | Sore |
| **Hari 4** | Sabtu, 4 Okt | Tulis Proposal Ringkas (6 halaman PDF) | Najmi | Malam |
| **Hari 5** | Minggu, 5 Okt | Bug fixing final + regression test end-to-end | Dev | Siang |
| **Hari 5** | Minggu, 5 Okt | Rekam Video Demo (5–8 menit) + upload ke YouTube Unlisted | Najmi | Sore |
| **Hari 5** | Minggu, 5 Okt | Submit Formulir Pendaftaran Batch 2 (sebelum 23.59 WIB) | Najmi | Malam |

---

## 16. Deliverables Submission

### 16.1 Checklist Submission (Deadline: 5 Oktober 2026, 23.59 WIB)

- [ ] **Proposal Ringkas** (PDF, maks 6 halaman)
  - Penamaan: `NamaTim_KilasTugas_ProposalRingkas.pdf`
  - Upload ke Google Drive → share link ke panitia
- [ ] **Video Demo** (YouTube Unlisted, maks 10 menit)
  - Penamaan: `NamaTim_KilasTugas_VideoDemo`
  - Isi: perkenalan masalah (1 menit), demo produk (7 menit), penutup (1 menit)
- [ ] **Repository GitHub** (Public / Akses Juri)
  - Penamaan repo: `kilastugas`
  - Wajib ada: `README.md` lengkap, `package.json`, folder `backend/` dan `frontend/`
- [ ] **Link Deployment** (Opsional tapi disarankan)
  - Frontend: `https://kilastugas.vercel.app`
  - Backend: `https://api-kilastugas.yourdomain.com`

### 16.2 Struktur Proposal Ringkas (6 Halaman)

```
Halaman 1 : Cover — Nama Tim, Nama Produk, Track, Tagline
Halaman 2 : Identifikasi Masalah & Latar Belakang
Halaman 3 : Validasi Masalah (Data Survei + Referensi)
Halaman 4 : Solusi & Fitur Utama KilasTugas
Halaman 5 : Demo Screenshot / Mockup UI + Arsitektur Sistem
Halaman 6 : Roadmap Pengembangan & Penutup
```

---

## 17. Risiko & Mitigasi

| No | Risiko | Probabilitas | Dampak | Mitigasi |
|----|--------|:------------:|:------:|----------|
| 1 | **9Router down / AI tidak merespons** | Sedang | Tinggi | Template preset fallback sudah disiapkan di backend. |
| 2 | **MariaDB connection error di VPS** | Rendah | Tinggi | Fallback ke localStorage di frontend; data tidak hilang. |
| 3 | **Cloudflare Tunnel putus** | Sedang | Tinggi | Siapkan backup: deploy backend juga ke Railway/Render free tier sebagai cadangan. |
| 4 | **Waktu pengerjaan tidak cukup** | Rendah | Sedang | Scope MVP sudah diprioritaskan ke fitur minimum yang tetap lolos demo. F-02 (AI Breakdown) + F-03 (Checklist) adalah fitur paling krusial untuk demo juri. |
| 5 | **AI menghasilkan JSON tidak valid** | Sedang | Rendah | Parsing dilindungi `try/catch` + regex sanitizer; fallback ke template otomatis. |

---

## 18. Glosarium

| Istilah | Definisi |
|---------|----------|
| **Task Paralysis** | Kondisi psikologis di mana seseorang tidak mampu memulai tugas karena merasa terlalu kewalahan oleh kompleksitas atau besarnya beban kerja. |
| **Task Chunking** | Teknik pemecahan tugas besar menjadi beberapa sub-tugas kecil yang lebih mudah dieksekusi satu per satu. |
| **Micro-pacing** | Pendekatan yang memandu pengguna mengerjakan pekerjaan dalam porsi kecil dengan target waktu per segmen, untuk menjaga konsistensi dan mencegah burnout. |
| **Pomodoro Technique** | Metode manajemen waktu dengan siklus: 25 menit fokus kerja → 5 menit istirahat → ulangi. |
| **MVP (Minimum Viable Product)** | Versi produk dengan fitur minimum yang cukup untuk didemonstrasikan dan digunakan nyata oleh target pengguna. |
| **9Router** | Proxy AI multi-provider yang berjalan di VPS lokal, kompatibel dengan format OpenAI API. |
| **Guest Mode** | Mode penggunaan tanpa registrasi/login, data disimpan di localStorage browser. |
| **On Track** | Status ketika progress penyelesaian tugas sesuai atau lebih cepat dari jadwal ideal menuju deadline. |
| **Behind Schedule** | Status ketika progress penyelesaian tugas lebih lambat dari jadwal ideal menuju deadline. |

---

*Document ini merupakan PRD internal tim pengembang KilasTugas untuk SIFest Digital Innovation Challenge 2026. Versi 1.0.0 — 1 Oktober 2026.*
