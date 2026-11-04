# Transkrip Video Tugas 3 Pemrograman Berbasis Web (STSI4209)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi · UT Daerah Denpasar
**Topik:** SPA SITTA dengan Vue 2 Component & Template, folder `tugas3-vue-ut/`
**Perkiraan durasi:** ±7 menit 30 detik (batas maksimal 15 menit) · **Jumlah kata yang diucapkan:** ±600 kata (±5 menit bicara dengan tempo ±120 kata/menit, ditambah ±2,5 menit jeda demo di layar)

## Checklist sebelum merekam

- [ ] Internet menyala (Vue 2, font, dan Bootstrap Icons dimuat dari CDN).
- [ ] Jalankan server: di terminal VS Code ketik `npx serve .` di folder `tugas3-vue-ut/` (atau klik kanan `index.html` → **Open with Live Server**). Jangan buka lewat double-click (`file://`).
- [ ] VS Code: font diperbesar, buka tab `index.html`, `js/app.js`, `js/services/api.js`, `js/components/stock-table.js`, `templates/stock-table.html`, `templates/status-badge.html`, `js/components/order-form.js`.
- [ ] Di aplikasi, scroll ke bawah dan klik **Kembalikan data awal** → OK, supaya nomor DO otomatis = `DO2026-002`.
- [ ] Siapkan isian demo: kode `MKDU4111`, judul `Pendidikan Kewarganegaraan`, MK Wajib, Jakarta, rak `R2-B1`, harga `50000`, qty `3`, safety `5`, catatan `<em>Edisi baru</em>`. DO baru: NIM `048068753`, nama `I Kadek Wijaya`.
- [ ] Kamera dan mikrofon dicek, notifikasi dimatikan.

---

## a. Perkenalan identitas (00:00 – 00:30)

[AKSI LAYAR: Kamera wajah tampil. Browser menampilkan tab **Stok** aplikasi SITTA.]

> Halo, assalamualaikum, om swastiastu, salam sejahtera. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, mahasiswa Sistem Informasi Universitas Terbuka Daerah Denpasar. Di video ini saya menjelaskan Tugas Praktik 3 Pemrograman Berbasis Web, STSI4209. Aplikasinya adalah SITTA versi single page application dengan Vue 2, memakai komponen dan template terpisah. Saya jelaskan langkah demi langkah, hanya bagian kode yang penting saja.

## b. Langkah-langkah praktik

### b.1 Struktur folder dan cara menjalankan (00:30 – 01:40)

[AKSI LAYAR: VS Code, tunjuk Explorer folder `tugas3-vue-ut/`: `assets`, `data`, `js/components`, `js/services`, `templates`. Tunjuk terminal yang menjalankan `npx serve .`.]

> Pertama, struktur folder saya ikuti dari soal. Ada folder assets untuk CSS, data untuk file JSON, js/services untuk api.js, js/components untuk lima komponen, dan templates untuk file template HTML-nya. Satu komponen, satu file JS, satu file template.
>
> Karena template dan data diambil dengan fetch, aplikasi ini harus dijalankan lewat local server, misalnya npx serve atau Live Server. Kalau dibuka langsung dengan double-click, browser akan memblokir fetch.

[AKSI LAYAR: Buka `index.html` baris 49–73, lalu baris 87–94.]

> Di index.html cuma ada kerangka: menu tab, tiga section yang pakai v-show, lalu tag komponen ba-stock-table, do-tracking, dan order-form. Data dikirim lewat props, misalnya titik dua items sama dengan state.stok. Di bawahnya urutan script sesuai soal: Vue 2, api.js, lima komponen, lalu app.js.

### b.2 Alur start: api.js dan app.js (01:40 – 02:40)

[AKSI LAYAR: Buka `js/services/api.js` baris 33 dan 65. Lalu `js/app.js` baris 15–40 dan baris 176.]

> Di api.js ada dua fungsi penting. loadTemplates mengambil semua file di folder templates, lalu menempelkannya ke body. getData mengambil dataBahanAjar.json, atau dari localStorage kalau sudah pernah disimpan.
>
> Di app.js, urutannya: loadTemplates dulu, lalu getData, baru new Vue. Kenapa? Karena komponen butuh templatenya sudah ada sebelum Vue dibuat. Di atas juga ada filter global: rupiah, buah, tanggal, dan waktu. Jadi di template cukup tulis harga, garis tegak, rupiah, dan hasilnya Rp 65.000.

### b.3 Tab Stok: tabel, filter, sort, status (02:40 – 04:20)

[AKSI LAYAR: Browser tab Stok. Arahkan mouse ke badge status sehingga tooltip catatan muncul. Pilih UT-Daerah Jakarta, filter Kategori muncul. Centang perlu re-order, ganti urutan ke Harga, klik tombol arah, lalu Reset.]

> Sekarang tab Stok. Status punya tiga warna: hijau Aman, oranye Menipis, merah Kosong. Kalau mouse saya arahkan ke status, muncul tooltip catatan. Filter kategori baru muncul setelah UT-Daerah dipilih, ini dependent options. Ada juga checkbox re-order, sort, dan reset.

[AKSI LAYAR: VS Code `js/components/stock-table.js` baris 36–60, baris 88–95. Lalu `templates/status-badge.html`.]

> Kodenya: filteredItems menyaring data, lalu sortedItems mengurutkan hasil filter itu. Keduanya computed, jadi hasilnya di-cache dan hanya dihitung ulang kalau data atau filternya berubah. Lalu watcher filter.upbjj mengosongkan kategori setiap UT-Daerah diganti, supaya kategori lama tidak nyangkut.
>
> Status dibuat di komponen status-badge dengan v-if, v-else-if, dan v-else. Tooltip-nya pakai v-show, dan hover-nya dari event mouseenter dan mouseleave.

### b.4 Create, Update, Delete (04:20 – 05:30)

[AKSI LAYAR: Klik **Tambah Bahan Ajar**, tekan Enter dengan form kosong → error merah muncul. Isi data demo, tekan Enter → toast dan baris baru muncul. Klik ikon edit, ubah qty, tekan Enter. Klik ikon hapus → popup konfirmasi, klik Batal.]

> Create: kalau saya tekan Enter tapi form kosong, setiap field menampilkan pesan error. Setelah diisi benar, Enter langsung menyimpan. Update: tombol edit membuka modal, saya ubah stoknya, Enter, tersimpan. Delete: muncul popup konfirmasi dulu.

[AKSI LAYAR: VS Code `stock-table.js` baris 100 (validasi), lalu `js/app.js` baris 119, lalu `templates/app-modal.html` baris 26–28.]

> Validasinya ada di method validasi, misalnya kode harus empat huruf dan empat angka. Komponen tidak mengubah data sendiri, tapi mengirim event dengan dollar emit ke root. Root yang menyimpan. Popup hapus memanggil this.dollar refs.modal.confirm, yang mengembalikan Promise. Komponen app-modal ini juga punya slot, jadi isi modal edit bisa diganti-ganti.

### b.5 Tab Tracking DO (05:30 – 06:15)

[AKSI LAYAR: Klik tab **Tracking DO**. Ketik `DO2025` lalu Enter, kemudian tekan Esc. Klik DO2025-0001, isi keterangan "Diteruskan ke Hub Denpasar", pilih status Dalam Perjalanan, klik Simpan Progress. Tunjuk `templates/do-tracking.html` baris 15.]

> Di tab Tracking, saya bisa cari berdasarkan nomor DO atau NIM. Enter untuk mencari, Esc untuk reset. Ini cukup dengan at keyup titik enter dan at keyup titik esc. Lalu saya tambah progress. Waktunya otomatis diambil dari jam lokal pakai new Date, keterangannya dari input saya.

### b.6 Tab Pemesanan (06:15 – 07:05)

[AKSI LAYAR: Klik tab **Pemesanan**. Tunjuk Nomor DO `DO2026-002`. Isi NIM, nama, pilih ekspedisi, pilih paket → isi paket dan total muncul. Klik Simpan DO → otomatis pindah ke Tracking. Lalu VS Code `order-form.js` baris 26 dan 71–80.]

> Terakhir tab Pemesanan. Nomor DO dibuat otomatis oleh computed nomorDO: ambil urutan terbesar, tambah satu, pakai tahun sekarang. Saat paket dipilih, isinya tampil di bawah, dan watcher form.paketKode langsung mengisi total harga. Watcher form.nim memberi info sisa digit NIM. Tanggal tampil dengan format dua puluh lima Agustus dua ribu dua puluh lima. Setelah disimpan, aplikasi pindah ke tab Tracking dan DO baru langsung terpilih.

## c. Hasil praktik (07:05 – 07:25)

[AKSI LAYAR: Tampilkan tab Tracking dengan DO2026-002, lalu refresh halaman untuk menunjukkan data tetap tersimpan.]

> Hasilnya, ketiga fitur berjalan di satu halaman tanpa error di console. Data juga tetap ada setelah refresh, karena watcher deep pada state menyimpannya ke localStorage.

## d. Penutup (07:25 – 07:40)

[AKSI LAYAR: Kamera wajah tampil.]

> Sekian penjelasan Tugas Praktik 3 dari saya. Terima kasih kepada tutor yang sudah membimbing. Mohon maaf bila ada kekurangan. Wassalamualaikum, om shanti shanti shanti om.
