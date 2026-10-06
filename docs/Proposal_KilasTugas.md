# PROPOSAL INOVASI DIGITAL
## SIFest Digital Innovation Challenge 2026: Track Education

---

# KILASTUGAS
### *Smart Actionable Task Breakdown & Micro-Pacing for Students*
**"Ubah Beban Tugas Kompleks Menjadi Aksi Harian yang Jelas, Ringan, dan Tereksekusi"**

---

### INFORMASI TIM & PRODUK

| Komponen | Keterangan |
|---|---|
| **Nama Tim** | Jadi H-1 |
| **Ketua Tim (Team Leader)** | Adridinan Najmi Faza (Informatika, Universitas Jenderal Soedirman) |
| **Anggota Tim** | 1. Timotius Willy Narendra (Informatika, Universitas Jenderal Soedirman)<br>2. Fardizza Finda Rahman (Informatika, Universitas Jenderal Soedirman) |
| **Judul Produk** | **KilasTugas** |
| **Challenge Track** | **Education** |
| **Tautan Repositori GitHub** | `https://github.com/najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1` *(Akses Publik / Juri)* |

---

## 1. RINGKASAN MASALAH

### 1.1 Fenomena Nyata Penugasan Mahasiswa
Di jenjang perguruan tinggi, mahasiswa rata-rata menempuh 4 hingga 7 mata kuliah aktif per semester. Setiap mata kuliah membebankan penugasan dengan karakteristik beragam: penyusunan makalah riset, laporan praktikum laboratorium, proyek pemrograman perangkat lunak, telaah jurnal ilmiah, hingga presentasi kelompok.

Tuntutan tersebut sering kali diserahkan oleh pengajar dalam bentuk silabus atau deskripsi instruksi yang panjang, padat, dan abstrak (misal: *"Susun laporan akhir perancangan jaringan VLSM 5 bab lengkap dengan simulasi Packet Tracer"*). Ketika beban tugas rumit datang bersamaan, mayoritas mahasiswa mengalami kebuntuan kognitif. Fenomena psikologis ini dikenal sebagai **Task Paralysis** atau **Overwhelm Freeze**: kondisi di mana seseorang justru tidak memulai pengerjaan bukan karena malas atau abai, melainkan karena otak mengalami *cognitive overload* dan bingung menentukan titik awal tindakan (*"where to start"*).

### 1.2 Gap Analisis Alat Manajemen Tugas Konvensional
Mahasiswa saat ini telah menggunakan berbagai platform produktivitas populer (Notion, Google Keep, Todoist, Trello, Google Tasks). Namun instrumen-instrumen tersebut menyisakan *critical gap*:
1. **Hanya Bersifat Pasif (Deadline-Centric, Bukan Action-Centric):** Aplikasi mencatat nama tugas dan tanggal tenggat, namun menyerahkan 100% beban pemecahan langkah kerja kepada pengguna yang sedang kewalahan kognitif.
2. **Ketiadaan Micro-Pacing:** Pengguna tidak dipandu secara harian berapa porsi kerja aman yang harus dicicil per hari berdasarkan jarak tanggal pengumpulan. Akibatnya timbul ilusi waktu luang semu yang berujung pada *panic working* di malam H-1/H-0.
3. **Friksi Awal Terlalu Tinggi:** Aplikasi manajemen proyek formal menuntut konfigurasi manual yang rumit (pembuatan database board, tagging, estimasi manual), sehingga energi mahasiswa terkuras sebelum sempat bekerja.

### 1.3 Rumusan Masalah Utama
> *"Bagaimana merancang platform digital yang mampu mengeliminasi Task Paralysis pada mahasiswa dengan mentransformasi instruksi tugas kuliah yang panjang menjadi rencana aksi harian yang mikro, konkret, terdistribusi merata, serta terintegrasi langsung dengan mesin fokus eksekusi?"*

---

## 2. VALIDASI MASALAH

Validasi masalah KilasTugas disusun melalui triangulasi data komprehensif: kajian literatur akademis internasional, survei empiris kuantitatif mahasiswa, dan wawancara kualitatif langsung.

### 2.1 Literatur Akademis & Kajian Ilmiah
- **American Psychological Association (APA / Onwuegbuzie & Jiao, 2000):** Prokrastinasi akademik dialami oleh **80%–95% mahasiswa perguruan tinggi**, dengan 50% di antaranya melaporkan penundaan tugas berdampak destruktif pada performa indeks prestasi dan stabilitas mental.
- **Journal of Educational Psychology:** Penerapan teknik pemecahan tugas bertahap (*Task Chunking*) terbukti meningkatkan rasio penyelesaian tugas akademik hingga **60%** dibandingkan pencatatan berbasis daftar tugas konvensional.
- **Stanford d.school Research:** Prinsip *Micro-Commitment* (tindakan mikro berdurasi 25–45 menit) menurunkan kecemasan kerja (*task anxiety*) secara drastis serta membangun momentum penyelesaian berkelanjutan (*action momentum*).

### 2.2 Survei Lapangan Kuantitatif (Responden: 28 Mahasiswa Aktif)
Survei disebarkan kepada 28 mahasiswa aktif lintas angkatan dan program studi rumpun sains & teknologi di lingkungan universitas:

| Pertanyaan Kunci | Temuan Data Empiris | Implikasi bagi Produk |
|---|:---:|---|
| Frekuensi mengerjakan tugas kuliah pada H-1 / H-0 deadline | **78,6%** (Sering / Selalu) | Membuktikan budaya prokrastinasi akut akibat ketiadaan panduan pacing harian. |
| Alasan utama menunda tugas | **64,3%** ("Bingung mulai dari mana / kewalahan membaca instruksi") | Menegaskan keberadaan *Task Paralysis*, bukan sekadar faktor kemalasan individu. |
| Pengalaman gagal mengumpulkan tugas tepat waktu | **53,6%** (Minimal 1x per semester) | Mengakibatkan kerugian akademik langsung (nilai penalti atau gugur mata kuliah). |
| Penggunaan to-do list & efektivitasnya | **67,9%** memakai, namun **57,1%** merasa tidak efektif mengeksekusi | Membuktikan to-do list pasif gagal menjawab kebutuhan eksekusi tindakan nyata. |

### 2.3 Observasi & Wawancara Kualitatif Mahasiswa
- **Narasumber (Mahasiswa S1 Semester 5):** *"Masalah utamanya bukan tidak mau mengerjakan, Mas. Pas buka modul tugas 15 halaman langsung pusing dan bingung mau ngetik apa duluan. Andai ada yang memandu: 'Hari ini kamu cukup tulis pendahuluan 30 menit dulu aja', pasti langsung saya selesaikan hari itu juga."*
- **Observasi Kanal Koordinasi Akademik:** Diskusi penugasan di grup WhatsApp dan Discord kelas selalu mengalami lonjakan drastis pada rentang pukul 21.00–23.59 WIB pada malam sebelum batas pengumpulan. Pola kerja panik semalam suntuk (*Sistem Kebut Semalam*) ini terbukti menurunkan kualitas substansi analisis akademik dan meningkatkan stres belajar.

---

## 3. SOLUSI YANG DITAWARKAN

KilasTugas dibangun dengan filosofi inti: **"Problem First, Technology Second: Jangan tanya 'kapan selesai', tanyakan 'apa yang dikerjakan hari ini'."**

```
[ Instruksi Tugas Kuliah yang Panjang & Abstrak ]
                       │
                       ▼
[ Engine KilasTugas: AI Breakdown + Smart Cache + Template Fallback ]
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

### 3.1 Nilai Inovasi & Fitur Unggulan Solusi
1. **Dekomposisi Tugas Terarah Berbasis AI & Fleksibilitas Langkah:**
   Pengguna memasukkan judul, mata kuliah, instruksi tugas, tanggal tenggat, dan target jumlah langkah (Otomatis AI atau 3, 4, 5, 6, 8 langkah). Mesin AI membedah instruksi menjadi urutan aksi konkret:
   - Judul aksi spesifik (<60 karakter, kata kerja aktif).
   - Panduan praktis eksekusi konkret (1–2 kalimat petunjuk langsung).
   - Estimasi waktu pengerjaan realistis (25–90 menit).
   - Target hari pelaksanaan (*day offset*) yang didistribusikan merata menuju deadline.
2. **Smart Caching & Deterministic Fallback Engine (Zero Downtime):**
   Jika tugas serupa pernah dipecahkan rekan seangkatan, sistem menyajikan cetak biru instan (<20 milidetik, 0 konsumsi token AI). Jika terjadi gangguan koneksi internet, sistem otomatis beralih (*graceful fallback*) ke template kurasi kurikulum kategori tugas (*Laporan Lab, Makalah Teori, Coding Project, Presentasi*).
3. **Visual Micro-Pacing & Circular Progress Gauge:**
   Status pengerjaan divisualisasikan secara real-time dengan Progress Ring dinamis:
   - 🟢 **On Track:** Pengerjaan berada di depan atau sesuai target ideal harian.
   - 🟡 **Behind Schedule:** Terdapat sub-tugas tertunda sebelum target hari ini.
   - 🔴 **Overdue Alert:** Melewati batas waktu pengumpulan tugas.
4. **Persistent Focus Engine & Floating Mini-Timer:**
   Pomodoro Timer (25 menit kerja fokus, 5 menit istirahat) berjalan persisten di latar belakang dengan floating pill, akurasi timestamp `Date.now()`, countdown di judul tab browser, audio synthesizer Web Audio API, serta notifikasi desktop saat sesi tuntas.
5. **Integrasi Kalender Nyata (Google Calendar & RFC 5545 iCalendar):**
   Tombol ekspor berkas `.ics` terstandar dilengkapi alarm 15 menit otomatis, serta integrasi langsung (*direct web/app intent*) ke Google Calendar di ponsel pintar tanpa perlu input jadwal manual.
6. **Task Blueprint Sharing (/p/:id) & 1-Click Import:**
   Mahasiswa dapat membagikan rencana tugas melalui tautan unik, memungkinkan teman sekelas mengimpor jadwal tugas ke akun pribadinya dalam 1 detik.
7. **Zero-Barrier Guest Mode:**
   Pengguna dapat langsung mengakses platform tanpa hambatan pendaftaran akun melalui sinkronisasi dual-layer antara browser `localStorage` dan MariaDB.

### 3.2 Target Pengguna & Persona
- **Sasaran Pengguna:** Mahasiswa aktif perguruan tinggi (usia 18–24 tahun) yang menempuh beban penugasan multi-matakuliah padat, pelajar sekolah menengah, dan peserta pelatihan mandiri.
- **Karakteristik Akses:** Akses cepat peramban ponsel pintar dan laptop, hemat kuota data, serta antarmuka *light mode* editorial minimalis bebas dari elemen visual generik (*anti-slop*).

### 3.3 Arsitektur Teknologi & Efisiensi Solusi
Arsitektur KilasTugas mengadopsi prinsip efisiensi komputasi, keandalan data (*high availability*), dan kesiapan operasional daring:
- **Frontend Layer:** React 18, Vite 5, Tailwind CSS, Lucide Icons berbobot ultra-ringan (<90KB gzip), responsif lintas layar ponsel, tablet, dan desktop, dideploy pada Vercel Global Edge Network (`https://kilastugas.vercel.app`).
- **Backend Layer:** FastAPI Python 3.12 asinkronus dengan validasi Pydantic v2, terpasang pada VPS Ubuntu Linux dengan reverse proxy Nginx dan sertifikat SSL Let's Encrypt (`https://api-kilastugas.najmifaza.my.id`).
- **AI Gateway & Smart Cache:** Terhubung ke gateway 9Router port 20128 (`ag/gemini-3.7-flash-medium`), didukung basis data MariaDB 10.x skema relasional (`sessions`, `tasks`, `subtasks`, `pomodoro_sessions`).

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (SPA)                   │
│      React 18 + Vite + Tailwind CSS + Lucide React     │
│      Hosted on Vercel Edge Global Content Delivery     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS REST API
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

### 3.4 Deklarasi Penggunaan AI (Integritas Kompetisi Bab 5.3 & 5.6)
Kecerdasan buatan dimanfaatkan secara transparan sebagai mesin inferensi pengurai tugas pada runtime produk dan bantuan autocomplete kode. Seluruh ideasi solusi, perancangan arsitektur, penyusunan instrumen survei empiris 28 responden, triangulasi masalah, dan kode pengontrol dibuat dan dipahami penuh oleh tim pengembang.

### 3.5 Status Progres Saat Ini (~50% Total Roadmap Pengembangan)
Sesuai ketentuan Bab 7.1 Guidebook SIFest 2026, pengembangan saat ini berada pada fase MVP fungsional Online Round (~50% dari total visi produk), dengan fitur lanjutan dialokasikan untuk Grand Final Sprint:
- [x] Repositori GitHub terkonfigurasi dengan struktur monorepo terstandar (`backend/` & `frontend/`).
- [x] Antarmuka Form Input Tugas terpadu dengan opsi custom target langkah (3–8 langkah atau AI otomatis).
- [x] Endpoint Backend `/api/breakdown` terintegrasi 9Router AI + Fallback Template + Smart Caching.
- [x] Checklist sub-tugas interaktif harian dengan sinkronisasi dual-layer (`localStorage` & MariaDB).
- [x] Engine Pomodoro Focus Mode terpasang dengan persistent background timer, floating pill, dan audio chime.
- [x] Ekspor kalender otomatis via RFC 5545 iCalendar (`.ics`) dan Google Calendar direct intent.
- [x] Fitur viral Task Blueprint Sharing (`/p/:id`) dengan impor satu detik.
- [x] Video walkthrough demonstrasi produk siap diakses panitia dan juri.
- [ ] Fitur AI Syllabus & PDF Reader (ekstraksi otomatis instruksi modul tugas dari berkas PDF/DOCX tebal).
- [ ] Fitur Collaborative Group Task Split (pembagian porsi kerja kelompok anti free-rider).
- [ ] Progressive Web App (PWA) & IndexedDB Offline-First Mode untuk akses nir-kuota.
- [ ] Always-On Background Timer & Web Push Notification via VAPID Service Worker saat peramban ditutup.
- [ ] Pengujian kegunaan formal (SUS Testing) dan pilot deployment ke 50+ mahasiswa lintas fakultas.
