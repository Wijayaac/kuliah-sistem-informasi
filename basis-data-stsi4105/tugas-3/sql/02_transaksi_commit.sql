-- 02. Transaksi dengan START TRANSACTION ... COMMIT
USE db_rumah_sakit;

-- Cek mode autocommit (1 = setiap perintah langsung permanen)
SELECT @@autocommit AS autocommit;

START TRANSACTION;
  UPDATE administrator SET waktu_jaga = 'Pagi (06:00-13:00)' WHERE id_admin = 'ADM01';
  INSERT INTO dokter_admin (id_admin, id_dokter) VALUES ('ADM03', 'DOK01');
  -- Di dalam transaksi, perubahan sudah terlihat oleh sesi ini
  SELECT id_admin, nama_admin, waktu_jaga FROM administrator WHERE id_admin = 'ADM01';
COMMIT;

-- Setelah COMMIT perubahan bersifat permanen (Durability)
SELECT id_admin, nama_admin, waktu_jaga FROM administrator WHERE id_admin = 'ADM01';
SELECT * FROM dokter_admin ORDER BY id_data;
