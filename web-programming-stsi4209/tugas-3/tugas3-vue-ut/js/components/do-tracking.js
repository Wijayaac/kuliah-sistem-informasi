/* ==========================================================
   do-tracking.js — <do-tracking>  (template: #tpl-tracking)
   Props : data (tracking: array of { "DO...": {detail} }),
           paket, ekspedisi, highlight (DO terakhir dibuat)
   Emits : add-progress({ nomor, keterangan, status })
   Pencarian: Nomor DO atau NIM. Enter = cari, Esc = reset.
   ========================================================== */

var TAHAP_DO = ["Diproses", "Dalam Perjalanan", "Sampai di Kota Tujuan", "Diterima"];

Vue.component("do-tracking", {
  template: "#tpl-tracking",
  props: {
    data: { type: Array, required: true },
    paket: { type: Array, default: function () { return []; } },
    ekspedisi: { type: Array, default: function () { return []; } },
    highlight: { type: String, default: "" },
  },
  data: function () {
    return {
      mode: "do", // 'do' | 'nim'
      keyword: "",
      query: null, // kata kunci yang sudah di-submit (Enter)
      selected: "",
      progress: { keterangan: "", status: "" },
      progressSubmitted: false,
      tahapList: TAHAP_DO,
    };
  },
  computed: {
    // Ratakan array of object ber-key nomor DO menjadi list { nomor, ...detail }
    daftarDO: function () {
      var hasil = [];
      this.data.forEach(function (entry) {
        Object.keys(entry).forEach(function (nomor) {
          hasil.push(Object.assign({ nomor: nomor }, entry[nomor]));
        });
      });
      return hasil;
    },
    hasilCari: function () {
      if (this.query === null) return this.daftarDO;
      var q = this.query.toLowerCase();
      var mode = this.mode;
      return this.daftarDO.filter(function (d) {
        return mode === "do" ? d.nomor.toLowerCase().indexOf(q) > -1 : d.nim.indexOf(q) > -1;
      });
    },
    detail: function () {
      var sel = this.selected;
      return this.daftarDO.find(function (d) { return d.nomor === sel; }) || null;
    },
    // Object untuk v-for (value, key) -> tabel ringkasan detail DO
    infoDetail: function () {
      if (!this.detail) return {};
      var d = this.detail;
      var pk = this.paket.find(function (p) { return p.kode === d.paket; });
      return {
        "NIM": d.nim,
        "Nama": d.nama,
        "Ekspedisi": d.ekspedisi,
        "Paket": d.paket + (pk ? " – " + pk.nama : ""),
        "Tanggal Kirim": Vue.filter("tanggal")(d.tanggalKirim),
        "Total": Vue.filter("rupiah")(d.total),
      };
    },
    // Riwayat terbaru di atas (copy dulu agar props tidak termutasi)
    perjalananTerbaru: function () {
      return this.detail ? this.detail.perjalanan.slice().reverse() : [];
    },
    tahapIndex: function () {
      return this.detail ? Math.max(0, TAHAP_DO.indexOf(this.detail.status)) : 0;
    },
    progressError: function () {
      var k = this.progress.keterangan.trim();
      if (!k) return "Keterangan wajib diisi.";
      if (k.length < 5) return "Keterangan minimal 5 karakter.";
      return "";
    },
  },
  watch: {
    // [WATCHER] hasil pencarian tepat 1 -> langsung buka detailnya
    hasilCari: function (list) {
      if (this.query !== null && list.length === 1) this.selected = list[0].nomor;
    },
    // [WATCHER] DO baru dari tab Pemesanan -> otomatis dipilih
    highlight: function (nomor) {
      if (nomor) {
        this.resetCari();
        this.selected = nomor;
      }
    },
    // [WATCHER] ganti DO -> form progress di-reset, status default = status DO
    selected: function () {
      this.progress = { keterangan: "", status: this.detail ? this.detail.status : "" };
      this.progressSubmitted = false;
    },
  },
  methods: {
    cari: function () {
      var q = this.keyword.trim();
      this.query = q ? q : null;
      if (q && this.hasilCari.length === 0) this.selected = "";
    },
    resetCari: function () {
      this.keyword = "";
      this.query = null;
    },
    kirimProgress: function () {
      this.progressSubmitted = true;
      if (this.progressError) return;
      this.$emit("add-progress", { nomor: this.selected, keterangan: this.progress.keterangan.trim(), status: this.progress.status });
      this.progress.keterangan = "";
      this.progressSubmitted = false;
    },
  },
});
