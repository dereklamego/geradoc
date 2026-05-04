// Centralized API client with automatic JWT injection and error handling.
// All requests go through here — no manual fetch calls in components.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'geradoc_token';

// --- Token helpers ---
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// --- Core fetch wrapper ---
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = `${API_URL}${path}`;
    console.log('[apiFetch]', options.method || 'GET', fullUrl, 'token?', !!token);
    const res = await fetch(fullUrl, { ...options, headers });
    console.log('[apiFetch]', options.method || 'GET', fullUrl, '->', res.status);

    if (res.status === 401) {
        removeToken();
        // Defer redirect: let the caller handle it. Only redirect from non-/login pages
        // and only if we're not already on the login page.
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            console.warn('[apiFetch] 401 received on', fullUrl, '- redirecting to /login');
            window.location.href = '/login';
        }
        const err: any = new Error('Session expired. Please login again.');
        err.status = 401;
        throw err;
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: `HTTP Error ${res.status}` }));
        const err: any = new Error(error.message || `HTTP Error ${res.status}`);
        err.status = res.status;
        err.body = error;
        console.error('[apiFetch]', options.method || 'GET', fullUrl, 'error:', error);
        throw err;
    }

    // 204 No Content
    if (res.status === 204) return undefined as unknown as T;

    return res.json();
}

// --- API namespaces ---
export const api = {
    auth: {
        login: (email: string, password: string) =>
            apiFetch<{ token: string; user: any }>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),

        register: (name: string, email: string, password: string) =>
            apiFetch<{ token: string; user: any }>('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            }),

        me: () => apiFetch<any>('/auth/me'),

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
        list: () => apiFetch<any[]>('/clients'),

        create: (data: Omit<any, 'id'>) =>
            apiFetch<any>('/clients', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        update: (id: string, data: Partial<any>) =>
            apiFetch<any>(`/clients/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        delete: (id: string) =>
            apiFetch<void>(`/clients/${id}`, { method: 'DELETE' }),
    },

    profile: {
        get: () => apiFetch<any>('/profile'),

        update: (data: { name?: string; document?: string; phone?: string; address?: string; brandColor?: string }) =>
            apiFetch<any>('/profile', {
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
        list: () => apiFetch<any[]>('/services'),

        create: (data: any) =>
            apiFetch<any>('/services', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        update: (id: string, data: Partial<any>) =>
            apiFetch<any>(`/services/${id}`, {
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

