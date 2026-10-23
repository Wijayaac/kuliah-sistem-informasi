# Transkrip Video Tugas 2 Pemrograman Berbasis Perangkat Bergerak (STSI4303)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi
**Topik:** Aplikasi prakiraan cuaca Jakarta (Vue 3 CDN + Open-Meteo API), file `tugas-2/index.html`
**Perkiraan durasi:** ±7 menit (rentang aman 6½–7½ menit) · **Jumlah kata yang diucapkan:** ±740 kata (dihitung dari teks ucapan saja, tempo ±115 kata/menit ditambah jeda aksi layar)

> Catatan: angka suhu berasal dari prakiraan live, jadi berubah setiap hari. Di bagian yang bertanda **(sebutkan angka yang tampil)**, baca angka yang benar-benar terlihat di layar saat merekam. Jangan memakai angka dari laporan.

## Checklist sebelum merekam

- [ ] Internet menyala (Vue 3 dimuat dari CDN unpkg dan data diambil dari api.open-meteo.com).
- [ ] VS Code terbuka di folder `pemrograman-mobile-stsi4303/tugas-2/` dengan `index.html` aktif, dan font diperbesar.
- [ ] Browser (Chrome) punya dua tab: (1) URL API `https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m`, (2) `index.html` (double-click atau Live Server).
- [ ] Di tab aplikasi, DevTools sudah dibuka (Cmd+Opt+I), Toggle device toolbar aktif (Cmd+Shift+M), dan device iPhone sudah dipilih. Tutup panel Elements kalau terlalu sempit.
- [ ] Muat ulang aplikasi sekali sebelum merekam untuk memastikan data tampil (bukan pesan error).
- [ ] Kamera dan mikrofon dicek, notifikasi dimatikan.

---

## a. Perkenalan identitas (00:00 – 00:35)

[AKSI LAYAR: Kamera wajah tampil. Di layar tampil VS Code dengan `index.html`.]

> Halo, assalamualaikum, om swastiastu, salam sejahtera. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, mahasiswa Sistem Informasi Universitas Terbuka. Di video ini saya akan menunjukkan praktik Tugas 2 mata kuliah Pemrograman Berbasis Perangkat Bergerak, kode STSI4303. Tugasnya adalah membuat aplikasi sederhana yang menampilkan data prakiraan cuaca Jakarta dari API Open-Meteo, khususnya waktu pengukuran dan suhu per jam.

## b. Langkah-langkah praktik

### b.1 Memeriksa API terlebih dahulu (00:35 – 01:35)

[AKSI LAYAR: Pindah ke tab browser yang berisi URL API. Centang "Pretty-print" kalau ada. Arahkan kursor ke `latitude`, `longitude`, lalu ke objek `hourly_units`, `hourly`, array `time`, dan array `temperature_2m`.]

> Langkah pertama, sebelum menulis kode, saya buka dulu alamat API dari soal di browser untuk melihat bentuk datanya. Latitude minus 6,2 dan longitude 106,8 itu koordinat Jakarta. Hasilnya berupa JSON. Datanya ada di dalam objek hourly. Isinya dua array yang terpisah: array time berisi waktu pengukuran, dan array temperature_2m berisi suhu per jam. Satuannya ada di hourly_units, yaitu derajat Celsius. Kedua array ini panjangnya sama dan urutannya berpasangan, jadi elemen pertama time adalah waktu untuk suhu pertama, begitu seterusnya. Secara default API ini memberi prakiraan tujuh hari, jadi sekitar seratus enam puluh delapan data per jam.

### b.2 Struktur file dan Vue lewat CDN (01:35 – 02:20)

[AKSI LAYAR: Pindah ke VS Code. Scroll `index.html` dari atas: `<meta name="viewport">` (baris 5), tag `<style>`, `<script src=".../vue@3...">`, lalu `<div id="app">`.]

> Aplikasi saya buat dalam satu file saja, index.html. Saya memakai Vue 3 lewat CDN, jadi tidak perlu install atau build apa pun. Cukup buka file-nya di browser. Di bagian atas ada meta viewport supaya tampilannya pas di layar HP. Lalu ada CSS di dalam tag style, script Vue dari CDN, dan template aplikasinya di dalam div dengan id app.

### b.3 Mengambil data dengan fetch dan map (02:20 – 03:30)

[AKSI LAYAR: Scroll ke `const API_URL` (baris 78), sorot `&timezone=Asia%2FJakarta`. Lanjut ke `async function fetchCuaca()` (baris ±89–109), sorot `await fetch(API_URL)`, `res.json()`, lalu blok `json.hourly.time.map(...)`, dan `catch` / `finally`.]

> Di bagian script, saya memakai createApp dengan fungsi setup, ref, dan computed dari Vue 3. Alamat API saya simpan di konstanta API_URL. Di sini saya menambahkan satu parameter, yaitu timezone sama dengan Asia/Jakarta, supaya jam yang dikembalikan sudah dalam WIB, bukan GMT.
>
> Lalu fungsi fetchCuaca. Fungsi ini async: dia memanggil fetch ke API, mengecek apakah respons-nya berhasil, lalu mengubahnya menjadi JSON. Karena time dan temperature_2m itu dua array terpisah, saya gabungkan memakai map. Setiap waktu dipasangkan dengan suhu di indeks yang sama, jadi hasilnya satu list objek yang berisi time dan temp. List ini lebih mudah ditampilkan dalam tabel. Ada juga variabel loading dan error. Selama data diambil muncul tulisan memuat data, dan kalau gagal muncul pesan error dengan tombol coba lagi. Fungsi ini dipanggil otomatis di onMounted, saat aplikasi pertama kali tampil.

### b.4 Computed dan v-for (03:30 – 04:30)

[AKSI LAYAR: Scroll ke blok `computed` (baris ±111–118): `days`, `filtered`, `minTemp`, `maxTemp`, `avgTemp`. Lalu scroll ke template: tombol hari `v-for="d in days"` (baris ±53) dan baris tabel `v-for="item in filtered"` (baris ±62), serta fungsi `tempClass` (baris ±127).]

> Berikutnya bagian computed. days berisi daftar tanggal unik dari data, jadi ada tujuh tombol hari. filtered berisi data untuk tanggal yang sedang dipilih saja, yaitu dua puluh empat jam. Dari filtered saya hitung suhu minimum, maksimum, dan rata-rata. Karena memakai computed, nilainya otomatis dihitung ulang setiap kali saya ganti tanggal.
>
> Di template, tombol tanggal dibuat dengan v-for dari days, dan klik tombolnya mengganti selectedDay. Tabelnya juga memakai v-for dari filtered, dengan dua kolom sesuai soal: waktu atau time, dan suhu atau temperature_2m. Warna suhunya diatur fungsi tempClass: biru kalau di bawah dua puluh tujuh derajat, oranye untuk dua puluh tujuh sampai di bawah tiga puluh satu, dan merah untuk tiga puluh satu derajat ke atas. Lebar aplikasi saya batasi empat ratus delapan puluh piksel supaya nyaman dilihat di HP.

## c. Hasil dan analisa praktik

### c.1 Menjalankan aplikasi (04:30 – 05:30)

[AKSI LAYAR: Pindah ke tab `index.html` yang sudah dalam mode device iPhone. Tekan reload, tunjukkan sekilas tulisan "Memuat data cuaca...". Tunjuk kartu ringkasan, deretan tombol tanggal, lalu scroll tabel. Tunjuk baris jam sekarang yang ber-highlight biru. Klik dua atau tiga tombol tanggal lain.]

> Sekarang saya jalankan aplikasinya dalam mode tampilan HP. Saat dibuka, data langsung diambil dari API. Di bagian atas ada ringkasan untuk hari yang dipilih. Hari ini suhu minimumnya **(sebutkan angka yang tampil)** derajat, rata-ratanya **(sebutkan angka yang tampil)** derajat, dan maksimumnya **(sebutkan angka yang tampil)** derajat Celsius.
>
> Di bawahnya ada tombol tanggal untuk tujuh hari ke depan, lalu tabel waktu dan suhu per jam dalam WIB. Baris jam sekarang diberi warna biru muda supaya mudah dicari. Kalau saya klik tanggal lain, tabel dan ringkasannya langsung berubah tanpa memuat ulang halaman.

### c.2 Analisa pola suhu (05:30 – 06:40)

[AKSI LAYAR: Kembali ke hari pertama. Scroll tabel pelan dari 00:00 WIB ke 23:00 WIB, berhenti di jam dengan suhu terendah (biasanya dini hari) lalu di jam dengan suhu tertinggi (biasanya siang). Klik satu hari lain untuk membandingkan.]

> Sekarang analisanya. Kalau saya scroll dari jam nol, suhu terendah hari ini ada di sekitar jam **(sebutkan jam yang tampil)**, yaitu **(sebutkan angka yang tampil)** derajat. Setelah matahari terbit suhunya naik, dan puncaknya di sekitar jam **(sebutkan jam yang tampil)** dengan **(sebutkan angka yang tampil)** derajat. Setelah itu suhunya turun lagi menjelang sore dan malam.
>
> Polanya kurang lebih sama di hari-hari lain: terendah biasanya dini hari, tertinggi sekitar siang. Menurut saya ini wajar, karena suhu udara dipengaruhi pemanasan matahari pada siang hari dan pendinginan pada malam hari. Selisih siang dan malam di Jakarta juga tidak terlalu besar, mungkin karena Jakarta kota tropis yang dekat laut. Tapi perlu diingat, ini data prakiraan, bukan hasil pengukuran, jadi angkanya bisa berubah kalau datanya diambil ulang nanti.

## d. Penutup (06:40 – 07:05)

[AKSI LAYAR: Kamera wajah di tengah atau diperbesar.]

> Jadi kesimpulannya, aplikasi ini berhasil mengambil data cuaca dari API Open-Meteo dan menampilkan waktu serta suhu per jam di Jakarta dengan tampilan yang mudah dibaca di HP. Sekian video praktik dari saya. Mohon maaf kalau ada kekurangan. Terima kasih, wassalamualaikum, om shanti shanti shanti om.
