# Transkrip Video Tugas 2 Pemrograman Berbasis Perangkat Bergerak (STSI4303)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi
**Topik:** Aplikasi prakiraan cuaca Jakarta (Ionic + Vue 3 + Open-Meteo API), folder `tugas-2/cuaca-ionic`
**Perkiraan durasi:** ±7–8 menit

> Catatan: angka suhu berasal dari prakiraan live. Di bagian bertanda **(sebutkan angka yang tampil)**, baca angka yang terlihat di layar saat merekam.

## Checklist sebelum merekam

- [ ] Internet menyala (data diambil dari api.open-meteo.com).
- [ ] VS Code terbuka di folder `cuaca-ionic`, font diperbesar.
- [ ] Terminal di folder `cuaca-ionic`. Jangan jalankan `ionic serve` dulu, kita jalankan saat merekam.
- [ ] Browser punya tab URL API: `https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m`.
- [ ] (Opsional) HP Android tersambung ke Wi-Fi yang sama dengan Mac.
- [ ] Kamera dan mikrofon dicek, notifikasi dimatikan.

---

## a. Perkenalan identitas (00:00 – 00:35)

[AKSI LAYAR: Kamera wajah tampil. Di layar tampil VS Code dengan folder `cuaca-ionic`.]

> Halo, om swastiastu, salam sejahtera. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, mahasiswa Sistem Informasi Universitas Terbuka. Di video ini saya akan menunjukkan praktik Tugas 2 mata kuliah Pemrograman Berbasis Perangkat Bergerak, kode STSI4303. Tugasnya adalah membuat aplikasi mobile menggunakan Vue dengan framework Ionic, yang menampilkan data prakiraan cuaca Jakarta dari API Open-Meteo, yaitu waktu dan suhu per jam.

## b. Langkah-langkah praktik

### b.1 Memeriksa API (00:35 – 01:30)

[AKSI LAYAR: Tab browser URL API. Arahkan kursor ke `hourly_units`, `hourly`, array `time`, dan `temperature_2m`.]

> Sebelum menulis kode, saya buka dulu alamat API dari soal di browser. Latitude minus 6,2 dan longitude 106,8 adalah koordinat Jakarta. Hasilnya berupa JSON. Di dalam objek hourly ada dua array: time berisi waktu, dan temperature_2m berisi suhu per jam. Satuannya ada di hourly_units, yaitu derajat Celsius. Kedua array ini berpasangan berdasarkan indeks, dan isinya prakiraan tujuh hari, sekitar seratus enam puluh delapan data.

### b.2 Instalasi Ionic dan membuat project (01:30 – 02:30)

[AKSI LAYAR: Terminal. Tunjukkan `node -v`, `ionic --version`. Tunjukkan perintah di `INSTALL.md`.]

> Untuk Ionic, syaratnya Node.js sudah terpasang. Lalu saya install Ionic CLI secara global dengan perintah npm install minus g at-ionic slash cli. Setelah itu project dibuat dengan perintah ionic start, memakai template blank dan type vue. Ionic otomatis menyiapkan Vue 3, Vite, TypeScript, dan Capacitor untuk build ke Android. Semua langkah instalasinya saya tulis di file INSTALL.md.

### b.3 Struktur project (02:30 – 03:05)

[AKSI LAYAR: Explorer VS Code. Buka `src/` dan tunjuk `services/cuaca.ts`, `views/HomePage.vue`, `router/`.]

> Ini struktur project-nya. File utama yang saya ubah ada dua. Pertama, src/services/cuaca.ts untuk mengambil data dari API. Kedua, src/views/HomePage.vue yang berisi tampilan halaman utama. Pemisahan ini supaya logika data dan tampilan tidak tercampur.

### b.4 Service pengambil data (03:05 – 04:00)

[AKSI LAYAR: Buka `src/services/cuaca.ts`. Sorot `API_URL` dan `timezone=Asia%2FJakarta`, interface `DataCuaca`, lalu fungsi `ambilCuaca` dan blok `map`.]

> Di cuaca.ts ada konstanta API_URL. Saya menambahkan parameter timezone sama dengan Asia/Jakarta, supaya jam yang dikembalikan sudah WIB, bukan GMT. Lalu ada interface DataCuaca, yang mendefinisikan satu baris data berisi time dan temp. Fungsi ambilCuaca bersifat async: memanggil fetch, mengecek respons berhasil atau tidak, lalu mengubahnya jadi JSON. Karena time dan temperature_2m adalah dua array terpisah, saya gabungkan dengan map menjadi satu list objek. Fungsi ini juga mengembalikan satuan suhunya.

### b.5 Logika di HomePage.vue (04:00 – 05:00)

[AKSI LAYAR: Buka `HomePage.vue`, scroll ke `<script setup>`. Sorot `ref` (data, loading, error, selectedDay), `fetchCuaca`, `handleRefresh`, computed `days`, `filtered`, `minTemp`, `avgTemp`, `maxTemp`, lalu `currentHour` dan `tempColor`.]

> Di HomePage saya memakai script setup dengan Composition API. State-nya dibuat dengan ref: data, loading, error, dan hari yang dipilih. Fungsi fetchCuaca memanggil service tadi, dan dijalankan otomatis di onMounted saat halaman dibuka. Fungsi yang sama juga dipakai untuk pull-to-refresh.
>
> Lalu computed. days berisi daftar tanggal unik, jadi tujuh hari. filtered berisi data dua puluh empat jam untuk hari yang dipilih. Dari situ dihitung suhu minimum, rata-rata, dan maksimum. Karena computed, nilainya otomatis berubah saat saya ganti hari. Ada juga currentHour untuk menandai jam sekarang, dan tempColor untuk warna suhu: biru di bawah dua puluh tujuh derajat, oranye dua puluh tujuh sampai tiga puluh satu, dan merah tiga puluh satu ke atas.

### b.6 Komponen Ionic di template (05:00 – 05:50)

[AKSI LAYAR: Scroll ke `<template>`. Sorot `ion-header`/`ion-toolbar`, `ion-segment` dengan `v-for="d in days"`, `ion-refresher`, `ion-spinner`, `ion-card`, `ion-list` dengan `ion-item v-for="item in filtered"`, `ion-badge`, `ion-footer`.]

> Tampilannya memakai komponen Ionic, jadi terlihat seperti aplikasi native. Di atas ada ion-header dan ion-toolbar untuk judul. Di bawahnya ion-segment untuk tab hari, dibuat dengan v-for dari days. Lalu ion-refresher untuk tarik ke bawah memuat ulang. Saat loading tampil ion-spinner, dan kalau gagal ada pesan error dengan tombol coba lagi. Ringkasan suhu ada di ion-card. Daftar waktu dan suhu memakai ion-list dan ion-item dengan v-for dari filtered, dan suhunya ditampilkan dalam ion-badge berwarna. Paling bawah ada ion-footer berisi identitas saya.

## c. Hasil dan analisa praktik

### c.1 Menjalankan di browser (05:50 – 06:45)

[AKSI LAYAR: Terminal, jalankan `ionic serve`. Browser terbuka di `localhost:8100`. Buka DevTools mode device (Cmd+Opt+I, Cmd+Shift+M). Tunjuk kartu ringkasan, tab hari, baris "sekarang". Klik dua tab hari lain.]

> Sekarang saya jalankan dengan perintah ionic serve. Aplikasi terbuka di localhost port 8100, dan saya tampilkan dalam mode HP. Sempat muncul spinner memuat data, lalu datanya tampil. Hari ini suhu minimum **(sebutkan angka yang tampil)**, rata-rata **(sebutkan)**, dan maksimum **(sebutkan)** derajat Celsius. Baris jam sekarang diberi highlight. Kalau saya pindah tab hari, daftar dan ringkasannya langsung berubah.

### c.2 Menjalankan di HP Android (06:45 – 07:25)

[AKSI LAYAR: Stop server (Ctrl+C), jalankan `ionic serve --external`. Tunjuk alamat IP yang muncul. Tampilkan layar HP (kamera atau mirroring) yang membuka alamat itu di Chrome. Coba tarik ke bawah untuk refresh.]

> Untuk mencoba di HP, saya jalankan ionic serve minus minus external. Muncul alamat IP Mac saya dengan port 8100. Dengan HP di Wi-Fi yang sama, alamat itu saya buka di Chrome Android, dan aplikasinya tampil. Saya coba tarik ke bawah, data dimuat ulang. Kalau ingin jadi file APK, bisa dibuild dengan Capacitor dan Android Studio, langkahnya ada di INSTALL.md.

### c.3 Analisa dan penutup (07:25 – 08:00)

[AKSI LAYAR: Kembali ke kamera wajah.]

> Kesimpulannya, dengan Ionic dan Vue saya bisa membuat aplikasi mobile yang tampilannya seperti native, tapi tetap ditulis dengan HTML, TypeScript, dan Vue. Data dari API berhasil ditampilkan sesuai soal, yaitu waktu dan suhu per jam, dalam zona WIB. Satu kode yang sama bisa jalan di browser dan di HP Android. Sekian video dari saya, terima kasih. Om shanti shanti shanti om.
