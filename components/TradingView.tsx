
import React, { useState, useEffect } from 'react';
import { Coin, User, TranslateFn } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Info, AlertTriangle, X, LogIn, Plus, ArrowDown, ArrowUp, Zap, Bot, Gauge } from 'lucide-react';
import { getSmartInsight } from '../services/geminiService';
import { fetchCoinHistory } from '../services/cryptoService';

interface TradingViewProps {
  coin: Coin;
  user: User;
  onTrade: (type: 'BUY' | 'SELL', amount: number, cost: number) => void;
  onBack: () => void;
  onOpenAuth: () => void;
  onOpenDeposit: () => void;
  t: TranslateFn;
}

// Helper to generate mock order book data based on current price
const generateOrderBook = (basePrice: number) => {
    const asks = Array.from({ length: 7 }, (_, i) => ({
        price: basePrice * (1 + (0.001 * (i + 1)) + (Math.random() * 0.0005)),
        amount: Math.random() * 2 + 0.1,
        total: 0
    })).reverse(); // High to Low

    const bids = Array.from({ length: 7 }, (_, i) => ({
        price: basePrice * (1 - (0.001 * (i + 1)) - (Math.random() * 0.0005)),
        amount: Math.random() * 2 + 0.1,
        total: 0
    }));

    return { asks, bids };
};

type TradeMode = 'SPOT' | 'MARGIN' | 'BOT';
type OrderType = 'MARKET' | 'LIMIT' | 'STOP';

export const TradingView: React.FC<TradingViewProps> = ({ coin, user, onTrade, onBack, onOpenAuth, onOpenDeposit, t }) => {
  const [tradeMode, setTradeMode] = useState<TradeMode>('SPOT');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  
  const [amount, setAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>(coin.price.toString());
  const [stopPrice, setStopPrice] = useState<string>(coin.price.toString());
  
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [detailedHistory, setDetailedHistory] = useState(coin.dailyHistory);
  const [showConfirm, setShowConfirm] = useState(false);
  const [botActive, setBotActive] = useState(false);
  
  // Order Book State
  const [orderBook, setOrderBook] = useState(generateOrderBook(coin.price));
  const [sentiment, setSentiment] = useState(50); // 0-100 Fear-Greed

  useEffect(() => {
    setAmount('');
    setInsight('');
    setDetailedHistory(coin.dailyHistory);
    setLimitPrice(coin.price.toString());
    
    // Simulate sentiment calculation
    setSentiment(50 + (coin.change24h * 2));

    const fetchInsight = async () => {
        setLoadingInsight(true);
        const text = await getSmartInsight(coin);
        setInsight(text);
        setLoadingInsight(false);
    }

    const loadHistory = async () => {
        const history = await fetchCoinHistory(coin.id);
        if (history.length > 0) {
            setDetailedHistory(history);
        }
    }

    fetchInsight();
    loadHistory();
  }, [coin.id]);

  useEffect(() => {
      const interval = setInterval(() => {
          setOrderBook(generateOrderBook(coin.price));
      }, 2000);
      return () => clearInterval(interval);
  }, [coin.price]);

  const numericAmount = parseFloat(amount) || 0;
  // Margin Logic: 5x Leverage
  const leverage = tradeMode === 'MARGIN' ? 5 : 1;
  const totalCost = numericAmount * (orderType === 'MARKET' ? coin.price : parseFloat(limitPrice));
  
  const availableBalance = tradeMode === 'MARGIN' ? user.balanceUSDT * 5 : user.balanceUSDT;
  
  const maxBuy = availableBalance / (orderType === 'MARKET' ? coin.price : parseFloat(limitPrice));
  const userCoin = user.portfolio.find(p => p.coinId === coin.id);
  const maxSell = userCoin ? userCoin.amount : 0;
  const isInsufficientFunds = tradeType === 'BUY' && totalCost > availableBalance;

  const handleTradeClick = () => {
    if (numericAmount <= 0) return;
    if (tradeMode === 'BOT') {
        setBotActive(!botActive);
        return;
    }
    // For Demo: Limit/Stop orders just execute like market orders
    setShowConfirm(true);
  };

  const executeTrade = () => {
    onTrade(tradeType, numericAmount, totalCost);
    setAmount('');
    setShowConfirm(false);
  };

  const isValid = numericAmount > 0 && 
    (tradeType === 'BUY' ? !isInsufficientFunds : numericAmount <= maxSell);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-fadeIn relative pb-20 lg:pb-0">
      
      {/* LEFT: Chart & Info */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-crypto-card p-5 rounded-xl border border-gray-800 h-[500px] flex flex-col relative">
            {/* Fear & Greed Indicator */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur rounded-lg p-2 border border-white/10 flex flex-col items-center">
                <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                    <Gauge size={12} /> Sentiment
                </div>
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
                    <div 
                        className={`h-full transition-all duration-1000 ${sentiment > 50 ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{width: `${sentiment}%`}}
                    ></div>
                </div>
                <span className={`text-xs font-bold ${sentiment > 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {sentiment > 55 ? t('sentiment_greed') : sentiment < 45 ? t('sentiment_fear') : t('sentiment_neutral')} ({sentiment.toFixed(0)})
                </span>
            </div>

            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="text-crypto-muted hover:text-white mb-1 lg:hidden">
                             &larr;
                        </button>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {coin.symbol} <span className="text-crypto-muted text-sm">/ USDT</span>
                        </h2>
                    </div>
                    <div className={`text-2xl font-mono mt-1 ${coin.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        ${coin.price.toLocaleString()}
                    </div>
                </div>
                {/* AI Insight moved to be less obtrusive */}
                <div className="bg-blue-900/20 border border-blue-500/20 p-2 rounded-lg text-[10px] text-crypto-muted max-w-[180px] mt-8 lg:mt-0">
                    <div className="flex items-center gap-1 text-blue-400 mb-1">
                        <Info size={10} />
                        <span className="font-bold">AI Analysis</span>
                    </div>
                    {loadingInsight ? (
                        <span className="animate-pulse">Analyzing...</span>
                    ) : (
                        <p className="leading-tight line-clamp-2">{insight}</p>
                    )}
                </div>
            </div>

            <div className="flex-1 w-full min-h-0" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coin.history}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={coin.change24h >= 0 ? '#0ECB81' : '#F6465D'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={coin.change24h >= 0 ? '#0ECB81' : '#F6465D'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={['auto', 'auto']} hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#151A21', border: '1px solid #2B3139', borderRadius: '8px' }}
                            itemStyle={{ color: '#EAECEF' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={coin.change24h >= 0 ? '#0ECB81' : '#F6465D'} 
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed History Table */}
        <div className="bg-crypto-card p-4 rounded-xl border border-gray-800 hidden lg:block">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                7 Days History
            </h3>
            {detailedHistory && detailedHistory.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                        <thead className="text-crypto-muted border-b border-gray-800">
                            <tr>
                                <th className="pb-2">Date</th>
                                <th className="pb-2 text-left">High</th>
                                <th className="pb-2 text-left">Low</th>
                                <th className="pb-2 text-left">Vol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {detailedHistory.slice(0, 3).map((day, idx) => (
                                <tr key={idx} className="hover:bg-gray-800/30">
                                    <td className="py-2 text-crypto-muted dir-ltr text-right">{day.date}</td>
                                    <td className="py-2 text-crypto-green text-left">${day.high.toLocaleString()}</td>
                                    <td className="py-2 text-crypto-red text-left">${day.low.toLocaleString()}</td>
                                    <td className="py-2 text-white text-left">{day.volume}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <div className="text-center text-xs text-crypto-muted">No Data</div>}
        </div>
      </div>

      {/* MIDDLE: Order Book */}
      <div className="lg:col-span-1 bg-crypto-card rounded-xl border border-gray-800 flex flex-col overflow-hidden h-[500px]">
        <div className="p-3 border-b border-gray-800">
            <h3 className="text-sm font-bold text-white">Order Book</h3>
        </div>
        <div className="flex-1 flex flex-col text-xs font-mono">
            {/* Asks (Sellers) - Red */}
            <div className="flex-1 flex flex-col-reverse justify-end overflow-hidden">
                {orderBook.asks.map((ask, i) => (
                    <div key={`ask-${i}`} className="flex justify-between px-3 py-1 hover:bg-gray-800 cursor-pointer relative">
                        <div className="absolute top-0 right-0 h-full bg-red-900/10" style={{width: `${Math.random() * 80}%`}}></div>
                        <span className="text-crypto-red z-10">{ask.price.toFixed(2)}</span>
                        <span className="text-white z-10">{ask.amount.toFixed(4)}</span>
                    </div>
                ))}
            </div>
            
            {/* Current Price */}
            <div className="py-2 px-3 border-y border-gray-800 flex items-center justify-center gap-2 bg-gray-900">
                <span className={`text-lg font-bold ${coin.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                    ${coin.price.toLocaleString()}
                </span>
                {coin.change24h >= 0 ? <ArrowUp size={14} className="text-crypto-green"/> : <ArrowDown size={14} className="text-crypto-red"/>}
            </div>

            {/* Bids (Buyers) - Green */}
            <div className="flex-1 overflow-hidden">
                {orderBook.bids.map((bid, i) => (
                    <div key={`bid-${i}`} className="flex justify-between px-3 py-1 hover:bg-gray-800 cursor-pointer relative">
                        <div className="absolute top-0 right-0 h-full bg-green-900/10" style={{width: `${Math.random() * 80}%`}}></div>
                        <span className="text-crypto-green z-10">{bid.price.toFixed(2)}</span>
                        <span className="text-white z-10">{bid.amount.toFixed(4)}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* RIGHT: Advanced Trade Form */}
      <div className="lg:col-span-1">
        <div className="bg-crypto-card p-4 rounded-xl border border-gray-800 h-full flex flex-col">
            
            {/* Mode Tabs */}
            <div className="flex bg-gray-900 rounded-lg p-1 mb-4">
                {(['SPOT', 'MARGIN', 'BOT'] as TradeMode[]).map(mode => (
                    <button 
                        key={mode}
                        className={`flex-1 py-1.5 rounded-md font-bold text-[10px] md:text-xs transition-colors flex items-center justify-center gap-1 ${tradeMode === mode ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-white'}`}
                        onClick={() => setTradeMode(mode)}
                    >
                        {mode === 'MARGIN' ? <Zap size={12}/> : mode === 'BOT' ? <Bot size={12}/> : null}
                        {mode === 'SPOT' ? t('trade_type_spot') : mode === 'MARGIN' ? t('trade_type_margin') : t('trade_type_bot')}
                    </button>
                ))}
            </div>

            {tradeMode === 'BOT' ? (
                // --- BOT INTERFACE ---
                <div className="flex-1 space-y-4 animate-fadeIn">
                     <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg text-xs text-blue-200">
                        <p>AI Bot automatically places orders based on Grid Strategy.</p>
                     </div>
                     <div>
                        <label className="text-[10px] text-crypto-muted mb-1 block font-bold">{t('bot_strategy')}</label>
                        <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm">
                            <option>{t('bot_grid')}</option>
                            <option>{t('bot_dca')}</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] text-crypto-muted mb-1 block font-bold">Investment (USDT)</label>
                        <input type="number" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white" placeholder="100" />
                     </div>
                     <button 
                        onClick={() => setBotActive(!botActive)}
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${botActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-crypto-accent hover:bg-yellow-400 text-black'}`}
                     >
                        {botActive ? 'Stop Bot' : t('bot_start')}
                     </button>
                     {botActive && (
                        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-green-500/30 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                            <div className="text-center text-green-400 font-bold text-sm">Bot Running...</div>
                            <div className="flex justify-between text-xs mt-2 text-gray-400">
                                <span>PnL:</span>
                                <span className="text-green-500">+$1.24 (0.5%)</span>
                            </div>
                        </div>
                     )}
                </div>
            ) : (
                // --- SPOT / MARGIN INTERFACE ---
                <div className="flex-1 flex flex-col">
                    {/* Trade Type Tabs (Buy/Sell) */}
                    <div className="flex bg-gray-900/50 rounded-lg p-1 mb-4">
                        <button 
                            className={`flex-1 py-2 rounded-md font-bold text-sm transition-colors ${tradeType === 'BUY' ? 'bg-crypto-green text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setTradeType('BUY')}
                        >
                            {t('trade_buy')}
                        </button>
                        <button 
                            className={`flex-1 py-2 rounded-md font-bold text-sm transition-colors ${tradeType === 'SELL' ? 'bg-crypto-red text-white' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setTradeType('SELL')}
                        >
                            {t('trade_sell')}
                        </button>
                    </div>

                    {/* Order Type Dropdown */}
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        {(['MARKET', 'LIMIT', 'STOP'] as OrderType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setOrderType(type)}
                                className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${orderType === type ? 'border-crypto-accent text-crypto-accent bg-yellow-500/10' : 'border-gray-700 text-gray-500 hover:text-white'}`}
                            >
                                {type === 'MARKET' ? t('order_market') : type === 'LIMIT' ? t('order_limit') : t('order_stop')}
                            </button>
                        ))}
                    </div>

                    {user.isLoggedIn ? (
                        <div className="space-y-4">
                            {/* Available Balance */}
                            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                                <div className="flex justify-between text-xs text-crypto-muted mb-1">
                                    <span className="flex items-center gap-1"><Wallet size={10} /> {t('trade_available')}</span>
                                    <span className="text-white font-mono">
                                        {tradeType === 'BUY' 
                                            ? `${availableBalance.toLocaleString(undefined, {maximumFractionDigits: 2})} USDT` 
                                            : `${maxSell.toFixed(6)} ${coin.symbol}`
                                        }
                                    </span>
                                </div>
                                {tradeMode === 'MARGIN' && tradeType === 'BUY' && (
                                    <div className="text-[10px] text-orange-400 text-right font-bold mt-1">5x Leverage Active</div>
                                )}
                            </div>

                            {/* Inputs */}
                            {orderType !== 'MARKET' && (
                                <div>
                                    <label className="text-[10px] text-crypto-muted mb-1 block font-bold">{orderType === 'STOP' ? t('lbl_trigger') : t('lbl_price')}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={orderType === 'LIMIT' ? limitPrice : stopPrice}
                                            onChange={(e) => orderType === 'LIMIT' ? setLimitPrice(e.target.value) : setStopPrice(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-crypto-accent text-left font-mono"
                                            style={{ direction: 'ltr' }}
                                        />
                                        <span className="absolute right-3 top-3.5 text-crypto-muted text-xs font-bold">USDT</span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] text-crypto-muted mb-1 block font-bold">{t('trade_amount')}</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-gray-900 border border-gray-700 group-hover:border-gray-600 rounded-lg py-3 px-3 text-white focus:outline-none focus:border-crypto-accent text-left font-mono"
                                        style={{ direction: 'ltr' }}
                                    />
                                    <span className="absolute right-3 top-3.5 text-crypto-muted text-xs font-bold">{coin.symbol}</span>
                                </div>
                            </div>

                            {/* Percentages */}
                            <div className="grid grid-cols-4 gap-1.5">
                                {[25, 50, 75, 100].map(pct => (
                                    <button
                                        key={pct}
                                        onClick={() => {
                                            const max = tradeType === 'BUY' ? maxBuy : maxSell;
                                            setAmount((max * (pct / 100)).toFixed(6));
                                        }}
                                        className="bg-gray-800 hover:bg-gray-700 text-[10px] py-1.5 rounded text-crypto-muted transition-colors font-mono"
                                    >
                                        {pct}%
                                    </button>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="border-t border-gray-800 pt-3 mt-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-crypto-muted text-xs">{t('trade_total')}</span>
                                    <span className="text-white font-mono text-sm font-bold">${totalCost.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-crypto-muted text-[10px]">{t('trade_fee')} (0.1%)</span>
                                    <span className="text-crypto-muted text-[10px] font-mono">${(totalCost * 0.001).toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {isInsufficientFunds ? (
                                <button
                                    onClick={onOpenDeposit}
                                    className="w-full py-3 rounded-lg font-bold text-sm bg-crypto-accent text-black hover:bg-yellow-400 transition-all shadow-lg animate-pulse"
                                >
                                    {t('btn_deposit')}
                                </button>
                            ) : (
                                <button
                                    disabled={!isValid}
                                    onClick={handleTradeClick}
                                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all transform active:scale-95 shadow-lg ${
                                        !isValid ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                                        tradeType === 'BUY' 
                                            ? 'bg-crypto-green hover:bg-green-600 text-white shadow-green-900/20' 
                                            : 'bg-crypto-red hover:bg-red-600 text-white shadow-red-900/20'
                                    }`}
                                >
                                    {tradeType === 'BUY' ? t('trade_buy') : t('trade_sell')} {coin.symbol}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 space-y-3">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto text-crypto-muted">
                                <LogIn size={24} />
                            </div>
                            <p className="text-xs text-crypto-muted">{t('trade_login_req')}</p>
                            <button 
                                onClick={onOpenAuth}
                                className="w-full py-2.5 bg-crypto-accent text-black font-bold rounded-lg text-sm hover:bg-yellow-400 transition-colors"
                            >
                                {t('auth_login')} / {t('auth_signup')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-crypto-card border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100">
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500" size={20} />
                            {t('trade_confirm')}
                        </h3>
                        <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-3 space-y-2 mb-4 border border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Pair</span>
                            <span className="font-bold text-white">{coin.symbol}/USDT</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Type</span>
                            <span className={`font-bold ${tradeType === 'BUY' ? 'text-crypto-green' : 'text-crypto-red'}`}>
                                {tradeMode === 'MARGIN' ? 'Margin' : ''} {orderType} {tradeType === 'BUY' ? 'Buy' : 'Sell'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">{t('trade_amount')}</span>
                            <span className="font-mono text-white">{numericAmount} {coin.symbol}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                            <span className="text-gray-300 font-medium text-sm">Total</span>
                            <span className="font-mono font-bold text-lg text-crypto-accent">
                                ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors text-sm"
                        >
                            {t('trade_cancel')}
                        </button>
                        <button 
                            onClick={executeTrade}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 text-sm ${
                                tradeType === 'BUY' 
                                ? 'bg-crypto-green hover:bg-green-600 shadow-green-900/20' 
                                : 'bg-crypto-red hover:bg-red-600 shadow-red-900/20'
                            }`}
                        >
                            {t('trade_confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
