Berdasarkan data medis tentang perkembangan penyakit setelah satu tahun amatan (Y), usia dalam tahun (AGE), low-density lipoproteins (LDL), high-density lipoproteins (HDL), total cholesterol/HDL (TCH), triglycerides (LTG), dan blood sugar (GLU) sebagaimana terlampir, lakukan analisis statistik deskriptif untuk variabel Y dan GLU dengan cara:

1. Buatlah visualisasi data bivariat menggunakan Scatter Plot
2. Tuliskan model persamaan regresi linear dan estimasinya
3. Buatlah rumusan masalah asosiatif berdasarkan visual data yang ada
4. Berikan ulasan Anda tentang model dan hasil yang akan dicapai.

---

## Panduan Excel 2013 (Y dan GLU)

### Persiapan

- Baris 1 = header: `Y`, `AGE`, `LDL`, `HDL`, `TCH`, `LTG`, `GLU`.
- Analisis ini memakai **dua kolom**: **Y** (mis. kolom A) dan **GLU** (mis. kolom G).
- Data angka dari baris 2 sampai baris terakhir (sesuaikan, mis. `A2:A101` dan `G2:G101`).
- Konvensi regresi: **GLU** = variabel bebas (sumbu X), **Y** = variabel terikat (sumbu Y).

### Soal 1 — Scatter plot

1. Blok kolom **GLU** dan **Y** (boleh sertakan header).
2. **Insert → Scatter → Scatter with only Markers**.
3. **Layout → Chart Title** → misalnya _Hubungan GLU dan Y_.
4. **Axis Titles** → horizontal: _GLU_, vertikal: _Y_.
5. Simpan screenshot untuk lampiran.

**Perhatikan sebelum menulis jawaban:** arah sebaran titik (naik/turun), kekuatan kekompakan, ada/tidaknya titik jauh (outlier).

### Soal 2 — Model regresi linear dan estimasi

**Cara A — Trendline (paling mudah)**

1. Klik satu titik di scatter plot → klik kanan → **Add Trendline…**
2. Pilih **Linear**.
3. Centang **Display Equation on chart** dan **Display R-squared value on chart**.
4. Catat persamaan bentuk `y = mx + b` (atau sejenisnya) dan nilai **R²**.

**Cara B — Rumus di sel**

| Ukuran        | Rumus (sesuaikan range)       |
| ------------- | ----------------------------- |
| Kemiringan b₁ | `=SLOPE(A2:A101,G2:G101)`     |
| Intersep b₀   | `=INTERCEPT(A2:A101,G2:G101)` |
| R²            | `=RSQ(A2:A101,G2:G101)`       |
| Korelasi r    | `=CORREL(A2:A101,G2:G101)`    |

**Tulis di jawaban**

- Model: **Ŷ = b₀ + b₁ · GLU** (ganti b₀, b₁ dengan angka dari Excel).
- **b₁**: perubahan Y jika GLU naik 1 satuan.
- **R²**: proporsi variasi Y yang dijelaskan oleh GLU dalam model linear.

**Prediksi** untuk GLU tertentu (mis. 100):

```excel
=FORECAST(100, A2:A101, G2:G101)
```

**Opsional — Analysis ToolPak:** **File → Options → Add-Ins → Analysis ToolPak** → **Data → Data Analysis → Regression** (Y Range = kolom Y, X Range = kolom GLU).

> Urutan argumen: **SLOPE(known_y, known_x)** → kolom **Y** dulu, lalu **GLU**.

### Soal 3 — Rumusan masalah asosiatif

Tulis setelah melihat scatter dan angka regresi (bukan rumus Excel). Kerangka:

> Apakah terdapat **hubungan asosiatif** antara **kadar gula darah (GLU)** dan **perkembangan penyakit setelah satu tahun (Y)** pada sampel data terlampir?

Sertakan: variabel X dan Y, arah hubungan (positif/negatif/lemah), dan batasan (**asosiatif ≠ sebab-akibat**; variabel lain seperti AGE/LDL belum dimodelkan).

### Soal 4 — Ulasan model dan hasil

Bahas dalam 4–6 kalimat (tulis sendiri):

| Aspek              | Isi ulasan                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| Kesesuaian model   | Apakah pola scatter mendukung garis linear?                              |
| Kekuatan           | Besar R² atau r (kuat / sedang / lemah)                                  |
| Koefisien          | Arti slope dan intersep secara substantif                                |
| Outlier            | Titik jauh dan pengaruhnya pada interpretasi                             |
| Keterbatasan       | Hanya 2 variabel; asumsi linear; sampel terbatas                         |
| Hasil yang dicapai | Prediksi kasar Y dari GLU, atau kesimpulan bahwa GLU saja kurang memadai |

### Checklist sebelum kirim

- [ ] Grafik **scatter** (bukan line chart urutan baris)
- [ ] Persamaan regresi + arti slope
- [ ] R² atau r disebutkan
- [ ] Soal 3 dan 4 dalam kalimat orisinal (bukan hanya angka Excel)

Kemiringan b₁ 3.188571429
Intercept b₀ -134.7228571
R² 0.258115873
Korelasi r 0.508051054
Forecast 184.1342857

2. Model regresi linear sederhana antara GLU dan Y adalah Ŷ = −134,72 + 3,19 GLU. Koefisien kemiringan menunjukkan bahwa setiap peningkatan satu satuan GLU dikaitkan dengan kenaikan rata-rata Y sebesar 3,19. Koefisien determinasi R² = 0,258 berarti sekitar 25,8% variasi Y dapat dijelaskan oleh GLU dalam model ini; korelasi r = 0,508 menunjukkan hubungan linear positif sedang. Contoh estimasi: untuk GLU = 100, diperoleh Ŷ ≈ 184,13.

3. y = 0.081x + 79.53
   R² = 0.2581
   Apakah terdapat hubungan asosiatif positif antara kadar gula darah (GLU) dan tingkat perkembangan penyakit setelah satu tahun amatan (Y) pada sampel pasien dalam data terlampir?

Berdasarkan scatter plot, terlihat kecenderungan asosiasi positif lemah–sedang antara GLU dan Y, dengan garis regresi GLU = 0,081Y + 79,53 dan R² = 0,2581. Oleh karena itu, rumusan masalah asosiatif yang dapat diajukan: Apakah kadar gula darah berhubungan dengan tingkat perkembangan penyakit setelah satu tahun pada populasi serupa? Penyebaran titik yang masih lebar menunjukkan bahwa selain hubungan linear tersebut, masih diperlukan variabel lain untuk menjelaskan variasi kedua ukuran tersebut.

Kesesuaian model : linear Scatter cenderung naik → model linear positif masuk akal
Kekuatan : R² = 0.2581 berarti sekitar 25,8% variasi Y dapat dijelaskan oleh GLU dalam model ini; korelasi r = 0.508 menunjukkan hubungan linear positif sedang.
Koefisien : Koefisien kemiringan menunjukkan bahwa setiap peningkatan satu satuan GLU dikaitkan dengan kenaikan rata-rata Y sebesar 3,19.
Keterbatasan : Hanya 2 variabel; asumsi linear; sampel terbatas
Hasil yang dicapai : Prediksi kasar Y dari GLU, atau kesimpulan bahwa GLU saja kurang memadai
