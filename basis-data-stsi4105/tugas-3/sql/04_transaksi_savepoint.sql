-- 04. SAVEPOINT dan ROLLBACK TO SAVEPOINT
USE db_rumah_sakit;

START TRANSACTION;
  INSERT INTO pasien (id_pasien, nama_pasien, alamat_pasien, jenis_kelamin)
  VALUES ('PSN07', 'Wayan Putra', 'Jl. Gatot Subroto No. 9, Denpasar', 'L');
  SAVEPOINT sp_pasien;

  INSERT INTO daftar (id_admin, id_pasien) VALUES ('ADM01', 'PSN07');
  SAVEPOINT sp_daftar;

  -- Salah input dokter/resep, dibatalkan sampai sp_daftar saja
  INSERT INTO pasien_dokter (id_dokter, id_pasien, waktu_periksa, resep)
  VALUES ('DOK02', 'PSN07', '2026-10-19 08:00:00', 'Resep salah');
  SELECT id_dokter, id_pasien, resep FROM pasien_dokter WHERE id_pasien = 'PSN07';

  ROLLBACK TO SAVEPOINT sp_daftar;

  -- Input ulang yang benar
  INSERT INTO pasien_dokter (id_dokter, id_pasien, waktu_periksa, resep)
  VALUES ('DOK03', 'PSN07', '2026-10-19 08:00:00', 'Loratadine 10mg 1x1');
COMMIT;

-- Pasien dan pendaftaran tersimpan, resep salah tidak ada
SELECT p.id_pasien, p.nama_pasien, df.id_admin, pd.id_dokter, pd.resep
FROM pasien p
JOIN daftar df ON df.id_pasien = p.id_pasien
JOIN pasien_dokter pd ON pd.id_pasien = p.id_pasien
WHERE p.id_pasien = 'PSN07';
