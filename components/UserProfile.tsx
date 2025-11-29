
import React, { useState, useEffect } from 'react';
import { User, TranslateFn, ActivityLog } from '../types';
import { Shield, Smartphone, History, Copy, LogOut, CheckCircle, XCircle, Users } from 'lucide-react';
import { db } from '../services/db';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  t: TranslateFn;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, t }) => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  
  const referralCode = user.referralCode || "REF" + user.id.toUpperCase().slice(0, 5);

  useEffect(() => {
      setLogs(db.getActivityLogs(user.id));
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fadeIn">
       {/* Profile Header */}
       <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
           <div className="w-24 h-24 bg-gradient-to-tr from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-gray-800">
               {user.name[0].toUpperCase()}
           </div>
           <div className="flex-1 text-center md:text-left">
               <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
               <p className="text-gray-400 text-sm mb-4">{user.email}</p>
               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   <div className="bg-gray-800 px-3 py-1 rounded-full text-xs border border-gray-700 flex items-center gap-1 text-gray-300">
                       User ID: <span className="font-mono">{user.id}</span>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 font-bold ${user.kycLevel >= 2 ? 'bg-green-900/20 text-green-400 border-green-900' : 'bg-yellow-900/20 text-yellow-400 border-yellow-900'}`}>
                       {user.kycLevel >= 2 ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                       Level {user.kycLevel} Verified
                   </div>
               </div>
           </div>
           <button onClick={onLogout} className="bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
               <LogOut size={16} /> Logout
           </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Security Settings */}
           <div className="bg-crypto-card border border-gray-800 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <Shield className="text-crypto-green" size={20} />
                   {t('prof_security')}
               </h3>
               
               <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Smartphone size={20}/></div>
                       <div>
                           <div className="font-bold text-white text-sm">{t('prof_2fa')}</div>
                           <div className="text-xs text-gray-500">Google Authenticator</div>
                       </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crypto-green"></div>
                   </label>
               </div>
           </div>

           {/* Referral System */}
           <div className="bg-crypto-card border border-gray-800 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <Users className="text-crypto-accent" size={20} />
                   {t('prof_referral')}
               </h3>
               
               <div className="space-y-4">
                   <div>
                       <label className="text-xs text-gray-500 mb-1 block">{t('prof_ref_code')}</label>
                       <div className="flex gap-2">
                           <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-white font-mono font-bold tracking-wider">
                               {referralCode}
                           </div>
                           <button className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors" title="Copy">
                               <Copy size={20} />
                           </button>
                       </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-900 p-3 rounded-lg text-center">
                           <div className="text-xs text-gray-500">Friends</div>
                           <div className="text-xl font-bold text-white">3</div>
                       </div>
                       <div className="bg-gray-900 p-3 rounded-lg text-center">
                           <div className="text-xs text-gray-500">{t('prof_ref_earn')}</div>
                           <div className="text-xl font-bold text-crypto-accent">$15.00</div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Activity Logs */}
       <div className="bg-crypto-card border border-gray-800 rounded-xl p-6">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <History className="text-gray-400" size={20} />
               {t('prof_activity')}
           </h3>
           <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                   <thead className="bg-gray-900 text-gray-500 uppercase text-xs">
                       <tr>
                           <th className="px-4 py-3 rounded-tl-lg">Action</th>
                           <th className="px-4 py-3">IP Address</th>
                           <th className="px-4 py-3">Device</th>
                           <th className="px-4 py-3 rounded-tr-lg text-right">Date</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-800">
                       {logs.map(log => (
                           <tr key={log.id} className="hover:bg-gray-800/30">
                               <td className="px-4 py-3 font-medium text-white">{log.action}</td>
                               <td className="px-4 py-3 text-gray-400 font-mono text-xs">{log.ip}</td>
                               <td className="px-4 py-3 text-gray-400">{log.device}</td>
                               <td className="px-4 py-3 text-gray-400 text-right text-xs font-mono">{log.date}</td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>
    </div>
  );
};
