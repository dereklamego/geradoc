import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'user' | 'beta' | 'admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    plan: 'free' | 'premium';
    company_name?: string;
    document?: string;
    phone?: string;
    logoUrl?: string;
    monthlyUsage: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    incrementUsage: () => void;
    updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user session (mock)
        const storedUser = localStorage.getItem('geradoc_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Mock login logic
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Specific mock users for testing
        let mockUser: User;
        const usageKey = `usage_${email}`;
        const storedUsage = parseInt(localStorage.getItem(usageKey) || '0');

        if (email === 'admin@geradoc.com') {
            mockUser = {
                id: 'admin-1',
                name: 'Super Admin',
                email: email,
                role: 'admin',
                plan: 'premium',
                company_name: 'GeraDoc Admin Inc',
                monthlyUsage: storedUsage,
            };
        } else if (email === 'pro@geradoc.com') {
            mockUser = {
                id: 'pro-1',
                name: 'Usuário Pro',
                email: email,
                role: 'user',
                plan: 'premium',
                company_name: 'Minha Empresa Premium',
                monthlyUsage: storedUsage,
            };
        } else if (email === 'user@geradoc.com') {
            mockUser = {
                id: 'user-1',
                name: 'Usuário Padrão',
                email: email,
                role: 'user',
                plan: 'free',
                company_name: 'Minha Prestadora ME',
                monthlyUsage: storedUsage,
            };
        } else {
            // Default fallback for any other email
            mockUser = {
                id: Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0],
                email: email,
                role: 'user',
                plan: 'free',
                company_name: 'Nova Empresa',
                monthlyUsage: storedUsage,
            };
        }

        setUser(mockUser);
        localStorage.setItem('geradoc_user', JSON.stringify(mockUser));
        setLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('geradoc_user');
    };

    const incrementUsage = () => {
        if (!user) return;
        const newUsage = user.monthlyUsage + 1;
        const updatedUser = { ...user, monthlyUsage: newUsage };
        setUser(updatedUser);
        localStorage.setItem('geradoc_user', JSON.stringify(updatedUser));
        localStorage.setItem(`usage_${user.email}`, newUsage.toString());
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('geradoc_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, incrementUsage, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
