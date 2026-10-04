from datetime import timedelta

# Template preset: 4-6 subtask default per kategori
# target_day_offset didistribusikan merata berdasarkan days_left

def get_template_by_category(category: str, days_left: int) -> list[dict]:
    templates = {
        "laporan_lab": [
            {"step": 1, "title": "Baca & pahami modul praktikum", "description": "Baca seluruh modul/instruksi praktikum. Catat poin utama, tujuan, dan alat yang dibutuhkan.", "duration_minutes": 30},
            {"step": 2, "title": "Kerjakan percobaan & catat data", "description": "Lakukan percobaan atau simulasi sesuai langkah modul. Dokumentasikan hasil (screenshot/foto/tabel data).", "duration_minutes": 60},
            {"step": 3, "title": "Tulis BAB I & BAB II", "description": "Susun Pendahuluan (latar belakang, tujuan, manfaat) dan Dasar Teori berdasarkan referensi yang relevan.", "duration_minutes": 60},
            {"step": 4, "title": "Tulis BAB III: Langkah Percobaan", "description": "Dokumentasikan prosedur percobaan secara runtut beserta screenshot/gambar hasil.", "duration_minutes": 45},
            {"step": 5, "title": "Tulis BAB IV & BAB V", "description": "Analisis hasil percobaan, kaitkan dengan teori, dan tulis kesimpulan 3–5 poin.", "duration_minutes": 60},
            {"step": 6, "title": "Review, format & submit", "description": "Periksa format penulisan (font, margin, daftar pustaka). Konversi ke PDF dan upload ke portal.", "duration_minutes": 30},
        ],
        "makalah": [
            {"step": 1, "title": "Tentukan topik & kumpulkan referensi", "description": "Riset topik makalah, kumpulkan minimal 5 referensi valid (jurnal/buku). Buat outline kerangka tulisan.", "duration_minutes": 45},
            {"step": 2, "title": "Tulis BAB I: Pendahuluan", "description": "Susun latar belakang, rumusan masalah, tujuan, dan manfaat penulisan.", "duration_minutes": 45},
            {"step": 3, "title": "Tulis BAB II: Kajian Pustaka", "description": "Jabarkan teori-teori utama dari referensi yang sudah dikumpulkan secara sistematis.", "duration_minutes": 75},
            {"step": 4, "title": "Tulis BAB III: Pembahasan", "description": "Analisis topik secara mendalam menggunakan teori yang sudah dibahas. Sertakan argumen dan contoh.", "duration_minutes": 90},
            {"step": 5, "title": "Tulis BAB IV: Penutup & Daftar Pustaka", "description": "Tulis kesimpulan dan saran. Susun daftar pustaka sesuai format yang diminta (APA/IEEE/dll).", "duration_minutes": 45},
            {"step": 6, "title": "Proofread & submit", "description": "Baca ulang seluruh makalah, perbaiki typo dan konsistensi. Konversi ke PDF dan kumpulkan.", "duration_minutes": 30},
        ],
        "coding": [
            {"step": 1, "title": "Pahami requirement & buat rencana", "description": "Baca instruksi proyek secara menyeluruh. Buat daftar fitur yang perlu diimplementasikan dan rancang arsitektur sederhana.", "duration_minutes": 30},
            {"step": 2, "title": "Setup project & struktur folder", "description": "Inisialisasi project (repo GitHub, package manager, folder struktur). Pastikan environment berjalan.", "duration_minutes": 30},
            {"step": 3, "title": "Implementasi fitur utama (core)", "description": "Kerjakan fitur inti yang menjadi kebutuhan paling krusial dari instruksi dosen.", "duration_minutes": 120},
            {"step": 4, "title": "Implementasi fitur pendukung", "description": "Tambahkan fitur-fitur pelengkap sesuai requirement. Lakukan testing sederhana per fitur.", "duration_minutes": 90},
            {"step": 5, "title": "Testing & bug fixing", "description": "Uji seluruh alur aplikasi. Perbaiki bug yang ditemukan. Pastikan tidak ada error fatal.", "duration_minutes": 60},
            {"step": 6, "title": "Dokumentasi & submit", "description": "Tulis README, pastikan kode bersih dan ter-commit ke GitHub. Kumpulkan link repo ke portal.", "duration_minutes": 30},
        ],
        "presentasi": [
            {"step": 1, "title": "Riset topik & kumpulkan materi", "description": "Kumpulkan bahan presentasi dari referensi valid. Tentukan poin utama yang akan disampaikan.", "duration_minutes": 45},
            {"step": 2, "title": "Buat outline slide", "description": "Rancang struktur slide: pembuka, isi (3–5 poin utama), dan penutup. Tentukan urutan logis.", "duration_minutes": 20},
            {"step": 3, "title": "Desain & isi slide", "description": "Buat slide menggunakan PowerPoint/Canva/Google Slides. Isi konten tiap slide, tambahkan visual.", "duration_minutes": 90},
            {"step": 4, "title": "Latihan presentasi", "description": "Latih penyampaian di depan cermin atau rekam diri sendiri. Perhatikan durasi dan kelancaran.", "duration_minutes": 45},
            {"step": 5, "title": "Finalisasi & simpan", "description": "Perbaiki slide berdasarkan hasil latihan. Simpan dalam format yang diminta (PPTX/PDF).", "duration_minutes": 20},
        ],
        "custom": [
            {"step": 1, "title": "Pahami instruksi tugas", "description": "Baca ulang instruksi dosen secara menyeluruh. Catat poin-poin utama yang harus diselesaikan.", "duration_minutes": 20},
            {"step": 2, "title": "Riset & kumpulkan bahan", "description": "Cari referensi atau sumber yang relevan untuk mendukung pengerjaan tugas.", "duration_minutes": 45},
            {"step": 3, "title": "Kerjakan bagian utama", "description": "Mulai dan selesaikan bagian terbesar dan terpenting dari tugas.", "duration_minutes": 90},
            {"step": 4, "title": "Kerjakan bagian pelengkap", "description": "Selesaikan elemen-elemen pendukung yang menyempurnakan tugas utama.", "duration_minutes": 60},
            {"step": 5, "title": "Review & finalisasi", "description": "Periksa kembali seluruh hasil kerja. Perbaiki jika ada yang kurang.", "duration_minutes": 30},
            {"step": 6, "title": "Submit tugas", "description": "Kumpulkan tugas sesuai format dan saluran yang ditentukan dosen sebelum deadline.", "duration_minutes": 15},
        ],
    }

    steps = templates.get(category, templates["custom"])
    total = len(steps)

    # distribusi day_offset merata berdasarkan sisa hari
    result = []
    for i, s in enumerate(steps):
        offset = int((i / total) * max(days_left - 1, 1))
        result.append({**s, "target_day_offset": offset})

    return result
