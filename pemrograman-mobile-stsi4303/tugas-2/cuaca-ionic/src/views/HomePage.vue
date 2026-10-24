<template>
  <ion-page>
    <!-- Header: judul aplikasi -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>🌤️ Cuaca Jakarta</ion-title>
      </ion-toolbar>
      <!-- Tab hari (scrollable) -->
      <ion-toolbar v-if="days.length">
        <ion-segment scrollable :value="selectedDay" @ionChange="selectedDay = String($event.detail.value)">
          <ion-segment-button v-for="d in days" :key="d" :value="d">
            <ion-label>{{ formatDay(d) }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Tarik ke bawah untuk memuat ulang data -->
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content pulling-text="Tarik untuk memuat ulang" refreshing-spinner="crescent" />
      </ion-refresher>

      <!-- State: loading -->
      <div v-if="loading" class="state">
        <ion-spinner name="crescent" />
        <p>Memuat data cuaca...</p>
      </div>

      <!-- State: error + tombol coba lagi -->
      <div v-else-if="error" class="state">
        <p>Gagal mengambil data: {{ error }}</p>
        <ion-button @click="fetchCuaca">Coba lagi</ion-button>
      </div>

      <template v-else>
        <!-- Ringkasan suhu hari terpilih -->
        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>Suhu per jam ({{ unit }}) · Open-Meteo API</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content class="summary">
            <div>
              <small>Min</small><b>{{ minTemp }}°</b>
            </div>
            <div>
              <small>Rata-rata</small><b>{{ avgTemp }}°</b>
            </div>
            <div>
              <small>Max</small><b>{{ maxTemp }}°</b>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Daftar waktu (time) & suhu (temperature_2m) -->
        <ion-list>
          <ion-list-header>
            <ion-label>Waktu (time)</ion-label>
            <ion-note class="hdr">Suhu (temperature_2m)</ion-note>
          </ion-list-header>
          <ion-item v-for="item in filtered" :key="item.time" :class="{ now: item.time === currentHour }">
            <ion-label>
              {{ formatJam(item.time) }}
              <ion-note v-if="item.time === currentHour"> · sekarang</ion-note>
            </ion-label>
            <ion-badge slot="end" :color="tempColor(item.temp)">{{ item.temp }} {{ unit }}</ion-badge>
          </ion-item>
        </ion-list>
      </template>
    </ion-content>

    <!-- Footer identitas mahasiswa -->
    <ion-footer>
      <ion-toolbar>
        <p class="footer">I KD WIJAYA SASHMITHA ADHI C · 048068753 · Tugas 2 STSI4303</p>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonList, IonListHeader, IonItem, IonLabel, IonNote, IonBadge, IonSpinner, IonButton } from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
import { ambilCuaca, type DataCuaca } from "@/services/cuaca";

// State aplikasi
const data = ref<DataCuaca[]>([]);
const unit = ref("°C");
const loading = ref(true);
const error = ref("");
const selectedDay = ref("");

// Ambil data dari API (dipanggil saat halaman dibuka & saat refresh)
async function fetchCuaca() {
  loading.value = data.value.length === 0;
  error.value = "";
  try {
    const hasil = await ambilCuaca();
    data.value = hasil.data;
    unit.value = hasil.unit;
    if (!selectedDay.value) selectedDay.value = data.value[0].time.slice(0, 10);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

// Handler pull-to-refresh
async function handleRefresh(event: CustomEvent) {
  await fetchCuaca();
  (event.target as HTMLIonRefresherElement).complete();
}

// Daftar tanggal unik (7 hari)
const days = computed(() => [...new Set(data.value.map((d) => d.time.slice(0, 10)))]);
// Data untuk tanggal terpilih (24 jam)
const filtered = computed(() => data.value.filter((d) => d.time.startsWith(selectedDay.value)));

// Ringkasan min / rata-rata / max
const temps = computed(() => filtered.value.map((d) => d.temp));
const minTemp = computed(() => Math.min(...temps.value).toFixed(1));
const maxTemp = computed(() => Math.max(...temps.value).toFixed(1));
const avgTemp = computed(() => (temps.value.reduce((a, b) => a + b, 0) / (temps.value.length || 1)).toFixed(1));

// Jam sekarang dalam WIB (UTC+7) untuk highlight baris
const currentHour = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 13) + ":00";

// Format tampilan
const formatDay = (d: string) => new Date(d + "T00:00").toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
const formatJam = (t: string) => t.slice(11, 16) + " WIB";
// Warna: biru < 27, oranye 27–31, merah >= 31
const tempColor = (t: number) => (t >= 31 ? "danger" : t >= 27 ? "warning" : "primary");

onMounted(fetchCuaca);
</script>

<style scoped>
.state {
  padding: 48px 16px;
  text-align: center;
  color: var(--ion-color-medium);
}
.summary {
  display: flex;
  gap: 8px;
  text-align: center;
}
.summary div {
  flex: 1;
  background: var(--ion-color-light);
  border-radius: 10px;
  padding: 8px;
}
.summary small {
  display: block;
  font-size: 11px;
  color: var(--ion-color-medium);
}
.summary b {
  font-size: 18px;
}
.hdr {
  padding-right: 16px;
  font-size: 12px;
}
ion-item.now {
  --background: rgba(var(--ion-color-primary-rgb), 0.12);
  font-weight: 600;
}
ion-badge {
  font-size: 14px;
  padding: 6px 10px;
}
.footer {
  text-align: center;
  font-size: 12px;
  color: var(--ion-color-medium);
  margin: 6px;
}
</style>
