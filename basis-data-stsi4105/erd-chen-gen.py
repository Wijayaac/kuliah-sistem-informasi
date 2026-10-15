"""Generate ERD konseptual notasi Chen (gaya BMP UT) > erd-chen.drawio + erd-chen.svg."""
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).parent
W, H = 1700, 1060

ENT = {  # nama: (cx, cy)
    "Petugas_Administrasi": (250, 220),
    "Pasien": (850, 220),
    "Dokter": (850, 700),
    "Resep": (1400, 460),
    "Obat": (1400, 900),
}
REL = {
    "Mendaftar": (550, 220),
    "Memeriksa": (850, 460),
    "Menerima": (1125, 340),
    "Membuat": (1125, 580),
    "Berisi": (1400, 680),
}
# (pemilik, nama, cx, cy, pk)
ATTR = [
    ("Petugas_Administrasi", "id_petugas", 100, 120, True),
    ("Petugas_Administrasi", "nama_petugas", 260, 90, False),
    ("Petugas_Administrasi", "no_telp", 100, 320, False),
    ("Mendaftar", "tgl_daftar", 470, 100, False),
    ("Mendaftar", "keluhan", 605, 100, False),
    ("Pasien", "id_pasien", 740, 110, True),
    ("Pasien", "nama_pasien", 850, 65, False),
    ("Pasien", "tgl_lahir", 985, 100, False),
    ("Pasien", "jenis_kelamin", 1095, 160, False),
    ("Pasien", "alamat", 1105, 230, False),
    ("Pasien", "no_telp", 710, 330, False),
    ("Memeriksa", "tgl_periksa", 660, 420, False),
    ("Memeriksa", "diagnosa", 660, 500, False),
    ("Dokter", "id_dokter", 700, 810, True),
    ("Dokter", "nama_dokter", 850, 840, False),
    ("Dokter", "spesialisasi", 1000, 810, False),
    ("Dokter", "no_telp", 680, 690, False),
    ("Resep", "id_resep", 1570, 400, True),
    ("Resep", "tgl_resep", 1570, 500, False),
    ("Berisi", "jumlah", 1240, 700, False),
    ("Berisi", "dosis", 1560, 700, False),
    ("Obat", "id_obat", 1240, 960, True),
    ("Obat", "nama_obat", 1400, 1000, False),
    ("Obat", "jenis_obat", 1560, 960, False),
    ("Obat", "harga", 1570, 860, False),
]
# (entitas, relasi, kardinalitas)
LINKS = [
    ("Petugas_Administrasi", "Mendaftar", "1"), ("Pasien", "Mendaftar", "N"),
    ("Dokter", "Memeriksa", "M"), ("Pasien", "Memeriksa", "N"),
    ("Pasien", "Menerima", "1"), ("Resep", "Menerima", "N"),
    ("Dokter", "Membuat", "1"), ("Resep", "Membuat", "N"),
    ("Resep", "Berisi", "M"), ("Obat", "Berisi", "N"),
]
LEGEND = [
    ("Relasi", "Entitas", "Derajat", "Kardinalitas"),
    ("Mendaftar", "Petugas_Administrasi - Pasien", "Biner", "1 : N"),
    ("Memeriksa", "Dokter - Pasien", "Biner", "M : N"),
    ("Membuat", "Dokter - Resep", "Biner", "1 : N"),
    ("Menerima", "Pasien - Resep", "Biner", "1 : N"),
    ("Berisi", "Resep - Obat", "Biner", "M : N"),
]
LEG_X, LEG_Y, LEG_COLS, LEG_ROW = 50, 870, (110, 230, 70, 100), 26
EW, EH, RW, RH, AW, AH = 170, 50, 130, 80, 124, 44
TITLE = "ERD Konseptual Sistem Rumah Sakit (Notasi Chen)"


def pos(name):
    return ENT.get(name) or REL[name]


def svg():
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
         f'font-family="Arial, Helvetica, sans-serif" font-size="15">',
         f'<rect width="{W}" height="{H}" fill="#fff"/>',
         f'<text x="50" y="40" font-size="20" font-weight="bold">{TITLE}</text>',
         '<g stroke="#000" stroke-width="1.5">']
    for owner, _, x, y, _ in ATTR:
        ox, oy = pos(owner)
        o.append(f'<line x1="{x}" y1="{y}" x2="{ox}" y2="{oy}"/>')
    for e, r, _ in LINKS:
        (x1, y1), (x2, y2) = ENT[e], REL[r]
        o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    o.append('</g><g stroke="#000" stroke-width="1.5" fill="#fff">')
    for _, _, x, y, _ in ATTR:
        o.append(f'<ellipse cx="{x}" cy="{y}" rx="{AW/2}" ry="{AH/2}"/>')
    for x, y in REL.values():
        o.append(f'<polygon points="{x},{y-RH/2} {x+RW/2},{y} {x},{y+RH/2} {x-RW/2},{y}"/>')
    for x, y in ENT.values():
        o.append(f'<rect x="{x-EW/2}" y="{y-EH/2}" width="{EW}" height="{EH}"/>')
    o.append('</g><g text-anchor="middle" dominant-baseline="central">')
    for _, n, x, y, pk in ATTR:
        deco = ' text-decoration="underline" font-weight="bold"' if pk else ""
        o.append(f'<text x="{x}" y="{y}"{deco}>{n}</text>')
    for n, (x, y) in REL.items():
        o.append(f'<text x="{x}" y="{y}" font-weight="bold">{n}</text>')
    for n, (x, y) in ENT.items():
        o.append(f'<text x="{x}" y="{y}" font-weight="bold">{n}</text>')
    for e, r, c in LINKS:
        (x1, y1), (x2, y2) = ENT[e], REL[r]
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        o.append(f'<rect x="{mx-12}" y="{my-13}" width="24" height="26" fill="#fff"/>')
        o.append(f'<text x="{mx}" y="{my}" font-size="18" font-weight="bold">{c}</text>')
    o.append('</g>')
    tw = sum(LEG_COLS)
    o.append(f'<text x="{LEG_X}" y="{LEG_Y-12}" font-weight="bold">Keterangan derajat relasi dan kardinalitas:</text>')
    for i, row in enumerate(LEGEND):
        y = LEG_Y + i * LEG_ROW
        fill = "#e6e6e6" if i == 0 else "#fff"
        o.append(f'<rect x="{LEG_X}" y="{y}" width="{tw*1.5}" height="{LEG_ROW}" fill="{fill}" stroke="#000"/>')
        x = LEG_X
        for w, cell in zip(LEG_COLS, row):
            bold = ' font-weight="bold"' if i == 0 else ""
            o.append(f'<text x="{x+6}" y="{y+18}" font-size="13"{bold}>{escape(cell)}</text>')
            x += w * 1.5
    o.append('</svg>')
    return "\n".join(o)


def drawio():
    cells, ids = [], {}

    def v(id_, val, style, x, y, w, h):
        cells.append(f'<mxCell id="{id_}" value="{escape(val, {chr(34): "&quot;"})}" style="{style}" '
                     f'vertex="1" parent="1"><mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" '
                     f'as="geometry"/></mxCell>')

    def e(id_, val, s, t, style):
        cells.append(f'<mxCell id="{id_}" value="{val}" style="{style}" edge="1" parent="1" '
                     f'source="{s}" target="{t}"><mxGeometry relative="1" as="geometry"/></mxCell>')

    base = "html=1;whiteSpace=wrap;strokeColor=#000000;fillColor=#FFFFFF;fontColor=#000000;fontSize=14;"
    v("title", TITLE, "text;html=1;fontSize=20;fontStyle=1;align=left;", 50, 20, 700, 30)
    for n, (x, y) in ENT.items():
        ids[n] = f"ent_{n}"
        v(ids[n], n, base + "rounded=0;fontStyle=1;", x - EW / 2, y - EH / 2, EW, EH)
    for n, (x, y) in REL.items():
        ids[n] = f"rel_{n}"
        v(ids[n], n, base + "rhombus;fontStyle=1;", x - RW / 2, y - RH / 2, RW, RH)
    line = "endArrow=none;html=1;rounded=0;strokeColor=#000000;"
    for i, (owner, n, x, y, pk) in enumerate(ATTR):
        v(f"att{i}", n, base + "ellipse;" + ("fontStyle=5;" if pk else ""), x - AW / 2, y - AH / 2, AW, AH)
        e(f"ea{i}", "", f"att{i}", ids[owner], line)
    for i, (en, r, c) in enumerate(LINKS):
        e(f"el{i}", c, ids[en], ids[r],
          line + "fontSize=18;fontStyle=1;fontColor=#000000;labelBackgroundColor=#FFFFFF;")
    rows = "".join(
        "<tr>" + "".join(f"<{'th' if i == 0 else 'td'} style='border:1px solid #000;padding:3px 6px;"
                         f"{'background:#e6e6e6;' if i == 0 else ''}'>{escape(c)}</{'th' if i == 0 else 'td'}>"
                         for c in r) + "</tr>"
        for i, r in enumerate(LEGEND))
    html = ("<b>Keterangan derajat relasi dan kardinalitas:</b><br>"
            f"<table style='border-collapse:collapse;font-size:13px;text-align:left'>{rows}</table>")
    v("legend", html, "text;html=1;align=left;verticalAlign=top;whiteSpace=wrap;",
      LEG_X, LEG_Y - 30, sum(LEG_COLS) * 1.5, 200)
    return ('<mxfile host="app.diagrams.net"><diagram name="ERD Chen" id="erd-chen">'
            f'<mxGraphModel dx="{W}" dy="{H}" grid="1" gridSize="10" page="1" pageWidth="{W}" '
            f'pageHeight="{H}" background="#FFFFFF"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
            + "".join(cells) + "</root></mxGraphModel></diagram></mxfile>")


(OUT / "erd-chen.svg").write_text(svg(), encoding="utf-8")
(OUT / "erd-chen.drawio").write_text(drawio(), encoding="utf-8")

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if Path(CHROME).exists():
    import subprocess
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=2", f"--window-size={W},{H}",
                    f"--screenshot={OUT.resolve() / 'erd-chen.png'}",
                    (OUT.resolve() / "erd-chen.svg").as_uri()], check=True, capture_output=True)
print("ok")
