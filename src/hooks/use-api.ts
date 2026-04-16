import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// --- DOCUMENTS ---
export const useDocuments = (params?: { page?: number; limit?: number; q?: string }) => {
    return useQuery({
        queryKey: ['documents', params],
        queryFn: () => api.documents.list(params),
    });
};

export const useCreateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (doc: { title: string; content: any; templateId?: string }) =>
            api.documents.create(doc),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
};

export const useUpdateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; title?: string; content?: any; status?: string }) =>
            api.documents.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.documents.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
};

export const useDocument = (id: string) => {
    return useQuery({
        queryKey: ['documents', id],
        queryFn: () => api.documents.get(id),
        enabled: !!id,
    });
};

// --- PAYMENTS ---
export const usePlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: () => api.payments.plans(),
    });
};

export const useCreateCheckout = () => {
    return useMutation({
        mutationFn: ({ plan, billingCycle }: { plan: string; billingCycle: string }) => api.payments.createCheckout(plan, billingCycle),
        onSuccess: ({ url }) => {
            window.location.href = url;
        },
    });
};

export const useCreatePortal = () => {
    return useMutation({
        mutationFn: () => api.payments.createPortal(),
        onSuccess: ({ url }) => {
            window.location.href = url;
        },
    });
};

// --- ME (current user) ---
export const useMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: () => api.auth.me(),
        retry: false,
    });
};

// Alias for useMe — used by Dashboard and other pages
export const useProfile = useMe;

// --- CLIENTS ---
export const useClients = () => {
    return useQuery({
        queryKey: ['clients'],
        queryFn: () => api.clients.list(),
    });
};

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => api.clients.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
            api.clients.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};

export const useDeleteClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.clients.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};

// --- SERVICES (catalog) ---
export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: () => api.services.list(),
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => api.services.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
            api.services.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.services.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};
