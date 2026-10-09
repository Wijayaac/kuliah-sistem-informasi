# Laporan Tugas 1 Pemrograman Berbasis Perangkat Bergerak (STSI4303)

- Nama: I KD WIJAYA SASHMITHA ADHI C
- NIM: 048068753
- PRODI : Sistem Informasi
- Bahasa: TypeScript
- Tools: Visual Studio Code, Node.js, TypeScript Compiler (`tsc`)

---

## 1. Persiapan

### 1.1 Struktur folder

```text
pemrograman-mobile-stsi4303/
├── src/
│   ├── soal1.ts      program pola segitiga
│   ├── soal2.ts      program deret aritmatika
│   └── soal3.ts      program bilangan prima
├── dist/             hasil kompilasi (.js), dibuat otomatis oleh tsc
├── package.json      daftar dependency + perintah npm run
└── tsconfig.json     pengaturan compiler TypeScript
```

### 1.2 Cara menjalankan

```bash
cd pemrograman-mobile-stsi4303
npm install        # install TypeScript (sekali saja)
npm run soal1
npm run soal2
npm run soal3
```

### 1.3 Alur kerja TypeScript

TypeScript tidak bisa langsung dijalankan oleh Node.js. Alurnya:

```text
src/soal1.ts  --(tsc compile)-->  dist/soal1.js  --(node)-->  output di terminal
```

- `tsc` membaca `tsconfig.json`, mengecek tipe data, lalu mengubah `.ts` jadi `.js`.
- Kalau ada kesalahan tipe (mis. memasukkan teks ke `number[]`), `tsc` langsung error sebelum program jalan. Ini kelebihan TypeScript dibanding JavaScript biasa.
- `npm run soal1` menjalankan dua langkah sekaligus: `tsc && node dist/soal1.js`.

### 1.4 Isi `tsconfig.json` (singkat)

| Opsi                       | Arti                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `rootDir: "src"`           | file sumber TypeScript ada di folder `src`                                             |
| `outDir: "dist"`           | hasil JavaScript disimpan di folder `dist`                                             |
| `strict: true`             | pengecekan tipe paling ketat                                                           |
| `moduleDetection: "force"` | tiap file dianggap terpisah, jadi variabel `nim` boleh dipakai di 3 file tanpa bentrok |

### 1.5 Konsep dasar yang dipakai di ketiga soal

| Konsep           | Contoh di kode                    | Penjelasan                                                    |
| ---------------- | --------------------------------- | ------------------------------------------------------------- |
| Variabel bertipe | `let nim: string`                 | `: string` = anotasi tipe, variabel hanya boleh berisi teks   |
| Tipe `number`    | `let tinggi: number`              | hanya boleh angka                                             |
| Tipe array       | `let deret: number[]`             | array yang isinya hanya angka                                 |
| Tipe `boolean`   | `let isPrima: boolean`            | hanya `true` / `false`                                        |
| `Number()`       | `Number("53")` > `53`             | ubah teks jadi angka                                          |
| `slice(-n)`      | `"048068753".slice(-2)` > `"53"`  | ambil n karakter dari belakang                                |
| `push()`         | `baris.push(j)`                   | tambah elemen ke akhir array                                  |
| `join()`         | `[1, 2, 3].join(" ")` > `"1 2 3"` | gabung isi array jadi satu teks                               |
| `for`            | `for (let i = 1; i <= 3; i++)`    | perulangan: nilai awal; syarat lanjut; perubahan tiap putaran |

### 1.6 Kenapa NIM disimpan sebagai `string`?

Kalau ditulis `let nim: number = 048068753`, angka 0 di depan hilang (jadi 48068753), dan angka tidak bisa diambil per digit dengan `slice()`. Dengan `string`, tiap karakter punya posisi (indeks):

| Indeks        | 0    | 1    | 2    | 3    | 4    | 5    | 6        | 7        | 8        |
| ------------- | ---- | ---- | ---- | ---- | ---- | ---- | -------- | -------- | -------- |
| Digit         | 0    | 4    | 8    | 0    | 6    | 8    | **7**    | **5**    | **3**    |
| Dari belakang | ke-9 | ke-8 | ke-7 | ke-6 | ke-5 | ke-4 | **ke-3** | **ke-2** | **ke-1** |

- Digit terakhir = `3` (Soal 1)
- 2 digit terakhir = `53` (Soal 2 dan 3)
- Digit ke-3 dari belakang = `7` (Soal 2)

---

## 2. Soal 1 Pola Segitiga

### 2.1 Analisis soal

- Input: digit terakhir NIM = **3** > tinggi segitiga 3 baris.
- Pola: baris ke-1 berisi `1`, baris ke-2 berisi `1 2`, baris ke-3 berisi `1 2 3`.
- Artinya baris ke-`i` berisi angka 1 sampai `i`. Butuh 2 perulangan: satu untuk baris, satu untuk angka di dalam baris (nested loop).

### 2.2 Kode `src/soal1.ts`

```typescript
// SOAL 1 - POLA SEGITIGA
// NIM: 048068753

let nim: string = "048068753";

// Digit terakhir sebagai tinggi segitiga
let tinggi: number = Number(nim.slice(-1));

console.log("SOAL 1 - POLA SEGITIGA");
console.log("NIM:", nim);
console.log("Tinggi segitiga:", tinggi);
console.log("");

for (let i = 1; i <= tinggi; i++) {
  let baris: number[] = [];

  for (let j = 1; j <= i; j++) {
    baris.push(j);
  }

  console.log(baris.join(" "));
}
```

### 2.3 Penjelasan per baris

| Baris | Kode                                | Penjelasan                                                                    |
| ----- | ----------------------------------- | ----------------------------------------------------------------------------- |
| 1–2   | `// ...`                            | komentar, tidak dijalankan, untuk keterangan                                  |
| 4     | `let nim: string = "048068753"`     | simpan NIM sebagai teks                                                       |
| 7     | `Number(nim.slice(-1))`             | `slice(-1)` ambil 1 karakter terakhir > `"3"`, `Number()` ubah jadi angka `3` |
| 9–12  | `console.log(...)`                  | cetak judul, NIM, tinggi, dan baris kosong                                    |
| 14    | `for (let i = 1; i <= tinggi; i++)` | loop luar: `i` = nomor baris, dari 1 sampai 3                                 |
| 15    | `let baris: number[] = []`          | siapkan array kosong untuk isi baris; dibuat ulang tiap baris baru            |
| 17    | `for (let j = 1; j <= i; j++)`      | loop dalam: `j` dari 1 sampai `i`, jadi jumlah angka = nomor baris            |
| 18    | `baris.push(j)`                     | masukkan angka `j` ke array                                                   |
| 21    | `console.log(baris.join(" "))`      | gabung isi array pakai spasi, lalu cetak satu baris                           |

### 2.4 Tracing (simulasi jalannya program)

| `i` (baris) | `j` berjalan | isi `baris` | dicetak                         |
| ----------- | ------------ | ----------- | ------------------------------- |
| 1           | 1            | `[1]`       | `1`                             |
| 2           | 1, 2         | `[1, 2]`    | `1 2`                           |
| 3           | 1, 2, 3      | `[1, 2, 3]` | `1 2 3`                         |
| 4           | -            | -           | berhenti, karena `4 <= 3` salah |

### 2.5 Output

```text
SOAL 1 - POLA SEGITIGA
NIM: 048068753
Tinggi segitiga: 3

1
1 2
1 2 3
```

### 2.6 Analisa

- Jumlah baris mengikuti digit terakhir NIM, jadi program otomatis menyesuaikan kalau NIM diganti (mis. digit terakhir 5 > 5 baris).
- `baris` dideklarasikan di dalam loop luar supaya setiap baris mulai dari array kosong. Kalau ditaruh di luar loop, angka baris sebelumnya ikut tercetak (`1`, `1 1 2`, ...).
- Kalau digit terakhir NIM = 0, loop tidak jalan sama sekali dan tidak ada segitiga yang dicetak.

---

## 3. Soal 2 Deret Aritmatika

### 3.1 Analisis soal

- Angka awal = 2 digit terakhir NIM = **53**.
- Beda (step) = digit ke-3 dari belakang + 1 = 7 + 1 = **8**.
- Catatan: teks soal hanya bilang "digit ke-3 dari belakang jadikan beda", tapi contoh soal menulis "0 + 1 = 1", jadi program mengikuti contoh soal (ditambah 1). Manfaatnya, step tidak pernah 0 (kalau 0, deretnya angka yang sama terus).
- Rumus deret aritmatika: suku ke-n = a + (n − 1) × b. Di kode, `i` mulai dari 0, jadi rumusnya `start + i * step`.

### 3.2 Kode `src/soal2.ts`

```typescript
// SOAL 2 - DERET ARITMATIKA
// NIM: 048068753

let nim: string = "048068753";

// 2 digit terakhir sebagai angka awal
let start: number = Number(nim.slice(-2));

// Digit ke-3 dari belakang
let digitKetiga: number = Number(nim[nim.length - 3]);

// Step = digit ke-3 dari belakang + 1
let step: number = digitKetiga + 1;

console.log("SOAL 2 - DERET ARITMATIKA");
console.log("NIM:", nim);
console.log("Start:", start);
console.log("Digit ke-3 dari belakang:", digitKetiga);
console.log("Step:", step);
console.log("");

let deret: number[] = [];

for (let i = 0; i < 10; i++) {
  deret.push(start + i * step);
}

console.log("10 angka pertama:");
console.log(deret.join(", "));
```

### 3.3 Penjelasan per baris

| Baris | Kode                            | Penjelasan                                                          |
| ----- | ------------------------------- | ------------------------------------------------------------------- |
| 4     | `let nim: string = "048068753"` | NIM sebagai teks                                                    |
| 7     | `Number(nim.slice(-2))`         | ambil 2 karakter terakhir `"53"` > angka `53`                       |
| 10    | `nim[nim.length - 3]`           | panjang NIM = 9, jadi indeks 9 − 3 = 6 > karakter `"7"` > angka `7` |
| 13    | `digitKetiga + 1`               | step = 7 + 1 = 8                                                    |
| 15–20 | `console.log(...)`              | cetak info supaya proses perhitungan terlihat                       |
| 22    | `let deret: number[] = []`      | array kosong penampung hasil                                        |
| 24    | `for (let i = 0; i < 10; i++)`  | ulang 10 kali, `i` = 0 sampai 9                                     |
| 25    | `deret.push(start + i * step)`  | hitung suku ke-(i+1) lalu simpan                                    |
| 28–29 | `deret.join(", ")`              | gabung hasil pakai koma lalu cetak                                  |

Kenapa `i` mulai dari 0? Supaya angka pertama = `start + 0 × step` = start itu sendiri (53).

### 3.4 Tracing

| `i` | rumus      | hasil                            |
| --- | ---------- | -------------------------------- |
| 0   | 53 + 0 × 8 | 53                               |
| 1   | 53 + 1 × 8 | 61                               |
| 2   | 53 + 2 × 8 | 69                               |
| 3   | 53 + 3 × 8 | 77                               |
| 4   | 53 + 4 × 8 | 85                               |
| 5   | 53 + 5 × 8 | 93                               |
| 6   | 53 + 6 × 8 | 101                              |
| 7   | 53 + 7 × 8 | 109                              |
| 8   | 53 + 8 × 8 | 117                              |
| 9   | 53 + 9 × 8 | 125                              |
| 10  | -          | berhenti, karena `10 < 10` salah |

### 3.5 Output

```text
SOAL 2 - DERET ARITMATIKA
NIM: 048068753
Start: 53
Digit ke-3 dari belakang: 7
Step: 8

10 angka pertama:
53, 61, 69, 77, 85, 93, 101, 109, 117, 125
```

### 3.6 Analisa

- Selisih tiap angka selalu 8 (61 − 53 = 8, 69 − 61 = 8, ...), membuktikan ini deret aritmatika dengan beda 8.
- Cek dengan rumus: suku ke-10 = 53 + (10 − 1) × 8 = 125, sama dengan output.
- Ada 2 cara mengambil digit dari belakang: `slice(-2)` (ambil beberapa karakter) dan `nim[nim.length - 3]` (ambil 1 karakter lewat indeks).

---

## 4. Soal 3 Bilangan Prima

### 4.1 Analisis soal

- Batas akhir = 2 digit terakhir + 10 = 53 + 10 = **63**.
- Bilangan prima = bilangan lebih dari 1 yang hanya habis dibagi 1 dan dirinya sendiri.
- Strategi: cek setiap angka dari 2 sampai 63. Untuk tiap angka, coba bagi dengan angka 2, 3, 4, ... Kalau ada yang habis dibagi (sisa 0), berarti bukan prima.

### 4.2 Kode `src/soal3.ts`

```typescript
// SOAL 3 - BILANGAN PRIMA
// NIM: 048068753

let nim: string = "048068753";

// 2 digit terakhir + 10 sebagai batas akhir
let batas: number = Number(nim.slice(-2)) + 10;

console.log("SOAL 3 - BILANGAN PRIMA");
console.log("NIM:", nim);
console.log("Batas akhir:", batas);
console.log("");

let prima: number[] = [];

for (let n = 2; n <= batas; n++) {
  let isPrima: boolean = true;

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      isPrima = false;
      break;
    }
  }

  if (isPrima) {
    prima.push(n);
  }
}

console.log("Bilangan prima dari 1 sampai " + batas + ":");
console.log(prima.join(", "));
```

### 4.3 Penjelasan per baris

| Baris | Kode                               | Penjelasan                                                          |
| ----- | ---------------------------------- | ------------------------------------------------------------------- |
| 7     | `Number(nim.slice(-2)) + 10`       | `"53"` > 53, ditambah 10 = 63                                       |
| 14    | `let prima: number[] = []`         | array penampung bilangan prima                                      |
| 16    | `for (let n = 2; n <= batas; n++)` | loop luar: cek angka 2 sampai 63. Mulai dari 2 karena 1 bukan prima |
| 17    | `let isPrima: boolean = true`      | anggap dulu `n` prima, nanti dibuktikan salah kalau ketemu pembagi  |
| 19    | `for (let i = 2; i * i <= n; i++)` | loop dalam: coba pembagi `i` dari 2 sampai akar `n`                 |
| 20    | `n % i === 0`                      | `%` = sisa bagi. Sisa 0 artinya `n` habis dibagi `i`                |
| 21    | `isPrima = false`                  | ketemu pembagi > bukan prima                                        |
| 22    | `break`                            | langsung keluar dari loop dalam, tidak perlu cek pembagi lain       |
| 26–28 | `if (isPrima) prima.push(n)`       | kalau tidak ada pembagi, simpan `n`                                 |
| 31–32 | `console.log(...)`                 | cetak hasil                                                         |

### 4.4 Kenapa cukup cek sampai akar `n` (`i * i <= n`)?

Pembagi selalu berpasangan. Contoh 36: 2 × 18, 3 × 12, 4 × 9, 6 × 6. Salah satu dari pasangan pasti ≤ √36 = 6. Jadi kalau sampai 6 tidak ada pembagi, di atas 6 juga pasti tidak ada. Ini membuat program lebih cepat: untuk n = 61 cukup cek i = 2 sampai 7 (7 × 7 = 49 ≤ 61, 8 × 8 = 64 > 61), bukan 2 sampai 60.

`i * i <= n` dipakai, bukan `i <= Math.sqrt(n)`, supaya tidak perlu menghitung akar (hasilnya sama).

### 4.5 Tracing beberapa angka

| `n` | pembagi `i` yang dicek    | hasil cek                    | prima?   |
| --- | ------------------------- | ---------------------------- | -------- |
| 2   | tidak ada (2 × 2 = 4 > 2) | loop dalam tidak jalan       | ✅ prima |
| 4   | i = 2                     | 4 % 2 = 0 > break            | ❌       |
| 9   | i = 2, 3                  | 9 % 2 = 1, 9 % 3 = 0 > break | ❌       |
| 25  | i = 2, 3, 4, 5            | 25 % 5 = 0 > break           | ❌       |
| 53  | i = 2 sampai 7            | tidak ada sisa 0             | ✅ prima |
| 63  | i = 2, 3                  | 63 % 3 = 0 > break           | ❌       |

### 4.6 Output

```text
SOAL 3 - BILANGAN PRIMA
NIM: 048068753
Batas akhir: 63

Bilangan prima dari 1 sampai 63:
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61
```

### 4.7 Analisa

- Ada **18** bilangan prima dari 1 sampai 63.
- Batas 63 sendiri bukan prima (63 = 7 × 9), jadi prima terbesar yang tercetak adalah 61.
- 2 adalah satu-satunya bilangan prima genap; semua bilangan genap lain habis dibagi 2.
- `break` membuat program efisien: begitu satu pembagi ditemukan, pengecekan berhenti.

---

## 5. Uji dengan NIM contoh soal (bukti program benar)

Ganti `let nim` di tiap file jadi `"230411013"`, jalankan lagi, bandingkan dengan contoh di soal:

| Soal | Hasil program                               | Contoh di soal |
| ---- | ------------------------------------------- | -------------- |
| 1    | tinggi 3: `1` / `1 2` / `1 2 3`             | sama           |
| 2    | start 13, step 0 + 1 = 1: `13, 14, ..., 22` | sama           |
| 3    | batas 23: `2, 3, 5, 7, 11, 13, 17, 19, 23`  | sama           |

Setelah dicoba, kembalikan NIM ke `"048068753"`.

---

## 6. Naskah rekaman video (± 10 menit)

Tips: buka VS Code (kode di kiri, terminal di bawah), font diperbesar, siapkan file ini di layar lain sebagai contekan.

### Bagian 1 Perkenalan (± 30 detik)

> "Selamat pagi/siang/sore. Perkenalkan nama saya I Kadek Wijaya Sashmitha Adhi C, NIM 048068753, dari UPBJJ ... Pada video ini saya akan menjelaskan Tugas 1 mata kuliah Pemrograman Berbasis Perangkat Bergerak, STSI4303, yaitu membuat 3 program TypeScript berdasarkan NIM."

### Bagian 2 Persiapan (± 1,5 menit)

Tampilkan: struktur folder, `package.json`, `tsconfig.json`, terminal.

> "Saya memakai VS Code, Node.js, dan TypeScript. Folder `src` berisi 3 file soal. TypeScript tidak bisa langsung dijalankan, jadi harus dikompilasi dulu oleh `tsc` jadi JavaScript di folder `dist`, lalu dijalankan pakai Node. Perintah `npm run soal1` melakukan dua langkah itu sekaligus."

> "Sebelum mulai, saya analisis NIM saya 048068753. NIM saya simpan sebagai string supaya angka 0 di depan tidak hilang. Digit terakhir 3, dua digit terakhir 53, digit ke-3 dari belakang 7." (tunjuk tabel indeks di bagian 1.6)

### Bagian 3 Soal 1 (± 2,5 menit)

1. Buka `soal1.ts`. Bacakan soal singkat.
2. Jelaskan baris 4 dan 7: `slice(-1)` ambil digit terakhir, `Number()` ubah ke angka > tinggi = 3.
3. Jelaskan loop luar (baris) dan loop dalam (angka). Tekankan: baris ke-`i` berisi angka 1 sampai `i`.
4. Jelaskan kenapa `baris` dibuat ulang di dalam loop luar.
5. Jalankan `npm run soal1`, tunjuk output. Cocokkan dengan tabel tracing 2.4.

> "Loop luar menentukan nomor baris, loop dalam mengisi angka dari 1 sampai nomor baris itu. Hasilnya segitiga 3 baris sesuai digit terakhir NIM saya."

### Bagian 4 Soal 2 (± 2,5 menit)

1. Buka `soal2.ts`.
2. Jelaskan `slice(-2)` > 53 dan `nim[nim.length - 3]` > indeks 6 > 7.
3. Jelaskan step + 1 mengikuti contoh soal.
4. Jelaskan rumus `start + i * step` dan kenapa `i` mulai dari 0.
5. Jalankan `npm run soal2`. Tunjukkan selisih tiap angka selalu 8, dan cek suku ke-10 = 53 + 9 × 8 = 125.

### Bagian 5 Soal 3 (± 2,5 menit)

1. Buka `soal3.ts`.
2. Batas = 53 + 10 = 63.
3. Jelaskan definisi prima, kenapa loop mulai dari 2.
4. Jelaskan `isPrima = true` di awal, `%` sisa bagi, `break`.
5. Jelaskan optimasi `i * i <= n` pakai contoh pasangan pembagi 36.
6. Jalankan `npm run soal3`. Sebut ada 18 bilangan prima, 63 tidak termasuk karena 7 × 9.

### Bagian 6 Uji NIM contoh (± 1 menit, opsional tapi bagus)

Ganti NIM ke `230411013` di satu file (mis. `soal2.ts`), jalankan, tunjukkan hasil sama dengan contoh soal `13, 14, ..., 22`. Kembalikan NIM.

> "Ini membuktikan program tidak hardcode hasil, tapi benar-benar menghitung dari NIM."

### Bagian 7 Penutup (± 30 detik)

> "Kesimpulannya, ketiga program berhasil dibuat dengan TypeScript memakai variabel bertipe, perulangan for, nested loop, array, dan percabangan if. Hasilnya otomatis menyesuaikan NIM. Kendala yang saya temui ... (isi sendiri, mis. memahami kenapa NIM harus string). Sekian penjelasan dari saya, terima kasih."

---

## 7. Kemungkinan pertanyaan tutor (persiapan)

| Pertanyaan                                 | Jawaban singkat                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Kenapa pakai TypeScript, bukan JavaScript? | TypeScript menambah tipe data; kesalahan tipe ketahuan saat kompilasi, sebelum program jalan |
| Apa beda `let` dan `const`?                | `let` bisa diubah nilainya, `const` tidak. `isPrima` harus `let` karena berubah jadi `false` |
| Kenapa `===` bukan `==`?                   | `===` membandingkan nilai dan tipe sekaligus, lebih aman                                     |
| Apa yang terjadi kalau digit terakhir 0?   | Soal 1 tidak mencetak apa pun karena loop `i <= 0` tidak jalan                               |
| Kenapa step ditambah 1?                    | Mengikuti contoh soal; mencegah step 0 yang membuat deret tidak berubah                      |
