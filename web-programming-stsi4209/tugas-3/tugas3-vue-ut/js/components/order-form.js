/* ==========================================================
   order-form.js — <order-form>  (template: #tpl-order)
   Form pemesanan / input Delivery Order (DO) baru.
   Props : paket, ekspedisi (pengirimanList), stok, tracking
   Emits : created({ nomor, data })
   Nomor DO otomatis: "DO" + tahun berjalan + "-" + sequence 3 digit
   ========================================================== */

function formDOKosong() {
  return { nim: "", nama: "", ekspedisi: "", paketKode: "", tanggalKirim: hariIni(), total: 0 };
}

Vue.component("order-form", {
  template: "#tpl-order",
  props: {
    paket: { type: Array, required: true },
    ekspedisi: { type: Array, required: true },
    stok: { type: Array, default: function () { return []; } },
    tracking: { type: Array, default: function () { return []; } },
  },
  data: function () {
    return { form: formDOKosong(), submitted: false, nimInfo: "" };
  },
  computed: {
    // Ambil sequence terbesar dari semua nomor DO yang ada, lalu +1
    nomorDO: function () {
      var maxSeq = 0;
      this.tracking.forEach(function (entry) {
        Object.keys(entry).forEach(function (nomor) {
          var m = /^DO\d{4}-(\d+)$/.exec(nomor);
          if (m) maxSeq = Math.max(maxSeq, Number(m[1]));
        });
      });
      return "DO" + new Date().getFullYear() + "-" + String(maxSeq + 1).padStart(3, "0");
    },
    paketTerpilih: function () {
      var kode = this.form.paketKode;
      return this.paket.find(function (p) { return p.kode === kode; }) || null;
    },
    // Detail isi paket: kode MK dicocokkan dengan judul di data stok
    isiPaket: function () {
      if (!this.paketTerpilih) return [];
      var stok = this.stok;
      return this.paketTerpilih.isi.map(function (kode) {
        var s = stok.find(function (x) { return x.kode === kode; });
        return { kode: kode, judul: s ? s.judul : "(judul tidak ada di data stok)" };
      });
    },
    labelEkspedisi: function () {
      var kode = this.form.ekspedisi;
      var e = this.ekspedisi.find(function (x) { return x.kode === kode; });
      return e ? this.namaEkspedisi(e) : "";
    },
    errors: function () {
      var e = {};
      var f = this.form;
      if (!/^\d{9}$/.test(f.nim)) e.nim = /\D/.test(f.nim) ? "NIM hanya boleh angka." : "NIM harus 9 digit angka.";
      if (!f.nama || f.nama.trim().length < 3) e.nama = "Nama minimal 3 karakter.";
      else if (!/^[A-Za-z .']+$/.test(f.nama)) e.nama = "Nama hanya huruf, spasi, titik, atau apostrof.";
      if (!f.ekspedisi) e.ekspedisi = "Pilih ekspedisi.";
      if (!f.paketKode) e.paketKode = "Pilih paket bahan ajar.";
      if (!f.tanggalKirim) e.tanggalKirim = "Tanggal kirim wajib diisi.";
      return e;
    },
    valid: function () {
      return Object.keys(this.errors).length === 0;
    },
  },
  watch: {
    // [WATCHER] paket dipilih -> Total Harga otomatis dari paket.harga
    "form.paketKode": function () {
      this.form.total = this.paketTerpilih ? this.paketTerpilih.harga : 0;
    },
    // [WATCHER] NIM diketik -> buang spasi & beri info sisa digit secara langsung
    "form.nim": function (val) {
      var bersih = val.replace(/\s+/g, "");
      if (bersih !== val) this.form.nim = bersih;
      var sisa = 9 - bersih.length;
      this.nimInfo = /\D/.test(bersih) ? "" : sisa > 0 ? "Kurang " + sisa + " digit lagi." : sisa === 0 ? "Format NIM sudah benar." : "";
    },
  },
  methods: {
    namaEkspedisi: function (e) {
      return (e.kode === "EXP" ? "JNE Express" : "JNE Regular") + " – " + e.nama;
    },
    err: function (f) {
      return this.submitted ? this.errors[f] : "";
    },
    isiHariIni: function () {
      this.form.tanggalKirim = hariIni();
    },
    simpan: function () {
      this.submitted = true;
      if (!this.valid) return;
      var f = this.form;
      this.$emit("created", {
        nomor: this.nomorDO,
        data: {
          nim: f.nim,
          nama: f.nama.trim(),
          status: "Diproses",
          ekspedisi: this.labelEkspedisi.split(" – ")[0],
          tanggalKirim: f.tanggalKirim,
          paket: f.paketKode,
          total: f.total,
          perjalanan: [{ waktu: waktuSekarang(), keterangan: "DO dibuat, menunggu penjemputan ekspedisi" }],
        },
      });
      this.reset();
    },
    reset: function () {
      this.form = formDOKosong();
      this.submitted = false;
    },
  },
});
