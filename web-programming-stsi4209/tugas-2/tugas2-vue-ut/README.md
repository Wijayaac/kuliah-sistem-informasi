# SITTA — Tugas Praktik 2 (Vue.js 3)

Pemrograman Berbasis Web (STSI4209) · Universitas Terbuka
**I KD WIJAYA SASHMITHA ADHI C** · NIM **048068753**

Aplikasi sederhana pemesanan & distribusi bahan ajar (SITTA) yang di-upgrade dari Tugas Praktik 1 (vanilla JS) ke **Vue 3 (CDN, Options API)**, tanpa build step dan tanpa komponen/template component.

## Cara menjalankan
Cukup klik dua kali `index.html` (dibuka lewat `file://`). Butuh koneksi internet untuk memuat Vue 3, font Poppins, dan Bootstrap Icons dari CDN.

## Struktur proyek
```
tugas2-vue-ut/
├─ index.html            ← beranda + menu navigasi ke stok.html & tracking.html
├─ stok.html             ← Halaman 1: Stok Bahan Ajar
├─ tracking.html         ← Halaman 2: Tracking Delivery Order (DO)
├─ css/
│  └─ style.css          ← gaya Tugas 1 + tambahan Tugas 2
├─ js/
│  ├─ dataBahanAjar.js   ← data dummy dari soal (dimuat lebih dulu)
│  ├─ stok-app.js        ← logika Vue untuk stok.html
│  └─ tracking-app.js    ← logika Vue untuk tracking.html
├─ video-script.md       ← naskah video penjelasan (≤ 15 menit)
└─ README.md
```
Urutan script di setiap halaman: `vue.global.js` → `js/dataBahanAjar.js` → `js/<halaman>-app.js`.

## Fitur
**Stok Bahan Ajar** — tabel kode/judul, kategori, UT-Daerah, lokasi rak, harga, qty, safety, status (✅ Aman / ⚠️ Menipis / ⛔ Kosong), catatan (`v-html`); edit stok via modal (+/−, peringatan langsung); filter UT-Daerah → filter Kategori muncul setelahnya (dependent options); checkbox "perlu re-order"; sort judul/qty/harga naik/turun; reset filter; kartu ringkasan yang bisa diklik; form tambah bahan ajar dengan validasi per field. Filter & sort memakai `computed` (di-cache).

**Tracking DO** — daftar & pencarian DO (nomor DO/NIM/nama), detail dengan progress & timeline perjalanan; form DO baru: nomor DO otomatis `DO<tahun>-<urut 3 digit>`, NIM (9 digit angka), Nama, Ekspedisi (JNE Regular/JNE Express dari `pengirimanList`), Paket (kode + nama, isi paket tampil di bawah select), Tanggal Kirim (default hari ini, bisa diubah), Total Harga otomatis dari `paket.harga`.

Perubahan data (stok & DO baru) disimpan di `localStorage`; tombol **Kembalikan data awal** mengembalikan data dummy.

## Catatan penyesuaian
- File `dataBahanAjar.js` dari soal ditulis gaya Vue 2 (`new Vue({ el, data })`) yang tidak berjalan di Vue 3. Isinya tidak diubah, hanya dibungkus sebagai konstanta global `const dataBahanAjar = { ... }` agar bisa dipakai kedua halaman.
- Data awal memakai nomor `DO2025-0001`; nomor berikutnya melanjutkan nomor urut terbesar (+1) dengan tahun berjalan dan 3 digit, misalnya `DO2026-002`.
