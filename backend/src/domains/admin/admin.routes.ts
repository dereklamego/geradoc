import { FastifyInstance } from 'fastify';
import { prisma } from '../../shared/db/prisma.ts';
import { authenticate, UserPayload } from '../../shared/http/middlewares/auth.middleware.ts';

const PLAN_PRICE: Record<string, number> = {
    PROFISSIONAL: 29.90,
    EMPRESARIAL: 79.90,
    FREE: 0,
};

export async function adminRoutes(app: FastifyInstance) {
    // Middleware: require authenticated admin
    app.addHook('preHandler', async (request, reply) => {
        await authenticate(request, reply);
        const user = (request as any).user as UserPayload;
        if (user.role !== 'ADMIN') {
            return reply.status(403).send({ error: 'Forbidden', message: 'Admin only', code: 'FORBIDDEN' });
        }
    });

    // GET /api/admin/stats — overview KPIs
    app.get('/stats', async (_request, reply) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [
            allUsers,
            newThisWeek,
            docsToday,
            docsThisMonth,
            docsLastMonth,
            paidSubsThisMonth,
            paidSubsLastMonth,
        ] = await Promise.all([
            prisma.user.findMany({
                select: {
                    id: true, name: true, email: true, plan: true, role: true,
                    monthlyUsage: true, createdAt: true, updatedAt: true,
                    subscription: { select: { status: true, cancelAtPeriodEnd: true, currentPeriodEnd: true } },
                    companyProfile: { select: { name: true } },
                    _count: { select: { documents: { where: { isDeleted: false } } } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
            prisma.document.count({ where: { createdAt: { gte: startOfDay }, isDeleted: false } }),
            prisma.document.count({ where: { createdAt: { gte: startOfMonth }, isDeleted: false } }),
            prisma.document.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, isDeleted: false } }),
            prisma.user.findMany({
                where: { plan: { not: 'FREE' }, createdAt: { gte: startOfMonth } },
                select: { plan: true },
            }),
            prisma.user.findMany({
                where: { plan: { not: 'FREE' }, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
                select: { plan: true },
            }),
        ]);

        const mrr = allUsers
            .filter(u => u.plan !== 'FREE')
            .reduce((sum, u) => sum + (PLAN_PRICE[u.plan] ?? 0), 0);

        const mrrLastMonth = paidSubsLastMonth.reduce((sum, u) => sum + (PLAN_PRICE[u.plan] ?? 0), 0);
        const mrrThisMonth = paidSubsThisMonth.reduce((sum, u) => sum + (PLAN_PRICE[u.plan] ?? 0), 0);
        const mrrGrowth = mrrLastMonth > 0
            ? Math.round(((mrrThisMonth - mrrLastMonth) / mrrLastMonth) * 100)
            : null;

        const activeUsers = allUsers.filter(u => u.role !== 'ADMIN').length;

        // Churn: subscriptions that were canceled this month
        const churnedThisMonth = allUsers.filter(u =>
            u.subscription?.cancelAtPeriodEnd === true &&
            u.subscription.currentPeriodEnd &&
            new Date(u.subscription.currentPeriodEnd) >= startOfMonth
        ).length;
        const churnRate = activeUsers > 0
            ? ((churnedThisMonth / activeUsers) * 100).toFixed(1)
            : '0.0';

        const docsGrowth = docsLastMonth > 0
            ? Math.round(((docsThisMonth - docsLastMonth) / docsLastMonth) * 100)
            : null;

        // Plan distribution
        const planDistribution = {
            FREE: allUsers.filter(u => u.plan === 'FREE').length,
            PROFISSIONAL: allUsers.filter(u => u.plan === 'PROFISSIONAL').length,
            EMPRESARIAL: allUsers.filter(u => u.plan === 'EMPRESARIAL').length,
        };

        return reply.send({
            mrr,
            mrrGrowth,
            activeUsers,
            newThisWeek,
            docsToday,
            docsThisMonth,
            docsGrowth,
            churnRate,
            planDistribution,
        });
    });

    // GET /api/admin/users — full user list
    app.get('/users', async (_request, reply) => {
        const users = await prisma.user.findMany({
            select: {
                id: true, name: true, email: true, plan: true, role: true,
                monthlyUsage: true, createdAt: true, updatedAt: true,
                subscription: { select: { status: true, cancelAtPeriodEnd: true, currentPeriodEnd: true, billingCycle: true } },
                companyProfile: { select: { name: true, phone: true } },
                _count: { select: { documents: { where: { isDeleted: false } } } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return reply.send({ users });
    });

    // GET /api/admin/finance — subscriptions with billing info
    app.get('/finance', async (_request, reply) => {
        const subscriptions = await prisma.subscription.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true, plan: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return reply.send({ subscriptions });
    });

    // PATCH /api/admin/users/:id/plan — change a user's plan
    app.patch('/users/:id/plan', async (request, reply) => {
        const { id } = request.params as { id: string };
        const { plan } = request.body as { plan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL' };
        const actor = (request as any).user as UserPayload;
        if (!['FREE', 'PROFISSIONAL', 'EMPRESARIAL'].includes(plan)) {
            return reply.status(400).send({ error: 'Invalid plan' });
        }
        const current = await prisma.user.findUnique({ where: { id }, select: { plan: true } });
        const updated = await prisma.user.update({
            where: { id },
            data: { plan, scheduledPlan: null, scheduledPlanChangeAt: null },
            select: { id: true, plan: true },
        });
        if (current && current.plan !== plan) {
            await prisma.planEvent.create({
                data: {
                    userId: id,
                    fromPlan: current.plan,
                    toPlan: plan,
                    eventType: 'admin_change',
                    actorId: actor.id,
                },
            });
        }
        return reply.send(updated);
    });

    // GET /api/admin/events — plan change audit log
    app.get('/events', async (request, reply) => {
        const { limit = '50', offset = '0', userId } = request.query as { limit?: string; offset?: string; userId?: string };
        const events = await prisma.planEvent.findMany({
            where: userId ? { userId } : undefined,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
        const total = await prisma.planEvent.count({ where: userId ? { userId } : undefined });
        return reply.send({ events, total });
    });

    // PATCH /api/admin/users/:id/role — suspend (set role) or activate
    app.patch('/users/:id/role', async (request, reply) => {
        const { id } = request.params as { id: string };
        const { role } = request.body as { role: 'USER' | 'ADMIN' | 'BETA' };
        if (!['USER', 'ADMIN', 'BETA'].includes(role)) {
            return reply.status(400).send({ error: 'Invalid role' });
        }
        const updated = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, role: true },
        });
        return reply.send(updated);
    });
}
