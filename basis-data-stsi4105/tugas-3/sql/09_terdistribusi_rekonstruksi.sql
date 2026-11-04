-- 09. Rekonstruksi fragmen + view global (transparansi lokasi)
USE rs_pusat;

-- Rekonstruksi fragmentasi horizontal: UNION ALL dari semua site
CREATE OR REPLACE VIEW v_pasien_global AS
  SELECT 'rs_denpasar' AS site, id_pasien, nama_pasien, alamat_pasien, jenis_kelamin FROM rs_denpasar.pasien
  UNION ALL
  SELECT 'rs_badung',  id_pasien, nama_pasien, alamat_pasien, jenis_kelamin FROM rs_badung.pasien
  UNION ALL
  SELECT 'rs_pusat',   id_pasien, nama_pasien, alamat_pasien, jenis_kelamin FROM rs_pusat.pasien;

-- Rekonstruksi fragmentasi vertikal: JOIN pada primary key
CREATE OR REPLACE VIEW v_pasien_vertikal AS
  SELECT i.id_pasien, i.nama_pasien, a.alamat_pasien, i.jenis_kelamin
  FROM rs_denpasar.pasien_identitas i
  JOIN rs_pusat.pasien_alamat a ON a.id_pasien = i.id_pasien;

SELECT * FROM v_pasien_global ORDER BY id_pasien;
SELECT * FROM v_pasien_vertikal ORDER BY id_pasien;

-- Uji kebenaran fragmentasi
-- 1) Completeness + disjointness: jumlah baris sama dan tidak ada id ganda
SELECT (SELECT COUNT(*) FROM db_rumah_sakit.pasien)            AS jumlah_asli,
       (SELECT COUNT(*) FROM v_pasien_global)                   AS jumlah_horizontal,
       (SELECT COUNT(DISTINCT id_pasien) FROM v_pasien_global)  AS id_unik_horizontal,
       (SELECT COUNT(*) FROM v_pasien_vertikal)                 AS jumlah_vertikal;

-- 2) Reconstruction: baris asli yang TIDAK sama dengan hasil rekonstruksi (harus 0)
SELECT COUNT(*) AS selisih_horizontal
FROM db_rumah_sakit.pasien p
WHERE NOT EXISTS (SELECT 1 FROM v_pasien_global g
                  WHERE g.id_pasien = p.id_pasien AND g.nama_pasien = p.nama_pasien
                    AND g.alamat_pasien = p.alamat_pasien AND g.jenis_kelamin = p.jenis_kelamin);
SELECT COUNT(*) AS selisih_vertikal
FROM db_rumah_sakit.pasien p
WHERE NOT EXISTS (SELECT 1 FROM v_pasien_vertikal v
                  WHERE v.id_pasien = p.id_pasien AND v.nama_pasien = p.nama_pasien
                    AND v.alamat_pasien = p.alamat_pasien AND v.jenis_kelamin = p.jenis_kelamin);

-- Query terdistribusi: gabung data pasien dari semua site dengan rekam periksa
SELECT g.site, g.nama_pasien, d.nama_dokter, pd.waktu_periksa, pd.resep
FROM v_pasien_global g
JOIN db_rumah_sakit.pasien_dokter pd ON pd.id_pasien = g.id_pasien
JOIN db_rumah_sakit.dokter d         ON d.id_dokter  = pd.id_dokter
ORDER BY g.site, pd.waktu_periksa;

-- Jumlah pasien per site
SELECT site, COUNT(*) AS jumlah_pasien FROM v_pasien_global GROUP BY site;
