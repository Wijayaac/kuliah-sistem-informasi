/* ==========================================================
   stock-table.js — <ba-stock-table>  (template: #tpl-stock)
   Props : items (stok), upbjjList, kategoriList
   Emits : create(item), update({key, data}), delete(item)
   Komponen TIDAK mengubah props langsung; perubahan dikirim
   ke root lewat $emit (one-way data flow).
   ========================================================== */

function stokKosong() {
  return { kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: null, qty: null, safety: null, catatanHTML: "" };
}
function filterAwal() {
  return { keyword: "", upbjj: "", kategori: "", reorderOnly: false, sortBy: "judul", sortDir: "asc" };
}

Vue.component("ba-stock-table", {
  template: "#tpl-stock",
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, default: function () { return []; } },
    kategoriList: { type: Array, default: function () { return []; } },
  },
  data: function () {
    return {
      filter: filterAwal(),
      showForm: false,
      form: stokKosong(),
      submitted: false,
      editKey: null, // { kode, upbjj } item yang sedang diedit
      editForm: null,
      editSubmitted: false,
    };
  },
  computed: {
    /* --- Rantai computed: filteredItems -> sortedItems (di-cache Vue) --- */
    filteredItems: function () {
      var f = this.filter;
      var kw = f.keyword.trim().toLowerCase();
      return this.items.filter(function (s) {
        if (f.upbjj && s.upbjj !== f.upbjj) return false;
        if (f.kategori && s.kategori !== f.kategori) return false;
        if (f.reorderOnly && !(s.qty < s.safety || s.qty === 0)) return false;
        if (kw && (s.kode + " " + s.judul).toLowerCase().indexOf(kw) === -1) return false;
        return true;
      });
    },
    sortedItems: function () {
      var key = this.filter.sortBy;
      var dir = this.filter.sortDir === "asc" ? 1 : -1;
      // slice() agar array hasil cache filteredItems tidak ikut termutasi
      return this.filteredItems.slice().sort(function (a, b) {
        if (key === "judul") return a.judul.localeCompare(b.judul, "id") * dir;
        return (a[key] - b[key]) * dir;
      });
    },
    // Dependent options: kategori yang tersedia di UT-Daerah terpilih
    kategoriOptions: function () {
      var upbjj = this.filter.upbjj;
      var items = this.items;
      return this.kategoriList.map(function (k) {
        var n = items.filter(function (s) {
          return s.upbjj === upbjj && s.kategori === k;
        }).length;
        return { nama: k, jumlah: n };
      });
    },
    // Object (name based index) untuk v-for="(jumlah, status, i) in ringkasan"
    ringkasan: function () {
      var r = { Aman: 0, Menipis: 0, Kosong: 0 };
      this.items.forEach(function (s) {
        if (s.qty === 0) r.Kosong++;
        else if (s.qty < s.safety) r.Menipis++;
        else r.Aman++;
      });
      return r;
    },
    adaFilter: function () {
      var f = this.filter;
      return !!(f.keyword || f.upbjj || f.kategori || f.reorderOnly || f.sortBy !== "judul" || f.sortDir !== "asc");
    },
    formErrors: function () {
      return this.validasi(this.form, true);
    },
    editErrors: function () {
      return this.editForm ? this.validasi(this.editForm, false) : {};
    },
  },
  watch: {
    // [WATCHER] UT-Daerah berganti -> kategori di-reset (kategori lama belum tentu ada)
    "filter.upbjj": function () {
      this.filter.kategori = "";
    },
    // [WATCHER] kode otomatis huruf besar tanpa spasi
    "form.kode": function (val) {
      var bersih = (val || "").toUpperCase().replace(/\s+/g, "");
      if (bersih !== val) this.form.kode = bersih;
    },
  },
  methods: {
    validasi: function (d, isBaru) {
      var e = {};
      if (isBaru) {
        if (!/^[A-Z]{4}\d{4}$/.test(d.kode)) e.kode = "Format kode: 4 huruf + 4 angka (cth. EKMA4116).";
        else if (d.upbjj && this.items.some(function (s) { return s.kode === d.kode && s.upbjj === d.upbjj; }))
          e.kode = "Kode " + d.kode + " sudah ada di UT-Daerah " + d.upbjj + ".";
        if (!d.judul || d.judul.trim().length < 3) e.judul = "Judul minimal 3 karakter.";
        if (!d.kategori) e.kategori = "Pilih kategori.";
        if (!d.upbjj) e.upbjj = "Pilih UT-Daerah.";
      }
      if (!/^R\d+-[A-Z]\d+$/i.test(d.lokasiRak || "")) e.lokasiRak = "Format rak: R1-A3.";
      if (d.harga === null || d.harga === "" || isNaN(d.harga) || d.harga <= 0) e.harga = "Harga harus lebih dari 0.";
      if (d.qty === null || d.qty === "" || !Number.isInteger(d.qty) || d.qty < 0) e.qty = "Qty bilangan bulat ≥ 0.";
      if (d.safety === null || d.safety === "" || !Number.isInteger(d.safety) || d.safety < 1) e.safety = "Safety bilangan bulat ≥ 1.";
      return e;
    },
    err: function (field) {
      return this.submitted ? this.formErrors[field] : "";
    },
    toggleSort: function (key) {
      if (this.filter.sortBy === key) this.filter.sortDir = this.filter.sortDir === "asc" ? "desc" : "asc";
      else {
        this.filter.sortBy = key;
        this.filter.sortDir = "asc";
      }
    },
    resetFilter: function () {
      this.filter = filterAwal();
    },
    /* --- Create: Enter atau klik Simpan --- */
    simpanBaru: function () {
      this.submitted = true;
      if (Object.keys(this.formErrors).length) return;
      var item = Object.assign({}, this.form, { judul: this.form.judul.trim(), lokasiRak: this.form.lokasiRak.toUpperCase() });
      this.$emit("create", item);
      this.form = stokKosong();
      this.submitted = false;
    },
    batalBaru: function () {
      this.form = stokKosong();
      this.submitted = false;
      this.showForm = false;
    },
    /* --- Update: buka modal edit, Enter = simpan --- */
    bukaEdit: function (item) {
      this.editKey = { kode: item.kode, upbjj: item.upbjj, judul: item.judul };
      this.editForm = { lokasiRak: item.lokasiRak, harga: item.harga, qty: item.qty, safety: item.safety, catatanHTML: item.catatanHTML };
      this.editSubmitted = false;
    },
    tutupEdit: function () {
      this.editKey = null;
      this.editForm = null;
    },
    simpanEdit: function () {
      this.editSubmitted = true;
      if (Object.keys(this.editErrors).length) return;
      this.$emit("update", { key: this.editKey, data: Object.assign({}, this.editForm, { lokasiRak: this.editForm.lokasiRak.toUpperCase() }) });
      this.tutupEdit();
    },
    hapus: function (item) {
      this.$emit("delete", item); // konfirmasi pop up ditangani root (<app-modal>)
    },
    persenQty: function (s) {
      return Math.min(100, Math.round((s.qty / Math.max(s.safety * 2, 1)) * 100));
    },
  },
});
