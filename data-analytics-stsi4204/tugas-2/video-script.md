# Script Video Tugas 2 AVD (STSI4204)

File: `tugas2-stsi4204.R`. Buka di RStudio, jalankan baris per baris pakai **Ctrl/Cmd + Enter**.
Sebelum mulai: Session > Set Working Directory > pilih folder `tugas-2`.

---

## 1. Pembukaan (±20 detik)
> "Halo, perkenalkan nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753. Pada video ini saya akan mengerjakan Tugas Tutorial 2 Analisis dan Visualisasi Data, yaitu regresi linear sederhana untuk melihat pengaruh pendapatan terhadap kebahagiaan menggunakan R."

## 2. Install & load paket (bagian 0)
Jalankan blok `paket <- ...` sampai `library(ggpubr)`.
> "Pertama saya install dan load paket ggplot2, dplyr, broom, dan ggpubr. Kode ini hanya meng-install paket kalau belum ada."

## 3. Import data (bagian 1)
Jalankan `read.table(...)`, `mutate(...)`, `str()`, `summary()`.
> "Data saya import dari file CSV dengan pemisah titik koma. Sesuai soal, kolom pendapatan dikalikan 10.000 agar menjadi nilai asli. Datanya ada 498 observasi dengan 2 variabel: pendapatan sebagai variabel bebas (X) dan kebahagiaan sebagai variabel terikat (Y). Pendapatan berkisar Rp15.063 sampai Rp74.815 dengan rata-rata sekitar Rp44.665, dan skor kebahagiaan dari 0,26 sampai 6,86 dengan rata-rata 3,39."

## 4. Soal a – Histogram
Jalankan `hist(...)`.
> "Histogram kebahagiaan berbentuk lonceng: sebagian besar data berkumpul di tengah, sekitar skor 2 sampai 5, dan makin sedikit ke arah kiri dan kanan. Artinya variabel terikat kebahagiaan kurang lebih berdistribusi normal, sehingga asumsi normalitas regresi linear terpenuhi."

## 5. Soal b – Scatter plot
Jalankan `plot(kebahagiaan ~ pendapatan ...)` dan `cor(...)`.
> "Titik-titik pada scatter plot membentuk pola naik dari kiri bawah ke kanan atas, kurang lebih seperti garis lurus. Artinya ada hubungan linear positif: makin tinggi pendapatan, makin tinggi kebahagiaan. Nilai korelasinya 0,86, jadi hubungannya kuat. Asumsi linearitas terpenuhi."

## 6. Soal c – Regresi linear
Jalankan `regresi_kebahagiaan <- lm(...)` dan `summary(...)`.
Tunjuk bagian **Coefficients** dan **R-squared** di console.
> "Hasil regresinya:
> - Intercept 0,209: kalau pendapatan nol, skor kebahagiaan diperkirakan 0,21.
> - Koefisien pendapatan 7,124e-05: setiap kenaikan pendapatan Rp1, kebahagiaan naik 0,00007, atau setiap kenaikan Rp10.000 kebahagiaan naik sekitar 0,71 poin.
> - p-value pendapatan < 2e-16, jauh di bawah 0,05, jadi pendapatan berpengaruh signifikan terhadap kebahagiaan.
> - R-squared 0,745: 74,5% variasi kebahagiaan dijelaskan oleh pendapatan, sisanya oleh faktor lain.
> - Persamaannya: kebahagiaan = 0,209 + 0,00007124 × pendapatan."

## 7. Soal d – Homoskedastisitas
Jalankan `par(mfrow = c(2, 2))`, `plot(regresi_kebahagiaan)`, `par(mfrow = c(1, 1))`.
> "Ada 4 plot diagnostik:
> - Residuals vs Fitted: titik menyebar acak di sekitar nol, garis merah hampir datar, tidak membentuk pola corong.
> - Q-Q Residuals: titik mengikuti garis diagonal, jadi residual mendekati normal.
> - Scale-Location: sebaran titik merata dan garis merah horizontal, artinya varians residual konstan.
> - Residuals vs Leverage: tidak ada titik yang melewati garis Cook's distance, jadi tidak ada outlier berpengaruh.
> Kesimpulannya, asumsi homoskedastisitas terpenuhi dan model regresi layak digunakan."

## 8. Soal e – Visualisasi regresi
Jalankan blok e1–e4 satu per satu; grafik berubah tiap langkah.
- **e1** `geom_point()`: "Pertama saya plot titik datanya."
- **e2** `geom_smooth(method = "lm")`: "Lalu saya tambahkan garis regresi linear. Area abu-abu adalah interval kepercayaan."
- **e3** `stat_regline_equation()`: "Kemudian saya tambahkan persamaan garis, yaitu y = 7,1 × 10⁻⁵ x + 0,21, sama dengan hasil summary."
- **e4** `theme_bw()` + `labs()`: "Terakhir saya beri judul 'Pengaruh Pendapatan terhadap Kebahagiaan', sumbu x Pendapatan (Rp), dan sumbu y Skor Kebahagiaan."

## 9. Penutup (±15 detik)
> "Jadi kesimpulannya, pendapatan berpengaruh positif dan signifikan terhadap kebahagiaan, dengan R-squared 74,5%. Sekian video praktik saya, terima kasih."
