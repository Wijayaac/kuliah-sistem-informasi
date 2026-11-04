// Service untuk mengambil data cryptocurrency dari CoinLore API.
// Endpoint /api/tickers/ mengembalikan 100 koin teratas berdasarkan rank.
export const API_URL = 'https://api.coinlore.net/api/tickers/';

// Bentuk satu data koin (hanya field yang dibutuhkan tugas)
export interface Crypto {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  price_usd: string;
}

export async function ambilCrypto(): Promise<Crypto[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  // Data koin ada di dalam properti "data" (array)
  return json.data.map((c: Crypto) => ({
    id: c.id,
    rank: Number(c.rank),
    name: c.name,
    symbol: c.symbol,
    price_usd: c.price_usd,
  }));
}
