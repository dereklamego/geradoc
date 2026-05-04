export type PlanId = 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL';

export interface PlanInfo {
    id: PlanId;
    label: string;
    monthlyDocuments: number | null; // null = unlimited
    customLogo: boolean;
    watermark: boolean;
    premiumTemplates: boolean;
    rank: number;
}

export const PLANS: Record<PlanId, PlanInfo> = {
    FREE: {
        id: 'FREE',
        label: 'Gratuito',
        monthlyDocuments: 2,
        customLogo: false,
        watermark: true,
        premiumTemplates: false,
        rank: 0,
    },
    PROFISSIONAL: {
        id: 'PROFISSIONAL',
        label: 'Profissional',
        monthlyDocuments: 30,
        customLogo: true,
        watermark: false,
        premiumTemplates: true,
        rank: 1,
    },
    EMPRESARIAL: {
        id: 'EMPRESARIAL',
        label: 'Empresarial',
        monthlyDocuments: null,
        customLogo: true,
        watermark: false,
        premiumTemplates: true,
        rank: 2,
    },
};

export function toPlanId(plan: string | undefined | null): PlanId {
    if (!plan) return 'FREE';
    const upper = plan.toUpperCase();
    if (upper === 'PROFISSIONAL' || upper === 'EMPRESARIAL' || upper === 'FREE') return upper;
    return 'FREE';
}

export function isDowngrade(current: PlanId, target: PlanId): boolean {
    return PLANS[target].rank < PLANS[current].rank;
}

export function formatLimit(n: number | null): string {
    return n === null ? 'Ilimitado' : `${n}/mês`;
}
