
import { User, Transaction, DepositRequest, ActivityLog, Mission } from '../types';
import { MOCK_DEPOSITS, MOCK_KYC_REQUESTS, MOCK_ACTIVITY_LOGS, MOCK_MISSIONS } from '../constants';

const DB_KEY = 'coinsouq_db_v1';

interface DatabaseSchema {
    users: User[];
    transactions: Transaction[];
    deposits: DepositRequest[];
    activityLogs: ActivityLog[];
}

const INITIAL_DB: DatabaseSchema = {
    users: [],
    transactions: [],
    deposits: [],
    activityLogs: []
};

class LocalDatabase {
    private data: DatabaseSchema;

    constructor() {
        this.data = this.load();
        this.seed();
    }

    private load(): DatabaseSchema {
        const stored = localStorage.getItem(DB_KEY);
        return stored ? JSON.parse(stored) : INITIAL_DB;
    }

    public save() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    }

    private seed() {
        // Seed initial admin data if empty
        if (this.data.deposits.length === 0) {
            this.data.deposits = [...MOCK_DEPOSITS];
        }
        
        // Ensure admin user exists if no users
        if (this.data.users.length === 0) {
            // MOCK_KYC_REQUESTS are basically users, let's add them
            this.data.users = MOCK_KYC_REQUESTS.map(u => ({
                ...u, 
                password: 'password', // Default password for mock users
                walletAddressUSDT: '0x' + Math.random().toString(16).slice(2, 42),
                portfolio: []
            }));
            
            // Create a default admin
            this.data.users.push({
                id: 'admin',
                name: 'System Admin',
                email: 'admin@coinsouq.com',
                password: 'admin',
                isLoggedIn: false,
                kycLevel: 3,
                balanceUSDT: 1000000,
                portfolio: [],
                walletAddressUSDT: '0xADMIN00000000000000000000000000000000000'
            });
            this.save();
        }
    }

    // --- User Methods ---
    getUsers() { return this.data.users; }
    
    getUserByEmail(email: string) {
        return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    getUserById(id: string) {
        return this.data.users.find(u => u.id === id);
    }

    createUser(user: User) {
        this.data.users.push(user);
        this.save();
        return user;
    }

    updateUser(id: string, updates: Partial<User>) {
        const index = this.data.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.data.users[index] = { ...this.data.users[index], ...updates };
            this.save();
            return this.data.users[index];
        }
        return null;
    }

    // --- Transaction Methods ---
    addTransaction(tx: Transaction) {
        this.data.transactions.unshift(tx);
        this.save();
    }

    getTransactionsByUserId(userId: string) {
        return this.data.transactions.filter(t => t.userId === userId);
    }

    // --- Deposit Methods ---
    addDeposit(deposit: DepositRequest) {
        this.data.deposits.unshift(deposit);
        this.save();
    }

    getDeposits() { return this.data.deposits; }

    updateDepositStatus(id: string, status: 'APPROVED' | 'REJECTED') {
        const index = this.data.deposits.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.deposits[index].status = status;
            this.save();
            return this.data.deposits[index];
        }
        return null;
    }

    // --- Activity Log Methods ---
    addActivityLog(log: ActivityLog) {
        this.data.activityLogs.unshift(log);
        this.save();
    }

    getActivityLogs(userId: string) {
        // Return real logs + some mocks for demo feel if real logs are few
        const realLogs = this.data.activityLogs.filter(l => l.userId === userId);
        return realLogs.length > 0 ? realLogs : MOCK_ACTIVITY_LOGS; 
    }
}

export const db = new LocalDatabase();
