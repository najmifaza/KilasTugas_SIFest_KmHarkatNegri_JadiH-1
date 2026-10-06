import os
import re
import docx
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

FONT_NAME = 'Times New Roman'
# A4 Content Width DXA (21.0cm - 3.2cm L - 2.5cm R = 15.3 cm = 8674 dxa)
TOTAL_W_DXA = 8674

MD_INPUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\Proposal_KilasTugas.md"
DOCX_OUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\TimKilasTugas_KilasTugas_Proposal.docx"
LOGO_PATH = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\Logo.png"
DIAGRAM_SOLUSI = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\diagram_solusi.png"
DIAGRAM_ARSITEKTUR = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\diagram_arsitektur.png"

def set_cell_margins(cell, top=40, bottom=40, left=80, right=80):
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
    borders = parse_xml(f"""
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    """)
    tblPr.append(borders)

def add_page_number_to_section(section):
    sectPr = section._sectPr
    titlePg = OxmlElement('w:titlePg')
    sectPr.append(titlePg)

    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    
    r = p.add_run()
    r.font.name = FONT_NAME
    r.font.size = Pt(10)
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    p._p.append(fldSimple)

def plain(s):
    return re.sub(r'[*_`]', '', s)

def col_widths(rows, total_w=TOTAL_W_DXA):
    n = len(rows[0])
    def cw(ch):
        if re.match(r'[A-Z0-9#]', ch):
            return 140
        elif re.match(r'[ilftjr.,:;()/\-]', ch):
            return 62
        else:
            return 98

    mins = []
    weights = []
    for c in range(n):
        longest = 0
        tot = 0
        for ri, r in enumerate(rows):
            cell_str = plain(r[c] if c < len(r) else '')
            tot += len(cell_str)
            f = 1.12 if (ri == 0 or (c < len(r) and r[c].startswith('**'))) else 1.0
            for w in cell_str.split():
                w_len = f * sum(cw(ch) for ch in w)
                if w_len > longest:
                    longest = w_len
        mins.append(min(longest * 1.0 + 170, 2500))
        weights.append(max(8, min(tot / max(len(rows), 1), 120)))

    sum_min = sum(mins)
    if sum_min >= total_w:
        w = [int(m * total_w / sum_min) for m in mins]
    else:
        extra = total_w - sum_min
        sw = sum(weights)
        w = [int(m + extra * weights[i] / sw) for i, m in enumerate(mins)]
    
    rem = total_w - sum(w)
    w[-1] += rem
    return w

def runs(paragraph, text, base_font_size=12.0, default_bold=False, default_italic=False, default_color=None):
    re_tokens = re.compile(r'(\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)')
    last = 0
    for m in re_tokens.finditer(text):
        if m.start() > last:
            r = paragraph.add_run(text[last:m.start()])
            r.font.name = FONT_NAME
            r.font.size = Pt(base_font_size)
            if default_bold: r.font.bold = True
            if default_italic: r.font.italic = True
            if default_color: r.font.color.rgb = default_color

        if m.group(2) is not None:
            r = paragraph.add_run(m.group(2))
            r.font.name = FONT_NAME
            r.font.size = Pt(base_font_size)
            r.font.bold = True
            r.font.italic = True
        elif m.group(3) is not None:
            r = paragraph.add_run(m.group(3))
            r.font.name = FONT_NAME
            r.font.size = Pt(base_font_size)
            r.font.bold = True
        elif m.group(4) is not None:
            r = paragraph.add_run(m.group(4))
            r.font.name = FONT_NAME
            r.font.size = Pt(base_font_size)
            r.font.italic = True
        elif m.group(5) is not None:
            r = paragraph.add_run(m.group(5))
            r.font.name = 'Consolas'
            r.font.size = Pt(base_font_size - 1)
        last = m.end()

    if last < len(text):
        r = paragraph.add_run(text[last:])
        r.font.name = FONT_NAME
        r.font.size = Pt(base_font_size)
        if default_bold: r.font.bold = True
        if default_italic: r.font.italic = True
        if default_color: r.font.color.rgb = default_color

def spacer_p(doc, pt=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(pt)
    p.paragraph_format.line_spacing = 1.0

def make_table(doc, rows, base_size=9.5, line_spacing=1.0, center_cols=None):
    if center_cols is None:
        center_cols = []
    widths_dxa = col_widths(rows, TOTAL_W_DXA)
    table = doc.add_table(rows=len(rows), cols=len(widths_dxa))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_borders(table, color="000000", sz="4", val="single")

    for ri, row in enumerate(rows):
        trow = table.rows[ri]
        trPr = trow._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))

        if ri == 0:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

        for ci, cell_text in enumerate(row):
            cell = trow.cells[ci]
            cell.width = Inches(widths_dxa[ci] / 1440.0)
            set_cell_margins(cell, top=30, bottom=30, left=60, right=60)
            cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP

            # Shading header row
            if ri == 0:
                shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="E4E4E7"/>')
                cell._tc.get_or_add_tcPr().append(shading)

            p = cell.paragraphs[0]
            is_center = (ri == 0 or ci in center_cols)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if is_center else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.line_spacing = line_spacing
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

            clean_text = cell_text.replace('<br>', '\n').replace('&amp;', '&')
            sub_lines = clean_text.split('\n')
            for sli, sl in enumerate(sub_lines):
                if sli > 0:
                    p = cell.add_paragraph()
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if is_center else WD_ALIGN_PARAGRAPH.LEFT
                    p.paragraph_format.line_spacing = line_spacing
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                runs(p, sl, base_font_size=base_size, default_bold=(ri == 0))
    return table

def render_diagram_image(doc, img_path, caption_text):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(2)
        p_img.paragraph_format.keep_with_next = True
        r = p_img.add_run()
        r.add_picture(img_path, width=Inches(TOTAL_W_DXA / 1440.0))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(6)
        runs(p_cap, caption_text, base_font_size=10.0, default_bold=True, default_italic=True)

def build_docx_proposal():
    with open(MD_INPUT, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    raw_lines = raw_text.split('\n')
    doc = Document()

    # A4 Page Setup (Top 2.5cm, Bottom 2.5cm, Left 3.0cm, Right 2.5cm)
    sec = doc.sections[0]
    sec.page_width = Inches(21.0 / 2.54)
    sec.page_height = Inches(29.7 / 2.54)
    sec.top_margin = Inches(2.5 / 2.54)
    sec.bottom_margin = Inches(2.5 / 2.54)
    sec.left_margin = Inches(3.0 / 2.54)
    sec.right_margin = Inches(2.5 / 2.54)
    add_page_number_to_section(sec)

    # Styles
    normal = doc.styles['Normal']
    normal.font.name = FONT_NAME
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor(0x00, 0x00, 0x00)

    is_cover = True
    in_table = False
    table_rows = []
    in_code = False
    code_lines = []
    code_block_index = 0
    i = 0

    while i < len(raw_lines):
        line = raw_lines[i]
        stripped = line.strip()

        # Handle Code block (```) -> Replace with professional SVG Diagram Images!
        if stripped.startswith('```'):
            if in_code:
                in_code = False
                code_block_index += 1
                if code_block_index == 1:
                    render_diagram_image(doc, DIAGRAM_SOLUSI, "Gambar 1. Alur Pemrosesan Masalah Menuju Empat Pilar Solusi KilasTugas")
                elif code_block_index == 2:
                    render_diagram_image(doc, DIAGRAM_ARSITEKTUR, "Gambar 2. Diagram Arsitektur Sistem dan Distribusi Layanan KilasTugas")
                code_lines = []
            else:
                in_code = True
                code_lines = []
            i += 1
            continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        # Handle Table
        if stripped.startswith('|') and '|' in stripped[1:]:
            in_table = True
            table_rows.append(stripped)
            i += 1
            continue
        else:
            if in_table:
                cleaned = []
                for r in table_rows:
                    if re.match(r'^\s*\|?\s*[-:\s|]+\s*\|?\s*$', r):
                        continue
                    cells = [c.strip() for c in r.strip().strip('|').split('|')]
                    cleaned.append(cells)
                if cleaned:
                    spacer_p(doc, 3)
                    # Detect center cols
                    center_cols = [1] if len(cleaned[0]) == 3 and "Temuan Data" in cleaned[0][1] else []
                    make_table(doc, cleaned, base_size=9.5, line_spacing=1.0, center_cols=center_cols)
                    spacer_p(doc, 3)
                in_table = False
                table_rows = []

        if not stripped:
            i += 1
            continue

        if re.match(r'^---+\s*$', stripped):
            i += 1
            continue

        # Headings
        h_match = re.match(r'^(#{1,4})\s+(.*)$', stripped)
        if h_match:
            lvl = len(h_match.group(1))
            text = h_match.group(2).strip()

            if text.startswith('1. RINGKASAN MASALAH'):
                if is_cover:
                    is_cover = False
                    doc.add_page_break()

            if is_cover:
                # Cover layout (Sesuai ClaudeBuildProposal.js yang simetris elegan)
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.line_spacing = 1.15
                if text == "PROPOSAL INOVASI DIGITAL":
                    p.paragraph_format.space_before = Pt(28)
                    p.paragraph_format.space_after = Pt(4)
                    runs(p, text, base_font_size=15, default_bold=True)
                elif "SIFest Digital Innovation" in text:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(28)
                    runs(p, text, base_font_size=12, default_bold=True)
                elif text == "KILASTUGAS":
                    if os.path.exists(LOGO_PATH):
                        p_img = doc.add_paragraph()
                        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        p_img.paragraph_format.space_before = Pt(0)
                        p_img.paragraph_format.space_after = Pt(20)
                        p_img.add_run().add_picture(LOGO_PATH, width=Inches(1.8))
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(4)
                    runs(p, text, base_font_size=20, default_bold=True)
                elif text == "INFORMASI TIM & PRODUK":
                    p.paragraph_format.space_before = Pt(20)
                    p.paragraph_format.space_after = Pt(4)
                    runs(p, text, base_font_size=11, default_bold=True)
                else:
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    runs(p, text, base_font_size=11, default_bold=True)
                i += 1
                continue
            else:
                # Content Headings
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.keep_with_next = True
                if lvl == 1 or (lvl == 2 and re.match(r'^\d+\.\s+', text)):
                    # BAB 1, 2, 3
                    p.paragraph_format.space_before = Pt(8)
                    p.paragraph_format.space_after = Pt(2)
                    p.paragraph_format.line_spacing = 1.15
                    runs(p, text, base_font_size=12, default_bold=True)
                elif lvl == 2 or (lvl == 3 and re.match(r'^\d+\.\d+\s+', text)):
                    # Sub-bab 1.1, 1.2...
                    p.paragraph_format.space_before = Pt(6)
                    p.paragraph_format.space_after = Pt(2)
                    p.paragraph_format.line_spacing = 1.15
                    runs(p, text, base_font_size=11, default_bold=True)
                else:
                    p.paragraph_format.space_before = Pt(4)
                    p.paragraph_format.space_after = Pt(1)
                    p.paragraph_format.line_spacing = 1.15
                    runs(p, text, base_font_size=11, default_bold=True, default_italic=True)
                i += 1
                continue

        # Checklists
        chk_match = re.match(r'^(\s*)-\s+\[([ xX])\]\s+(.*)$', stripped)
        if chk_match:
            box = '[√]' if chk_match.group(2) in ['x', 'X'] else '[  ]'
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.line_spacing = 1.12
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1.5)
            p.paragraph_format.left_indent = Inches(0.35)
            p.paragraph_format.first_line_indent = Inches(-0.35)

            r_box = p.add_run(f"{box}  ")
            r_box.font.name = FONT_NAME
            r_box.font.size = Pt(11)
            runs(p, chk_match.group(3), base_font_size=11)
            i += 1
            continue

        # Lists with hanging indent
        li_match = re.match(r'^(\s*)([*-]|\d+\.)\s+(.*)$', stripped)
        if li_match:
            indent_spaces = len(li_match.group(1))
            bullet = li_match.group(2)
            content = li_match.group(3)

            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(2)
            
            is_digit = bool(re.match(r'\d+\.', bullet))
            base_ind = 0.3 * (1 + (indent_spaces // 2))
            p.paragraph_format.left_indent = Inches(base_ind)
            p.paragraph_format.first_line_indent = Inches(-0.25 if is_digit else -0.2)

            marker = f"{bullet} " if is_digit else "•  "
            r_mark = p.add_run(marker)
            r_mark.font.name = FONT_NAME
            r_mark.font.size = Pt(11)
            if is_digit:
                r_mark.font.bold = True

            runs(p, content, base_font_size=11)
            i += 1
            continue

        # Blockquote (Rumusan Masalah): Q(t) dengan indent simetris
        if stripped.startswith('> '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.left_indent = Inches(0.4)
            p.paragraph_format.right_indent = Inches(0.4)
            runs(p, stripped[2:].strip(), base_font_size=11, default_italic=True)
            i += 1
            continue

        # Regular Body Paragraph
        p = doc.add_paragraph()
        if is_cover:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.15
            runs(p, stripped, base_font_size=11, default_italic=True)
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(2.5)
            p.paragraph_format.line_spacing = 1.15
            runs(p, stripped, base_font_size=11)
        i += 1

    # End of file table check
    if in_table and table_rows:
        cleaned = []
        for r in table_rows:
            if re.match(r'^\s*\|?\s*[-:\s|]+\s*\|?\s*$', r):
                continue
            cells = [c.strip() for c in r.strip().strip('|').split('|')]
            cleaned.append(cells)
        if cleaned:
            spacer_p(doc, 3)
            center_cols = [1] if len(cleaned[0]) == 3 and "Temuan Data" in cleaned[0][1] else []
            make_table(doc, cleaned, base_size=9.5, line_spacing=1.0, center_cols=center_cols)
            spacer_p(doc, 3)

    doc.save(DOCX_OUT)
    print(f"DOCX created: {DOCX_OUT} ({os.path.getsize(DOCX_OUT)} bytes)")

if __name__ == '__main__':
    build_docx_proposal()
