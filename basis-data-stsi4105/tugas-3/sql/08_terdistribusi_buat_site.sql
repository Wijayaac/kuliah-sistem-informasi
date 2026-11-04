-- 08. Basis data terdistribusi (simulasi di satu server MySQL/MariaDB)
--     Setiap "site" = satu database terpisah:
--       rs_denpasar : site RS cabang Denpasar
--       rs_badung   : site RS cabang Badung
--       rs_pusat    : site kantor pusat (pasien di luar Bali + data rekam medis)
--     db_rumah_sakit (Tugas 2) dipakai sebagai sumber relasi global.
DROP DATABASE IF EXISTS rs_denpasar;
DROP DATABASE IF EXISTS rs_badung;
DROP DATABASE IF EXISTS rs_pusat;
CREATE DATABASE rs_denpasar CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE DATABASE rs_badung   CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE DATABASE rs_pusat    CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- ===== A. Fragmentasi HORIZONTAL tabel pasien (berdasarkan kota) =====
-- F1 = sigma alamat LIKE '%Denpasar%'                      (pasien)
-- F2 = sigma alamat LIKE '%Badung%'                        (pasien)
-- F3 = sigma alamat NOT LIKE '%Denpasar%' AND NOT LIKE '%Badung%' (pasien)
CREATE TABLE rs_denpasar.pasien LIKE db_rumah_sakit.pasien;
CREATE TABLE rs_badung.pasien   LIKE db_rumah_sakit.pasien;
CREATE TABLE rs_pusat.pasien    LIKE db_rumah_sakit.pasien;

INSERT INTO rs_denpasar.pasien
  SELECT * FROM db_rumah_sakit.pasien WHERE alamat_pasien LIKE '%Denpasar%';
INSERT INTO rs_badung.pasien
  SELECT * FROM db_rumah_sakit.pasien WHERE alamat_pasien LIKE '%Badung%';
INSERT INTO rs_pusat.pasien
  SELECT * FROM db_rumah_sakit.pasien
  WHERE alamat_pasien NOT LIKE '%Denpasar%' AND alamat_pasien NOT LIKE '%Badung%';

-- ===== B. Fragmentasi VERTIKAL tabel pasien =====
-- V1 = pi id_pasien, nama_pasien, jenis_kelamin (pasien) -> rs_denpasar (loket pendaftaran)
-- V2 = pi id_pasien, alamat_pasien (pasien)              -> rs_pusat (data kontak/alamat)
-- Primary key id_pasien diulang di setiap fragmen agar bisa direkonstruksi dengan JOIN.
CREATE TABLE rs_denpasar.pasien_identitas (
  id_pasien      VARCHAR(10)   NOT NULL,
  nama_pasien    VARCHAR(100)  NOT NULL,
  jenis_kelamin  ENUM('L','P') NOT NULL,
  PRIMARY KEY (id_pasien)
) ENGINE=InnoDB;

CREATE TABLE rs_pusat.pasien_alamat (
  id_pasien      VARCHAR(10)   NOT NULL,
  alamat_pasien  VARCHAR(255)  NOT NULL,
  PRIMARY KEY (id_pasien)
) ENGINE=InnoDB;

INSERT INTO rs_denpasar.pasien_identitas
  SELECT id_pasien, nama_pasien, jenis_kelamin FROM db_rumah_sakit.pasien;
INSERT INTO rs_pusat.pasien_alamat
  SELECT id_pasien, alamat_pasien FROM db_rumah_sakit.pasien;

-- Isi setiap site
SELECT 'rs_denpasar' AS site, p.* FROM rs_denpasar.pasien p
UNION ALL SELECT 'rs_badung', p.* FROM rs_badung.pasien p
UNION ALL SELECT 'rs_pusat',  p.* FROM rs_pusat.pasien p;

SELECT * FROM rs_denpasar.pasien_identitas;
SELECT * FROM rs_pusat.pasien_alamat;
