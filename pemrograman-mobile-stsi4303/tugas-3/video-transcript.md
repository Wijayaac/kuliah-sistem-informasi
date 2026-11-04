# Transkrip Video Tugas 3 Pemrograman Berbasis Perangkat Bergerak (STSI4303)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi
**Topik:** Aplikasi daftar cryptocurrency (Ionic + Vue 3 + CoinLore API), folder `tugas-3/crypto-ionic`
**Perkiraan durasi:** ±7 menit

> Catatan: harga crypto berubah terus. Angka di naskah adalah contoh saat laporan dibuat (31 Okt 2026); saat merekam, baca angka yang tampil di layar. Teks [AKSI LAYAR] tidak dibacakan.

## Checklist sebelum merekam

- [ ] Internet menyala (data diambil dari api.coinlore.net).
- [ ] VS Code terbuka di folder `crypto-ionic`, font diperbesar.
- [ ] Terminal di folder `crypto-ionic`. Jangan jalankan `ionic serve` dulu.
- [ ] Browser punya tab URL API: `https://api.coinlore.net/api/tickers/`.
- [ ] (Opsional) HP Android tersambung ke Wi-Fi yang sama dengan Mac.

---

## a. Perkenalan Identitas (± 0:00 – 0:45)

[AKSI LAYAR] Kamera menampilkan wajah. Layar laptop menampilkan halaman awal laporan / VS Code.

"Om swastiastu, salam sejahtera untuk kita semua.
Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, dari Program Studi Sistem Informasi, Fakultas Sains dan Teknologi, Universitas Terbuka Daerah Denpasar.
Pada video ini saya akan mempresentasikan Tugas 3 mata kuliah Pemrograman Berbasis Perangkat Bergerak, kode STSI4303.
Tugasnya adalah membuat aplikasi mobile yang menampilkan data cryptocurrency dari API CoinLore, dengan field rank, name, symbol, dan price underscore USD."

---

## b. Langkah-Langkah Praktik (± 0:45 – 4:45)

### 1. Melihat data API (± 0:45 – 1:30)

[AKSI LAYAR] Buka browser, ketik https://api.coinlore.net/api/tickers/ lalu tekan Enter. Aktifkan "Pretty print".

"Langkah pertama, saya buka dulu alamat API dari soal di browser untuk melihat bentuk datanya.
Hasilnya berupa JSON. Datanya ada di dalam properti data, isinya seratus koin teratas.
Setiap koin punya banyak field, tapi yang saya pakai hanya empat: rank, name, symbol, dan price_usd.
Di bagian bawah ada info coins_num, yang menunjukkan ada sekitar lima belas ribu cryptocurrency yang tercatat."

### 2. Membuat project Ionic Vue (± 1:30 – 2:10)

[AKSI LAYAR] Buka Terminal di folder tugas-3. Tunjukkan perintah `ionic start crypto-ionic blank --type=vue`, lalu `cd crypto-ionic`.

"Kedua, saya membuat project baru dengan Ionic CLI dan framework Vue, memakai template blank.
Perintahnya ionic start crypto-ionic blank tipe vue. Setelah selesai, saya masuk ke folder crypto-ionic.
Di sini ada dua file utama yang saya buat dan ubah: file service crypto.ts untuk mengambil data, dan HomePage.vue untuk tampilan."

### 3. Mengambil data API dengan fetch (± 2:10 – 3:00)

[AKSI LAYAR] Buka VS Code, file `src/services/crypto.ts`. Sorot `API_URL`, lalu `await fetch(API_URL)`, lalu `json.data.map`.

"Ini file crypto.ts. Di baris atas ada API_URL berisi alamat dari soal.
Lalu ada interface Crypto yang menentukan bentuk datanya: id, rank, name, symbol, dan price_usd.
Fungsi ambilCrypto memakai await fetch untuk memanggil API. Kalau responsnya tidak OK, saya lempar error supaya aplikasi bisa menampilkan pesan gagal.
Kalau berhasil, respons diubah ke JSON, lalu json.data di-map supaya hanya mengambil field yang dibutuhkan."

### 4. Menampilkan data dengan perulangan v-for (± 3:00 – 3:50)

[AKSI LAYAR] Buka `src/views/HomePage.vue`, sorot blok `<div v-for="coin in filtered" ...>`.

"Berikutnya file HomePage.vue. Bagian terpenting adalah perulangan v-for.
v-for coin in filtered artinya satu baris dibuat untuk setiap koin, jadi seratus data cukup ditulis dengan satu blok saja. Key-nya memakai coin.id supaya unik.
Setiap baris punya tiga kolom, mengikuti gambar di soal: kiri tulisan Rank dan angkanya, tengah nama koin kecil dan simbolnya besar, kanan tulisan USD dan harganya."

### 5. Refresh dan filter pencarian (± 3:50 – 4:45)

[AKSI LAYAR] Scroll ke `<script setup>`, sorot `fetchCrypto`, lalu `const filtered = computed(...)`, lalu `onMounted(fetchCrypto)`.

"Di bagian script, fungsi fetchCrypto memanggil service tadi dan menyimpan hasilnya ke variabel coins. Fungsi ini dijalankan saat halaman dibuka lewat onMounted, saat tombol Refresh ditekan, dan saat layar ditarik ke bawah.
Lalu ada filtered, sebuah computed untuk pencarian. Kalau kolom cari kosong, semua koin tampil. Kalau diisi, hanya koin yang nama atau simbolnya mengandung kata kunci yang ditampilkan, tanpa membedakan huruf besar dan kecil."

---

## c. Hasil dan Analisa (± 4:45 – 6:30)

[AKSI LAYAR] Terminal: jalankan `ionic serve`. Browser terbuka di http://localhost:8100, buka DevTools lalu Toggle device toolbar (mode HP). (Opsional: tunjukkan juga di HP Android lewat `ionic serve --external`.)

"Sekarang saya jalankan aplikasinya dengan ionic serve, dan saya tampilkan dalam mode layar HP.
Hasilnya seperti gambar di soal: ada tombol Refresh di atas, lalu daftar koin dengan latar krem. Rank satu Bitcoin, BTC, rank dua Ethereum, ETH, rank tiga Tether, USDT, dan seterusnya sampai seratus."

[AKSI LAYAR] Klik tombol Refresh, tunjukkan harga BTC dan jam "diperbarui" berubah.

"Kalau saya tekan Refresh, harga berubah dan jam pembaruannya ikut berganti. Ini membuktikan datanya diambil langsung dari API, bukan data statis."

[AKSI LAYAR] Ketik "eth" di kolom pencarian, lalu hapus.

"Kalau saya ketik eth di kolom cari, hanya koin yang mengandung kata eth yang tampil, misalnya Ethereum, Staked Ether, dan Ethereum Classic.

Dari analisa data, saya melihat rank tidak ditentukan oleh harga per koin, tetapi oleh kapitalisasi pasar, yaitu harga dikali jumlah koin yang beredar. Contohnya Tether harganya hanya satu dolar, tapi berada di rank tiga karena jumlahnya sangat banyak.
Ada juga beberapa koin yang harganya selalu sekitar satu dolar, seperti USDT dan USDC. Ini disebut stablecoin karena nilainya dipatok ke dolar Amerika.
Dari seratus koin, hampir setengahnya berharga di bawah satu dolar, dan hanya sekitar sebelas koin yang harganya di atas seribu dolar."

---

## Penutup (± 6:30 – 7:00)

[AKSI LAYAR] Kembali ke kamera / tampilan aplikasi.

"Jadi kesimpulannya, aplikasi Ionic dengan Vue berhasil mengambil data dari API CoinLore dan menampilkan rank, name, symbol, dan price USD sesuai contoh di soal. Konsep utamanya adalah fetch untuk mengambil data, v-for untuk menampilkan data secara berulang, dan computed untuk filter pencarian.
Sekian presentasi Tugas 3 dari saya. Terima kasih atas perhatiannya. Om shanti shanti shanti om."
