/* ==========================================================
   app-modal.js — <app-modal>  (template: #tpl-modal)
   Dua cara pakai:
   1) Pop up konfirmasi global: this.$refs.modal.confirm({...})
      -> mengembalikan Promise<boolean>
   2) Modal biasa dengan SLOT: <app-modal :show="..." title="..." @close="...">
        isi (default slot) + <template #footer>...</template>
   Tombol Esc / klik latar = tutup
   ========================================================== */
Vue.component("app-modal", {
  template: "#tpl-modal",
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: "" },
    wide: { type: Boolean, default: false },
  },
  data: function () {
    return { dialog: null }; // { title, message, okText, danger, resolve }
  },
  computed: {
    visible: function () {
      return this.show || !!this.dialog;
    },
    judul: function () {
      return this.dialog ? this.dialog.title : this.title;
    },
  },
  watch: {
    // Pasang/lepas listener Esc hanya saat modal terlihat
    visible: function (val) {
      if (val) document.addEventListener("keydown", this.onKey);
      else document.removeEventListener("keydown", this.onKey);
    },
  },
  methods: {
    confirm: function (opts) {
      var self = this;
      return new Promise(function (resolve) {
        self.dialog = Object.assign({ okText: "OK", danger: false }, opts, { resolve: resolve });
      });
    },
    answer: function (val) {
      if (this.dialog) {
        this.dialog.resolve(val);
        this.dialog = null;
      }
    },
    close: function () {
      if (this.dialog) this.answer(false);
      else this.$emit("close");
    },
    onKey: function (e) {
      if (e.key === "Escape") this.close();
    },
  },
  beforeDestroy: function () {
    document.removeEventListener("keydown", this.onKey);
  },
});
