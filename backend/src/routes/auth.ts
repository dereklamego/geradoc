import { FastifyInstance } from 'fastify';
import argon2 from 'argon2';
import { prisma } from '@/utils/prisma';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '@/schemas/auth';

export async function authRoutes(app: FastifyInstance) {
    // Register
    app.post<{ Body: RegisterInput }>(
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
            const { email, password, name } = registerSchema.parse(request.body);

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return reply.status(400).send({ message: 'User already exists' });
            }

            const passwordHash = await argon2.hash(password);

            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name,
                },
            });

            const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });

            return reply.status(201).send({ token, user: { id: user.id, email, name, role: user.role, plan: user.plan } });
        }
    );

    // Login
    app.post<{ Body: LoginInput }>(
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
            const { email, password } = loginSchema.parse(request.body);

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await argon2.verify(user.passwordHash, password);
            if (!isPasswordValid) {
                return reply.status(401).send({ message: 'Invalid credentials' });
            }

            const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });

            return { token, user: { id: user.id, email, name: user.name, role: user.role, plan: user.plan } };
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
        async (request) => {
            const user = await prisma.user.findUnique({
                where: { id: request.user.id },
                include: {
                    subscription: true,
                },
            });

            if (!user) {
                throw new Error('User not found');
            }

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
