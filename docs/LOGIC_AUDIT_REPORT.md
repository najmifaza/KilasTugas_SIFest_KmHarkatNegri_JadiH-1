# ⚖️ Laporan Hasil Audit Logika & Arsitektur KilasTugas
**Logic Auditor (v6.0) — AGENTS-OS Core Handshake Report**

* **Aplikasi:** KilasTugas — *Smart Actionable Task Breakdown & Micro-Pacing for Students*
* **Repositori:** `najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1`
* **Waktu Audit Pertama:** 11 Oktober 2026, 12:39 WIB (commit `7bb8d7e`)
* **Re-Audit:** 11 Oktober 2026, 13:02 WIB — Verifikasi perbaikan pada commit `74678d4` & `fd13e76`
* **Status Audit:** `Handshake Verified: Plan-Alignment and Math-Consistency checked.`
* **Mode Eksekusi:** Read-Only Audit (Tidak ada modifikasi kode pada repositori sumber)

---

## 1. Ringkasan Eksekutif (Executive Summary)

Audit logika menyeluruh telah dilakukan menggunakan modul **Logic Auditor v6.0** (`tkogut/agents-os-core`). Audit berfokus pada:
1. **Konsistensi Matematis & Penanganan Waktu**: Evaluasi akurasi perhitungan deadline, micro-pacing offset, drift zona waktu UTC-ke-Naive, dan formula progress bar.
2. **Integritas Sinkronisasi Offline-First (LWW)**: Evaluasi keandalan antrean IndexedDB dan mekanisme resolusi konflik Last-Write-Wins di backend.
3. **Arsitektur & Integritas Data**: Evaluasi kesesuaian antara skema database MariaDB, Pydantic schema, dan model data frontend.
4. **Desain Antarmuka & Layering Z-Index**: Identifikasi potensi tabrakan z-index, elemen interaktif mobile, dan penamaan kategori antarmuka.

---

## 1.5. Status Verifikasi Perbaikan (Re-Audit — commit `74678d4` & `fd13e76`)

> [!IMPORTANT]
> Re-audit dilakukan pada 11 Oktober 2026, 13:02 WIB terhadap kode terbaru setelah developer menerapkan perbaikan. Setiap temuan diperiksa ulang terhadap diff aktual yang masuk ke branch `main`.

| ID | Status | Catatan Verifikasi |
| :--- | :--- | :--- |
| **LOGIC-01** | ✅ **Fixed** | `isOverdue` diubah ke `deadlineDate.getTime() < now.getTime()`. Benar dan lengkap. |
| **LOGIC-02** | ✅ **Fixed** | Fungsi `to_server_naive()` menambahkan `astimezone(_wib).replace(tzinfo=None)` sebelum LWW comparison. Benar. |
| **LOGIC-03** | ✅ **Fixed** | `getPendingMutations()` kini mengurutkan hasil `getAll()` berdasarkan `client_timestamp` secara kronologis. |
| **LOGIC-04** | ✅ **Fixed** | Deadline dikirim sebagai string lokal `${form.date}T${form.time}:00` (tanpa `.toISOString()`). Drift UTC hilang. |
| **LOGIC-05** | ✅ **Fixed** | `todayStr` diganti ke `new Date().toLocaleDateString('sv')`. |
| **LOGIC-06** | ✅ **Fixed** | Formula baris 115 diseragamkan menggunakan `max(days_left - 1, 0)`. |
| **LOGIC-07** | ✅ **Fixed** | `scored_chunks.sort(key=lambda x: x[0], reverse=True)` ditambahkan sebelum iterasi. |
| **LOGIC-08** | ✅ **Fixed** | `DELETE /subtasks` kini membaca `task_id` terlebih dahulu lalu meng-UPDATE `tasks.is_completed` setelah hapus. |
| **LOGIC-09** | ✅ **Fixed** | `db.py` dan `ai.py` kini menggunakan fallback `or os.getenv(...)`. |
| **LOGIC-10** | ✅ **Fixed** | `z-50` pada banner diubah menjadi `z-40`. |
| **LOGIC-11** | ✅ **Fixed** | Transisi ke break state saat timer expired kini berjalan konsisten baik dengan subtask maupun tanpa subtask terpilih. |
| **LOGIC-12** | ✅ **Fixed** | `useEffect` clamp `focusedTaskIndex` ditambahkan dengan dependensi `filteredTasks.length`. |
| **LOGIC-13** | ✅ **Fixed** | `t.progress_percent` dihapus dari SELECT; nilai dihitung manual di Python setelah `fetchone()`. |
| **LOGIC-14** | ✅ **Fixed** | `d.toLocaleDateString('sv')` dipakai untuk field tanggal deadline di mode edit. |
| **LOGIC-15** | ✅ **Fixed** | `handleTaskUpdated` kini menghitung ulang `progress_percent` dari `subtasks_total` dan `subtasks_done` setelah spread merge. |

**Ringkasan: 15 dari 15 temuan berhasil diperbaiki (100% Fixed).**

---

## 2. Ringkasan Temuan Cepat (Caveman-Review Format)

```text
frontend/src/components/TaskCard.jsx: L386: bug Overdue calculation uses Math.ceil() causing sub-day delays to evaluate to -0 (false). Change to (deadlineDate < now) or diffHours < 0.
backend/routers/tasks.py: L254: bug client_timestamp stripped of tzinfo creates naive UTC comparison against server local timestamp in LWW. Convert client UTC to local naive or use UTC timestamps consistently in MariaDB.
frontend/src/offlineStore.js: L31: bug mutation_queue keyed by random UUID returns items in non-chronological order via getAll(). Add timestamp index and sort mutations before applying LWW.
frontend/src/components/TaskCard.jsx: L390: bug todayStr uses new Date().toISOString().slice(0, 10) giving UTC date instead of local date, failing overdue subtask check between 00:00-07:00 WIB. Use local date string formatting.
frontend/src/components/TaskInputModal.jsx: L190: bug Deadline sent as UTC ISO string without server timezone awareness shifts task deadline by -7 hours when read back as naive datetime. Persist and return deadlines with explicit timezone offset or ISO 'Z'.
backend/routers/breakdown.py: L115: bug Smart cache target_day_offset multiplies by days_left instead of (days_left - 1), scheduling final step beyond deadline date. Align with line 193 using max(days_left - 1, 0).
backend/routers/syllabus.py: L55: bug sliding_window_filter does not sort chunks by instruction score, causing early zero-score paragraphs to crowd out actual grading rubrics. Filter score > 0 and sort descending by score before truncation.
backend/routers/subtasks.py: L100: risk DELETE /subtasks/{subtask_id} deletes subtask without recalculating tasks.is_completed or updating tasks.updated_at. Trigger parent task status refresh query on delete.
backend/config/db.py: L17: nit Environment variable DB_PASS in code mismatches DB_PASSWORD documented in README.md. Support DB_PASSWORD as fallback in os.getenv().
backend/config/ai.py: L8: nit AI base URL reads NINE_ROUTER_URL in code instead of AI_API_BASE documented in README.md. Support AI_API_BASE as fallback in os.getenv().
frontend/src/components/InstallPromptBanner.jsx: L82: nit z-50 on banner conflicts with modal backdrops (z-50) and renders above active modals. Lower banner to z-40 or check if modal is open.
frontend/src/components/TaskInputModal.jsx: L8: nit Hardcoded category label 'Website Redesign' for coding category mismatches CATEGORY_MAP 'Projek Coding'. Use CATEGORY_MAP consistently.
frontend/src/App.jsx: L94: nit Timer state resets to default 25m if user returns after timer expired while browser closed. Trigger completion chime and break state on resume when diff <= 0.
frontend/src/App.jsx: L474: nit focusedTaskIndex is not clamped when task list is filtered, causing keyboard shortcut 'C' to fail silently if index out of bounds. Clamp focusedTaskIndex to filteredTasks.length - 1.
backend/routers/tasks.py: L98: bug PATCH /tasks/{task_id} SELECT query references non-existent column t.progress_percent causing SQL 1054 error (500 crash) on every task edit save. Remove column from SELECT or calculate it via SUM/COUNT.
frontend/src/components/TaskInputModal.jsx: L73: bug Edit mode reads deadline date via d.toISOString().slice(0,10) (UTC) but time via d.toTimeString().slice(0,5) (local), mixing timezones and causing date to shift -1 day for deadlines before 07:00 WIB. Use consistent local formatting for both date and time.
frontend/src/App.jsx: L411: nit handleTaskUpdated spreads updatedTask from backend which lacks progress_percent field; task card and HeroOverview gauge render NaN% until page reload. Recalculate progress_percent from subtasks_done/subtasks_total after merge.
```

---

## 3. Matriks Temuan & Klasifikasi Risiko

| ID | Komponen / Berkas | Severity | Kategori | Ringkasan Masalah |
| :--- | :--- | :--- | :--- | :--- |
| **LOGIC-01** | `frontend/src/components/TaskCard.jsx:386` | **BUG (High)** | Math / Time | Logika `isOverdue` gagal jika deadline terlewat <24 jam (`Math.ceil` menghasilkan `-0`). |
| **LOGIC-02** | `backend/routers/tasks.py:254` | **BUG (High)** | LWW Sync | Waktu mutasi offline UTC dibandingkan langsung dengan waktu lokal server, menyebabkan mutasi offline ditolak. |
| **LOGIC-03** | `frontend/src/offlineStore.js:31` | **BUG (High)** | Data Integrity | Antrean mutasi offline di-key dengan UUID acak, menyebabkan urutan eksekusi mutasi tidak kronologis. |
| **LOGIC-04** | `frontend/src/components/TaskInputModal.jsx:190` | **BUG (High)** | Datetime Drift | Deadline dikirim sebagai UTC namun disimpan sebagai naive di MariaDB, menyebabkan pergeseran -7 jam saat diakses kembali. |
| **LOGIC-05** | `frontend/src/components/TaskCard.jsx:390` | **BUG (Medium)** | Timezone | Deteksi langkah tertunda (`todayStr`) memakai UTC tanggal, meleset pada jam 00:00–07:00 WIB. |
| **LOGIC-06** | `backend/routers/breakdown.py:115` | **BUG (Medium)** | Pacing Math | Smart cache mendistribusikan langkah kerja hingga melampaui tanggal deadline (melewati H+1). |
| **LOGIC-07** | `backend/routers/syllabus.py:55` | **BUG (Medium)** | NLP Heuristic | Filter sliding window tidak mengurutkan berdasarkan skor instruksi, memotong rubrik penilaian di halaman akhir. |
| **LOGIC-08** | `backend/routers/subtasks.py:100` | **RISK (Medium)** | State Consistency | Menghapus sub-tugas tidak memperbarui status `is_completed` pada tugas induk. |
| **LOGIC-09** | `backend/config/db.py:17` & `ai.py:8` | **NIT (Low)** | Configuration | Nama environment variable di kode (`DB_PASS`, `NINE_ROUTER_URL`) tidak cocok dengan `README.md`. |
| **LOGIC-10** | `frontend/src/components/InstallPromptBanner.jsx:82` | **NIT (Low)** | UI Layering | Z-index `z-50` bertabrakan dengan modal backdrop sehingga banner instalasi muncul di atas modal terbuka. |
| **LOGIC-11** | `frontend/src/App.jsx:94` | **NIT (Low)** | State Persistence | Timer Pomodoro yang habis saat tab ditutup langsung reset ke 25 menit tanpa transisi ke status istirahat. |
| **LOGIC-12** | `frontend/src/App.jsx:474` | **NIT (Low)** | Accessibility | Shortcut keyboard 'C' tidak merespons jika filter tugas berubah dan index berada di luar batas. |
| **LOGIC-13** | `backend/routers/tasks.py:98` | **BUG (High)** | Fatal SQL Error | Endpoint PATCH edit tugas meng-SELECT kolom `t.progress_percent` yang tidak ada di skema MariaDB → HTTP 500 crash pada setiap penyimpanan edit. |
| **LOGIC-14** | `frontend/src/components/TaskInputModal.jsx:73` | **BUG (Medium)** | Datetime Drift | Mode edit membaca tanggal deadline dari UTC (`toISOString`) tapi jam dari waktu lokal (`toTimeString`), menyebabkan tanggal deadline mundur 1 hari untuk deadline sebelum 07:00 WIB. |
| **LOGIC-15** | `frontend/src/App.jsx:411` | **NIT (Low)** | State Staleness | Objek task hasil edit tidak memiliki `progress_percent` yang dihitung ulang, membuat gauge `HeroOverview` dan progress bar kartu menampilkan `NaN%` hingga halaman di-refresh. |

---

## 4. Analisis Teknis & Solusi Rekomendasi

### LOGIC-01: Perhitungan Status Terlewat (Overdue)
* **Lokasi:** `frontend/src/components/TaskCard.jsx`, Baris 386–388
* **Akar Masalah:**
  ```javascript
  const deadlineDate = new Date(task.deadline)
  const now = new Date()
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))
  const isOverdue = diffDays < 0 && !isAllDone
  ```
  Ketika `deadlineDate - now` berada di antara `-86400000 ms` dan `0 ms` (misal deadline terlambat 3 jam hari ini), hasil pembagian adalah pecahan negatif seperti `-0.125`. Fungsi `Math.ceil(-0.125)` menghasilkan `-0`. Dalam spesifikasi JavaScript IEEE 754, `-0 < 0` bernilai `false`.
* **Dampak:** Tugas yang sudah melewati tenggat waktu pada hari yang sama tetap dilabeli "Hari ini" dan "Mendekati Deadline", bukan "Terlewat".
* **Rekomendasi Solusi:**
  ```javascript
  const isOverdue = !isAllDone && (deadlineDate.getTime() < now.getTime())
  ```

---

### LOGIC-02: Resolusi Konflik LWW pada Mutasi Offline
* **Lokasi:** `backend/routers/tasks.py`, Baris 254–265
* **Akar Masalah:**
  ```python
  c_time = m.client_timestamp.replace(tzinfo=None) if m.client_timestamp.tzinfo else m.client_timestamp
  if not server_updated or c_time >= server_updated:
  ```
  `m.client_timestamp` dibuat browser dalam format UTC ISO string (`2026-10-11T05:00:00Z`). Menghapus `tzinfo` tanpa konversi zona waktu menghasilkan naive datetime `05:00:00`. Sementara `server_updated` dari MariaDB menggunakan waktu server lokal (WIB, UTC+7) yaitu `12:00:00`.
* **Dampak:** Kondisi `c_time >= server_updated` mengevaluasi `05:00:00 >= 12:00:00` yang selalu `False`. Data mutasi offline yang dikirim pengguna ditolak diam-diam oleh server.
* **Rekomendasi Solusi:**
  Konversikan `client_timestamp` ke waktu server sebelum membandingkan, atau gunakan UTC secara menyeluruh pada konfigurasi session MariaDB:
  ```python
  # Jika server menggunakan waktu lokal (cth. UTC+7)
  c_time = m.client_timestamp.astimezone().replace(tzinfo=None) if m.client_timestamp.tzinfo else m.client_timestamp
  ```

---

### LOGIC-03: Urutan Eksekusi Antrean Mutasi IndexedDB
* **Lokasi:** `frontend/src/offlineStore.js`, Baris 31, 63–69, 115–121
* **Akar Masalah:**
  Objek antrean mutasi menggunakan `id` (random UUID) sebagai `keyPath`:
  ```javascript
  db.createObjectStore('mutation_queue', { keyPath: 'id' })
  ```
  Pemanggilan `getAll()` pada object store mengambil data terurut berdasarkan key (`id` berupa UUID acak).
* **Dampak:** Urutan mutasi yang diproses saat online kembali bukan berdasarkan kronologi kejadian (`client_timestamp`), melainkan string UUID. Operasi mutasi yang cepat (cth: centang, lalu batal centang) berisiko tereksekusi secara terbalik.
* **Rekomendasi Solusi:**
  Buat index timestamp pada object store:
  ```javascript
  const mutStore = db.createObjectStore('mutation_queue', { keyPath: 'id' })
  mutStore.createIndex('by_timestamp', 'client_timestamp', { unique: false })
  ```
  Dan lakukan pengurutan `.sort((a, b) => new Date(a.client_timestamp) - new Date(b.client_timestamp))` sebelum diterapkan atau dikirim ke backend.

---

### LOGIC-04: Pergeseran Waktu Tenggat (Datetime Drift 7 Jam)
* **Lokasi:** `frontend/src/components/TaskInputModal.jsx:190` & `backend/routers/tasks.py:26`
* **Akar Masalah:**
  1. Frontend membuat deadline UTC ISO: `new Date('2026-10-14T10:00:00').toISOString()` -> `2026-10-14T03:00:00.000Z`.
  2. MariaDB kolom `deadline` berjenis `DATETIME` (tanpa timezone), sehingga menyimpan nilai numerik `2026-10-14 03:00:00`.
  3. FastAPI mengembalikan nilai naive tersebut ke frontend sebagai string `"2026-10-14T03:00:00"` (tanpa 'Z').
  4. Frontend membaca string tanpa 'Z' sebagai waktu lokal 03:00 AM (mundur 7 jam dari 10:00 AM).
* **Dampak:** Jam tenggat tugas bergeser 7 jam lebih awal di antarmuka pengguna dan ekspor kalender.
* **Rekomendasi Solusi:**
  Sertakan offset zona waktu atau simpan dalam format timestamp seragam, atau di frontend pastikan string tanggal dikirim dalam representasi lokal yang dipahami server tanpa konversi UTC yang tidak simetris.

---

### LOGIC-06: Offset Hari Smart Cache Melampaui Deadline
* **Lokasi:** `backend/routers/breakdown.py`, Baris 115
* **Akar Masalah:**
  Pada pencarian Smart Cache:
  ```python
  "target_day_offset": int((idx / max(1, len(cached_rows) - 1)) * days_left) if len(cached_rows) > 1 else 0
  ```
  Sedangkan pada template fallback (baris 193):
  ```python
  s["target_day_offset"] = int((idx / max(1, target_count - 1)) * max(days_left - 1, 0)) if target_count > 1 else 0
  ```
  Ketika `days_left = 3`, untuk langkah terakhir (`idx = total - 1`), hasil perkalian baris 115 adalah `3`. Penyimpanan di database menggunakan `DATE_ADD(CURDATE(), INTERVAL 3 DAY)` yang menaruh langkah terakhir di hari H+3 (melewati tanggal deadline yang jatuh pada H+2).
* **Rekomendasi Solusi:**
  Samakan formula baris 115 dengan baris 193 menggunakan `max(days_left - 1, 0)`.

---

### LOGIC-07: Penilaian Bobot Teks Silabus (Sliding Window)
* **Lokasi:** `backend/routers/syllabus.py`, Baris 41–70
* **Akar Masalah:**
  Fungsi `sliding_window_filter` menghitung `score` kecocokan kata kunci instruksi untuk tiap paragraf, tetapi langsung melakukan iterasi paragraf berdasarkan urutan dokumen asli:
  ```python
  for score, chunk in scored_chunks:
      if cur_len + len(chunk) > max_chars:
          ...
          break
      selected.append(chunk)
      cur_len += len(chunk)
  ```
* **Dampak:** Jika paragraf awal dokumen (kata pengantar, deskripsi umum) belum mencapai batas karakter, paragraf-paragraf dengan `score = 0` tetap diambil lebih dulu. Paragraf penting di akhir dokumen yang memiliki skor tinggi berisiko terpotong karena batas `max_chars = 2800` sudah habis.
* **Rekomendasi Solusi:**
  Urutkan chunk yang memiliki skor positif terlebih dahulu:
  ```python
  scored_chunks.sort(key=lambda x: x[0], reverse=True)
  ```

---

### LOGIC-08: Sinkronisasi Status Induk Saat Hapus Sub-Tugas
* **Lokasi:** `backend/routers/subtasks.py`, Baris 99–104
* **Akar Masalah:**
  Endpoint `DELETE /subtasks/{subtask_id}` hanya menjalankan perintah:
  ```python
  await db.execute("DELETE FROM subtasks WHERE id = %s", (subtask_id,))
  ```
  Berbeda dengan endpoint `PATCH /subtasks/{subtask_id}` yang menjalankan query kalkulasi ulang `is_completed` pada tugas induk.
* **Dampak:** Jika sub-tugas yang belum selesai dihapus sehingga semua sub-tugas yang tersisa sudah berstatus selesai, status tugas induk tetap `is_completed = FALSE`.
* **Rekomendasi Solusi:**
  Tambahkan query pembaruan status tugas induk setelah penghapusan sub-tugas seperti yang diterapkan pada endpoint `patch_subtask`.

---

### LOGIC-09: Ketidaksesuaian Konfigurasi Lingkungan
* **Lokasi:** `backend/config/db.py:17`, `backend/config/ai.py:8`, dan `README.md:174–184`
* **Akar Masalah:**
  * Di `README.md`: `DB_PASSWORD=KilasPass2026!` dan `AI_API_BASE=http://127.0.0.1:20128/v1`
  * Di kode: `os.getenv("DB_PASS", "")` dan `os.getenv("NINE_ROUTER_URL", ...)`
* **Rekomendasi Solusi:**
  Tambahkan fallback variabel pada konfigurasi kode agar mendukung kedua format penamaan:
  ```python
  # db.py
  password=os.getenv("DB_PASS") or os.getenv("DB_PASSWORD", "")

  # ai.py
  base_url=os.getenv("NINE_ROUTER_URL") or os.getenv("AI_API_BASE", "https://9router.najmifaza.my.id/v1")
  ```

---

### LOGIC-10: Tumpang Tindih Layering Z-Index
* **Lokasi:** `frontend/src/components/InstallPromptBanner.jsx:82`
* **Akar Masalah:**
  Banner PWA menggunakan kelas `z-50`. Modal dialog (`TaskInputModal`, `TaskDetailModal`, `BlueprintModal`) juga menggunakan `z-50`. Karena posisi banner berada di akhir elemen DOM dalam `App.jsx`, banner instalasi akan ter-render di atas modal yang sedang dibuka pengguna.
* **Rekomendasi Solusi:**
  Ubah kelas banner PWA menjadi `z-40` atau sembunyikan banner sementara saat ada modal aktif (`isInputModalOpen`, `activeDetail`, atau `sharedBlueprint`).

---

### LOGIC-05: Deteksi Sub-Tugas Tertunda Memakai UTC
* **Lokasi:** `frontend/src/components/TaskCard.jsx`, Baris 390
* **Akar Masalah:**
  ```javascript
  const todayStr = new Date().toISOString().slice(0, 10)
  ```
  `toISOString()` mengembalikan tanggal dalam UTC. Pada rentang waktu 00:00–07:00 WIB, waktu UTC masih berada di hari sebelumnya. Akibatnya, `todayStr` akan bernilai satu hari lebih awal dari tanggal kalender pengguna.
* **Dampak:** Sub-tugas yang dijadwalkan untuk "hari ini" tetapi dibuka antara tengah malam dan pukul 07:00 WIB tidak dideteksi sebagai tertunda, sehingga kartu tugas tidak menampilkan indikator peringatan.
* **Rekomendasi Solusi:**
  Gunakan format tanggal lokal yang konsisten:
  ```javascript
  const todayStr = new Date().toLocaleDateString('sv') // 'sv' locale menghasilkan format YYYY-MM-DD
  ```

---

### LOGIC-11: Timer Pomodoro Tidak Transisi Saat Tab Dibuka Kembali
* **Lokasi:** `frontend/src/App.jsx`, Baris 94
* **Akar Masalah:**
  State timer Pomodoro disimpan di memori React (`useState`). Ketika tab ditutup lalu dibuka kembali (atau browser restart), state timer diinisialisasi ulang ke nilai awal 25 menit tanpa memeriksa apakah sesi sebelumnya telah habis.
* **Dampak:** Pengguna yang menutup tab saat timer berjalan dan membuka kembali beberapa saat kemudian tidak mendapat notifikasi bahwa sesi fokus telah selesai, dan timer kembali ke 25 menit tanpa transisi ke sesi istirahat.
* **Rekomendasi Solusi:**
  Simpan `timerStartedAt` dan `timerDuration` ke `localStorage`. Saat komponen mount, bandingkan `Date.now()` dengan nilai yang tersimpan untuk menentukan apakah timer sudah habis dan jalankan logika transisi sesi secara programatik.

---

### LOGIC-12: `focusedTaskIndex` Tidak Di-clamp Saat Filter Berubah
* **Lokasi:** `frontend/src/App.jsx`, Baris 474
* **Akar Masalah:**
  Shortcut keyboard `'C'` mengeksekusi `filteredTasks[focusedTaskIndex]`. Nilai `focusedTaskIndex` tidak disesuaikan ketika pengguna mengganti filter kategori atau status, sehingga bisa bernilai di luar batas array `filteredTasks`.
* **Dampak:** Saat pengguna menekan `'C'` setelah mengganti filter ke kategori yang memiliki lebih sedikit tugas, hasilnya adalah `undefined` yang menyebabkan shortcut gagal tanpa pesan kesalahan yang jelas.
* **Rekomendasi Solusi:**
  Tambahkan `useEffect` yang meng-clamp index setiap kali `filteredTasks` berubah:
  ```javascript
  useEffect(() => {
    setFocusedTaskIndex(prev => Math.min(prev, filteredTasks.length - 1))
  }, [filteredTasks])
  ```

---

### LOGIC-13: Kolom `progress_percent` Tidak Exist di Tabel `tasks`
* **Lokasi:** `backend/routers/tasks.py`, Baris 98–105
* **Akar Masalah:**
  Endpoint `PATCH /tasks/{task_id}` menjalankan query SELECT yang menyertakan `t.progress_percent`:
  ```sql
  SELECT t.id, t.title, t.progress_percent, ... FROM tasks t WHERE t.id = %s
  ```
  Namun berdasarkan skema `schema.sql`, tabel `tasks` **tidak memiliki kolom `progress_percent`**. Kolom ini merupakan nilai komputasi yang dihitung pada query GET melalui `SUM(s.is_completed) / COUNT(s.id) * 100` dari tabel `subtasks`. Endpoint GET mengimplementasikan ini secara benar, tetapi endpoint PATCH mengasumsikan kolom tersebut ada.
* **Dampak:** Setiap kali pengguna menyimpan perubahan pada tugas yang sudah ada, backend melempar **MySQL Error 1054: Unknown column 't.progress_percent'** yang menghasilkan HTTP 500. Fitur edit tugas sepenuhnya tidak berfungsi.
* **Rekomendasi Solusi:**
  Hapus `t.progress_percent` dari SELECT pada endpoint PATCH dan hitung secara manual di Python setelah query:
  ```python
  # Setelah fetch row dari DB:
  total = row["subtasks_total"] or 0
  done  = row["subtasks_done"]  or 0
  row["progress_percent"] = round(done / total * 100) if total > 0 else 0
  ```

---

### LOGIC-14: Campuran Format UTC/Lokal Saat Pre-fill Tanggal Edit
* **Lokasi:** `frontend/src/components/TaskInputModal.jsx`, Baris 73–78
* **Akar Masalah:**
  Mode edit mem-parse deadline lama dan mengisi ulang field formulir dengan:
  ```javascript
  setDeadlineDate(d.toISOString().slice(0, 10))  // tanggal dalam UTC
  setDeadlineTime(d.toTimeString().slice(0, 5))   // jam dalam waktu lokal
  ```
  Dua metode ini menggunakan timezone yang berbeda. `toISOString()` mengembalikan representasi UTC, sedangkan `toTimeString()` menggunakan zona waktu sistem pengguna. Untuk deadline yang jatuh sebelum pukul 07:00 WIB, tanggal UTC berada di hari sebelumnya.
* **Dampak:** Jika pengguna membuka modal edit untuk tugas dengan deadline misalnya `2026-10-15T02:00:00` (02:00 WIB = 19:00 UTC+0 tanggal sebelumnya), field tanggal akan terisi `2026-10-14` (satu hari lebih awal) meski jam sudah benar. Jika pengguna langsung menyimpan tanpa mengubah apapun, deadline bergeser mundur 1 hari.
* **Rekomendasi Solusi:**
  Gunakan format tanggal lokal yang konsisten untuk kedua field:
  ```javascript
  setDeadlineDate(d.toLocaleDateString('sv'))      // YYYY-MM-DD dalam zona waktu lokal
  setDeadlineTime(d.toTimeString().slice(0, 5))    // jam lokal, sudah benar
  ```

---

### LOGIC-15: `progress_percent` Hilang pada Objek Task Setelah Edit
* **Lokasi:** `frontend/src/App.jsx`, Baris 411–418
* **Akar Masalah:**
  Handler `handleTaskUpdated` menggabungkan data lama dengan respons PATCH:
  ```javascript
  const updatedTask = await updateTask(editingTask.id, payload)
  setTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
  ```
  Karena endpoint PATCH (akibat bug LOGIC-13) tidak menyertakan `progress_percent` dalam respons, spread `{ ...t, ...updatedTask }` menimpa field `progress_percent` dari `t` (yang tadinya ada) dengan nilai `undefined` dari `updatedTask`.
* **Dampak:** Setelah menyimpan edit, komponen `HeroOverview` dan progress bar pada `TaskCard` menampilkan **`NaN%`** hingga pengguna melakukan page reload penuh. Hal ini terjadi meski LOGIC-13 sudah diperbaiki jika respons PATCH tetap tidak menghitung ulang `progress_percent`.
* **Rekomendasi Solusi:**
  Hitung ulang `progress_percent` secara lokal setelah merge, menggunakan data subtask yang sudah ada pada objek task lama:
  ```javascript
  const merged = { ...t, ...updatedTask }
  const total = merged.subtasks_total ?? t.subtasks_total ?? 0
  const done  = merged.subtasks_done  ?? t.subtasks_done  ?? 0
  merged.progress_percent = total > 0 ? Math.round((done / total) * 100) : 0
  return merged
  ```

---

## 5. Kesimpulan & Rekomendasi Langkah Selanjutnya

Audit Handshake memverifikasi bahwa struktur arsitektur umum aplikasi KilasTugas sudah solid, didukung desain antarmuka yang responsif, mekanisme redundansi AI (Tri-Engine), dan kemampuan offline IndexedDB.

Perbaikan yang direkomendasikan difokuskan pada:
1. **Perbaikan logika zona waktu (UTC vs Naive)** pada siklus pembuatan tugas, mode edit, dan sinkronisasi offline (LOGIC-02, LOGIC-04, LOGIC-05, LOGIC-14). ✅ Semua selesai.
2. **Koreksi formula matematika status `isOverdue` dan distribusi hari Smart Cache** (LOGIC-01, LOGIC-06). ✅ Semua selesai.
3. **Penyelarasan konfigurasi environment variable** dengan panduan dokumentasi resmi `README.md` (LOGIC-09). ✅ Selesai.
4. **Perbaikan alur edit tugas (commit `7bb8d7e`):** LOGIC-13, LOGIC-14, LOGIC-15 — semua diperbaiki pada commit `74678d4`. ✅ Selesai.
5. **Satu item masih perlu perhatian:** LOGIC-11 (timer transisi) — perbaikan sebagian, lihat Section 6.

*Laporan ini disimpan dalam berkas `LOGIC_AUDIT_REPORT.md` untuk referensi tim pengembang tanpa merubah berkas kode sumber yang ada.*

---

## 6. Temuan Sisa Pasca-Perbaikan

### LOGIC-11 (Partial Fix): Timer Transisi Terbatas pada Kondisi `subtask !== null`

* **Lokasi:** `frontend/src/App.jsx`, Baris 100–109
* **Kondisi Perbaikan yang Diterapkan:**
  ```javascript
  // LOGIC-11: timer habis saat tab ditutup — transisi ke break state
  if (diff <= 0 && parsed.subtask) {   // ← kondisi ini
    return {
      ...parsed,
      isActive: false,
      isBreak: !parsed.isBreak,
      remainingSeconds: parsed.isBreak ? (Number(parsed.subtask?.duration_minutes) || 25) * 60 : 5 * 60,
      endTime: null,
    }
  }
  ```
* **Masalah yang Tersisa:**
  Perbaikan hanya berjalan ketika `parsed.subtask` adalah objek yang truthy. Namun jika pengguna menekan tombol timer **tanpa terlebih dahulu memilih sub-tugas** (kondisi valid di UI karena tombol timer bisa diaktifkan secara mandiri), maka `parsed.subtask` bernilai `null`. Kondisi `diff <= 0 && null` mengevaluasi `false`, sehingga kode jatuh ke blok `return { ... remainingSeconds: 25 * 60 }` di bawahnya — perilaku lama (reset ke 25 menit tanpa transisi) tetap terjadi.
* **Dampak:** Pengguna yang memakai Pomodoro secara bebas (tanpa task terpilih) masih mengalami bug awal: timer selesai saat tab ditutup → buka kembali → timer reset ke 25 menit.
* **Rekomendasi Solusi:**
  Pisahkan kondisi dari keberadaan `subtask` — transisi break cukup bergantung pada apakah timer habis saat sesi fokus (bukan break):
  ```javascript
  if (diff <= 0) {
    const wasBreak = parsed.isBreak ?? false
    return {
      ...parsed,
      isActive: false,
      isBreak: !wasBreak,
      remainingSeconds: wasBreak
        ? (Number(parsed.subtask?.duration_minutes) || 25) * 60
        : 5 * 60,
      endTime: null,
    }
  }
  ```
  Dengan ini, transisi ke break (atau kembali ke fokus) terjadi terlepas dari apakah `subtask` dipilih atau tidak.
