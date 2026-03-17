import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IUser } from '@/types';

interface AuthState {
    user: IUser | null;
    loading: boolean;
    isAuthenticated: boolean;
}

interface AuthActions {
    login: (email: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<IUser>) => void;
    incrementUsage: () => void;
    setLoading: (loading: boolean) => void;
}

interface AppStore extends AuthState {
    actions: AuthActions;
}

export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            (set) => ({
                // Initial State
                user: null,
                loading: false,
                isAuthenticated: false,

                // Actions separated from state for better performance and selector usage
                actions: {
                    setLoading: (loading) => set({ loading }, false, 'auth/setLoading'),

                    login: async (email: string) => {
                        set({ loading: true }, false, 'auth/loginRequest');

                        // Simulate API delay
                        await new Promise((resolve) => setTimeout(resolve, 800));

                        // Mock user logic from legacy AuthContext
                        let mockUser: IUser;
                        const usageKey = `usage_${email}`;
                        const storedUsage = parseInt(localStorage.getItem(usageKey) || '0');

                        if (email === 'admin@geradoc.com') {
                            mockUser = {
                                id: 'admin-1',
                                name: 'Super Admin',
                                email,
                                role: 'admin',
                                plan: 'premium',
                                company_name: 'GeraDoc Admin Inc',
                                monthlyUsage: storedUsage,
                            };
                        } else if (email === 'pro@geradoc.com') {
                            mockUser = {
                                id: 'pro-1',
                                name: 'Usuário Pro',
                                email,
                                role: 'user',
                                plan: 'premium',
                                company_name: 'Minha Empresa Premium',
                                monthlyUsage: storedUsage,
                            };
                        } else {
                            mockUser = {
                                id: Math.random().toString(36).substr(2, 9),
                                name: email.split('@')[0],
                                email,
                                role: 'user',
                                plan: 'free',
                                company_name: 'Minha Empresa',
                                monthlyUsage: storedUsage,
                            };
                        }

                        // Set email in localStorage for mock backend handlers compatibility
                        localStorage.setItem('geradoc_user_email', email);

                        set({
                            user: mockUser,
                            isAuthenticated: true,
                            loading: false
                        }, false, 'auth/loginSuccess');
                    },

                    logout: () => {
                        localStorage.removeItem('geradoc_user_email');
                        set({
                            user: null,
                            isAuthenticated: false
                        }, false, 'auth/logout');
                    },

                    updateProfile: (data) => {
                        set((state) => ({
                            user: state.user ? { ...state.user, ...data } : null
                        }), false, 'auth/updateProfile');
                    },

                    incrementUsage: () => {
                        set((state) => {
                            if (!state.user) return state;
                            const newUsage = state.user.monthlyUsage + 1;

                            // Also update legacy localStorage for compatibility with potential other parts
                            localStorage.setItem(`usage_${state.user.email}`, newUsage.toString());

                            return {
                                user: { ...state.user, monthlyUsage: newUsage }
                            };
                        }, false, 'auth/incrementUsage');
                    }
                }
            }),
            {
                name: 'geradoc-storage',
                // Only persist state, not actions
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                }),
                // Sync email with localStorage on hydration for mock backend consistency
                onRehydrateStorage: () => (state) => {
                    if (state?.user?.email) {
                        localStorage.setItem('geradoc_user_email', state.user.email);
                    }
                },
            }
        ),
        { name: 'GeraDoc Store' }
    )
);

// Helper hooks for easier access to actions
export const useAuthActions = () => useAppStore((state) => state.actions);
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAppStore((state) => state.loading);
