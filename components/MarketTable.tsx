
import React from 'react';
import { Coin, TranslateFn } from '../types';
import { TrendingUp, TrendingDown, ArrowRightLeft, Star } from 'lucide-react';

interface MarketTableProps {
  coins: Coin[];
  onSelectCoin: (coin: Coin) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, coinId: string) => void;
  t: TranslateFn;
}

export const MarketTable: React.FC<MarketTableProps> = ({ coins, onSelectCoin, favorites, onToggleFavorite, t }) => {
  return (
    <div className="bg-crypto-card rounded-xl overflow-hidden border border-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-800/50 text-crypto-muted text-sm">
            <tr>
              <th className="p-4 w-10"></th>
              <th className="p-4 font-medium">{t('tbl_coin')}</th>
              <th className="p-4 font-medium">{t('tbl_price')}</th>
              <th className="p-4 font-medium">{t('tbl_change')}</th>
              <th className="p-4 font-medium hidden md:table-cell">{t('tbl_mcap')}</th>
              <th className="p-4 font-medium">{t('tbl_action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {coins.map((coin) => {
              const isFav = favorites.includes(coin.id);
              return (
              <tr 
                key={coin.id} 
                className="hover:bg-gray-800/30 transition-colors cursor-pointer group"
                onClick={() => onSelectCoin(coin)}
              >
                <td className="p-4">
                    <button 
                        onClick={(e) => onToggleFavorite(e, coin.id)}
                        className={`transition-colors p-1 rounded-full hover:bg-gray-700 ${isFav ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-200'}`}
                    >
                        <Star size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      {coin.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{coin.symbol}</div>
                      <div className="text-xs text-crypto-muted">{coin.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium">
                  ${coin.price.toLocaleString(undefined, { maximumFractionDigits: coin.price < 1 ? 6 : 2 })}
                </td>
                <td className="p-4">
                  <div className={`flex items-center gap-1 ${coin.change24h >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                    {coin.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span dir="ltr">{Math.abs(coin.change24h).toFixed(2)}%</span>
                  </div>
                </td>
                <td className="p-4 text-crypto-muted hidden md:table-cell">
                  ${coin.marketCap}
                </td>
                <td className="p-4">
                  <button 
                    className="px-4 py-1.5 bg-gray-800 hover:bg-crypto-accent hover:text-black text-crypto-accent rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    <span>{t('btn_trade')}</span>
                    <ArrowRightLeft size={14} />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};
