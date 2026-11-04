/* ==========================================================
   app.js — Inisialisasi Vue root (Vue 2, sesuai cuplikan soal)
   - Global FILTER (formatting teks): rupiah, buah, tanggal, waktu
   - Root state: tab ('stok' | 'tracking' | 'order') + state data
   - Handler event dari komponen anak ($emit) -> ubah state
   Urutan: Api.loadTemplates() -> Api.getData() -> new Vue(...)
   ========================================================== */

Vue.config.productionTip = false;

var BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
  "Agustus", "September", "Oktober", "November", "Desember"];

/* ---------- [FILTER] formatting data teks (dipakai: {{ nilai | rupiah }}) ---------- */
Vue.filter("rupiah", function (n) {
  var angka = Number(n) || 0;
  return "Rp " + angka.toLocaleString("id-ID");
});

Vue.filter("buah", function (n) {
  return (Number(n) || 0) + " buah";
});

// "2025-08-25" -> "25 Agustus 2025"
Vue.filter("tanggal", function (str) {
  if (!str) return "-";
  var p = String(str).slice(0, 10).split("-");
  if (p.length !== 3) return str;
  return Number(p[2]) + " " + BULAN[Number(p[1]) - 1] + " " + p[0];
});

// "2025-08-25 10:12:20" -> "25 Agustus 2025, 10:12"
Vue.filter("waktu", function (str) {
  if (!str) return "-";
  var tgl = Vue.filter("tanggal")(str);
  var jam = String(str).slice(11, 16);
  return jam ? tgl + ", " + jam : tgl;
});

/* ---------- Helper waktu lokal (Date) ---------- */
function pad2(n) {
  return String(n).padStart(2, "0");
}
function hariIni() {
  var d = new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}
function waktuSekarang() {
  var d = new Date();
  return hariIni() + " " + pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
}

var TAB_TITLE = { stok: "Stok Bahan Ajar", tracking: "Tracking DO", order: "Pemesanan" };

function startApp(data) {
  return new Vue({
    el: "#app",
    data: {
      tab: TAB_TITLE[location.hash.slice(1)] ? location.hash.slice(1) : "stok",
      state: data,
      toasts: [],
      lastDO: "",
    },
    computed: {
      jumlahReorder: function () {
        return this.state.stok.filter(function (s) {
          return s.qty < s.safety;
        }).length;
      },
      jumlahDO: function () {
        return this.state.tracking.length;
      },
    },
    watch: {
      // [WATCHER 1] tab berubah -> judul dokumen & hash URL ikut berubah
      tab: {
        immediate: true,
        handler: function (val) {
          document.title = TAB_TITLE[val] + " | SITTA UT (Tugas 3)";
          if (location.hash !== "#" + val) history.replaceState(null, "", "#" + val);
        },
      },
      // [WATCHER 2] deep: setiap perubahan stok/tracking disimpan ke localStorage
      state: {
        deep: true,
        handler: function (val) {
          Api.save(val);
        },
      },
    },
    methods: {
      toast: function (pesan, tipe) {
        var id = Date.now() + Math.random();
        var self = this;
        this.toasts.push({ id: id, pesan: pesan, tipe: tipe || "success" });
        setTimeout(function () {
          self.toasts = self.toasts.filter(function (t) {
            return t.id !== id;
          });
        }, 3000);
      },
      toastIcon: function (tipe) {
        return { success: "bi-check-circle-fill", error: "bi-x-circle-fill", warning: "bi-exclamation-triangle-fill" }[tipe] || "bi-info-circle-fill";
      },
      /* ---- Event dari <ba-stock-table> ---- */
      handleCreateStok: function (item) {
        this.state.stok.push(item);
        this.toast("Bahan ajar " + item.kode + " ditambahkan.");
      },
      handleUpdateStok: function (payload) {
        var idx = this.state.stok.findIndex(function (s) {
          return s.kode === payload.key.kode && s.upbjj === payload.key.upbjj;
        });
        if (idx > -1) {
          this.$set(this.state.stok, idx, Object.assign({}, this.state.stok[idx], payload.data));
          this.toast("Data " + payload.key.kode + " diperbarui.");
        }
      },
      handleDeleteStok: function (item) {
        var self = this;
        // Pop up konfirmasi lewat komponen <app-modal ref="modal">
        this.$refs.modal
          .confirm({
            title: "Hapus bahan ajar?",
            message: "Data <strong>" + item.kode + " – " + item.judul + "</strong> (" + item.upbjj + ") akan dihapus permanen.",
            okText: "Ya, hapus",
            danger: true,
          })
          .then(function (ok) {
            if (!ok) return;
            self.state.stok = self.state.stok.filter(function (s) {
              return !(s.kode === item.kode && s.upbjj === item.upbjj);
            });
            self.toast("Bahan ajar " + item.kode + " dihapus.", "warning");
          });
      },
      /* ---- Event dari <order-form> ---- */
      handleNewDO: function (payload) {
        var entry = {};
        entry[payload.nomor] = payload.data;
        this.state.tracking.push(entry);
        this.lastDO = payload.nomor;
        this.toast("DO " + payload.nomor + " berhasil dibuat.");
        this.tab = "tracking";
      },
      /* ---- Event dari <do-tracking> ---- */
      handleAddProgress: function (payload) {
        var entry = this.state.tracking.find(function (e) {
          return e[payload.nomor];
        });
        if (!entry) return;
        var detail = entry[payload.nomor];
        detail.perjalanan.push({ waktu: waktuSekarang(), keterangan: payload.keterangan });
        if (payload.status) detail.status = payload.status;
        this.toast("Progress " + payload.nomor + " ditambahkan.");
      },
      resetData: function () {
        var self = this;
        this.$refs.modal
          .confirm({ title: "Kembalikan data awal?", message: "Semua perubahan stok dan DO akan dihapus.", okText: "Reset" })
          .then(function (ok) {
            if (!ok) return;
            Api.clear();
            Api.getData(true).then(function (fresh) {
              self.state = fresh;
              self.lastDO = "";
              self.toast("Data dikembalikan ke dataBahanAjar.json.", "info");
            });
          });
      },
    },
  });
}

// Bootstrap: template dulu, lalu data, baru Vue root dibuat
Api.loadTemplates()
  .then(function () {
    return Api.getData();
  })
  .then(startApp)
  .catch(function (err) {
    console.error(err);
    document.getElementById("app").innerHTML =
      '<div class="container"><div class="card alert alert-danger" style="margin-top:2rem">' +
      "<strong>Gagal memuat aplikasi.</strong> " + err.message +
      "<br>Jalankan lewat local server (mis. <code>npx serve .</code> atau VS Code Live Server), bukan file://.</div></div>";
  });
