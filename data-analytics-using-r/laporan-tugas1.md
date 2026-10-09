# Laporan Tugas Tutorial 1 Analisis dan Visualisasi Data (STSI4204)

- Nama: I KD WIJAYA SASHMITHA ADHI C
- NIM: 048068753
- Bahasa: R
- Tools: Visual Studio Code / RStudio, R (`Rscript`)
- Jawaban ringkas: [`tugas1-stsi4204.md`](./tugas1-stsi4204.md) · Kode: [`tugas1-stsi4204.R`](./tugas1-stsi4204.R)

---

## 1. Persiapan

### 1.1 Struktur folder

```text
data-analytics-using-r/
├── tugas1-stsi4204.R          kode R lengkap soal 1–3
├── tugas1-stsi4204.md         jawaban ringkas
├── laporan-tugas1.md          file ini (penjelasan + naskah video)
├── scatter-kecepatan-jarak.png   dibuat otomatis oleh script
└── histogram-kecepatan.png       dibuat otomatis oleh script
```

### 1.2 Cara menjalankan

```bash
cd data-analytics-using-r
Rscript tugas1-stsi4204.R
```

Atau buka file di RStudio / VS Code, lalu jalankan semua baris (Cmd/Ctrl + Shift + Enter) atau per baris (Cmd/Ctrl + Enter).

### 1.3 Alur kerja R

R adalah bahasa interpreter: tiap baris langsung dijalankan, tidak perlu dikompilasi.

```text
tugas1-stsi4204.R  --(R console / Rscript)-->  angka di console + gambar plot
```

- Baris yang hanya berisi ekspresi (mis. `mean(x)`) langsung dicetak hasilnya dengan awalan `[1]`.
- `plot()` / `hist()` membuka jendela grafik. Kalau lewat `Rscript`, grafik disimpan ke `Rplots.pdf`. Karena itu di akhir script, plot juga disimpan ke file PNG pakai `png()` … `dev.off()` untuk lampiran laporan.

### 1.4 Konsep dasar R yang dipakai

| Konsep | Contoh di kode | Penjelasan |
| ------ | -------------- | ---------- |
| Assignment | `x <- 5` | `<-` = simpan nilai ke variabel |
| Vector | `c(4, 4, 7)` | `c()` = combine, kumpulan nilai satu tipe |
| Data frame | `data.frame(kecepatan, jarak)` | tabel: tiap vector jadi 1 kolom, tiap indeks jadi 1 baris |
| Akses kolom | `mobil$jarak` | `$` = ambil kolom dari data frame |
| `str()` | `str(mobil)` | lihat struktur: jumlah baris, kolom, tipe data |
| `summary()` | `summary(mobil)` | ringkasan: min, Q1, median, mean, Q3, max |
| `mean()` / `median()` / `sd()` | `sd(mobil$jarak)` | rata-rata / nilai tengah / standar deviasi |
| `plot()` | `plot(x, y)` | scatter plot |
| `lm()` | `lm(jarak ~ kecepatan)` | regresi linear; `~` dibaca "jarak dipengaruhi kecepatan" |
| `abline()` | `abline(lm(...))` | gambar garis lurus di plot yang sedang aktif |
| `cor()` | `cor(x, y)` | koefisien korelasi (−1 sampai 1) |
| `hist()` | `hist(x)` | histogram |
| `cut()` + `table()` | `table(cut(x, breaks))` | bagi data ke kelas interval lalu hitung frekuensinya |
| `png()` / `dev.off()` | `png("a.png")` … `dev.off()` | buka file gambar, gambar plot ke file, lalu tutup file |

### 1.5 Rumus statistik yang dipakai

| Ukuran | Rumus | Arti |
| ------ | ----- | ---- |
| Rata-rata | \( \bar{x} = \frac{\sum x_i}{n} \) | jumlah semua data dibagi banyak data |
| Standar deviasi (sampel) | \( s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n - 1}} \) | rata-rata jarak data dari rata-ratanya |
| Koefisien keragaman | \( KK = \frac{s}{\bar{x}} \times 100\% \) | SD relatif terhadap rata-rata, satuannya % |
| Nilai baku | \( z = \frac{x - \bar{x}}{s} \) | posisi nilai dalam satuan SD dari rata-rata |

---

## 2. Soal 1 Rata-rata dan Standar Deviasi

### 2.1 Analisis soal

- Data: 50 mobil, tiap mobil punya **kecepatan** (km/h) dan **jarak** berhenti (meter).
- Diminta: (a) rata-rata kecepatan, (b) rata-rata jarak, (c) standar deviasi jarak.
- Strategi: masukkan data ke 2 vector, gabung jadi data frame `mobil`, lalu pakai fungsi bawaan `mean()` dan `sd()`.

### 2.2 Kode (baris 1–28)

```r
kecepatan <- c(4, 4, 7, 7, 8, 8, 9, 10, 10, 11,
               11, 12, 12, 12, 13, 13, 13, 13, 14, 14,
               14, 14, 15, 15, 15, 16, 16, 17, 17, 17,
               17, 17, 18, 18, 18, 19, 19, 20, 20, 20,
               20, 20, 21, 22, 23, 24, 24, 24, 25, 25)

jarak <- c(2, 10, 4, 20, 17, 13, 18, 28, 33, 18,
           26, 12, 24, 22, 28, 24, 32, 34, 43, 24,
           30, 58, 80, 20, 24, 55, 35, 40, 30, 44,
           50, 46, 53, 70, 80, 36, 46, 68, 34, 48,
           50, 56, 60, 64, 56, 72, 90, 92, 110, 85)

mobil <- data.frame(kecepatan, jarak)
str(mobil)
summary(mobil)

mean(mobil$kecepatan)   # a
mean(mobil$jarak)       # b
sd(mobil$jarak)         # c
```

### 2.3 Penjelasan per baris

| Baris | Kode | Penjelasan |
| ----- | ---- | ---------- |
| 4–8 | `kecepatan <- c(...)` | 50 nilai kecepatan disimpan berurutan sesuai nomor mobil 1–50 |
| 10–14 | `jarak <- c(...)` | 50 nilai jarak, urutannya harus sama dengan `kecepatan` (mobil ke-1 = kecepatan 4, jarak 2) |
| 16 | `mobil <- data.frame(kecepatan, jarak)` | gabung jadi tabel 50 baris × 2 kolom |
| 17 | `str(mobil)` | cek: harus 50 obs. dan 2 variabel. Ini cara memastikan tidak ada data yang kelewat |
| 18 | `summary(mobil)` | ringkasan cepat semua kolom |
| 22 | `mean(mobil$kecepatan)` | rata-rata kolom kecepatan |
| 25 | `mean(mobil$jarak)` | rata-rata kolom jarak |
| 28 | `sd(mobil$jarak)` | standar deviasi kolom jarak (rumus sampel, pembagi n − 1) |

### 2.4 Perhitungan manual (bukti hasil R benar)

| Ukuran | Perhitungan | Hasil |
| ------ | ----------- | ----- |
| a. Rata-rata kecepatan | 775 / 50 | **15,5 km/h** |
| b. Rata-rata jarak | 2114 / 50 | **42,28 m** |
| c. SD jarak | \( \sqrt{30052{,}08 / 49} = \sqrt{613{,}31} \) | **24,77 m** |

- 775 = jumlah semua kecepatan, 2114 = jumlah semua jarak.
- 30052,08 = jumlah kuadrat selisih tiap jarak dengan rata-rata 42,28.
- Dibagi 49 (n − 1), bukan 50, karena data dianggap **sampel**. `sd()` di R memang memakai n − 1.

### 2.5 Output

```text
'data.frame':	50 obs. of  2 variables:
 $ kecepatan: num  4 4 7 7 8 8 9 10 10 11 ...
 $ jarak    : num  2 10 4 20 17 13 18 28 33 18 ...

   kecepatan         jarak       
 Min.   : 4.00   Min.   :  2.00  
 1st Qu.:12.00   1st Qu.: 24.00  
 Median :15.50   Median : 35.50  
 Mean   :15.50   Mean   : 42.28  
 3rd Qu.:19.75   3rd Qu.: 56.00  
 Max.   :25.00   Max.   :110.00  

[1] 15.5
[1] 42.28
[1] 24.76505
```

### 2.6 Analisa

- Rata-rata mobil melaju **15,5 km/h** dan butuh rata-rata **42,28 m** untuk berhenti.
- SD jarak 24,77 m cukup besar dibanding rata-ratanya (KK ≈ 58,6%), artinya jarak berhenti antar mobil sangat bervariasi (2 m sampai 110 m).
- Rata-rata jarak (42,28) > median jarak (35,5): ada beberapa jarak yang sangat besar (90, 92, 110) yang menarik rata-rata ke atas.

---

## 3. Soal 2 Scatter Plot dan Histogram

### 3.1 Analisis soal

- (a) Scatter plot: tiap mobil jadi 1 titik, sumbu X = kecepatan, sumbu Y = jarak. Tujuannya melihat **hubungan** 2 variabel.
- (b) Interpretasi: arah (positif/negatif), kekuatan, pola sebaran, outlier.
- (c) Histogram: hanya 1 variabel (kecepatan). Tujuannya melihat **distribusi**: data paling banyak di mana dan bentuknya.
- (d) Interpretasi: kelas terbanyak, bentuk distribusi, rentang.
- Pendukung interpretasi: `cor()` untuk kekuatan hubungan, `lm()` untuk garis tren, `table(cut())` untuk frekuensi tiap kelas.

### 3.2 Kode (baris 30–50)

```r
plot(mobil$kecepatan, mobil$jarak,
     main = "Scatter Plot Kecepatan vs Jarak Berhenti",
     xlab = "Kecepatan (km/h)", ylab = "Jarak (meter)",
     pch = 19, col = "steelblue")
abline(lm(jarak ~ kecepatan, data = mobil), col = "red", lwd = 2)

cor(mobil$kecepatan, mobil$jarak)
lm(jarak ~ kecepatan, data = mobil)

hist(mobil$kecepatan,
     main = "Histogram Kecepatan Mobil",
     xlab = "Kecepatan (km/h)", ylab = "Frekuensi",
     col = "lightgreen", border = "black")

table(cut(mobil$kecepatan, breaks = seq(0, 25, by = 5)))
median(mobil$kecepatan)
```

### 3.3 Penjelasan per baris

| Baris | Kode | Penjelasan |
| ----- | ---- | ---------- |
| 32 | `plot(x, y, ...)` | argumen pertama = sumbu X (kecepatan), kedua = sumbu Y (jarak) |
| 33 | `main` | judul grafik |
| 34 | `xlab`, `ylab` | label sumbu X dan Y beserta satuannya |
| 35 | `pch = 19, col = "steelblue"` | bentuk titik bulat penuh, warna biru |
| 36 | `abline(lm(...), col = "red", lwd = 2)` | hitung garis regresi lalu gambar di atas scatter, merah, tebal 2 |
| 39 | `cor(...)` | angka kekuatan hubungan; mendekati 1 = hubungan positif kuat |
| 40 | `lm(jarak ~ kecepatan, data = mobil)` | tampilkan intercept dan kemiringan (slope) garis regresi |
| 43–46 | `hist(...)` | R otomatis membagi kecepatan ke beberapa kelas (aturan Sturges) lalu menggambar batang frekuensi |
| 49 | `seq(0, 25, by = 5)` | buat batas kelas 0, 5, 10, 15, 20, 25 (sama dengan batas default `hist()`) |
| 49 | `cut()` + `table()` | kelompokkan tiap kecepatan ke kelasnya lalu hitung jumlahnya. Interval `(10,15]` = lebih dari 10 sampai 15 |
| 50 | `median(...)` | nilai tengah, dibandingkan dengan mean untuk cek bentuk distribusi |

### 3.4 Output pendukung

```text
[1] 0.8384031

Call:
lm(formula = jarak ~ kecepatan, data = mobil)

Coefficients:
(Intercept)    kecepatan  
    -17.535        3.859  

 (0,5]  (5,10] (10,15] (15,20] (20,25] 
     2       7      16      17       8 
[1] 15.5
```

### 3.5 Gambar

![Scatter plot](./scatter-kecepatan-jarak.png)

![Histogram](./histogram-kecepatan.png)

### 3.6 Cara membaca angka pendukung

| Angka | Arti |
| ----- | ---- |
| r = 0,838 | positif (jarak naik saat kecepatan naik) dan kuat (\|r\| > 0,7) |
| r² = 0,703 | sekitar 70% variasi jarak berhenti bisa dijelaskan oleh kecepatan |
| slope = 3,859 | tiap kecepatan naik 1 km/h, jarak berhenti naik rata-rata ±3,86 m |
| intercept = −17,535 | secara matematis jarak saat kecepatan 0; tidak bermakna nyata (jarak tidak mungkin negatif), hanya titik awal garis |

Contoh prediksi: kecepatan 20 km/h > −17,535 + 3,859 × 20 = **59,6 m**.

### 3.7 b. Interpretasi scatter plot

- Pola titik naik dari kiri bawah ke kanan atas > hubungan **positif**: makin cepat mobil, makin jauh jarak berhentinya.
- Hubungannya **kuat**: r = 0,838.
- Garis regresi: **jarak = −17,53 + 3,86 × kecepatan**.
- Sebaran titik **melebar** di kecepatan tinggi (18–25 km/h): variasi jarak berhenti makin besar saat mobil lebih cepat.
- Potensi **outlier**: kecepatan 15 km/h dengan jarak 80 m (jauh di atas garis, prediksi ±40 m) dan kecepatan 25 km/h dengan jarak 110 m.

### 3.8 d. Interpretasi histogram

| Kelas (km/h) | Frekuensi | Persen |
| ------------ | --------- | ------ |
| 0–5 | 2 | 4% |
| 5–10 | 7 | 14% |
| 10–15 | 16 | 32% |
| 15–20 | 17 | 34% |
| 20–25 | 8 | 16% |
| **Total** | **50** | **100%** |

- Sebagian besar mobil di kecepatan **10–20 km/h** (33 dari 50 = 66%).
- Kelas terbanyak (modus kelas) **15–20 km/h** (17 mobil).
- Bentuk distribusi **relatif simetris / sedikit condong ke kiri**: mean = median = 15,5, ekor kiri (0–10) sedikit lebih panjang dengan frekuensi kecil.
- Rentang 4–25 km/h, tidak ada nilai ekstrem yang terpisah jauh.

---

## 4. Soal 3 Koefisien Keragaman

### 4.1 Analisis soal

- Data: Matematika (nilai 80, rata-rata 75, SD 10), Bahasa Inggris (nilai 75, rata-rata 70, SD 8).
- Diminta: koefisien keragaman (KK) kedua ujian.
- KK dipakai untuk membandingkan keragaman 2 kelompok data yang rata-ratanya berbeda. SD saja tidak adil dibandingkan karena rata-ratanya beda, jadi SD dibagi rata-rata supaya jadi persen.
- KK dihitung dari **rata-rata kelas dan SD**, bukan dari nilai Thomas. Nilai Thomas dipakai untuk pembanding tambahan (nilai baku z).

### 4.2 Kode (baris 52–61)

```r
kk_matematika <- 10 / 75 * 100
kk_inggris <- 8 / 70 * 100
kk_matematika
kk_inggris

(80 - 75) / 10
(75 - 70) / 8
```

### 4.3 Penjelasan per baris

| Baris | Kode | Penjelasan |
| ----- | ---- | ---------- |
| 54 | `10 / 75 * 100` | KK Matematika = SD / rata-rata × 100% |
| 55 | `8 / 70 * 100` | KK Bahasa Inggris |
| 56–57 | `kk_matematika`, `kk_inggris` | cetak hasilnya |
| 60 | `(80 - 75) / 10` | nilai z Thomas di Matematika |
| 61 | `(75 - 70) / 8` | nilai z Thomas di Bahasa Inggris |

### 4.4 Perhitungan

| Ujian | Rata-rata | SD | KK | z Thomas |
| ----- | --------- | -- | -- | -------- |
| Matematika | 75 | 10 | 10 / 75 × 100% = **13,33%** | (80 − 75) / 10 = **0,5** |
| Bahasa Inggris | 70 | 8 | 8 / 70 × 100% = **11,43%** | (75 − 70) / 8 = **0,625** |

### 4.5 Output

```text
[1] 13.33333
[1] 11.42857
[1] 0.5
[1] 0.625
```

### 4.6 Analisa

- KK Matematika (13,33%) > KK Bahasa Inggris (11,43%) > nilai Matematika di kelas lebih **beragam (heterogen)**, nilai Bahasa Inggris lebih **seragam (homogen)**.
- Walaupun nilai mentah Thomas lebih tinggi di Matematika (80 vs 75), posisi relatifnya lebih baik di **Bahasa Inggris** (z = 0,625 > 0,5): di Bahasa Inggris dia 0,625 SD di atas rata-rata kelas.

---

## 5. Simpan plot ke PNG (baris 63–77)

```r
png("scatter-kecepatan-jarak.png", width = 800, height = 600)
plot(...)          # sama seperti soal 2a
abline(...)
dev.off()
```

- `png()` mengarahkan semua gambar berikutnya ke file, bukan ke layar. Ukuran 800 × 600 piksel.
- `plot()` harus diulang karena plot sebelumnya digambar di layar, bukan di file.
- `dev.off()` menutup file; tanpa ini file PNG kosong/rusak.

---

## 6. Naskah rekaman video (± 10 menit)

Tips: buka VS Code/RStudio (kode di kiri, console R di bawah, plot di kanan), font diperbesar, siapkan file ini di layar lain sebagai contekan.

### Bagian 1 Perkenalan (± 30 detik)

> "Selamat pagi/siang/sore/malam. Perkenalkan nama saya I Kadek Wijaya Sashmitha Adhi, NIM 048068753, dari UPBJJ Denpasar. Pada video ini saya akan menjelaskan Tugas Tutorial 1 mata kuliah Analisis dan Visualisasi Data, STSI4204, yaitu menghitung statistik deskriptif, membuat scatter plot dan histogram, serta menghitung koefisien keragaman menggunakan R."

### Bagian 2 Persiapan (± 1 menit)

Tampilkan: file `tugas1-stsi4204.R`, console R.

> "Saya memakai VS Code dan R. R adalah bahasa interpreter, jadi tiap baris langsung dijalankan tanpa kompilasi. Semua jawaban ada di satu file `tugas1-stsi4204.R`, bisa dijalankan sekaligus dengan `Rscript` atau baris per baris dengan Cmd + Enter."

### Bagian 3 Soal 1 (± 2,5 menit)

1. Tunjuk tabel soal, jelaskan 50 data kecepatan dan jarak.
2. Jalankan baris 4–16: data dimasukkan ke vector pakai `c()`, lalu digabung jadi data frame `mobil`.
3. Jalankan `str(mobil)`: "50 obs. of 2 variables, artinya semua data sudah masuk."
4. Jalankan `mean()` dan `sd()`, tunjuk hasil 15,5; 42,28; 24,77.
5. Bukti manual: 775 / 50 = 15,5 dan 2114 / 50 = 42,28. SD pakai pembagi n − 1 = 49.

> "Rata-rata kecepatan 15,5 km/h, rata-rata jarak berhenti 42,28 meter, dan standar deviasi jarak 24,77 meter. SD-nya cukup besar, artinya jarak berhenti antar mobil sangat bervariasi."

### Bagian 4 Soal 2a & 2b Scatter plot (± 2,5 menit)

1. Jalankan `plot()` + `abline()`, tunjuk grafik.
2. Jelaskan argumen: X = kecepatan, Y = jarak, `main`, `xlab`, `ylab`, `pch`, `col`.
3. Jalankan `cor()` > 0,838 dan `lm()` > −17,535 dan 3,859.
4. Interpretasi: positif, kuat, tiap +1 km/h jarak +3,86 m, sebaran melebar di kecepatan tinggi, outlier (15 km/h > 80 m, 25 km/h > 110 m).

> "Titik-titik naik dari kiri bawah ke kanan atas, jadi makin cepat mobil makin jauh jarak berhentinya. Korelasinya 0,838, termasuk kuat."

### Bagian 5 Soal 2c & 2d Histogram (± 2 menit)

1. Jalankan `hist()`, tunjuk grafik.
2. Jalankan `table(cut(...))`, tunjuk frekuensi 2, 7, 16, 17, 8.
3. Interpretasi: 66% mobil di 10–20 km/h, kelas terbanyak 15–20, mean = median = 15,5 jadi relatif simetris.

### Bagian 6 Soal 3 (± 1,5 menit)

1. Tulis rumus KK = SD / rata-rata × 100%.
2. Jalankan baris 54–57 > 13,33% dan 11,43%.
3. Interpretasi: Matematika lebih beragam, Bahasa Inggris lebih seragam.
4. Tambahan: nilai z 0,5 vs 0,625 > posisi Thomas lebih baik di Bahasa Inggris.

### Bagian 7 Penutup (± 30 detik)

> "Kesimpulannya, dengan R saya bisa menghitung rata-rata dan standar deviasi, membuat scatter plot yang menunjukkan hubungan positif kuat antara kecepatan dan jarak berhenti, histogram yang menunjukkan sebagian besar mobil melaju 10–20 km/h, serta membandingkan keragaman nilai dengan koefisien keragaman. Kendala yang saya temui ... (isi sendiri). Sekian penjelasan dari saya, terima kasih."

---

## 7. Kemungkinan pertanyaan tutor (persiapan)

| Pertanyaan | Jawaban singkat |
| ---------- | --------------- |
| Kenapa SD pakai n − 1? | Data dianggap sampel; n − 1 (koreksi Bessel) membuat taksiran SD populasi tidak bias. `sd()` di R pakai n − 1 |
| Apa beda scatter plot dan histogram? | Scatter = hubungan 2 variabel; histogram = distribusi 1 variabel |
| Apa arti korelasi 0,838? | Hubungan positif kuat; makin mendekati 1 makin kuat |
| Apakah korelasi berarti kecepatan *menyebabkan* jarak jauh? | Korelasi tidak membuktikan sebab-akibat, tapi secara fisika memang masuk akal |
| Kenapa intercept negatif? | Hanya titik potong garis; data tidak ada di kecepatan 0, jadi tidak ditafsirkan |
| Kenapa pakai KK, bukan SD langsung? | Rata-rata kedua ujian beda; KK membuat keragaman bisa dibandingkan dalam persen |
| Kenapa kelas histogram lebar 5? | Default R (aturan Sturges + `pretty()`) memilih batas 0, 5, 10, 15, 20, 25 |
