
import React, { useState, useRef } from 'react';
import { Mail, Phone, Eye, EyeOff, ArrowRight, X, User, Upload, Camera, CheckCircle, ShieldCheck, ScanFace, Loader2, FileText, Calendar } from 'lucide-react';
import { TranslateFn } from '../types';

interface AuthViewProps {
  onLogin: (email: string, kycLevel: 0 | 1 | 2 | 3) => void;
  onClose: () => void;
  t: TranslateFn;
}

// Steps: 1=Credentials, 2=PersonalInfo, 3=IDUpload, 4=FaceScan, 5=Success
type KYCStep = 1 | 2 | 3 | 4 | 5;

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onClose, t }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [step, setStep] = useState<KYCStep>(1);
  
  // Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationality, setNationality] = useState('');
  const [idNumber, setIdNumber] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ front: 0, back: 0 });
  const [scanning, setScanning] = useState(false);

  // --- Handlers ---

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;
    
    setLoading(true);
    // Simulate API Check
    setTimeout(() => {
      setLoading(false);
      if (mode === 'LOGIN') {
        // Direct Login
        onLogin(identifier, 1); // Level 1 for returning basic users
      } else {
        // Start KYC Flow
        setStep(2);
      }
    }, 1000);
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!fullName || !nationality || !idNumber) return;
    setStep(3);
  };

  const simulateUpload = (side: 'front' | 'back') => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [side]: progress }));
        if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const handleFaceScan = () => {
    setScanning(true);
    setTimeout(() => {
        setScanning(false);
        setStep(5);
    }, 3000);
  };

  const finishRegistration = () => {
      onLogin(identifier, 2); // Level 2 (Verified)
  };

  // --- Render Steps ---

  const renderStep1_Credentials = () => (
    <div className="animate-fadeIn">
        <div className="mb-6 bg-gray-900 p-1 rounded-lg flex">
            <button
                onClick={() => setMode('LOGIN')}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'LOGIN' ? 'bg-gray-800 text-white shadow' : 'text-gray-500'}`}
            >
                {t('auth_login')}
            </button>
            <button
                onClick={() => setMode('SIGNUP')}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'SIGNUP' ? 'bg-crypto-accent text-black shadow' : 'text-gray-500'}`}
            >
                {t('auth_signup')}
            </button>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">{t('auth_email')}</label>
                <div className="relative">
                    <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-crypto-accent transition-colors"
                        placeholder="name@example.com"
                        dir="ltr"
                    />
                    <Mail className="absolute right-3 top-3.5 text-gray-500" size={18} />
                </div>
            </div>

            <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">{t('auth_pass')}</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-crypto-accent transition-colors"
                        placeholder="••••••••"
                        dir="ltr"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-white"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {mode === 'SIGNUP' && (
                <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg flex gap-2">
                    <ShieldCheck className="text-blue-400 shrink-0" size={16} />
                    <p className="text-xs text-blue-200 leading-relaxed">
                        KYC verification is required after account creation for security.
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !identifier || !password}
                className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    loading || !identifier || !password
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
            >
                {loading ? <Loader2 className="animate-spin" /> : (mode === 'LOGIN' ? t('auth_login') : t('auth_next'))}
            </button>
        </form>
    </div>
  );

  const renderStep2_Info = () => (
    <div className="animate-fadeIn space-y-4">
        <div className="text-center mb-6">
            <div className="w-12 h-12 bg-crypto-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 text-crypto-accent">
                <User size={24} />
            </div>
            <h3 className="text-white font-bold">Personal Info</h3>
            <p className="text-xs text-gray-400">Please enter details as they appear on your ID</p>
        </div>

        <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
                <label className="block text-xs text-gray-400 mb-1">{t('auth_name')}</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent"
                />
            </div>
            <div>
                <label className="block text-xs text-gray-400 mb-1">Nationality</label>
                <select 
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent"
                >
                    <option value="">Select Country</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="AE">UAE</option>
                    <option value="EG">Egypt</option>
                    <option value="KW">Kuwait</option>
                </select>
            </div>
             <div>
                <label className="block text-xs text-gray-400 mb-1">{t('auth_id')}</label>
                <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent"
                />
            </div>
            <button
                type="submit"
                className="w-full py-3 bg-crypto-accent text-black font-bold rounded-lg hover:bg-yellow-400 mt-4"
            >
                Next: Documents
            </button>
        </form>
    </div>
  );

  const renderStep3_Docs = () => (
    <div className="animate-fadeIn space-y-6">
        <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-400">
                <FileText size={24} />
            </div>
            <h3 className="text-white font-bold">ID Verification</h3>
            <p className="text-xs text-gray-400">Upload clear photos of your National ID</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Front ID */}
            <div 
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-32 ${
                    uploadProgress.front === 100 ? 'border-crypto-green bg-green-900/20' : 'border-gray-700 hover:border-gray-500 bg-gray-900'
                }`}
                onClick={() => simulateUpload('front')}
            >
                {uploadProgress.front === 100 ? (
                    <CheckCircle className="text-crypto-green mb-2" />
                ) : uploadProgress.front > 0 ? (
                    <Loader2 className="animate-spin text-crypto-accent mb-2" />
                ) : (
                    <Upload className="text-gray-400 mb-2" />
                )}
                <span className="text-xs text-gray-300">Front Side</span>
            </div>

            {/* Back ID */}
            <div 
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors h-32 ${
                    uploadProgress.back === 100 ? 'border-crypto-green bg-green-900/20' : 'border-gray-700 hover:border-gray-500 bg-gray-900'
                }`}
                onClick={() => simulateUpload('back')}
            >
                {uploadProgress.back === 100 ? (
                    <CheckCircle className="text-crypto-green mb-2" />
                ) : uploadProgress.back > 0 ? (
                    <Loader2 className="animate-spin text-crypto-accent mb-2" />
                ) : (
                    <Upload className="text-gray-400 mb-2" />
                )}
                <span className="text-xs text-gray-300">Back Side</span>
            </div>
        </div>

        <button
            disabled={uploadProgress.front < 100 || uploadProgress.back < 100}
            onClick={() => setStep(4)}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
                uploadProgress.front < 100 || uploadProgress.back < 100 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-crypto-accent text-black hover:bg-yellow-400'
            }`}
        >
            Next: Face Scan
        </button>
    </div>
  );

  const renderStep4_Selfie = () => (
    <div className="animate-fadeIn text-center space-y-6">
        {!scanning ? (
            <>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-400">
                    <ScanFace size={32} />
                </div>
                <div>
                    <h3 className="text-white font-bold mb-1">Face Verification</h3>
                    <p className="text-xs text-gray-400 px-4">Ensure good lighting and no accessories.</p>
                </div>
                
                <div className="w-48 h-48 mx-auto bg-black rounded-full border-4 border-gray-700 relative overflow-hidden flex items-center justify-center">
                    <User size={80} className="text-gray-600" />
                </div>

                <button
                    onClick={handleFaceScan}
                    className="w-full py-3 bg-crypto-accent text-black font-bold rounded-lg hover:bg-yellow-400"
                >
                    Start Scan
                </button>
            </>
        ) : (
            <div className="py-10">
                <div className="w-48 h-48 mx-auto bg-gray-900 rounded-full border-4 border-crypto-accent relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(252,213,53,0.3)]">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" className="w-full h-full object-cover opacity-50" alt="Face" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-crypto-accent/80 shadow-[0_0_15px_#FCD535] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="mt-6 text-white font-medium animate-pulse">Scanning biometric features...</p>
            </div>
        )}
    </div>
  );

  const renderStep5_Success = () => (
    <div className="animate-fadeIn text-center py-8">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-crypto-green">
            <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('auth_success')}</h2>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
            Your identity has been verified. You are now Level 2.
        </p>

        <div className="bg-gray-800 rounded-xl p-4 mb-8 text-right mx-4">
             <h4 className="text-white text-sm font-bold mb-3 border-b border-gray-700 pb-2">New Account Privileges:</h4>
             <ul className="space-y-2 text-xs text-gray-300">
                 <li className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500"/> Unlimited Deposit & Withdraw</li>
                 <li className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500"/> P2P Trading</li>
                 <li className="flex items-center gap-2"><CheckCircle size={12} className="text-green-500"/> Earn & Staking</li>
             </ul>
        </div>

        <button
            onClick={finishRegistration}
            className="w-full py-3 bg-crypto-green text-white font-bold rounded-lg hover:bg-green-600 shadow-lg shadow-green-900/20"
        >
            Start Trading
        </button>
    </div>
  );

  return (
    <div className="w-full max-w-md bg-crypto-card border border-gray-700 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Progress Bar (Only for KYC flow) */}
        {mode === 'SIGNUP' && step > 1 && step < 5 && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                <div 
                    className="h-full bg-crypto-accent transition-all duration-500"
                    style={{ width: `${((step - 1) / 4) * 100}%` }}
                ></div>
            </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
            <div>
                <h2 className="text-xl font-bold text-white">
                    {step === 1 ? (mode === 'LOGIN' ? t('auth_login') : t('auth_signup')) : 
                     step === 5 ? 'Completed' : 'ID Verification (KYC)'}
                </h2>
                {step > 1 && step < 5 && <p className="text-xs text-crypto-accent">Step {step - 1} of 4</p>}
            </div>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800"
            >
                <X size={24} />
            </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
            {step === 1 && renderStep1_Credentials()}
            {step === 2 && renderStep2_Info()}
            {step === 3 && renderStep3_Docs()}
            {step === 4 && renderStep4_Selfie()}
            {step === 5 && renderStep5_Success()}
        </div>
        
        {/* Footer Link (Login only) */}
        {step === 1 && (
             <div className="p-4 bg-gray-900/50 text-center border-t border-gray-800">
                <p className="text-xs text-gray-500">
                    By continuing, you agree to our <span className="text-gray-300 underline cursor-pointer">Terms</span> and <span className="text-gray-300 underline cursor-pointer">Privacy Policy</span>.
                </p>
             </div>
        )}
    </div>
  );
};
