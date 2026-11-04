# NAMA : I KD WIJAYA SASHMITHA ADHI C
# NIM  : 048068753
# Tugas Tutorial 3 Analisis dan Visualisasi Data (STSI4204)
# Aplikasi Shiny visualisasi data interaktif (dataset cuaca "weather")
#
# Cara menjalankan:
#   - Buka file app.R ini di RStudio lalu klik tombol "Run App", atau
#   - dari folder root repo: shiny::runApp("data-analytics-stsi4204/tugas-3")

# --- 0. Install & load paket ---
paket <- c("shiny", "readxl", "plotly", "DT")
for (p in paket) {
  if (!requireNamespace(p, quietly = TRUE)) install.packages(p, repos = "https://cloud.r-project.org")
}
library(shiny)
library(readxl)
library(plotly)
library(DT)

# --- 1. Import data ---
# File Excel dicari di folder yang sama dengan app.R (runApp/Run App otomatis
# memakai folder app sebagai working directory). Jika tidak ketemu, coba path
# dari root repo, supaya aman dijalankan dari mana saja.
lokasi_file <- c("dataset-tugas-3.xlsx",
                 "data-analytics-stsi4204/tugas-3/dataset-tugas-3.xlsx")
lokasi_file <- lokasi_file[file.exists(lokasi_file)][1]
if (is.na(lokasi_file)) stop("File dataset-tugas-3.xlsx tidak ditemukan. Jalankan app dari folder tugas-3.")

cuaca <- read_excel(lokasi_file, sheet = "weather", na = c("", "NA"))
cuaca <- as.data.frame(cuaca)

# Sel bertuliskan "NA" dibaca sebagai data kosong (missing value).
# Sebagian angka di Excel tersimpan sebagai teks, jadi kolom yang isinya
# angka diubah menjadi numerik; kolom arah angin & Yes/No tetap kategori.
for (kolom in names(cuaca)) {
  angka <- suppressWarnings(as.numeric(cuaca[[kolom]]))
  if (sum(is.na(angka)) == sum(is.na(cuaca[[kolom]]))) {
    cuaca[[kolom]] <- angka
  }
}
# Tambah kolom nomor hari (urutan observasi) untuk sumbu x line plot
cuaca$Hari <- seq_len(nrow(cuaca))

var_numerik  <- names(cuaca)[sapply(cuaca, is.numeric)]
var_kategori <- names(cuaca)[!sapply(cuaca, is.numeric)]

# --- 2. UI (tampilan) ---
ui <- fluidPage(
  titlePanel("Visualisasi Data Cuaca Interaktif - Tugas 3 AVD (STSI4204)"),
  sidebarLayout(
    sidebarPanel(
      # Input 1: jenis plot
      radioButtons("jenis_plot", "Pilih jenis plot:",
                   choices = c("Scatter plot interaktif" = "scatter",
                               "Line plot interaktif"    = "line",
                               "Bar plot interaktif"     = "bar",
                               "Tabel data"              = "tabel")),
      # Input 2: variabel yang divisualisasikan (muncul sesuai jenis plot)
      conditionalPanel("input.jenis_plot == 'scatter'",
        selectInput("x_scatter", "Variabel X:", var_numerik, selected = "MinTemp"),
        selectInput("y_scatter", "Variabel Y:", var_numerik, selected = "MaxTemp"),
        selectInput("warna", "Warna titik berdasarkan:", c("(tidak ada)", var_kategori),
                    selected = "RainTomorrow")),
      conditionalPanel("input.jenis_plot == 'line'",
        selectInput("y_line", "Variabel (boleh lebih dari satu):", var_numerik,
                    selected = c("Temp9am", "Temp3pm"), multiple = TRUE)),
      conditionalPanel("input.jenis_plot == 'bar'",
        selectInput("x_bar", "Variabel kategori:", var_kategori, selected = "WindGustDir"),
        selectInput("y_bar", "Nilai batang:", c("Jumlah hari (frekuensi)", var_numerik),
                    selected = "Jumlah hari (frekuensi)")),
      conditionalPanel("input.jenis_plot == 'tabel'",
        selectInput("kolom_tabel", "Kolom yang ditampilkan:", names(cuaca),
                    selected = c("Hari", "MinTemp", "MaxTemp", "Rainfall", "Humidity3pm",
                                 "RainToday", "RainTomorrow"), multiple = TRUE))
    ),
    mainPanel(
      # Plot dan tabel ditampilkan bergantian sesuai pilihan
      conditionalPanel("input.jenis_plot != 'tabel'", plotlyOutput("grafik", height = "550px")),
      conditionalPanel("input.jenis_plot == 'tabel'", DTOutput("tabel"))
    )
  )
)

# --- 3. Server (logika) ---
server <- function(input, output) {

  output$grafik <- renderPlotly({
    # switch() memilih grafik plotly sesuai jenis plot yang dipilih
    switch(input$jenis_plot,

      scatter = {
        if (input$warna == "(tidak ada)") {
          p <- plot_ly(cuaca, x = cuaca[[input$x_scatter]], y = cuaca[[input$y_scatter]],
                       type = "scatter", mode = "markers")
        } else {
          p <- plot_ly(cuaca, x = cuaca[[input$x_scatter]], y = cuaca[[input$y_scatter]],
                       color = cuaca[[input$warna]], type = "scatter", mode = "markers")
        }
        p %>% layout(title = paste("Scatter Plot", input$x_scatter, "vs", input$y_scatter),
                     xaxis = list(title = input$x_scatter),
                     yaxis = list(title = input$y_scatter))
      },

      line = {
        req(input$y_line)
        p <- plot_ly()
        for (v in input$y_line) {   # satu garis untuk setiap variabel yang dipilih
          p <- add_trace(p, x = cuaca$Hari, y = cuaca[[v]], name = v,
                         type = "scatter", mode = "lines")
        }
        p %>% layout(title = paste("Line Plot", paste(input$y_line, collapse = ", "), "per Hari"),
                     xaxis = list(title = "Hari ke-"), yaxis = list(title = "Nilai"))
      },

      bar = {
        if (input$y_bar == "Jumlah hari (frekuensi)") {
          ringkas <- as.data.frame(table(cuaca[[input$x_bar]]))
          names(ringkas) <- c("kategori", "nilai")
          judul_y <- "Jumlah hari"
        } else {
          ringkas <- aggregate(cuaca[[input$y_bar]], list(kategori = cuaca[[input$x_bar]]),
                               mean, na.rm = TRUE)
          names(ringkas)[2] <- "nilai"
          judul_y <- paste("Rata-rata", input$y_bar)
        }
        plot_ly(ringkas, x = ~kategori, y = ~nilai, type = "bar") %>%
          layout(title = paste("Bar Plot", judul_y, "per", input$x_bar),
                 xaxis = list(title = input$x_bar), yaxis = list(title = judul_y))
      }
    )
  })

  # Tabel data interaktif (bisa dicari, diurutkan, dan dipindah halaman)
  output$tabel <- renderDT({
    req(input$kolom_tabel)
    datatable(cuaca[, input$kolom_tabel, drop = FALSE],
              filter = "top", options = list(pageLength = 10, scrollX = TRUE))
  })
}

# --- 4. Jalankan aplikasi ---
shinyApp(ui = ui, server = server)
