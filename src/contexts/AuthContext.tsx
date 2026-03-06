import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'user' | 'beta' | 'admin';

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    company_name?: string;
    document?: string;
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
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

        if (email === 'admin@geradoc.com') {
            mockUser = {
                id: 'admin-1',
                name: 'Super Admin',
                email: email,
                role: 'admin',
                company_name: 'GeraDoc Admin Inc',
            };
        } else if (email === 'user@geradoc.com') {
            mockUser = {
                id: 'user-1',
                name: 'Usuário Padrão',
                email: email,
                role: 'user',
                company_name: 'Minha Prestadora ME',
            };
        } else {
            // Default fallback for any other email
            mockUser = {
                id: Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0],
                email: email,
                role: 'user',
                company_name: 'Nova Empresa',
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

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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
