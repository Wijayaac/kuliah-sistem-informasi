# SITTA — Tugas Praktik 3 (Vue Component & Template)

Pemrograman Berbasis Web (STSI4209) · Universitas Terbuka
**I KD WIJAYA SASHMITHA ADHI C** · NIM **048068753** · Sistem Informasi · UT Daerah Denpasar

Aplikasi SITTA (Sistem Informasi Tiras dan Transaksi Bahan Ajar) versi **Single Page Application** dengan **Vue 2 (CDN)**, memakai **custom component** (`Vue.component`) dan **template terpisah** (`templates/*.html`). Satu halaman, tiga tab: **Stok Bahan Ajar**, **Tracking DO**, dan **Pemesanan (DO Baru)**.

## Cara menjalankan (wajib lewat local server)
Aplikasi memuat `templates/*.html` dan `data/dataBahanAjar.json` dengan `fetch()`, sehingga **tidak bisa dibuka langsung lewat `file://`** (diblokir browser). Pilih salah satu:

1. **npx serve** (butuh Node.js):
   ```bash
   cd tugas3-vue-ut
   npx serve .
   ```
   lalu buka alamat yang muncul, misalnya `http://localhost:3000`.
2. **VS Code Live Server**: buka folder `tugas3-vue-ut` di VS Code, klik kanan `index.html` → **Open with Live Server**.
3. Alternatif: `python3 -m http.server 8080` lalu buka `http://localhost:8080`.

Butuh koneksi internet untuk Vue 2, font Poppins, dan Bootstrap Icons dari CDN.

## Struktur proyek
```
tugas3-vue-ut/
├─ index.html                 ← SPA: navbar tab + 3 section (v-show) + <app-modal ref="modal">
├─ assets/
│  ├─ css/style.css           ← gaya Tugas 2 + tambahan Tugas 3
│  └─ img/logo-sitta.svg      ← favicon
├─ data/dataBahanAjar.json    ← data dummy dari soal
├─ js/
│  ├─ app.js                  ← root Vue instance, filter global, watcher, handler event
│  ├─ services/api.js         ← loadTemplates(), getData(), save(), clear() (fetch + localStorage)
│  └─ components/
│     ├─ stock-table.js       ← <ba-stock-table>  (#tpl-stock)
│     ├─ do-tracking.js       ← <do-tracking>     (#tpl-tracking)
│     ├─ order-form.js        ← <order-form>      (#tpl-order)
│     ├─ status-badge.js      ← <status-badge>    (#tpl-badge)
│     └─ app-modal.js         ← <app-modal>       (#tpl-modal, dengan slot)
├─ templates/
│  ├─ stock-table.html  do-tracking.html  order-form.html  status-badge.html  app-modal.html
└─ README.md
```
Urutan script sesuai soal: `vue@2` → `js/services/api.js` → 5 komponen → `js/app.js`. Alur start: `Api.loadTemplates()` → `Api.getData()` → `new Vue({ el: '#app' })`.

## Fitur
**Stok Bahan Ajar** — tabel kode/judul, kategori, UT-Daerah, lokasi rak, harga (Rp), qty (buah), safety (buah), status. Status Aman (hijau, qty ≥ safety), Menipis (oranye, qty < safety), Kosong (merah, qty = 0); **hover status** menampilkan tooltip `catatanHTML`. Filter UT-Daerah → filter Kategori baru muncul setelahnya (dependent options), checkbox perlu re-order, sort judul/stok/harga naik/turun, reset filter. Filter & sort memakai rantai `computed` (`filteredItems` → `sortedItems`) sehingga tidak dihitung ulang tanpa perlu. **Create** (form + validasi, Enter = simpan), **Update** (modal edit + validasi, Enter = simpan, Esc = batal), **Delete** (popup konfirmasi).

**Tracking DO** — cari berdasarkan Nomor DO atau NIM, **Enter = cari, Esc = reset**; detail DO dengan progress, ringkasan, dan riwayat perjalanan; **tambah progress** (waktu otomatis dari `Date` lokal, keterangan dari input, status bisa diubah).

**Pemesanan** — form DO baru: Nomor DO otomatis, NIM (9 digit), Nama, Ekspedisi, Paket (kode + nama, isi paket tampil di bawahnya), Tanggal Kirim (format “25 Agustus 2025”), Total Harga otomatis dari `paket.harga`, validasi per field, pratinjau langsung. Setelah disimpan otomatis pindah ke tab Tracking dan DO baru terpilih.

Data disimpan ke `localStorage` (watcher `deep`); link **Kembalikan data awal** memuat ulang `dataBahanAjar.json`.

## Pemetaan indikator soal
| No | Indikator | Penerapan |
|---|---|---|
| 1.1 | Struktur folder & komponen | Folder `assets/ data/ js/components js/services templates/`, 5 komponen + template `<template id>` terpisah |
| 1.2 | Binding, directive, array, filter | `v-model`, `v-bind`, `v-on`, `v-text`, `v-html`, `v-for` (array & object), filter `rupiah`, `buah`, `tanggal`, `waktu` |
| 1.3 | Conditional | `v-if / v-else-if / v-else` (status badge, kategori dependent), `v-show` (tab, form, tooltip) |
| 1.4 | Computed & methods | `filteredItems`, `sortedItems`, `ringkasan`, `kategoriOptions`, `nomorDO`, `isiPaket`, `formErrors`; methods simpan/edit/hapus/cari |
| 1.5 | Watchers | `tab` (judul + hash), `state` (deep → localStorage), `filter.upbjj`, `form.kode`, `form.paketKode`, `form.nim`, `highlight`, `hasilCari`, `selected`, `visible` (modal) |
| 1.6 | Form, validasi, event mouse & keyboard | Validasi per field, `@click`, `@mouseenter/@mouseleave` (tooltip), `@keydown.enter`, `@keyup.enter`, `@keyup.esc` |
| 1.7 | Kreativitas | Tab SPA + hash URL, modal global berbasis Promise + slot, toast, pratinjau DO, tooltip, responsif |

## Catatan penyesuaian
- **Vue 2** dipakai karena potongan `index.html` di soal memakai `vue@2` dan `Vue.component`; Vue 2 juga punya fitur **filter** bawaan (`{{ harga | rupiah }}`).
- Path script di soal (`/js/...`) diubah menjadi relatif (`js/...`) agar tetap jalan jika folder tidak di root server.
- Data `tracking` di JSON berisi `DO2025-0001` dua kali; `api.js` membuang duplikat. Nomor DO baru = `DO` + tahun berjalan + `-` + urutan terbesar + 1 (3 digit), misalnya `DO2026-002`.
- Pilihan ekspedisi diambil dari `pengirimanList` (REG/EXP → JNE Regular/JNE Express) — di soal tertulis `upbjjList`, yang isinya daftar UT-Daerah.
