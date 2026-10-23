# Transkrip Video Tugas 2 Pemrograman Berbasis Web (STSI4209)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi
**Topik:** Aplikasi SITTA (Stok Bahan Ajar & Tracking DO) dengan Vue 3 (CDN, Options API), folder `tugas2-vue-ut/`
**Perkiraan durasi:** ±13 menit 30 detik (batas maksimal 15 menit) · **Jumlah kata yang diucapkan:** ±1.370 kata (dihitung dari teks ucapan saja, tempo ±115 kata/menit ditambah jeda aksi layar)

## Checklist sebelum merekam

- [ ] Internet menyala (Vue 3 dan Bootstrap Icons dimuat dari CDN).
- [ ] VS Code terbuka di folder `tugas2-vue-ut/`, font diperbesar, dan tab `stok.html`, `js/stok-app.js`, `tracking.html`, `js/tracking-app.js`, `js/dataBahanAjar.js` sudah dibuka.
- [ ] Buka `index.html` di Chrome (Live Server atau double-click).
- [ ] **Reset data:** di `stok.html` scroll ke bawah dan klik **Kembalikan data awal**, lalu di `tracking.html` klik **Kembalikan data awal** juga. Tujuannya supaya stok kembali 4 judul dan DO hanya `DO2025-0001`, sehingga nomor DO otomatis = `DO2026-002`.
- [ ] Di halaman stok, klik **Reset filter** kalau tombolnya aktif.
- [ ] Siapkan isian demo: kode `MKDU4111`, judul `Pendidikan Kewarganegaraan`, kategori MK Wajib, UT-Daerah Jakarta, rak `R2-B1`, harga `50000`, qty `12`, safety `5`, catatan `<em>Edisi baru</em>`.
- [ ] Kamera dan mikrofon dicek, notifikasi dimatikan. Latih sekali dengan stopwatch, harus di bawah 14 menit.

---

## a. Perkenalan identitas (00:00 – 00:35)

[AKSI LAYAR: Kamera wajah tampil. Browser menampilkan `index.html` (beranda SITTA).]

> Halo, assalamualaikum, om swastiastu, salam sejahtera. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, mahasiswa Sistem Informasi Universitas Terbuka. Di video ini saya akan menjelaskan Tugas Praktik 2 mata kuliah Pemrograman Berbasis Web, kode STSI4209. Saya mengembangkan aplikasi SITTA dari Tugas 1 menjadi aplikasi Vue 3, dengan dua halaman utama: Stok Bahan Ajar dan Tracking Delivery Order. Saya akan menjelaskan per poin penilaian dari 1.1 sampai 1.7, sambil langsung mendemokan aplikasinya.

## b. Langkah-langkah praktik (penjelasan kode per poin penilaian)

### b.1 Poin 1.1: Struktur aplikasi (00:35 – 02:00)

[AKSI LAYAR: Pindah ke VS Code, tunjuk panel Explorer folder `tugas2-vue-ut/`. Buka `js/dataBahanAjar.js` baris 1–13. Buka `stok.html`, scroll ke paling bawah (baris ±390–392) dan sorot tiga tag `<script>`. Buka `js/stok-app.js`, lipat (fold) blok supaya terlihat `data` (baris 69), `computed` (103), `watch` (223), `methods` (265), `mounted`. Tunjuk `v-cloak` di `stok.html` baris 15.]

> Mulai dari struktur. Di folder ini ada index.html sebagai beranda, lalu stok.html dan tracking.html. Prinsip saya: satu halaman, satu file logika. stok.html dipasangkan dengan js/stok-app.js, tracking.html dengan js/tracking-app.js. File HTML hanya berisi tampilan, file JS hanya berisi logika. Data dummy dari soal ada di dataBahanAjar.js.
>
> Ada satu penyesuaian yang perlu saya jelaskan. File data dari soal ditulis dengan gaya Vue 2, yaitu new Vue, padahal di Vue 3 itu sudah tidak ada. Jadi isi datanya tidak saya ubah, hanya saya bungkus menjadi konstanta dataBahanAjar. Alasannya saya tulis sebagai komentar di baris satu sampai tiga belas.
>
> Di bagian bawah stok.html, urutan script-nya Vue dari CDN dulu, lalu data, lalu file app. Urutan ini penting karena app butuh Vue dan dataBahanAjar sudah ada lebih dulu. Di stok-app.js saya memakai Options API: createApp berisi data, computed, watch, methods, dan mounted, lalu di-mount ke div app. Sesuai soal, saya tidak membuat template component. Template-nya langsung ditulis di dalam div app. Saya juga memakai v-cloak, supaya kurung kurawal mentah tidak sempat terlihat sebelum Vue selesai dimuat.

### b.2 Poin 1.2: Data binding, directive, dan list rendering (02:00 – 04:00)

[AKSI LAYAR: Browser: buka halaman Stok. Tunjuk kartu ringkasan, teks "terakhir diperbarui", kolom Catatan yang bercetak miring/tebal. Lalu VS Code `stok.html`: sorot `{{ ringkasan... }}` (±50), `v-text` (±41), `v-html="item.catatanHTML"` (±293), `:class` baris tabel (±259), `:style` bar qty (±280), `v-for="(item, i) in sortedStok" :key=...` (±261). Buka `tracking.html` ±126, sorot `:value="nomorDOBaru"`.]

> Poin 1.2, data binding dan directive. Di setiap konsep di HTML saya beri komentar nama directive-nya, jadi mudah dicari. Angka di kartu ringkasan memakai mustache, kurung kurawal ganda. Teks terakhir diperbarui memakai v-text. Di tracking, Total Harga juga memakai v-text.
>
> Kolom catatan memakai v-html. Bisa dilihat di browser, tag em dan strong tampil sebagai huruf miring dan tebal, bukan sebagai teks tag. Tapi v-html hanya saya pakai untuk data internal. Untuk input dari pengguna harus hati-hati karena ada risiko XSS.
>
> Untuk v-bind, saya pakai titik dua class untuk warna baris dan status, titik dua style untuk lebar bar qty, dan titik dua disabled untuk tombol Reset dan opsi kategori yang kosong. Di tracking, nomor DO memakai titik dua value. Ini one-way binding, jadi nilainya hanya dibaca dan tidak bisa diketik. Sebaliknya, semua input filter dan form memakai v-model, yaitu two-way binding, dengan modifier .number untuk harga dan qty, dan .trim untuk NIM dan lokasi rak.
>
> List rendering memakai v-for: baris tabel stok dari sortedStok, opsi select UT-Daerah dan kategori, serta daftar DO dan timeline di tracking. Setiap v-for diberi key, di sini gabungan kode dan UT-Daerah, supaya Vue tahu identitas setiap baris. Event-nya memakai v-on atau @, misalnya @click, @submit.prevent, dan @blur untuk validasi.

### b.3 Poin 1.3: Conditional (04:00 – 05:30)

[AKSI LAYAR: VS Code `stok.html` ±288–290 (blok `v-if` / `v-else-if` / `v-else` status), ±180 (`v-if="filter.upbjj"`), ±93 (`v-show` form), ±322 (`v-if` modal). Browser: tunjuk filter Kategori yang belum ada, pilih UT-Daerah **Jakarta**, filter "Kategori di Jakarta" muncul, buka dropdown-nya (MK Wajib aktif, kategori lain abu-abu/disabled).]

> Poin 1.3, conditional. Status stok memakai v-if, v-else-if, dan v-else. Kalau qty sama dengan nol, statusnya Kosong warna merah. Kalau qty kurang dari safety stock, Menipis warna oranye. Selain itu Aman warna hijau. Urutannya sengaja Kosong dicek duluan, karena qty nol juga memenuhi syarat kurang dari safety. Kalau Menipis dicek duluan, stok kosong akan salah tampil sebagai menipis.
>
> Lalu dependent options. Sekarang filter kategori belum muncul, yang ada hanya petunjuk. Begitu saya pilih UT-Daerah Jakarta, filter Kategori di Jakarta muncul. Ini memakai v-if filter.upbjj dengan v-else. Opsinya juga menampilkan jumlah item, dan kategori yang tidak punya item di Jakarta di-disable.
>
> Form tambah bahan ajar memakai v-show, karena sering dibuka-tutup dan isiannya tidak boleh hilang. Jadi cukup disembunyikan. Sedangkan modal edit memakai v-if, karena hanya dirender saat dibutuhkan, jadi isinya selalu baru setiap dibuka.

### b.4 Poin 1.4: Computed dan methods (05:30 – 07:00)

[AKSI LAYAR: Browser: masih dengan filter Jakarta, centang **Perlu re-order** (tersisa EKMA4115). Klik header kolom **Qty** atau **Harga** untuk sort, lalu klik **Reset filter**. VS Code `js/stok-app.js`: sorot `kategoriOptions` (±105), `filteredStok` (±114), `sortedStok` (±128) dengan `.slice()`, lalu bagian `methods` (±265). Buka `js/tracking-app.js` ±102, sorot `nomorDOBaru` dan `padStart(3, "0")`.]

> Poin 1.4, computed dan methods. Saya centang perlu re-order, dan di Jakarta tinggal EKMA4115, karena qty-nya tujuh di bawah safety lima belas. Lalu saya klik header kolom untuk mengurutkan, dan Reset filter untuk mengembalikan semuanya.
>
> Di kodenya ada rantai computed: filteredStok untuk menyaring, lalu sortedStok untuk mengurutkan hasil saringan. Soal meminta agar tidak dihitung ulang tanpa perlu. Computed di Vue di-cache. Waktu saya ganti urutan, filteredStok tidak dihitung ulang, hanya sortedStok. Waktu modal edit dibuka atau ditutup, keduanya tidak dihitung ulang karena dependensinya tidak berubah. Saya pakai slice sebelum sort supaya array hasil cache tidak ikut termutasi. Ada juga computed kategoriOptions, ringkasan, dan addErrors untuk validasi.
>
> Methods saya pakai untuk aksi dan untuk fungsi yang butuh argumen per baris, misalnya statusOf, formatRupiah, setSort, resetFilter, simpanBaru, dan simpanEdit. Jadi computed untuk data turunan yang di-cache, methods untuk aksi.
>
> Di tracking ada computed nomorDOBaru. Dia mencari nomor urut terbesar di data tracking, ditambah satu, lalu digabung dengan tahun berjalan dan padStart tiga digit. Data awalnya DO2025-0001, jadi nomor berikutnya DO2026-002. Ini penyesuaian saya, karena tahun berjalan sekarang 2026, sementara nomor urutnya tetap melanjutkan data yang ada.

### b.5 Poin 1.5: Watchers (07:00 – 08:30)

[AKSI LAYAR: VS Code `js/stok-app.js` bagian `watch` (±223): tunjuk berurutan `"filter.upbjj"` (±226), `stok` deep (±232), `"newItem.kode"` (±245), `"editForm.qty"` (±251). Lalu `js/tracking-app.js` bagian `watch` (±173): `"form.paketKode"` (±175), `"form.nim"` (±182), `tracking` deep (±193), `hasilCari` (±205).]

> Poin 1.5, watchers. Di setiap halaman ada empat watcher. Di halaman stok, pertama watcher filter.upbjj: saat UT-Daerah berganti, kategori di-reset, karena kategori lama belum tentu ada di daerah baru, dan muncul toast info. Kedua, watcher stok dengan deep true: setiap ada tambah atau edit, data disimpan ke localStorage dan waktu terakhir diperbarui ikut berubah. Ketiga, watcher newItem.kode: kode yang diketik otomatis jadi huruf besar tanpa spasi. Keempat, watcher editForm.qty: memberi peringatan langsung di modal edit saat angka qty diubah.
>
> Di halaman tracking, pertama watcher form.paketKode: setiap paket dipilih, Total Harga otomatis diambil dari harga paket. Kedua, watcher form.nim: NIM divalidasi langsung saat diketik. Ketiga, watcher tracking dengan deep true untuk menyimpan DO ke localStorage. Keempat, watcher hasilCari: kalau pencarian menghasilkan tepat satu DO, detailnya langsung dibuka. Semua ini nanti saya tunjukkan di demo.

### b.6 Poin 1.6: Form dan validasi (08:30 – 11:30)

[AKSI LAYAR: Browser halaman Stok.
1) Klik **Edit** pada baris FISIP4001, modal terbuka. Klik tombol **−** sampai qty 0 (atau ketik 0), tunjuk peringatan di modal, klik **Simpan**. Tunjuk status baris berubah menjadi ⛔ Kosong dan kartu ringkasan Kosong menjadi 1.
2) Klik **Tambah Bahan Ajar**, langsung klik **Simpan** dengan form kosong, tunjuk pesan merah dan toast.
3) Ketik kode `ekma4116` (berubah jadi EKMA4116), pilih UT-Daerah Jakarta, tunjuk error duplikat. Ketik rak `rak 2`, tunjuk error format.
4) Ganti kode menjadi `mkdu4111`, isi judul `Pendidikan Kewarganegaraan`, kategori MK Wajib, rak `R2-B1`, harga 50000, qty 12, safety 5, catatan `<em>Edisi baru</em>`, tunjuk pratinjau catatan, klik **Simpan**, tunjuk toast dan baris baru.
Lalu buka halaman Tracking:
5) Ketik `Rina` di kotak cari, detail DO2025-0001 terbuka. Hapus kata kunci.
6) Di form Tambah DO, tunjuk Nomor DO `DO2026-002`. Ketik NIM `12345abc`, tunjuk error, ganti dengan `048068753`. Isi nama `I Kadek Wijaya Sashmitha Adhi C`, ekspedisi JNE Express, paket PAKET-UT-002, tunjuk detail isi paket dan Total Harga Rp 140.000. Klik **Hari ini**, klik **Simpan**. Tunjuk DO2026-002 muncul di daftar dengan status Diproses, dan nomor di form berubah menjadi DO2026-003.]

> Poin 1.6, form dan validasi. Pertama saya edit stok FISIP4001. Di modal, saya turunkan qty-nya sampai nol. Peringatan langsung muncul dari watcher tadi. Saya simpan, dan statusnya berubah jadi Kosong warna merah. Kartu ringkasan Kosong juga bertambah jadi satu.
>
> Berikutnya tambah bahan ajar. Kalau saya langsung klik Simpan dengan form kosong, semua field wajib ditandai merah dengan pesannya masing-masing, dan muncul toast. Validasinya ada di computed addErrors, dan pesannya ditampilkan setelah field ditinggalkan, lewat @blur, atau setelah tombol simpan diklik.
>
> Saya ketik kode ekma4116 dengan huruf kecil, dan otomatis berubah jadi huruf besar. Lalu saya pilih UT-Daerah Jakarta, dan muncul error kode EKMA4116 sudah ada di UT-Daerah Jakarta. Jadi tidak bisa ada data ganda. Lokasi rak juga dicek formatnya. Kalau saya isi rak spasi dua, muncul error karena formatnya harus seperti R1-A3.
>
> Sekarang saya isi dengan benar: kode MKDU4111, judul Pendidikan Kewarganegaraan, kategori MK Wajib, rak R2-B1, harga lima puluh ribu, qty dua belas, safety lima, dan catatan Edisi baru dengan tag em. Pratinjau catatannya tampil miring. Saya simpan, muncul toast berhasil, dan datanya langsung masuk ke tabel.
>
> Sekarang halaman tracking. Saya cari nama Rina. Karena hasilnya tepat satu, detail DO-nya langsung terbuka. Itu watcher hasilCari. Lalu di form Tambah DO, nomor DO sudah terisi otomatis DO2026-002 dan tidak bisa diubah. Saya coba ketik NIM dengan huruf, dan langsung muncul error NIM hanya boleh berisi angka. NIM juga harus sembilan digit. Saya ganti dengan NIM saya. Nama saya isi, ekspedisi saya pilih JNE Express. Begitu paket PAKET-UT-002 dipilih, detail isi paketnya muncul, yaitu Biologi Umum Praktikum dan Dasar-Dasar Sosiologi, dan Total Harga otomatis terisi Rp 140.000. Tanggal kirim saya isi dengan tombol Hari ini. Saya simpan. DO2026-002 masuk ke daftar dengan status Diproses dan detailnya terbuka. Nomor di form sekarang sudah berganti jadi DO2026-003.

### b.7 Poin 1.7: Kreativitas tampilan (11:30 – 12:30)

[AKSI LAYAR: Kembali ke `index.html`, tunjuk kartu statistik (jumlah judul, perlu re-order, jumlah DO) yang ikut berubah. Di halaman Stok klik kartu **Menipis** sebagai filter cepat. Buka DevTools > Toggle device toolbar (Cmd+Shift+M), pilih iPhone, klik tombol menu (hamburger), tunjuk tabel yang bisa digeser. Tutup DevTools.]

> Poin 1.7, kreativitas tampilan. Desainnya melanjutkan gaya Tugas 1, dengan tambahan CSS khusus Tugas 2 di bagian akhir style.css. Di beranda ada kartu statistik yang membaca data dari localStorage, jadi sekarang jumlah judul, jumlah perlu re-order, dan jumlah DO ikut berubah sesuai demo tadi. Di halaman stok, kartu ringkasan bisa diklik sebagai filter cepat, misalnya Menipis. Ada chip filter aktif, toast notifikasi, bar qty berwarna, dan ikon status. Tampilannya juga responsif. Di layar HP, menu berubah jadi tombol hamburger dan tabelnya bisa digeser ke samping.

## c. Hasil praktik (12:30 – 13:10)

[AKSI LAYAR: Tampilkan halaman Stok (dengan MKDU4111 dan FISIP4001 berstatus Kosong) lalu halaman Tracking (dengan DO2026-002).]

> Jadi hasilnya, aplikasi SITTA berhasil dibuat dengan Vue 3 lewat CDN dan Options API. Halaman stok bisa menampilkan, menyaring, mengurutkan, menambah, dan mengedit bahan ajar, dengan status Aman, Menipis, dan Kosong. Halaman tracking bisa mencari DO dan menambah DO baru dengan nomor otomatis, paket, dan total harga. Semua poin, dari data binding, directive, conditional, computed, methods, watcher, sampai validasi form, sudah diterapkan, dan datanya tersimpan di localStorage.

## d. Penutup (13:10 – 13:30)

[AKSI LAYAR: Kamera wajah di tengah atau diperbesar.]

> Sekian penjelasan Tugas Praktik 2 Pemrograman Berbasis Web dari saya. Mohon maaf kalau ada kekurangan. Terima kasih atas perhatiannya, wassalamualaikum, om shanti shanti shanti om.
