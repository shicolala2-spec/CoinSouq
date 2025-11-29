
import React, { useState, useEffect } from 'react';
import { User, Coin, AppView, DepositRequest, TranslateFn } from './types';
import { FALLBACK_COINS } from './constants';
import { MarketTable } from './components/MarketTable';
import { TradingView } from './components/TradingView';
import { PortfolioView } from './components/PortfolioView';
import { AuthView } from './components/AuthView';
import { P2PView } from './components/P2PView';
import { EarnView } from './components/EarnView';
import { ServicesHub } from './components/ServicesHub';
import { UserProfile } from './components/UserProfile';
import { AIAssistant } from './components/AIAssistant';
import { DepositModal } from './components/DepositModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RewardsCenter } from './components/RewardsCenter';
import { NFTMarketplace } from './components/NFTMarketplace';
import { LayoutDashboard, Wallet, User as UserIcon, LogOut, Search, Loader2, Star, TrendingUp, Zap, Clock, Trophy, Users, Menu, Bell, CandlestickChart, ArrowRightLeft, LogIn, Plus, Lock, Settings, Check, ChevronRight, Gift, Palette } from 'lucide-react';
import { fetchLiveMarketData } from './services/cryptoService';
import { translations } from './translations';
import { authService } from './services/authService';
import { walletService } from './services/walletService';
import { db } from './services/db';

type MarketCategory = 'TOP' | 'GAINERS' | 'VOLUME' | 'NEW' | 'FAVORITES';

const LANGUAGES = [
  { code: 'ar', name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'en', name: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'zh', name: '简体中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.MARKET);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('ar');

  // Admin Data State
  const [adminDeposits, setAdminDeposits] = useState<DepositRequest[]>([]);
  const [adminKYCRequests, setAdminKYCRequests] = useState<User[]>([]);

  // Market filters
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('TOP');
  const [favorites, setFavorites] = useState<string[]>(() => {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
  });
  
  // State management
  const [user, setUser] = useState<User>({
    id: 'guest',
    name: 'Guest',
    email: '',
    isLoggedIn: false,
    kycLevel: 0,
    balanceUSDT: 0,
    portfolio: []
  });

  const [coins, setCoins] = useState<Coin[]>([]);

  // Translation Helper
  const t: TranslateFn = (key: string) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Secret Admin Trigger
  useEffect(() => {
    if (searchQuery.toLowerCase() === 'admin' || searchQuery === 'لوحة التحكم') {
        if (user.isLoggedIn && user.email.includes('admin')) {
             setView(AppView.ADMIN);
        } else {
            alert("Access Denied: Admin privileges required.");
        }
        setSearchQuery('');
    }
  }, [searchQuery, user]);

  // Language & Direction Effect
  useEffect(() => {
    const selectedLang = LANGUAGES.find(l => l.code === language);
    if (selectedLang) {
        document.documentElement.dir = selectedLang.dir;
        document.documentElement.lang = selectedLang.code;
        if (language === 'ar') {
            document.body.style.fontFamily = "'Tajawal', sans-serif";
        } else {
            document.body.style.fontFamily = "system-ui, -apple-system, sans-serif";
        }
    }
  }, [language]);

  // Initial Data Fetch
  useEffect(() => {
    // 1. Load User Session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
    }

    // 2. Load Market Data
    const loadData = async () => {
      setLoading(true);
      const liveData = await fetchLiveMarketData();
      if (liveData.length > 0) {
        setCoins(liveData);
      } else {
        setCoins(FALLBACK_COINS);
      }
      setLoading(false);
    };
    loadData();

    // 3. Polling
    const interval = setInterval(async () => {
        const liveData = await fetchLiveMarketData();
        if (liveData.length > 0) {
            setCoins(liveData);
        }
        
        // Refresh User Data from DB if logged in (to sync balance updates)
        if (currentUser) {
            const refreshedUser = authService.getCurrentUser();
            if (refreshedUser) setUser(refreshedUser);
        }
        
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Admin Data Polling
  useEffect(() => {
      if (view === AppView.ADMIN) {
          setAdminDeposits(db.getDeposits());
          // In a real app, we'd filter users by KYC status 'PENDING'
          setAdminKYCRequests(db.getUsers().filter(u => u.kycStatus === 'PENDING'));
      }
  }, [view]);

  // Save favorites
  useEffect(() => {
      localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleLogin = async (email: string, kycLevel: 0 | 1 | 2 | 3 = 1) => {
      // In AuthView, we are calling onLogin after a successful simulated auth flow
      // But we need to distinguish between Login and Register flow or just use the Auth service
      
      // If it came from AuthView, it might be a new registration or login
      // For simplicity, AuthView calls this with email. 
      // We will try to get the user from DB.
      
      let loggedUser = db.getUserByEmail(email);
      
      // If not found, it means AuthView just finished a registration flow simulation
      // So we register them properly in DB
      if (!loggedUser) {
          loggedUser = await authService.register({
              email, 
              name: email.split('@')[0],
              kycLevel,
              password: 'password' // In real app, AuthView passes this
          });
      } else {
          // Just login
          const res = await authService.login(email, 'password');
          if (res.user) loggedUser = res.user;
      }

      if (loggedUser) {
          setUser({ ...loggedUser, isLoggedIn: true });
          setShowAuthModal(false);
      }
  };

  const handleLogout = () => {
      authService.logout();
      setUser({
          id: 'guest',
          name: 'Guest',
          email: '',
          isLoggedIn: false,
          kycLevel: 0,
          balanceUSDT: 0,
          portfolio: []
      });
      setView(AppView.MARKET);
  };

  const handleDepositRequest = (amount: number, method: 'CARD' | 'BANK') => {
      if (method === 'CARD') {
          // Instant Deposit using Service
          const updatedUser = walletService.processDeposit(user.id, amount, 'CARD');
          if (updatedUser) setUser({ ...updatedUser, isLoggedIn: true });
      } else {
          // Bank Transfer - Create Request
          const newRequest: DepositRequest = {
              id: `dep_${Date.now()}`,
              userId: user.id,
              userName: user.name,
              amount: amount,
              method: 'BANK',
              status: 'PENDING',
              date: new Date().toLocaleString(),
          };
          db.addDeposit(newRequest);
      }
      setShowDepositModal(false);
  };

  // --- Admin Actions ---
  const handleApproveDeposit = (id: string) => {
      const updatedDeposit = db.updateDepositStatus(id, 'APPROVED');
      if (updatedDeposit) {
          setAdminDeposits(prev => prev.map(d => d.id === id ? updatedDeposit : d));
          // Credit User
          walletService.processDeposit(updatedDeposit.userId, updatedDeposit.amount, 'BANK');
      }
  };

  const handleRejectDeposit = (id: string) => {
      const updatedDeposit = db.updateDepositStatus(id, 'REJECTED');
      if (updatedDeposit) {
          setAdminDeposits(prev => prev.map(d => d.id === id ? updatedDeposit : d));
      }
  };

  const handleApproveKYC = (userId: string) => {
      db.updateUser(userId, { kycLevel: 2, kycStatus: 'VERIFIED' });
      setAdminKYCRequests(prev => prev.filter(u => u.id !== userId));
  };

  const handleRejectKYC = (userId: string) => {
      db.updateUser(userId, { kycStatus: 'REJECTED' });
      setAdminKYCRequests(prev => prev.filter(u => u.id !== userId));
  };


  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoin(coin);
    setView(AppView.TRADE);
  };

  const handleToggleFavorite = (e: React.MouseEvent, coinId: string) => {
      e.stopPropagation();
      setFavorites(prev => 
          prev.includes(coinId) 
          ? prev.filter(id => id !== coinId)
          : [...prev, coinId]
      );
  };

  const executeTrade = (type: 'BUY' | 'SELL', amount: number, totalCost: number) => {
    if (!user.isLoggedIn) {
        setShowAuthModal(true);
        return;
    }
    if (!selectedCoin) return;

    try {
        const updatedUser = walletService.executeTrade(user, type, selectedCoin, amount, totalCost);
        setUser(updatedUser);
        alert(t('trade_success'));
        setView(AppView.PORTFOLIO);
    } catch (error: any) {
        alert("Trade Failed: " + error.message);
    }
  };

  const handleProtectedNavigation = (targetView: AppView) => {
      if (!user.isLoggedIn && (targetView === AppView.PORTFOLIO || targetView === AppView.PROFILE || targetView === AppView.REWARDS)) {
          setShowAuthModal(true);
      } else {
          setView(targetView);
      }
  };

  // Filter Logic
  const getFilteredCoins = () => {
      let baseList = coins;
      if (searchQuery) {
          return baseList.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
          );
      }
      switch (activeCategory) {
          case 'FAVORITES': return baseList.filter(c => favorites.includes(c.id));
          case 'GAINERS': return [...baseList].sort((a, b) => b.change24h - a.change24h).slice(0, 20);
          case 'VOLUME': return [...baseList].sort((a, b) => (b.rawVolume || 0) - (a.rawVolume || 0)).slice(0, 20);
          case 'NEW': return [...baseList].reverse().slice(0, 15);
          case 'TOP':
          default: return [...baseList].sort((a, b) => (b.rawMarketCap || 0) - (a.rawMarketCap || 0));
      }
  };

  const displayedCoins = getFilteredCoins();

  // If Admin View
  if (view === AppView.ADMIN) {
      return (
          <AdminDashboard 
            depositRequests={adminDeposits}
            kycRequests={adminKYCRequests}
            onApproveDeposit={handleApproveDeposit}
            onRejectDeposit={handleRejectDeposit}
            onApproveKYC={handleApproveKYC}
            onRejectKYC={handleRejectKYC}
            onLogout={handleLogout}
            onExit={() => setView(AppView.MARKET)}
            t={t}
          />
      );
  }

  const NavItem = ({ id, label, icon: Icon }: { id: AppView, label: string, icon: any }) => (
    <button 
        onClick={() => handleProtectedNavigation(id)}
        className={`flex flex-col items-center gap-1.5 transition-colors relative min-w-[60px] ${view === id ? 'text-crypto-accent' : 'text-gray-400 hover:text-white'}`}
    >
        <Icon size={22} strokeWidth={view === id ? 2.5 : 2} />
        <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
        {view === id && <span className="absolute -top-1 w-1 h-1 bg-crypto-accent rounded-full"></span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-crypto-dark text-crypto-text pb-24 md:pb-0">
      {/* Auth Modal Overlay */}
      {showAuthModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <AuthView onLogin={handleLogin} onClose={() => setShowAuthModal(false)} t={t} />
          </div>
      )}

      {/* Deposit Modal Overlay */}
      {showDepositModal && (
          <DepositModal 
              onClose={() => setShowDepositModal(false)} 
              onDeposit={handleDepositRequest}
              userWalletAddress={user.walletAddressUSDT}
          />
      )}

      {/* Desktop Header / Navbar */}
      <nav className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md fixed top-0 w-full z-30 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.MARKET)}>
                <div className="w-8 h-8 rounded-lg bg-crypto-accent flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <span className="text-black font-bold text-xl">C</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight hidden md:block">CoinSouq</h1>
            </div>
            
            <div className="hidden xl:flex items-center gap-6 text-sm font-medium">
                <button onClick={() => setView(AppView.MARKET)} className={`${view === AppView.MARKET ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{t('nav_market')}</button>
                <button onClick={() => setView(AppView.TRADE)} className={`${view === AppView.TRADE ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{t('nav_trade')}</button>
                <button onClick={() => setView(AppView.P2P)} className={`${view === AppView.P2P ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{t('nav_p2p')}</button>
                <button onClick={() => setView(AppView.EARN)} className={`${view === AppView.EARN ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{t('nav_earn')}</button>
                <button onClick={() => setView(AppView.NFT)} className={`${view === AppView.NFT ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{t('nav_nft')}</button>
                <button onClick={() => setView(AppView.SERVICES)} className={`${view === AppView.SERVICES ? 'text-white' : 'text-gray-400 hover:text-white'}`}>{t('nav_services')}</button>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            
            {/* Settings & Language Menu */}
            <div className="relative">
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    <Settings size={20} />
                </button>

                {showSettings && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)}></div>
                        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto">
                            <div className="p-2 border-b border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 px-2 py-1">Settings</h3>
                                <button 
                                    onClick={() => {
                                        if (user.isLoggedIn && user.email.includes('admin')) {
                                            setView(AppView.ADMIN);
                                            setShowSettings(false);
                                        } else {
                                            alert("Login as Admin to access.");
                                        }
                                    }}
                                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 text-sm transition-colors text-white mb-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <Lock size={16} className="text-crypto-accent" />
                                        <span>{t('nav_admin')}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-500 rtl:rotate-180" />
                                </button>
                            </div>
                            
                            <div className="p-2">
                                <h3 className="text-xs font-bold text-gray-500 px-2 py-1 mb-1">Language</h3>
                                <div className="space-y-1">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setShowSettings(false);
                                            }}
                                            className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${language === lang.code ? 'bg-crypto-accent text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </div>
                                            {language === lang.code && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {user.isLoggedIn ? (
                <>
                    <button 
                        onClick={() => setView(AppView.REWARDS)}
                        className="hidden md:flex bg-gradient-to-r from-orange-600 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-bold items-center gap-1 hover:brightness-110"
                    >
                        <Trophy size={14} /> Rewards
                    </button>

                    <div className="hidden md:flex items-center gap-2 bg-gray-800 p-1 pl-3 rounded-full border border-gray-700">
                        <Wallet size={16} className="text-crypto-accent" />
                        <span className="font-mono font-bold text-sm">${user.balanceUSDT.toLocaleString()}</span>
                        <button 
                            onClick={() => setShowDepositModal(true)}
                            className="bg-crypto-accent hover:bg-yellow-400 text-black p-1 rounded-full transition-colors ml-2"
                            title={t('btn_deposit')}
                        >
                            <Plus size={14} strokeWidth={3} />
                        </button>
                    </div>
                    
                    <div className="group relative">
                        <div 
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center text-xs text-white font-bold cursor-pointer hover:ring-2 ring-crypto-accent transition-all relative"
                            onClick={() => setView(AppView.PROFILE)}
                        >
                            {user.name[0].toUpperCase()}
                            {user.kycLevel >= 2 && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-crypto-green rounded-full border border-gray-900" title="Verified"></div>}
                        </div>
                        <div className="absolute left-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 hidden group-hover:block z-50 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto">
                            <button onClick={() => setView(AppView.PROFILE)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-right hover:text-white">
                                <UserIcon size={14} /> {t('nav_profile')}
                            </button>
                            <button onClick={() => setView(AppView.REWARDS)} className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 w-full text-right">
                                <Gift size={14} /> {t('nav_rewards')}
                            </button>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-right">
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowAuthModal(true)} className="text-white hover:text-crypto-accent text-sm font-medium hidden md:block">{t('btn_login')}</button>
                    <button 
                        onClick={() => setShowAuthModal(true)}
                        className="bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
                    >
                        {t('btn_signup')}
                    </button>
                </div>
            )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20 px-4 md:px-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        
        {view === AppView.MARKET && (
          <div className="space-y-6 animate-fadeIn">
            {/* Balance Card Mobile Only (If Logged In) */}
            {user.isLoggedIn && (
                <div className="md:hidden bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 mb-6 flex justify-between items-center">
                    <div>
                        <div className="text-crypto-muted text-xs mb-1">Total Balance</div>
                        <div className="text-3xl font-bold text-white font-mono">${user.balanceUSDT.toLocaleString()}</div>
                    </div>
                    <button 
                        onClick={() => setShowDepositModal(true)}
                        className="bg-crypto-accent text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-yellow-500/10"
                    >
                        {t('btn_deposit')}
                    </button>
                </div>
            )}

            {!user.isLoggedIn && (
                <div className="bg-gradient-to-r from-crypto-accent to-yellow-500 text-black p-6 rounded-2xl mb-6 shadow-lg flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Start your crypto journey</h2>
                        <p className="text-black/80 text-sm">Register now and get a full trading experience.</p>
                    </div>
                    <button onClick={() => setShowAuthModal(true)} className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors">
                        {t('btn_signup')}
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide w-full md:w-auto">
                    {[
                        {id: 'TOP', label: t('cat_top'), icon: Trophy},
                        {id: 'FAVORITES', label: t('cat_fav'), icon: Star},
                        {id: 'GAINERS', label: t('cat_gainers'), icon: TrendingUp},
                        {id: 'VOLUME', label: t('cat_vol'), icon: Zap},
                        {id: 'NEW', label: t('cat_new'), icon: Clock}
                    ].map((cat: any) => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as MarketCategory)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                                activeCategory === cat.id 
                                ? 'bg-white text-black font-bold' 
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <cat.icon size={14} />
                            {cat.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-crypto-accent transition-colors"
                    />
                    <Search className="absolute right-3 top-3 text-gray-500 w-4 h-4 rtl:right-auto rtl:left-3" />
                </div>
            </div>

            <MarketTable 
                coins={displayedCoins} 
                onSelectCoin={handleSelectCoin} 
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                t={t}
            />
          </div>
        )}

        {view === AppView.TRADE && selectedCoin && (
          <TradingView 
            coin={coins.find(c => c.id === selectedCoin.id) || selectedCoin} 
            user={user}
            onTrade={executeTrade}
            onBack={() => setView(AppView.MARKET)}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenDeposit={() => setShowDepositModal(true)}
            t={t}
          />
        )}

        {view === AppView.TRADE && !selectedCoin && (
            <div className="text-center py-20 animate-fadeIn">
                <CandlestickChart className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a coin to trade</h3>
                <p className="text-gray-500 mb-6">Go to the market page and select a pair.</p>
                <button onClick={() => setView(AppView.MARKET)} className="px-6 py-2 bg-crypto-accent text-black font-bold rounded-lg">{t('nav_market')}</button>
            </div>
        )}

        {view === AppView.PORTFOLIO && (
          <PortfolioView 
            user={user} 
            coins={coins} 
            onSelectCoin={handleSelectCoin} 
            onGoToMarket={() => setView(AppView.MARKET)}
            t={t}
          />
        )}

        {view === AppView.P2P && <P2PView />}
        {view === AppView.EARN && <EarnView coins={coins} />}
        {view === AppView.SERVICES && <ServicesHub t={t} />}
        {view === AppView.PROFILE && <UserProfile user={user} onLogout={handleLogout} t={t} />}
        {view === AppView.REWARDS && <RewardsCenter t={t} points={user.points || 0} />}
        {view === AppView.NFT && <NFTMarketplace t={t} />}

      </main>

      {/* Modern Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 w-full bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 flex justify-between px-4 py-3 z-30 safe-area-bottom pb-5 overflow-x-auto gap-2 scrollbar-hide">
        <NavItem id={AppView.MARKET} label={t('nav_market')} icon={LayoutDashboard} />
        <NavItem id={AppView.TRADE} label={t('nav_trade')} icon={ArrowRightLeft} />
        <NavItem id={AppView.P2P} label={t('nav_p2p')} icon={Users} />
        <NavItem id={AppView.EARN} label={t('nav_earn')} icon={TrendingUp} />
        <NavItem id={AppView.NFT} label="NFT" icon={Palette} />
        <NavItem id={AppView.REWARDS} label="Rewards" icon={Trophy} />
        <NavItem id={AppView.PORTFOLIO} label={t('nav_portfolio')} icon={Wallet} />
      </div>

      <AIAssistant coins={coins} />
    </div>
  );
};

export default App;
