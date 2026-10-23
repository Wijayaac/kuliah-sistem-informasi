-- 02. Buat tabel sesuai ERD
USE db_rumah_sakit;

-- Entitas: administrator
CREATE TABLE administrator (
  id_admin    VARCHAR(10)  NOT NULL,
  nama_admin  VARCHAR(100) NOT NULL,
  waktu_jaga  VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id_admin)
) ENGINE=InnoDB;

-- Entitas: dokter
CREATE TABLE dokter (
  id_dokter      VARCHAR(10)  NOT NULL,
  nama_dokter    VARCHAR(100) NOT NULL,
  tanggal_lahir  DATE         NOT NULL,
  alamat_dokter  VARCHAR(255) NOT NULL,
  no_hp          VARCHAR(15)  NOT NULL,
  spesialis      VARCHAR(50)  NOT NULL,
  waktu_kerja    VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id_dokter)
) ENGINE=InnoDB;

-- Entitas: pasien
CREATE TABLE pasien (
  id_pasien      VARCHAR(10)   NOT NULL,
  nama_pasien    VARCHAR(100)  NOT NULL,
  alamat_pasien  VARCHAR(255)  NOT NULL,
  jenis_kelamin  ENUM('L','P') NOT NULL,
  PRIMARY KEY (id_pasien)
) ENGINE=InnoDB;

-- Relasi: administrator memberikan data / menyimpan data dokter
CREATE TABLE dokter_admin (
  id_data    INT         NOT NULL AUTO_INCREMENT,
  id_admin   VARCHAR(10) NOT NULL,
  id_dokter  VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_data),
  CONSTRAINT fk_dokter_admin_admin  FOREIGN KEY (id_admin)
    REFERENCES administrator (id_admin) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_dokter_admin_dokter FOREIGN KEY (id_dokter)
    REFERENCES dokter (id_dokter)       ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Relasi: administrator melayani pendaftaran pasien
CREATE TABLE daftar (
  id_daftar  INT         NOT NULL AUTO_INCREMENT,
  id_admin   VARCHAR(10) NOT NULL,
  id_pasien  VARCHAR(10) NOT NULL,
  PRIMARY KEY (id_daftar),
  CONSTRAINT fk_daftar_admin  FOREIGN KEY (id_admin)
    REFERENCES administrator (id_admin) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_daftar_pasien FOREIGN KEY (id_pasien)
    REFERENCES pasien (id_pasien)       ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Relasi: dokter memeriksa pasien
CREATE TABLE pasien_dokter (
  id             INT         NOT NULL AUTO_INCREMENT,
  id_dokter      VARCHAR(10) NOT NULL,
  id_pasien      VARCHAR(10) NOT NULL,
  waktu_periksa  DATETIME    NOT NULL,
  resep          TEXT,
  PRIMARY KEY (id),
  CONSTRAINT fk_pasien_dokter_dokter FOREIGN KEY (id_dokter)
    REFERENCES dokter (id_dokter) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pasien_dokter_pasien FOREIGN KEY (id_pasien)
    REFERENCES pasien (id_pasien) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
