/* ==========================================================
   SITTA — script utama (manipulasi DOM, validasi, interaksi UI)
   Data dummy dari js/data.js: dataPengguna, dataBahanAjar, dataTracking
   ========================================================== */

/* ---------- Utilitas umum ---------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function $(selector) {
  return document.querySelector(selector);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

function formatAngka(angka) {
  return Number(angka).toLocaleString("id-ID");
}

/* ---------- Toast notification ---------- */

const TOAST_ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-x-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

function showToast(message, type = "info") {
  const container = $("#toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  const icon = document.createElement("i");
  icon.className = `bi ${TOAST_ICONS[type]}`;
  const text = document.createElement("span");
  text.textContent = message;
  toast.append(icon, text);

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3000);
}

/* ---------- Modal ---------- */

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("show");
  const firstInput = modal.querySelector("input, select, button");
  if (firstInput) firstInput.focus();
}

function closeModal(modal) {
  modal.classList.remove("show");
  const form = modal.querySelector("form");
  if (form) resetForm(form);
}

function initModals() {
  document.querySelectorAll("[data-modal-open]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.modalOpen));
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-modal-close]")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.show").forEach(closeModal);
  });
}

/* ---------- Validasi form ---------- */

function setError(input, message) {
  const errorEl = document.getElementById(`${input.id}Error`);
  input.classList.toggle("is-invalid", Boolean(message));
  input.setAttribute("aria-invalid", Boolean(message));
  if (errorEl) errorEl.textContent = message || "";
  return !message;
}

function resetForm(form) {
  form.reset();
  form.querySelectorAll("input, select").forEach((input) => setError(input, ""));
}

function validateEmail(input) {
  const value = input.value.trim();
  if (!value) return setError(input, "Email wajib diisi.");
  if (!EMAIL_PATTERN.test(value)) return setError(input, "Format email tidak valid.");
  return setError(input, "");
}

function validateRequired(input, label) {
  if (!input.value.trim()) return setError(input, `${label} wajib diisi.`);
  return setError(input, "");
}

function clearErrorOnInput(form) {
  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", () => setError(input, ""));
  });
}

/* ---------- Navbar (semua halaman setelah login) ---------- */

function initNavbar() {
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.querySelector("i").className = isOpen ? "bi bi-x-lg" : "bi bi-list";
  });

  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector("button");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      trigger.setAttribute("aria-expanded", isOpen);
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.open").forEach((d) => {
      d.classList.remove("open");
      d.querySelector("button").setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-coming-soon]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`Fitur "${el.dataset.comingSoon}" segera hadir.`, "info");
    });
  });

  document.querySelectorAll("[data-logout]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!confirm("Yakin ingin keluar dari SITTA?")) e.preventDefault();
    });
  });
}

/* ==========================================================
   Halaman Login (index.html)
   ========================================================== */

function initLoginPage() {
  const form = $("#loginForm");
  const email = $("#email");
  const password = $("#password");
  clearErrorOnInput(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValid = validateEmail(email);
    const passwordValid = validateRequired(password, "Password");
    if (!emailValid || !passwordValid) return;

    const user = dataPengguna.find(
      (u) => u.email === email.value.trim().toLowerCase() && u.password === password.value
    );

    if (!user) {
      openModal("loginErrorModal");
      return;
    }

    showToast(`Login berhasil. Selamat datang, ${user.nama}!`, "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 900);
  });

  const forgotForm = $("#forgotForm");
  clearErrorOnInput(forgotForm);
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#forgotEmail");
    if (!validateEmail(input)) return;

    const terdaftar = dataPengguna.some((u) => u.email === input.value.trim().toLowerCase());
    if (!terdaftar) {
      setError(input, "Email tidak terdaftar.");
      return;
    }
    closeModal($("#forgotModal"));
    showToast("Tautan reset password telah dikirim ke email Anda.", "success");
  });

  const registerForm = $("#registerForm");
  clearErrorOnInput(registerForm);
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#regNama");
    const regEmail = $("#regEmail");
    const role = $("#regRole");
    const regPassword = $("#regPassword");

    let valid = validateRequired(nama, "Nama");
    valid = validateEmail(regEmail) && valid;
    valid = validateRequired(role, "Unit") && valid;
    if (regPassword.value.length < 6) {
      valid = setError(regPassword, "Password minimal 6 karakter.") && valid;
    } else {
      setError(regPassword, "");
    }

    if (valid && dataPengguna.some((u) => u.email === regEmail.value.trim().toLowerCase())) {
      valid = setError(regEmail, "Email sudah terdaftar.");
    }
    if (!valid) return;

    closeModal($("#registerModal"));
    showToast("Pendaftaran terkirim. Akun akan diverifikasi admin.", "success");
  });
}

/* ==========================================================
   Halaman Dashboard (dashboard.html)
   ========================================================== */

function getGreeting(jam) {
  if (jam >= 4 && jam < 11) return "Selamat pagi";
  if (jam >= 11 && jam < 15) return "Selamat siang";
  if (jam >= 15 && jam < 19) return "Selamat sore";
  return "Selamat malam";
}

function updateClock() {
  const now = new Date();
  $("#greeting").textContent = getGreeting(now.getHours());
  $("#clock").textContent = now.toLocaleTimeString("id-ID", { hour12: false });
  $("#todayDate").textContent = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function initDashboardPage() {
  updateClock();
  setInterval(updateClock, 1000);

  const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
  $("#statJudul").textContent = dataBahanAjar.length;
  $("#statStok").textContent = formatAngka(totalStok);
  $("#statDO").textContent = Object.keys(dataTracking).length;
}

/* ==========================================================
   Halaman Tracking (tracking.html)
   ========================================================== */

const TRACKING_STEPS = [
  { label: "Diterima Loket", icon: "bi-box-seam", keyword: "penerimaan" },
  { label: "Dalam Perjalanan", icon: "bi-truck", keyword: "hub" },
  { label: "Proses Antar", icon: "bi-geo-alt", keyword: "proses antar" },
  { label: "Selesai", icon: "bi-check-circle", keyword: "selesai antar" },
];

function getTahapPengiriman(perjalanan) {
  let tahap = 0;
  perjalanan.forEach((log) => {
    const ket = log.keterangan.toLowerCase();
    TRACKING_STEPS.forEach((step, index) => {
      if (ket.includes(step.keyword)) tahap = Math.max(tahap, index + 1);
    });
  });
  return tahap;
}

function getStatusBadge(status) {
  const s = status.toLowerCase();
  if (s.includes("selesai")) return "badge-success";
  if (s.includes("perjalanan")) return "badge-warning";
  return "badge-info";
}

function renderTracking(data) {
  const result = $("#trackingResult");
  const tahap = getTahapPengiriman(data.perjalanan);
  const persen = (tahap / TRACKING_STEPS.length) * 100;
  const bahanAjar = dataBahanAjar.find((b) => b.kodeLokasi === data.paket);
  const namaPaket = bahanAjar ? `${data.paket} - ${bahanAjar.namaBarang}` : data.paket;

  const steps = TRACKING_STEPS.map(
    (step, i) => `
      <li class="${i < tahap ? "reached" : ""}">
        <i class="bi ${step.icon}"></i>${step.label}
      </li>`
  ).join("");

  const timeline = [...data.perjalanan]
    .sort((a, b) => b.waktu.localeCompare(a.waktu))
    .map(
      (log) => `
      <li>
        <span>${escapeHtml(log.keterangan)}</span>
        <time datetime="${escapeHtml(log.waktu.replace(" ", "T"))}">${escapeHtml(log.waktu)}</time>
      </li>`
    )
    .join("");

  result.innerHTML = `
    <div class="do-header">
      <div>
        <h2>${escapeHtml(data.nama)}</h2>
        <div class="do-number">${escapeHtml(data.nomorDO)}</div>
      </div>
      <div>
        <span class="badge ${getStatusBadge(data.status)}">${escapeHtml(data.status)}</span>
      </div>
    </div>

    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${persen}">
      <div class="progress-bar ${persen === 100 ? "done" : ""}"></div>
    </div>
    <ol class="steps">${steps}</ol>

    <dl class="detail-grid">
      <div><dt>Ekspedisi</dt><dd>${escapeHtml(data.ekspedisi)}</dd></div>
      <div><dt>Tanggal Kirim</dt><dd>${escapeHtml(data.tanggalKirim)}</dd></div>
      <div><dt>Jenis Paket</dt><dd>${escapeHtml(namaPaket)}</dd></div>
      <div><dt>Total Pembayaran</dt><dd>${escapeHtml(data.total)}</dd></div>
    </dl>

    <h3 style="margin-bottom: 1rem; font-size: 1rem">Perjalanan Paket</h3>
    <ul class="timeline">${timeline}</ul>
  `;

  result.hidden = false;
  requestAnimationFrame(() => {
    result.querySelector(".progress-bar").style.width = `${persen}%`;
  });
}

function initTrackingPage() {
  const form = $("#trackingForm");
  const input = $("#nomorDO");
  const result = $("#trackingResult");
  clearErrorOnInput(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nomor = input.value.trim();

    if (!nomor) {
      setError(input, "Nomor Delivery Order wajib diisi.");
      return;
    }
    if (!/^\d+$/.test(nomor)) {
      setError(input, "Nomor Delivery Order hanya berisi angka.");
      return;
    }

    const data = dataTracking[nomor];
    if (!data) {
      result.hidden = true;
      showToast(`Nomor DO ${nomor} tidak ditemukan.`, "error");
      return;
    }

    renderTracking(data);
    showToast("Data pengiriman ditemukan.", "success");
  });

  document.querySelectorAll("[data-sample-do]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.sampleDo;
      form.requestSubmit();
    });
  });
}

/* ==========================================================
   Halaman Stok (stok.html)
   ========================================================== */

function createCoverCell(item) {
  const td = document.createElement("td");
  if (item.cover) {
    const img = document.createElement("img");
    img.src = item.cover;
    img.alt = `Cover ${item.namaBarang}`;
    img.className = "cover-thumb";
    img.loading = "lazy";
    td.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "cover-thumb";
    placeholder.innerHTML = '<i class="bi bi-image" aria-hidden="true"></i>';
    td.appendChild(placeholder);
  }
  return td;
}

function createTextCell(text, className) {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

function renderStokTable(keyword = "", highlightKode = null) {
  const tbody = $("#stokTableBody");
  const kata = keyword.trim().toLowerCase();
  const hasil = dataBahanAjar.filter(
    (item) =>
      item.kodeBarang.toLowerCase().includes(kata) ||
      item.namaBarang.toLowerCase().includes(kata) ||
      item.kodeLokasi.toLowerCase().includes(kata)
  );

  tbody.innerHTML = "";

  if (hasil.length === 0) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = createTextCell(`Tidak ada bahan ajar yang cocok dengan "${keyword}".`);
    td.colSpan = 8;
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  hasil.forEach((item, index) => {
    const tr = document.createElement("tr");
    if (item.kodeBarang === highlightKode) tr.className = "row-new";

    const stokCell = document.createElement("td");
    stokCell.className = "num";
    const badge = document.createElement("span");
    badge.className = `badge ${item.stok < 200 ? "badge-danger" : "badge-success"}`;
    badge.textContent = formatAngka(item.stok);
    badge.title = item.stok < 200 ? "Stok menipis" : "Stok aman";
    stokCell.appendChild(badge);

    tr.append(
      createTextCell(index + 1),
      createCoverCell(item),
      createTextCell(item.kodeLokasi),
      createTextCell(item.kodeBarang),
      createTextCell(item.namaBarang),
      createTextCell(item.jenisBarang),
      createTextCell(item.edisi),
      stokCell
    );
    tbody.appendChild(tr);
  });

  const totalStok = hasil.reduce((sum, item) => sum + item.stok, 0);
  $("#stokSummary").textContent =
    `Menampilkan ${hasil.length} dari ${dataBahanAjar.length} bahan ajar · Total stok: ${formatAngka(totalStok)} eksemplar`;
}

function validateStokForm() {
  const kodeLokasi = $("#kodeLokasi");
  const kodeBarang = $("#kodeBarang");
  const namaBarang = $("#namaBarang");
  const jenisBarang = $("#jenisBarang");
  const edisi = $("#edisi");
  const stok = $("#stok");

  let valid = true;

  if (!kodeLokasi.value.trim()) valid = setError(kodeLokasi, "Kode lokasi wajib diisi.") && valid;
  else if (!/^[A-Z0-9]{4,10}$/i.test(kodeLokasi.value.trim()))
    valid = setError(kodeLokasi, "4–10 karakter huruf/angka.") && valid;

  const kode = kodeBarang.value.trim().toUpperCase();
  if (!kode) valid = setError(kodeBarang, "Kode barang wajib diisi.") && valid;
  else if (!/^[A-Z]{4}\d{4}$/.test(kode))
    valid = setError(kodeBarang, "Format: 4 huruf + 4 angka (cth. SATS4121).") && valid;
  else if (dataBahanAjar.some((b) => b.kodeBarang === kode))
    valid = setError(kodeBarang, "Kode barang sudah ada.") && valid;

  valid = validateRequired(namaBarang, "Nama barang") && valid;
  valid = validateRequired(jenisBarang, "Jenis barang") && valid;

  const nilaiEdisi = Number(edisi.value);
  if (!edisi.value || !Number.isInteger(nilaiEdisi) || nilaiEdisi < 1)
    valid = setError(edisi, "Edisi berupa angka bulat ≥ 1.") && valid;

  const nilaiStok = Number(stok.value);
  if (stok.value === "" || !Number.isInteger(nilaiStok) || nilaiStok < 0)
    valid = setError(stok, "Stok berupa angka bulat ≥ 0.") && valid;

  return valid;
}

function initStokPage() {
  const search = $("#searchStok");
  const form = $("#addStokForm");
  renderStokTable();
  clearErrorOnInput(form);

  search.addEventListener("input", () => renderStokTable(search.value));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateStokForm()) {
      showToast("Periksa kembali isian form.", "warning");
      return;
    }

    const baru = {
      kodeLokasi: $("#kodeLokasi").value.trim().toUpperCase(),
      kodeBarang: $("#kodeBarang").value.trim().toUpperCase(),
      namaBarang: $("#namaBarang").value.trim(),
      jenisBarang: $("#jenisBarang").value,
      edisi: String(Number($("#edisi").value)),
      stok: Number($("#stok").value),
      cover: "",
    };

    dataBahanAjar.push(baru);
    closeModal($("#addStokModal"));
    search.value = "";
    renderStokTable("", baru.kodeBarang);
    showToast(`Bahan ajar ${baru.kodeBarang} berhasil ditambahkan.`, "success");
  });
}

/* ---------- Router sederhana berdasarkan data-page ---------- */

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  initNavbar();

  const pages = {
    login: initLoginPage,
    dashboard: initDashboardPage,
    tracking: initTrackingPage,
    stok: initStokPage,
  };
  const init = pages[document.body.dataset.page];
  if (init) init();
});
