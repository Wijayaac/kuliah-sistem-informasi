# Laporan Tugas Tutorial 1 Analisis dan Visualisasi Data (STSI4204)

Nama: I KD WIJAYA SASHMITHA ADHI C

NIM: 048068753

Selamat malam. Perkenalkan nama saya I Kadek Wijaya Sashmitha Adhi, dari UPBJJ Denpasar. Pada video ini saya akan menjelaskan Tugas Tutorial 1 mata kuliah Analisis dan Visualisasi Data, STSI4204, yaitu menghitung statistik deskriptif, membuat scatter plot dan histogram, serta menghitung koefisien keragaman menggunakan R.

Saya memakai VS Code dan R. Semua jawaban ada di satu file tugas1-stsi4204.R yang bisa dijalankan sekaligus dengan perintah Rscript, atau baris per baris dengan Cmd + Enter.

Berikut URL video : (isi link Google Drive)

Atau youtube : (isi link YouTube)

## Hasil kode program

### Soal 1 Rata-rata dan standar deviasi

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

mean(mobil$kecepatan)   # a
mean(mobil$jarak)       # b
sd(mobil$jarak)         # c
```

Output:

```text
[1] 15.5
[1] 42.28
[1] 24.76505
```

| Poin | Ukuran | Hasil |
| ---- | ------ | ----- |
| a | Rata-rata kecepatan mobil | 15,5 km/h |
| b | Rata-rata jarak yang ditempuh mobil | 42,28 meter |
| c | Standar deviasi jarak | 24,77 meter |

### Soal 2a Scatter plot

```r
plot(mobil$kecepatan, mobil$jarak,
     main = "Scatter Plot Kecepatan vs Jarak Berhenti",
     xlab = "Kecepatan (km/h)", ylab = "Jarak (meter)",
     pch = 19, col = "steelblue")
abline(lm(jarak ~ kecepatan, data = mobil), col = "red", lwd = 2)
cor(mobil$kecepatan, mobil$jarak)
```

Output: korelasi `[1] 0.8384031`, garis regresi intercept -17.535 dan slope 3.859.

![Scatter plot kecepatan vs jarak](./scatter-kecepatan-jarak.png)

### Soal 2b Interpretasi scatter plot

- Titik-titik naik dari kiri bawah ke kanan atas, artinya hubungan positif: makin tinggi kecepatan, makin jauh jarak berhenti.
- Hubungannya kuat, koefisien korelasi r = 0,838.
- Garis regresi: jarak = −17,53 + 3,86 × kecepatan. Tiap kecepatan naik 1 km/h, jarak berhenti bertambah rata-rata sekitar 3,86 meter.
- Sebaran titik makin melebar di kecepatan tinggi (18–25 km/h), jadi variasi jarak berhenti makin besar saat mobil lebih cepat.
- Ada potensi outlier, misalnya kecepatan 15 km/h dengan jarak 80 m dan kecepatan 25 km/h dengan jarak 110 m.

### Soal 2c Histogram kecepatan

```r
hist(mobil$kecepatan,
     main = "Histogram Kecepatan Mobil",
     xlab = "Kecepatan (km/h)", ylab = "Frekuensi",
     col = "lightgreen", border = "black")
table(cut(mobil$kecepatan, breaks = seq(0, 25, by = 5)))
```

![Histogram kecepatan mobil](./histogram-kecepatan.png)

| Kelas (km/h) | Frekuensi |
| ------------ | --------- |
| 0–5 | 2 |
| 5–10 | 7 |
| 10–15 | 16 |
| 15–20 | 17 |
| 20–25 | 8 |

### Soal 2d Interpretasi histogram

- Sebagian besar mobil berada di kecepatan 10–20 km/h (33 dari 50 mobil = 66%).
- Kelas dengan frekuensi tertinggi ada di 15–20 km/h (17 mobil).
- Distribusi relatif simetris, sedikit condong ke kiri: mean (15,5) sama dengan median (15,5), ekor kiri (0–10 km/h) sedikit lebih panjang dengan frekuensi kecil.
- Rentang data 4–25 km/h, tidak ada nilai ekstrem yang terpisah jauh.

### Soal 3 Koefisien keragaman

Rumus: KK = standar deviasi / rata-rata × 100%

```r
kk_matematika <- 10 / 75 * 100
kk_inggris <- 8 / 70 * 100
kk_matematika
kk_inggris
```

Output:

```text
[1] 13.33333
[1] 11.42857
```

| Ujian | Rata-rata kelas | SD | KK |
| ----- | --------------- | -- | -- |
| Matematika | 75 | 10 | 10 / 75 × 100% = 13,33% |
| Bahasa Inggris | 70 | 8 | 8 / 70 × 100% = 11,43% |

- KK Matematika (13,33%) lebih besar dari KK Bahasa Inggris (11,43%), jadi nilai ujian Matematika lebih beragam (heterogen), sedangkan nilai Bahasa Inggris lebih seragam (homogen).
- Sebagai pembanding, nilai baku Thomas: Matematika (80 − 75) / 10 = 0,5 dan Bahasa Inggris (75 − 70) / 8 = 0,625. Posisi relatif Thomas lebih baik di Bahasa Inggris walaupun nilai mentahnya lebih kecil.

Sumber: BMP MSIM4310 Analisis dan Visualisasi Data, Modul 1 (KB 1.5, 1.16, 1.31).

Code R

!include(./tugas1-stsi4204.R)
