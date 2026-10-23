-- 04. Cek hasil
USE db_rumah_sakit;

SHOW TABLES;

DESCRIBE administrator;
DESCRIBE dokter;
DESCRIBE pasien;
DESCRIBE dokter_admin;
DESCRIBE daftar;
DESCRIBE pasien_dokter;

-- Pasien yang diperiksa dokter
SELECT pd.id, p.nama_pasien, d.nama_dokter, d.spesialis, pd.waktu_periksa, pd.resep
FROM pasien_dokter pd
JOIN pasien p ON p.id_pasien = pd.id_pasien
JOIN dokter d ON d.id_dokter = pd.id_dokter;

-- Pendaftaran pasien oleh admin
SELECT df.id_daftar, a.nama_admin, p.nama_pasien
FROM daftar df
JOIN administrator a ON a.id_admin = df.id_admin
JOIN pasien p ON p.id_pasien = df.id_pasien;

-- Data dokter yang disimpan admin
SELECT da.id_data, a.nama_admin, d.nama_dokter
FROM dokter_admin da
JOIN administrator a ON a.id_admin = da.id_admin
JOIN dokter d ON d.id_dokter = da.id_dokter;
