-- 11. (OPSIONAL) FEDERATED engine untuk dua server MySQL sungguhan.
--     Engine FEDERATED biasanya NONAKTIF secara default di MySQL/XAMPP,
--     karena itu praktikum utama memakai simulasi multi-database (08-10).
SHOW ENGINES;   -- cek baris FEDERATED: YES / NO / tidak ada

-- MariaDB/XAMPP (jika plugin tersedia):  INSTALL SONAME 'ha_federatedx';
-- MySQL: tambahkan "federated" di my.cnf bagian [mysqld], lalu restart server.
--
-- Contoh di server B (misal 192.168.1.20) menautkan tabel pasien di server A:
-- CREATE TABLE pasien_denpasar_remote (
--   id_pasien VARCHAR(10) NOT NULL, nama_pasien VARCHAR(100) NOT NULL,
--   alamat_pasien VARCHAR(255) NOT NULL, jenis_kelamin ENUM('L','P') NOT NULL,
--   PRIMARY KEY (id_pasien)
-- ) ENGINE=FEDERATED
--   CONNECTION='mysql://user_rs:password@192.168.1.10:3306/rs_denpasar/pasien';
