import { GoogleGenAI } from "@google/genai";
import { Coin } from '../types';

let client: GoogleGenAI | null = null;

// NOTE FOR DEPLOYMENT: The API key is hardcoded here for demonstration purposes
// to ensure the deployed site works immediately without needing to configure
// environment variables on the hosting platform. In a real production app,
// this key MUST be stored securely in an environment variable.
const API_KEY = 'AIzaSyAafYtMmo03AbwJ9xsNsdHDEY_zJ0_t4co';


const getClient = () => {
  if (!client) {
    // Use the hardcoded key. If it's not available, fallback to process.env
    const keyToUse = API_KEY || process.env.API_KEY;
    if (!keyToUse) {
        console.error("API Key is missing. Please provide it.");
        return null;
    }
    client = new GoogleGenAI({ apiKey: keyToUse });
  }
  return client;
};

export const analyzeMarket = async (coins: Coin[], query: string) => {
  const ai = getClient();
  if (!ai) {
    return "عذراً، مفتاح API غير متوفر. لا يمكن الاتصال بالمساعد الذكي.";
  }
  
  // Create context from current market data
  const marketContext = coins.map(c => 
    `${c.name} (${c.symbol}): $${c.price.toFixed(2)}, 24h Change: ${c.change24h}%`
  ).join('\n');

  const prompt = `
    You are an expert crypto analyst assistant on an Arabic trading platform called "CoinSouq".
    
    Current Market Data:
    ${marketContext}

    User Query: "${query}"

    Instructions:
    1. Answer in Arabic.
    2. Be concise and professional.
    3. Use the provided market data to justify your answer.
    4. If the user asks for financial advice, provide analysis but always add a disclaimer that this is not financial advice.
    5. Keep the tone helpful and educational.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، أواجه صعوبة في الاتصال بالخادم حالياً. يرجى المحاولة لاحقاً.";
  }
};

export const getSmartInsight = async (coin: Coin) => {
    const ai = getClient();
    if (!ai) {
        return "لا تتوفر تحليلات حالياً.";
    }
    const prompt = `
      Provide a very short (max 2 sentences) technical analysis summary for ${coin.name} (${coin.symbol}) in Arabic.
      Price: ${coin.price}, 24h Change: ${coin.change24h}%.
      Focus on whether the trend looks bullish (buy) or bearish (sell) based strictly on the 24h change direction.
    `;
    
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text;
    } catch (error) {
        return "لا تتوفر تحليلات حالياً.";
    }
}