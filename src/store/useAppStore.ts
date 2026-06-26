import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IUser } from '@/types';
import { api, type BackendUser } from '@/lib/api';

// Map backend user to frontend IUser shape
function mapUser(backendUser: BackendUser): IUser {
    const rawPlan = backendUser.plan ?? '';
    let plan: IUser['plan'] = 'free';
    if (rawPlan === 'PROFISSIONAL' || rawPlan === 'profissional') plan = 'profissional';
    else if (rawPlan === 'EMPRESARIAL' || rawPlan === 'empresarial') plan = 'empresarial';

    const profile = backendUser.companyProfile;
    return {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role === 'ADMIN' ? 'admin' : 'user',
        plan,
        company_name: profile?.companyName,
        logoUrl: profile?.logoUrl ?? undefined,
        brandColor: profile?.brandColor ?? undefined,
        document: profile?.document ?? undefined,
        phone: profile?.phone ?? undefined,
        address: profile?.address ?? undefined,
        monthlyUsage: backendUser.billing?.monthlyUsage ?? 0,
        billing: backendUser.billing ?? undefined,
        subscription: backendUser.subscription ?? null,
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
    logout: () => Promise<void>;
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
                            // Auth token comes back as an httpOnly cookie, not in the body.
                            const { user } = await api.auth.login(email, password);
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
                            const { user } = await api.auth.register(name, email, password);
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

                    logout: async () => {
                        // Clear the httpOnly cookie server-side; ignore network errors.
                        try {
                            await api.auth.logout();
                        } catch {
                            // best-effort — local state is cleared regardless
                        }
                        set({ user: null, isAuthenticated: false }, false, 'auth/logout');
                    },

                    updateProfile: (data) => {
                        set((state) => ({
                            user: state.user ? { ...state.user, ...data } : null,
                        }), false, 'auth/updateProfile');
                    },

                    fetchMe: async () => {
                        // Validity is determined by the cookie; just ask the server.
                        try {
                            const user = await api.auth.me();
                            set({ user: mapUser(user), isAuthenticated: true }, false, 'auth/fetchMe');
                        } catch (err) {
                            const status = (err as { status?: number }).status;
                            if (status === 401) {
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
