import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IUser } from '@/types';
import { api, setToken, removeToken, getToken } from '@/lib/api';

// Map backend user to frontend IUser shape
function mapUser(backendUser: any): IUser {
    console.log('[mapUser] raw backend response:', backendUser);
    console.log('[mapUser] companyProfile:', backendUser.companyProfile);
    console.log('[mapUser] logoUrl candidates:', {
        fromCompanyProfile: backendUser.companyProfile?.logoUrl,
        fromRoot: backendUser.logoUrl,
    });

    const rawPlan = backendUser.plan ?? '';
    let plan: IUser['plan'] = 'free';
    if (rawPlan === 'PROFISSIONAL' || rawPlan === 'profissional') plan = 'profissional';
    else if (rawPlan === 'EMPRESARIAL' || rawPlan === 'empresarial') plan = 'empresarial';

    const mapped: IUser = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role === 'ADMIN' || backendUser.role === 'admin' ? 'admin' : 'user',
        plan,
        company_name: backendUser.companyProfile?.companyName ?? backendUser.companyName ?? backendUser.company_name,
        logoUrl: backendUser.companyProfile?.logoUrl ?? backendUser.logoUrl,
        brandColor: backendUser.companyProfile?.brandColor ?? backendUser.brandColor,
        document: backendUser.companyProfile?.document ?? backendUser.document,
        phone: backendUser.companyProfile?.phone ?? backendUser.phone,
        address: backendUser.companyProfile?.address ?? backendUser.address,
        monthlyUsage: backendUser.billing?.monthlyUsage ?? backendUser.monthlyUsage ?? 0,
        billing: backendUser.billing ?? undefined,
        subscription: backendUser.subscription ?? null,
    };

    console.log('[mapUser] mapped result, logoUrl present:', !!mapped.logoUrl, 'length:', mapped.logoUrl?.length);
    return mapped;
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
                            console.log('[login] response user:', user);
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
                        console.log('[updateProfile] merging into user:', data);
                        set((state) => ({
                            user: state.user ? { ...state.user, ...data } : null,
                        }), false, 'auth/updateProfile');
                    },

                    fetchMe: async () => {
                        const token = getToken();
                        console.log('[fetchMe] called, token present:', !!token);
                        if (!token) return;
                        try {
                            const user = await api.auth.me();
                            console.log('[fetchMe] /me succeeded, will mapUser');
                            set({ user: mapUser(user), isAuthenticated: true }, false, 'auth/fetchMe');
                        } catch (err: any) {
                            console.error('[fetchMe] FAILED:', err?.message, err);
                            if (err?.message?.includes('Session expired') || err?.status === 401) {
                                removeToken();
                                set({ user: null, isAuthenticated: false }, false, 'auth/fetchMeFailure');
                            }
                        }
                    },
                },
            }),
            {
                name: 'geradoc-storage-v2',
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
