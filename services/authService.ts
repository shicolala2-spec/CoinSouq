
import { db } from './db';
import { User } from '../types';
import { walletService } from './walletService';

const SESSION_KEY = 'coinsouq_session_user_id';

export const authService = {
    login: async (email: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> => {
        // Simulated latency
        await new Promise(r => setTimeout(r, 800));

        const user = db.getUserByEmail(email);
        
        // For Guest/Demo mode, we might allow passwordless or simple check
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Simple password check (In real app, hash comparison)
        if (password && user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }

        // Generate Session
        localStorage.setItem(SESSION_KEY, user.id);
        
        // Log Activity
        db.addActivityLog({
            id: Date.now().toString(),
            userId: user.id,
            action: 'Login Successful',
            ip: '192.168.1.X', // Mock
            device: navigator.userAgent.split(')')[0] + ')', // Simple UA
            date: new Date().toLocaleString()
        });

        return { success: true, user: { ...user, isLoggedIn: true } };
    },

    register: async (data: { email: string; password?: string; name: string; kycLevel: 0 | 1 | 2 | 3 }): Promise<User> => {
        await new Promise(r => setTimeout(r, 1000));

        const existing = db.getUserByEmail(data.email);
        if (existing) {
            throw new Error('Email already exists');
        }

        const newUser: User = {
            id: 'u_' + Date.now().toString(36),
            name: data.name,
            email: data.email,
            password: data.password || 'password', // Default if skipped
            isLoggedIn: true,
            kycLevel: data.kycLevel,
            kycStatus: data.kycLevel >= 2 ? 'VERIFIED' : 'PENDING',
            balanceUSDT: 0, // Start with 0
            portfolio: [],
            walletAddressUSDT: walletService.generateAddress('ETH'), // ERC20 style
            walletAddressBTC: walletService.generateAddress('BTC'),
            referralCode: 'REF' + Math.random().toString(36).substring(2, 7).toUpperCase(),
            points: 50, // Welcome bonus
            streakDays: 1,
            lastLoginDate: new Date().toDateString()
        };

        db.createUser(newUser);
        localStorage.setItem(SESSION_KEY, newUser.id);
        
        return newUser;
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
    },

    getCurrentUser: (): User | null => {
        const userId = localStorage.getItem(SESSION_KEY);
        if (!userId) return null;
        
        const user = db.getUserById(userId);
        if (user) {
            return { ...user, isLoggedIn: true };
        }
        return null;
    }
};
