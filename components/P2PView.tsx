
import React, { useState } from 'react';
import { Filter, Star, ThumbsUp, ChevronDown, Search, ArrowRightLeft, CreditCard, Building2, Wallet } from 'lucide-react';

const MOCK_P2P_OFFERS = [
  { id: 1, type: 'SELL', merchant: 'BinanceKing', verified: true, orders: 1542, completion: 99.5, price: 3.76, currency: 'SAR', limitMin: 500, limitMax: 25000, methods: ['Bank Transfer', 'STC Pay'] },
  { id: 2, type: 'SELL', merchant: 'CryptoFast_SA', verified: true, orders: 850, completion: 97.2, price: 3.77, currency: 'SAR', limitMin: 100, limitMax: 5000, methods: ['UrPay', 'Alinma Bank'] },
  { id: 3, type: 'SELL', merchant: 'GoldenTrader', verified: false, orders: 120, completion: 92.0, price: 3.79, currency: 'SAR', limitMin: 1000, limitMax: 100000, methods: ['Bank Transfer'] },
  { id: 4, type: 'BUY', merchant: 'SaudiWhale', verified: true, orders: 3200, completion: 99.9, price: 3.72, currency: 'SAR', limitMin: 5000, limitMax: 50000, methods: ['Bank Transfer', 'SNB'] },
];

export const P2PView: React.FC = () => {
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [asset, setAsset] = useState('USDT');
  const [fiat, setFiat] = useState('SAR');

  // Logic flip: If I want to BUY USDT, I look for SELL offers from merchants
  const displayOffers = MOCK_P2P_OFFERS.filter(o => o.type === (mode === 'BUY' ? 'SELL' : 'BUY'));

  return (
    <div className="animate-fadeIn pb-24">
      {/* Header & Controls */}
      <div className="bg-crypto-card border-b border-gray-800 p-4 sticky top-16 z-20 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
             <div className="flex bg-gray-900 rounded-lg p-1">
                <button
                    onClick={() => setMode('BUY')}
                    className={`px-6 py-1.5 rounded-md font-bold text-sm transition-all ${mode === 'BUY' ? 'bg-crypto-green text-white shadow' : 'text-crypto-muted hover:text-white'}`}
                >
                    شراء
                </button>
                <button
                    onClick={() => setMode('SELL')}
                    className={`px-6 py-1.5 rounded-md font-bold text-sm transition-all ${mode === 'SELL' ? 'bg-crypto-red text-white shadow' : 'text-crypto-muted hover:text-white'}`}
                >
                    بيع
                </button>
             </div>
             <div className="h-6 w-px bg-gray-700"></div>
             <div className="flex items-center gap-2 text-white font-bold cursor-pointer hover:text-crypto-accent">
                {asset} <ChevronDown size={14} />
             </div>
          </div>

          <div className="flex items-center justify-between">
             <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                 <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm text-white cursor-pointer hover:bg-gray-700 border border-gray-700">
                     <span>المبلغ</span>
                     <ChevronDown size={12} className="text-gray-500" />
                 </div>
                 <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm text-white cursor-pointer hover:bg-gray-700 border border-gray-700">
                     <span>طريقة الدفع</span>
                     <ChevronDown size={12} className="text-gray-500" />
                 </div>
                 <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm text-white cursor-pointer hover:bg-gray-700 border border-gray-700">
                     <span>تصفية</span>
                     <Filter size={12} className="text-gray-500" />
                 </div>
             </div>
             <div className="flex items-center gap-1 text-xs text-crypto-muted">
                 <span>العملة:</span>
                 <span className="text-white font-bold">{fiat}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {displayOffers.map(offer => (
            <div key={offer.id} className="bg-crypto-card border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-bold text-white text-lg">
                            {offer.merchant[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{offer.merchant}</span>
                                {offer.verified && <div className="text-blue-400"><Star size={12} fill="currentColor" /></div>}
                            </div>
                            <div className="text-xs text-crypto-muted flex items-center gap-2">
                                <span>{offer.orders} طلبات</span>
                                <span className="w-px h-3 bg-gray-700"></span>
                                <span className="text-crypto-green">{offer.completion}% إكمال</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-crypto-muted mb-1">السعر</div>
                        <div className="text-xl font-bold text-white flex items-center justify-end gap-1">
                            <span className="font-mono">{offer.price}</span>
                            <span className="text-xs font-medium text-gray-400">{offer.currency}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <div className="text-crypto-muted text-xs mb-1">الحدود</div>
                        <div className="text-white font-mono">
                            {offer.limitMin.toLocaleString()} - {offer.limitMax.toLocaleString()} {offer.currency}
                        </div>
                    </div>
                    <div>
                         <div className="text-crypto-muted text-xs mb-1">الكمية المتاحة</div>
                         <div className="text-white font-mono">
                             {(offer.limitMax / offer.price).toFixed(2)} {asset}
                         </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        {offer.methods.map((m, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] bg-gray-800/50 px-2 py-1 rounded text-gray-300 border border-gray-700/50">
                                {m.includes('Bank') ? <Building2 size={10} /> : <CreditCard size={10} />}
                                {m}
                            </div>
                        ))}
                    </div>
                    <button className={`px-8 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 ${
                        mode === 'BUY' 
                        ? 'bg-crypto-green hover:bg-green-600 text-white' 
                        : 'bg-crypto-red hover:bg-red-600 text-white'
                    }`}>
                        {mode === 'BUY' ? 'شراء' : 'بيع'} {asset}
                    </button>
                </div>
            </div>
        ))}
        
        <div className="text-center pt-8 pb-4 text-crypto-muted text-xs">
            <p>يتم تأمين جميع التداولات بواسطة خدمة الضمان (Escrow) الخاصة بـ CoinSouq.</p>
        </div>
      </div>
    </div>
  );
};
