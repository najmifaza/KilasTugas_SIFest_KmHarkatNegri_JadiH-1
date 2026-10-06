# PROPOSAL RINGKAS INOVASI DIGITAL
## SIFest Digital Innovation Challenge 2026: Track Education

---

# KILASTUGAS
### *Smart Actionable Task Breakdown & Micro-Pacing for Students*
**"Ubah Beban Tugas Kompleks Menjadi Aksi Harian yang Jelas, Ringan, dan Tereksekusi"**

---

### INFORMASI TIM & PRODUK

| Komponen | Keterangan |
|---|---|
| **Nama Tim** | Tim KilasTugas |
| **Ketua Tim (Team Leader)** | Adridinan Najmi Faza (Informatika, Universitas Jenderal Soedirman) |
| **Anggota Tim** | 1. Timotius Willy Narendra (Informatika, Universitas Jenderal Soedirman)<br>2. Fardizza Finda Rahman (Informatika, Universitas Jenderal Soedirman) |
| **Judul Produk** | **KilasTugas** |
| **Challenge Track** | **Education** |
| **Tautan Repositori GitHub** | `https://github.com/najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1` *(Akses Publik / Juri)* |

---

## 1. Latar Belakang & Rumusan Masalah

### 1.1 Latar Belakang
Di jenjang perguruan tinggi dan sekolah menengah atas, mahasiswa rata-rata menempuh 4 hingga 7 mata kuliah aktif per semester. Setiap mata kuliah membebankan tugas dengan karakteristik beragam: penyusunan makalah riset, laporan praktikum laboratorium, proyek pemrograman perangkat lunak, telaah jurnal ilmiah, hingga presentasi kelompok.

Tuntutan tersebut sering kali diserahkan oleh pengajar dalam bentuk silabus atau deskripsi instruksi yang panjang, padat, dan abstrak (misal: *"Susun laporan akhir perancangan jaringan VLSM 5 bab lengkap dengan simulasi Packet Tracer"*). Ketika beban tugas yang rumit datang bersamaan, mayoritas pelajar mengalami kebuntuan kognitif. Fenomena psikologis ini dikenal sebagai **Task Paralysis** atau **Overwhelm Freeze**: kondisi di mana seseorang justru tidak memulai pengerjaan bukan karena malas atau abai, melainkan karena otak mengalami *cognitive overload* dan bingung menentukan titik awal tindakan (*"where to start"*).

### 1.2 Gap Analisis Alat Manajemen Tugas Konvensional
Pelajar saat ini telah menggunakan berbagai platform produktivitas populer (Notion, Google Keep, Todoist, Trello, Google Tasks). Namun, instrumen-instrumen tersebut menyisakan *critical gap*:
1. **Hanya Bersifat Pasif (Deadline-Centric, Bukan Action-Centric):** Aplikasi mencatat nama tugas dan tanggal tenggat, namun menyerahkan 100% beban pemecahan langkah kerja kepada pengguna yang sedang kewalahan.
2. **Ketiadaan Micro-Pacing:** Pengguna tidak dipandu secara harian berapa porsi kerja yang aman diselesaikan hari ini berdasarkan jarak tanggal pengumpulan. Akibatnya, timbul ilusi waktu luang semu yang berujung pada *panic working* di malam H-1/H-0.
3. **Friksi Awal Tinggi:** Aplikasi manajemen proyek formal menuntut setup manual yang rumit (pembuatan database board, tagging, estimasi manual), sehingga pengguna lelah sebelum mulai bekerja.

### 1.3 Rumusan Masalah
> *"Bagaimana merancang platform digital yang mampu mengeliminasi Task Paralysis pada pelajar dengan mengonversi instruksi tugas kuliah yang panjang menjadi rencana aksi harian yang mikro, konkret, dan terintegrasi dengan timer eksekusi terarah?"*

---

## 2. Sumber Validasi Masalah

Validasi masalah KilasTugas disusun melalui triangulasi data: riset literatur akademis internasional, survei empiris kuantitatif pelajar, dan observasi lapangan langsung.

### 2.1 Literatur Akademis & Kajian Ilmiah
- **American Psychological Association (APA / Onwuegbuzie & Jiao, 2000):** Prokrastinasi akademik dialami oleh **80%–95% mahasiswa**, dengan 50% di antaranya melaporkan penundaan tugas berdampak destruktif pada performa akademik dan kesehatan mental.
- **Journal of Educational Psychology:** Penerapan teknik pemecahan tugas bertahap (*Task Chunking*) terbukti meningkatkan tingkat penyelesaian tugas akademik hingga **60%** dibandingkan pencatatan berbasis daftar tugas konvensional.
- **Stanford d.school Research:** Prinsip *Micro-Commitment* (tindakan mikro berdurasi 25–45 menit) menurunkan kecemasan kerja (*task anxiety*) secara drastis serta membangun momentum penyelesaian berkelanjutan.

### 2.2 Survei Lapangan Kuantitatif (Responden: 28 Mahasiswa Aktif)
Survei disebarkan kepada mahasiswa lintas angkatan dan program studi rumpun sains & teknologi di lingkungan universitas:

| Pertanyaan Kunci | Temuan Data Empiris | Implikasi bagi Produk |
|---|:---:|---|
| Frekuensi mengerjakan tugas kuliah pada H-1 / H-0 deadline | **78,6%** (Sering / Selalu) | Membuktikan budaya prokrastinasi akut akibat ketiadaan panduan pacing. |
| Alasan utama menunda tugas | **64,3%** ("Bingung mulai dari mana / kewalahan membaca instruksi") | Menegaskan keberadaan *Task Paralysis*, bukan sekadar faktor kemalasan. |
| Pengalaman gagal mengumpulkan tugas tepat waktu | **53,6%** (Minimal 1x per semester) | Mengakibatkan kerugian akademik langsung (nilai penalti/gugur). |
| Penggunaan to-do list & efektivitasnya | **67,9%** memakai, namun **57,1%** merasa tidak efektif mengeksekusi | Membuktikan to-do list pasif gagal menjawab kebutuhan eksekusi. |

### 2.3 Observasi & Wawancara Kualitatif Mahasiswa
- **Narasumber (Mahasiswa S1 Semester 5):** *"Masalah utamanya bukan nggak mau ngerjain, Mas. Pas buka modul tugas 15 halaman langsung pusing. Andai ada yang kasih tahu: 'Hari ini kamu cukup tulis pendahuluan 30 menit dulu aja', pasti langsung saya kerjain."*
- **Observasi Kanal Koordinasi Akademik:** Diskusi penugasan di WhatsApp/Discord kelas selalu melonjak drastis pada rentang pukul 21.00–23.59 WIB pada malam sebelum pengumpulan tugas, menghasilkan kualitas penulisan dan analisis yang rendah akibat dikerjakan tergesa-gesa.

---

## 3. Solusi yang Ditawarkan

KilasTugas hadir dengan filosofi dasar: **"Problem First, Technology Second: Jangan tanya 'kapan selesai', tanyakan 'apa yang dikerjakan hari ini'."**

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

### 3.1 Nilai Inovasi & Fitur Unggulan
1. **Dekomposisi Tugas Terarah Berbasis AI & Kustomisasi Langkah:**
   Pengguna cukup memasukkan judul, instruksi dosen, mata kuliah, tanggal deadline, dan opsi pilihan target langkah kerja (Otomatis AI atau 3, 4, 5, 6, 8 langkah). Mesin inferensi AI membedah instruksi secara terstruktur. Tiap langkah memuat:
   - Judul aksi spesifik (<60 karakter, kata kerja aktif).
   - Panduan eksekusi konkret (1–2 kalimat petunjuk praktis).
   - Estimasi waktu pengerjaan realistis (25–90 menit).
   - Target hari pelaksanaan (*day offset*) yang didistribusikan merata menuju deadline.
2. **Smart Caching & Deterministic Fallback Engine (Zero Downtime):**
   Jika tugas serupa pernah dipecah oleh rekan seangkatan, sistem menyajikan cetak biru instan (<20ms, 0 konsumsi token AI). Jika terjadi gangguan koneksi internet, sistem otomatis beralih (*graceful fallback*) ke template kurasi kurikulum kategori tugas (*Laporan Lab, Makalah Teori, Coding Project, Presentasi*).
3. **Visual Micro-Pacing & Circular Progress Gauge:**
   Status pengerjaan divisualisasikan secara real-time:
   - 🟢 **On Track:** Pengerjaan berada di depan atau sesuai target ideal harian.
   - 🟡 **Behind Schedule:** Terdapat sub-tugas tertunda sebelum target hari ini.
   - 🔴 **Overdue Alert:** Melewati batas waktu deadline.
4. **Persistent Focus Engine & Floating Mini-Timer:**
   Pomodoro Timer (25 menit fokus mendalam, 5 menit istirahat) berjalan persisten di latar belakang aplikasi dengan floating mini-pill di bawah layar, perhitungan akurasi timestamp `Date.now()`, countdown di judul tab browser, audio synthesizer Web Audio API, serta notifikasi desktop saat sesi tuntas.
5. **Integrasi Kalender Nyata (Google Calendar & RFC 5545 iCalendar):**
   Tombol ekspor berkas standar iCalendar (`.ics`) dilengkapi alarm pengingat 15 menit otomatis, serta tautan langsung (*direct intent*) ke Google Calendar di ponsel pintar tanpa perlu input jadwal manual.
6. **Task Blueprint Sharing (/p/:id) & 1-Click Import:**
   Mahasiswa dapat membagikan rencana aksi tugas ke grup kelas melalui tautan unik. Teman sekelas dapat mengimpor seluruh rantai sub-tugas ke jadwal pribadinya dalam 1 detik.
7. **Zero-Barrier Guest Mode:**
   Pengguna dapat langsung menggunakan aplikasi tanpa hambatan registrasi/login (*Guest Mode* berbasis UUID anonim dan sinkronisasi dual-layer antara `localStorage` browser dan MariaDB).

---

## 4. Target Pengguna & Persona

### 4.1 Target Pengguna
- **Target Primer:** Mahasiswa aktif D3/D4/S1 (usia 18–24 tahun) yang memiliki beban penugasan multi-matakuliah padat.
- **Target Sekunder:** Pelajar SMA/SMK/sederajat dan *fresh graduate* yang sedang menempuh *bootcamp*/pelatihan mandiri.
- **Karakteristik Akses:** Mengutamakan akses cepat mobile & web browser, kuota hemat, dan antarmuka *light mode* editorial minimalis yang nyaman dibaca berjam-jam tanpa kelelahan mata.

### 4.2 User Persona

#### Persona 1: Mahasiswa Aktif Akademik & Organisasi
- **Nama:** Reza Aditya (20 tahun), Mahasiswa Informatika Semester 5.
- **Perilaku:** Menghadapi 6 mata kuliah dan 2 praktikum mingguan, aktif di BEM fakultas.
- **Pain Point:** Sering menunda pengerjaan tugas besar praktikum karena modul instruksi rumit; merasa bersalah dan terbebani di akhir pekan hingga panik pada H-1.
- **Kebutuhan:** Pemecah tugas otomatis yang memberi tahu menu kerja 30–45 menit setiap sore hari seusai kuliah.

#### Persona 2: Siswi Sekolah / Pelajar Mandiri
- **Nama:** Siti Nurhaliza (17 tahun), Siswi SMA Kelas 12.
- **Perilaku:** Mempersiapkan tugas proyek akhir sekolah dan ujian mandiri dengan kuota seluler terbatas.
- **Pain Point:** Tidak memiliki bimbingan privat; bingung menyusun langkah kerja tugas karya ilmiah mandiri.
- **Kebutuhan:** Platform ringan, tidak membutuhkan login rumit, dan memberikan panduan kerja langkah demi langkah.

---

## 5. Dampak & Indikator Keberhasilan

Inovasi KilasTugas dirancang untuk memberikan dampak terukur terhadap ekosistem belajar digital:

### 5.1 Dampak Kualitatif
1. **Reduksi Kecemasan Akademik:** Menghilangkan sindrom *Overwhelm Freeze* saat menerima tugas berbobot besar.
2. **Peningkatan Kualitas Luaran Akademik:** Tugas yang dicicil teratur memiliki kedalaman materi, orisinalitas riset, dan kerapian yang jauh lebih tinggi dibanding hasil kerja tergesa-gesa semalam.
3. **Pemberdayaan Disiplin Diri:** Membentuk kebiasaan belajar berbasis *micro-habits* dan fokus mendalam (*deep work*).

### 5.2 Indikator Keberhasilan Terukur (KPI Produk)

| Metrik Evaluasi | Target Capaian (Tahap Pengujian & Pilot) |
|---|:---:|
| **Task Initiation Rate** | >85% pengguna mengeksekusi sub-tugas pertama dalam <24 jam sejak tugas diinput. |
| **Task Completion Rate** | Peningkatan tingkat penyelesaian tugas tepat waktu dari 50% menjadi **>80%**. |
| **Response Latency AI Breakdown** | Penguraian tugas instan (<2 detik via 9Router; <20 milidetik via Smart Cache). |
| **System Reliability & Availability** | **100% uptime ketersediaan fitur** berkat tri-engine (AI + Smart Cache + Fallback Template). |
| **Usability / User Satisfaction** | Skor SUS (*System Usability Scale*) **>80 (Kategori Excellent)**. |

---

## 6. Teknologi yang Digunakan

Arsitektur KilasTugas mengadopsi prinsip efisiensi komputasi, keandalan data (*high availability*), dan kesiapan operasional daring penuh.

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

### 6.1 Rincian Tech Stack
- **Frontend Layer:**
  - **React 18 + Vite:** Menghasilkan Single Page Application (SPA) yang sangat ringan (<90KB gzip), responsif di perangkat seluler dengan render instan.
  - **Tailwind CSS & Editorial UI:** Desain antarmuka modern bernuansa *clean light mode* editorial (palet warna Stone/Slate/Zinc netral tanpa elemen generik AI-slop), tipografi hierarkis jelas, dan komponen aksesibel.
  - **React State Hooks & Axios:** Pengelolaan state interaktif efisien dan komunikasi asinkronus ke server backend.
- **Backend Layer:**
  - **FastAPI (Python 3.12):** Framework backend asinkronus dengan latensi transmisi rendah, validasi skema otomatis via *Pydantic v2*, serta dokumentasi interaktif OpenAPI/Swagger.
  - **aiomysql:** Driver non-blocking asinkron untuk operasi basis data berkecepatan tinggi.
- **Database & Storage Layer:**
  - **MariaDB 10.x:** Penyimpanan relasional skema terstruktur (`sessions`, `tasks`, `subtasks`, `pomodoro_sessions`) yang mendukung integritas data penuh (*ACID compliant*), sekaligus menjadi basis data *Smart Caching* cetak biru tugas antar-mahasiswa.
  - **Browser LocalStorage:** Lapisan persistensi lokal sekunder untuk menjamin data tugas tetap dapat diakses pengguna Guest bahkan saat luring (*offline capability*).
- **Infrastruktur & Delivery:**
  - **Nginx Reverse Proxy & SSL Let's Encrypt:** Jalur transmisi aman HTTPS berkecepatan tinggi pada domain `api-kilastugas.najmifaza.my.id` dengan manajemen service `systemd` terisolasi.
  - **Vercel Global Edge Network:** Menjamin ketersediaan web aplikasi 99.9% di seluruh jaringan internet Indonesia (`kilastugas.vercel.app`).

---

## 7. AI Usage Declaration (Deklarasi Penggunaan AI)

Sesuai ketentuan integritas kompetisi pada **Bab 5.3 & Bab 5.6 Guidebook SIFest Digital Innovation Challenge 2026**, tim mendeklarasikan pemanfaatan kecerdasan buatan (*Artificial Intelligence*) secara jujur dan transparan:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     DEKLARASI PENGGUNAAN AI (RESMI)                      │
├────────────────────────────────┬─────────────────────────────────────────┤
│ Aspek Pemanfaatan              │ Rincian Pemanfaatan AI                  │
├────────────────────────────────┼─────────────────────────────────────────┤
│ Fitur Runtime Produk           │ 9Router (ag/gemini-3.7-flash-medium)    │
│                                │ Digunakan untuk mentransformasi teks    │
│                                │ instruksi tugas menjadi array sub-tugas │
├────────────────────────────────┼─────────────────────────────────────────┤
│ Bantuan Pengembangan Kode      │ Autocomplete sintaksis boilerplates,     │
│                                │ pengecekan tipe data Pydantic, & regex  │
├────────────────────────────────┼─────────────────────────────────────────┤
│ Perancangan Antarmuka          │ Inspirasi palet warna & komponen UI     │
├────────────────────────────────┼─────────────────────────────────────────┤
│ Batasan Integritas Tim         │ 100% ideasi solusi, perancangan         │
│ (Bagian Murni Karya Tim)       │ arsitektur, penyusunan instrumen riset  │
│                                │ survei, sintesis analisis masalah,      │
│                                │ serta kode controller dibuat & dipahami │
│                                │ penuh oleh seluruh anggota tim.         │
└────────────────────────────────┴─────────────────────────────────────────┘
```

Tim menjamin bahwa AI tidak digunakan untuk memalsukan data empiris, tidak digunakan untuk menjawab pertanyaan juri pada sesi *Product Defense*, dan seluruh luaran aplikasi dapat dijelaskan landasan teknologinya secara mandiri dan bertanggung jawab.

---

## 8. Rencana Implementasi & Status Pengembangan Saat Ini

### 8.1 Status Progres Saat Ini (~50% Total Roadmap Pengembangan)
Saat ini sistem telah menyelesaikan seluruh fondasi MVP fungsional Online Round (fase 1), sementara fitur lanjutan dialokasikan untuk Grand Final Sprint:
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

### 8.2 Rencana Pengembangan Sesi Grand Final & Roadmap (11 Oktober 2026)
1. **Product Sprint Sesi I (09.00–12.00 WIB):**
   Implementasi *AI Syllabus & PDF Reader* (ekstraksi instruksi modul tugas PDF/DOCX secara nir-ketik) dan pembagian tugas kelompok cerdas (*Collaborative Task Split*).
2. **Product Sprint Sesi II (13.00–15.00 WIB):**
   Implementasi Always-On Web Push Notification berbasis Service Worker dan kapabilitas Progressive Web App (PWA) Offline-First.
3. **Demo Day & Product Defense (15.45–18.00 WIB):**
   Live walkthrough end-to-end pemecahan instruksi tugas nyata, import cetak biru tugas antar-mahasiswa, dan pembuktian dampak micro-pacing di hadapan dewan juri.
