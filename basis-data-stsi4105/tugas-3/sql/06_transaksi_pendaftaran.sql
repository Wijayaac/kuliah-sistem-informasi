-- 06. Transaksi pendaftaran pasien (pasien + daftar + pasien_dokter)
--     dalam stored procedure: semua berhasil -> COMMIT,
--     ada satu yang gagal (mis. error foreign key) -> ROLLBACK semua.
USE db_rumah_sakit;

DROP PROCEDURE IF EXISTS sp_daftar_pasien;

DELIMITER $$
CREATE PROCEDURE sp_daftar_pasien(
  IN p_id_pasien VARCHAR(10), IN p_nama VARCHAR(100), IN p_alamat VARCHAR(255),
  IN p_jk CHAR(1), IN p_id_admin VARCHAR(10), IN p_id_dokter VARCHAR(10),
  IN p_waktu DATETIME, IN p_resep TEXT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT CONCAT('GAGAL: transaksi ', p_id_pasien, ' di-ROLLBACK') AS status;
  END;

  START TRANSACTION;
    INSERT INTO pasien (id_pasien, nama_pasien, alamat_pasien, jenis_kelamin)
    VALUES (p_id_pasien, p_nama, p_alamat, p_jk);
    INSERT INTO daftar (id_admin, id_pasien) VALUES (p_id_admin, p_id_pasien);
    INSERT INTO pasien_dokter (id_dokter, id_pasien, waktu_periksa, resep)
    VALUES (p_id_dokter, p_id_pasien, p_waktu, p_resep);
  COMMIT;
  SELECT CONCAT('BERHASIL: transaksi ', p_id_pasien, ' di-COMMIT') AS status;
END$$
DELIMITER ;

-- Kasus 1: semua data valid -> COMMIT
CALL sp_daftar_pasien('PSN08', 'Made Rai', 'Jl. Imam Bonjol No. 3, Denpasar', 'L',
                      'ADM02', 'DOK03', '2026-10-20 09:00:00', 'Cetirizine 10mg 1x1');

-- Kasus 2: dokter DOK99 tidak ada -> error FK 1452 pada INSERT ketiga -> ROLLBACK
CALL sp_daftar_pasien('PSN09', 'Ketut Sudi', 'Jl. Raya Canggu No. 7, Badung', 'L',
                      'ADM01', 'DOK99', '2026-10-20 10:00:00', 'Paracetamol 500mg');

-- Bukti: PSN08 lengkap di 3 tabel, PSN09 tidak tersimpan sama sekali
SELECT 'pasien' AS tabel, id_pasien FROM pasien WHERE id_pasien IN ('PSN08','PSN09')
UNION ALL
SELECT 'daftar', id_pasien FROM daftar WHERE id_pasien IN ('PSN08','PSN09')
UNION ALL
SELECT 'pasien_dokter', id_pasien FROM pasien_dokter WHERE id_pasien IN ('PSN08','PSN09');

-- Versi manual (tanpa procedure) untuk melihat pesan error aslinya:
-- START TRANSACTION;
-- INSERT INTO pasien VALUES ('PSN09','Ketut Sudi','Jl. Raya Canggu No. 7, Badung','L');
-- INSERT INTO daftar (id_admin, id_pasien) VALUES ('ADM01','PSN09');
-- INSERT INTO pasien_dokter (id_dokter, id_pasien, waktu_periksa, resep)
--   VALUES ('DOK99','PSN09','2026-10-20 10:00:00','Paracetamol 500mg');  -- ERROR 1452
-- ROLLBACK;
