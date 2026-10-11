import io
import json
import logging
import re
from fastapi import APIRouter, File, UploadFile, HTTPException
from config.ai import ai_client, AI_MODEL
import pypdf
import docx

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["syllabus"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB in-memory limit

INSTRUCTION_KEYWORDS = [
    "tugas", "instruksi", "petunjuk", "rubrik", "penilaian",
    "deskripsi", "langkah", "ketentuan", "kriteria", "soal",
    "pengumpulan", "submisi", "bobot", "assignment", "rubric",
    "instructions", "grading", "requirements", "deadline"
]

SKIP_KEYWORDS = [
    "daftar pustaka", "kata pengantar", "prakata",
    "biodata", "referensi", "bibliography"
]

def extract_text_from_pdf(stream: io.BytesIO) -> str:
    reader = pypdf.PdfReader(stream)
    pages_text = []
    for page in reader.pages:
        text = page.extract_text() or ""
        if text.strip():
            pages_text.append(text.strip())
    return "\n\n".join(pages_text)

def extract_text_from_docx(stream: io.BytesIO) -> str:
    doc = docx.Document(stream)
    lines = []
    for p in doc.paragraphs:
        t = p.text.strip()
        if t:
            lines.append(t)
    # Ekstrak teks dalam tabel (rubrik, matriks penilaian, jadwal)
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
            if row_text:
                lines.append(row_text)
    return "\n\n".join(lines)

def sliding_window_filter(raw_text: str, max_chars: int = 8000) -> str:
    cleaned = re.sub(r'[ \t]+', ' ', raw_text)
    chunks = [c.strip() for c in re.split(r'\n{2,}', cleaned) if c.strip()]
    if not chunks:
        chunks = [c.strip() for c in cleaned.split("\n") if c.strip()]

    if not chunks:
        return ""

    # Jika teks dokumen masih di bawah batas, kirim utuh tanpa potong
    if len(cleaned) <= max_chars:
        filtered = [c for c in chunks if not any(sk in c.lower() for sk in SKIP_KEYWORDS)]
        return "\n\n".join(filtered) if filtered else cleaned[:max_chars]

    # Beri skor tiap chunk namun simpan indeks aslinya agar alur bacaan tidak teracak
    scored_chunks = []
    for idx, chunk in enumerate(chunks):
        lower = chunk.lower()
        if any(sk in lower for sk in SKIP_KEYWORDS):
            continue
        score = sum(1 for kw in INSTRUCTION_KEYWORDS if kw in lower)
        # Prioritas ekstra pada 2 chunk awal (memuat Judul Tugas, Mata Kuliah, Dosen)
        if idx < 2:
            score += 15
        scored_chunks.append((idx, score, chunk))

    if not scored_chunks:
        return raw_text[:max_chars]

    # Pilih chunk paling berbobot
    top_chunks = sorted(scored_chunks, key=lambda x: x[1], reverse=True)
    selected_indexed = []
    cur_len = 0
    for orig_idx, score, chunk in top_chunks:
        if cur_len + len(chunk) > max_chars:
            rem = max_chars - cur_len
            if rem > 100:
                selected_indexed.append((orig_idx, chunk[:rem]))
            break
        selected_indexed.append((orig_idx, chunk))
        cur_len += len(chunk)

    # Urutkan KEMBALI ke urutan kronologis dokumen asli
    selected_indexed.sort(key=lambda x: x[0])
    return "\n\n".join(chunk for _, chunk in selected_indexed)

def fallback_heuristics(text: str) -> dict:
    lower = text.lower()
    cat = "custom"
    if any(k in lower for k in ["praktikum", "laboratorium", "modul praktikum", "laporan lab"]):
        cat = "laporan_lab"
    elif any(k in lower for k in ["koding", "pemrograman", "program", "code", "github", "aplikasi", "software"]):
        cat = "coding"
    elif any(k in lower for k in ["makalah", "paper", "kajian", "esai", "tinjauan"]):
        cat = "makalah"
    elif any(k in lower for k in ["presentasi", "slide", "ppt", "powerpoint", "pitch"]):
        cat = "presentasi"

    # Cari baris yang memuat indikasi judul
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    title = "Tugas Kuliah Terstruktur"
    for line in lines[:8]:
        line_clean = re.sub(r'^[#*\-•\d\.\s]+', '', line).strip()
        if len(line_clean) >= 6 and len(line_clean) <= 70:
            if any(k in line_clean.lower() for k in ["tugas", "projek", "makalah", "laporan", "analisis", "sistem", "modul"]):
                title = line_clean
                break
    if title == "Tugas Kuliah Terstruktur" and lines:
        first_clean = re.sub(r'^[#*\-•\d\.\s]+', '', lines[0]).strip()
        if len(first_clean) >= 6:
            title = first_clean[:60]

    # Cari indikasi mata kuliah
    subject = "Mata Kuliah"
    for line in lines[:10]:
        lower_line = line.lower()
        if "mata kuliah" in lower_line or "matakuliah" in lower_line or "mk:" in lower_line:
            parts = re.split(r'[:\-–]', line, maxsplit=1)
            if len(parts) > 1 and len(parts[1].strip()) >= 3:
                subject = parts[1].strip()[:40]
                break

    return {
        "title": title,
        "subject": subject if subject != "Mata Kuliah" else None,
        "category": cat,
        "description": text[:800],
        "deadline_date": None,
        "deadline_time": None,
    }

@router.post("/extract-syllabus")
async def extract_syllabus(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nama berkas tidak valid.")

    filename_lower = file.filename.lower()
    is_pdf = filename_lower.endswith(".pdf")
    is_docx = filename_lower.endswith(".docx")

    if not (is_pdf or is_docx):
        raise HTTPException(
            status_code=400,
            detail="Format berkas tidak didukung. Harap unggah berkas PDF atau DOCX."
        )

    # In-memory stream read & buffer check
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran berkas ({len(content) // 1024} KB) melebihi batas maksimal 5 MB."
        )
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Berkas kosong.")

    stream = io.BytesIO(content)

    try:
        if is_pdf:
            raw_text = extract_text_from_pdf(stream)
        else:
            raw_text = extract_text_from_docx(stream)
    except Exception as e:
        logger.error(f"Gagal mengekstrak berkas {file.filename}: {e}")
        raise HTTPException(
            status_code=422,
            detail=f"Gagal membaca teks dari berkas: {str(e)}"
        )

    if not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Tidak ditemukan teks yang dapat dibaca di dalam dokumen (mungkin berupa scan gambar)."
        )

    # Sliding window parser (prioritaskan instruksi/rubrik tanpa merusak urutan bacaan dokumen)
    filtered_text = sliding_window_filter(raw_text, max_chars=8000)

    # AI Extraction for Title, Subject, Category, Description
    prompt = f"""Kamu adalah parser dokumen silabus dan lembar panduan tugas kuliah dari dosen.
Tugasmu: Analisis dokumen instruksi tugas kuliah berikut dan ekstrak informasinya secara akurat menjadi JSON murni.

Kategori yang valid:
- "laporan_lab": Praktikum, laporan laboratorium, uji coba lab.
- "makalah": Makalah, karya tulis ilmiah, paper, esai, studi literatur.
- "coding": Pemrograman, implementasi fitur, proyek aplikasi, web/mobile dev, algoritma.
- "presentasi": Presentasi tugas besar, slide decks, demo pitch.
- "custom": Tugas umum atau penugasan lainnya.

Aturan Ekstraksi:
1. "title": Ambil nama penugasan/proyek spesifik dari dokumen (misal: "Tugas 2: Implementasi REST API" atau "Makalah Analisis Sistem"), BUKAN nama mata kuliah, maksimal 60 karakter.
2. "subject": Ambil nama mata kuliah resmi jika ada di dokumen (misal: "Pemrograman Web", "Kecerdasan Buatan"), maksimal 40 karakter. Jika tidak ditemukan, isi null.
3. "category": Pilih salah satu kategori paling relevan dari daftar di atas.
4. "description": Tulis rangkuman instruksi konkret tugas ini (tujuan tugas, batasan teknologi/format pengumpulan, dan luaran utama yang diminta dosen), padat dalam 2-4 kalimat.
5. "deadline_date": Cari tanggal tenggat/batas pengumpulan tugas jika tertulis di dokumen. Format WAJIB "YYYY-MM-DD" (contoh: "2026-10-25"). Jika tidak ada tanggal tertera, isi null.
6. "deadline_time": Jam batas pengumpulan jika tertulis di dokumen. Format "HH:MM" (contoh: "23:59" atau "17:00"). Jika tidak ada jam tertera, isi null.

Format JSON murni (tanpa markdown, tanpa backtick, tanpa kata pengantar):
{{
  "title": "Judul spesifik tugas",
  "subject": "Nama mata kuliah",
  "category": "coding",
  "description": "Deskripsi instruksi tugas...",
  "deadline_date": "2026-10-25",
  "deadline_time": "23:59"
}}

Teks Panduan Dokumen:
\"\"\"{filtered_text}\"\"\"
"""

    suggested = None
    try:
        ai_resp = await ai_client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": "Kamu adalah asisten ekstraksi instruksi silabus tugas kuliah. Keluarkan HANYA JSON murni."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=600,
        )
        resp_raw = (ai_resp.choices[0].message.content or "").strip()
        if "```" in resp_raw:
            parts = resp_raw.split("```")
            resp_raw = parts[1]
            if resp_raw.startswith("json"):
                resp_raw = resp_raw[4:]
        resp_raw = resp_raw.strip()
        parsed = json.loads(resp_raw)
        if isinstance(parsed, dict) and "title" in parsed:
            d_date = parsed.get("deadline_date")
            d_time = parsed.get("deadline_time")
            # Validasi format YYYY-MM-DD
            if d_date and not re.match(r'^\d{4}-\d{2}-\d{2}$', str(d_date).strip()):
                d_date = None
            if d_time and not re.match(r'^\d{1,2}:\d{2}$', str(d_time).strip()):
                d_time = None

            suggested = {
                "title": str(parsed.get("title", ""))[:60],
                "subject": str(parsed.get("subject", ""))[:40],
                "category": str(parsed.get("category", "custom")),
                "description": str(parsed.get("description", "")),
                "deadline_date": str(d_date).strip() if d_date else None,
                "deadline_time": str(d_time).strip() if d_time else None,
            }
    except Exception as ai_err:
        logger.warning(f"AI extraction fallback to heuristics: {ai_err}")

    if not suggested:
        suggested = fallback_heuristics(filtered_text)

    # Validasi kategori
    if suggested["category"] not in ["laporan_lab", "makalah", "coding", "presentasi", "custom"]:
        suggested["category"] = "custom"

    return {
        "success": True,
        "filename": file.filename,
        "extracted_chars": len(filtered_text),
        "preview_text": filtered_text[:300] + ("..." if len(filtered_text) > 300 else ""),
        "suggested": suggested,
    }
