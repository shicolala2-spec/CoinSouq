
import React, { useState } from 'react';
import { TranslateFn } from '../types';
import { MOCK_NFTS } from '../constants';
import { Search, Filter, Heart, ShoppingCart } from 'lucide-react';

interface NFTMarketplaceProps {
  t: TranslateFn;
}

export const NFTMarketplace: React.FC<NFTMarketplaceProps> = ({ t }) => {
  const [category, setCategory] = useState('ALL');

  const categories = [
      { id: 'ALL', label: 'All' },
      { id: 'ART', label: t('nft_art') },
      { id: 'GAME', label: t('nft_game') },
      { id: 'MUSIC', label: t('nft_music') },
  ];

  return (
    <div className="pb-24 animate-fadeIn">
        {/* Banner */}
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8 border border-gray-800">
            <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-60" alt="NFT Banner" />
            <div className="absolute inset-0 bg-gradient-to-t from-crypto-dark to-transparent flex flex-col justify-end p-6 md:p-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{t('nft_title')}</h2>
                <p className="text-gray-300 max-w-lg">Discover, collect, and sell extraordinary NFTs on the world's first diverse marketplace.</p>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sticky top-20 bg-crypto-dark z-20 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                            category === cat.id 
                            ? 'bg-white text-black' 
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                 <div className="relative">
                    <input type="text" placeholder="Search NFTs..." className="bg-gray-900 border border-gray-800 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-40 md:w-64" />
                    <Search className="absolute right-3 top-2.5 text-gray-500" size={16} />
                 </div>
            </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_NFTS.map(nft => (
                <div key={nft.id} className="bg-crypto-card border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20">
                    <div className="relative aspect-square overflow-hidden">
                        <img src={nft.image} alt={nft.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur rounded-full p-2 text-white hover:text-red-500 cursor-pointer">
                            <Heart size={16} />
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="text-xs text-purple-400 font-bold mb-1">{nft.collection}</div>
                                <h3 className="text-white font-bold">{nft.name}</h3>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">{t('nft_floor')}</div>
                                <div className="text-white font-mono font-bold flex items-center gap-1">
                                    {nft.price} {nft.currency}
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-gray-800 hover:bg-white hover:text-black rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                                {t('nft_buy')}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
