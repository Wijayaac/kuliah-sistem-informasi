# NAMA : I KD WIJAYA SASHMITHA ADHI C
# NIM : 048068753
# Tugas Tutorial 1 Analisis dan Visualisasi Data (STSI4204)

# --- Data soal nomor 1 ---
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

# --- Soal 1 ---
# a. Rata-rata kecepatan mobil
mean(mobil$kecepatan)

# b. Rata-rata jarak yang ditempuh mobil
mean(mobil$jarak)

# c. Standar deviasi jarak yang ditempuh mobil
sd(mobil$jarak)

# --- Soal 2 ---
# a. Scatter plot kecepatan vs jarak
plot(mobil$kecepatan, mobil$jarak,
     main = "Scatter Plot Kecepatan vs Jarak Berhenti",
     xlab = "Kecepatan (km/h)", ylab = "Jarak (meter)",
     pch = 19, col = "steelblue")
abline(lm(jarak ~ kecepatan, data = mobil), col = "red", lwd = 2)

# pendukung interpretasi scatter plot
cor(mobil$kecepatan, mobil$jarak)
lm(jarak ~ kecepatan, data = mobil)

# c. Histogram kecepatan mobil
hist(mobil$kecepatan,
     main = "Histogram Kecepatan Mobil",
     xlab = "Kecepatan (km/h)", ylab = "Frekuensi",
     col = "lightgreen", border = "black")

# pendukung interpretasi histogram
table(cut(mobil$kecepatan, breaks = seq(0, 25, by = 5)))
median(mobil$kecepatan)

# --- Soal 3 ---
# Koefisien keragaman (KK) = s / rata-rata x 100%
kk_matematika <- 10 / 75 * 100
kk_inggris <- 8 / 70 * 100
kk_matematika # 13.33
kk_inggris # 11.43

# nilai baku (z-score) Thomas sebagai pembanding posisi relatif
(80 - 75) / 10
(75 - 70) / 8

# --- Simpan plot ke file PNG untuk laporan ---
png("scatter-kecepatan-jarak.png", width = 800, height = 600)
plot(mobil$kecepatan, mobil$jarak,
     main = "Scatter Plot Kecepatan vs Jarak Berhenti",
     xlab = "Kecepatan (km/h)", ylab = "Jarak (meter)",
     pch = 19, col = "steelblue")
abline(lm(jarak ~ kecepatan, data = mobil), col = "red", lwd = 2)
dev.off()

png("histogram-kecepatan.png", width = 800, height = 600)
hist(mobil$kecepatan,
     main = "Histogram Kecepatan Mobil",
     xlab = "Kecepatan (km/h)", ylab = "Frekuensi",
     col = "lightgreen", border = "black")
dev.off()
