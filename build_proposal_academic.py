import os
import re
import docx
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import win32com.client

FONT_NAME = 'Times New Roman'
# Lebar cetak: A4 (21.0cm) - Kiri (2.8cm) - Kanan (2.4cm) = 15.8 cm = 8957 dxa
TOTAL_W_DXA = 8957

MD_INPUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\Proposal_KilasTugas.md"
DOCX_OUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\TimKilasTugas_KilasTugas_ProposalRingkas.docx"
PDF_OUT = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\TimKilasTugas_KilasTugas_ProposalRingkas.pdf"
LOGO_PATH = r"D:\Coding\GitHub\KilasTugas_SIFest_KmHarkatNegri_JadiH-1\docs\Logo.png"

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

def make_table(doc, rows, base_size=10.0, line_spacing=1.0):
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
                shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F4F4F5"/>')
                cell._tc.get_or_add_tcPr().append(shading)

            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if ri == 0 else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.line_spacing = line_spacing
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)

            clean_text = cell_text.replace('<br>', '\n').replace('&amp;', '&')
            sub_lines = clean_text.split('\n')
            for sli, sl in enumerate(sub_lines):
                if sli > 0:
                    p = cell.add_paragraph()
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    p.paragraph_format.line_spacing = line_spacing
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                runs(p, sl, base_font_size=base_size, default_bold=(ri == 0))
    return table

def render_code_block(doc, code_lines):
    # Renders ASCII diagram/code nicely in bordered single-cell table or box
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    cell = table.rows[0].cells[0]
    cell.width = Inches(TOTAL_W_DXA / 1440.0)
    set_cell_margins(cell, top=40, bottom=40, left=60, right=60)
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="FAFAFA"/>')
    cell._tc.get_or_add_tcPr().append(shading)
    set_table_borders(table, color="CCCCCC", sz="4", val="single")

    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.0
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    code_text = '\n'.join(code_lines)
    r = p.add_run(code_text)
    r.font.name = 'Consolas'
    r.font.size = Pt(8.0)
    r.font.color.rgb = RGBColor(0x18, 0x18, 0x1B)

def build_academic_proposal():
    with open(MD_INPUT, 'r', encoding='utf-8') as f:
        raw_text = f.read()

    raw_lines = raw_text.split('\n')
    doc = Document()

    # Academic Standard A4 (Top 2.5cm, Bottom 2.5cm, Left 3.0cm, Right 2.5cm)
    sec = doc.sections[0]
    sec.page_width = Inches(21.0 / 2.54)
    sec.page_height = Inches(29.7 / 2.54)
    sec.top_margin = Inches(2.4 / 2.54)
    sec.bottom_margin = Inches(2.4 / 2.54)
    sec.left_margin = Inches(2.8 / 2.54)
    sec.right_margin = Inches(2.4 / 2.54)
    add_page_number_to_section(sec)

    # Base typography
    normal = doc.styles['Normal']
    normal.font.name = FONT_NAME
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor(0x00, 0x00, 0x00)
    normal.paragraph_format.line_spacing = 1.12

    # State tracking
    is_cover = True
    in_table = False
    table_rows = []
    in_code = False
    code_lines = []
    i = 0

    while i < len(raw_lines):
        line = raw_lines[i]
        stripped = line.strip()

        # Handle Code block (```)
        if stripped.startswith('```'):
            if in_code:
                in_code = False
                spacer_p(doc, 2)
                render_code_block(doc, code_lines)
                spacer_p(doc, 2)
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
                    make_table(doc, cleaned, base_size=9.5, line_spacing=1.0)
                    spacer_p(doc, 3)
                in_table = False
                table_rows = []

        if not stripped:
            i += 1
            continue

        # Break at horizontal rule if moving out of cover
        if re.match(r'^---+\s*$', stripped):
            i += 1
            continue

        # Headings
        h_match = re.match(r'^(#{1,4})\s+(.*)$', stripped)
        if h_match:
            lvl = len(h_match.group(1))
            text = h_match.group(2).strip()

            # Detection: Bab 1 starts the real content!
            if text.startswith('1. Latar Belakang'):
                if is_cover:
                    is_cover = False
                    doc.add_page_break()

            if is_cover:
                # Cover page layout
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.line_spacing = 1.15
                if text == "PROPOSAL RINGKAS INOVASI DIGITAL":
                    p.paragraph_format.space_before = Pt(24)
                    p.paragraph_format.space_after = Pt(2)
                    runs(p, text, base_font_size=14, default_bold=True)
                elif "SIFest Digital Innovation" in text:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(28)
                    runs(p, text, base_font_size=12, default_bold=True)
                elif text == "KILASTUGAS":
                    # Insert logo before title
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
                # Content Headings (Bab & Sub-bab)
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.keep_with_next = True
                if lvl == 1 or (lvl == 2 and re.match(r'^\d+\.\s+', text)):
                    # Major Heading Bab 1, Bab 2...
                    p.paragraph_format.space_before = Pt(6)
                    p.paragraph_format.space_after = Pt(1.5)
                    p.paragraph_format.line_spacing = 1.12
                    runs(p, text, base_font_size=11.5, default_bold=True)
                elif lvl == 2 or (lvl == 3 and re.match(r'^\d+\.\d+\s+', text)):
                    # Sub-heading 1.1, 1.2...
                    p.paragraph_format.space_before = Pt(4)
                    p.paragraph_format.space_after = Pt(1.5)
                    p.paragraph_format.line_spacing = 1.12
                    runs(p, text, base_font_size=11, default_bold=True)
                else:
                    # Sub-sub-heading
                    p.paragraph_format.space_before = Pt(3)
                    p.paragraph_format.space_after = Pt(1)
                    p.paragraph_format.line_spacing = 1.12
                    runs(p, text, base_font_size=11, default_bold=True, default_italic=True)
                i += 1
                continue

        # Checklists: - [ ] or - [x]
        chk_match = re.match(r'^(\s*)-\s+\[([ xX])\]\s+(.*)$', stripped)
        if chk_match:
            box = '[√]' if chk_match.group(2) in ['x', 'X'] else '[  ]'
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.line_spacing = 1.12
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.first_line_indent = Inches(-0.3)

            r_box = p.add_run(f"{box}  ")
            r_box.font.name = FONT_NAME
            r_box.font.size = Pt(11)
            runs(p, chk_match.group(3), base_font_size=11)
            i += 1
            continue

        # Lists: * or - or 1.
        li_match = re.match(r'^(\s*)([*-]|\d+\.)\s+(.*)$', stripped)
        if li_match:
            indent_spaces = len(li_match.group(1))
            bullet = li_match.group(2)
            content = li_match.group(3)

            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.line_spacing = 1.12
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1)
            
            base_ind = 0.25 * (1 + (indent_spaces // 2))
            p.paragraph_format.left_indent = Inches(base_ind)
            p.paragraph_format.first_line_indent = Inches(-0.2)

            marker = f"{bullet} " if re.match(r'\d+\.', bullet) else "•  "
            r_mark = p.add_run(marker)
            r_mark.font.name = FONT_NAME
            r_mark.font.size = Pt(11)
            if re.match(r'\d+\.', bullet):
                r_mark.font.bold = True

            runs(p, content, base_font_size=11)
            i += 1
            continue

        # Tables inside markdown lines handled via earlier table block
        # Code block handled via earlier block

        # Regular Paragraph
        p = doc.add_paragraph()
        if is_cover:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.12
            runs(p, stripped, base_font_size=11, default_italic=True)
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.12
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
            make_table(doc, cleaned, base_size=9.5, line_spacing=1.0)
            spacer_p(doc, 3)

    # Save DOCX
    doc.save(DOCX_OUT)
    print(f"Generated DOCX via academic-docx-builder: {DOCX_OUT}")

    # Convert to PDF via Word COM Automation
    print("Exporting PDF via Word COM Automation...")
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    try:
        doc_word = word.Documents.Open(os.path.abspath(DOCX_OUT))
        doc_word.SaveAs(os.path.abspath(PDF_OUT), FileFormat=17) # 17 = wdFormatPDF
        page_count = doc_word.ComputeStatistics(2) # 2 = wdStatisticPages
        doc_word.Close()
        print(f"PDF successfully exported to: {PDF_OUT}")
        print(f"Total Page Count: {page_count} halaman (Cover + {page_count - 1} halaman isi)")
    finally:
        word.Quit()

if __name__ == '__main__':
    build_academic_proposal()
