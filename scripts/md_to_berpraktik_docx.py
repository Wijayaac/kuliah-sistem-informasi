"""Render a Markdown report into the official UT "Laporan Tugas Berpraktik" template.

Usage: python3 scripts/md_to_berpraktik_docx.py <input.md> <output.docx>

The Markdown starts with front matter, then sections:

    ---
    tugas: 1
    matkul: ANALISIS DAN VISUALISASI DATA
    kode: STSI4204
    ---
    ## SOAL                 -> lettered section heading (A., B., ...) on a new page
    ### Soal 1              -> bold sub heading
    # DAFTAR PUSTAKA        -> centered heading on a new page

Body syntax is the same as md_to_docx.py. [[text]] renders as red "to fill" notes.
Cover page and UT logo are taken from scripts/template-laporan-berpraktik.docx.
"""
import re
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

sys.path.insert(0, str(Path(__file__).parent))
from md_to_docx import image_rels, render  # noqa: E402

TEMPLATE = Path(__file__).parent / "template-laporan-berpraktik.docx"
NAMA = "I KD WIJAYA SASHMITHA ADHI C"
NIM = "048068753"

TNR = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman" w:eastAsia="Times New Roman"/>'
PAGE_BREAK = '<w:r><w:br w:type="page"/></w:r>'


def cover_run(text, tabs=0):
    tab = "<w:tab/>" * tabs
    return f'<w:r><w:rPr><w:b/><w:sz w:val="30"/></w:rPr><w:t xml:space="preserve">{escape(text)}</w:t>{tab}</w:r>'


def cover_line(text="", center=True, extra=""):
    ppr = '<w:jc w:val="center"/>' if center else '<w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:ind w:left="1418"/>'
    return f"<w:p><w:pPr>{ppr}</w:pPr>{cover_run(text) if text else ''}{extra}</w:p>"


def identity(label, tabs, value):
    return cover_line(center=False, extra=cover_run(label, tabs) + cover_run(f": {value}"))


def cover(meta, logo):
    return "".join([
        cover_line(f"LAPORAN TUGAS {meta['tugas']} TUTON"),
        cover_line(meta["matkul"].upper()),
        cover_line(f"({meta['kode']})"),
        cover_line(),
        f'<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r>{logo}</w:r></w:p>',
        cover_line(),
        cover_line("DISUSUN OLEH:"),
        identity("NAMA", 2, NAMA),
        identity("NIM", 3, NIM),
        identity("PRODI", 2, "SISTEM INFORMASI"),
        identity("FAKULTAS", 1, "SAINS DAN TEKNOLOGI"),
        identity("UT - DAERAH", 1, "DENPASAR"),
        cover_line(),
        cover_line("UNIVERSITAS TERBUKA"),
        cover_line(meta.get("tahun", "2026")),
    ])


def heading(level, text):
    bold = f'<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">{escape(text)}</w:t></w:r>'
    if level == 1:
        return f'<w:p><w:pPr><w:jc w:val="center"/></w:pPr>{PAGE_BREAK}{bold}</w:p>'
    if level == 2:
        return (
            '<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>'
            f'<w:ind w:left="360" w:hanging="360"/><w:rPr><w:b/></w:rPr></w:pPr>{PAGE_BREAK}{bold}</w:p>'
        )
    return None


def convert(md_path: Path, out_path: Path):
    text = md_path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        sys.exit("Front matter (tugas, matkul, kode) wajib ada di awal file.")
    meta = dict(line.split(":", 1) for line in m.group(1).splitlines() if ":" in line)
    meta = {k.strip(): v.strip() for k, v in meta.items()}

    body, media = render(text[m.end():].splitlines(), md_path.parent, heading=heading)

    with zipfile.ZipFile(TEMPLATE) as tpl:
        parts = {name: tpl.read(name) for name in tpl.namelist()}

    doc = parts["word/document.xml"].decode()
    logo = re.search(r"<w:drawing>.*?</w:drawing>", doc, re.S).group(0)
    head = doc[: doc.index("<w:body>") + len("<w:body>")]
    sect = (
        '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
        '<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>'
        '<w:pgNumType w:start="1"/></w:sectPr>'
    )
    parts["word/document.xml"] = (head + cover(meta, logo) + "".join(body) + sect + "</w:body></w:document>").encode()

    styles = parts["word/styles.xml"].decode()
    parts["word/styles.xml"] = re.sub(
        r'(<w:rPrDefault><w:rPr>)<w:rFonts[^>]*/>', r"\1" + TNR, styles, count=1
    ).encode()

    rels = parts["word/_rels/document.xml.rels"].decode()
    parts["word/_rels/document.xml.rels"] = rels.replace("</Relationships>", image_rels(media) + "</Relationships>").encode()

    types = parts["[Content_Types].xml"].decode()
    for ext in ("jpg", "jpeg"):
        if f'Extension="{ext}"' not in types:
            types = types.replace("<Default ", f'<Default ContentType="image/jpeg" Extension="{ext}"/><Default ', 1)
    parts["[Content_Types].xml"] = types.encode()

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in parts.items():
            z.writestr(name, data)
        for target, img, _ in media:
            z.write(img, f"word/{target}")
    print(f"Wrote {out_path} ({len(media)} image(s))")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    convert(Path(sys.argv[1]), Path(sys.argv[2]))
