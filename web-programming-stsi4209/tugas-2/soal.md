Halo rekan-rekan mahasiswa, bagaimana kabar kalian? Semoga rekan-rekan mahasiswa dalam keadaan baik. Nah, kali ini ada Tugas Praktik 2 untuk mengimplementasikan apa saja yang sudah rekan-rekan mahasiswa pelajari mengenai **Vue.js** .

Secara garis besar, tujuan dari tugas praktikum ini adalah:

Mahasiswa mampu mengimplementasikan konsep sistem perorganisasian kode Javascript Framework **Vue.js** untuk membangun antarmuka dan alur interaktif dari aplikasi pemesanan bahan ajar _SITTA_ untuk sistem kebutuhan proses pemesanan dan distribusi bahan ajar di UT.

Pertama, Tugas Praktik 2 ini memiliki lima Indikator Capaian untuk menilai Hasil Belajar Mahasiswa, yaitu:

1. Mahasiswa dapat menerapkan sistem perorganisasian kode _Javascript Framework_ **Vue.js** yang disepakati pada umumnya.

2. Mahasiswa dapat menerapkan fungsi untuk menampilkan data ( _mustaches_ / _directive v- text_ / _directive v-text_ ) untuk menghasilkan output yang diharapkan.

3. Mahasiswa dapat menerapkan fungsi _conditional_ atau pengandaian ( _directive v- if_ / _directive v-else_ / _directive v-else-if_ / _directive v-show_ ) dengan menerapkan _operator condition_ yang sesuai untuk menghasilkan _output_ yang diharapkan.

4. Mahasiswa mampu menerapkan data binding ( _one-way data binding_ / _two-way data binding_ ) melalui jenis _directive data binding_ ( _v-bind_ , _v-model_ ) dan penggunaan _property_ untuk mengolah data ( _computed property_ / _methods property_ ) yang sesuai untuk menghasilkan output yang diharapkan

5. Mahasiswa mampu mengerapkan fungsi _watcher_ yang sesuai untuk menghasilkan output yang diharapkan

# **<u>Soal Tugas</u>**

Anda diminta untuk membuat sebuah aplikasi website sederhana untuk pemesanan Bahan Ajar di Universitas Terbuka. Pada Tugas Praktik Kedua ini, mahasiswa berfokus untuk membuat aplikasi _website_ berbasis **Vue.js** sebagai _framework_ yang digunakan sepanjang pengerjaan Tugas Praktik 2. Sehingga, data-data yang dibutuhkan tidak dibaca melalui _database_ , tapi melalui js file sebagai _dummy data_ yang akan dilampirkan bersamaan dengan Tugas Praktik ini.

Buatlah Dua Halaman Website yang perlu dikembangkan sebagai berikut:

# **1. Halaman Stok Bahan Ajar**

- Halaman ini menampilkan daftar stok bahan ajar untuk seluruh UT daerah (silakan bebas menggunakan _table_ / _list_ /bentuk lain yang menampilkan _list_ data dalam jumlah banyak dan memiliki data-data field). Teman-teman mahasiswa perlu menampilkan daftar stok bahan ajar yang terdiri dari kolom data field sebagai berikut
  - Kode Mata Kuliah/Nama Mata Kuliah → `kode` , `judul`

  - Kategori Mata Kuliah → `Kategori`

  - UT-Daerah → `upbjj`

  - Lokasi Rak → `lokasiRak`

  - Jumlah Stok Bahan Ajar → `qty`

  - Jumlah Stok Safety Bahan Ajar → `safety`

  - Status

  - Catatan → `catatanHTML`

- Terdapat Fitur untuk mengedit stok data bahan ajar

- Terdapat fitur untuk melakukan _filter_ dan _sort_ data stock (silakan bebas menggunakan elemen _select_ / _radio_ / _checkbox_ )
  - Terdapat _filter_ stok berdasarkan:
    - ‘UT-Daerah’: terdiri pilihan dari seluruh UT-daerah, dan daftar setiap UT-daerah ( `upbjjList` )

    - ‘Kategori Mata Kuliah’ ( `upbjjList` )

  - Terdapat _filter_ yang hanya menampilkan jumlah stock (qty) < dari jumlah _safety_ stock ( _safety_ ) dan jumlah stock = 0 untuk menjadi daftar yang dapat mengingatkan untuk melakukan _re-order_ bahan ajar.

  - Terdapat fitur _sort_ yang mengurutkan berdasarkan judul, stock, dan harga

  - Fitur filter dapat di-set ulang ( _reset_ )

  - Terapkan fitur di vue.js di mana di semua filter tidak perlu _recompute_ kembali.

  - Implementasikan _dependent options_ seperti misalkan ketika memilih filter stok berdasarkan ‘UT-daerah’, baru akan memunculkan filter untuk ‘Kategori Mata Kuliah’

- Menampilkan status dari stok bahan ajar
  - Memberikan status ‘Aman dengan menggunakan simbol yang memberikan tanda yang memberikan kesan ‘aman’ ataupun teks berwarna hijau apabila stok >= safety stock

  - Memberikan status ‘Menipis’ dengan menggunakan simbol yang memberikan kesan adanya ‘ _warning_ ’ ataupun teks berwarna orange apabila stok < safety stock.

  - Memberikan status ‘Kosong’ dengan menggunakan simbol yang memberikan kesan adanya ‘bahaya’ ataupun teks berwarna merah apabila stok = 0

- Terdapat Fitur untuk menambahkan data bahan ajar baru melalui formulir kecil dan melakukan validasi sederhana untuk setiap data field.

# **2. Tracking** **_Delivery Order_ (DO)**

- Halaman ini menampilkan halaman untuk tracking status pengiriman DO bahan ajar seperti pada Tugas Praktik 1, tetapi di sini perlu menerapkan penggunaan framework **Vue.js** .

- Terdapat fitur untuk menambahkan _input_ delivery order yang baru. Berikut adalah data field yang perlu diisi
  - Nomor DO, di mana tergenerate otomatis. Penomorannya terdiri dari: ▪ DO

- Tahun Berjalan

- Sequence Number

Misal:

DO2025-001 untuk data awal

Selanjutnya jika sudah ada data tracking terbaru, menjadi DO2025-002 dst.

- NIM, diisi secara manual oleh pengguna

- Nama, diisi secara manual oleh pengguna

- Ekspedisi (JNE Regular/JNE Express), dipilih oleh pengguna berdasarkan data pada `upbjjList`

- Paket Bahan Ajar, dipilih oleh pengguna berdasarkan data pada `paket`
  - Gunakan elemen <select> dan menampilkan di halaman web informasi kode paket dan nama paket

  - Setelah memilih paket, akan muncul detail isi paket bahan ajar tersebut di bawah elemen <select> untuk memberikan informasi

- Tanggal Kirim, dapat diisi manual ataupun menggunakan fungsi **Date** untuk mengambil _local time_ .

- Total Harga, diambil dari data pada _Array of Objects_ `paket` → `harga`

Struktur proyek Vue.js pada Tugas Praktik ini yang disarankan adalah sebagai berikut:

/tugas2-vue-ut/

- ├─ index.html ← Menampilkan navigasi menu ke 2 halaman web lain: stok.html dan tracking.html

├─ stok.html ← Halaman 1: Stok Bahan Ajar (WAJIB) ├─ tracking.html ← Halaman 2: Tracking DO (WAJIB) ├─ css/

│ └─ style.css ← CSS ringan (opsional)

└─ js/

├─ stok-app.js ← logika Vue utk stok.html

└─ tracking-app.js ← logika Vue utk tracking.html

Untuk memudahkan teman-teman mahasiswa dalam pengerjaan Tugas Praktik 2, lampiran file _dummy_ data (file dataBahanAjar.js) yang dilampirkan bersamaan dengan file ini, menjadi template atau acuan yang yang dapat digunakan pada masing-masing file **stok-app.js** dan **tracking-app.js**

# **<u>Petunjuk Pengerjaan dan Poin untuk Video Penjelasan Tugas Praktik 2</u>**

1. Kriteria penilaian dalam tugas ini adalah bagaimana teman-teman mengimplementasikan: 1.1. Arsitektur dan Struktur Proyek Vue.js: struktur folder, struktur penamaan file, struktur komponen, pemisahan file yang disusun dengan rapih dan mudah diapahami **(5 Poin)**
   - 1.2. Penggunaan _Data Binding_ & _Directive_ untuk dan _List Rendering_ : penggunaan fungsi menampilkan data ( _mustaches_ , _v-text_ , _v-html_ ) dan fungsi _data binding_ ( _v-bind_ , _vmodel_ ) yang tepat dan sesuai dengan _output_ yang diharapkan untuk membuat daftar **(20 Poin)**

   - 1.3. Penggunaan _Conditional_ : fungsi _conditional_ ( _v-if_ , _v-else_ , _v-else-if_ , _v-show_ ) yang efektif dan sesuai dengan _output_ yang diharapkan **(10 Poin)**

   - 1.4. Penggunaan _Property_ ( _Computed_ ataupun _Methods_ ): menerapkan dengan sesuai **(10 Poin)**

   - 1.5. _Watchers_ : minimal menggunakan 2 _watcher_ untuk memantau perubahan data **(10 Poin)**

   - 1.6. Formulir input dan Validasi input sederhana: menampilkan element-element yang berinteraksi dengan pengguna atau yang perlu diisi pengguna yang tepat, sesuai, dan memudahkan pengguna **(20 Poin)**

   - 1.7. Kreativitas dalam menampilkan interface yang mudah bagi pengguna dan memberikan pengalaman penggunaan yang nyaman ( **10 Poin** )

   - 1.8. Penjelasan dalam **video** untuk menyelesaikan tugas dengan sistematika dan alur berpikir yang dapat menjelaskan penerapan fungsi-fungsi (beserta argumentasi pendukung) yang digunakan dalam merancang dan membuat aplikasi website menggunakan Vue.js **(15 Poin)**

2. Pada pengerjaan Tugas Praktik 2 ini **, tidak perlu menggunakan Template Component pada Vue.js** . Cukup seperti yang sudah dipelajari sampai sejauh ini dan diikuti seperti pada struktur proyek Vue.js yang telah kita sepakati pada Tugas Praktik 2 ini.

3. Durasi video penjelasan maksimal 15 menit

_<u>Setelah menyelesaikan Tugas Praktik 2, rekan-rekan dapat mengirimkan file source code dan link rekaman video penjelasan pengerjaan Tugas Praktik 2.</u>_

# **<u>Sumber Referensi:</u>**

Sufandi, U. U., Aprijani, D. A., & Pandiangan, P. (2021). Evaluasi dan hasil review desain user interface prototype aplikasi mobile SITTA Universitas Terbuka. _Jurnal Nasional Pendidikan Teknik Informatika: JANAPATI_ , _10_ (3), 147156. https://doi.org/10.23887/janapati.v10i3.40281

Sufandi, U. U. (2022). Analisis Kebutuhan dan Dokumentasi Sistem Informasi Tiras dan Transaksi Bahan Ajar Universitas Terbuka. _Jurnal Nasional Pendidikan Teknik Informatika: JANAPATI_ , _11_ (2), 112-122. https://doi.org/10.23887/janapati.v11i2.42966
