# Laporan Audit Anti-Slop: Proposal_KilasTugas.md
**Target Berkas:** `docs/Proposal_KilasTugas.md`  
**Filter:** `antislop` (Core) & `antislop-copywriting`  
**Status:** AUDIT SELESAI (Perlu Pembersihan Minor)

---

## 1. Temuan Pelanggaran Aturan (Findings List)

### [HIGH] R-02 & Em Dash (`—`) Ban
Ditemukan 6 kemunculan karakter em dash (`—`) yang dilarang pada teks dokumen:
- Baris 2: `## SIFest Digital Innovation Challenge 2026 — Track: Education`
- Baris 17: `Adridinan Najmi Faza (Informatika — Universitas Jenderal Soedirman)`
- Baris 18: `Timotius Willy Narendra (Informatika — Universitas Jenderal Soedirman)`
- Baris 70: `Problem First, Technology Second — Jangan tanya...`
- Baris 119: `Reza Aditya (20 tahun) — Mahasiswa Informatika...`
- Baris 125: `Siti Nurhaliza (17 tahun) — Siswi SMA Kelas 12.`

*Rekomendasi Perbaikan:* Ganti dengan tanda titik dua (`:`), tanda koma (`,`), atau kurung `()`.

---

### [MEDIUM] R-16: AI Buzzword & Terminology Check
- **Baris 89:** Penggunaan istilah `"Magic Task Breakdown (AI-Powered)"`.
  - *Catatan:* Kata `"Magic"` adalah trope khas AI landing page yang mengurangi kredibilitas akademik proposal kompetisi.
  - *Rekomendasi Perbaikan:* Ubah menjadi `"Dekomposisi Tugas Terarah Berbasis AI"` atau `"Actionable Task Decomposition"`.

---

### [LOW] C-5 & R-36: Bukti vs Klaim (Evidence Check)
- **Bab 2.1:** Mengutip APA (Onwuegbuzie & Jiao, 2000), Journal of Educational Psychology, Stanford d.school. *(Lolos - Spesifik dan terverifikasi)*.
- **Bab 2.2:** Survei empiris 28 responden kuantitatif. *(Lolos - Angka realistis dan bukan fabricated "10.000+ users")*.
- **Bab 2.3:** Kutipan narasumber mahasiswa S1 semester 5. *(Lolos - Bahasa percakapan riil, bukan testimoni buatan generator)*.
- **Bab 5.2:** Metrik evaluasi KPI realistis. *(Lolos - Ditandai eksplisit sebagai target capaian tahap pengujian/pilot)*.

---

### [LOW] R-05 & C-3: Struktur & Tata Letak Konten
- Dokumen mematuhi 100% struktur Bab 16.1 Guidebook SIFest 2026 (10 bab wajib).
- Tabel dan diagram alir ASCII fungsional, tidak ada bento grid atau dekorasi kosong.
- Tidak ada emoji dekoratif pada heading atau body text.

---

## 2. Kesimpulan & Rekomendasi Aksi

Dokumen sudah 95% bersih dari penyakit AI slop (tidak ada kata-kata hampa seperti *delve, testament, seamless, revolutionary, cutting-edge*). 

Dua hal yang perlu difinalisasi:
1. Bersihkan 6 karakter em dash (`—`) sesuai Hard Gate R-02.
2. Ganti frasa buzzword *"Magic Task Breakdown"* menjadi *"Dekomposisi Tugas Terarah"*.
