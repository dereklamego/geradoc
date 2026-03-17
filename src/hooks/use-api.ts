import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IClient, IDocument, IUser, IService } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useServices = () => {
    return useQuery<IService[]>({
        queryKey: ['services'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/services`);
            if (!res.ok) throw new Error('Erro ao carregar serviços');
            return res.json();
        },
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (service: Omit<IService, 'id'>) => {
            const res = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service),
            });
            if (!res.ok) throw new Error('Erro ao criar serviço');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...service }: Partial<IService> & { id: string }) => {
            const res = await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service),
            });
            if (!res.ok) throw new Error('Erro ao atualizar serviço');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/services/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Erro ao excluir serviço');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

// --- CLIENTS ---
export const useClients = () => {
    return useQuery<IClient[]>({
        queryKey: ['clients'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/clients`);
            if (!res.ok) throw new Error('Erro ao carregar clientes');
            return res.json();
        },
    });
};

export const useCreateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (client: Omit<IClient, 'id'>) => {
            const res = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(client),
            });
            if (!res.ok) throw new Error('Erro ao criar cliente');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<IClient> & { id: string }) => {
            const res = await fetch(`${API_URL}/clients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Erro ao atualizar cliente');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};

export const useDeleteClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/clients/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Erro ao excluir cliente');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });
};

// --- DOCUMENTS ---
export const useDocuments = () => {
    return useQuery<IDocument[]>({
        queryKey: ['documents'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/documents`);
            if (!res.ok) throw new Error('Erro ao carregar documentos');
            return res.json();
        },
    });
};

export const useCreateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (doc: Omit<IDocument, 'id' | 'date'>) => {
            const res = await fetch(`${API_URL}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doc),
            });
            if (!res.ok) {
                if (res.status === 403) throw new Error('Limite do plano atingido (máx. 2 documentos/mês)');
                throw new Error('Erro ao salvar documento');
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
};

export const useProfile = () => {
    return useQuery<IUser>({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/profile`);
            if (!res.ok) throw new Error('Erro ao carregar perfil');
            return res.json();
        },
    });
};
