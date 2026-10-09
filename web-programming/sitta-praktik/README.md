# SITTA Praktik Tugas Praktik 1 STSI4209

Aplikasi front-end pemesanan bahan ajar UT (HTML + CSS + JavaScript DOM, tanpa framework). Data dummy dari `js/data.js`.

## Cara menjalankan

Buka `index.html` langsung di browser, atau pakai server lokal:

```bash
cd web-programming/sitta-praktik
npx serve .
```

Akun demo: `rina@ut.ac.id` / `rina123`, `admin@ut.ac.id` / `admin123` (lihat `dataPengguna`).
Nomor DO contoh: `2023001234`, `2023005678`.

## Struktur folder

```text
sitta-praktik/
├── index.html        halaman login
├── dashboard.html    menu utama + greeting
├── tracking.html     tracking Delivery Order
├── stok.html         informasi stok bahan ajar
├── css/style.css     stylesheet eksternal
├── js/data.js        data dummy (dataPengguna, dataBahanAjar, dataTracking)
├── js/script.js      logika DOM semua halaman
└── assets/img/       cover bahan ajar
```

## Pemetaan ke kriteria penilaian

| Kriteria | Implementasi |
| -------- | ------------ |
| 1.1 HTML semantik | `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `dl`, `time`, `table` + `thead/th scope`, atribut `aria-*`, `lang="id"` |
| 1.2 CSS | **External** `css/style.css` (semua halaman) · **Internal** `<style>` di `tracking.html` (timeline, progress bar) · **Inline** `style=""` di beberapa elemen (subtitle brand, judul menu, dll.) · CSS variables, flex/grid, animasi, media query |
| 1.3 JS DOM | Render tabel stok dari `dataBahanAjar`, tambah baris baru, pencarian live, render hasil tracking (progress bar + timeline), greeting & jam real-time, statistik dashboard, dropdown & hamburger menu |
| 1.4 Validasi & alert | Validasi email/password, form daftar, lupa password, nomor DO, form tambah stok (format kode, duplikat, angka). Modal alert "email/password yang anda masukkan salah", toast sukses/gagal, `confirm()` saat keluar |
| 1.5 Modularitas | Pemisahan HTML / CSS / JS / data / assets sesuai struktur soal; `script.js` dipecah per fungsi & per halaman (router `data-page`) |
| 1.6 Kreativitas | Tema navy–kuning UT, ikon Bootstrap Icons, toast notification, stepper status pengiriman, badge stok menipis, responsive mobile, tombol contoh DO |

## Perbaikan data.js

- `dataTracking["2023005678"].nomorDO` sebelumnya `"2023001234"` (dobel) > `"2023005678"`, status disesuaikan jadi `"Selesai"` karena log terakhir "Selesai Antar".
- Waktu log ke-3 DO `2023001234` sebelumnya sama dengan log pertama (10:12:20) > `16:45:10` supaya urut.
- Cover PAUD: file di zip `.jpeg`, bukan `.jpg`.
- Path cover `img/...` > `assets/img/...` sesuai struktur folder.

## Kerangka video (maks. 15 menit)

1. Perkenalan: nama, NIM, UPBJJ, mata kuliah STSI4209 Tugas Praktik 1. (±1 menit)
2. Analisis kebutuhan: 4 halaman dari soal, data dari `data.js`, alasan struktur folder. (±2 menit)
3. Tour kode:
   - HTML semantik (contoh satu halaman). (±2 menit)
   - CSS: tunjukkan external, internal (`tracking.html`), inline; responsive. (±2 menit)
   - JS: validasi login, render tabel + tambah stok, tracking + progress, greeting. (±4 menit)
4. Demo aplikasi: login salah > modal, lupa password & daftar, login benar > dashboard (greeting), dropdown Laporan, tracking dua DO + DO salah, stok: cari, tambah valid & tidak valid, tampilan mobile. (±3 menit)
5. Penutup: kesimpulan + kendala + terima kasih. (±1 menit)
