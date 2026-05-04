import { http, HttpResponse, delay } from 'msw';
import { db } from './db';
import { IClient, IDocument, IUser, IService } from '../types';

export const handlers = [
    // --- AUTH ---
    http.post('/api/auth/login', async ({ request }) => {
        await delay(800);
        const { email } = (await request.json()) as { email: string };

        const users = db.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return new HttpResponse(null, { status: 401 });
        }

        localStorage.setItem('geradoc_user_email', user.email);

        return HttpResponse.json({
            user,
            token: `mock-token-${user.id}`
        });
    }),

    http.get('/api/auth/me', async () => {
        await delay(300);
        const activeEmail = localStorage.getItem('geradoc_user_email');
        if (!activeEmail) return new HttpResponse(null, { status: 401 });

        const users = db.getUsers();
        const user = users.find(u => u.email === activeEmail);
        if (!user) return new HttpResponse(null, { status: 401 });

        return HttpResponse.json(user);
    }),

    // --- CLIENTS ---
    http.get('/api/clients', async () => {
        await delay(600);
        const clients = db.getClients();
        return HttpResponse.json(clients);
    }),

    http.post('/api/clients', async ({ request }) => {
        await delay(700);
        const body = (await request.json()) as Omit<IClient, 'id'>;

        const newClient: IClient = {
            ...body,
            id: crypto.randomUUID(),
        };

        db.addClient(newClient);
        return HttpResponse.json(newClient, { status: 201 });
    }),

    http.put('/api/clients/:id', async ({ params, request }) => {
        await delay(700);
        const { id } = params;
        const body = (await request.json()) as Partial<IClient>;
        const updated = db.updateClient(id as string, body);
        if (!updated) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(updated);
    }),

    http.delete('/api/clients/:id', async ({ params }) => {
        await delay(500);
        const { id } = params;
        db.deleteClient(id as string);
        return new HttpResponse(null, { status: 204 });
    }),

    // --- DOCUMENTS ---
    http.get('/api/documents', async () => {
        await delay(750);
        const docs = db.getDocuments();
        return HttpResponse.json(docs);
    }),

    http.post('/api/documents', async ({ request }) => {
        await delay(1000);
        const body = (await request.json()) as Omit<IDocument, 'id' | 'date'>;

        // Simulating context/session to check plan limits
        // In a real mock we might check a header or a cookie
        const users = db.getUsers();
        // For the demo, let's assume the first user in the mock DB is the "active" one
        // or we check the email if provided in the body (not typical)
        // To be precise, let's look for a user that matches the profile usually logged in
        const activeEmail = localStorage.getItem('geradoc_user_email') || 'user@geradoc.com';
        const user = users.find(u => u.email === activeEmail);

        // Use the user's monthlyUsage instead of total documents length
        const currentUsage = user ? user.monthlyUsage : 0;

        if (user?.plan === 'free' && currentUsage >= 2) {
            return new HttpResponse(
                JSON.stringify({ message: 'Limite do plano atingido (máx. 2 documentos/mês). Assine o Pro para gerar mais documentos.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const newDoc: IDocument = {
            ...body,
            id: `DOC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            date: new Date().toISOString(),
            status: 'Pendente'
        };

        db.addDocument(newDoc);

        // Increment usage in mock DB
        if (user) {
            db.updateUser(user.email, { monthlyUsage: user.monthlyUsage + 1 });
        }

        return HttpResponse.json(newDoc, { status: 201 });
    }),

    // --- PROFILE ---
    http.get('/api/profile', async () => {
        await delay(300);
        const activeEmail = localStorage.getItem('geradoc_user_email') || 'user@geradoc.com';
        const user = db.getUsers().find(u => u.email === activeEmail);
        if (!user) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(user);
    }),

    http.patch('/api/profile', async ({ request }) => {
        await delay(800);
        const body = (await request.json()) as Partial<IUser>;
        const activeEmail = localStorage.getItem('geradoc_user_email') || 'user@geradoc.com';
        const updatedUser = db.updateUser(activeEmail, { company_name: (body as any).name ?? undefined, ...body });
        if (!updatedUser) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(updatedUser);
    }),

    http.patch('/api/profile/logo', async ({ request }) => {
        await delay(600);
        const { base64 } = (await request.json()) as { base64: string };
        const activeEmail = localStorage.getItem('geradoc_user_email') || 'user@geradoc.com';
        db.updateUser(activeEmail, { logoUrl: base64 });
        return HttpResponse.json({ logoUrl: base64 });
    }),

    // --- SERVICES ---
    http.get('/api/services', async () => {
        await delay(600);
        const services = db.getServices();
        return HttpResponse.json(services);
    }),

    http.post('/api/services', async ({ request }) => {
        await delay(700);
        const body = (await request.json()) as Omit<IService, 'id'>;
        const newService: IService = {
            ...body,
            id: crypto.randomUUID(),
        };
        db.addService(newService);
        return HttpResponse.json(newService, { status: 201 });
    }),

    http.put('/api/services/:id', async ({ params, request }) => {
        await delay(700);
        const { id } = params;
        const body = (await request.json()) as Partial<IService>;
        const updated = db.updateService(id as string, body);
        if (!updated) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(updated);
    }),

    http.delete('/api/services/:id', async ({ params }) => {
        await delay(500);
        const { id } = params;
        db.deleteService(id as string);
        return new HttpResponse(null, { status: 204 });
    }),
];
