// Service untuk mengambil data cuaca dari Open-Meteo API.
// Parameter timezone=Asia/Jakarta ditambahkan agar waktu yang dikembalikan
// sudah dalam WIB. Tanpa parameter ini, API mengembalikan waktu dalam GMT/UTC.
export const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m&timezone=Asia%2FJakarta';

// Bentuk satu baris data: waktu (time) dan suhu (temperature_2m)
export interface DataCuaca {
  time: string;
  temp: number;
}

export async function ambilCuaca(): Promise<{ data: DataCuaca[]; unit: string }> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  // Gabungkan array hourly.time & hourly.temperature_2m menjadi list objek
  const data = json.hourly.time.map((t: string, i: number) => ({
    time: t,
    temp: json.hourly.temperature_2m[i],
  }));
  return { data, unit: json.hourly_units.temperature_2m };
}
