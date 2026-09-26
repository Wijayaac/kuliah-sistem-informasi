# Praktikum 1 — Operasi sederhana di R

# --- 1. Operasi sederhana ---
1 + 2
max(1, 4, 7)

# --- 2. Analisis statistik sederhana ---
# Contoh 3
data <- c(2, 3, 5, 6, 10, 13, 18, 22, 24, 25)
sd(data)

# Contoh 4
data_frame_1 <- data.frame(
  data_1 = c(1, 3, 4, 6, 8, 9),
  data_2 = c(7, 8, 8, 7, 13, 16),
  data_3 = c(11, 13, 13, 18, 19, 22),
  data_4 = c(12, 16, 18, 22, 29, 38)
)
sd(data_frame_1$data_1)

# --- 3. Menggambar grafik ---
# Tip: ketik ?plot di terminal R untuk help
plot(2, 5)
