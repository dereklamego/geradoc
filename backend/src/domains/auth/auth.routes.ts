import { FastifyInstance } from 'fastify';
import { AuthRepository } from './auth.repository.ts';
import { AuthService } from './auth.service.ts';

export async function authRoutes(app: FastifyInstance) {
    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);

    // Register
    app.post(
        '/register',
        {
            schema: {
                description: 'Register a new user',
                tags: ['auth'],
                body: {
                    type: 'object',
                    required: ['email', 'password', 'name'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 6 },
                        name: { type: 'string' },
                    },
                },
            },
        },
        async (request, reply) => {
            const data = request.body as any;
            const user = await authService.register(data);
            const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });
            return reply.status(201).send({
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
            });
        }
    );

    // Login
    app.post(
        '/login',
        {
            schema: {
                description: 'Login with email and password',
                tags: ['auth'],
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' },
                    },
                },
            },
        },
        async (request, reply) => {
            const data = request.body as any;
            const user = await authService.login(data);
            const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });
            return {
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
            };
        }
    );

    // Get Me
    app.get(
        '/me',
        {
            preHandler: [app.authenticate],
            schema: {
                description: 'Get current user profile and plan status',
                tags: ['auth'],
                security: [{ bearerAuth: [] }],
            },
        },
        async (request, reply) => {
            const user = await authService.getUserById((request as any).user.id);
            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                plan: user.plan,
                stripeCustomerId: user.stripeCustomerId,
                subscription: user.subscription ? {
                    status: user.subscription.status,
                    currentPeriodEnd: user.subscription.currentPeriodEnd,
                } : null,
            };
        }
    );
}
