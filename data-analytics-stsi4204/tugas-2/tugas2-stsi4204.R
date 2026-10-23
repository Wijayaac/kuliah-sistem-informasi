# NAMA : I KD WIJAYA SASHMITHA ADHI C
# NIM  : 048068753
# Tugas Tutorial 2 Analisis dan Visualisasi Data (STSI4204)
# Regresi linear sederhana: pengaruh pendapatan terhadap kebahagiaan

# --- 0. Install & load paket ---
paket <- c("ggplot2", "dplyr", "broom", "ggpubr")
for (p in paket) {
  if (!requireNamespace(p, quietly = TRUE)) install.packages(p, repos = "https://cloud.r-project.org")
}
library(ggplot2)
library(dplyr)
library(broom)
library(ggpubr)

# --- 1. Import data ---
# Working directory = folder kuliah-sistem-informasi (root repo)
data_tugas <- read.table("data-analytics-stsi4204/tugas-2/data_tugas_2_AVD.csv",
                         sep = ";", dec = ".", skip = 1, header = TRUE)
data_tugas <- data_tugas %>%
  select(pendapatan, kebahagiaan) %>%
  mutate(pendapatan = pendapatan * 10000)   # nilai asli dikalikan 10.000

str(data_tugas)
summary(data_tugas)

# --- a. Histogram variabel terikat (kebahagiaan) ---
hist(data_tugas$kebahagiaan,
     main = "Histogram Kebahagiaan",
     xlab = "Skor Kebahagiaan", ylab = "Frekuensi",
     col = "lightblue", border = "black")

# --- b. Scatter plot pendapatan vs kebahagiaan ---
plot(kebahagiaan ~ pendapatan, data = data_tugas,
     main = "Scatter Plot Pendapatan vs Kebahagiaan",
     xlab = "Pendapatan (Rp)", ylab = "Skor Kebahagiaan",
     pch = 19, col = "steelblue")
cor(data_tugas$pendapatan, data_tugas$kebahagiaan)

# --- c. Regresi linear sederhana ---
regresi_kebahagiaan <- lm(kebahagiaan ~ pendapatan, data = data_tugas)
summary(regresi_kebahagiaan)

# --- d. Cek homoskedastisitas ---
par(mfrow = c(2, 2))
plot(regresi_kebahagiaan)
par(mfrow = c(1, 1))

# --- e. Visualisasi hasil regresi ---
# e1. Plot data points
grafik <- ggplot(data_tugas, aes(x = pendapatan, y = kebahagiaan)) +
  geom_point()
grafik

# e2. Tambah garis regresi linear
grafik <- grafik +
  geom_smooth(method = "lm", col = "black")
grafik

# e3. Tambah persamaan garis regresi
grafik <- grafik +
  stat_regline_equation(label.x = 20000, label.y = 7)
grafik

# e4. Judul dan label sumbu x dan y
grafik <- grafik +
  theme_bw() +
  labs(title = "Pengaruh Pendapatan terhadap Kebahagiaan",
       x = "Pendapatan (Rp)",
       y = "Skor Kebahagiaan (skala 1-10)")
grafik
