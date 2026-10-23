/* ==========================================================
   tracking-app.js — Logika Vue 3 untuk halaman tracking.html
   Tugas Praktik 2 STSI4209 · SITTA Universitas Terbuka

   Konsep Vue yang dipakai (Options API, tanpa komponen):
   - data()   : daftar DO, kata kunci pencarian, form DO baru
   - computed : nomor DO otomatis, daftar/hasil pencarian, detail paket
   - methods  : simpan DO, format rupiah/tanggal, tahap pengiriman
   - watch    : paket -> total harga, NIM -> validasi langsung,
                tracking -> localStorage, keyword -> auto pilih
   Sumber data: konstanta global `dataBahanAjar` (js/dataBahanAjar.js)
   ========================================================== */

const { createApp } = Vue;

const STORAGE_KEY_TRACKING = "sitta-vue-tracking";

// Label ekspedisi JNE untuk setiap kode di pengirimanList
const LABEL_EKSPEDISI = { REG: "JNE Regular", EXP: "JNE Express" };

// Tahapan pengiriman (sama seperti Tugas 1)
const TRACKING_STEPS = [
  { label: "Diterima Loket", icon: "bi-box-seam", keyword: "penerimaan" },
  { label: "Dalam Perjalanan", icon: "bi-truck", keyword: "hub" },
  { label: "Diteruskan", icon: "bi-geo-alt", keyword: "diteruskan" },
  { label: "Selesai", icon: "bi-check-circle", keyword: "selesai" },
];

function cloneData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadTrackingAwal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_TRACKING);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    /* abaikan */
  }
  return cloneData(dataBahanAjar.tracking);
}

// Tanggal lokal hari ini format YYYY-MM-DD (pakai Date lokal, BUKAN toISOString yang UTC)
function hariIni() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Waktu lokal lengkap YYYY-MM-DD HH:mm:ss untuk log perjalanan
function waktuSekarang() {
  const d = new Date();
  const jam = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
  return `${hariIni()} ${jam}`;
}

function formDOKosong() {
  return {
    nim: "",
    nama: "",
    ekspedisi: "",
    paketKode: "",
    tanggalKirim: hariIni(), // default: tanggal lokal hari ini (bisa diubah manual)
    total: 0,
  };
}

createApp({
  /* ========================================================
     [data] State reaktif
     ======================================================== */
  data() {
    return {
      pengirimanList: dataBahanAjar.pengirimanList,
      paketList: dataBahanAjar.paket,
      stok: dataBahanAjar.stok,
      tracking: loadTrackingAwal(), // objek { "DO2025-0001": {...}, ... }

      keyword: "",
      selectedDO: null,

      form: formDOKosong(),
      errors: {}, // pesan error per field
      submitted: false,

      steps: TRACKING_STEPS,
      navOpen: false,
      toasts: [],
    };
  },

  /* ========================================================
     [computed] Properti turunan (di-cache)
     ======================================================== */
  computed: {
    // Nomor DO otomatis: DO + tahun berjalan + "-" + sequence 3 digit
    // Sequence = nomor urut terbesar pada data tracking + 1
    nomorDOBaru() {
      const tahun = new Date().getFullYear();
      const urutan = Object.keys(this.tracking).map((no) => {
        const m = /^DO\d{4}-(\d+)$/.exec(no);
        return m ? parseInt(m[1], 10) : 0;
      });
      let seq = Math.max(0, ...urutan) + 1;
      let nomor = `DO${tahun}-${String(seq).padStart(3, "0")}`;
      while (this.tracking[nomor]) nomor = `DO${tahun}-${String(++seq).padStart(3, "0")}`;
      return nomor;
    },

    // Objek tracking diubah menjadi array agar mudah di-v-for dan diurutkan (terbaru di atas)
    daftarDO() {
      return Object.entries(this.tracking)
        .map(([nomorDO, d]) => ({ nomorDO, ...d }))
        .sort((a, b) => b.tanggalKirim.localeCompare(a.tanggalKirim) || b.nomorDO.localeCompare(a.nomorDO));
    },

    // Hasil pencarian berdasarkan nomor DO, NIM, atau nama
    hasilCari() {
      const kw = this.keyword.trim().toLowerCase();
      if (!kw) return this.daftarDO;
      return this.daftarDO.filter(
        (d) => d.nomorDO.toLowerCase().includes(kw) || d.nim.includes(kw) || d.nama.toLowerCase().includes(kw)
      );
    },

    // Data DO yang sedang dibuka detailnya
    detailDO() {
      if (!this.selectedDO || !this.tracking[this.selectedDO]) return null;
      return { nomorDO: this.selectedDO, ...this.tracking[this.selectedDO] };
    },

    // Timeline perjalanan diurutkan terbaru di atas
    timelineDetail() {
      if (!this.detailDO) return [];
      return [...this.detailDO.perjalanan].sort((a, b) => b.waktu.localeCompare(a.waktu));
    },

    // Opsi ekspedisi: dari pengirimanList, diberi label JNE Regular / JNE Express
    opsiEkspedisi() {
      return this.pengirimanList.map((p) => ({
        kode: p.kode,
        label: LABEL_EKSPEDISI[p.kode] || p.nama,
        keterangan: p.nama,
      }));
    },

    // Paket yang dipilih di form (untuk detail isi paket di bawah <select>)
    paketTerpilih() {
      return this.paketList.find((p) => p.kode === this.form.paketKode) || null;
    },

    // Isi paket lengkap dengan judul bahan ajar (dicari di data stok)
    isiPaketTerpilih() {
      if (!this.paketTerpilih) return [];
      return this.paketTerpilih.isi.map((kode) => {
        const bahan = this.stok.find((s) => s.kode === kode);
        return { kode, judul: bahan ? bahan.judul : "(judul tidak ditemukan)" };
      });
    },

    formValid() {
      return Object.keys(this.validasi()).length === 0;
    },
  },

  /* ========================================================
     [watch] Memantau perubahan data
     ======================================================== */
  watch: {
    // WATCHER 1: setiap paket berganti, Total Harga otomatis diambil dari paket.harga
    "form.paketKode"(kode) {
      const p = this.paketList.find((x) => x.kode === kode);
      this.form.total = p ? p.harga : 0;
      if (this.submitted || kode) this.errors = this.validasi();
    },

    // WATCHER 2: NIM dipantau -> validasi langsung saat mengetik (hanya angka, 9 digit)
    "form.nim"(nim) {
      if (!nim && !this.submitted) {
        delete this.errors.nim;
        return;
      }
      const e = this.validasi();
      if (e.nim) this.errors.nim = e.nim;
      else delete this.errors.nim;
    },

    // WATCHER 3 (deep): data tracking disimpan ke localStorage setiap ada DO baru
    tracking: {
      handler(val) {
        try {
          localStorage.setItem(STORAGE_KEY_TRACKING, JSON.stringify(val));
        } catch (e) {
          /* abaikan */
        }
      },
      deep: true,
    },

    // WATCHER 4: bila pencarian menghasilkan tepat 1 DO, detailnya langsung dibuka
    hasilCari(list) {
      if (this.keyword.trim() && list.length === 1) this.selectedDO = list[0].nomorDO;
    },
  },

  /* ========================================================
     [methods]
     ======================================================== */
  methods: {
    // Validasi semua field form, kembalikan { field: pesan }
    validasi() {
      const f = this.form;
      const e = {};
      if (!f.nim.trim()) e.nim = "NIM wajib diisi.";
      else if (!/^\d+$/.test(f.nim.trim())) e.nim = "NIM hanya boleh berisi angka.";
      else if (f.nim.trim().length !== 9) e.nim = `NIM harus 9 digit (sekarang ${f.nim.trim().length}).`;

      if (!f.nama.trim()) e.nama = "Nama wajib diisi.";
      else if (f.nama.trim().length < 3) e.nama = "Nama minimal 3 karakter.";
      else if (!/^[A-Za-z .'-]+$/.test(f.nama.trim())) e.nama = "Nama hanya huruf, spasi, titik, atau tanda petik.";

      if (!f.ekspedisi) e.ekspedisi = "Pilih ekspedisi.";
      if (!f.paketKode) e.paketKode = "Pilih paket bahan ajar.";
      if (!f.tanggalKirim) e.tanggalKirim = "Tanggal kirim wajib diisi.";
      return e;
    },

    // Validasi satu field saat blur (agar error muncul setelah pengguna meninggalkan field)
    cekField(field) {
      const e = this.validasi();
      if (e[field]) this.errors[field] = e[field];
      else delete this.errors[field];
    },

    simpanDO() {
      this.submitted = true;
      this.errors = this.validasi();
      if (Object.keys(this.errors).length) {
        this.toast("Lengkapi data DO yang ditandai merah.", "error");
        return;
      }
      const nomor = this.nomorDOBaru;
      const eksp = this.opsiEkspedisi.find((o) => o.kode === this.form.ekspedisi);
      // Menambah key baru pada objek reaktif -> otomatis muncul di daftar (Vue 3 Proxy)
      this.tracking[nomor] = {
        nim: this.form.nim.trim(),
        nama: this.form.nama.trim(),
        status: "Diproses",
        ekspedisi: eksp ? eksp.label : this.form.ekspedisi,
        tanggalKirim: this.form.tanggalKirim,
        paket: this.form.paketKode,
        total: this.form.total,
        perjalanan: [{ waktu: waktuSekarang(), keterangan: "Penerimaan di Loket: UT Pusat (DO dibuat)" }],
      };
      this.selectedDO = nomor;
      this.keyword = "";
      this.toast(`DO ${nomor} berhasil dibuat.`, "success");
      this.resetForm();
    },

    resetForm() {
      this.form = formDOKosong();
      this.errors = {};
      this.submitted = false;
    },

    setHariIni() {
      this.form.tanggalKirim = hariIni();
    },

    pilihDO(nomor) {
      this.selectedDO = this.selectedDO === nomor ? null : nomor;
    },

    resetData() {
      if (!confirm("Hapus semua DO baru dan kembalikan data tracking awal?")) return;
      this.tracking = cloneData(dataBahanAjar.tracking);
      this.selectedDO = null;
      this.toast("Data tracking dikembalikan ke data awal.", "warning");
    },

    // Tahap pengiriman (0-4) berdasarkan kata kunci log perjalanan (logika Tugas 1)
    tahap(perjalanan) {
      let t = 0;
      perjalanan.forEach((log) => {
        const ket = log.keterangan.toLowerCase();
        this.steps.forEach((s, i) => {
          if (ket.includes(s.keyword)) t = Math.max(t, i + 1);
        });
      });
      return t;
    },

    persen(perjalanan) {
      return (this.tahap(perjalanan) / this.steps.length) * 100;
    },

    // Kelas badge status (dipakai via v-bind:class di panel detail)
    badgeStatus(status) {
      const s = status.toLowerCase();
      if (s.includes("selesai")) return "badge-success";
      if (s.includes("perjalanan")) return "badge-warning";
      return "badge-info";
    },

    namaPaket(kode) {
      const p = this.paketList.find((x) => x.kode === kode);
      return p ? `${p.kode} — ${p.nama}` : kode;
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka || 0);
    },

    formatTanggal(iso) {
      if (!iso) return "-";
      const [y, m, d] = iso.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    },

    toast(pesan, tipe = "info") {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, pesan, tipe });
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
      }, 3000);
    },

    toastIcon(tipe) {
      return {
        success: "bi-check-circle-fill",
        error: "bi-x-circle-fill",
        warning: "bi-exclamation-triangle-fill",
        info: "bi-info-circle-fill",
      }[tipe];
    },
  },

  mounted() {
    // Buka detail DO pertama agar halaman tidak kosong saat dibuka
    if (this.daftarDO.length) this.selectedDO = this.daftarDO[0].nomorDO;
  },
}).mount("#app");
