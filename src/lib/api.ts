// Centralized API client. Auth is carried by an httpOnly cookie set by the
// backend (XSS-safe) — the browser attaches it automatically via
// `credentials: 'include'`, so there is no token handling on the client.
// All requests go through here — no manual fetch calls in components.

import type { IClient, IService } from '@/types';

// Shape returned by the backend auth endpoints (login/register/me). Differs
// from the frontend IUser: plan is uppercase and company data is nested under
// companyProfile. Mapped to IUser in the store (mapUser).
export interface BackendUser {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'BETA' | 'ADMIN';
    plan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL';
    stripeCustomerId?: string | null;
    companyProfile?: {
        companyName: string;
        document: string | null;
        phone: string | null;
        address: string | null;
        brandColor: string | null;
        logoUrl: string | null;
    } | null;
    billing?: {
        monthlyUsage: number;
        monthlyLimit: number | null;
        currentPeriodStart: string;
        currentPeriodEnd: string;
        scheduledPlan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL' | null;
        scheduledPlanChangeAt: string | null;
    };
    subscription?: {
        status: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
    } | null;
}

// Company profile data exposed by the /profile endpoints.
export interface ProfileData {
    name?: string;
    document?: string;
    phone?: string;
    address?: string;
    brandColor?: string;
    logoUrl?: string | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const isDev = import.meta.env.DEV;

// Error thrown by the API client, carrying the HTTP status and parsed body.
export interface ApiError extends Error {
    status: number;
    body?: unknown;
}

function makeApiError(message: string, status: number, body?: unknown): ApiError {
    const err = new Error(message) as ApiError;
    err.status = status;
    err.body = body;
    return err;
}

// --- Core fetch wrapper ---
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    const fullUrl = `${API_URL}${path}`;
    const res = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include', // send/receive the httpOnly auth cookie
    });

    if (res.status === 401) {
        // Cookie is invalid/expired. Redirect to login unless already there.
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
        }
        throw makeApiError('Session expired. Please login again.', 401);
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: `HTTP Error ${res.status}` }));
        const message = (body as { message?: string }).message || `HTTP Error ${res.status}`;
        if (isDev) console.error('[apiFetch]', options.method || 'GET', fullUrl, 'error:', body);
        throw makeApiError(message, res.status, body);
    }

    // 204 No Content
    if (res.status === 204) return undefined as unknown as T;

    return res.json() as Promise<T>;
}

// --- API namespaces ---
export const api = {
    auth: {
        // The JWT is delivered as an httpOnly cookie; only the user is in the body.
        login: (email: string, password: string) =>
            apiFetch<{ user: BackendUser }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),

        register: (name: string, email: string, password: string) =>
            apiFetch<{ user: BackendUser }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            }),

        logout: () => apiFetch<void>('/auth/logout', { method: 'POST' }),

        me: () => apiFetch<BackendUser>('/auth/me'),

        changePlan: (plan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL') =>
            apiFetch<{
                plan: string;
                scheduledPlan: string | null;
                scheduledPlanChangeAt: string | null;
                kind: 'noop' | 'scheduled-downgrade' | 'immediate-upgrade';
            }>('/auth/plan', {
                method: 'PATCH',
                body: JSON.stringify({ plan }),
            }),

        cancelScheduledPlan: () =>
            apiFetch<{ plan: string; scheduledPlan: null; scheduledPlanChangeAt: null }>(
                '/auth/plan/scheduled',
                { method: 'DELETE' }
            ),
    },

    documents: {
        list: (params?: { page?: number; limit?: number; q?: string }) => {
            const qs = new URLSearchParams();
            if (params?.page) qs.set('page', String(params.page));
            if (params?.limit) qs.set('limit', String(params.limit));
            if (params?.q) qs.set('q', params.q);
            return apiFetch<{ items: any[]; total: number; page: number; limit: number }>(
                `/documents?${qs}`
            );
        },

        create: (data: { title: string; content: any; templateId?: string }) =>
            apiFetch<any>('/documents', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        get: (id: string) => apiFetch<any>(`/documents/${id}`),

        update: (id: string, data: Partial<{ title: string; content: any; status: string }>) =>
            apiFetch<any>(`/documents/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        delete: (id: string) =>
            apiFetch<void>(`/documents/${id}`, { method: 'DELETE' }),

        autosave: (id: string, content: any) =>
            apiFetch<any>(`/documents/${id}/autosave`, {
                method: 'PUT',
                body: JSON.stringify({ content }),
            }),
    },

    payments: {
        plans: () => apiFetch<any[]>('/payments/plans'),

        createCheckout: (plan: string, billingCycle: string) =>
            apiFetch<{ url: string }>('/payments/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify({ plan, billingCycle }),
            }),

        createPortal: () =>
            apiFetch<{ url: string }>('/payments/create-portal-session', {
                method: 'POST',
            }),

        getMethod: () =>
            apiFetch<{ paymentMethod: { brand: string; last4: string; expMonth: number; expYear: number } | null }>(
                '/payments/method'
            ),

        cancelSubscription: () =>
            apiFetch<{ message: string }>('/payments/cancel-subscription', { method: 'POST' }),
    },

    clients: {
        list: () => apiFetch<IClient[]>('/clients'),

        create: (data: Omit<IClient, 'id'>) =>
            apiFetch<IClient>('/clients', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        update: (id: string, data: Partial<IClient>) =>
            apiFetch<IClient>(`/clients/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        delete: (id: string) =>
            apiFetch<void>(`/clients/${id}`, { method: 'DELETE' }),
    },

    profile: {
        get: () => apiFetch<ProfileData>('/profile'),

        update: (data: Partial<ProfileData>) =>
            apiFetch<ProfileData>('/profile', {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        updateLogo: (base64: string) =>
            apiFetch<{ logoUrl: string }>('/profile/logo', {
                method: 'PATCH',
                body: JSON.stringify({ base64 }),
            }),
    },

    services: {
        list: () => apiFetch<IService[]>('/services'),

        create: (data: Omit<IService, 'id'>) =>
            apiFetch<IService>('/services', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        update: (id: string, data: Partial<IService>) =>
            apiFetch<IService>(`/services/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        delete: (id: string) =>
            apiFetch<void>(`/services/${id}`, { method: 'DELETE' }),
    },

    admin: {
        stats: () => apiFetch<{
            mrr: number;
            mrrGrowth: number | null;
            activeUsers: number;
            newThisWeek: number;
            docsToday: number;
            docsThisMonth: number;
            docsGrowth: number | null;
            churnRate: string;
            planDistribution: { FREE: number; PROFISSIONAL: number; EMPRESARIAL: number };
        }>('/admin/stats'),

        users: () => apiFetch<{ users: any[] }>('/admin/users'),

        finance: () => apiFetch<{ subscriptions: any[] }>('/admin/finance'),

        setPlan: (userId: string, plan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL') =>
            apiFetch<{ id: string; plan: string }>(`/admin/users/${userId}/plan`, {
                method: 'PATCH',
                body: JSON.stringify({ plan }),
            }),

        setRole: (userId: string, role: 'USER' | 'ADMIN' | 'BETA') =>
            apiFetch<{ id: string; role: string }>(`/admin/users/${userId}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role }),
            }),

        events: (params?: { limit?: number; offset?: number; userId?: string }) => {
            const qs = new URLSearchParams();
            if (params?.limit) qs.set('limit', String(params.limit));
            if (params?.offset) qs.set('offset', String(params.offset));
            if (params?.userId) qs.set('userId', params.userId);
            return apiFetch<{ events: any[]; total: number }>(`/admin/events?${qs}`);
        },
    },
};

