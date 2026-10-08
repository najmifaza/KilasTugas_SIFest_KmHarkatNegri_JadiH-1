export interface Chapter {
  id: number;
  title: string;
  badge: string;
  startFrame: number;
  endFrame: number;
  iconName: string;
}

export interface Subtitle {
  startFrame: number;
  endFrame: number;
  text: string;
  highlightWords?: string[];
}

export interface FeatureHighlight {
  startFrame: number;
  endFrame: number;
  title: string;
  description: string;
  tag: string;
  tagColor: "orange" | "green" | "blue" | "purple";
  icon: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Akses Instan & Pengenalan",
    badge: "01 / PENGENALAN",
    startFrame: 0,
    endFrame: 450,
    iconName: "Zap",
  },
  {
    id: 2,
    title: "AI Magic Breakdown",
    badge: "02 / AI DEKOMPOSISI",
    startFrame: 450,
    endFrame: 1200,
    iconName: "Sparkles",
  },
  {
    id: 3,
    title: "Visual Micro-Pacing",
    badge: "03 / RITME KERJA",
    startFrame: 1200,
    endFrame: 2340,
    iconName: "CheckCircle2",
  },
  {
    id: 4,
    title: "Deep Focus Pomodoro",
    badge: "04 / FOCUS ENGINE",
    startFrame: 2340,
    endFrame: 4110,
    iconName: "Timer",
  },
  {
    id: 5,
    title: "Kalender & Berbagi Rencana",
    badge: "05 / SYNC & SHARE",
    startFrame: 4110,
    endFrame: 4950,
    iconName: "Calendar",
  },
  {
    id: 6,
    title: "Status Selesai & Responsif",
    badge: "06 / 100% TUNTAS",
    startFrame: 4950,
    endFrame: 5610,
    iconName: "PartyPopper",
  },
  {
    id: 7,
    title: "Roadmap Pengembangan",
    badge: "07 / GRAND FINAL ROADMAP",
    startFrame: 5610,
    endFrame: 6930,
    iconName: "Compass",
  },
  {
    id: 8,
    title: "Penutup & Live Platform",
    badge: "08 / PENUTUP",
    startFrame: 6930,
    endFrame: 7354,
    iconName: "Rocket",
  },
];

export const SUBTITLES: Subtitle[] = [
  // Bagian 1 (00:00 - 00:15)
  {
    startFrame: 0,
    endFrame: 210,
    text: "KilasTugas memecah tugas kuliah yang panjang menjadi langkah harian dengan durasi 30 sampai 45 menit.",
    highlightWords: ["KilasTugas", "langkah harian", "30 sampai 45 menit"],
  },
  {
    startFrame: 210,
    endFrame: 450,
    text: "Tanpa perlu registrasi atau login, aplikasi bisa kita langsung pakai, dan juga kita bisa langsung mencoba dengan menambahkan tugas baru.",
    highlightWords: ["Tanpa registrasi", "login", "tugas baru"],
  },

  // Bagian 2 (00:15 - 00:40)
  {
    startFrame: 450,
    endFrame: 630,
    text: "Pertama, kita masukkan judul tugas, pilih tenggat waktu, dan tentukan kategorinya.",
    highlightWords: ["judul tugas", "tenggat waktu", "kategori"],
  },
  {
    startFrame: 630,
    endFrame: 780,
    text: "Kemudian, kita tempel instruksi tugas dari modul.",
    highlightWords: ["instruksi tugas", "modul"],
  },
  {
    startFrame: 780,
    endFrame: 900,
    text: "Jumlah langkah bisa diserahkan sepenuhnya kepada AI atau secara manual.",
    highlightWords: ["AI", "secara manual"],
  },
  {
    startFrame: 900,
    endFrame: 1050,
    text: "Untuk contoh ini, kita bagi menjadi 5 tugas.",
    highlightWords: ["5 tugas", "langkah kerja"],
  },
  {
    startFrame: 1050,
    endFrame: 1200,
    text: "Selanjutnya, bisa kita klik tombol Pecah Tugas.",
    highlightWords: ["Pecah Tugas", "Magic Breakdown"],
  },

  // Bagian 3 (00:40 - 01:17)
  {
    startFrame: 1200,
    endFrame: 1350,
    text: "Pada label 'Tepat Waktu' (On Track), menunjukkan bahwa porsi kerja harian masih sesuai dengan jadwal.",
    highlightWords: ["Tepat Waktu", "On Track", "jadwal"],
  },
  {
    startFrame: 1350,
    endFrame: 1530,
    text: "Jadi, kita langsung tahu langkah apa yang harus dikerjakan hari ini.",
    highlightWords: ["dikerjakan hari ini"],
  },
  {
    startFrame: 1530,
    endFrame: 1680,
    text: "Setiap langkah juga bisa diedit atau ditambahkan secara manual.",
    highlightWords: ["diedit", "ditambahkan manual"],
  },
  {
    startFrame: 1680,
    endFrame: 1800,
    text: "Saat satu langkah selesai, cukup tekan tombol centang.",
    highlightWords: ["tombol centang"],
  },
  {
    startFrame: 1800,
    endFrame: 2070,
    text: "Nah, setelah itu, terdengar bunyi notifikasi, langkah ditandai selesai, dan garis progres langsung bertambah.",
    highlightWords: ["bunyi notifikasi", "garis progres bertambah"],
  },
  {
    startFrame: 2070,
    endFrame: 2340,
    text: "Sementara itu, grafik lingkaran di bagian atas menghitung akumulasi capaian dari seluruh tugas secara real-time.",
    highlightWords: ["grafik lingkaran", "real-time"],
  },

  // Bagian 4 (01:18 - 02:16)
  // Take 1 (01:18 - 01:46)
  {
    startFrame: 2340,
    endFrame: 2430,
    text: "Untuk mulai mengerjakan, tekan tombol putar pada langkah kerja.",
    highlightWords: ["tombol putar"],
  },
  {
    startFrame: 2430,
    endFrame: 2550,
    text: "Pengatur waktu, fokus selama 25 menit, langsung aktif.",
    highlightWords: ["fokus 25 menit", "langsung aktif"],
  },
  {
    startFrame: 2550,
    endFrame: 2700,
    text: "Jika jendela fokus ditutup, timer tetap berjalan di bagian bawah layar.",
    highlightWords: ["timer tetap berjalan", "bawah layar"],
  },
  {
    startFrame: 2700,
    endFrame: 2820,
    text: "Waktu yang tersisa juga ditampilkan pada jendela tab browser.",
    highlightWords: ["tab browser", "countdown"],
  },
  {
    startFrame: 2820,
    endFrame: 3000,
    text: "Jadi, kita tetap bisa memantau sisa waktu tanpa harus membuka kembali timer.",
    highlightWords: ["memantau sisa waktu"],
  },
  {
    startFrame: 3000,
    endFrame: 3180,
    text: "Begitu waktu habis, KilasTugas akan memberikan audio bell sebagai pengingat.",
    highlightWords: ["audio bell", "pengingat"],
  },

  // Take 2 (01:47 - 02:16)
  {
    startFrame: 3210,
    endFrame: 3300,
    text: "Untuk mulai mengerjakan, tekan tombol putar pada langkah kerja.",
    highlightWords: ["tombol putar"],
  },
  {
    startFrame: 3300,
    endFrame: 3420,
    text: "Pengatur waktu, fokus selama 25 menit, langsung aktif.",
    highlightWords: ["fokus 25 menit", "Pomodoro"],
  },
  {
    startFrame: 3420,
    endFrame: 3570,
    text: "Jika jendela fokus ditutup, timer tetap berjalan di bagian bawah layar.",
    highlightWords: ["Floating Timer Pill"],
  },
  {
    startFrame: 3570,
    endFrame: 3690,
    text: "Waktu yang tersisa juga ditampilkan pada jendela tab browser.",
    highlightWords: ["tab browser"],
  },
  {
    startFrame: 3690,
    endFrame: 3870,
    text: "Jadi, kita tetap bisa memantau sisa waktu tanpa harus membuka kembali timer.",
    highlightWords: ["multitasking", "bebas navigasi"],
  },
  {
    startFrame: 3870,
    endFrame: 4110,
    text: "Begitu waktu habis, KilasTugas akan memberikan audio bell sebagai pengingat.",
    highlightWords: ["audio bell", "pengingat"],
  },

  // Bagian 5 (02:17 - 02:44)
  {
    startFrame: 4110,
    endFrame: 4230,
    text: "Semua langkah kerja juga bisa diekspor langsung ke Google Calendar.",
    highlightWords: ["Google Calendar", "ekspor"],
  },
  {
    startFrame: 4230,
    endFrame: 4410,
    text: "Alarm pengingat juga sudah disiapkan 15 menit sebelum pengerjaan tugas dimulai.",
    highlightWords: ["Alarm pengingat 15 menit"],
  },
  {
    startFrame: 4410,
    endFrame: 4560,
    text: "Selain itu, rencana tugas bisa dibagikan melalui tautan khusus.",
    highlightWords: ["tautan khusus", "Bagikan Cetak Biru"],
  },
  {
    startFrame: 4560,
    endFrame: 4800,
    text: "Rekan satu kelas cukup membuka tautan tersebut dan menekan tombol 'Impor ke Jadwalku'...",
    highlightWords: ["Impor ke Jadwalku"],
  },
  {
    startFrame: 4800,
    endFrame: 4950,
    text: "...untuk menyalin susunan langkah ke daftar tugas mereka.",
    highlightWords: ["1-Click Clone", "dalam 1 detik"],
  },

  // Bagian 6 (02:45 - 03:06)
  {
    startFrame: 4950,
    endFrame: 5100,
    text: "Saat seluruh langkah sudah selesai, progres mencapai 100%.",
    highlightWords: ["progres mencapai 100%"],
  },
  {
    startFrame: 5100,
    endFrame: 5220,
    text: "Status tugas otomatis berubah menjadi 'Ready to Submit'.",
    highlightWords: ["Ready to Submit 🎉"],
  },
  {
    startFrame: 5220,
    endFrame: 5370,
    text: "Kemudian muncul animasi confetti sebagai tanda bahwa tugas sudah selesai.",
    highlightWords: ["animasi confetti", "selebrasi"],
  },
  {
    startFrame: 5370,
    endFrame: 5610,
    text: "KilasTugas juga responsif ketika dibuka di desktop, tablet, maupun ponsel.",
    highlightWords: ["desktop", "tablet", "ponsel"],
  },

  // Bagian 7 (03:07 - 03:51)
  {
    startFrame: 5610,
    endFrame: 5760,
    text: "Pada tahap pengembangan berikutnya, KilasTugas akan menambahkan tiga fitur utama.",
    highlightWords: ["tiga fitur utama", "Grand Final Sprint"],
  },
  {
    startFrame: 5760,
    endFrame: 6060,
    text: "Nah, yang pertama yaitu AI Syllabus Reader, di mana nanti para user bisa menambahkan file tugas berupa format PDF maupun dokumen.",
    highlightWords: ["AI Syllabus Reader", "format PDF", "dokumen"],
  },
  {
    startFrame: 6060,
    endFrame: 6480,
    text: "Nah, selanjutnya yang kedua yaitu PWA Offline First. Di sini para user bisa mengakses seperti tugas, lalu checklist, timer tanpa adanya koneksi internet.",
    highlightWords: ["PWA Offline First", "IndexedDB", "tanpa koneksi internet"],
  },
  {
    startFrame: 6480,
    endFrame: 6930,
    text: "Lalu yang ketiga yaitu Always On Focus Engine, di mana fitur ini adalah Web Push Notification sehingga timer bisa tetap muncul meskipun tab atau browser sedang ditutup.",
    highlightWords: ["Always On Focus Engine", "Web Push Notification", "browser ditutup"],
  },

  // Bagian 8 (03:51 - 04:05)
  {
    startFrame: 6930,
    endFrame: 7110,
    text: "KilasTugas mengubah tugas kuliah yang berat menjadi langkah kerja yang jelas, terukur, dan teratur.",
    highlightWords: ["jelas", "terukur", "teratur"],
  },
  {
    startFrame: 7110,
    endFrame: 7354,
    text: "Nah, buat kalian yang ingin langsung mengakses KilasTugas, bisa langsung ke kilastugas.vercel.app.",
    highlightWords: ["kilastugas.vercel.app", "Coba Sekarang"],
  },
];

export const FEATURES: FeatureHighlight[] = [
  {
    startFrame: 20,
    endFrame: 430,
    title: "Zero-Barrier Guest Mode",
    description: "Tanpa registrasi akun. Langsung pakai dalam 1 detik dengan local storage dual sync.",
    tag: "0 Friction",
    tagColor: "orange",
    icon: "Zap",
  },
  {
    startFrame: 470,
    endFrame: 1180,
    title: "AI Magic Breakdown",
    description: "Membagi instruksi modul panjang menjadi 5 aksi kerja konkret dengan Gemini Flash.",
    tag: "< 2 Detik",
    tagColor: "blue",
    icon: "Sparkles",
  },
  {
    startFrame: 1220,
    endFrame: 2300,
    title: "Visual Micro-Pacing",
    description: "Status On Track memandu porsi aman per hari. Grafik lingkaran real-time.",
    tag: "Anti-Prokrastinasi",
    tagColor: "green",
    icon: "CheckCircle2",
  },
  {
    startFrame: 2360,
    endFrame: 4070,
    title: "Deep Focus Pomodoro",
    description: "Sesi 25 menit dengan Floating Timer Pill di bawah layar & countdown di judul tab.",
    tag: "Persistent Timer",
    tagColor: "orange",
    icon: "Timer",
  },
  {
    startFrame: 4130,
    endFrame: 4920,
    title: "Calendar & Blueprint Sharing",
    description: "Ekspor ke Google Calendar (.ics) + bagikan link rencana tugas dengan 1-click import.",
    tag: "Kolaborasi Instan",
    tagColor: "blue",
    icon: "Calendar",
  },
  {
    startFrame: 4970,
    endFrame: 5580,
    title: "100% Ready to Submit",
    description: "Selebrasi konfeti instan dan adaptasi responsif mobile edge-to-edge.",
    tag: "Dopamine Boost",
    tagColor: "green",
    icon: "PartyPopper",
  },
  {
    startFrame: 5630,
    endFrame: 6900,
    title: "Roadmap Grand Final",
    description: "AI Syllabus Reader (PDF), PWA Offline-First, dan Always-On Focus Web Push.",
    tag: "SIFest DIC 2026",
    tagColor: "purple",
    icon: "Compass",
  },
  {
    startFrame: 6940,
    endFrame: 7330,
    title: "kilastugas.vercel.app",
    description: "Dikembangkan oleh Tim Jadi H-1 • SIFest 2026 Track Education.",
    tag: "Coba Sekarang",
    tagColor: "orange",
    icon: "Rocket",
  },
];
