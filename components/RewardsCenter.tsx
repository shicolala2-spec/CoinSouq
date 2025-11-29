
import React, { useState } from 'react';
import { TranslateFn, Mission } from '../types';
import { MOCK_MISSIONS } from '../constants';
import { Trophy, Calendar, Zap, Gift, CheckCircle, Flame } from 'lucide-react';

interface RewardsCenterProps {
  t: TranslateFn;
  points: number;
}

export const RewardsCenter: React.FC<RewardsCenterProps> = ({ t, points: initialPoints }) => {
  const [points, setPoints] = useState(initialPoints || 150);
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);

  const handleClaim = (id: string, reward: number) => {
      setMissions(prev => prev.map(m => m.id === id ? { ...m, claimed: true } : m));
      setPoints(prev => prev + reward);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-fadeIn space-y-6">
       {/* Hero Section */}
       <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-xl relative overflow-hidden">
           <div className="relative z-10">
               <h2 className="text-3xl font-bold text-white mb-2">{t('rew_title')}</h2>
               <div className="flex items-center gap-2 mb-4">
                   <div className="bg-white/20 px-3 py-1 rounded-full text-sm text-white font-medium flex items-center gap-1">
                       <Flame size={14} className="text-yellow-200" fill="currentColor" />
                       {t('rew_streak')}: 3 Days
                   </div>
               </div>
               <div className="bg-black/30 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 w-fit">
                   <div className="text-xs text-yellow-200 uppercase tracking-wider mb-1">{t('rew_balance')}</div>
                   <div className="text-4xl font-mono font-bold text-white flex items-center gap-2">
                       {points.toLocaleString()} <span className="text-lg text-yellow-300">PTS</span>
                   </div>
               </div>
           </div>
           <Trophy className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 rotate-12" />
       </div>

       {/* Daily Check-in Grid */}
       <div className="bg-crypto-card border border-gray-800 rounded-xl p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Calendar className="text-crypto-accent" size={20} />
               {t('rew_daily')}
           </h3>
           <div className="grid grid-cols-7 gap-2">
               {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                   const status = day <= 3 ? 'completed' : day === 4 ? 'active' : 'locked';
                   return (
                       <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border ${
                           status === 'completed' ? 'bg-green-900/20 border-green-500/50 text-green-400' :
                           status === 'active' ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400 ring-2 ring-yellow-500/20' :
                           'bg-gray-900 border-gray-800 text-gray-600'
                       }`}>
                           <span className="text-xs font-bold">Day {day}</span>
                           {status === 'completed' ? <CheckCircle size={16} /> : <Gift size={16} />}
                           <span className="text-[10px]">+{(day * 10)}</span>
                       </div>
                   );
               })}
           </div>
       </div>

       {/* Missions List */}
       <div className="bg-crypto-card border border-gray-800 rounded-xl p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <Zap className="text-blue-400" size={20} />
               Missions
           </h3>
           <div className="space-y-4">
               {missions.map(mission => (
                   <div key={mission.id} className="bg-gray-900/50 rounded-xl p-4 flex items-center gap-4 border border-gray-800">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg ${
                           mission.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
                       }`}>
                           {mission.icon === 'LOGIN' && <Calendar size={20} />}
                           {mission.icon === 'TRADE' && <Zap size={20} />}
                           {mission.icon === 'DEPOSIT' && <Gift size={20} />}
                           {mission.icon === 'INVITE' && <Trophy size={20} />}
                       </div>
                       
                       <div className="flex-1">
                           <div className="flex justify-between mb-1">
                               <h4 className="font-bold text-white text-sm">{t(`rew_mission_${mission.icon.toLowerCase()}`) || mission.title}</h4>
                               <span className="text-yellow-400 font-mono font-bold text-sm">+{mission.reward} PTS</span>
                           </div>
                           <p className="text-xs text-gray-500 mb-2">{mission.description}</p>
                           
                           {/* Progress Bar */}
                           <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                               <div 
                                   className={`h-full rounded-full ${mission.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                                   style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                               ></div>
                           </div>
                       </div>

                       <button 
                           onClick={() => handleClaim(mission.id, mission.reward)}
                           disabled={!mission.completed || mission.claimed}
                           className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                               mission.claimed 
                               ? 'bg-gray-800 text-gray-500 cursor-default'
                               : mission.completed
                                   ? 'bg-crypto-accent text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
                                   : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                           }`}
                       >
                           {mission.claimed ? t('rew_claimed') : t('rew_claim')}
                       </button>
                   </div>
               ))}
           </div>
       </div>
    </div>
  );
};
