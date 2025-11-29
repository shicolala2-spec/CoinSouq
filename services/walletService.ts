
import { db } from './db';
import { Transaction, User, Coin } from '../types';

export const walletService = {
    generateAddress: (chain: 'BTC' | 'ETH' | 'TRX') => {
        const prefix = chain === 'BTC' ? 'bc1' : chain === 'ETH' ? '0x' : 'T';
        const chars = 'abcdef0123456789';
        let addr = prefix;
        for (let i = 0; i < (chain === 'BTC' ? 39 : 40); i++) {
            addr += chars[Math.floor(Math.random() * chars.length)];
        }
        return addr;
    },

    executeTrade: (user: User, type: 'BUY' | 'SELL', coin: Coin, amount: number, totalCost: number): User => {
        // 1. Validate Balance
        if (type === 'BUY' && user.balanceUSDT < totalCost) {
            throw new Error('Insufficient USDT Balance');
        }
        
        const existingPortfolioItem = user.portfolio.find(p => p.coinId === coin.id);
        if (type === 'SELL') {
            if (!existingPortfolioItem || existingPortfolioItem.amount < amount) {
                throw new Error(`Insufficient ${coin.symbol} Balance`);
            }
        }

        // 2. Update Balances & Portfolio
        let newBalance = user.balanceUSDT;
        let newPortfolio = [...user.portfolio];

        if (type === 'BUY') {
            newBalance -= totalCost;
            if (existingPortfolioItem) {
                // Calculate new weighted average price
                const oldTotalCost = existingPortfolioItem.amount * existingPortfolioItem.averageBuyPrice;
                const newTotalCost = oldTotalCost + totalCost;
                const newTotalAmount = existingPortfolioItem.amount + amount;
                
                existingPortfolioItem.amount = newTotalAmount;
                existingPortfolioItem.averageBuyPrice = newTotalCost / newTotalAmount;
            } else {
                newPortfolio.push({
                    coinId: coin.id,
                    amount: amount,
                    averageBuyPrice: totalCost / amount
                });
            }
        } else {
            // SELL
            newBalance += totalCost;
            if (existingPortfolioItem) {
                existingPortfolioItem.amount -= amount;
                if (existingPortfolioItem.amount <= 0.0000001) {
                    newPortfolio = newPortfolio.filter(p => p.coinId !== coin.id);
                }
            }
        }

        // 3. Save to DB
        const updatedUser = db.updateUser(user.id, {
            balanceUSDT: newBalance,
            portfolio: newPortfolio
        });

        if (!updatedUser) throw new Error('User update failed');

        // 4. Log Transaction
        const tx: Transaction = {
            id: 'tx_' + Date.now(),
            userId: user.id,
            type: type,
            coinId: coin.id,
            coinSymbol: coin.symbol,
            amount: amount,
            priceAtTransaction: coin.price,
            totalCost: totalCost,
            date: new Date().toISOString(),
            status: 'COMPLETED'
        };
        db.addTransaction(tx);

        return { ...updatedUser, isLoggedIn: true };
    },

    processDeposit: (userId: string, amount: number, method: 'CARD' | 'BANK') => {
        const user = db.getUserById(userId);
        if (!user) throw new Error('User not found');

        const updatedUser = db.updateUser(userId, {
            balanceUSDT: user.balanceUSDT + amount
        });

        // Log Deposit
        db.addActivityLog({
            id: Date.now().toString(),
            userId: userId,
            action: `Deposit ${method} ${amount} USDT`,
            ip: '192.168.1.1',
            device: 'System',
            date: new Date().toLocaleString()
        });

        return updatedUser;
    }
};
