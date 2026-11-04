# Tugas 3 Basis Data (STSI4105)

Praktikum **(a) Transaksi** dan **(b) Basis Data Terdistribusi** memakai database Tugas 2 `db_rumah_sakit`
(MySQL/MariaDB XAMPP + DBeaver). Diuji pada MariaDB 11.4 (semua script 00–11 berjalan tanpa error, dua kali berturut-turut).

## Isi folder `sql/`
| File | Isi |
|---|---|
| `00_reset_db_rumah_sakit.sql` | Membuat ulang `db_rumah_sakit` (sama dengan Tugas 2) supaya praktikum bisa diulang |
| `01_siapkan_database.sql` | Cek engine InnoDB, tambah pasien dari Denpasar/Badung |
| `02_transaksi_commit.sql` | `START TRANSACTION` ... `COMMIT` |
| `03_transaksi_rollback.sql` | `DELETE` lalu `ROLLBACK`, data kembali |
| `04_transaksi_savepoint.sql` | `SAVEPOINT` dan `ROLLBACK TO SAVEPOINT` |
| `05_autocommit.sql` | `SET autocommit = 0`, `ROLLBACK`/`COMMIT` manual |
| `06_transaksi_pendaftaran.sql` | Procedure `sp_daftar_pasien`: insert pasien + daftar + pasien_dokter dalam satu transaksi; kasus gagal FK (DOK99) otomatis ROLLBACK |
| `07_isolasi_dua_sesi.sql` | Panduan isolation level dengan dua tab DBeaver (READ COMMITTED, lock wait, dirty read READ UNCOMMITTED) |
| `08_terdistribusi_buat_site.sql` | Site `rs_denpasar`, `rs_badung`, `rs_pusat`; fragmentasi horizontal & vertikal tabel pasien |
| `09_terdistribusi_rekonstruksi.sql` | View global `UNION ALL` & `JOIN`, uji completeness/reconstruction/disjointness, query terdistribusi |
| `10_terdistribusi_transaksi_replikasi.sql` | Transaksi lintas site (COMMIT/ROLLBACK) dan replikasi tabel dokter dengan trigger |
| `11_opsional_federated.sql` | (Opsional) cek & contoh FEDERATED untuk dua server sungguhan |

## Pendekatan basis data terdistribusi
BMP MSIM4206 membahas basis data terdistribusi secara konsep (site, fragmentasi horizontal/vertikal, replikasi,
transparansi, transaksi terdistribusi). Untuk praktik dengan dua server MySQL dibutuhkan engine **FEDERATED**,
yang **nonaktif secara default** di MySQL dan XAMPP (di MariaDB uji, `SHOW ENGINES` tidak memuat FEDERATED).
Karena itu praktik utama memakai **simulasi di satu server**: setiap site = satu database terpisah, dan query lintas
database (`nama_db.nama_tabel`) berperan sebagai komunikasi antar-site. File 11 menunjukkan cara FEDERATED bila
tersedia dua server.

- **Horizontal** (per kota): `rs_denpasar.pasien` (alamat Denpasar), `rs_badung.pasien` (Badung), `rs_pusat.pasien` (sisanya).
- **Vertikal**: `rs_denpasar.pasien_identitas(id_pasien, nama_pasien, jenis_kelamin)` dan `rs_pusat.pasien_alamat(id_pasien, alamat_pasien)`.
- **Rekonstruksi**: `rs_pusat.v_pasien_global` (UNION ALL) dan `rs_pusat.v_pasien_vertikal` (JOIN).
- **Replikasi**: tabel `dokter` disalin ke `rs_denpasar` dan `rs_badung`; trigger `trg_replikasi_dokter` menyalin dokter baru.

## Cara menjalankan di DBeaver (Mac)
1. Start MySQL di XAMPP (manager-osx > Manage Servers > MySQL Database > Start).
2. DBeaver: connect `localhost:3306` user `root`.
3. **File > Open File...** pilih `sql/00_reset_db_rumah_sakit.sql`, pilih koneksi localhost di toolbar (Active datasource).
4. Jalankan seluruh isi dengan **Execute SQL Script** (`Option+X` di Mac, ikon kertas dengan panah). Hasil SELECT muncul sebagai tab-tab di panel Results.
5. Ulangi langkah 3–4 berurutan untuk `01` sampai `10`. File `06` dan `10` memakai `DELIMITER $$`; DBeaver versi baru mendukungnya.
   Jika muncul error sintaks di procedure/trigger, blok bagian `CREATE PROCEDURE ... END$$` lalu jalankan dengan `Cmd+Enter`
   (tanpa baris `DELIMITER`).
6. Untuk `07` (isolasi): buka file di tab 1 (Sesi A) dan buat tab kedua **SQL Editor > New SQL script** (Sesi B).
   Di kedua tab ubah mode ke **Manual Commit** (ikon *Auto-Commit* di toolbar → *Manual*). Salin perintah berkomentar baris per baris
   dan jalankan dengan `Cmd+Enter` bergantian A/B sesuai urutan di file.
7. Klik kanan koneksi > **Refresh**: terlihat database `db_rumah_sakit`, `rs_denpasar`, `rs_badung`, `rs_pusat`.

Catatan: XAMPP Mac memakai MariaDB 10.4, jadi variabel isolasi = `@@tx_isolation`.
Di MySQL 8 pakai `@@transaction_isolation`.

## File lain
- `video-transcript.md`: naskah video (perkenalan, langkah praktik, hasil, penutup).
- `../Laporan Tugas 3 Basis Data (STSI4105).docx`: laporan.
