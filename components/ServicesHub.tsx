
import React from 'react';
import { CreditCard, Landmark, Users, BookOpen, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';
import { TranslateFn } from '../types';
import { MOCK_TRADERS, MOCK_ARTICLES } from '../constants';

interface ServicesHubProps {
  t: TranslateFn;
}

export const ServicesHub: React.FC<ServicesHubProps> = ({ t }) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-24">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('srv_title')}</h2>
        <p className="text-gray-400 max-w-xl mx-auto">Explore our ecosystem of financial products designed to grow your wealth.</p>
      </div>

      {/* Main Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crypto Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform border border-indigo-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                    <CreditCard size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t('srv_card')}</h3>
                <p className="text-indigo-200 text-sm">{t('srv_card_desc')}</p>
             </div>
             <button className="w-fit px-4 py-2 bg-white text-indigo-900 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                {t('btn_apply')}
             </button>
          </div>
          <CreditCard className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
        </div>

        {/* Crypto Loans */}
        <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.01] transition-transform border border-purple-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-white">
                    <Landmark size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t('srv_loans')}</h3>
                <p className="text-purple-200 text-sm">{t('srv_loans_desc')}</p>
             </div>
             <button className="w-fit px-4 py-2 bg-white text-purple-900 font-bold rounded-lg text-sm hover:bg-purple-50 transition-colors">
                {t('btn_apply')}
             </button>
          </div>
          <Wallet className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
        </div>
      </div>

      {/* Copy Trading Section */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-crypto-accent" />
                {t('srv_copy')}
            </h3>
            <span className="text-xs text-crypto-accent cursor-pointer hover:underline">View All</span>
         </div>
         <p className="text-sm text-gray-400 mb-4">{t('srv_copy_desc')}</p>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_TRADERS.map(trader => (
                <div key={trader.id} className="bg-crypto-card border border-gray-800 p-4 rounded-xl hover:border-gray-600 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={trader.image} alt={trader.name} className="w-10 h-10 rounded-full" />
                        <div className="overflow-hidden">
                            <div className="font-bold text-white text-sm truncate">{trader.name}</div>
                            <div className="text-[10px] text-gray-400">{trader.followers.toLocaleString()} copiers</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mb-3">
                        <div className="text-xs text-gray-400">ROI (7d)</div>
                        <div className="text-lg font-bold text-crypto-green font-mono">+{trader.roi}%</div>
                    </div>
                    <button className="w-full py-2 bg-gray-800 hover:bg-crypto-accent hover:text-black rounded-lg text-xs font-bold transition-colors">
                        {t('btn_copy')}
                    </button>
                </div>
            ))}
         </div>
      </div>

      {/* Learn & Earn Section */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="text-blue-400" />
                {t('srv_learn')}
            </h3>
         </div>
         <p className="text-sm text-gray-400 mb-4">{t('srv_learn_desc')}</p>

         <div className="space-y-3">
            {MOCK_ARTICLES.map(article => (
                <div key={article.id} className="bg-crypto-card border border-gray-800 p-3 rounded-xl flex gap-4 hover:bg-gray-800 transition-colors group cursor-pointer">
                    <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">+{article.reward} USDT</span>
                                <span className="text-[10px] text-gray-500">{article.time} read</span>
                            </div>
                            <h4 className="font-bold text-white group-hover:text-crypto-accent transition-colors">{article.title}</h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-crypto-accent font-bold">
                            {t('btn_read')} <ArrowRight size={12} />
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};
