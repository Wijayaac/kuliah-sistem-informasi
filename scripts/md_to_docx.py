"""Convert a simple Markdown report to .docx using only the Python standard library.

Usage: python3 scripts/md_to_docx.py <input.md> [output.docx]

Supported: # / ## / ### headings, paragraphs, "- " bullets, fenced code blocks,
pipe tables, ![alt](image.png|jpg), **bold**, *italic*, `code`, [[red note]], and !include(path)
which inserts a source file as a code block. Missing images become a placeholder.

Style follows the submitted reports: Helvetica Neue 10pt body, Courier New 10pt code.
"""
import re
import struct
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

EMU_PER_PX = 9525
MAX_WIDTH_EMU = int(15.5 / 2.54 * 914400)


def image_size(path: Path):
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])
    if data[:2] == b"\xff\xd8":
        i = 2
        while i < len(data):
            marker, length = data[i + 1], struct.unpack(">H", data[i + 2:i + 4])[0]
            if marker in (0xC0, 0xC1, 0xC2):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return w, h
            i += 2 + length
    raise ValueError(f"Unsupported image: {path}")


def run(text, bold=False, mono=False, size=None, color=None, italic=False):
    props = ""
    if mono:
        props += '<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New" w:cs="Courier New"/>'
    if bold:
        props += "<w:b/>"
    if italic:
        props += "<w:i/>"
    if color:
        props += f'<w:color w:val="{color}"/>'
    if size:
        props += f'<w:sz w:val="{size}"/>'
    rpr = f"<w:rPr>{props}</w:rPr>" if props else ""
    return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def inline(text, bold=False):
    out = []
    for part in re.split(r"(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[\[[^\]]+\]\])", text):
        if not part:
            continue
        if part.startswith("[["):
            out.append(run(part[2:-2], bold=bold, color="EE0000"))
        elif part.startswith("**"):
            out.append(run(part[2:-2], bold=True))
        elif part.startswith("*") and len(part) > 2:
            out.append(run(part[1:-1], bold=bold, italic=True))
        elif part.startswith("`"):
            out.append(run(part[1:-1], bold=bold, mono=True))
        else:
            out.append(run(part, bold=bold))
    return "".join(out)


def para(runs, align=None, shade=False, spacing_after=120):
    ppr = f'<w:spacing w:after="{spacing_after}"/>'
    if align:
        ppr += f'<w:jc w:val="{align}"/>'
    if shade:
        ppr += '<w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>'
    return f"<w:p><w:pPr>{ppr}</w:pPr>{runs}</w:p>"


def table(rows):
    cell_border = "".join(
        f'<w:{side} w:val="single" w:sz="4" w:color="000000"/>'
        for side in ("top", "left", "bottom", "right", "insideH", "insideV")
    )
    xml = f'<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders>{cell_border}</w:tblBorders></w:tblPr>'
    for r, cells in enumerate(rows):
        xml += "<w:tr>"
        for c in cells:
            xml += f"<w:tc><w:tcPr/>{para(inline(c, bold=r == 0), spacing_after=0)}</w:tc>"
        xml += "</w:tr>"
    return xml + "</w:tbl>" + para("")


def drawing(rid, idx, w_px, h_px, name):
    cx, cy = w_px * EMU_PER_PX, h_px * EMU_PER_PX
    if cx > MAX_WIDTH_EMU:
        cy = int(cy * MAX_WIDTH_EMU / cx)
        cx = MAX_WIDTH_EMU
    return (
        f'<w:r><w:drawing><wp:inline><wp:extent cx="{cx}" cy="{cy}"/>'
        f'<wp:docPr id="{idx}" name="{escape(name)}"/>'
        '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        f'<pic:nvPicPr><pic:cNvPr id="{idx}" name="{escape(name)}"/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
        "</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>"
    )


def render(lines, base_dir: Path, heading=None):
    """Return (body xml list, media list of (target, path, rid)).

    heading(level, text) may return custom xml for a heading, or None for the default.
    """
    body, media = [], []
    buf, i = [], 0

    def flush():
        if buf:
            body.append(para(inline(" ".join(buf))))
            buf.clear()

    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if s.startswith("```"):
            flush()
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                body.append(para(run(lines[i], mono=True, size=20), shade=True, spacing_after=0))
                i += 1
            body.append(para(""))
        elif m := re.fullmatch(r"!include\((.+?)\)", s):
            flush()
            for code_line in (base_dir / m.group(1)).read_text(encoding="utf-8").splitlines():
                body.append(para(run(code_line, mono=True, size=20), shade=True, spacing_after=0))
            body.append(para(""))
        elif s.startswith("|"):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-+:?", c) for c in cells):
                    rows.append(cells)
                i += 1
            body.append(table(rows))
            continue
        elif m := re.fullmatch(r"!\[(.*?)\]\((.+?)\)", s):
            flush()
            alt, src = m.groups()
            img = (base_dir / src).resolve()
            if img.exists():
                n = len(media) + 1
                target = f"media/rimage{n}{img.suffix.lower()}"
                rid = f"rIdImg{n}"
                media.append((target, img, rid))
                w, h = image_size(img)
                body.append(para(drawing(rid, 1000 + n, w, h, img.name), align="center"))
            else:
                body.append(para(run(f"[Gambar belum ada: {alt} ({src})]", bold=True, color="EE0000"), align="center"))
        elif s.startswith("#"):
            flush()
            level = len(s) - len(s.lstrip("#"))
            text = s[level:].strip()
            custom = heading(level, text) if heading else None
            body.append(custom or para(run(text, bold=True), align="center" if level == 1 else None))
        elif s.startswith("- "):
            flush()
            body.append(para(run("• ") + inline(s[2:])))
        elif s in ("", "---"):
            flush()
        else:
            buf.append(s)
        i += 1
    flush()
    return body, media


def image_rels(media):
    return "".join(
        f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="{target}"/>'
        for target, _, rid in media
    )


def convert(md_path: Path, out_path: Path):
    body, media = render(md_path.read_text(encoding="utf-8").splitlines(), md_path.parent)

    ns = (
        'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"'
    )
    sect = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>'
    document = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document {ns}><w:body>{"".join(body)}{sect}</w:body></w:document>'
    styles = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Helvetica Neue" w:hAnsi="Helvetica Neue" w:cs="Helvetica Neue"/>'
        '<w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:rPrDefault></w:docDefaults></w:styles>'
    )
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Default Extension="png" ContentType="image/png"/>'
        '<Default Extension="jpg" ContentType="image/jpeg"/>'
        '<Default Extension="jpeg" ContentType="image/jpeg"/>'
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
        "</Types>"
    )
    root_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
        "</Relationships>"
    )
    doc_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        f'{image_rels(media)}</Relationships>'
    )

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("word/document.xml", document)
        z.writestr("word/styles.xml", styles)
        z.writestr("word/_rels/document.xml.rels", doc_rels)
        for target, img, _ in media:
            z.write(img, f"word/{target}")
    print(f"Wrote {out_path} ({len(media)} image(s))")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_suffix(".docx")
    convert(src, dst)
