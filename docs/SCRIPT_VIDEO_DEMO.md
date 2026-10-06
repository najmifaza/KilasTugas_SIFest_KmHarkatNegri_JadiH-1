# Naskah & Panduan Perekaman Video Demo KilasTugas
## SIFest Digital Innovation Challenge 2026 (Track: Education)

* **Nama Berkas Video Final:** `TimKilasTugas_KilasTugas_VideoDemo.mp4`
* **Target Durasi:** 5 menit 30 detik – 6 menit (Batas maksimal Guidebook: 10 menit)
* **Format Video:** 1080p (1920x1080), 30/60 fps, Aspek Rasio 16:9
* **Platform Upload:** YouTube (Setelan Privasi: *Unlisted*)
* **Presenter:** Adridinan Najmi Faza (Ketua Tim) / Perwakilan Tim KilasTugas

---

## Persiapan Sebelum Rekam (Pre-Recording Checklist)

1. **Persiapan Browser:**
   - Buka `https://kilastugas.vercel.app` (atau `localhost:5173` jika offline).
   - Bersihkan data demo sebelumnya (`localStorage.clear()`) agar status awal bersih (*fresh start*).
   - Pastikan zoom browser 100%, sembunyikan bookmark bar (`Ctrl + Shift + B`).
   - Nyalakan izin suara (Web Audio chime) dan izin notifikasi browser.
2. **Persiapan Perangkat & Audio:**
   - Gunakan mikrofon eksternal / headset dengan input jernih tanpa gema.
   - Sediakan pencahayaan depan yang cukup untuk webcam pembicara (posisi kanan bawah layar atau split screen saat intro/outro).
3. **Contoh Tugas Nyata yang Diinputkan:**
   - **Mata Kuliah:** Jaringan Komputer
   - **Judul:** Laporan Akhir Praktikum Routing Dinamis OSPF & VLSM
   - **Batas Waktu (Deadline):** 5 hari dari hari ini (pilih tanggal jam 23.59)
   - **Instruksi / Modul:**
     > "Susun laporan lengkap praktikum jaringan 5 bab: bab 1 topologi jaringan, bab 2 perhitungan subnetting VLSM 4 subnet, bab 3 konfigurasi router OSPF di Cisco Packet Tracer, bab 4 uji ping & tabel routing, bab 5 kesimpulan dan analisis error."
   - **Pilihan Langkah:** Otomatis AI (atau custom 5 langkah).

---

## Naskah Lengkap (Word-by-Word Script) & Panduan Visual

### SCENE 1: HOOK & MASALAH NYATA (00:00 – 01:15)
* **Visual:** Kamera pembicara (full screen) atau split dengan cuplikan dokumen modul tugas PDF tebal (15 halaman) dan tumpukan to-do list penuh tanda panik.
* **Fokus Penilaian Juri:** *Problem Identification (25%) & Problem Validation (15%)*

| Waktu | Aksi Visual di Layar | Naskah Pembicara (Kata per Kata) |
|---|---|---|
| **00:00 - 00:20** | Kamera fokus ke wajah pembicara. Di layar muncul judul: *KilasTugas - SIFest 2026*. | *"Halo dewan juri SIFest 2026 dan rekan-rekan semua. Saya Adridinan Najmi Faza, ketua tim pengembang KilasTugas dari Universitas Jenderal Soedirman. Pernahkah Anda memperhatikan pola mahasiswa saat menerima tugas kuliah yang tebal dan rumit? Mereka bukan tidak mau mengerjakan, tapi sering kali berhenti bahkan sebelum mengetik satu kata pun."* |
| **00:20 - 00:45** | Tampilkan teks kutipan wawancara mahasiswa & modul PDF tebal di layar. | *"Kondisi psikologis ini dinamakan **Task Paralysis** atau **Overwhelm Freeze**. Otak mahasiswa mengalami cognitive overload ketika membaca instruksi silabus belasan halaman. Mereka terjebak pada satu pertanyaan mendasar: 'Saya harus mulai dari mana?'"* |
| **00:45 - 01:15** | Grafis infografis: 78,6% sistem kebut semalam, 64,3% bingung mulai dari mana (Survei 28 Mahasiswa S&T). | *"Kami memvalidasi masalah ini melalui survei lapangan terhadap 28 mahasiswa aktif sains dan teknologi. Hasilnya: **78,6%** mahasiswa mengaku sering mengerjakan tugas di malam H-1 deadline. Dan **64,3%** menegaskan alasan utamanya bukan karena malas, melainkan kewalahan membedah instruksi tugas. Aplikasi to-do list konvensional gagal menjawab ini karena hanya bersifat pasif dan deadline-centric—mencatat tanggal mati tanpa pernah memberi tahu berapa porsi aman yang harus dikerjakan hari ini."* |

---

### SCENE 2: FILOSOFI & PENGENALAN KILASTUGAS (01:15 – 01:45)
* **Visual:** Transisi ke antarmuka `kilastugas.vercel.app`. Kamera pembicara pindah ke sudut kanan bawah (*picture-in-picture*).
* **Fokus Penilaian Juri:** *Solution & Innovation (30%)*

| Waktu | Aksi Visual di Layar | Naskah Pembicara (Kata per Kata) |
|---|---|---|
| **01:15 - 01:45** | Layar menampilkan dashboard KilasTugas. Kamera PiP pembicara. | *"Untuk mengeliminasi Task Paralysis, kami membangun **KilasTugas**: platform cerdas dekomposisi tugas kuliah dan micro-pacing harian untuk mahasiswa. Filosofi kami sederhana: **Problem First, Technology Second**. Jangan tanya 'kapan tugas ini harus selesai', tapi tanyakan 'apa aksi konkret 30 menit yang bisa diselesaikan hari ini'. Mari kita lihat langsung bagaimana KilasTugas bekerja."* |

---

### SCENE 3: LIVE DEMO INTI — INPUT & AI BREAKDOWN (01:45 – 03:15)
* **Visual:** Layar browser full HD. Kursor terlihat jelas mengklik tombol dan mengetik form.
* **Fokus Penilaian Juri:** *User Experience (10%) & Technical Implementation (10%)*

| Waktu | Aksi Visual di Layar | Naskah Pembicara (Kata per Kata) |
|---|---|---|
| **01:45 - 02:10** | Klik tombol **+ Tambah Tugas**. Modal input terbuka. Ketik judul tugas, pilih kategori `Praktikum`, deadline 5 hari ke depan, dan paste deskripsi instruksi. | *"Di sini saya masuk sebagai mahasiswa yang baru saja mendapatkan tugas praktikum jaringan komputer. Saya klik Tambah Tugas. Masukkan mata kuliah Jaringan Komputer, judul Laporan Routing OSPF & VLSM, deadline Jumat minggu ini, lalu tempel instruksi praktikum dari dosen. Di KilasTugas, mahasiswa bisa membiarkan AI menentukan jumlah langkah ideal, atau memilih target langkah kerja sendiri—misalnya 5 langkah."* |
| **02:10 - 02:30** | Klik tombol biru **Pecah Tugas Jadi Aksi Harian**. Tunjukkan loading sebentar (<2 detik), lalu daftar sub-tugas muncul rapi di layar. | *"Sekarang, perhatikan tombol 'Pecah Tugas Jadi Aksi Harian'. Dalam waktu kurang dari dua detik, mesin inferensi AI kami berhasil membedah instruksi yang rumit tadi menjadi 5 aksi kerja konkret berurutan. Setiap langkah memiliki kata kerja aktif, estimasi durasi realistis 30 sampai 60 menit, serta target hari kerja yang terdistribusi merata menuju tanggal pengumpulan."* |
| **02:30 - 02:55** | Scroll pada kartu tugas. Tunjukkan detail sub-tugas 1 sampai 5. Klik salah satu sub-tugas untuk membuka modal detail atau inline edit. | *"Langkah pertama: 'Hitung alokasi IP VLSM 4 subnet' dengan durasi 45 menit untuk Hari Ini. Bukan instruksi abstrak, melainkan instruksi yang langsung bisa dikerjakan. Jika ada langkah yang ingin disesuaikan, mahasiswa dapat mengedit judul, mengubah durasi, menghapus, atau menambahkan langkah manual secara mandiri lewat antarmuka yang fleksibel ini."* |
| **02:55 - 03:15** | Arahkan kursor ke **Circular Progress Gauge** di atas dan indikator badge `On Track` hijau pada kartu tugas. | *"Perhatikan juga indikator **Visual Micro-Pacing**. Status tugas ditandai dengan badge hijau **On Track**. Mahasiswa tidak lagi hidup dalam ilusi waktu luang semu, karena sistem langsung memberitahu apakah ritme kerja harian mereka berada di jalur aman atau mulai tertinggal."* |

---

### SCENE 4: EKSEKUSI FOKUS, KALENDER & BLUEPRINT SHARING (03:15 – 04:30)
* **Visual:** Interaksi dengan Floating Pomodoro Timer, centang checklist, download berkas `.ics`, dan fitur share blueprint.
* **Fokus Penilaian Juri:** *User Experience (10%) & Solution & Innovation (30%)*

| Waktu | Aksi Visual di Layar | Naskah Pembicara (Kata per Kata) |
|---|---|---|
| **03:15 - 03:45** | Klik ikon jam/play pada Sub-tugas 1. Floating Pomodoro Timer muncul di bawah layar dan mulai berdetik. Tunjukkan tab title browser ikut countdown. | *"Setelah tugas dipecah, bagaimana mahasiswa mulai bertindak? KilasTugas menyediakan **Deep Focus Engine**. Cukup klik tombol fokus pada langkah hari ini, dan Floating Pomodoro Timer 25 menit langsung aktif di bagian bawah layar. Timer ini berjalan persisten dengan akurasi timestamp real-time, menyinkronkan countdown ke judul tab browser, dan membunyikan chime audio Web Audio API saat sesi tuntas."* |
| **03:45 - 04:05** | Klik checkbox centang pada Sub-tugas 1. Terdengar efek chime ringan dan Progress Ring langsung naik dari 0% ke 20%. | *"Ketika langkah pertama selesai, mahasiswa tinggal mencentang sub-tugas. Progress bar dan ring seketika naik secara real-time, memberi kepuasan psikologis dan momentum untuk melanjutkan ke langkah berikutnya."* |
| **04:05 - 04:30** | Buka menu kartu: klik **Buka di Google Calendar** atau **Unduh .ics**. Lalu klik tombol **Bagikan Rencana Tugas** dan tunjukkan tautan blueprint `/p/:id`. | *"Agar sinkron dengan rutinitas harian, rencana aksi ini dapat diekspor langsung ke **Google Calendar** atau diunduh sebagai berkas `.ics` standar RFC 5545 dengan alarm pengingat otomatis. Lebih menarik lagi, ada fitur **Task Blueprint Sharing**. Satu mahasiswa yang telah menyusun breakdown dapat membagikan tautan unik tugas ini ke teman sekelasnya, sehingga rekan satu angkatan bisa mengimpor seluruh rencana kerja ini ke akun mereka hanya dengan satu klik."* |

---

### SCENE 5: ARSITEKTUR TEKNOLOGI & ZERO-DOWNTIME (04:30 – 05:15)
* **Visual:** Diagram arsitektur sistem (bisa menggunakan diagram dari `docs/Diagram_KilasTugas.drawio.xml` atau cuplikan kode backend FastAPI).
* **Fokus Penilaian Juri:** *Technical Implementation (10%)*

| Waktu | Aksi Visual di Layar | Naskah Pembicara (Kata per Kata) |
|---|---|---|
| **04:30 - 04:55** | Tampilkan slide/diagram arsitektur: Client (React Vite Vercel) -> FastAPI Backend -> MariaDB + Smart Cache + 9Router AI. | *"Dari sisi arsitektur teknis, KilasTugas dirancang dengan prinsip efisiensi komputasi dan keandalan tinggi. Frontend dibangun dengan React 18, Vite, dan Tailwind CSS dengan ukuran bundle ultra-ringan di bawah 90 kilobyte. Backend ditenagai FastAPI Python 3.12 asinkronus yang terhubung ke MariaDB dan gateway inferensi 9Router Gemini."* |
| **04:55 - 05:15** | Tunjukkan highlight diagram: Smart Caching (<20ms) & Fallback Presets. | *"Kami menerapkan dua lapisan keandalan utama: Pertama, **Smart Caching**—jika tugas dengan silabus serupa pernah dipecahkan sebelumnya, sistem mengembalikan cetak biru dalam waktu kurang dari 20 milidetik tanpa memakan kuota token AI. Kedua, **Deterministic Fallback Engine**—jika koneksi AI terputus, sistem beralih mulus ke kurasi template kurikulum bawaan, memastikan zero-downtime bagi pengguna."* |

---

### SCENE 6: ROADMAP GRAND FINAL & PENUTUP (05:15 – 05:45)
* **Visual:** Kamera pembicara kembali full screen / side-by-side dengan logo KilasTugas dan mockup aplikasi di HP.
* **Fokus Penilaian Juri:** *Presentation & Demo (10%)*

| Waktu | Aksi Visual di Layar | Naskah Pembicara (Kata per Kata) |
|---|---|---|
| **05:15 - 05:35** | Tampilkan poin roadmap Grand Final: 1. AI Syllabus PDF/DOCX Reader, 2. Collaborative Group Task Split, 3. Offline PWA. | *"Saat ini KilasTugas telah berfungsi penuh sebagai MVP Online Round sekitar 50% dari total roadmap produk. Pada tahap Grand Final Product Sprint mendatang, kami siap menyempurnakannya dengan modul AI Syllabus Reader untuk mengekstrak tugas langsung dari berkas PDF/DOCX dosen, serta fitur Collaborative Group Task Split untuk pembagian kerja kelompok."* |
| **05:35 - 05:45** | Teks penutup: Nama Tim KilasTugas, Universitas Jenderal Soedirman, link repo & Vercel. | *"KilasTugas hadir agar tidak ada lagi mahasiswa yang gagal mencapai potensi akademiknya hanya karena bingung harus mulai dari mana. Terima kasih kepada dewan juri SIFest 2026. Dari Tim KilasTugas Universitas Jenderal Soedirman, salam inovasi!"* |

---

## Ringkasan Alur Durasi Video

```
00:00 ── [ 01:15 ] ── Scene 1: Hook, Task Paralysis, Data Survei 28 Mahasiswa
01:15 ── [ 00:30 ] ── Scene 2: Filosofi Solusi & Pengenalan KilasTugas
01:45 ── [ 01:30 ] ── Scene 3: Live Walkthrough (Input Tugas & AI Breakdown)
03:15 ── [ 01:15 ] ── Scene 4: Pomodoro Focus Timer, Pacing & Blueprint Sharing
04:30 ── [ 00:45 ] ── Scene 5: Arsitektur Backend, Smart Cache & Zero-Downtime
05:15 ── [ 00:30 ] ── Scene 6: Roadmap Grand Final & Closing Statement
─────────────────────────────────────────────────────────────────────────────
TOTAL DURASI: ~5 Menit 45 Detik (Sangat ideal, padat, dan di bawah batas 10 menit)
```
