# 📊 PITCH DECK KILASTUGAS (10 SLIDES)
### SIFest Digital Innovation Challenge 2026: Track Education
**Tim: Jadi H-1**  
**Ketua Tim:** Adridinan Najmi Faza  
**Anggota Tim:** Timotius Willy Narendra, Fardizza Finda Rahman  
**Institusi:** Universitas Jenderal Soedirman  

---

## SLIDE 1: PROBLEM
**Judul:** Task Paralysis pada Penugasan Mahasiswa Perguruan Tinggi  
**Konteks & Fakta Lapangan:**
- Mahasiswa aktif rata-rata menempuh 4-7 mata kuliah per semester dengan instruksi modul padat, panjang, dan abstrak (laporan praktikum, makalah riset, project coding).
- Masalah utama bukan rasa malas, melainkan **Cognitive Overload** dan **Task Paralysis**: kondisi buntu kognitif di mana otak tidak mampu menentukan titik awal aksi (*"where to start"*).
- Dampak langsung: Prokrastinasi tak disengaja berujung pada *panic working* H-1 / H-0 deadline (Sistem Kebut Semalam) yang merusak kualitas akademik dan kesehatan mental.

---

## SLIDE 2: WHY IMPORTANT
**Judul:** Urgensi Masalah & Validasi Data Empiris  
**Triangulasi Validasi:**
1. **Riset Akademis & Kajian Ilmiah:**
   - **Steel (2007), Psychological Bulletin (APA):** Meta-analisis menemukan aversivitas tugas, penundaan, impulsivitas, dan rendahnya *self-efficacy* sebagai pemicu utama prokrastinasi. Mengonfirmasi **80%-95% mahasiswa** melakukan prokrastinasi.
   - **Solomon & Rothblum (1984), J. of Counseling Psychology:** Studi 342 mahasiswa membuktikan prokrastinasi bukan sekadar manajemen waktu buruk, melainkan masalah kognitif, afektif, dan aversivitas tugas.
   - **Gollwitzer & Sheeran (2006):** Rencana aksi konkret berbasis pemicu spesifik berefek sedang-besar (*d = .65*) dalam memicu orang segera memulai tindakan.
2. **Survei Primer Tim Jadi H-1 (28 Mahasiswa Aktif):**
   - **78,6%** sering/selalu menyelesaikan tugas di malam H-1 atau H-0.
   - **64,3%** menunda karena bingung cara memulai dan kewalahan membaca modul panjang (*Task Paralysis*).
   - **53,6%** pernah gagal mengumpulkan tepat waktu hingga terkena penalti nilai.
3. **Urgensi Solusi:** Menghentikan siklus stres berkepanjangan dan penurunan performa akademik mahasiswa melalui panduan ritme kerja harian yang konkret.

---

## SLIDE 3: EXISTING SOLUTION
**Judul:** Lanskap Alat Produktivitas Saat Ini  
**Kategori Solusi yang Digunakan Mahasiswa:**
1. **To-Do List Konvensional:** Todoist, Google Tasks, Apple Reminders, Any.do.
2. **Project Management Kompleks:** Notion, Trello, Asana, ClickUp.
3. **Kalender Pasif:** Google Calendar, Apple Calendar.
4. **Metode Manual:** Catatan di aplikasi memo ponsel atau grup pesan obrolan kelas (WhatsApp/Discord).

---

## SLIDE 4: GAP
**Judul:** Kesenjangan Kritis Solusi yang Ada  
**Mengapa Alat yang Ada Gagal Menyelesaikan Masalah?**
- **Deadline-Centric, Bukan Action-Centric:** Hanya mencatat deadline dan nama tugas, namun membebankan 100% pemecahan langkah kerja kepada mahasiswa yang sedang kewalahan mental.
- **Ketiadaan Visual Micro-Pacing:** Tidak ada panduan pacing harian tentang berapa porsi kerja aman hari ini agar tugas tidak menumpuk di hari terakhir.
- **Friksi Awal (Setup Fatigue):** Notion/Trello menuntut pengaturan manual rumit (database, board, tags) sebelum kerja dimulai.
- **Temuan Survei:** 67,9% mahasiswa memakai to-do list, tetapi **57,1% merasa tidak efektif** untuk mengeksekusi tugas secara nyata.

---

## SLIDE 5: OUR SOLUTION
**Judul:** KilasTugas: Smart Actionable Task Breakdown & Micro-Pacing  
**Filosofi:** *"Problem First, Technology Second: Jangan tanya 'kapan selesai', tanyakan 'apa yang dikerjakan hari ini'."*  
**Empat Pilar Solusi Utama:**
1. **Actionable AI Chunking:** Memecah modul instruksi tebal menjadi 3-8 sub-tugas terukur (<60 karakter) berdurasi 25-90 menit.
2. **Visual Micro-Pacing:** Circular Progress Ring dinamis yang memberi sinyal status langsung (*On Track*, *Behind Schedule*, *Overdue Alert*).
3. **Deep Focus Engine:** Pomodoro Timer 25/5 persisten di background dengan floating widget dan notifikasi suara/desktop.
4. **Task Blueprint Sharing (/p/:id):** Sekali perwakilan kelas menyusun dekomposisi tugas, rekan sekelas dapat mengimpor seluruh jadwal tugas dalam 1 detik.

---

## SLIDE 6: DEMO
**Judul:** Alur Produk & Pengalaman Eksekusi Pengguna  
**Tahapan Interaksi KilasTugas:**
1. **Quick Input:** Masukkan nama mata kuliah, deadline, paste deskripsi instruksi, pilih jumlah target langkah (3-8 langkah atau auto AI).
2. **Instant Decomposition:** Mesin inferensi menyusun alur aksi harian dengan target waktu dan estimasi menit yang realistis.
3. **Today's Focus View:** Mahasiswa hanya melihat aksi spesifik yang perlu dikerjakan hari ini tanpa distraksi beban masa depan.
4. **Persistent Pomodoro Execution:** Klik satu tombol untuk masuk ke sesi fokus 25 menit dengan countdown di tab browser dan audio synthesizer chime.
5. **Ecosystem Integration:** 1-klik ekspor ke Google Calendar & format iCalendar (.ics) dengan alarm bawaan perangkat.

---

## SLIDE 7: TECHNOLOGY
**Judul:** Arsitektur Ringan, Skalabel, dan Zero Downtime  
**Mengapa KilasTugas Bukan Sekadar AI Chatbot / Wrapper Biasa:**
- **AI Inference Engine (9Router & Gemini):**
  - Menggunakan **9Router AI Gateway** (OpenAI-compatible async client) terhubung ke **Google Gemini (ag/gemini-3.7-flash-medium)**.
  - Output langsung diparsing ke skema JSON murni (<60 karakter/langkah, durasi menit terukur, kalkulasi target day offset), bukan teks obrolan lepas.
- **Execution Engine Terintegrasi:**
  - Tiap sub-tugas otomatis terpasang ke **Visual Progress Gauge** matematis harian (On Track / Behind Schedule) dan mesin **Persistent Pomodoro Timer**.
- **Resilience, Smart Cache, & Zero Downtime:**
  - **Smart Caching (<20ms):** Modul tugas serupa sekelas langsung disajikan instan dari basis data MariaDB tanpa memakan kuota token AI.
  - **Deterministic Fallback Engine:** Saat koneksi LLM timeout/down, sistem otomatis beralih ke preset template kurikulum terkurasi (Lab, Teori, Coding, Presentasi). Aplikasi tetap 100% fungsional.

---

## SLIDE 8: BUSINESS MODEL
**Judul:** Model Keberlanjutan & Efisiensi Operasional (Social Open-Access)  
**Pendekatan Keberlanjutan Tanpa Beban Finansial ke Mahasiswa:**
1. **Model Social Open-Access (Zero-Barrier Adoption):**
   - Menghilangkan paywall dan hambatan pendaftaran akun (Guest Mode). Fokus utama adalah penetrasi massal dan adopsi luas di kalangan mahasiswa.
2. **Efisiensi Infrastruktur Ekstrem (Ultra-Low Operating Cost):**
   - **Smart Caching Engine:** Menghilangkan pemanggilan LLM berulang untuk modul tugas yang sama antarmahasiswa sekelas, memangkas biaya token AI hingga 70%.
   - **Stack Hemat Sumber Daya:** Static Single Page App di Vercel Global Edge CDN gratis + Backend asinkronus FastAPI di VPS mandiri berbiaya minimal.
3. **Keberlanjutan Institusional (Campus & Faculty Partnership):**
   - Integrasi monitoring akademik dengan prodi/fakultas untuk menurunkan angka keterlambatan pengumpulan tugas mahasiswa.
   - Pendanaan operasional melalui program hibah inovasi teknologi, PKM, atau dukungan komputasi institusi perguruan tinggi.

---

## SLIDE 9: IMPACT
**Judul:** Metrik & Dampak Terukur Solusi  
**Capaian & Tolok Ukur Keberhasilan:**
1. **Eliminasi Task Paralysis:** Memangkas waktu inisiasi tugas dari rata-rata 3-5 hari menjadi <5 menit setelah menerima silabus tugas.
2. **Reduksi Stres Akademik:** Menghilangkan budaya Sistem Kebut Semalam melalui pencicilan beban kerja harian yang sehat.
3. **Peningkatan Rasio Penyelesaian:** Target peningkatan ketepatan waktu pengumpulan tugas sebesar 40% bagi mahasiswa pengguna aktif.
4. **Social Academic Network:** Efek viralitas edukasi melalui fitur berbagi *Task Blueprint*, memudahkan kolaborasi belajar lintas kelompok.

---

## SLIDE 10: ROADMAP
**Judul:** Peta Jalan Pengembangan Produk  
**Tahapan Eksekusi:**
- **Tahap 1 (Saat Ini: MVP Online Round):**
  - AI Task Decomposition terarah (3-8 langkah).
  - Visual Micro-Pacing ring & Status tracking.
  - Persistent Pomodoro Timer & Floating pill widget.
  - Task Blueprint Sharing URL (/p/:id) & Calendar export (.ics / Google Calendar).
- **Tahap 2 (Grand Final Online Sprint):**
  - **AI Syllabus & PDF Reader:** Ekstraksi modul tugas tebal via drag-and-drop file.
  - **Always-on Web Push:** Notifikasi berbasis Service Worker (VAPID) saat browser ditutup.
  - **PWA Offline-First:** Dukungan IndexedDB untuk akses nir-kuota internet.
