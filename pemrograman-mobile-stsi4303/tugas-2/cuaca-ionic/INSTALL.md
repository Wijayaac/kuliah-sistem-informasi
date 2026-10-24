# Cuaca Jakarta (Ionic + Vue 3) — Panduan Instalasi

## Prasyarat
1. Install Node.js LTS (v20+) dari https://nodejs.org. Cek dengan `node -v` dan `npm -v`.
2. Install Ionic CLI: `npm i -g @ionic/cli` (kalau ada error permission, pakai `npx @ionic/cli ...` sebagai gantinya).

## Menjalankan di Browser
1. Masuk folder proyek: `cd cuaca-ionic`
2. Install dependency: `npm install`
3. Jalankan: `ionic serve` → terbuka di http://localhost:8100
4. Agar tampil seperti HP: buka DevTools Chrome (Cmd+Opt+I) → klik ikon *Toggle device toolbar* (Cmd+Shift+M) → pilih perangkat, mis. Pixel 7.

## Preview di HP Android
### Opsi A — Lewat Wi-Fi yang sama (paling cepat)
1. Pastikan laptop dan HP terhubung ke Wi-Fi yang sama.
2. Jalankan `ionic serve --external`.
3. Catat alamat IP yang tampil (mis. `http://192.168.1.10:8100`), lalu buka di Chrome HP.
4. Jika macOS menampilkan dialog firewall "Allow incoming connections?", pilih **Allow**.

### Opsi B — APK asli via Capacitor
1. Install Android Studio (https://developer.android.com/studio) beserta Android SDK.
2. Build web: `ionic build`
3. Tambah platform Android: `npx cap add android`
4. Sinkronisasi: `npx cap sync`
5. Buka di Android Studio: `npx cap open android`
6. Di HP: aktifkan *Opsi Developer* (ketuk *Nomor Build* 7x) → aktifkan *USB Debugging* → sambungkan kabel USB.
7. Di Android Studio pilih HP Anda lalu klik **Run ▶**.
8. Alternatif live reload: `ionic cap run android -l --external`

## Build Produksi
`npm run build` → hasil di folder `dist/`.
