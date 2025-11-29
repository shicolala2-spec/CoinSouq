
import { Coin, DailyHistoryItem } from '../types';

const API_BASE = 'https://api.coingecko.com/api/v3';

// Format helpers
const formatCompactNumber = (number: number) => {
  const formatter = Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 });
  return formatter.format(number);
};

export const fetchLiveMarketData = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );
    
    if (!response.ok) {
        if (response.status === 429) console.warn("CoinGecko Rate Limit Hit - Using fallback");
        return [];
    }

    const data = await response.json();

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      volume24h: formatCompactNumber(coin.total_volume),
      marketCap: formatCompactNumber(coin.market_cap),
      rawVolume: coin.total_volume,
      rawMarketCap: coin.market_cap,
      history: coin.sparkline_in_7d?.price 
        ? coin.sparkline_in_7d.price.map((p: number, i: number) => ({ time: i.toString(), price: p })) 
        : [],
      dailyHistory: [] // To be populated on detail view
    }));
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
};

export const fetchCoinHistory = async (coinId: string): Promise<DailyHistoryItem[]> => {
    try {
        // Fetch 7 days of hourly data to calculate daily High/Low manually
        const response = await fetch(`${API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=7`);
        if (!response.ok) return [];
        
        const data = await response.json();
        // data.prices is [[timestamp, price], ...]
        // data.total_volumes is [[timestamp, volume], ...]
        
        const dailyMap = new Map<string, { high: number, low: number, volume: number }>();
        
        data.prices.forEach((item: [number, number], index: number) => {
            const date = new Date(item[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const price = item[1];
            const vol = data.total_volumes[index]?.[1] || 0;
            
            if (!dailyMap.has(date)) {
                dailyMap.set(date, { high: price, low: price, volume: vol });
            } else {
                const entry = dailyMap.get(date)!;
                entry.high = Math.max(entry.high, price);
                entry.low = Math.min(entry.low, price);
                entry.volume = Math.max(entry.volume, vol); // Using max vol of the day as approximation for daily vol
                dailyMap.set(date, entry);
            }
        });
        
        const history: DailyHistoryItem[] = [];
        dailyMap.forEach((value, key) => {
            history.push({
                date: key,
                high: value.high,
                low: value.low,
                volume: formatCompactNumber(value.volume)
            });
        });
        
        // Return last 7 days reversed (today first)
        return history.reverse().slice(0, 7);
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}
