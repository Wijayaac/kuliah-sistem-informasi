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
