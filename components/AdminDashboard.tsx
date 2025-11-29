
import React, { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, CheckCircle, XCircle, FileText, Search, DollarSign, Bell, Home, LogOut, Eye, X } from 'lucide-react';
import { DepositRequest, User, TranslateFn } from '../types';

interface AdminDashboardProps {
  depositRequests: DepositRequest[];
  kycRequests: User[];
  onApproveDeposit: (id: string) => void;
  onRejectDeposit: (id: string) => void;
  onApproveKYC: (userId: string) => void;
  onRejectKYC: (userId: string) => void;
  onLogout: () => void;
  onExit: () => void;
  t: TranslateFn;
}

type AdminTab = 'OVERVIEW' | 'FINANCE' | 'KYC';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  depositRequests,
  kycRequests,
  onApproveDeposit,
  onRejectDeposit,
  onApproveKYC,
  onRejectKYC,
  onLogout,
  onExit,
  t
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [showDocModal, setShowDocModal] = useState<User | null>(null);

  // Calculations
  const totalPendingDeposits = depositRequests.filter(d => d.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingDepositCount = depositRequests.filter(d => d.status === 'PENDING').length;
  const pendingKYCCount = kycRequests.length;

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <Users size={24} />
                </div>
                <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">+12 Today</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">1,245</h3>
            <p className="text-sm text-gray-400">{t('admin_users')}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-crypto-green/20 rounded-lg text-crypto-green">
                    <DollarSign size={24} />
                </div>
                <span className="text-xs text-crypto-accent font-bold">{t('admin_pending')}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">${totalPendingDeposits.toLocaleString()}</h3>
            <p className="text-sm text-gray-400">{pendingDepositCount} pending deposits</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                    <FileText size={24} />
                </div>
                <span className="text-xs text-red-400 font-bold bg-red-900/20 px-2 py-1 rounded">Action Req.</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{pendingKYCCount}</h3>
            <p className="text-sm text-gray-400">{t('admin_kyc')} Requests</p>
        </div>
    </div>
  );

  const renderFinance = () => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fadeIn">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">{t('admin_finance')}</h3>
            <div className="relative">
                <input type="text" placeholder="Search ID..." className="bg-gray-900 border border-gray-600 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none" />
                <Search className="absolute right-3 top-2.5 text-gray-500" size={16} />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
                <thead className="bg-gray-900/50 text-gray-400">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Receipt</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {depositRequests.map(req => (
                        <tr key={req.id} className="hover:bg-gray-700/50">
                            <td className="p-4 font-bold text-white">{req.userName} <br/><span className="text-xs text-gray-500 font-normal">{req.userId}</span></td>
                            <td className="p-4 text-crypto-green font-mono font-bold">${req.amount.toLocaleString()}</td>
                            <td className="p-4 text-gray-400 text-xs dir-ltr text-right">{req.date}</td>
                            <td className="p-4">
                                <button className="text-blue-400 hover:underline text-xs flex items-center gap-1">
                                    <FileText size={12} /> View
                                </button>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    req.status === 'APPROVED' ? 'bg-green-900/30 text-green-400' :
                                    req.status === 'REJECTED' ? 'bg-red-900/30 text-red-400' :
                                    'bg-yellow-900/30 text-yellow-400'
                                }`}>
                                    {req.status === 'APPROVED' ? 'OK' : req.status === 'REJECTED' ? 'REJECTED' : 'PENDING'}
                                </span>
                            </td>
                            <td className="p-4">
                                {req.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onApproveDeposit(req.id)}
                                            className="p-2 bg-green-600 hover:bg-green-500 rounded text-white transition-colors" title={t('admin_approve')}>
                                            <CheckCircle size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onRejectDeposit(req.id)}
                                            className="p-2 bg-red-600 hover:bg-red-500 rounded text-white transition-colors" title={t('admin_reject')}>
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderKYC = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {kycRequests.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-gray-500">No pending KYC requests</div>
          ) : (
              kycRequests.map(user => (
                  <div key={user.id} className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white text-lg">
                                  {user.name[0]}
                              </div>
                              <div>
                                  <h4 className="font-bold text-white">{user.name}</h4>
                                  <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                          </div>
                          <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-500/20">Upgrade to L2</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                          <div 
                              className="bg-gray-900 p-3 rounded border border-gray-700 text-center relative group cursor-pointer overflow-hidden"
                              onClick={() => setShowDocModal(user)}
                          >
                              <div className="text-xs text-gray-500 mb-1">ID Front</div>
                              <div className="h-20 bg-gray-800 rounded flex items-center justify-center text-gray-600 transition-colors group-hover:bg-gray-800/50">
                                  <FileText size={24} />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity backdrop-blur-[2px]">
                                  <button className="flex items-center gap-1 text-xs text-white font-bold bg-gray-700 px-3 py-1.5 rounded-full hover:bg-crypto-accent hover:text-black transition-colors shadow-lg">
                                      <Eye size={14} /> {t('admin_view_docs')}
                                  </button>
                              </div>
                          </div>
                          <div 
                              className="bg-gray-900 p-3 rounded border border-gray-700 text-center relative group cursor-pointer overflow-hidden"
                              onClick={() => setShowDocModal(user)}
                          >
                              <div className="text-xs text-gray-500 mb-1">ID Back</div>
                              <div className="h-20 bg-gray-800 rounded flex items-center justify-center text-gray-600 transition-colors group-hover:bg-gray-800/50">
                                  <FileText size={24} />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity backdrop-blur-[2px]">
                                  <button className="flex items-center gap-1 text-xs text-white font-bold bg-gray-700 px-3 py-1.5 rounded-full hover:bg-crypto-accent hover:text-black transition-colors shadow-lg">
                                      <Eye size={14} /> {t('admin_view_docs')}
                                  </button>
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button 
                              onClick={() => onRejectKYC(user.id)}
                              className="flex-1 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-900/20 transition-colors text-sm font-bold"
                          >
                              {t('admin_reject')}
                          </button>
                          <button 
                              onClick={() => onApproveKYC(user.id)}
                              className="flex-1 py-2 rounded-lg bg-crypto-green hover:bg-green-600 text-white transition-colors text-sm font-bold shadow-lg shadow-green-900/20"
                          >
                              {t('admin_approve')}
                          </button>
                      </div>
                  </div>
              ))
          )}
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Document Viewer Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn" onClick={() => setShowDocModal(null)}>
           <div className="bg-gray-800 rounded-2xl max-w-3xl w-full p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowDocModal(null)} className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white">
                    <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">{showDocModal.name[0]}</div>
                    <div>
                        <h3 className="text-xl font-bold">{showDocModal.name}</h3>
                        <p className="text-gray-400 text-sm">Document Review (Saudi National ID)</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Front Side</label>
                        <div className="aspect-[1.6] bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=600&auto=format&fit=crop" alt="ID Front" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <span className="text-white text-xs font-mono">ID: 1045*****9</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Back Side</label>
                        <div className="aspect-[1.6] bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=600&auto=format&fit=crop" alt="ID Back" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => { onRejectKYC(showDocModal.id); setShowDocModal(null); }} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold text-sm">Reject Docs</button>
                    <button onClick={() => { onApproveKYC(showDocModal.id); setShowDocModal(null); }} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-sm shadow-lg shadow-green-900/20">Verify & Approve</button>
                </div>
           </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">ADMIN</div>
              <h1 className="text-lg font-bold">{t('admin_title')}</h1>
          </div>
          <div className="flex items-center gap-4">
              <button 
                  onClick={onExit}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white text-sm font-bold transition-colors"
              >
                  <Home size={16} />
                  {t('admin_exit')}
              </button>

              <button className="relative text-gray-400 hover:text-white">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="h-6 w-px bg-gray-700 mx-2"></div>

              <button onClick={onLogout} className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300">
                  <LogOut size={16} />
                  Logout
              </button>
          </div>
      </header>

      <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 border-l border-gray-700 hidden md:flex flex-col pt-6">
              <nav className="flex-1 px-4 space-y-2">
                  <button 
                      onClick={() => setActiveTab('OVERVIEW')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'OVERVIEW' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                  >
                      <LayoutDashboard size={18} />
                      {t('admin_overview')}
                  </button>
                  <button 
                      onClick={() => setActiveTab('FINANCE')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'FINANCE' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                  >
                      <CreditCard size={18} />
                      {t('admin_finance')}
                      {pendingDepositCount > 0 && <span className="mr-auto bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingDepositCount}</span>}
                  </button>
                  <button 
                      onClick={() => setActiveTab('KYC')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'KYC' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
                  >
                      <Users size={18} />
                      {t('admin_kyc')}
                      {pendingKYCCount > 0 && <span className="mr-auto bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingKYCCount}</span>}
                  </button>
              </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'OVERVIEW' && renderOverview()}
              {activeTab === 'FINANCE' && renderFinance()}
              {activeTab === 'KYC' && renderKYC()}
          </main>
      </div>
    </div>
  );
};
