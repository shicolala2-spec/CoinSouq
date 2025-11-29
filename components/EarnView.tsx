
import React from 'react';
import { TrendingUp, ShieldCheck, Lock, Clock } from 'lucide-react';
import { Coin } from '../types';

interface EarnViewProps {
  coins: Coin[];
}

export const EarnView: React.FC<EarnViewProps> = ({ coins }) => {
  const earnProducts = [
    { id: 'usdt', symbol: 'USDT', name: 'Tether', apy: 12.5, term: 'Flexible', risk: 'Low' },
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', apy: 5.2, term: '30 Days', risk: 'Low' },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', apy: 6.8, term: 'Flexible', risk: 'Medium' },
    { id: 'sol', symbol: 'SOL', name: 'Solana', apy: 15.4, term: '90 Days', risk: 'Medium' },
    { id: 'dot', symbol: 'DOT', name: 'Polkadot', apy: 18.2, term: '120 Days', risk: 'High' },
  ];

  return (
    <div className="animate-fadeIn pb-24 px-4 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="mt-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 md:p-8 flex items-center justify-between border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">CoinSouq Earn</h2>
            <p className="text-indigo-200 text-sm max-w-md mb-6">
                احصل على عوائد سلبية على عملاتك الرقمية. تخزين آمن، عوائد عالية، ومرونة في السحب.
            </p>
            <div className="flex gap-4">
                <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <span className="block text-xl font-bold text-crypto-accent">12.5%</span>
                    <span className="text-[10px] text-gray-300">أعلى عائد USDT</span>
                </div>
                <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <span className="block text-xl font-bold text-white">$450M+</span>
                    <span className="text-[10px] text-gray-300">أصول مخزنة</span>
                </div>
            </div>
        </div>
        <TrendingUp className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5" />
      </div>

      <h3 className="text-lg font-bold text-white mt-8 mb-4 flex items-center gap-2">
        <ShieldCheck className="text-crypto-green" size={20} />
        منتجات موصى بها
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {earnProducts.map((product) => (
            <div key={product.id} className="bg-crypto-card border border-gray-800 rounded-xl p-5 hover:border-crypto-accent transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-white border border-gray-700">
                            {product.symbol[0]}
                        </div>
                        <div>
                            <div className="font-bold text-white">{product.symbol}</div>
                            <div className="text-xs text-crypto-muted">{product.name}</div>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        product.risk === 'Low' ? 'border-green-900 text-green-400 bg-green-900/20' : 
                        product.risk === 'Medium' ? 'border-yellow-900 text-yellow-400 bg-yellow-900/20' : 
                        'border-red-900 text-red-400 bg-red-900/20'
                    }`}>
                        مخاطرة: {product.risk === 'Low' ? 'منخفضة' : product.risk === 'Medium' ? 'متوسطة' : 'عالية'}
                    </div>
                </div>

                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-xs text-crypto-muted mb-1">العائد السنوي (APY)</div>
                        <div className="text-2xl font-bold text-crypto-green font-mono">{product.apy}%</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-crypto-muted mb-1">المدة</div>
                        <div className="text-sm font-bold text-white flex items-center justify-end gap-1">
                            {product.term === 'Flexible' ? <Lock size={12} className="text-green-500" /> : <Clock size={12} className="text-yellow-500" />}
                            {product.term === 'Flexible' ? 'مرن' : product.term}
                        </div>
                    </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-gray-800 text-white font-medium text-sm hover:bg-crypto-accent hover:text-black transition-colors group-hover:shadow-lg group-hover:shadow-yellow-500/10">
                    اكتتاب
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};
