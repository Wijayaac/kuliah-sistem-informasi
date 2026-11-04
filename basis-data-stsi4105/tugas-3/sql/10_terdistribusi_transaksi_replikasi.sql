-- 10. Transaksi terdistribusi & replikasi (simulasi)
-- A. Satu transaksi yang mengubah beberapa site sekaligus.
--    Pasien baru dari Badung: masuk fragmen horizontal rs_badung,
--    fragmen vertikal rs_denpasar & rs_pusat. Semua COMMIT bersama
--    atau ROLLBACK bersama (atomicity antar-site; konsep two-phase commit).
START TRANSACTION;
  INSERT INTO rs_badung.pasien VALUES ('PSN10', 'Putu Eka', 'Jl. Raya Sempidi No. 5, Badung', 'P');
  INSERT INTO rs_denpasar.pasien_identitas VALUES ('PSN10', 'Putu Eka', 'P');
  INSERT INTO rs_pusat.pasien_alamat VALUES ('PSN10', 'Jl. Raya Sempidi No. 5, Badung');
COMMIT;

START TRANSACTION;
  INSERT INTO rs_badung.pasien VALUES ('PSN11', 'Kadek Uji', 'Jl. Raya Nusa Dua No. 1, Badung', 'L');
  INSERT INTO rs_denpasar.pasien_identitas VALUES ('PSN11', 'Kadek Uji', 'L');
  -- misalnya site pusat gagal / koneksi putus -> seluruh transaksi dibatalkan
ROLLBACK;

SELECT id_pasien, site FROM rs_pusat.v_pasien_global WHERE id_pasien IN ('PSN10','PSN11');
SELECT * FROM rs_pusat.v_pasien_vertikal WHERE id_pasien IN ('PSN10','PSN11');

-- B. Replikasi tabel dokter (data master) ke setiap site
CREATE TABLE IF NOT EXISTS rs_denpasar.dokter LIKE db_rumah_sakit.dokter;
CREATE TABLE IF NOT EXISTS rs_badung.dokter   LIKE db_rumah_sakit.dokter;
REPLACE INTO rs_denpasar.dokter SELECT * FROM db_rumah_sakit.dokter;
REPLACE INTO rs_badung.dokter   SELECT * FROM db_rumah_sakit.dokter;

-- Trigger: setiap dokter baru di pusat otomatis disalin ke replika (sinkron)
DROP TRIGGER IF EXISTS db_rumah_sakit.trg_replikasi_dokter;
DELIMITER $$
CREATE TRIGGER db_rumah_sakit.trg_replikasi_dokter
AFTER INSERT ON db_rumah_sakit.dokter
FOR EACH ROW
BEGIN
  INSERT INTO rs_denpasar.dokter VALUES (NEW.id_dokter, NEW.nama_dokter, NEW.tanggal_lahir,
    NEW.alamat_dokter, NEW.no_hp, NEW.spesialis, NEW.waktu_kerja);
  INSERT INTO rs_badung.dokter VALUES (NEW.id_dokter, NEW.nama_dokter, NEW.tanggal_lahir,
    NEW.alamat_dokter, NEW.no_hp, NEW.spesialis, NEW.waktu_kerja);
END$$
DELIMITER ;

INSERT INTO db_rumah_sakit.dokter VALUES
  ('DOK04', 'dr. Ayu Pramesti', '1990-05-14', 'Jl. Raya Kuta No. 30, Badung',
   '081234567804', 'Kulit', 'Senin-Jumat 08:00-14:00');

SELECT 'db_rumah_sakit' AS site, COUNT(*) AS jumlah_dokter FROM db_rumah_sakit.dokter
UNION ALL SELECT 'rs_denpasar', COUNT(*) FROM rs_denpasar.dokter
UNION ALL SELECT 'rs_badung',   COUNT(*) FROM rs_badung.dokter;
SELECT id_dokter, nama_dokter, spesialis FROM rs_badung.dokter ORDER BY id_dokter;
