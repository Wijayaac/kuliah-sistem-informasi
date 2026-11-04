/* ==========================================================
   status-badge.js — <status-badge>  (template: #tpl-badge)
   Props : qty, safety, catatan (HTML)
   Status: Kosong (qty = 0, merah) | Menipis (qty < safety, oranye)
           | Aman (qty >= safety, hijau)
   Mouse hover -> tooltip catatanHTML (v-show + v-html)
   ========================================================== */
Vue.component("status-badge", {
  template: "#tpl-badge",
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true },
    catatan: { type: String, default: "" },
  },
  data: function () {
    return { hover: false };
  },
  computed: {
    // Kosong dicek lebih dulu karena qty 0 juga memenuhi qty < safety
    status: function () {
      if (this.qty === 0) return "Kosong";
      if (this.qty < this.safety) return "Menipis";
      return "Aman";
    },
  },
});
