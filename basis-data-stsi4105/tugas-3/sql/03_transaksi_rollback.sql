-- 03. Transaksi dibatalkan dengan ROLLBACK
USE db_rumah_sakit;

SELECT COUNT(*) AS jumlah_resep_sebelum FROM pasien_dokter;

START TRANSACTION;
  -- Simulasi kesalahan: semua resep terhapus tidak sengaja
  DELETE FROM pasien_dokter;
  SELECT COUNT(*) AS jumlah_resep_di_dalam_transaksi FROM pasien_dokter;
ROLLBACK;

-- Data kembali seperti semula (Atomicity)
SELECT COUNT(*) AS jumlah_resep_sesudah_rollback FROM pasien_dokter;
