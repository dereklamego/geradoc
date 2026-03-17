import { IUser, IClient, IDocument, IService } from '../types';

const DB_KEYS = {
    USERS: 'geradoc_mock_users',
    CLIENTS: 'geradoc_mock_clients',
    DOCUMENTS: 'geradoc_mock_documents',
    SERVICES: 'geradoc_mock_services',
};

// Initial Seed Data
const INITIAL_SERVICES: IService[] = [
    { id: 's1', name: 'Manutenção Preventiva AC', default_price: 150, default_warranty_months: 3 },
    { id: 's2', name: 'Carga de Gás R410A', default_price: 350, default_warranty_months: 6 },
    { id: 's3', name: 'Instalação Split 9000 BTUs', default_price: 600, default_warranty_months: 12 },
];

const INITIAL_CLIENTS: IClient[] = [
    { id: 'cli-1', name: 'Carlos Oliveira', type: 'PF', document: '123.456.789-00', phone: '(11) 98888-7777', address: 'Rua das Flores, 10', email: 'carlos@email.com' },
    { id: 'cli-2', name: 'Logística Express Ltda', type: 'PJ', document: '12.345.678/0001-90', phone: '(11) 3333-4444', address: 'Av. Paulista, 1000', email: 'contato@logistica.com' },
    { id: 'cli-3', name: 'Maria Silva', type: 'PF', document: '222.333.444-55', phone: '(21) 97777-6666', address: 'Rua do Catete, 50', email: 'maria@email.com' },
];

const INITIAL_DOCUMENTS: IDocument[] = [
    {
        id: 'DOC-001',
        type: 'Orçamento',
        clientId: 'cli-1',
        clientName: 'Carlos Oliveira',
        value: 150.00,
        date: '2026-03-05T14:30:00Z',
        status: 'Pendente',
        items: [{ id: 's1', name: 'Manutenção Preventiva AC', price: 150, quantity: 1 }],
        clientDataSnapshot: INITIAL_CLIENTS[0]
    },
    {
        id: 'DOC-002',
        type: 'OS',
        clientId: 'cli-2',
        clientName: 'Logística Express Ltda',
        value: 800.00,
        date: '2026-03-10T10:00:00Z',
        status: 'Finalizado',
        items: [{ id: 's2', name: 'Instalação Split 12000 BTUs', price: 800, quantity: 1 }],
        clientDataSnapshot: INITIAL_CLIENTS[1]
    }
];

const MOCK_USERS: IUser[] = [
    {
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@geradoc.com',
        role: 'admin',
        plan: 'premium',
        company_name: 'GeraDoc Admin Inc',
        brandColor: '#2563eb',
        monthlyUsage: 45,
    },
    {
        id: 'pro-1',
        name: 'Usuário Pro',
        email: 'pro@geradoc.com',
        role: 'user',
        plan: 'premium',
        company_name: 'Minha Empresa Premium',
        brandColor: '#7c3aed',
        monthlyUsage: 12,
    },
    {
        id: 'user-1',
        name: 'Usuário Padrão',
        email: 'user@geradoc.com',
        role: 'user',
        plan: 'free',
        company_name: 'Minha Prestadora ME',
        monthlyUsage: 1,
    }
];

// Helper to interact with LocalStorage
export const db = {
    getUsers: (): IUser[] => {
        const data = localStorage.getItem(DB_KEYS.USERS);
        if (!data) {
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(MOCK_USERS));
            return MOCK_USERS;
        }
        return JSON.parse(data);
    },

    getClients: (): IClient[] => {
        const data = localStorage.getItem(DB_KEYS.CLIENTS);
        if (!data) {
            localStorage.setItem(DB_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
            return INITIAL_CLIENTS;
        }
        return JSON.parse(data);
    },

    getDocuments: (): IDocument[] => {
        const data = localStorage.getItem(DB_KEYS.DOCUMENTS);
        if (!data) {
            localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
            return INITIAL_DOCUMENTS;
        }
        return JSON.parse(data);
    },

    addClient: (client: IClient) => {
        const clients = db.getClients();
        clients.push(client);
        localStorage.setItem(DB_KEYS.CLIENTS, JSON.stringify(clients));
    },

    updateClient: (id: string, updates: Partial<IClient>) => {
        const clients = db.getClients();
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index] = { ...clients[index], ...updates };
            localStorage.setItem(DB_KEYS.CLIENTS, JSON.stringify(clients));
            return clients[index];
        }
        return null;
    },

    deleteClient: (id: string) => {
        const clients = db.getClients();
        const filtered = clients.filter(c => c.id !== id);
        localStorage.setItem(DB_KEYS.CLIENTS, JSON.stringify(filtered));

        // Also remove documents for this client or handle it according to business rules
        // For now just removing the client
    },

    addDocument: (doc: IDocument) => {
        const docs = db.getDocuments();
        docs.push(doc);
        localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify(docs));

        // Update user usage
        const users = db.getUsers();
        // For simplicity, we assume an active user session in the mock
        // In handlers, we'd typically have the user ID from the token/session
    },

    updateUser: (email: string, updates: Partial<IUser>) => {
        const users = db.getUsers();
        const index = users.findIndex(u => u.email === email);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
            return users[index];
        }
        return null;
    },

    getServices: (): IService[] => {
        const data = localStorage.getItem(DB_KEYS.SERVICES);
        if (!data) {
            localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
            return INITIAL_SERVICES;
        }
        return JSON.parse(data);
    },

    addService: (service: IService) => {
        const services = db.getServices();
        services.push(service);
        localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
        return service;
    },

    updateService: (id: string, updates: Partial<IService>) => {
        const services = db.getServices();
        const index = services.findIndex(s => s.id === id);
        if (index !== -1) {
            services[index] = { ...services[index], ...updates };
            localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
            return services[index];
        }
        return null;
    },

    deleteService: (id: string) => {
        const services = db.getServices();
        const filtered = services.filter(s => s.id !== id);
        localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(filtered));
    }
};
