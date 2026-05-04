import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthRepository } from './auth.repository.ts';
import { AuthService } from './auth.service.ts';
import { changePlan, cancelScheduledPlanChange } from '../../shared/billing/billing.service.ts';
import { PLAN_LIMITS, isDowngrade } from '../../shared/plans/limits.ts';
import { prisma } from '../../shared/db/prisma.ts';

const planSchema = z.object({
    plan: z.enum(['FREE', 'PROFISSIONAL', 'EMPRESARIAL']),
});

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
            const limits = PLAN_LIMITS[user.plan];
            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    plan: user.plan,
                    billing: {
                        monthlyUsage: user.monthlyUsage,
                        monthlyLimit: Number.isFinite(limits.monthlyDocuments) ? limits.monthlyDocuments : null,
                        currentPeriodStart: user.currentPeriodStart,
                        currentPeriodEnd: user.currentPeriodEnd,
                        scheduledPlan: user.scheduledPlan,
                        scheduledPlanChangeAt: user.scheduledPlanChangeAt,
                    },
                },
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
            const profile = user.companyProfile;
            const limits = PLAN_LIMITS[user.plan];
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
                    cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
                } : null,
                billing: {
                    monthlyUsage: user.monthlyUsage,
                    monthlyLimit: Number.isFinite(limits.monthlyDocuments) ? limits.monthlyDocuments : null,
                    currentPeriodStart: user.currentPeriodStart,
                    currentPeriodEnd: user.currentPeriodEnd,
                    scheduledPlan: user.scheduledPlan,
                    scheduledPlanChangeAt: user.scheduledPlanChangeAt,
                },
                companyProfile: profile ? {
                    companyName: profile.name,
                    document: profile.document,
                    phone: profile.phone,
                    address: profile.address,
                    brandColor: profile.brandColor,
                    logoUrl: profile.logoStorage ?? null,
                } : null,
            };
        }
    );

    // Change plan (dev/no-Stripe). Upgrades apply immediately; downgrades are scheduled.
    app.patch(
        '/plan',
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            const { plan } = planSchema.parse(request.body);
            const userId = (request as any).user.id;
            const current = await prisma.user.findUnique({ where: { id: userId } });
            if (!current) return reply.status(404).send({ error: 'NotFound', message: 'User not found' });

            const updated = await changePlan(current, plan);
            const wasDowngrade = isDowngrade(current.plan, plan);
            return reply.send({
                plan: updated.plan,
                scheduledPlan: updated.scheduledPlan,
                scheduledPlanChangeAt: updated.scheduledPlanChangeAt,
                kind: plan === current.plan ? 'noop' : wasDowngrade ? 'scheduled-downgrade' : 'immediate-upgrade',
            });
        }
    );

    // Cancel a pending downgrade
    app.delete(
        '/plan/scheduled',
        { preHandler: [app.authenticate] },
        async (request, reply) => {
            const userId = (request as any).user.id;
            const current = await prisma.user.findUnique({ where: { id: userId } });
            if (!current) return reply.status(404).send({ error: 'NotFound', message: 'User not found' });
            const updated = await cancelScheduledPlanChange(current);
            return reply.send({
                plan: updated.plan,
                scheduledPlan: updated.scheduledPlan,
                scheduledPlanChangeAt: updated.scheduledPlanChangeAt,
            });
        }
    );
}
