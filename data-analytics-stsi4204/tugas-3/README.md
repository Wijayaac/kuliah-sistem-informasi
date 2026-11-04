# Tugas 3 AVD (STSI4204) – Aplikasi Shiny Visualisasi Data Cuaca

Install paket (sekali saja) di Console RStudio:

```r
install.packages(c("shiny", "readxl", "plotly", "DT"), repos = "https://cloud.r-project.org")
```

Jalankan:
- Buka `app.R` di RStudio lalu klik **Run App**, atau
- dari folder root repo (`kuliah-sistem-informasi`): `shiny::runApp("data-analytics-stsi4204/tugas-3")`

File `dataset-tugas-3.xlsx` harus berada di folder yang sama dengan `app.R`.

Fitur: pilih jenis plot (scatter, line, bar interaktif dengan plotly, atau tabel data DT) dan variabel yang ingin divisualisasikan.
