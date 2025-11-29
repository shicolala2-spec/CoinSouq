
import React, { useState } from 'react';
import { X, CreditCard, Building2, CheckCircle, Loader2, Lock, Upload, AlertCircle, Copy, Wallet } from 'lucide-react';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number, method: 'CARD' | 'BANK') => void;
  userWalletAddress?: string;
}

type PaymentMethod = 'CARD' | 'BANK' | 'CRYPTO';

export const DepositModal: React.FC<DepositModalProps> = ({ onClose, onDeposit, userWalletAddress }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('CARD');
  const [step, setStep] = useState<'INPUT' | 'PROCESSING' | 'SUCCESS'>('INPUT');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount))) return;
    
    setStep('PROCESSING');
    
    // Simulate API processing delay
    setTimeout(() => {
        onDeposit(parseFloat(amount), method === 'CRYPTO' ? 'BANK' : method);
        setStep('SUCCESS');
    }, 2500);
  };

  const isCardValid = cardNumber.length >= 16 && expiry && cvv.length >= 3 && cardName;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-crypto-card border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            إيداع رصيد (Deposit)
            {step === 'INPUT' && <span className="text-xs bg-crypto-green/20 text-crypto-green px-2 py-1 rounded">آمن SSL</span>}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            {step === 'SUCCESS' ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-crypto-green animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    {method === 'CARD' ? (
                        <>
                            <h3 className="text-2xl font-bold text-white mb-2">تم الإيداع بنجاح!</h3>
                            <p className="text-gray-400 mb-6">تمت إضافة مبلغ <span className="text-white font-mono font-bold">${parseFloat(amount).toLocaleString()}</span> إلى محفظتك.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-white mb-2">تم رفع طلب الإيداع</h3>
                            <p className="text-gray-400 mb-6 max-w-xs mx-auto text-sm">سيتم مراجعة الإيداع من قبل الإدارة والموافقة عليه بعد تأكيد الشبكة (15 دقيقة).</p>
                        </>
                    )}
                    <button 
                        onClick={onClose}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            ) : step === 'PROCESSING' ? (
                <div className="text-center py-12">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-crypto-accent rounded-full border-t-transparent animate-spin"></div>
                        <CreditCard className="absolute inset-0 m-auto text-gray-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">جاري المعالجة...</h3>
                    <p className="text-sm text-gray-400">
                        {method === 'CARD' ? 'يرجى الانتظار، جاري التواصل مع البنك المصدر.' : 'جاري التحقق من الشبكة.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2 font-medium">المبلغ المراد إيداعه (USDT)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Min: 50.00"
                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:border-crypto-accent transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">USD</span>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-3 font-medium">وسيلة الدفع</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => setMethod('CARD')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${method === 'CARD' ? 'bg-crypto-accent/10 border-crypto-accent text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
                            >
                                <CreditCard size={20} className="mb-2" />
                                <span className="font-bold text-xs">بطاقة بنكية</span>
                            </button>
                            <button 
                                onClick={() => setMethod('BANK')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${method === 'BANK' ? 'bg-crypto-accent/10 border-crypto-accent text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
                            >
                                <Building2 size={20} className="mb-2" />
                                <span className="font-bold text-xs">تحويل بنكي</span>
                            </button>
                            <button 
                                onClick={() => setMethod('CRYPTO')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${method === 'CRYPTO' ? 'bg-crypto-accent/10 border-crypto-accent text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'}`}
                            >
                                <Wallet size={20} className="mb-2" />
                                <span className="font-bold text-xs">Crypto</span>
                            </button>
                        </div>
                    </div>

                    {/* Method Specific Form */}
                    {method === 'CARD' ? (
                        <div className="space-y-4 animate-fadeIn">
                             <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                <span className="flex items-center gap-1"><Lock size={10} /> بياناتك مشفرة ومحمية</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-white rounded flex items-center justify-center"><span className="text-[8px] font-bold text-blue-800 font-serif italic">Visa</span></div>
                                    <div className="w-8 h-5 bg-white rounded flex items-center justify-center"><span className="text-[8px] font-bold text-red-600">MC</span></div>
                                </div>
                             </div>
                             
                             <div>
                                <input 
                                    type="text" 
                                    placeholder="الاسم على البطاقة"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent mb-3"
                                />
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent font-mono"
                                    />
                                    <CreditCard className="absolute right-3 top-3.5 text-gray-500" size={18} />
                                </div>
                             </div>

                             <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent font-mono"
                                />
                                <input 
                                    type="text" 
                                    placeholder="CVV"
                                    maxLength={3}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-crypto-accent font-mono"
                                />
                             </div>
                        </div>
                    ) : method === 'BANK' ? (
                        <div className="space-y-4 animate-fadeIn bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="text-sm text-gray-400">يرجى التحويل إلى الحساب التالي:</div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">اسم البنك</span>
                                    <span className="text-white">Saudi National Bank (SNB)</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">اسم المستفيد</span>
                                    <span className="text-white">CoinSouq Ltd.</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">IBAN</span>
                                    <span className="text-white font-mono select-all">SA56 1000 0000 0000 0000 0000</span>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-800">
                                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-crypto-accent transition-colors">
                                    <Upload className="mx-auto text-gray-500 mb-2" />
                                    <p className="text-xs text-gray-400">اضغط لرفع صورة إيصال التحويل</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fadeIn bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="text-center">
                                <div className="w-48 h-48 bg-white p-2 mx-auto mb-4 rounded-lg">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${userWalletAddress || '0x123'}`} alt="QR" className="w-full h-full" />
                                </div>
                                <div className="text-xs text-gray-400 mb-1">Your USDT (ERC20) Deposit Address</div>
                                <div className="flex items-center justify-center gap-2 bg-black/50 p-2 rounded-lg border border-gray-700">
                                    <code className="text-xs text-crypto-accent font-mono break-all">{userWalletAddress || 'Generating...'}</code>
                                    <button className="text-gray-400 hover:text-white"><Copy size={14} /></button>
                                </div>
                                <p className="text-[10px] text-yellow-500 mt-2">Only send USDT to this address. Sending other coins may result in permanent loss.</p>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <button 
                            onClick={handleDeposit}
                            disabled={!amount || (method === 'CARD' && !isCardValid)}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                                !amount || (method === 'CARD' && !isCardValid)
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-crypto-accent text-black hover:bg-yellow-400 shadow-yellow-500/20'
                            }`}
                        >
                            {method === 'CARD' ? `دفع $${amount || '0.00'}` : method === 'BANK' ? 'تأكيد إرسال الإيصال' : 'أكدت التحويل'}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
