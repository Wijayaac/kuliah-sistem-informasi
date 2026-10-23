# Transkrip Video Tugas 2 Basis Data (STSI4105)

**Mahasiswa:** I Kadek Wijaya Sashmitha Adhi C · NIM 048068753 · Sistem Informasi
**Topik:** Implementasi ERD rumah sakit ke basis data MySQL (XAMPP) memakai DBeaver
**Perkiraan durasi:** ±9 menit 50 detik (rentang aman 9–10 menit) · **Jumlah kata yang diucapkan:** ±900 kata (dihitung dari teks ucapan saja, tempo ±115 kata/menit ditambah jeda aksi layar)

## Checklist sebelum merekam

- [ ] XAMPP Control Panel terbuka, modul **MySQL** sudah **Start** (port 3306).
- [ ] DBeaver terbuka dan koneksi `localhost:3306` user `root` sudah tersimpan dan bisa connect (Test Connection berhasil).
- [ ] Database `db_rumah_sakit` boleh sudah ada atau belum, karena script diawali `DROP DATABASE IF EXISTS`. Kalau ingin demo dari nol, hapus dulu lewat DBeaver lalu Refresh.
- [ ] File `tugas-2/sql/01_create_database.sql` sampai `04_verify.sql` sudah dibuka sebagai tab di DBeaver (File > Open File), atau siap dibuka.
- [ ] Gambar `tugas-2/tugas-2-erd.png` siap ditampilkan (misalnya di Preview atau di tab VS Code).
- [ ] Kamera menyala dan wajah terlihat, mikrofon dicek, notifikasi dimatikan.
- [ ] Font SQL Editor DBeaver diperbesar (Ctrl/Cmd + `+`) supaya kode terbaca di video.

---

## a. Perkenalan identitas (00:00 – 00:40)

[AKSI LAYAR: Kamera wajah tampil penuh atau di pojok layar. Di layar tampil DBeaver yang sudah terbuka.]

> Halo, assalamualaikum, om swastiastu, salam sejahtera untuk kita semua. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, dari program studi Sistem Informasi, Universitas Terbuka. Di video ini saya akan menunjukkan praktik Tugas 2 mata kuliah Basis Data, kode STSI4105. Tugasnya adalah membuat basis data di MySQL dari ERD rumah sakit yang ada di soal, dengan enam tabel, yaitu administrator, dokter, pasien, dokter_admin, daftar, dan pasien_dokter. Saya memakai MySQL dari XAMPP, dan untuk menjalankan perintah SQL-nya saya memakai aplikasi DBeaver.

## b. Langkah-langkah praktik

### b.1 Membaca ERD dan menentukan tabel (00:40 – 01:50)

[AKSI LAYAR: Buka gambar `tugas-2-erd.png`. Arahkan kursor berurutan ke kotak administrator, dokter, pasien, lalu ke kotak dokter_admin, daftar, dan pasien_dokter.]

> Sebelum mulai, saya lihat dulu ERD-nya. Di ERD ini ada tiga entitas utama, yaitu administrator, dokter, dan pasien. Lalu ada tiga kotak lagi yang menghubungkan entitas utama: dokter_admin menghubungkan administrator dengan dokter, untuk relasi memberikan dan menyimpan data dokter. Tabel daftar menghubungkan administrator dengan pasien, untuk relasi melayani pendaftaran. Dan pasien_dokter menghubungkan dokter dengan pasien, untuk relasi memeriksa.
>
> Cara saya mengubahnya ke tabel: setiap kotak saya jadikan satu tabel, setiap elips saya jadikan kolom, dan atribut id milik kotak itu sendiri saya jadikan primary key. Jadi id_admin untuk administrator, id_dokter untuk dokter, id_pasien untuk pasien, lalu id_data, id_daftar, dan id untuk tiga tabel penghubung. Sedangkan id yang berasal dari entitas lain, misalnya id_admin dan id_dokter di tabel dokter_admin, saya jadikan foreign key.

### b.2 Koneksi DBeaver ke MySQL XAMPP (01:50 – 02:30)

[AKSI LAYAR: Tampilkan XAMPP Control Panel dengan MySQL berstatus running. Pindah ke DBeaver, klik koneksi `localhost` di Database Navigator sampai terhubung (ikon centang hijau). Klik kanan koneksi > SQL Editor > Open SQL script, atau buka tab `01_create_database.sql`.]

> Pertama, di XAMPP Control Panel saya pastikan MySQL sudah jalan. Kemudian di DBeaver saya connect ke localhost port 3306 dengan user root. Sudah terhubung. Script SQL-nya saya pecah menjadi empat file supaya mudah dijelaskan: 01 untuk membuat database, 02 untuk membuat tabel, 03 untuk mengisi data, dan 04 untuk verifikasi. Ada juga file 00_all_in_one yang isinya gabungan keempat file itu.

### b.3 Membuat database (02:30 – 03:10)

[AKSI LAYAR: Di tab `01_create_database.sql`, sorot baris `DROP DATABASE`, `CREATE DATABASE`, `USE`. Tekan Alt+X (Execute SQL Script). Tunjukkan panel Statistics/Output tanpa error.]

> Di file pertama ada tiga perintah. DROP DATABASE IF EXISTS menghapus database lama kalau sudah ada, jadi script ini aman dijalankan ulang. CREATE DATABASE db_rumah_sakit membuat databasenya dengan character set utf8mb4. Lalu USE db_rumah_sakit untuk memilih database itu. Saya jalankan dengan Execute SQL Script, Alt+X. Berhasil, tidak ada error.

### b.4 Membuat enam tabel (03:10 – 05:20)

[AKSI LAYAR: Buka tab `02_create_tables.sql`. Scroll pelan dari atas: blok `administrator`, `dokter`, `pasien`, lalu `dokter_admin`, `daftar`, `pasien_dokter`. Sorot kata `VARCHAR(10)`, `DATE`, `ENUM('L','P')`, `AUTO_INCREMENT`, `DATETIME`, `TEXT`, lalu baris `CONSTRAINT ... FOREIGN KEY ... ON UPDATE CASCADE ON DELETE RESTRICT`. Tekan Alt+X.]

> Sekarang file kedua, membuat tabel. Tabel entitas utama saya buat lebih dulu, karena tabel penghubung nanti merujuk ke tabel-tabel ini.
>
> Tabel administrator berisi id_admin, nama_admin, dan waktu_jaga. Tabel dokter berisi id_dokter, nama_dokter, tanggal_lahir, alamat_dokter, no_hp, spesialis, dan waktu_kerja. Tabel pasien berisi id_pasien, nama_pasien, alamat_pasien, dan jenis_kelamin. Semua nama kolom saya samakan persis dengan ERD.
>
> Untuk tipe data, karena di ERD tidak ditulis, saya pilih sesuai isinya. ID entitas utama memakai VARCHAR sepuluh, karena isinya kode seperti ADM01, DOK01, dan PSN01. Tanggal lahir memakai DATE. No HP saya simpan sebagai VARCHAR, bukan angka, supaya angka nol di depan tidak hilang. Jenis kelamin memakai ENUM L dan P, jadi hanya dua nilai itu yang bisa masuk. Kolom-kolomnya saya beri NOT NULL supaya wajib diisi.
>
> Lalu tiga tabel penghubung. Primary key-nya memakai INT AUTO_INCREMENT, jadi nomornya terisi otomatis. Di setiap tabel penghubung ada dua foreign key. Contohnya di tabel daftar, id_admin merujuk ke tabel administrator dan id_pasien merujuk ke tabel pasien. Di tabel pasien_dokter ada tambahan kolom waktu_periksa bertipe DATETIME dan resep bertipe TEXT, karena resep bisa panjang dan boleh kosong.
>
> Foreign key-nya saya beri aturan ON UPDATE CASCADE dan ON DELETE RESTRICT. Artinya kalau ID di tabel induk diubah, perubahannya ikut ke tabel penghubung. Tapi data induk yang masih dipakai tidak boleh dihapus, misalnya dokter yang masih punya riwayat pemeriksaan. Semua tabel memakai engine InnoDB karena engine ini mendukung foreign key. Saya jalankan, Alt+X. Berhasil.

### b.5 Mengisi data contoh (05:20 – 06:10)

[AKSI LAYAR: Buka tab `03_insert_data.sql`, scroll pelan. Tekan Alt+X. Tunjukkan di panel hasil bahwa setiap INSERT memberi 3 baris (Updated Rows = 3).]

> File ketiga untuk mengisi data contoh. Urutannya juga dimulai dari tabel induk: tiga administrator, tiga dokter, dan tiga pasien. Setelah itu baru tabel penghubung, masing-masing tiga baris. Kolom ID tabel penghubung tidak saya isi, karena sudah AUTO_INCREMENT. Saya jalankan. Setiap perintah INSERT berhasil memasukkan tiga baris.

### b.6 Verifikasi (06:10 – 07:50)

[AKSI LAYAR: Buka tab `04_verify.sql`, tekan Alt+X. Klik tab hasil satu per satu: hasil `SHOW TABLES`, beberapa hasil `DESCRIBE` (misalnya `dokter` dan `pasien_dokter`, tunjuk kolom Key berisi PRI dan MUL), lalu tiga hasil query `SELECT ... JOIN`.]

> File keempat untuk mengecek hasilnya. SHOW TABLES menampilkan enam tabel: administrator, daftar, dokter, dokter_admin, pasien, dan pasien_dokter. Jadi semua tabel yang diminta soal sudah ada.
>
> Lalu DESCRIBE untuk melihat struktur setiap tabel. Contohnya tabel dokter, tipe datanya sesuai dengan yang saya buat, dan kolom id_dokter bertanda PRI, artinya primary key. Di tabel pasien_dokter, kolom id_dokter dan id_pasien bertanda MUL, yaitu kolom foreign key yang diindeks.
>
> Terakhir ada tiga query JOIN. Query pertama menggabungkan pasien_dokter dengan pasien dan dokter, jadi kelihatan pasien mana diperiksa dokter siapa, kapan, dan resepnya apa. Query kedua menampilkan pendaftaran pasien beserta nama admin yang melayani. Query ketiga menampilkan data dokter yang disimpan oleh admin. Masing-masing menghasilkan tiga baris. Ini membuktikan relasi antar tabel sudah bisa dipakai untuk mengambil informasi.

### b.7 ER Diagram di DBeaver dan uji foreign key (07:50 – 08:50)

[AKSI LAYAR: Di Database Navigator klik kanan koneksi > Refresh. Buka `db_rumah_sakit` > Tables untuk menunjukkan 6 tabel. Klik kanan `db_rumah_sakit` > View Diagram, tunggu diagram tampil, arahkan kursor ke garis relasi. Lalu buka SQL Editor baru, ketik dan jalankan (Ctrl+Enter): `INSERT INTO daftar (id_admin, id_pasien) VALUES ('ADM09','PSN01');` Tunjukkan pesan error.]

> Sekarang saya refresh DBeaver. Di database db_rumah_sakit sudah ada enam tabel. Saya klik kanan databasenya, lalu View Diagram. DBeaver menggambar ER Diagram langsung dari database. Bisa dilihat garis relasinya: dokter_admin terhubung ke administrator dan dokter, daftar ke administrator dan pasien, dan pasien_dokter ke dokter dan pasien. Bentuknya sama dengan ERD di soal.
>
> Terakhir saya coba uji foreign key. Saya masukkan pendaftaran dengan id_admin ADM09, padahal admin itu tidak ada. Hasilnya error 1452, cannot add or update a child row, a foreign key constraint fails. Jadi database menolak data yang tidak punya induk, dan integritas datanya terjaga.

## c. Hasil praktik (08:50 – 09:30)

[AKSI LAYAR: Kembali ke tampilan ER Diagram atau daftar 6 tabel di Database Navigator. Kamera wajah tetap terlihat.]

> Jadi hasil praktik saya: database db_rumah_sakit berhasil dibuat di MySQL XAMPP dengan enam tabel sesuai ERD. Setiap tabel punya primary key, tiga tabel penghubung masing-masing punya dua foreign key, sehingga totalnya enam foreign key. Setiap tabel sudah terisi tiga baris data contoh, query JOIN berhasil menampilkan data gabungan, dan foreign key terbukti menolak data yang tidak valid.

## d. Penutup (09:30 – 09:50)

[AKSI LAYAR: Kamera wajah di tengah atau diperbesar.]

> Sekian video praktik Tugas 2 Basis Data dari saya. Mohon maaf kalau ada kekurangan dalam penjelasan. Terima kasih atas perhatiannya, wassalamualaikum, om shanti shanti shanti om, salam sejahtera.
