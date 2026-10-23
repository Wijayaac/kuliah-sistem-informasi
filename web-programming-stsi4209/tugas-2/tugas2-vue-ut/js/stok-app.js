/* ==========================================================
   stok-app.js — Logika Vue 3 untuk halaman stok.html
   Tugas Praktik 2 STSI4209 · SITTA Universitas Terbuka

   Konsep Vue yang dipakai (Options API, tanpa komponen):
   - data()     : state reaktif halaman (stok, filter, form)
   - computed   : filter + sort + statistik (di-cache, tidak recompute)
   - methods    : aksi pengguna (simpan, edit, reset, format)
   - watch      : memantau perubahan data (minimal 2 watcher)
   Sumber data : konstanta global `dataBahanAjar` (js/dataBahanAjar.js)
   ========================================================== */

const { createApp } = Vue;

// Kunci localStorage agar perubahan stok tetap ada setelah refresh
const STORAGE_KEY_STOK = "sitta-vue-stok";

// Salinan dalam (deep copy) agar data asli dataBahanAjar tidak ikut berubah
function cloneData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Ambil data stok dari localStorage (jika pernah disimpan), jika tidak pakai data dummy
function loadStokAwal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_STOK);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    /* localStorage tidak tersedia -> pakai data dummy */
  }
  return cloneData(dataBahanAjar.stok);
}

// Nilai awal filter (dipakai juga oleh tombol Reset)
function filterAwal() {
  return {
    keyword: "",
    upbjj: "", // "" = Semua UT-Daerah
    kategori: "", // "" = Semua kategori (hanya muncul setelah upbjj dipilih)
    reorderOnly: false, // checkbox: hanya qty < safety atau qty = 0
    sortBy: "judul", // judul | qty | harga
    sortDir: "asc", // asc | desc
    status: "", // filter cepat dari kartu statistik: "" | Aman | Menipis | Kosong
  };
}

// Form tambah bahan ajar kosong
function itemBaru() {
  return {
    kode: "",
    judul: "",
    kategori: "",
    upbjj: "",
    lokasiRak: "",
    harga: null,
    qty: null,
    safety: null,
    catatanHTML: "",
  };
}

createApp({
  /* ========================================================
     [data] State reaktif
     ======================================================== */
  data() {
    return {
      // Data master dari file dummy
      upbjjList: dataBahanAjar.upbjjList,
      kategoriList: dataBahanAjar.kategoriList,
      stok: loadStokAwal(),

      // State filter & sort
      filter: filterAwal(),

      // State form tambah bahan ajar
      showAddForm: false,
      newItem: itemBaru(),
      addSubmitted: false, // error baru tampil setelah tombol Simpan ditekan / field disentuh
      touched: {},

      // State modal edit stok
      editIndex: -1, // index item di array stok yang sedang diedit (-1 = tidak ada)
      editForm: null,
      editInfo: "", // pesan dari watcher qty edit

      // UI
      navOpen: false,
      lastUpdated: null,
      highlightKode: null,
      toasts: [],
    };
  },

  /* ========================================================
     [computed] Properti turunan — DI-CACHE oleh Vue.
     Hanya dihitung ulang bila data yang dipakai berubah,
     sehingga mengganti sort tidak memfilter ulang, dsb.
     ======================================================== */
  computed: {
    // Dependent options: daftar kategori + jumlah item untuk UT-Daerah terpilih
    kategoriOptions() {
      const diDaerah = this.stok.filter((s) => s.upbjj === this.filter.upbjj);
      return this.kategoriList.map((k) => ({
        nama: k,
        jumlah: diDaerah.filter((s) => s.kategori === k).length,
      }));
    },

    // Langkah 1: FILTER (UT-Daerah, kategori, re-order, status, keyword)
    filteredStok() {
      const f = this.filter;
      const kw = f.keyword.trim().toLowerCase();
      return this.stok.filter((item) => {
        if (f.upbjj && item.upbjj !== f.upbjj) return false;
        if (f.upbjj && f.kategori && item.kategori !== f.kategori) return false;
        if (f.reorderOnly && !(item.qty < item.safety || item.qty === 0)) return false;
        if (f.status && this.statusOf(item).label !== f.status) return false;
        if (kw && !(item.kode.toLowerCase().includes(kw) || item.judul.toLowerCase().includes(kw))) return false;
        return true;
      });
    },

    // Langkah 2: SORT hasil filter (judul / qty / harga, naik / turun)
    sortedStok() {
      const { sortBy, sortDir } = this.filter;
      const arah = sortDir === "asc" ? 1 : -1;
      // slice() supaya array hasil filter (cache) tidak ikut termutasi
      return this.filteredStok.slice().sort((a, b) => {
        if (sortBy === "judul") return a.judul.localeCompare(b.judul, "id") * arah;
        return (a[sortBy] - b[sortBy]) * arah;
      });
    },

    // Statistik ringkas untuk kartu di atas tabel
    ringkasan() {
      const r = { total: this.stok.length, aman: 0, menipis: 0, kosong: 0, totalQty: 0 };
      this.stok.forEach((s) => {
        r.totalQty += s.qty;
        const st = this.statusOf(s).label;
        if (st === "Aman") r.aman++;
        else if (st === "Menipis") r.menipis++;
        else r.kosong++;
      });
      return r;
    },

    // Apakah ada filter aktif (untuk menampilkan chip & mengaktifkan tombol Reset)
    adaFilterAktif() {
      const f = this.filter;
      const awal = filterAwal();
      return Object.keys(awal).some((k) => f[k] !== awal[k]);
    },

    // Validasi form tambah — mengembalikan objek { namaField: pesanError }
    addErrors() {
      const n = this.newItem;
      const e = {};
      const kode = (n.kode || "").trim().toUpperCase();
      if (!kode) e.kode = "Kode mata kuliah wajib diisi.";
      else if (!/^[A-Z]{4}\d{4}$/.test(kode)) e.kode = "Format kode: 4 huruf + 4 angka, cth. EKMA4116.";
      else if (this.stok.some((s) => s.kode === kode && s.upbjj === n.upbjj))
        e.kode = `Kode ${kode} sudah ada di UT-Daerah ${n.upbjj}.`;

      if (!n.judul.trim()) e.judul = "Judul mata kuliah wajib diisi.";
      else if (n.judul.trim().length < 3) e.judul = "Judul minimal 3 karakter.";

      if (!n.kategori) e.kategori = "Pilih kategori mata kuliah.";
      if (!n.upbjj) e.upbjj = "Pilih UT-Daerah.";

      if (!n.lokasiRak.trim()) e.lokasiRak = "Lokasi rak wajib diisi.";
      else if (!/^R\d+-[A-Z]\d+$/i.test(n.lokasiRak.trim())) e.lokasiRak = "Format lokasi rak: R1-A3.";

      const cekAngka = (val, label, min) => {
        if (val === null || val === "") return `${label} wajib diisi.`;
        if (typeof val !== "number" || Number.isNaN(val)) return `${label} harus berupa angka.`;
        if (!Number.isInteger(val)) return `${label} harus bilangan bulat.`;
        if (val < min) return `${label} minimal ${min}.`;
        return null;
      };
      const eh = cekAngka(n.harga, "Harga", 0);
      if (eh) e.harga = eh;
      const eq = cekAngka(n.qty, "Jumlah stok", 0);
      if (eq) e.qty = eq;
      const es = cekAngka(n.safety, "Safety stock", 1);
      if (es) e.safety = es;

      if (n.catatanHTML.length > 200) e.catatanHTML = "Catatan maksimal 200 karakter.";
      return e;
    },

    addFormValid() {
      return Object.keys(this.addErrors).length === 0;
    },

    // Validasi form edit stok
    editErrors() {
      const e = {};
      if (!this.editForm) return e;
      const f = this.editForm;
      ["qty", "safety", "harga"].forEach((k) => {
        const v = f[k];
        if (v === null || v === "" || typeof v !== "number" || Number.isNaN(v)) e[k] = "Wajib diisi angka.";
        else if (!Number.isInteger(v) || v < 0) e[k] = "Harus bilangan bulat ≥ 0.";
      });
      if (!e.safety && f.safety < 1) e.safety = "Safety minimal 1.";
      if (!f.lokasiRak.trim()) e.lokasiRak = "Lokasi rak wajib diisi.";
      return e;
    },

    // Item yang sedang diedit (untuk judul modal)
    itemDiedit() {
      return this.editIndex >= 0 ? this.stok[this.editIndex] : null;
    },
  },

  /* ========================================================
     [watch] Memantau perubahan data
     ======================================================== */
  watch: {
    // WATCHER 1: saat UT-Daerah berganti, kategori di-reset
    // (dependent options: kategori lama belum tentu ada di daerah baru)
    "filter.upbjj"(baru, lama) {
      this.filter.kategori = "";
      if (baru) this.toast(`Menampilkan stok UT-Daerah ${baru}. Filter kategori kini tersedia.`, "info");
    },

    // WATCHER 2 (deep): setiap perubahan array stok (tambah / edit) disimpan ke localStorage
    stok: {
      handler(baru) {
        try {
          localStorage.setItem(STORAGE_KEY_STOK, JSON.stringify(baru));
        } catch (e) {
          /* abaikan jika localStorage diblokir */
        }
        this.lastUpdated = new Date();
      },
      deep: true,
    },

    // WATCHER 3: kode bahan ajar baru otomatis huruf besar & tanpa spasi
    "newItem.kode"(val) {
      const rapi = (val || "").toUpperCase().replace(/\s+/g, "");
      if (rapi !== val) this.newItem.kode = rapi;
    },

    // WATCHER 4: memantau qty yang sedang diedit -> beri peringatan status secara langsung
    "editForm.qty"(qty) {
      if (!this.editForm || typeof qty !== "number") {
        this.editInfo = "";
        return;
      }
      if (qty === 0) this.editInfo = "⛔ Stok akan KOSONG, segera lakukan re-order!";
      else if (qty < this.editForm.safety) this.editInfo = `⚠️ Stok di bawah safety (${this.editForm.safety}), status menjadi Menipis.`;
      else this.editInfo = "✅ Stok aman.";
    },
  },

  /* ========================================================
     [methods] Fungsi yang dipanggil dari template / event
     ======================================================== */
  methods: {
    // Status stok: Kosong (qty = 0), Menipis (qty < safety), Aman (qty >= safety)
    statusOf(item) {
      if (item.qty === 0) return { label: "Kosong", icon: "⛔", kelas: "status-kosong" };
      if (item.qty < item.safety) return { label: "Menipis", icon: "⚠️", kelas: "status-menipis" };
      return { label: "Aman", icon: "✅", kelas: "status-aman" };
    },

    // Persentase qty terhadap 2x safety (untuk bar kecil)
    persenQty(item) {
      const max = Math.max(item.safety * 2, 1);
      return Math.min(100, Math.round((item.qty / max) * 100));
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka || 0);
    },

    formatJam(d) {
      return d ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "-";
    },

    // Klik header kolom / tombol arah sort
    setSort(kolom) {
      if (this.filter.sortBy === kolom) {
        this.filter.sortDir = this.filter.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.filter.sortBy = kolom;
        this.filter.sortDir = "asc";
      }
    },

    toggleSortDir() {
      this.filter.sortDir = this.filter.sortDir === "asc" ? "desc" : "asc";
    },

    // Filter cepat dari kartu statistik
    setStatusFilter(status) {
      this.filter.status = this.filter.status === status ? "" : status;
    },

    // Tombol Reset filter
    resetFilter() {
      this.filter = filterAwal();
      this.toast("Filter dan urutan dikembalikan ke awal.", "info");
    },

    // Kembalikan data stok seperti file dummy (menghapus perubahan di localStorage)
    resetData() {
      if (!confirm("Kembalikan data stok ke data awal? Perubahan yang tersimpan akan hilang.")) return;
      this.stok = cloneData(dataBahanAjar.stok);
      this.toast("Data stok dikembalikan ke data awal.", "warning");
    },

    /* ---------- Form tambah ---------- */
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
    },

    touch(field) {
      this.touched[field] = true;
    },

    // Error hanya ditampilkan bila field sudah disentuh atau form sudah disubmit
    errorOf(field) {
      return this.addSubmitted || this.touched[field] ? this.addErrors[field] : "";
    },

    simpanBaru() {
      this.addSubmitted = true;
      if (!this.addFormValid) {
        this.toast("Periksa kembali isian formulir yang ditandai merah.", "error");
        return;
      }
      const n = this.newItem;
      const item = {
        kode: n.kode.trim().toUpperCase(),
        judul: n.judul.trim(),
        kategori: n.kategori,
        upbjj: n.upbjj,
        lokasiRak: n.lokasiRak.trim().toUpperCase(),
        harga: n.harga,
        qty: n.qty,
        safety: n.safety,
        catatanHTML: n.catatanHTML.trim() || "<em>-</em>",
      };
      this.stok.push(item);
      this.highlightKode = item.kode + item.upbjj;
      setTimeout(() => (this.highlightKode = null), 2500);
      this.toast(`Bahan ajar ${item.kode} - ${item.judul} berhasil ditambahkan.`, "success");
      this.batalTambah();
    },

    batalTambah() {
      this.newItem = itemBaru();
      this.addSubmitted = false;
      this.touched = {};
      this.showAddForm = false;
    },

    /* ---------- Edit stok (modal) ---------- */
    bukaEdit(item) {
      this.editIndex = this.stok.indexOf(item);
      this.editForm = {
        qty: item.qty,
        safety: item.safety,
        harga: item.harga,
        lokasiRak: item.lokasiRak,
        catatanHTML: item.catatanHTML,
      };
    },

    tutupEdit() {
      this.editIndex = -1;
      this.editForm = null;
      this.editInfo = "";
    },

    // Tombol +/- di modal edit
    ubahQty(delta) {
      const q = typeof this.editForm.qty === "number" ? this.editForm.qty : 0;
      this.editForm.qty = Math.max(0, q + delta);
    },

    simpanEdit() {
      if (Object.keys(this.editErrors).length) {
        this.toast("Data edit belum valid.", "error");
        return;
      }
      const item = this.stok[this.editIndex];
      Object.assign(item, {
        qty: this.editForm.qty,
        safety: this.editForm.safety,
        harga: this.editForm.harga,
        lokasiRak: this.editForm.lokasiRak.trim().toUpperCase(),
        catatanHTML: this.editForm.catatanHTML,
      });
      this.toast(`Stok ${item.kode} diperbarui (qty ${item.qty}).`, "success");
      this.tutupEdit();
    },

    /* ---------- Toast notifikasi ---------- */
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
    this.lastUpdated = new Date();
    // Tutup modal edit dengan tombol Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.editForm) this.tutupEdit();
    });
  },
}).mount("#app");
