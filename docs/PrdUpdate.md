# Spesifikasi Kebutuhan Teknis Sistem (Technical PRD)
## KilasTugas: Smart Actionable Task Breakdown & Micro-Pacing

---

## 1. Arsitektur Sistem & Topologi Infrastruktur

Sistem KilasTugas mengadopsi arsitektur terdistribusi *Decoupled Client-Server* dengan tiga simpul utama: Client SPA (Vercel), Backend Engine (Ubuntu VPS), dan AI Gateway (9Router Proxy).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (SPA)                              │
│       React 18 + Vite 5 + Tailwind CSS + Lucide Icons + Axios          │
│       Hosting: Vercel Global Edge Network (kilastugas.vercel.app)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS REST API / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND ENGINE LAYER                            │
│     Python 3.12 + FastAPI + Pydantic v2 + aiomysql Connection Pool     │
│     Web Server: Nginx (Reverse Proxy) + SSL Let's Encrypt              │
│     Host: Ubuntu VPS (IP 48.193.41.19 / api-kilastugas.najmifaza.my.id)│
└───────────────┬────────────────────────────────────────┬───────────────┘
                │                                        │
                ▼ Local HTTP (Port 20128)                ▼ Unix Socket / TCP 3306
┌───────────────────────────────┐        ┌───────────────────────────────┐
│      AI INFERENCE GATEWAY     │        │       PERSISTENCE LAYER       │
│  9Router Proxy (v1 Endpoint)  │        │     MariaDB 10.x Enterprise   │
│  Model: ag/gemini-3.7-flash   │        │     Database: kilastugas_db   │
│  Latensi: <2.0 detik          │        │     Smart Cache Latensi: <20ms│
└───────────────────────────────┘        └───────────────────────────────┘
```

---

## 2. Rincian Stack Teknologi & Dependensi

| Layer | Komponen / Pustaka | Versi | Peran Teknis |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | Komponen antarmuka deklaratif |
| | Vite | 5.4.2 | Bundler dan build tool modern (output <90KB gzip) |
| | Tailwind CSS | 3.4.1 | Utility-first styling (Light Mode Editorial) |
| | Lucide React | 0.446.0 | Ikonografi SVG berbasis komponen |
| | Axios | 1.7.7 | HTTP Client asinkronus dengan interceptor |
| | Canvas Confetti | 1.9.4 | Animasi umpan balik mikro (*dopamine reward*) |
| **Backend** | Python | 3.12.3 | Runtime lingkungan komputasi |
| | FastAPI | 0.115.0 | Web framework asinkronus berkinerja tinggi |
| | Uvicorn (Standard) | 0.30.6 | ASGI Server dengan worker berbasis asyncio |
| | Pydantic | 2.9.2 | Validasi skema request/response dan parsing tipe |
| | aiomysql | 0.2.0 | Non-blocking MySQL client pool untuk MariaDB |
| | OpenAI SDK | 1.45.0 | Klien API penghubung ke gateway 9Router |
| **Database** | MariaDB Server | 10.11.x | RDBMS relasional ACID dengan utf8mb4 |
| **Infrastruktur** | Nginx | 1.24.x | Reverse proxy, kompresi gzip, dan SSL termination |
| | Let's Encrypt Certbot | 2.9.0 | Manajemen otomatis sertifikat TLS/HTTPS |
| | Systemd | Linux Core | Daemon manager untuk auto-restart servis FastAPI |

---

## 3. Skema Basis Data Relasional (MariaDB DDL)

Skema database terstruktur penuh dengan aturan integritas referensial dan indeks pencarian:

```sql
CREATE DATABASE IF NOT EXISTS kilastugas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kilastugas_db;

-- 1. Sesi Anonim (Guest Mode)
CREATE TABLE IF NOT EXISTS sessions (
    id          VARCHAR(36)  PRIMARY KEY,
    user_agent  VARCHAR(512),
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Entitas Tugas Utama
CREATE TABLE IF NOT EXISTS tasks (
    id           VARCHAR(36)  PRIMARY KEY,
    session_id   VARCHAR(36)  NOT NULL,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    subject      VARCHAR(100),
    category     ENUM('laporan_lab', 'makalah', 'coding', 'presentasi', 'custom') DEFAULT 'custom',
    deadline     DATETIME     NOT NULL,
    is_completed BOOLEAN      DEFAULT FALSE,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_deadline   (deadline),
    INDEX idx_cache_lookup (title, category)
) ENGINE=InnoDB;

-- 3. Entitas Sub-Tugas Harian
CREATE TABLE IF NOT EXISTS subtasks (
    id               VARCHAR(36)  PRIMARY KEY,
    task_id          VARCHAR(36)  NOT NULL,
    step_number      INT          NOT NULL,
    title            VARCHAR(255) NOT NULL,
    description      TEXT,
    duration_minutes INT          DEFAULT 25,
    target_date      DATE,
    is_completed     BOOLEAN      DEFAULT FALSE,
    completed_at     TIMESTAMP    NULL,
    source           ENUM('ai', 'template', 'manual') DEFAULT 'ai',
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task_id     (task_id),
    INDEX idx_target_date (target_date)
) ENGINE=InnoDB;

-- 4. Log Riwayat Sesi Fokus Pomodoro
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
    id                      VARCHAR(36) PRIMARY KEY,
    subtask_id              VARCHAR(36) NOT NULL,
    started_at              TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    ended_at                TIMESTAMP   NULL,
    duration_actual_minutes INT,
    is_completed            BOOLEAN     DEFAULT FALSE,
    FOREIGN KEY (subtask_id) REFERENCES subtasks(id) ON DELETE CASCADE
) ENGINE=InnoDB;
```

---

## 4. Spesifikasi Kontrak API (Endpoints)

Base URL: `https://api-kilastugas.najmifaza.my.id`

### 4.1 Sesi Pengguna
- **`POST /api/session`**
  - **Body:** `{ "session_id": "optional-uuid", "user_agent": "browser-str" }`
  - **Respon (200):** `{ "session_id": "36-char-uuid" }`
  - **Logika:** Menggunakan `INSERT IGNORE INTO sessions` agar session idempotent dan aman dari race condition.

### 4.2 Tri-Engine Task Breakdown
- **`POST /api/breakdown`**
  - **Body:**
    ```json
    {
      "task_id": "uuid",
      "title": "Laporan Praktikum Jarkom",
      "description": "Konfigurasi OSPF 5 router dan subnetting VLSM",
      "category": "laporan_lab",
      "deadline": "2026-10-10T23:59:00",
      "subtasks_count": 5
    }
    ```
  - **Respon (200):**
    ```json
    {
      "success": true,
      "source": "ai",
      "data": [
        {
          "step": 1,
          "title": "Hitung Alokasi Subnet VLSM",
          "description": "Tentukan rentang CIDR dan IP host untuk 4 subnet jaringan laboratorium.",
          "duration_minutes": 45,
          "target_day_offset": 0
        }
      ]
    }
    ```
  - **Header Nilai `source`:**
    - `"cache"`: Hasil diambil dari Smart Cache MariaDB (<20ms).
    - `"ai"`: Hasil inferensi model 9Router (<2.0s).
    - `"template"`: Fallback deterministik kurikulum saat AI offline.

### 4.3 Manajemen Tugas (CRUD)
- **`GET /api/tasks/{session_id}`**
  - **Respon (200):** Mengembalikan array objek task beserta metrik kalkulasi `progress_percent`, `subtasks_total`, dan `subtasks_done`.
- **`POST /api/tasks`**
  - **Body:** `{ session_id, title, description, subject, category, deadline }`
  - **Respon (200):** Objek task terbuat dengan ID unik.
- **`PATCH /api/tasks/{task_id}`**
  - **Body:** `{ "is_completed": true }`
- **`DELETE /api/tasks/{task_id}`**
  - **Respon (200):** Menghapus tugas beserta seluruh sub-tugas terkait secara cascade.

### 4.4 Manajemen Sub-Tugas Mandiri
- **`POST /api/tasks/{task_id}/subtasks`**
  - **Body:** `{ "title": "str", "duration_minutes": 30, "target_date": "YYYY-MM-DD" }`
- **`PATCH /api/subtasks/{subtask_id}`**
  - **Body (Partial):** `{ "is_completed": bool, "title": "str", "duration_minutes": int }`
- **`DELETE /api/subtasks/{subtask_id}`**
  - **Respon (200):** `{ "success": true }`

### 4.5 Task Blueprint Sharing (/p/:id)
- **`GET /api/blueprint/{task_id}`**
  - **Respon (200):** Mengembalikan metadata tugas dan daftar langkah sub-tugas terurut untuk pratinjau publik anonim.
- **`POST /api/blueprint/{task_id}/clone`**
  - **Body:** `{ "session_id": "target-user-session", "target_deadline": "ISO-Date" }`
  - **Respon (200):** Menduplikasi seluruh skema sub-tugas ke session pengguna penerima dengan penyesuaian tanggal proporsional dalam 1 operasi transaksi DB.

### 4.6 Sistem Health Check
- **`GET /health` & `GET /`**
  - **Respon (200):** `{ "status": "ok", "service": "kilastugas-backend" }`

---

## 5. Logika Komputasi Kunci (Core Application Logic)

### 5.1 Alur Kerja Tri-Engine Breakdown
1. **Lapisan 1: Smart Cache Lookup (MariaDB):**
   Sistem mengeksekusi query pencocokan string normalisasi `LOWER(TRIM(title))` dan `category` pada tugas dengan `COUNT(subtasks) >= 2`.
   Jika ditemukan (*Cache Hit*), tanggal langkah disesuaikan terhadap deadline baru, dan data dikembalikan langsung tanpa request LLM (<20ms).
2. **Lapisan 2: AI Inference (9Router ag/gemini-3.7-flash-medium):**
   Jika *Cache Miss*, backend memicu OpenAI-compatible completion ke `http://127.0.0.1:20128/v1` dengan parameter:
   - `temperature: 0.3` (deterministik tinggi).
   - `max_tokens: 1500`.
   - Format: Strict JSON Array dengan validasi skema Pydantic.
3. **Lapisan 3: Deterministic Fallback Engine:**
   Jika gateway 9Router mengalami network timeout (>10s) atau error parsing JSON, exception handler mengalihkan aliran eksekusi ke `templates/presets.py` sesuai kategori tugas.

### 5.2 Algoritma Visual Micro-Pacing
Status kemajuan tugas dievaluasi secara dinamis berdasarkan formula waktu:
```
Target Hari Ini = Tanggal Hari Ini (00:00:00)
Subtasks Pending = Daftar subtask dengan is_completed == false

Kondisi Evaluasi:
1. OVERDUE: now() > deadline_task AND terdapat subtask belum selesai.
2. BEHIND SCHEDULE: terdapat subtask pending dengan target_date < Target Hari Ini.
3. ON TRACK: seluruh subtask pending memiliki target_date >= Target Hari Ini.
```

### 5.3 Persistent Focus Engine (Pomodoro Math)
1. **Timestamp Integrity:**
   Waktu Pomodoro tidak mengandalkan interval JavaScript murni (yang mengalami *drifting* atau mati saat tab diminimalkan), melainkan menyimpan `endTime = Date.now() + (sisa_detik * 1000)`.
2. **Title Bar Synchronization:**
   Setiap detik, `document.title` dimutasi: `(${formatMMSS(remaining)}) Fokus - KilasTugas`.
3. **Synthesizer Web Audio API:**
   Menggunakan `AudioContext` lokal untuk menghasilkan dual-tone chime (frekuensi 587.33Hz D5 dilanjutkan 880Hz A5) tanpa perlu mengunduh file MP3 eksternal.

### 5.4 Algoritma Ekspor Kalender
1. **RFC 5545 iCalendar (`.ics`):**
   Dibuat in-memory di sisi peramban menggunakan data MIME `text/calendar`. Setiap sub-tugas menghasilkan blok `VEVENT` dengan penanda `UID`, `DTSTART`, `DTEND`, dan komponen alarm pengingat:
   ```
   BEGIN:VALARM
   TRIGGER:-PT15M
   ACTION:DISPLAY
   DESCRIPTION:Waktunya fokus mengerjakan langkah ini!
   END:VALARM
   ```
2. **Direct Google Calendar Intent:**
   Menghasilkan URI intent:
   `https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={start}/{end}&details={guide}`
   yang langsung mentrigger aplikasi Google Calendar di Android/iOS atau membuka tab baru di peramban web desktop.

---

## 6. Desain Sistem & Arsitektur Frontend

### 6.1 State Management & Persistensi Dual-Layer
- **Lapisan 1 (Browser Storage):** UUID sesi dan preferensi disimpan pada `localStorage.getItem('kilastugas_session_id')`.
- **Lapisan 2 (Remote Server):** Setiap mutasi checklist atau penambahan tugas menerapkan *Optimistic UI Update* di sisi React, lalu mengirim patch asinkronus ke server MariaDB.

### 6.2 Sistem Responsivitas Breakpoints
- **Mobile (<768px):** Tampilan kartu tunggal *edge-to-edge*, navigasi aksi via Floating Action Button (FAB `+` diameter 56px di koordinat `bottom-6 right-6`), modal input bertipe bottom-sheet / drawer.
- **Tablet (768px–1024px):** Layout grid tugas 2-kolom seimbang dengan hero circular gauge di posisi sentral.
- **Desktop (>1024px):** Max container `max-w-6xl`, tombol tambah tugas di navbar atas, dan modal fokus Pomodoro terpusat di layar.

---

## 7. Spesifikasi Teknis Fitur Masa Depan (Grand Final Scope)

### 7.1 GF-01: In-Memory AI Syllabus & PDF/DOCX Parser
- **Mekanisme:** Endpoint baru `POST /api/syllabus/extract` menerima multipart upload berkas PDF/DOCX maksimal 5 MB.
- **Pengolahan VPS:** File diproses via `pypdf` dan `python-docx` langsung di memori RAM (in-memory byte stream, tidak disimpan ke disk storage VPS).
- **Ekstraksi:** Teks instruksi disaring menjadi <3.000 karakter, lalu diproses oleh 9Router AI untuk menghasilkan rantai tugas nir-ketik.

### 7.2 GF-02: Collaborative Group Task Split
- **Skema DB Tambahan:** Tabel `task_members (id, task_id, member_name, role)` dan foreign key `assigned_to` pada tabel `subtasks`.
- **Distribusi AI:** Model AI membagi porsi kerja berdasarkan estimasi jam kerja yang seimbang antar anggota tim.

### 7.3 GF-03: PWA Offline-First Engine
- **Service Worker:** Registrasi manifest web app dan caching aset statis (HTML, JS, CSS, Lucide icons).
- **IndexedDB Sync:** Menggunakan pustaka ringan `idb` untuk menyimpan antrean mutasi offline (*mutation queue*), yang otomatis disinkronkan ke endpoint `/api/tasks` saat event `navigator.onLine` aktif.

### 7.4 GF-04: Server-Side Web Push Scheduler (VAPID)
- **Protokol:** Web Push RFC 8291 / RFC 8292 menggunakan pustaka Python `pywebpush`.
- **Eksekusi:** Saat sesi fokus dimulai, backend menjadwalkan task delay 25 menit. Server menembakkan push payload ke peramban pengguna melalui Push Service vendor (Google FCM / Mozilla autopush) sehingga notifikasi tetap meletup meskipun tab browser telah ditutup.

---

*Dokumen ini merupakan spesifikasi teknis resmi arsitektur sistem KilasTugas v2.0.*
