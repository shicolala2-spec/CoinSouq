
import { Coin, DepositRequest, User, ActivityLog, CopyTrader, Article, Mission, NFTItem } from './types';

export const INITIAL_USER_BALANCE = 10000; // 10,000 USDT fake money

// Helper to generate fake chart data
const generateHistory = (basePrice: number) => {
  const history = [];
  let currentPrice = basePrice;
  for (let i = 0; i < 24; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    currentPrice += change;
    history.push({
      time: `${i}:00`,
      price: currentPrice
    });
  }
  return history;
};

// Helper to generate fake daily history for the last 7 days
const generateDailyHistory = (basePrice: number) => {
  const history = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Random variations based on basePrice
    const volatility = 0.08;
    const dailyBase = basePrice * (1 + (Math.random() - 0.5) * 0.1);
    const high = dailyBase * (1 + Math.random() * volatility);
    const low = dailyBase * (1 - Math.random() * volatility);
    // Ensure low is lower than high
    const realHigh = Math.max(high, low);
    const realLow = Math.min(high, low);
    
    const vol = (Math.random() * 5 + 0.5).toFixed(1) + 'B';

    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      high: realHigh,
      low: realLow,
      volume: vol
    });
  }
  return history; // Returns [Today, Yesterday, ...]
};

export const FALLBACK_COINS: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 94500.20,
    change24h: 2.5,
    volume24h: '45.2B',
    marketCap: '1.8T',
    rawVolume: 45200000000,
    rawMarketCap: 1800000000000,
    history: generateHistory(94500),
    dailyHistory: generateDailyHistory(94500)
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3200.50,
    change24h: -1.2,
    volume24h: '18.1B',
    marketCap: '380B',
    rawVolume: 18100000000,
    rawMarketCap: 380000000000,
    history: generateHistory(3200),
    dailyHistory: generateDailyHistory(3200)
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 145.80,
    change24h: 5.8,
    volume24h: '3.2B',
    marketCap: '65B',
    rawVolume: 3200000000,
    rawMarketCap: 65000000000,
    history: generateHistory(145),
    dailyHistory: generateDailyHistory(145)
  },
  {
    id: 'binance-coin',
    symbol: 'BNB',
    name: 'BNB',
    price: 590.10,
    change24h: 0.5,
    volume24h: '1.1B',
    marketCap: '87B',
    rawVolume: 1100000000,
    rawMarketCap: 87000000000,
    history: generateHistory(590),
    dailyHistory: generateDailyHistory(590)
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    change24h: -0.8,
    volume24h: '400M',
    marketCap: '16B',
    rawVolume: 400000000,
    rawMarketCap: 16000000000,
    history: generateHistory(0.45),
    dailyHistory: generateDailyHistory(0.45)
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.62,
    change24h: 1.1,
    volume24h: '800M',
    marketCap: '34B',
    rawVolume: 800000000,
    rawMarketCap: 34000000000,
    history: generateHistory(0.62),
    dailyHistory: generateDailyHistory(0.62)
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.12,
    change24h: 8.4,
    volume24h: '1.2B',
    marketCap: '18B',
    rawVolume: 1200000000,
    rawMarketCap: 18000000000,
    history: generateHistory(0.12),
    dailyHistory: generateDailyHistory(0.12)
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    price: 7.50,
    change24h: -2.1,
    volume24h: '200M',
    marketCap: '9B',
    rawVolume: 200000000,
    rawMarketCap: 9000000000,
    history: generateHistory(7.50),
    dailyHistory: generateDailyHistory(7.50)
  },
  {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    price: 0.85,
    change24h: 1.5,
    volume24h: '350M',
    marketCap: '8.5B',
    rawVolume: 350000000,
    rawMarketCap: 8500000000,
    history: generateHistory(0.85),
    dailyHistory: generateDailyHistory(0.85)
  },
  {
    id: 'litecoin',
    symbol: 'LTC',
    name: 'Litecoin',
    price: 85.00,
    change24h: 0.2,
    volume24h: '400M',
    marketCap: '6.3B',
    rawVolume: 400000000,
    rawMarketCap: 6300000000,
    history: generateHistory(85.00),
    dailyHistory: generateDailyHistory(85.00)
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    price: 14.20,
    change24h: 3.2,
    volume24h: '500M',
    marketCap: '8.8B',
    rawVolume: 500000000,
    rawMarketCap: 8800000000,
    history: generateHistory(14.20),
    dailyHistory: generateDailyHistory(14.20)
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    price: 35.40,
    change24h: -1.5,
    volume24h: '450M',
    marketCap: '13B',
    rawVolume: 450000000,
    rawMarketCap: 13000000000,
    history: generateHistory(35.40),
    dailyHistory: generateDailyHistory(35.40)
  },
  {
    id: 'shiba-inu',
    symbol: 'SHIB',
    name: 'Shiba Inu',
    price: 0.000025,
    change24h: 4.1,
    volume24h: '600M',
    marketCap: '14B',
    rawVolume: 600000000,
    rawMarketCap: 14000000000,
    history: generateHistory(0.000025),
    dailyHistory: generateDailyHistory(0.000025)
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap',
    price: 7.80,
    change24h: 1.8,
    volume24h: '150M',
    marketCap: '4.6B',
    rawVolume: 150000000,
    rawMarketCap: 4600000000,
    history: generateHistory(7.80),
    dailyHistory: generateDailyHistory(7.80)
  }
];

// Mock Admin Data
export const MOCK_DEPOSITS: DepositRequest[] = [
    {
        id: 'dep_1',
        userId: 'u_101',
        userName: 'Ahmed Ali',
        amount: 5000,
        method: 'BANK',
        status: 'PENDING',
        date: '2023-10-25 14:30',
        proofImage: 'receipt1.jpg'
    },
    {
        id: 'dep_2',
        userId: 'u_102',
        userName: 'Sara Smith',
        amount: 1200,
        method: 'BANK',
        status: 'PENDING',
        date: '2023-10-26 09:15',
        proofImage: 'receipt2.jpg'
    },
     {
        id: 'dep_3',
        userId: 'u_103',
        userName: 'Khalid Otaibi',
        amount: 10000,
        method: 'BANK',
        status: 'APPROVED',
        date: '2023-10-24 11:00',
    }
];

export const MOCK_KYC_REQUESTS: User[] = [
    {
        id: 'u_201',
        name: 'Fahad Al-Harbi',
        email: 'fahad@example.com',
        isLoggedIn: false,
        kycLevel: 1,
        kycStatus: 'PENDING',
        balanceUSDT: 0,
        portfolio: []
    },
    {
        id: 'u_202',
        name: 'Mona Zaki',
        email: 'mona@example.com',
        isLoggedIn: false,
        kycLevel: 1,
        kycStatus: 'PENDING',
        balanceUSDT: 0,
        portfolio: []
    }
];

// Mock Service Data
export const MOCK_TRADERS: CopyTrader[] = [
    { id: '1', name: 'CryptoKing', roi: 452.3, followers: 12500, image: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'SafeInvest_SA', roi: 120.5, followers: 8900, image: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'BitcoinWhale', roi: 34.2, followers: 23000, image: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'AlphaStrategy', roi: 210.8, followers: 5400, image: 'https://i.pravatar.cc/150?u=4' },
];

export const MOCK_ARTICLES: Article[] = [
    { id: '1', title: 'What is Blockchain?', reward: 5, time: '5 min', image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=300' },
    { id: '2', title: 'How to trade on Margin', reward: 10, time: '10 min', image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=300' },
    { id: '3', title: 'Safety tips for P2P', reward: 3, time: '3 min', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=300' },
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
// FIX: Added missing userId property to align with the ActivityLog type.
    { id: '1', userId: 'u_101', action: 'Login Successful', ip: '192.168.1.1', date: '2023-11-01 10:00:00', device: 'Chrome / Windows' },
// FIX: Added missing userId property to align with the ActivityLog type.
    { id: '2', userId: 'u_101', action: 'Deposit (Card)', ip: '192.168.1.1', date: '2023-11-01 10:15:30', device: 'Chrome / Windows' },
// FIX: Added missing userId property to align with the ActivityLog type.
    { id: '3', userId: 'u_101', action: 'Trade BUY BTC', ip: '192.168.1.1', date: '2023-11-01 11:20:45', device: 'Chrome / Windows' },
// FIX: Added missing userId property to align with the ActivityLog type.
    { id: '4', userId: 'u_101', action: 'Password Change', ip: '192.168.1.1', date: '2023-10-30 09:12:00', device: 'App / iOS' },
];

// --- NEW MOCK DATA FOR REWARDS & NFT ---

export const MOCK_MISSIONS: Mission[] = [
    { id: '1', title: 'Daily Login', description: 'Log in to the app once a day.', reward: 10, progress: 1, total: 1, completed: true, claimed: false, icon: 'LOGIN' },
    { id: '2', title: 'First Trade', description: 'Complete your first spot trade.', reward: 50, progress: 0, total: 1, completed: false, claimed: false, icon: 'TRADE' },
    { id: '3', title: 'Deposit Pro', description: 'Deposit more than $100.', reward: 100, progress: 0, total: 1, completed: false, claimed: false, icon: 'DEPOSIT' },
    { id: '4', title: 'Inviter', description: 'Invite 3 friends to join.', reward: 200, progress: 1, total: 3, completed: false, claimed: false, icon: 'INVITE' },
];

export const MOCK_NFTS: NFTItem[] = [
    { id: '1', name: 'Bored Ape #4521', collection: 'Bored Ape Yacht Club', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=300', price: 12.5, currency: 'ETH', likes: 120, owner: '0x123...' },
    { id: '2', name: 'CyberPunk 2077', collection: 'CyberPunks', image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=300', price: 4.2, currency: 'ETH', likes: 85, owner: '0xabc...' },
    { id: '3', name: 'Space Walker', collection: 'Cosmic Art', image: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?auto=format&fit=crop&w=300', price: 150, currency: 'SOL', likes: 210, owner: '0xdef...' },
    { id: '4', name: 'Golden Ticket', collection: 'Access Pass', image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=300', price: 500, currency: 'USDT', likes: 45, owner: 'CoinSouq' },
];
