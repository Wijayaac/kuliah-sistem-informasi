-- Tugas 3 Basis Data (STSI4105)
-- 01. Cek engine InnoDB + tambah data pasien Bali
--     Jalankan setelah 00_reset_db_rumah_sakit.sql.
USE db_rumah_sakit;

-- Pastikan tabel memakai InnoDB (engine yang mendukung transaksi)
SELECT TABLE_NAME, ENGINE
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'db_rumah_sakit'
ORDER BY TABLE_NAME;

-- Data pasien tambahan dari Bali untuk praktikum terdistribusi
INSERT INTO pasien (id_pasien, nama_pasien, alamat_pasien, jenis_kelamin) VALUES
  ('PSN04', 'Ni Luh Sari',      'Jl. Raya Kuta No. 12, Badung',      'P'),
  ('PSN05', 'I Gede Arya',      'Jl. Hayam Wuruk No. 20, Denpasar',  'L'),
  ('PSN06', 'Komang Ayu Dewi',  'Jl. Raya Mengwi No. 4, Badung',     'P');

INSERT INTO daftar (id_admin, id_pasien) VALUES
  ('ADM01', 'PSN04'), ('ADM02', 'PSN05'), ('ADM03', 'PSN06');

INSERT INTO pasien_dokter (id_dokter, id_pasien, waktu_periksa, resep) VALUES
  ('DOK01', 'PSN04', '2026-10-18 09:00:00', 'Vitamin C 500mg 1x1'),
  ('DOK03', 'PSN05', '2026-10-18 15:30:00', 'Antasida 3x1'),
  ('DOK02', 'PSN06', '2026-10-18 10:00:00', 'Ibuprofen 200mg 2x1');

SELECT * FROM pasien ORDER BY id_pasien;
