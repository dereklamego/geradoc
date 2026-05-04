import { prisma } from '../db/prisma.ts';
import { Plan, User } from '@prisma/client';
import { isDowngrade } from '../plans/limits.ts';

const CYCLE_DAYS = 30;

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
}

/**
 * Lazy apply: any authenticated request runs this to catch up on
 * scheduled downgrades and ciclo rollover. Replaces the need for a cron job.
 */
export async function syncBilling(user: User): Promise<User> {
    const now = new Date();
    let updated = user;

    // 1. Apply scheduled plan change if its date has passed
    if (user.scheduledPlan && user.scheduledPlanChangeAt && user.scheduledPlanChangeAt <= now) {
        updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                plan: user.scheduledPlan,
                scheduledPlan: null,
                scheduledPlanChangeAt: null,
                currentPeriodStart: now,
                currentPeriodEnd: addDays(now, CYCLE_DAYS),
                monthlyUsage: 0,
            },
        });
    } else if (user.currentPeriodEnd <= now) {
        // 2. Cycle rollover (no plan change pending) — reset usage
        updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                currentPeriodStart: now,
                currentPeriodEnd: addDays(now, CYCLE_DAYS),
                monthlyUsage: 0,
            },
        });
    }

    return updated;
}

/**
 * Schedule a plan change. Upgrades apply immediately + reset cycle.
 * Downgrades are scheduled for currentPeriodEnd.
 */
export async function changePlan(user: User, target: Plan, actorId?: string): Promise<User> {
    if (target === user.plan) return user;

    const now = new Date();

    if (isDowngrade(user.plan, target)) {
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: {
                scheduledPlan: target,
                scheduledPlanChangeAt: user.currentPeriodEnd,
            },
        });
        await prisma.planEvent.create({
            data: {
                userId: user.id,
                fromPlan: user.plan,
                toPlan: target,
                eventType: 'downgrade',
                actorId: actorId ?? user.id,
                metadata: { scheduledAt: user.currentPeriodEnd.toISOString() },
            },
        });
        return updated;
    }

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
            plan: target,
            scheduledPlan: null,
            scheduledPlanChangeAt: null,
            currentPeriodStart: now,
            currentPeriodEnd: addDays(now, CYCLE_DAYS),
            monthlyUsage: 0,
        },
    });
    await prisma.planEvent.create({
        data: {
            userId: user.id,
            fromPlan: user.plan,
            toPlan: target,
            eventType: 'upgrade',
            actorId: actorId ?? user.id,
        },
    });
    return updated;
}

export async function cancelScheduledPlanChange(user: User): Promise<User> {
    return prisma.user.update({
        where: { id: user.id },
        data: { scheduledPlan: null, scheduledPlanChangeAt: null },
    });
}

export async function incrementUsage(userId: string): Promise<User> {
    return prisma.user.update({
        where: { id: userId },
        data: { monthlyUsage: { increment: 1 } },
    });
}
