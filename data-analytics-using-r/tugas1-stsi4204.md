# Tugas Tutorial 1 Analisis dan Visualisasi Data (STSI4204)

Kode R lengkap: [`tugas1-stsi4204.R`](./tugas1-stsi4204.R)

Cara jalan: buka file di RStudio / VS Code, jalankan semua baris (Ctrl/Cmd + Shift + Enter) atau di terminal:

```bash
cd data-analytics-using-r
Rscript tugas1-stsi4204.R
```

Output plot tersimpan jadi `scatter-kecepatan-jarak.png` dan `histogram-kecepatan.png`. Screenshot console R + plot untuk lampiran laporan (soal minta lampiran hasil kerja di R).

---

## Soal 1 (30 poin)

Data dimasukkan ke R sebagai vector `kecepatan` dan `jarak` (50 observasi), lalu digabung ke data frame `mobil`.

```r
mean(mobil$kecepatan)   # a
mean(mobil$jarak)       # b
sd(mobil$jarak)         # c
```

| Poin | Ukuran | Hasil |
| ---- | ------ | ----- |
| a | Rata-rata kecepatan | **15,5 km/h** |
| b | Rata-rata jarak | **42,28 meter** |
| c | Standar deviasi jarak | **24,77 meter** (24,76505) |

Catatan: `sd()` di R pakai rumus sampel (pembagi n − 1).

---

## Soal 2 (50 poin)

### a. Scatter plot

```r
plot(mobil$kecepatan, mobil$jarak,
     main = "Scatter Plot Kecepatan vs Jarak Berhenti",
     xlab = "Kecepatan (km/h)", ylab = "Jarak (meter)",
     pch = 19, col = "steelblue")
abline(lm(jarak ~ kecepatan, data = mobil), col = "red", lwd = 2)
```

![Scatter plot](./scatter-kecepatan-jarak.png)

### b. Interpretasi scatter plot

- Titik-titik membentuk pola naik dari kiri bawah ke kanan atas, artinya ada hubungan **positif**: makin tinggi kecepatan mobil, makin jauh jarak yang dibutuhkan sampai berhenti.
- Hubungannya **kuat**: koefisien korelasi `cor()` = **0,838**.
- Garis regresi `lm()`: **jarak = −17,53 + 3,86 × kecepatan**. Tiap naik 1 km/h, jarak berhenti rata-rata bertambah sekitar 3,86 meter.
- Sebaran titik makin melebar di kecepatan tinggi (sekitar 18–25 km/h), jadi variasi jarak berhenti makin besar saat mobil lebih cepat.
- Ada beberapa titik yang jauh dari pola umum (potensi outlier), mis. kecepatan 15 km/h dengan jarak 80 m dan kecepatan 25 km/h dengan jarak 110 m.

### c. Histogram kecepatan

```r
hist(mobil$kecepatan,
     main = "Histogram Kecepatan Mobil",
     xlab = "Kecepatan (km/h)", ylab = "Frekuensi",
     col = "lightgreen", border = "black")
```

![Histogram](./histogram-kecepatan.png)

Frekuensi tiap kelas (default R, lebar kelas 5):

| Kelas (km/h) | Frekuensi |
| ------------ | --------- |
| 0–5 | 2 |
| 5–10 | 7 |
| 10–15 | 16 |
| 15–20 | 17 |
| 20–25 | 8 |

### d. Interpretasi histogram

- Sebagian besar mobil berada di kecepatan **10–20 km/h** (33 dari 50 mobil = 66%).
- Kelas dengan frekuensi tertinggi (modus kelas) ada di **15–20 km/h** (17 mobil).
- Bentuk distribusi mendekati **simetris / sedikit condong ke kiri**: ekor kiri (0–10 km/h) lebih panjang tapi frekuensinya kecil. Mean (15,5) sama dengan median (15,5), mendukung distribusi yang relatif simetris.
- Rentang data 4–25 km/h, tidak ada nilai ekstrem yang terpisah jauh.

---

## Soal 3 (20 poin)

Rumus koefisien keragaman (KK):

\[ KK = \frac{s}{\bar{x}} \times 100\% \]

| Ujian | Rata-rata kelas | SD | KK |
| ----- | --------------- | -- | -- |
| Matematika | 75 | 10 | 10 / 75 × 100% = **13,33%** |
| Bahasa Inggris | 70 | 8 | 8 / 70 × 100% = **11,43%** |

```r
kk_matematika <- 10 / 75 * 100   # 13.33
kk_inggris    <- 8 / 70 * 100    # 11.43
```

Interpretasi:

- KK Matematika (13,33%) > KK Bahasa Inggris (11,43%), jadi nilai ujian Matematika di kelas lebih **beragam/heterogen**, sedangkan nilai Bahasa Inggris lebih **seragam/homogen**.
- Pembanding tambahan (nilai baku z): Matematika (80 − 75) / 10 = **0,5**; Bahasa Inggris (75 − 70) / 8 = **0,625**. Posisi relatif Thomas sedikit lebih baik di Bahasa Inggris walaupun nilai mentahnya lebih kecil.

Sumber: BMP MSIM4310 Analisis dan Visualisasi Data, Modul 1 (KB 1.5, 1.16, 1.31).
