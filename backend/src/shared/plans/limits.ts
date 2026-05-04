import { Plan } from '@prisma/client';

export interface PlanLimits {
    monthlyDocuments: number; // Infinity = unlimited
    customLogo: boolean;
    watermark: boolean;
    premiumTemplates: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
    FREE: {
        monthlyDocuments: 2,
        customLogo: false,
        watermark: true,
        premiumTemplates: false,
    },
    PROFISSIONAL: {
        monthlyDocuments: 30,
        customLogo: true,
        watermark: false,
        premiumTemplates: true,
    },
    EMPRESARIAL: {
        monthlyDocuments: Number.POSITIVE_INFINITY,
        customLogo: true,
        watermark: false,
        premiumTemplates: true,
    },
};

export const PLAN_RANK: Record<Plan, number> = {
    FREE: 0,
    PROFISSIONAL: 1,
    EMPRESARIAL: 2,
};

export function isDowngrade(current: Plan, target: Plan): boolean {
    return PLAN_RANK[target] < PLAN_RANK[current];
}
