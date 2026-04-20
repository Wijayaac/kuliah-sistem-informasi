# Kuliah Sistem Informasi (Universitas Terbuka)

Repositori kerja pribadi untuk **kuliah Program Studi Sistem Informasi UT**: materi, catatan, dan **konfigurasi Cursor** agar bantuan AI tetap selaras dengan **BMP**, **tuton**, dan gaya jawaban yang Anda inginkan.

Ini **bukan** repositori resmi UT; aturan penilaian, jadwal, dan tugas selalu mengikuti **dokumen resmi** di portal UT dan aplikasi Tuton.

---

## Isi utama

| Lokasi                                                                         | Fungsi                                                                                                                            |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| [`.cursor/skills/skills.md`](.cursor/skills/skills.md)                         | Indeks **skill per mata kuliah** (tautan ke file skill)                                                                           |
| [`.cursor/skills/tutor-shared-style.md`](.cursor/skills/tutor-shared-style.md) | Indeks gaya: salam Menurut saya Terimakasih Sumber BMP persona aturan chat |
| [`.cursor/skills/tutor-answer-modes.md`](.cursor/skills/tutor-answer-modes.md) | Mode jawaban **asli** (cepat) vs **tuned** (sedikit koma dan kata lebih rapi tanpa kaku) |
| [`.cursor/skills/*-tutor-*.md`](.cursor/skills/)                               | Skill per kode mata kuliah: konteks BMP, sesi tuton, bobot nilai, kebijakan bantuan (kerangka vs jawaban siap kumpul)             |

Di chat Cursor, Anda bisa memicu skill lewat deskripsi di frontmatter tiap file, atau dengan meminta eksplisit: _“pakai skill MKDI4203”_ / _“ikuti tutor-shared-style”_.

---

## Mata kuliah yang sudah ada (skill)

Ringkasan ada di [`skills.md`](.cursor/skills/skills.md). Saat ini mencakup antara lain: Kewirausahaan di Era Digital (MKDI4203), Metodologi Penelitian (STSI4310), Pemrograman Berbasis Desktop (STSI4201), Pengantar Sains Data (STDA4101), Rekayasa Perangkat Lunak (STSI4202), Sistem Informasi Manajemen (MSIM4207).

---

## Menambah topik atau mata kuliah baru

1. **Salin** salah satu `*-tutor-*.md` yang strukturnya mirip, lalu ganti judul, kode, BMP, capaian, dan aturan tuton dari silabus/RAT Anda.
2. **Perbarui** [`.cursor/skills/skills.md`](.cursor/skills/skills.md): tambahkan baris di tabel + satu frasa di baris **Ringkas** bila perlu.
3. **Jangan menyalin** gaya jawaban panjang ke setiap file: persona dan mode asli atau tuned di [tutor-shared-style.md](.cursor/skills/tutor-shared-style.md) dan [tutor-answer-modes.md](.cursor/skills/tutor-answer-modes.md); skill cukup merujuk konteks kursus.
4. Opsional: simpan **template prompt** Anda (mis. format soal–jawab) di file baru di root repo dan tautkan dari README ini jika dipakai rutin.

---

## Integritas akademik

Skill dirancang untuk **pemahaman, kerangka, dan contoh** — bukan menggantikan tugas, diskusi, rekaman praktik, atau karya yang harus orisinal. Patuhi aturan plagiarisme, pengumpulan via Tuton, dan panduan tutor kampus Anda.

---

## Lisensi & kontribusi

Proyek pribadi untuk studi; tidak ada klaim atas materi UT. Dokumen BMP adalah hak penerbit/UT.
