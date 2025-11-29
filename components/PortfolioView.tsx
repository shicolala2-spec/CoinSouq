
import React from 'react';
import { User, Coin, TranslateFn } from '../types';
import { Wallet, TrendingUp, TrendingDown, ArrowRight, PieChart, ShieldAlert, CheckCircle } from 'lucide-react';

interface PortfolioViewProps {
  user: User;
  coins: Coin[];
  onSelectCoin: (coin: Coin) => void;
  onGoToMarket: () => void;
  t: TranslateFn;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ 
  user, 
  coins, 
  onSelectCoin,
  onGoToMarket,
  t
}) => {
  const totalPortfolioValue = user.portfolio.reduce((acc, item) => {
    const currentPrice = coins.find(c => c.id === item.coinId)?.price || 0;
    return acc + (item.amount * currentPrice);
  }, 0);

  const totalBalance = user.balanceUSDT + totalPortfolioValue;

  return (
    <div className="animate-fadeIn space-y-6">
      
      {/* KYC Warning Banner */}
      {user.kycLevel < 2 && (
        <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/20 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-50"></div>
            
            <div className="p-3 bg-orange-500/10 rounded-full text-orange-400 shrink-0">
                <ShieldAlert size={28} />
            </div>
            
            <div className="flex-1 z-10">
                <h3 className="font-bold text-white text-lg mb-1 flex items-center gap-2">
                    {t('port_kyc_warn')}
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">Level: {user.kycLevel}</span>
                </h3>
                <p className="text-gray-300 text-sm mb-3 max-w-2xl leading-relaxed">
                    {t('port_kyc_desc')}
                </p>
            </div>
            
            <button className="w-full md:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-sm transition-all shadow-lg shadow-orange-900/20 whitespace-nowrap z-10">
                Verify Now
            </button>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 relative overflow-hidden shadow-lg">
        <div className="relative z-10">
            <h2 className="text-crypto-muted mb-2 text-sm font-medium flex items-center gap-2">
                <Wallet size={16} />
                {t('port_total_bal')}
            </h2>
            <div className="text-4xl font-bold font-mono text-white mb-6">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            
            <div className="flex flex-wrap gap-4">
                <div className="bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 min-w-[140px]">
                    <span className="text-xs text-crypto-muted block mb-1">USDT Available</span>
                    <span className="font-mono font-bold text-lg text-white">${user.balanceUSDT.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 min-w-[140px]">
                    <span className="text-xs text-crypto-muted block mb-1">Asset Value</span>
                    <span className="font-mono font-bold text-lg text-crypto-accent">${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
        <PieChart className="absolute -bottom-8 -left-8 text-white/5 w-56 h-56 rotate-12" />
      </div>

      <h3 className="text-xl font-bold flex items-center gap-2 mt-8">
        <span className="w-1 h-6 bg-crypto-accent rounded-full"></span>
        {t('port_assets')}
      </h3>
      
      {user.portfolio.length === 0 ? (
          <div className="text-center py-16 bg-crypto-card rounded-xl border border-gray-800 border-dashed">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-crypto-muted" size={32} />
              </div>
              <p className="text-crypto-muted text-lg mb-2">{t('port_empty')}</p>
              <button 
                onClick={onGoToMarket} 
                className="px-6 py-2 bg-crypto-accent text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
              >
                Go to Market
                <ArrowRight size={18} />
              </button>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.portfolio.map(item => {
                const coin = coins.find(c => c.id === item.coinId);
                if (!coin) return null;
                const currentValue = item.amount * coin.price;
                const costBasis = item.amount * item.averageBuyPrice;
                const profit = currentValue - costBasis;
                const profitPercent = (profit / costBasis) * 100;

                return (
                    <div key={item.coinId} className="bg-crypto-card p-5 rounded-xl border border-gray-800 hover:border-gray-600 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-white shadow-lg border border-gray-600">
                                    {coin.symbol[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-white">{coin.name}</div>
                                    <div className="text-xs text-crypto-muted font-mono">{item.amount.toFixed(4)} {coin.symbol}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-lg text-white">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                <div className="text-xs text-crypto-accent animate-pulse">
                                    ${coin.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t border-gray-800/50">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Avg Buy</span>
                                <span className="font-mono text-gray-300">${item.averageBuyPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">PnL</span>
                                <div className={`font-mono font-medium flex items-center gap-1 ${profit >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                                    {profit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span dir="ltr">{profit >= 0 ? '+' : ''}{profit.toFixed(2)}$ ({profitPercent.toFixed(2)}%)</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => onSelectCoin(coin)}
                            className="w-full mt-4 bg-gray-800 hover:bg-crypto-accent hover:text-black py-2.5 rounded-lg text-sm font-bold transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                            Trade {coin.symbol}
                        </button>
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};
