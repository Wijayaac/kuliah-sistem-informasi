-- 05. Mematikan autocommit
USE db_rumah_sakit;

SET autocommit = 0;
SELECT @@autocommit AS autocommit;

UPDATE dokter SET no_hp = '089999999999' WHERE id_dokter = 'DOK01';
SELECT id_dokter, no_hp FROM dokter WHERE id_dokter = 'DOK01';
ROLLBACK;   -- tanpa START TRANSACTION pun perubahan bisa dibatalkan
SELECT id_dokter, no_hp AS no_hp_setelah_rollback FROM dokter WHERE id_dokter = 'DOK01';

UPDATE dokter SET waktu_kerja = 'Senin-Kamis 08:00-14:00' WHERE id_dokter = 'DOK01';
COMMIT;     -- perubahan baru permanen setelah COMMIT

SET autocommit = 1;  -- kembalikan ke default
SELECT @@autocommit AS autocommit, id_dokter, waktu_kerja FROM dokter WHERE id_dokter = 'DOK01';
