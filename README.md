# KilasTugas

> **Smart Actionable Task Breakdown & Micro-Pacing for Students**  
> *"Ubah Beban Tugas Kompleks Menjadi Aksi Harian yang Jelas, Ringan, dan Tereksekusi"*

[![SIFest 2026](https://img.shields.io/badge/SIFest_DIC-2026_Education_Track-blue.svg)](https://github.com/najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite_5-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind_CSS_3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MariaDB](https://img.shields.io/badge/Database-MariaDB_10.x-003545.svg?logo=mariadb&logoColor=white)](https://mariadb.org)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel_%2B_Ubuntu_VPS-black.svg)](https://kilastugas.vercel.app)

---

## 🔗 Tautan Penting

* **Live Demo (Frontend):** [kilastugas.vercel.app](https://kilastugas.vercel.app)
* **Production API (Backend):** [api-kilastugas.najmifaza.my.id](https://api-kilastugas.najmifaza.my.id)
* **Dokumentasi Proposal Resmi:** `docs/JadiH-1_KilasTugas_ProposalRingkas.pdf`
* **Arsitektur & Spesifikasi Teknis:** `docs/PrdUpdate.md`
* **Diagram Sistem (Draw.io):** `docs/Diagram_KilasTugas.drawio.xml`

---

## 📌 Latar Belakang & Masalah

Mahasiswa rata-rata menempuh 4 hingga 7 mata kuliah aktif per semester. Instruksi penugasan yang diberikan dosen sering berbentuk silabus panjang (5–15 halaman) tanpa panduan aksi harian.

Kondisi ini memicu fenomena psikologis **Task Paralysis (Overwhelm Freeze)**: mahasiswa menunda pengerjaan bukan karena malas, melainkan otak mengalami *cognitive overload* dan tidak tahu harus memulai dari mana (*"where to start"*).

### Gap Instrumen Konvensional:
1. **Pasif & Deadline-Centric (Notion, Google Tasks, Todoist):** Hanya mencatat nama tugas dan tanggal deadline, menyerahkan 100% beban pemecahan langkah kepada pengguna yang sedang kewalahan.
2. **Nir Micro-Pacing:** Tidak memandu porsi aman yang harus dicicil per hari menuju deadline. Memicu budaya kerja panik H-1 / H-0.
3. **Friksi Awal Tinggi:** Aplikasi manajemen proyek formal menuntut setup board/database manual sebelum mulai bekerja.

---

## 💡 Solusi: KilasTugas

Filosofi: **"Problem First, Technology Second: Jangan tanya 'kapan selesai', tanyakan 'apa yang dikerjakan hari ini'."**

KilasTugas memecah instruksi tugas panjang menjadi rantai sub-tugas terukur (25–90 menit) yang didistribusikan merata menuju tenggat waktu, terintegrasi langsung dengan timer Pomodoro, kalender, dan sistem berbagi blueprint.

```
[ Instruksi Tugas Kuliah Panjang & Abstrak ]
                       │
                       ▼
[ Tri-Engine: AI Breakdown + Smart Cache + Fallback ]
                       │
                       ▼
┌────────────────────────────────────────────────────────┐
│               Empat Pilar Solusi KilasTugas           │
├────────────────────────┬───────────────────────────────┤
│ 1. Actionable Chunking │ 3–8 sub-tugas konkret harian  │
│ 2. Visual Micro-Pacing │ Status On Track / Behind      │
│ 3. Deep Focus Engine   │ Floating Pomodoro Timer 25/5  │
│ 4. Blueprint Sharing   │ 1-Click Import Rencana Tugas  │
└────────────────────────┴───────────────────────────────┘
```

---

## ✨ Fitur Utama

1. **AI Task Decomposition & Opsi Target Langkah:**
   * Membedah instruksi teks menjadi langkah kerja konkret (kata kerja aktif, panduan 1–2 kalimat, estimasi waktu).
   * Opsi fleksibel: AI Otomatis atau pilih 3, 4, 5, 6, 8 langkah sesuai kapasitas harian.
2. **Tri-Engine Reliability (Zero Single Point of Failure):**
   * **Smart Cache (<20ms):** Jika tugas serupa pernah dipecahkan mahasiswa seangkatan, rencana kerja langsung disajikan dari MariaDB (0 konsumsi token AI).
   * **AI Inference (<2 detik):** Didukung gateway 9Router (`ag/gemini-3.7-flash-medium`).
   * **Fallback Template:** Template kurikulum bawaan (Laporan Lab, Makalah, Coding, Presentasi, Custom) jika koneksi internet/AI offline.
3. **Visual Micro-Pacing & Circular Progress Gauge:**
   * Indikator real-time status ritme kerja: 🟢 `On Track`, 🟡 `Behind Schedule`, 🔴 `Overdue`.
   * Hero circular progress ring menghitung rasio penyelesaian sub-tugas riil.
4. **Persistent Focus Engine (Pomodoro Timer):**
   * Siklus 25 menit fokus / 5 menit istirahat dengan akurasi timestamp `Date.now()`.
   * Floating mini-timer pill tetap berjalan saat berpindah halaman.
   * Sinkronisasi countdown ke tab title peramban, audio chime Web Audio API, dan Web Desktop Notification.
5. **Integrasi Kalender Nyata:**
   * Direct Google Calendar intent (langsung buka template event di HP/Web).
   * Ekspor berkas standar RFC 5545 iCalendar (`.ics`) dengan alarm otomatis 15 menit.
6. **Task Blueprint Sharing (`/p/:id`):**
   * Salin URL unik rencana tugas. Rekan sekelas dapat mengimpor seluruh langkah ke jadwal pribadi dalam 1 klik.
7. **Zero-Barrier Guest Mode:**
   * Tanpa proses registrasi/login yang memperlambat aksi. Sinkronisasi dual-layer antara browser `localStorage` dan MariaDB.

---

## 🏗️ Arsitektur Sistem

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
                ▼ Local HTTP (Port 20128)                ▼ TCP / Unix Socket
┌───────────────────────────────┐        ┌───────────────────────────────┐
│      AI INFERENCE GATEWAY     │        │       PERSISTENCE LAYER       │
│  9Router Proxy (v1 Endpoint)  │        │     MariaDB 10.x Enterprise   │
│  Model: ag/gemini-3.7-flash   │        │     Database: kilastugas_db   │
│  Latensi: <2.0 detik          │        │     Smart Cache Latensi: <20ms│
└───────────────────────────────┘        └───────────────────────────────┘
```

---

## 📁 Struktur Repositori

```text
.
├── backend/                  # FastAPI Application
│   ├── config/               # Database pool & AI Client configuration
│   ├── models/               # Pydantic schema validation
│   ├── routers/              # API Endpoints (breakdown, tasks, subtasks, blueprints, sessions)
│   ├── templates/            # Deterministic fallback curriculum presets
│   ├── main.py               # Application entrypoint & CORS middleware
│   ├── requirements.txt      # Python dependencies
│   └── schema.sql            # MariaDB database DDL
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/       # UI Components (TaskCard, DateStrip, FloatingTimer, BlueprintModal, dll)
│   │   ├── services/         # Axios API clients & local storage bridge
│   │   ├── utils/            # iCalendar generator, audio synthesizer, formatting helpers
│   │   ├── App.jsx           # Root view, state machine, multi-device layouts
│   │   └── main.jsx          # React DOM entrypoint
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite bundler configuration
└── docs/                     # Berkas Proposal, Presentasi, & Diagram
    ├── JadiH-1_KilasTugas_ProposalRingkas.pdf  # Dokumen Proposal Resmi (7 Halaman)
    ├── Diagram_KilasTugas.drawio.xml          # Master Diagram Vector Draw.io
    ├── PrdUpdate.md                           # Spesifikasi Teknis Lengkap
    └── FUTURE.md                              # Roadmap Pengembangan Grand Final
```

---

## 🚀 Panduan Menjalankan Secara Lokal (Local Development)

### 1. Prasyarat
* Node.js v18+ & npm
* Python 3.10+
* MariaDB / MySQL Server aktif

### 2. Backend Setup

```bash
# Masuk ke direktori backend
cd backend

# Buat virtual environment
python -m venv venv
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependensi
pip install -r requirements.txt

# Siapkan basis data (MariaDB)
mysql -u root -p < schema.sql

# Salin dan sesuaikan variabel lingkungan
cp .env.example .env
```

Isi berkas `backend/.env`:
```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=kilas_user
DB_PASSWORD=KilasPass2026!
DB_NAME=kilastugas_db
AI_API_BASE=http://127.0.0.1:20128/v1
AI_API_KEY=your_key_here
AI_MODEL=ag/gemini-3.7-flash-medium
```

Jalankan backend server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Akses Swagger API docs di: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Salin variabel lingkungan
cp .env.example .env
```

Isi berkas `frontend/.env`:
```ini
VITE_API_URL=http://localhost:8000
```

Jalankan frontend server:
```bash
npm run dev
```
Buka peramban di: `http://localhost:5173`

---

## 📡 Ringkasan API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/session` | Inisialisasi guest session UUID idempotent |
| `POST` | `/api/breakdown` | Dekomposisi tugas via Smart Cache / AI / Fallback |
| `GET` | `/api/tasks/{session_id}` | Ambil semua tugas beserta kalkulasi progres |
| `POST` | `/api/tasks` | Simpan tugas baru |
| `PATCH`| `/api/tasks/{task_id}` | Update status selesai tugas |
| `DELETE`| `/api/tasks/{task_id}` | Hapus tugas beserta seluruh sub-tugas (cascade) |
| `POST` | `/api/tasks/{task_id}/subtasks` | Tambah langkah kerja manual |
| `PATCH`| `/api/subtasks/{subtask_id}` | Toggle checkbox / edit judul & durasi |
| `DELETE`| `/api/subtasks/{subtask_id}` | Hapus langkah kerja |
| `GET` | `/api/blueprint/{task_id}` | Ambil data cetak biru untuk pratinjau publik |
| `POST` | `/api/blueprint/{task_id}/clone` | Kloning rencana tugas ke jadwal pengguna penerima |
| `GET` | `/health` | Pemeriksaan kesehatan layanan backend |

---

## 👥 Tim Pengembang (Tim Jadi H-1)

Karya inovasi digital ini disusun dan dikembangkan oleh mahasiswa **Informatika, Universitas Jenderal Soedirman** untuk **SIFest Digital Innovation Challenge 2026**:

* **Adridinan Najmi Faza** — Team Leader / Fullstack & AI Integration
* **Timotius Willy Narendra** — Frontend Architect & UX Research
* **Fardizza Finda Rahman** — Backend & System Reliability Engineer

---

## 📜 Lisensi & Integritas Kompetisi

Proyek ini dirilis di bawah lisensi [MIT License](LICENSE). Seluruh ideasi produk, arsitektur sistem, riset survei empiris 28 responden, serta kode pengontrol dibangun secara orisinal dengan kepatuhan penuh terhadap **Bab 5.3 & Bab 5.6 Guidebook SIFest 2026 (AI Usage Declaration)**.
