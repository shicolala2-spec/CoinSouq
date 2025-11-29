import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';
import { analyzeMarket } from '../services/geminiService';
import { Coin } from '../types';

interface AIAssistantProps {
  coins: Coin[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ coins }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: 'مرحباً! أنا مساعدك الذكي في CoinSouq. كيف يمكنني مساعدتك في تحليل السوق اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await analyzeMarket(coins, userMsg);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 ${
            isOpen ? 'bg-gray-700 rotate-90' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <Bot className="text-white w-8 h-8" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-40 w-[350px] md:w-[400px] h-[500px] bg-crypto-card border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                 <Sparkles className="text-yellow-300 w-5 h-5" />
             </div>
             <div>
                <h3 className="font-bold text-white">المساعد الذكي</h3>
                <p className="text-xs text-indigo-200">مدعوم بواسطة Gemini AI</p>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                 <div className="bg-gray-700 p-3 rounded-2xl rounded-bl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-crypto-accent" />
                 </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center gap-2 bg-gray-900 rounded-full px-4 py-2 border border-gray-700 focus-within:border-indigo-500 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اسأل عن السوق..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
