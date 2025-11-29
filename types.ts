

export interface DailyHistoryItem {
  date: string;
  high: number;
  low: number;
  volume: string;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number; // Percentage
  volume24h: string;
  marketCap: string;
  // Raw numbers for sorting
  rawVolume?: number;
  rawMarketCap?: number;
  
  history: { time: string; price: number }[];
  dailyHistory?: DailyHistoryItem[];
}

export interface PortfolioItem {
  coinId: string;
  amount: number;
  averageBuyPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // Encrypted (Simulated)
  isLoggedIn: boolean;
  kycLevel: 0 | 1 | 2 | 3; // 0: None, 1: Basic, 2: ID Verified, 3: Address Verified
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  balanceUSDT: number;
  portfolio: PortfolioItem[];
  // New Fields
  twoFactorEnabled?: boolean;
  referralCode?: string;
  referralEarnings?: number;
  points?: number; // For Rewards Center
  streakDays?: number; // For Login Streak
  lastLoginDate?: string;
  // Wallet Addresses
  walletAddressUSDT?: string;
  walletAddressBTC?: string;
  walletAddressETH?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'BUY' | 'SELL';
  coinId: string;
  coinSymbol: string;
  amount: number;
  priceAtTransaction: number;
  totalCost: number;
  date: string;
  status: 'COMPLETED' | 'FAILED';
}

export interface DepositRequest {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    method: 'BANK' | 'CARD';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    date: string;
    proofImage?: string; // For bank transfer mockup
    txHash?: string; // For card simulation
}

export interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    ip: string;
    date: string;
    device: string;
}

export interface CopyTrader {
    id: string;
    name: string;
    roi: number;
    followers: number;
    image: string;
}

export interface Article {
    id: string;
    title: string;
    reward: number;
    time: string;
    image: string;
}

// --- NEW TYPES FOR REWARDS & NFT ---

export interface Mission {
    id: string;
    title: string;
    description: string;
    reward: number;
    progress: number;
    total: number;
    completed: boolean;
    claimed: boolean;
    icon: 'TRADE' | 'LOGIN' | 'DEPOSIT' | 'INVITE';
}

export interface NFTItem {
    id: string;
    name: string;
    collection: string;
    image: string;
    price: number;
    currency: 'ETH' | 'SOL' | 'USDT';
    likes: number;
    owner: string;
}

export enum AppView {
  AUTH = 'AUTH',
  MARKET = 'MARKET',
  TRADE = 'TRADE',
  PORTFOLIO = 'PORTFOLIO',
  P2P = 'P2P',
  EARN = 'EARN',
  SERVICES = 'SERVICES',
  PROFILE = 'PROFILE',
  AI_CHAT = 'AI_CHAT',
  PAYMENT = 'PAYMENT',
  ADMIN = 'ADMIN',
  REWARDS = 'REWARDS',
  NFT = 'NFT'
}

export type TranslateFn = (key: string) => string;
