# Transkrip Video Tugas 3 AVD (STSI4204) – Aplikasi Shiny Interaktif

Durasi target: ±6–7 menit. Baca kalimat dalam tanda kutip apa adanya. Baris **[AKSI LAYAR]** = yang dilakukan di layar.
Persiapan sebelum rekam: buka RStudio, buka file `data-analytics-stsi4204/tugas-3/app.R`, pastikan paket sudah terinstall (`install.packages(c("shiny", "readxl", "plotly", "DT"))`), wajah tampil di kamera.

---

## a. Perkenalan identitas (±30 detik)

**[AKSI LAYAR]** Wajah tampil di kamera, layar RStudio terbuka dengan file `app.R`.

"Halo, selamat pagi/siang/malam. Perkenalkan, nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, mahasiswa Program Studi Sistem Informasi, Universitas Terbuka Daerah Denpasar. Pada video ini saya akan mempraktikkan Tugas Tutorial 3 mata kuliah Analisis dan Visualisasi Data, kode STSI4204, yaitu membuat aplikasi visualisasi data interaktif menggunakan Shiny di R. Di aplikasi ini pengguna bisa memilih variabel yang ingin divisualisasikan, dan memilih jenis plot: scatter plot interaktif, line plot interaktif, bar plot interaktif, dan tabel data."

---

## b. Langkah-langkah (±4 menit)

### 1. Paket yang dipakai (±25 detik)

**[AKSI LAYAR]** Sorot bagian `# --- 0. Install & load paket ---`.

"Pertama, saya memakai empat paket. Shiny untuk membuat aplikasi web, readxl untuk membaca file Excel, plotly untuk membuat grafik interaktif, dan DT untuk tabel data interaktif. Kode ini otomatis meng-install paket kalau belum ada, lalu memuatnya dengan library."

### 2. Load data (±50 detik)

**[AKSI LAYAR]** Sorot bagian `# --- 1. Import data ---`, dari `lokasi_file` sampai `cuaca$Hari`.

"Selanjutnya bagian import data. File dataset-tugas-3.xlsx saya letakkan di folder yang sama dengan app.R. Fungsi file.exists dipakai untuk mencari file tersebut, jadi aplikasi tetap jalan baik dijalankan dari folder tugas-3 maupun dari folder root repo.

Data dibaca dengan read_excel dari sheet weather. Sel yang bertuliskan NA saya anggap sebagai data kosong. Karena di Excel sebagian angka tersimpan sebagai teks, perulangan for ini mengubah kolom yang isinya angka menjadi numerik, sedangkan kolom arah angin dan kolom Yes/No tetap menjadi kategori.

Datanya adalah data cuaca harian sebanyak 366 hari dengan 22 variabel, misalnya suhu minimum, suhu maksimum, curah hujan, kelembapan, arah angin, dan apakah besok hujan. Saya juga menambahkan kolom Hari, yaitu nomor urut hari, untuk sumbu x pada line plot."

### 3. UI: input variabel dan jenis plot (±50 detik)

**[AKSI LAYAR]** Sorot bagian `# --- 2. UI (tampilan) ---`, tunjuk `radioButtons` lalu `conditionalPanel` dan `selectInput`.

"Berikutnya bagian UI atau tampilan. Saya memakai sidebarLayout: panel input di kiri, dan grafik di kanan.

Input pertama adalah radioButtons dengan nama jenis_plot, untuk memilih scatter plot, line plot, bar plot, atau tabel data.

Input kedua adalah pilihan variabel dengan selectInput. Saya membungkusnya dengan conditionalPanel, jadi pilihan variabel yang muncul menyesuaikan jenis plot. Untuk scatter ada variabel X, variabel Y, dan warna titik. Untuk line plot bisa memilih lebih dari satu variabel. Untuk bar plot ada variabel kategori dan nilai batang. Dan untuk tabel, pengguna memilih kolom yang ingin ditampilkan.

Di bagian kanan ada plotlyOutput untuk grafik dan DTOutput untuk tabel."

### 4. Server: renderPlotly dengan switch (±60 detik)

**[AKSI LAYAR]** Scroll ke `# --- 3. Server (logika) ---`, sorot `renderPlotly({` dan `switch(input$jenis_plot,`, lalu tunjuk blok `scatter`, `line`, `bar` satu per satu.

"Sekarang bagian server, yaitu logika aplikasi. Grafik dibuat di dalam renderPlotly. Di dalamnya saya memakai fungsi switch yang membaca input jenis_plot, sehingga grafik yang dibuat sesuai pilihan pengguna.

Kalau yang dipilih scatter, plot_ly membuat titik-titik dengan mode markers, sumbu x dan y diambil dari variabel yang dipilih, dan warnanya mengikuti variabel kategori.

Kalau line, perulangan for menambahkan satu garis untuk setiap variabel yang dipilih dengan add_trace, dengan sumbu x nomor hari.

Kalau bar, jika memilih jumlah hari maka frekuensi dihitung dengan fungsi table, sedangkan jika memilih variabel angka maka dihitung rata-ratanya per kategori dengan aggregate. Hasilnya digambar dengan plot_ly tipe bar. Semua grafik diberi judul dan label sumbu dengan layout."

### 5. Tabel data (±20 detik)

**[AKSI LAYAR]** Sorot `output$tabel <- renderDT({`.

"Terakhir, tabel data dibuat dengan renderDT dan fungsi datatable. Tabel menampilkan kolom yang dipilih, 10 baris per halaman, dan ada filter di setiap kolom. Lalu shinyApp di baris paling bawah menjalankan aplikasinya."

### 6. Menjalankan aplikasi (±15 detik)

**[AKSI LAYAR]** Klik tombol **Run App** di kanan atas editor RStudio. Tunggu jendela aplikasi terbuka.

"Sekarang saya jalankan aplikasinya dengan klik tombol Run App."

---

## c. Hasil (±1,5 menit)

**[AKSI LAYAR]** Pilih **Scatter plot interaktif**, X = MinTemp, Y = MaxTemp, warna = RainTomorrow. Arahkan kursor ke beberapa titik, lalu klik "Yes" di legenda.

"Ini scatter plot interaktif suhu minimum terhadap suhu maksimum. Titiknya membentuk pola naik, artinya makin tinggi suhu minimum makin tinggi juga suhu maksimum, dengan korelasi sekitar 0,75, hubungan positif yang kuat. Kalau kursor diarahkan ke titik, nilainya muncul, dan saya bisa menyembunyikan kelompok lewat legenda."

**[AKSI LAYAR]** Pilih **Line plot interaktif**, variabel Temp9am dan Temp3pm. Zoom satu bagian dengan drag, lalu klik dua kali untuk kembali.

"Ini line plot suhu pagi dan suhu sore per hari. Terlihat pola musiman: suhu tinggi di awal, turun sampai paling rendah sekitar hari ke-250 sampai 300, lalu naik lagi. Suhu sore selalu lebih tinggi dari suhu pagi."

**[AKSI LAYAR]** Pilih **Bar plot interaktif**, variabel kategori WindGustDir, nilai batang "Jumlah hari (frekuensi)". Lalu ganti ke variabel kategori RainTomorrow dan nilai batang Humidity3pm.

"Ini bar plot arah angin kencang. Arah paling sering adalah barat laut atau NW, sebanyak 73 hari. Kalau nilai batangnya saya ganti dengan kelembapan sore per RainTomorrow, terlihat hari yang besoknya hujan punya kelembapan rata-rata lebih tinggi, sekitar 58 persen dibanding 42 persen."

**[AKSI LAYAR]** Pilih **Tabel data**, ketik `Yes` di kotak Search, lalu klik judul kolom MaxTemp untuk mengurutkan.

"Dan ini tabel data. Saya bisa memilih kolom, mencari data, misalnya Yes, dan mengurutkan dengan klik judul kolom."

---

## Penutup (±20 detik)

**[AKSI LAYAR]** Wajah tampil di kamera bersama layar aplikasi.

"Jadi, aplikasi Shiny ini berhasil membuat visualisasi data cuaca secara interaktif, di mana pengguna bisa memilih variabel dan jenis plot, yaitu scatter, line, bar, dan tabel data. Sekian video praktik Tugas 3 Analisis dan Visualisasi Data dari saya, I Kadek Wijaya Sashmitha Adhi C, NIM 048068753. Terima kasih."
