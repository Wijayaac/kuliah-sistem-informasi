<template>
  <ion-page>
    <!-- Header: judul aplikasi + kolom pencarian -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>💰 Crypto Ionic</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="keyword" placeholder="Cari nama / simbol koin" :debounce="200" />
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Tarik ke bawah untuk memuat ulang data -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content pulling-text="Tarik untuk memuat ulang" refreshing-spinner="crescent" />
      </ion-refresher>

      <!-- Tombol Refresh (sesuai tampilan soal) -->
      <div class="refresh">
        <ion-button @click="fetchCrypto" :disabled="loading">Refresh</ion-button>
        <p class="info" v-if="updated">{{ filtered.length }} koin · diperbarui {{ updated }} WIB</p>
      </div>

      <!-- State: loading -->
      <div v-if="loading" class="state">
        <ion-spinner name="crescent" />
        <p>Memuat data crypto...</p>
      </div>

      <!-- State: error + tombol coba lagi -->
      <div v-else-if="error" class="state">
        <p>Gagal mengambil data: {{ error }}</p>
        <ion-button @click="fetchCrypto">Coba lagi</ion-button>
      </div>

      <!-- Daftar koin: rank, name, symbol, price_usd -->
      <div v-else class="list">
        <div v-for="coin in filtered" :key="coin.id" class="row">
          <div class="col rank">
            <small>Rank</small>
            <span>{{ coin.rank }}</span>
          </div>
          <div class="col name">
            <small>{{ coin.name }}</small>
            <span>{{ coin.symbol }}</span>
          </div>
          <div class="col price">
            <small>USD</small>
            <span>{{ coin.price_usd }}</span>
          </div>
        </div>
        <p v-if="filtered.length === 0" class="state">Koin "{{ keyword }}" tidak ditemukan.</p>
      </div>
    </ion-content>

    <!-- Footer identitas mahasiswa -->
    <ion-footer>
      <ion-toolbar>
        <p class="footer">I KD WIJAYA SASHMITHA ADHI C · 048068753 · Tugas 3 STSI4303</p>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonRefresher, IonRefresherContent, IonSearchbar, IonSpinner, IonButton } from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import { ambilCrypto, type Crypto } from "@/services/crypto";

// State aplikasi
const coins = ref<Crypto[]>([]);
const loading = ref(true);
const error = ref("");
const keyword = ref("");
const updated = ref("");

// Ambil data dari API (saat halaman dibuka, tombol Refresh, & tarik-refresh)
async function fetchCrypto() {
  loading.value = coins.value.length === 0;
  error.value = "";
  try {
    coins.value = await ambilCrypto();
    updated.value = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" });
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

// Handler pull-to-refresh
async function handleRefresh(event: CustomEvent) {
  await fetchCrypto();
  (event.target as HTMLIonRefresherElement).complete();
}

// Filter berdasarkan nama atau simbol (tidak peka huruf besar/kecil)
const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase();
  if (!k) return coins.value;
  return coins.value.filter((c) => c.name.toLowerCase().includes(k) || c.symbol.toLowerCase().includes(k));
});

onMounted(fetchCrypto);
</script>

<style scoped>
.refresh {
  text-align: center;
  padding: 12px 0 4px;
}
.info {
  font-size: 11px;
  color: var(--ion-color-medium);
  margin: 4px 0 0;
}
.state {
  padding: 48px 16px;
  text-align: center;
  color: var(--ion-color-medium);
}
.list {
  margin: 8px 6px 16px;
  border: 1px solid #e6cf8a;
}
.row {
  display: flex;
  background: #fdf1d3;
  color: #222;
  border-bottom: 1px solid #e6cf8a;
  padding: 6px 8px;
}
.col {
  display: flex;
  flex-direction: column;
}
.col small {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.col span {
  font-size: 20px;
}
.rank {
  width: 22%;
  align-items: center;
}
.name {
  width: 33%;
  overflow: hidden;
}
.price {
  flex: 1;
  overflow: hidden;
}
.footer {
  text-align: center;
  font-size: 12px;
  color: var(--ion-color-medium);
  margin: 6px;
}
</style>
