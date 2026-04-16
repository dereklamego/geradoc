import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IUser } from '@/types';
import { api, setToken, removeToken, getToken } from '@/lib/api';

// Map backend user to frontend IUser shape
function mapUser(backendUser: any): IUser {
    return {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role === 'ADMIN' ? 'admin' : 'user',
        plan: backendUser.plan === 'PROFISSIONAL' ? 'profissional' : backendUser.plan === 'EMPRESARIAL' ? 'empresarial' : 'free',
        company_name: backendUser.companyName,
        monthlyUsage: 0,
    };
}

interface AuthState {
    user: IUser | null;
    loading: boolean;
    isAuthenticated: boolean;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<IUser>) => void;
    fetchMe: () => Promise<void>;
    setLoading: (loading: boolean) => void;
}

interface AppStore extends AuthState {
    actions: AuthActions;
}

export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                loading: false,
                isAuthenticated: false,

                actions: {
                    setLoading: (loading) => set({ loading }, false, 'auth/setLoading'),

                    login: async (email: string, password: string) => {
                        set({ loading: true }, false, 'auth/loginRequest');
                        try {
                            const { token, user } = await api.auth.login(email, password);
                            setToken(token);
                            set({
                                user: mapUser(user),
                                isAuthenticated: true,
                                loading: false,
                            }, false, 'auth/loginSuccess');
                        } catch (error) {
                            set({ loading: false }, false, 'auth/loginFailure');
                            throw error;
                        }
                    },

                    register: async (name: string, email: string, password: string) => {
                        set({ loading: true }, false, 'auth/registerRequest');
                        try {
                            const { token, user } = await api.auth.register(name, email, password);
                            setToken(token);
                            set({
                                user: mapUser(user),
                                isAuthenticated: true,
                                loading: false,
                            }, false, 'auth/registerSuccess');
                        } catch (error) {
                            set({ loading: false }, false, 'auth/registerFailure');
                            throw error;
                        }
                    },

                    logout: () => {
                        removeToken();
                        set({ user: null, isAuthenticated: false }, false, 'auth/logout');
                    },

                    updateProfile: (data) => {
                        set((state) => ({
                            user: state.user ? { ...state.user, ...data } : null,
                        }), false, 'auth/updateProfile');
                    },

                    fetchMe: async () => {
                        const token = getToken();
                        if (!token) return;
                        try {
                            const user = await api.auth.me();
                            set({ user: mapUser(user), isAuthenticated: true }, false, 'auth/fetchMe');
                        } catch {
                            removeToken();
                            set({ user: null, isAuthenticated: false }, false, 'auth/fetchMeFailure');
                        }
                    },
                },
            }),
            {
                name: 'geradoc-storage',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        { name: 'GeraDoc Store' }
    )
);

// Selector hooks
export const useAuthActions = () => useAppStore((state) => state.actions);
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAppStore((state) => state.loading);
