-- Tugas 2 Basis Data (STSI4105)
-- 01. Buat database
DROP DATABASE IF EXISTS db_rumah_sakit;
CREATE DATABASE db_rumah_sakit
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE db_rumah_sakit;
-- 02. Buat tabel sesuai ERD
USE db_rumah_sakit;

-- Entitas: administrator
CREATE TABLE administrator (
  id_admin    VARCHAR(10)  NOT NULL,
  nama_admin  VARCHAR(100) NOT NULL,
  waktu_jaga  VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id_admin)
) ENGINE=InnoDB;

-- Entitas: dokter
CREATE TABLE dokter (
  id_dokter      VARCHAR(10)  NOT NULL,
  nama_dokter    VARCHAR(100) NOT NULL,
  tanggal_lahir  DATE         NOT NULL,
  alamat_dokter  VARCHAR(255) NOT NULL,
  no_hp          VARCHAR(15)  NOT NULL,
  spesialis      VARCHAR(50)  NOT NULL,
  waktu_kerja    VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id_dokter)
) ENGINE=InnoDB;

-- Entitas: pasien
CREATE TABLE pasien (
  id_pasien      VARCHAR(10)   NOT NULL,
  nama_pasien    VARCHAR(100)  NOT NULL,
  alamat_pasien  VARCHAR(255)  NOT NULL,
  jenis_kelamin  ENUM('L','P') NOT NULL,
  PRIMARY KEY (id_pasien)
) ENGINE=InnoDB;

-- Relasi: administrator memberikan data / menyimpan data dokter
CREATE TABLE dokter_admin (
  id_data    INT         NOT NULL AUTO_INCREMENT,
  id_admin   VARCHAR(10) NOT NULL,
  id_dokter  VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_data),
  CONSTRAINT fk_dokter_admin_admin  FOREIGN KEY (id_admin)
    REFERENCES administrator (id_admin) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_dokter_admin_dokter FOREIGN KEY (id_dokter)
    REFERENCES dokter (id_dokter)       ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Relasi: administrator melayani pendaftaran pasien
CREATE TABLE daftar (
  id_daftar  INT         NOT NULL AUTO_INCREMENT,
  id_admin   VARCHAR(10) NOT NULL,
  id_pasien  VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_daftar),
  CONSTRAINT fk_daftar_admin  FOREIGN KEY (id_admin)
    REFERENCES administrator (id_admin) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_daftar_pasien FOREIGN KEY (id_pasien)
    REFERENCES pasien (id_pasien)       ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Relasi: dokter memeriksa pasien
CREATE TABLE pasien_dokter (
  id             INT         NOT NULL AUTO_INCREMENT,
  id_dokter      VARCHAR(10) NOT NULL,
  id_pasien      VARCHAR(10) NOT NULL,
  waktu_periksa  DATETIME    NOT NULL,
  resep          TEXT,
  PRIMARY KEY (id),
  CONSTRAINT fk_pasien_dokter_dokter FOREIGN KEY (id_dokter)
    REFERENCES dokter (id_dokter) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pasien_dokter_pasien FOREIGN KEY (id_pasien)
    REFERENCES pasien (id_pasien) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
-- 03. Data contoh
USE db_rumah_sakit;

INSERT INTO administrator (id_admin, nama_admin, waktu_jaga) VALUES
  ('ADM01', 'Siti Rahma',   'Pagi (07:00-14:00)'),
  ('ADM02', 'Budi Santoso', 'Siang (14:00-21:00)'),
  ('ADM03', 'Dewi Lestari', 'Malam (21:00-07:00)');

INSERT INTO dokter (id_dokter, nama_dokter, tanggal_lahir, alamat_dokter, no_hp, spesialis, waktu_kerja) VALUES
  ('DOK01', 'dr. Andi Wijaya',     '1980-03-12', 'Jl. Sudirman No. 10, Jakarta', '081234567801', 'Umum',    'Senin-Rabu 08:00-14:00'),
  ('DOK02', 'dr. Rina Kartika',    '1985-07-25', 'Jl. Diponegoro No. 5, Bandung', '081234567802', 'Anak',    'Kamis-Sabtu 08:00-14:00'),
  ('DOK03', 'dr. Made Suardana',   '1978-11-02', 'Jl. Teuku Umar No. 8, Denpasar', '081234567803', 'Penyakit Dalam', 'Senin-Jumat 14:00-20:00');

INSERT INTO pasien (id_pasien, nama_pasien, alamat_pasien, jenis_kelamin) VALUES
  ('PSN01', 'Ahmad Fauzi',    'Jl. Merdeka No. 1, Jakarta',  'L'),
  ('PSN02', 'Putri Ayu',      'Jl. Gajah Mada No. 3, Denpasar', 'P'),
  ('PSN03', 'Kevin Pratama',  'Jl. Asia Afrika No. 7, Bandung', 'L');

INSERT INTO dokter_admin (id_admin, id_dokter) VALUES
  ('ADM01', 'DOK01'),
  ('ADM01', 'DOK02'),
  ('ADM02', 'DOK03');

INSERT INTO daftar (id_admin, id_pasien) VALUES
  ('ADM01', 'PSN01'),
  ('ADM02', 'PSN02'),
  ('ADM03', 'PSN03');

INSERT INTO pasien_dokter (id_dokter, id_pasien, waktu_periksa, resep) VALUES
  ('DOK01', 'PSN01', '2026-10-17 09:00:00', 'Paracetamol 500mg 3x1'),
  ('DOK02', 'PSN02', '2026-10-17 10:30:00', 'Amoxicillin 250mg 3x1'),
  ('DOK03', 'PSN03', '2026-10-17 15:00:00', 'Omeprazole 20mg 1x1');
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
