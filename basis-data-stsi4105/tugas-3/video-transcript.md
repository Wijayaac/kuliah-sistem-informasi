# Transkrip Video Tugas 3 Basis Data (STSI4105)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi · UT Denpasar
**Topik:** Praktikum Transaksi dan Basis Data Terdistribusi pada database `db_rumah_sakit` (MySQL XAMPP + DBeaver)
**Perkiraan durasi:** ±7 menit 45 detik · **Jumlah kata diucapkan:** ±750 kata (tempo ±110 kata/menit + jeda aksi layar)

## Checklist sebelum merekam
- [ ] XAMPP: MySQL sudah **Start**. DBeaver connect ke `localhost:3306` user `root`.
- [ ] File `tugas-3/sql/00` sampai `10` sudah dibuka sebagai tab di DBeaver (File > Open File).
- [ ] Tab tambahan "Sesi B" disiapkan untuk demo isolasi (opsional, file 07).
- [ ] Font SQL Editor diperbesar (`Cmd` + `+`), kamera wajah menyala, notifikasi Mac dimatikan (Focus/Do Not Disturb).

---

## a. Perkenalan (00:00 – 00:40)

[AKSI LAYAR: Wajah tampil di pojok layar. DBeaver terbuka dengan koneksi localhost.]

> Halo, om swastiastu, salam sejahtera untuk kita semua. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, program studi Sistem Informasi, Universitas Terbuka Denpasar. Di video ini saya akan menunjukkan Tugas 3 mata kuliah Basis Data, kode STSI4105. Ada dua praktikum, yaitu praktikum transaksi dan praktikum basis data terdistribusi. Datanya memakai database rumah sakit dari Tugas 2, yaitu db_rumah_sakit, dengan MySQL dari XAMPP dan aplikasi DBeaver.

## b. Langkah-langkah praktik

### b.1 Menyiapkan database (00:40 – 01:20)

[AKSI LAYAR: Buka tab `00_reset_db_rumah_sakit.sql`, tekan Option+X. Lalu tab `01_siapkan_database.sql`, Option+X. Tunjukkan hasil kolom ENGINE = InnoDB dan tabel pasien 6 baris.]

> Pertama saya jalankan file 00 untuk membuat ulang database Tugas 2, supaya praktikum dimulai dari data yang bersih. Lalu file 01. Di sini saya cek dulu engine tabelnya. Semua tabel memakai InnoDB, dan ini penting karena hanya engine yang transaksional seperti InnoDB yang mendukung COMMIT dan ROLLBACK. Saya juga menambahkan tiga pasien dari Denpasar dan Badung, yang nanti dipakai untuk praktikum terdistribusi.

### b.2 COMMIT (01:20 – 02:00)

[AKSI LAYAR: Tab `02_transaksi_commit.sql`, sorot baris START TRANSACTION sampai COMMIT, Option+X, tunjukkan waktu_jaga ADM01 berubah dan dokter_admin bertambah baris ke-4.]

> Transaksi adalah satu unit kerja yang terdiri dari beberapa perintah, dan harus berhasil semua atau batal semua. Di file 02 saya mulai dengan START TRANSACTION, lalu mengubah jam jaga administrator ADM01 dan menambah data dokter_admin. Setelah itu saya akhiri dengan COMMIT. Hasilnya, jam jaga sudah berubah menjadi pagi enam sampai tiga belas, dan dokter_admin sekarang punya empat baris. Setelah COMMIT, perubahan ini permanen.

### b.3 ROLLBACK (02:00 – 02:35)

[AKSI LAYAR: Tab `03_transaksi_rollback.sql`, Option+X. Tunjukkan tiga hasil: 6, 0, 6.]

> Berikutnya ROLLBACK. Saya simulasikan kesalahan, yaitu semua data pemeriksaan di tabel pasien_dokter terhapus. Sebelum transaksi ada enam baris, di dalam transaksi menjadi nol, tetapi karena saya jalankan ROLLBACK, datanya kembali lagi menjadi enam. Jadi perubahan yang belum di-COMMIT bisa dibatalkan.

### b.4 SAVEPOINT (02:35 – 03:15)

[AKSI LAYAR: Tab `04_transaksi_savepoint.sql`, sorot SAVEPOINT sp_pasien, sp_daftar, dan ROLLBACK TO SAVEPOINT. Option+X, tunjukkan hasil "Resep salah" lalu hasil akhir DOK03 Loratadine.]

> Di file 04 saya memakai SAVEPOINT, yaitu titik simpan di tengah transaksi. Saya input pasien baru PSN07, buat savepoint, lalu input pendaftaran, buat savepoint lagi. Kemudian saya sengaja memasukkan resep yang salah. Dengan ROLLBACK TO SAVEPOINT sp_daftar, hanya resep yang salah yang dibatalkan, sedangkan data pasien dan pendaftarannya tetap ada. Setelah itu saya input resep yang benar dan COMMIT.

### b.5 Autocommit (03:15 – 03:45)

[AKSI LAYAR: Tab `05_autocommit.sql`, Option+X, tunjukkan autocommit 0, no_hp berubah lalu kembali.]

> Secara default MySQL dalam mode autocommit, artinya setiap perintah langsung permanen. Di file 05 saya matikan dengan SET autocommit sama dengan nol. Nomor HP dokter saya ubah, lalu ROLLBACK, dan nomornya kembali seperti semula. Setelah selesai, autocommit saya nyalakan lagi.

### b.6 Transaksi pendaftaran pasien dan kasus gagal (03:45 – 04:40)

[AKSI LAYAR: Tab `06_transaksi_pendaftaran.sql`, sorot isi procedure dan EXIT HANDLER. Option+X. Tunjukkan status BERHASIL PSN08, GAGAL PSN09, dan tabel bukti hanya PSN08.]

> Ini contoh transaksi yang nyata. Saat pasien mendaftar, ada tiga insert: ke tabel pasien, ke tabel daftar, dan ke tabel pasien_dokter. Ketiganya saya bungkus dalam procedure sp_daftar_pasien. Kalau terjadi error, handler akan menjalankan ROLLBACK. Kasus pertama, pasien PSN08 dengan data valid, hasilnya berhasil di-COMMIT. Kasus kedua, pasien PSN09 memakai dokter DOK99 yang tidak ada, sehingga insert ketiga gagal karena foreign key, error 1452. Hasilnya, PSN09 tidak tersimpan di tabel mana pun, padahal insert pasien dan daftar sudah sempat berjalan. Inilah sifat atomicity.

### b.7 Isolasi dua sesi (04:40 – 05:10)

[AKSI LAYAR: Tab Sesi A dan Sesi B berdampingan, mode Manual Commit. Sesi A: UPDATE nama PSN02 tanpa commit. Sesi B: SELECT masih "Putri Ayu". Sesi B UPDATE menunggu. Sesi A ROLLBACK.]

> Untuk isolation, saya buka dua sesi. Sesi A mengubah nama pasien PSN02 tapi belum COMMIT. Di sesi B dengan level READ COMMITTED, namanya masih yang lama, jadi tidak ada dirty read. Saat sesi B mencoba mengubah baris yang sama, ia harus menunggu karena baris dikunci sesi A. Setelah sesi A ROLLBACK, kunci terlepas.

### b.8 Basis data terdistribusi: membuat site dan fragmen (05:10 – 06:00)

[AKSI LAYAR: Tab `08_terdistribusi_buat_site.sql`, Option+X. Refresh koneksi, buka database rs_denpasar, rs_badung, rs_pusat di Database Navigator.]

> Bagian kedua, basis data terdistribusi. Idealnya setiap site ada di server berbeda dan dihubungkan dengan engine FEDERATED, tetapi engine itu nonaktif secara default di XAMPP. Jadi saya simulasikan di satu server: setiap site adalah satu database, yaitu rs_denpasar, rs_badung, dan rs_pusat. Tabel pasien saya fragmentasi horizontal berdasarkan kota: pasien Denpasar ke rs_denpasar, pasien Badung ke rs_badung, dan sisanya ke rs_pusat. Lalu fragmentasi vertikal: kolom nama dan jenis kelamin disimpan di rs_denpasar, sedangkan alamat disimpan di rs_pusat, dan keduanya tetap membawa id_pasien sebagai kunci.

### b.9 Rekonstruksi, transaksi terdistribusi, replikasi (06:00 – 06:50)

[AKSI LAYAR: Tab `09_terdistribusi_rekonstruksi.sql`, Option+X, tunjukkan v_pasien_global, hasil jumlah 8-8-8-8 dan selisih 0. Lalu tab `10_...`, Option+X, tunjukkan PSN10 ada, PSN11 tidak, jumlah dokter 4 di tiga site.]

> Di file 09 saya buat view global. Fragmen horizontal disatukan dengan UNION ALL, dan fragmen vertikal disatukan dengan JOIN pada id_pasien. Pengguna cukup membaca view ini tanpa perlu tahu datanya ada di site mana. Ini disebut transparansi lokasi. Di file 10 saya jalankan satu transaksi yang menulis ke tiga site sekaligus. Lalu replikasi: tabel dokter disalin ke setiap cabang, dan trigger otomatis menyalin dokter baru ke cabang.

## c. Hasil praktik (06:50 – 07:25)

[AKSI LAYAR: Scroll panel Results file 09 dan 10; tunjukkan jumlah pasien per site 4-2-2.]

> Hasilnya, pada praktikum transaksi COMMIT menyimpan perubahan permanen, ROLLBACK dan ROLLBACK TO SAVEPOINT berhasil membatalkan perubahan, dan transaksi pendaftaran yang gagal karena foreign key dibatalkan seluruhnya. Ini membuktikan sifat ACID: atomicity, consistency, isolation, dan durability. Pada praktikum terdistribusi, delapan pasien terbagi ke tiga site, yaitu empat di Denpasar, dua di Badung, dan dua di pusat. Hasil rekonstruksi sama persis dengan data asli, dengan selisih nol. Transaksi lintas site PSN10 tersimpan, PSN11 batal, dan replikasi dokter DOK04 sudah ada di semua site.

## d. Penutup (07:25 – 07:45)

[AKSI LAYAR: Kembali ke kamera wajah.]

> Demikian praktikum Tugas 3 Basis Data yang saya lakukan. Dari praktikum ini saya belajar bahwa transaksi menjaga data tetap konsisten, dan basis data terdistribusi membagi data ke beberapa lokasi tanpa kehilangan isi aslinya. Terima kasih kepada tutor yang telah membimbing. Om shanti shanti shanti om, terima kasih.
