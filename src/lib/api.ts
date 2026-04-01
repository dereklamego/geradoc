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
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (res.status === 401) {
        removeToken();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Unexpected error' }));
        throw new Error(error.message || `HTTP Error ${res.status}`);
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

        createCheckout: (priceId: string) =>
            apiFetch<{ url: string }>('/payments/create-checkout-session', {
                method: 'POST',
                body: JSON.stringify({ priceId }),
            }),

        createPortal: () =>
            apiFetch<{ url: string }>('/payments/create-portal-session', {
                method: 'POST',
            }),
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
};

