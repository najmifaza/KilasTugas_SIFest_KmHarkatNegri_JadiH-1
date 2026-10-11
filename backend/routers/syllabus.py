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
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paragraphs)

def sliding_window_filter(raw_text: str, max_chars: int = 3000) -> str:
    # Pecah per paragraf/bagian
    chunks = [c.strip() for c in re.split(r'\n{2,}', raw_text) if c.strip()]
    
    scored_chunks = []
    for chunk in chunks:
        lower = chunk.lower()
        # Penalti/buang bagian skip (daftar pustaka, kata pengantar, dll)
        if any(sk in lower for sk in SKIP_KEYWORDS):
            continue
        score = sum(1 for kw in INSTRUCTION_KEYWORDS if kw in lower)
        scored_chunks.append((score, chunk))

    # Sort by score descending agar rubrik/instruksi penting diprioritaskan (LOGIC-07)
    if scored_chunks:
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        selected = []
        cur_len = 0
        for score, chunk in scored_chunks:
            if cur_len + len(chunk) > max_chars:
                rem = max_chars - cur_len
                if rem > 80:
                    selected.append(chunk[:rem])
                break
            selected.append(chunk)
            cur_len += len(chunk)
        if selected:
            return "\n\n".join(selected)

    # Fallback potongan awal jika filter kata kunci kosong
    return raw_text[:max_chars]

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

    first_line = text.split("\n")[0].strip()[:60]
    title = first_line if len(first_line) > 5 else "Tugas Kuliah Terstruktur"

    return {
        "title": title,
        "subject": "Tugas Kuliah",
        "category": cat,
        "description": text[:800],
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

    # Sliding window parser (2000 - 3000 chars)
    filtered_text = sliding_window_filter(raw_text, max_chars=2800)

    # AI Extraction for Title, Subject, Category, Description
    prompt = f"""Kamu adalah parser dokumen silabus dan panduan tugas dosen untuk mahasiswa.
Tugasmu: Dari potongan teks panduan tugas di bawah, ekstrak informasi ringkas menjadi format JSON murni.

Kategori yang valid:
- "laporan_lab" (Praktikum / Laporan Lab)
- "makalah" (Makalah / Paper / Esai)
- "coding" (Pemrograman / Aplikasi / Algoritma)
- "presentasi" (Presentasi Proyek / Slide)
- "custom" (Tugas umum / lainnya)

Format JSON murni (tanpa markdown, tanpa backtick, tanpa kata pembuka):
{{
  "title": "Judul tugas singkat dan padat (maksimal 60 karakter)",
  "subject": "Nama mata kuliah atau topik utama (maksimal 40 karakter)",
  "category": "salah satu dari kategori di atas",
  "description": "Rangkuman instruksi tugas dan kriteria utama (2-4 kalimat konkret)"
}}

Potongan teks dokumen:
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
            suggested = {
                "title": str(parsed.get("title", ""))[:60],
                "subject": str(parsed.get("subject", ""))[:40],
                "category": str(parsed.get("category", "custom")),
                "description": str(parsed.get("description", "")),
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
