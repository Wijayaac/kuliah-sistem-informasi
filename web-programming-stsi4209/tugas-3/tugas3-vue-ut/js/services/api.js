/* ==========================================================
   services/api.js — Data service (akses data) SITTA
   Tugas Praktik 3 STSI4209 · Vue.js Component & Template

   Tanggung jawab file ini (dipisah dari komponen):
   1. loadTemplates() : mengambil file templates/*.html (fetch) lalu
                        menempelkan <template id="tpl-..."> ke <body>
   2. getData()       : mengambil data/dataBahanAjar.json (fetch)
   3. save/clear      : menyimpan perubahan ke localStorage
   Catatan: fetch() butuh http:// (jalankan lewat local server),
   tidak bisa dibuka langsung lewat file://
   ========================================================== */

var Api = (function () {
  var DATA_URL = "data/dataBahanAjar.json";
  var STORAGE_KEY = "sitta-vue-t3-state";
  var TEMPLATE_FILES = [
    "templates/stock-table.html",
    "templates/do-tracking.html",
    "templates/order-form.html",
    "templates/status-badge.html",
    "templates/app-modal.html",
  ];

  function fetchText(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Gagal memuat " + url + " (HTTP " + res.status + ")");
      return res.text();
    });
  }

  // Ambil semua template lalu tempel ke <body> agar bisa dipakai sebagai template: '#tpl-...'
  function loadTemplates() {
    return Promise.all(TEMPLATE_FILES.map(fetchText)).then(function (htmls) {
      htmls.forEach(function (html) {
        document.body.insertAdjacentHTML("beforeend", html);
      });
    });
  }

  // Data tracking dari JSON berisi nomor DO ganda (DO2025-0001 dua kali).
  // Bentuk aslinya (array of object ber-key nomor DO) dipertahankan, hanya duplikat dibuang.
  function dedupeTracking(list) {
    var seen = {};
    var hasil = [];
    (list || []).forEach(function (entry) {
      Object.keys(entry).forEach(function (noDO) {
        if (seen[noDO]) return;
        seen[noDO] = true;
        var obj = {};
        obj[noDO] = entry[noDO];
        hasil.push(obj);
      });
    });
    return hasil;
  }

  function normalize(raw) {
    var data = JSON.parse(JSON.stringify(raw));
    data.tracking = dedupeTracking(data.tracking);
    return data;
  }

  // Ambil data: pakai localStorage bila ada perubahan tersimpan, jika tidak fetch JSON
  function getData(forceFresh) {
    if (!forceFresh) {
      try {
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return Promise.resolve(JSON.parse(saved));
      } catch (e) {
        /* abaikan data rusak */
      }
    }
    return fetchText(DATA_URL).then(function (text) {
      return normalize(JSON.parse(text));
    });
  }

  function save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage penuh / diblokir: abaikan */
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { loadTemplates: loadTemplates, getData: getData, save: save, clear: clear };
})();
