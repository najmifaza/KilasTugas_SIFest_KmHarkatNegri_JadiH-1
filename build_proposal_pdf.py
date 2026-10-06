import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import win32com.client

# Target file paths
DOCX_OUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\TimKilasTugas_KilasTugas_ProposalRingkas.docx"
PDF_OUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\TimKilasTugas_KilasTugas_ProposalRingkas.pdf"
LOGO_PATH = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\Logo.png"

# Setup Document
doc = docx.Document()

# Page Margins: Academic Standard (Top 2.5cm, Bottom 2.5cm, Left 2.8cm, Right 2.3cm)
# Compact margins to ensure max 6 pages
section = doc.sections[0]
section.page_width = Inches(8.27)   # A4 21.0 cm
section.page_height = Inches(11.69) # A4 29.7 cm
section.top_margin = Inches(0.90)   # 2.3 cm
section.bottom_margin = Inches(0.90)# 2.3 cm
section.left_margin = Inches(1.05)  # 2.7 cm
section.right_margin = Inches(0.90) # 2.3 cm
section.different_first_page_header_footer = True

PRINTABLE_WIDTH_INCHES = 8.27 - 1.05 - 0.90 # 6.32 inches = 9100 dxa
TOTAL_W_DXA = int(PRINTABLE_WIDTH_INCHES * 1440)

# Colors
C_BLACK = RGBColor(0, 0, 0)
C_DARK = RGBColor(24, 24, 27)      # Zinc 900
C_MUTED = RGBColor(82, 82, 91)     # Zinc 600

# Base style: Times New Roman, 11pt, 1.15 line spacing, 3pt space after
style_normal = doc.styles['Normal']
# Set cell width via dxa Length
from docx.shared import Pt, Inches, RGBColor, Length
class DxaLength(Length):
    def __init__(self, dxa):
        self._dxa = dxa
    @property
    def dxa(self):
        return self._dxa

def set_para_font(p, name='Times New Roman', size_pt=11, bold=False, italic=False, color=C_DARK, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=2, line_spacing=1.12):
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    for r in p.runs:
        r.font.name = name
        r.font.size = Pt(size_pt)
        r.bold = bold
        r.italic = italic
        r.font.color.rgb = color

def add_p(doc, text="", bold=False, italic=False, size_pt=11, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=2, line_spacing=1.12):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if text:
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(size_pt)
        r.bold = bold
        r.italic = italic
        r.font.color.rgb = C_DARK
    return p

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11.5)
    r.bold = True
    r.font.color.rgb = C_BLACK
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1.5)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.bold = True
    r.font.color.rgb = C_BLACK
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.bold = True
    r.italic = True
    r.font.color.rgb = C_BLACK
    return p

def set_cell_margins(cell, top=30, bottom=30, left=60, right=60):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def format_cell_text(cell, text, bold=False, italic=False, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.LEFT, bg_color=None):
    if bg_color:
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading)
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.0
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(size_pt)
    r.bold = bold
    r.italic = italic
    r.font.color.rgb = C_BLACK

# ── Footer Page Numbering (Halaman 2 dst) ────────────────────────
footer = section.footer
footer_p = footer.paragraphs[0]
footer_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
f_run = footer_p.add_run()
f_run.font.name = 'Times New Roman'
f_run.font.size = Pt(10)
f_run.font.color.rgb = C_MUTED
# XML for page number
fldSimple = OxmlElement('w:fldSimple')
fldSimple.set(qn('w:instr'), 'PAGE')
footer_p._p.append(fldSimple)

print("Starting document assembly...")

# ════════════════════════════════════════════════════════════════════
# COVER PAGE (HALAMAN 0 - TIDAK DIHITUNG DALAM 6 HALAMAN MAKSIMAL)
# ════════════════════════════════════════════════════════════════════
p_cov_sp1 = add_p(doc, "", space_after=24)
p_head1 = add_p(doc, "PROPOSAL RINGKAS INOVASI DIGITAL", bold=True, size_pt=14, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
p_head2 = add_p(doc, "SIFest Digital Innovation Challenge 2026: Track Education", bold=True, size_pt=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=28)

# Logo
if os.path.exists(LOGO_PATH):
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_after = Pt(24)
    run_logo = p_logo.add_run()
    run_logo.add_picture(LOGO_PATH, width=Inches(1.8))

p_title = add_p(doc, "KILASTUGAS", bold=True, size_pt=20, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=6)
p_sub = add_p(doc, "Smart Actionable Task Breakdown & Micro-Pacing for Students", italic=True, bold=True, size_pt=12, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=8)
p_tag = add_p(doc, '"Ubah Beban Tugas Kompleks Menjadi Aksi Harian yang Jelas, Ringan, dan Tereksekusi"', italic=True, size_pt=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=36)

# Tim Info Table on Cover
tbl_cov = doc.add_table(rows=5, cols=2)
tbl_cov.alignment = WD_TABLE_ALIGNMENT.CENTER
set_table_borders(tbl_cov, color="71717A", sz="4")
cov_widths = [int(TOTAL_W_DXA * 0.30), int(TOTAL_W_DXA * 0.70)]

cov_data = [
    ("Nama Tim", "Tim KilasTugas"),
    ("Ketua Tim", "Adridinan Najmi Faza (Informatika, Universitas Jenderal Soedirman)"),
    ("Anggota Tim", "1. Timotius Willy Narendra (Informatika, Universitas Jenderal Soedirman)\n2. Fardizza Finda Rahman (Informatika, Universitas Jenderal Soedirman)"),
    ("Challenge Track", "Education"),
    ("Repositori GitHub", "https://github.com/najmifaza/KilasTugas_SIFest_KmHarkatNegri_JadiH-1"),
]

for ri, (k, v) in enumerate(cov_data):
    row = tbl_cov.rows[ri]
    row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    for ci in range(2):
        cell = row.cells[ci]
        cell.width = DxaLength(cov_widths[ci])
        set_cell_margins(cell, top=40, bottom=40, left=80, right=80)
    format_cell_text(row.cells[0], k, bold=True, size_pt=10, bg_color="F4F4F5")
    format_cell_text(row.cells[1], v, bold=False, size_pt=10)

p_cov_foot = add_p(doc, "", space_after=36)
p_inst = add_p(doc, "UNIVERSITAS JENDERAL SOEDIRMAN\nPURWOKERTO\n2026", bold=True, size_pt=11, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=0)

# Page Break after Cover
doc.add_page_break()

# ════════════════════════════════════════════════════════════════════
# ISI PROPOSAL RINGKAS (BAB 1 - 8)
# ════════════════════════════════════════════════════════════════════

add_heading_1(doc, "1. Latar Belakang & Rumusan Masalah")
add_heading_2(doc, "1.1 Latar Belakang")
add_p(doc, "Di jenjang perguruan tinggi dan sekolah menengah atas, mahasiswa rata-rata menempuh 4 hingga 7 mata kuliah aktif per semester. Setiap mata kuliah membebankan penugasan dengan karakteristik beragam: penyusunan makalah riset, laporan praktikum laboratorium, proyek pemrograman perangkat lunak, telaah jurnal ilmiah, hingga presentasi kelompok.")
add_p(doc, 'Tuntutan tersebut sering kali diserahkan oleh pengajar dalam bentuk silabus atau deskripsi instruksi yang panjang, padat, dan abstrak (misal: "Susun laporan akhir perancangan jaringan VLSM 5 bab lengkap dengan simulasi Packet Tracer"). Ketika beban tugas yang rumit datang bersamaan, mayoritas pelajar mengalami kebuntuan kognitif. Fenomena psikologis ini dikenal sebagai Task Paralysis atau Overwhelm Freeze: kondisi di mana seseorang justru tidak memulai pengerjaan bukan karena malas atau abai, melainkan karena otak mengalami cognitive overload dan bingung menentukan titik awal tindakan ("where to start").')

add_heading_2(doc, "1.2 Gap Analisis Alat Manajemen Tugas Konvensional")
add_p(doc, "Pelajar saat ini telah menggunakan berbagai platform produktivitas populer (Notion, Google Keep, Todoist, Trello, Google Tasks). Namun, instrumen-instrumen tersebut menyisakan critical gap:")
add_p(doc, "1. Hanya Bersifat Pasif (Deadline-Centric, Bukan Action-Centric): Aplikasi mencatat nama tugas dan tanggal tenggat, namun menyerahkan 100% beban pemecahan langkah kerja kepada pengguna yang sedang kewalahan.")
add_p(doc, "2. Ketiadaan Micro-Pacing: Pengguna tidak dipandu secara harian berapa porsi kerja yang aman diselesaikan hari ini berdasarkan jarak tanggal pengumpulan. Akibatnya, timbul ilusi waktu luang semu yang berujung pada panic working di malam H-1/H-0.")
add_p(doc, "3. Friksi Awal Tinggi: Aplikasi manajemen proyek formal menuntut setup manual yang rumit (pembuatan database board, tagging, estimasi manual), sehingga pengguna lelah sebelum mulai bekerja.")

add_heading_2(doc, "1.3 Rumusan Masalah")
add_p(doc, '"Bagaimana merancang platform digital yang mampu mengeliminasi Task Paralysis pada pelajar dengan mengonversi instruksi tugas kuliah yang panjang menjadi rencana aksi harian yang mikro, konkret, dan terintegrasi dengan timer eksekusi terarah?"', italic=True)

add_heading_1(doc, "2. Sumber Validasi Masalah")
add_p(doc, "Validasi masalah KilasTugas disusun melalui triangulasi data: riset literatur akademis internasional, survei empiris kuantitatif pelajar, dan observasi lapangan langsung.")

add_heading_2(doc, "2.1 Literatur Akademis & Kajian Ilmiah")
add_p(doc, "• American Psychological Association (APA / Onwuegbuzie & Jiao, 2000): Prokrastinasi akademik dialami oleh 80%–95% mahasiswa, dengan 50% di antaranya melaporkan penundaan tugas berdampak destruktif pada performa akademik dan kesehatan mental.")
add_p(doc, "• Journal of Educational Psychology: Penerapan teknik pemecahan tugas bertahap (Task Chunking) terbukti meningkatkan tingkat penyelesaian tugas akademik hingga 60% dibandingkan pencatatan berbasis daftar tugas konvensional.")
add_p(doc, "• Stanford d.school Research: Prinsip Micro-Commitment (tindakan mikro berdurasi 25–45 menit) menurunkan kecemasan kerja (task anxiety) secara drastis serta membangun momentum penyelesaian berkelanjutan.")

add_heading_2(doc, "2.2 Survei Lapangan Kuantitatif (Responden: 28 Mahasiswa Aktif)")
add_p(doc, "Survei disebarkan kepada mahasiswa lintas angkatan dan program studi rumpun sains & teknologi di lingkungan universitas:")

tbl_survei = doc.add_table(rows=5, cols=3)
tbl_survei.alignment = WD_TABLE_ALIGNMENT.CENTER
set_table_borders(tbl_survei, color="000000", sz="4")
w_surv = [int(TOTAL_W_DXA * 0.45), int(TOTAL_W_DXA * 0.22), int(TOTAL_W_DXA * 0.33)]

surv_headers = ["Pertanyaan Kunci", "Temuan Empiris", "Implikasi bagi Produk"]
for ci, h in enumerate(surv_headers):
    cell = tbl_survei.rows[0].cells[ci]
    cell.width = DxaLength(w_surv[ci])
    set_cell_margins(cell, top=35, bottom=35, left=50, right=50)
    format_cell_text(cell, h, bold=True, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER, bg_color="E4E4E7")
tbl_survei.rows[0]._tr.get_or_add_trPr().append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

surv_rows = [
    ("Frekuensi mengerjakan tugas kuliah pada H-1 / H-0 deadline", "78,6% (Sering / Selalu)", "Membuktikan budaya prokrastinasi akut akibat ketiadaan panduan pacing."),
    ("Alasan utama menunda tugas", "64,3% (\"Bingung mulai dari mana / kewalahan\")", "Menegaskan keberadaan Task Paralysis, bukan sekadar faktor kemalasan."),
    ("Pengalaman gagal mengumpulkan tugas tepat waktu", "53,6% (Minimal 1x per semester)", "Mengakibatkan kerugian akademik langsung (nilai penalti/gugur)."),
    ("Penggunaan to-do list & efektivitasnya", "67,9% memakai, 57,1% tidak efektif", "Membuktikan to-do list pasif gagal menjawab kebutuhan eksekusi."),
]

for ri, rdata in enumerate(surv_rows):
    row = tbl_survei.rows[ri + 1]
    row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    for ci in range(3):
        cell = row.cells[ci]
        cell.width = DxaLength(w_surv[ci])
        set_cell_margins(cell, top=30, bottom=30, left=50, right=50)
        align = WD_ALIGN_PARAGRAPH.CENTER if ci == 1 else WD_ALIGN_PARAGRAPH.LEFT
        format_cell_text(cell, rdata[ci], bold=(ci==1), size_pt=9.5, align=align)

add_heading_2(doc, "2.3 Observasi & Wawancara Kualitatif Mahasiswa")
add_p(doc, '• Narasumber (Mahasiswa S1 Semester 5): "Masalah utamanya bukan tidak mau mengerjakan, tetapi saat membuka modul tugas 15 halaman langsung pusing. Andai ada yang memandu: \'Hari ini cukup tulis pendahuluan 30 menit dulu\', pasti langsung saya kerjakan."')
add_p(doc, "• Observasi Kanal Koordinasi Akademik: Diskusi penugasan di WhatsApp/Discord kelas selalu melonjak drastis pada rentang pukul 21.00–23.59 WIB pada malam sebelum tenggat, menghasilkan kualitas analisis yang rendah akibat dikerjakan tergesa-gesa.")

add_heading_1(doc, "3. Solusi yang Ditawarkan")
add_p(doc, 'KilasTugas hadir dengan filosofi dasar: "Problem First, Technology Second: Jangan tanya kapan selesai, tanyakan apa yang dikerjakan hari ini."')

add_heading_2(doc, "3.1 Nilai Inovasi & Fitur Unggulan")
add_p(doc, "1. Dekomposisi Tugas Terarah Berbasis AI: Pengguna memasukkan judul, instruksi dosen, mata kuliah, dan deadline. Mesin AI membedah instruksi menjadi 3–8 sub-tugas konkret terurut. Tiap langkah memuat aksi spesifik (<60 karakter kata kerja aktif), panduan eksekusi praktis, estimasi durasi realistis (25–90 menit), dan target hari terdistribusi merata.")
add_p(doc, "2. Smart Caching & Deterministic Fallback Engine: Jika tugas serupa pernah dipecah seangkatan, sistem menyajikan cetak biru instan (<20ms, 0 token LLM). Jika terjadi gangguan koneksi, sistem otomatis beralih ke template kurasi kurikulum kategori tugas.")
add_p(doc, "3. Visual Micro-Pacing & Circular Progress Gauge: Status pengerjaan dipantau real-time (On Track, Behind Schedule, Overdue) dengan progress ring dinamis.")
add_p(doc, "4. Distraction-Free Focus Engine & Floating Mini-Timer: Pomodoro Timer (25/5 menit) berjalan persisten di latar belakang dengan floating pill, akurasi timestamp Date.now(), sinkronisasi judul tab browser, audio chime Web Audio API, dan desktop notification.")
add_p(doc, "5. Integrasi Kalender Nyata: Tombol ekspor berkas standar iCalendar RFC 5545 (.ics) dengan pengingat alarm 15 menit otomatis, serta direct web/app intent ke Google Calendar di smartphone.")
add_p(doc, "6. Task Blueprint Sharing: Fitur berbagi rencana kerja via tautan unik (/p/:id) yang memungkinkan mahasiswa sekelas mengimpor jadwal tugas dalam 1 detik.")
add_p(doc, "7. Zero-Barrier Guest Mode: Pengguna dapat langsung mengakses fitur tanpa hambatan registrasi melalui sinkronisasi dual-layer antara browser localStorage dan MariaDB.")

add_heading_1(doc, "4. Target Pengguna & Persona")
add_heading_2(doc, "4.1 Target Pengguna")
add_p(doc, "• Target Primer: Mahasiswa aktif D3/D4/S1 (usia 18–24 tahun) yang memiliki beban penugasan multi-matakuliah padat.")
add_p(doc, "• Target Sekunder: Pelajar SMA/SMK/sederajat dan fresh graduate pelatihan mandiri.")
add_p(doc, "• Karakteristik Akses: Akses cepat mobile & web browser, hemat kuota, dan antarmuka clean light mode editorial minimalis anti-slop.")

add_heading_2(doc, "4.2 User Persona")
add_heading_3(doc, "Persona 1: Mahasiswa Aktif Akademik & Organisasi")
add_p(doc, "Nama: Reza Aditya (20 tahun), Mahasiswa Informatika Semester 5. Perilaku: Menghadapi 6 mata kuliah dan 2 praktikum mingguan, aktif di BEM. Pain Point: Menunda tugas besar praktikum karena modul instruksi rumit; panik pada H-1. Kebutuhan: Pemecah tugas otomatis yang memberi panduan kerja 30–45 menit per hari seusai kuliah.")

add_heading_3(doc, "Persona 2: Siswi Sekolah / Pelajar Mandiri")
add_p(doc, "Nama: Siti Nurhaliza (17 tahun), Siswi SMA Kelas 12. Perilaku: Mempersiapkan tugas proyek akhir sekolah mandiri dengan kuota terbatas. Pain Point: Bingung menyusun tahapan karya ilmiah mandiri. Kebutuhan: Platform ringan tanpa login rumit yang memberikan rincian langkah kerja terstruktur.")

add_heading_1(doc, "5. Dampak & Indikator Keberhasilan")
add_heading_2(doc, "5.1 Dampak Kualitatif")
add_p(doc, "1. Reduksi Kecemasan Akademik: Mengeliminasi sindrom Task Paralysis saat menerima penugasan tebal.")
add_p(doc, "2. Peningkatan Mutu Luaran Tugas: Tugas yang dicicil bertahap memiliki kedalaman analisis dan kerapian jauh lebih tinggi dibanding hasil kerja semalam.")
add_p(doc, "3. Pembentukan Disiplin Belajar: Menumbuhkan kebiasaan micro-habits dan deep work terarah.")

add_heading_2(doc, "5.2 Indikator Keberhasilan Terukur (KPI Produk)")

tbl_kpi = doc.add_table(rows=6, cols=2)
tbl_kpi.alignment = WD_TABLE_ALIGNMENT.CENTER
set_table_borders(tbl_kpi, color="000000", sz="4")
w_kpi = [int(TOTAL_W_DXA * 0.55), int(TOTAL_W_DXA * 0.45)]

kpi_data = [
    ("Task Initiation Rate", ">85% pengguna mengeksekusi sub-tugas pertama dalam <24 jam."),
    ("Task Completion Rate", "Peningkatan tingkat tuntas tepat waktu dari 50% menjadi >80%."),
    ("Response Latency Breakdown", "Penguraian tugas selesai dalam <2 detik via 9Router local inference."),
    ("System Reliability & Availability", "100% uptime ketersediaan fitur berkat AI + Smart Cache + Fallback Template."),
    ("Usability / User Satisfaction", "Skor SUS (System Usability Scale) >80 (Kategori Excellent)."),
]

cell_k0 = tbl_kpi.rows[0].cells[0]
cell_k1 = tbl_kpi.rows[0].cells[1]
cell_k0.width = DxaLength(w_kpi[0])
cell_k1.width = DxaLength(w_kpi[1])
set_cell_margins(cell_k0, top=35, bottom=35, left=60, right=60)
set_cell_margins(cell_k1, top=35, bottom=35, left=60, right=60)
format_cell_text(cell_k0, "Metrik Evaluasi", bold=True, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER, bg_color="E4E4E7")
format_cell_text(cell_k1, "Target Capaian (Tahap Pengujian & Pilot)", bold=True, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER, bg_color="E4E4E7")
tbl_kpi.rows[0]._tr.get_or_add_trPr().append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

for ri, (m, c) in enumerate(kpi_data):
    row = tbl_kpi.rows[ri + 1]
    row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    for ci in range(2):
        cell = row.cells[ci]
        cell.width = DxaLength(w_kpi[ci])
        set_cell_margins(cell, top=30, bottom=30, left=60, right=60)
    format_cell_text(row.cells[0], m, bold=True, size_pt=9.5)
    format_cell_text(row.cells[1], c, bold=False, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER)

add_heading_1(doc, "6. Teknologi yang Digunakan")
add_p(doc, "Arsitektur KilasTugas mengadopsi prinsip efisiensi komputasi, keandalan data (high availability), dan kesiapan operasional daring penuh:")
add_p(doc, "• Frontend Layer: Single Page Application React 18, Vite 5, Tailwind CSS, dan Lucide Icons berukuran sangat ringan (<90KB gzip), responsif multi-device (Mobile, Tablet, Desktop) dideploy pada Vercel Global Edge Network (https://kilastugas.vercel.app).")
add_p(doc, "• Backend Layer: Framework Python 3.12 FastAPI asinkronus performa tinggi dengan validasi Pydantic v2, terpasang pada VPS Ubuntu Linux dengan Nginx reverse proxy dan SSL Let's Encrypt (https://api-kilastugas.najmifaza.my.id).")
add_p(doc, "• AI Inference & Smart Cache: Terhubung ke gateway 9Router lokal port 20128 dengan model ag/gemini-3.7-flash-medium, diperkuat mekanisme Smart Cache pencocokan kesamaan tugas pada basis data.")
add_p(doc, "• Data Persistence: Basis data MariaDB 10.x dengan skema relasional terstruktur (sessions, tasks, subtasks, pomodoro_sessions) didukung lapisan localStorage peramban.")

add_heading_1(doc, "7. AI Usage Declaration (Deklarasi Penggunaan AI)")
add_p(doc, "Sesuai ketentuan integritas kompetisi pada Bab 5.3 & Bab 5.6 Guidebook SIFest Digital Innovation Challenge 2026, tim mendeklarasikan pemanfaatan AI secara jujur dan transparan:")

tbl_ai = doc.add_table(rows=5, cols=2)
tbl_ai.alignment = WD_TABLE_ALIGNMENT.CENTER
set_table_borders(tbl_ai, color="000000", sz="4")
w_ai = [int(TOTAL_W_DXA * 0.35), int(TOTAL_W_DXA * 0.65)]

ai_data = [
    ("Fitur Runtime Produk", "9Router (ag/gemini-3.7-flash-medium) mentransformasi teks instruksi tugas menjadi array sub-tugas terstruktur."),
    ("Bantuan Pengembangan Kode", "Autocomplete sintaksis boilerplates, pengecekan tipe skema Pydantic, dan validasi ekspresi regex."),
    ("Perancangan Antarmuka", "Inspirasi sistem desain editorial minimalis dan palet warna light mode netral."),
    ("Batasan Integritas Tim (Karya Asli)", "100% ideasi solusi, perancangan arsitektur, penyusunan instrumen riset empiris 28 responden, analisis triangulasi masalah, serta kode controller dibuat dan dipahami penuh oleh seluruh anggota tim."),
]

cell_a0 = tbl_ai.rows[0].cells[0]
cell_a1 = tbl_ai.rows[0].cells[1]
cell_a0.width = DxaLength(w_ai[0])
cell_a1.width = DxaLength(w_ai[1])
set_cell_margins(cell_a0, top=35, bottom=35, left=60, right=60)
set_cell_margins(cell_a1, top=35, bottom=35, left=60, right=60)
format_cell_text(cell_a0, "Aspek Pemanfaatan", bold=True, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER, bg_color="E4E4E7")
format_cell_text(cell_a1, "Rincian Pemanfaatan AI", bold=True, size_pt=9.5, align=WD_ALIGN_PARAGRAPH.CENTER, bg_color="E4E4E7")
tbl_ai.rows[0]._tr.get_or_add_trPr().append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

for ri, (asp, det) in enumerate(ai_data):
    row = tbl_ai.rows[ri + 1]
    row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    for ci in range(2):
        cell = row.cells[ci]
        cell.width = DxaLength(w_ai[ci])
        set_cell_margins(cell, top=30, bottom=30, left=60, right=60)
    format_cell_text(row.cells[0], asp, bold=True, size_pt=9.5)
    format_cell_text(row.cells[1], det, bold=False, size_pt=9.5)

add_p(doc, "Tim menjamin bahwa AI tidak digunakan untuk memalsukan data empiris, tidak digunakan untuk menjawab pertanyaan juri pada sesi Product Defense, dan seluruh luaran aplikasi dapat dipertanggungjawabkan landasan teknologinya secara mandiri.", italic=True)

add_heading_1(doc, "8. Rencana Implementasi & Status Pengembangan Saat Ini")
add_heading_2(doc, "8.1 Status Progres Saat Ini (100% MVP Online Round Ready)")
add_p(doc, "• Repositori GitHub publik terkonfigurasi dengan struktur monorepo terstandar (backend/ & frontend/).")
add_p(doc, "• Antarmuka form input tugas terpadu dengan opsi selektor jumlah langkah kerja (Otomatis AI atau 3–8 langkah).")
add_p(doc, "• Endpoint backend /api/breakdown terintegrasi model AI 9Router, fallback template, dan smart caching.")
add_p(doc, "• Checklist sub-tugas interaktif harian dengan sinkronisasi dual-layer (localStorage & MariaDB).")
add_p(doc, "• Engine Pomodoro Focus Mode terpasang dengan persistent background timer, floating pill, dan audio chime.")
add_p(doc, "• Ekspor kalender otomatis via RFC 5545 iCalendar (.ics) dan Google Calendar direct intent.")
add_p(doc, "• Fitur viral Task Blueprint Sharing (/p/:id) dengan impor satu detik.")
add_p(doc, "• Video walkthrough demonstrasi produk siap diakses panitia dan dewan juri.")

add_heading_2(doc, "8.2 Rencana Pengembangan Sesi Grand Final & Roadmap (11 Oktober 2026)")
add_p(doc, "1. Product Sprint Sesi I (09.00–12.00 WIB): Implementasi AI Syllabus & PDF Reader (ekstraksi instruksi modul tugas PDF/DOCX secara nir-ketik) dan pembagian tugas kelompok cerdas (Collaborative Task Split).")
add_p(doc, "2. Product Sprint Sesi II (13.00–15.00 WIB): Implementasi Always-On Web Push Notification berbasis Service Worker dan kapabilitas Progressive Web App (PWA) Offline-First.")
add_p(doc, "3. Demo Day & Product Defense (15.45–18.00 WIB): Live walkthrough end-to-end pemecahan instruksi tugas nyata, import cetak biru tugas antar-mahasiswa, dan pembuktian dampak micro-pacing di hadapan dewan juri.")

# Save DOCX
doc.save(DOCX_OUT)
print(f"DOCX saved successfully to {DOCX_OUT}")

# Convert to PDF via Word COM
print("Converting DOCX to PDF via Word COM Automation...")
word = win32com.client.Dispatch("Word.Application")
word.Visible = False
try:
    doc_word = word.Documents.Open(os.path.abspath(DOCX_OUT))
    doc_word.SaveAs(os.path.abspath(PDF_OUT), FileFormat=17) # 17 = wdFormatPDF
    page_count = doc_word.ComputeStatistics(2) # 2 = wdStatisticPages
    doc_word.Close()
    print(f"PDF saved successfully to {PDF_OUT}")
    print(f"Total Pages Generated: {page_count} halaman (Cover + {page_count - 1} halaman isi)")
finally:
    word.Quit()
