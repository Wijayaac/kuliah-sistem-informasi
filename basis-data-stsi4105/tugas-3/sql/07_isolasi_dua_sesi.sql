-- 07. Isolation level (dijalankan di DUA sesi/tab DBeaver)
--     DBeaver: tab ke-2 dibuka dengan SQL Editor > New script, lalu pastikan
--     mode transaksi Manual Commit (ikon "Auto-commit" dimatikan) di kedua tab
--     dan "Open separate connection for each editor" aktif (default).
USE db_rumah_sakit;

SELECT @@tx_isolation AS level_isolasi;  -- default InnoDB: REPEATABLE-READ
-- (MySQL 8 / MariaDB 11.1+: SELECT @@transaction_isolation;)

-- ===== SESI A (tab 1) =====
-- SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- START TRANSACTION;
-- UPDATE pasien SET nama_pasien = 'Putri Ayu Lestari' WHERE id_pasien = 'PSN02';
--   (belum COMMIT)

-- ===== SESI B (tab 2) =====
-- SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- SELECT nama_pasien FROM pasien WHERE id_pasien = 'PSN02';
--   -> masih 'Putri Ayu' (tidak ada dirty read)
-- UPDATE pasien SET alamat_pasien = 'Denpasar' WHERE id_pasien = 'PSN02';
--   -> MENUNGGU (baris dikunci sesi A) sampai A COMMIT/ROLLBACK
--      atau timeout ERROR 1205 (innodb_lock_wait_timeout)

-- ===== SESI A =====
-- ROLLBACK;   (atau COMMIT)

-- ===== Percobaan READ UNCOMMITTED (dirty read) =====
-- Sesi B: SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
-- Sesi A: START TRANSACTION; UPDATE pasien SET nama_pasien='COBA' WHERE id_pasien='PSN02';
-- Sesi B: SELECT nama_pasien FROM pasien WHERE id_pasien='PSN02';  -> 'COBA' (dirty read)
-- Sesi A: ROLLBACK;
-- Sesi B: SELECT lagi -> kembali 'Putri Ayu'
