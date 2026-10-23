# Tugas 2 Basis Data (STSI4105)

ERD: `tugas-2-erd.png`. Database: `db_rumah_sakit` (MySQL/MariaDB).

## Tabel
| Tabel | PK | FK |
|---|---|---|
| administrator | id_admin | - |
| dokter | id_dokter | - |
| pasien | id_pasien | - |
| dokter_admin | id_data | id_admin, id_dokter |
| daftar | id_daftar | id_admin, id_pasien |
| pasien_dokter | id | id_dokter, id_pasien |

## Cara jalankan di DBeaver
1. Connect ke MySQL (XAMPP: host `localhost`, port `3306`, user `root`).
2. Buka SQL Editor, jalankan file di `sql/` berurutan `01` sampai `04`
   (atau langsung `00_all_in_one.sql`) pakai **Execute SQL Script** (Alt+X).
3. Refresh koneksi, cek `db_rumah_sakit`. Lihat ER Diagram via klik kanan database > View Diagram.
