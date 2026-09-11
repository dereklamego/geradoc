import { IDocument } from '@/types';

export interface MonthlyRevenuePoint {
    key: string; // e.g. "2026-03"
    label: string; // e.g. "mar"
    total: number;
}

export interface DocumentTypeSlice {
    type: IDocument['type'];
    count: number;
    value: number;
}

// Controls which documents count toward the outlook cards and the type breakdown.
// 'all' = entire history; { year, month } = one specific calendar month (month is 1-12).
export type PeriodFilter = 'all' | { year: number; month: number };

const monthLabelFmt = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
const monthNameFmt = new Intl.DateTimeFormat('pt-BR', { month: 'long' });

function monthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function matchesPeriod(doc: IDocument, period: PeriodFilter): boolean {
    if (period === 'all') return true;
    const d = new Date(doc.date);
    return d.getFullYear() === period.year && d.getMonth() + 1 === period.month;
}

// Calendar years that have at least one document, most recent first. Always
// includes the current year so the picker has something to select even for a
// brand-new account with no documents yet.
export function buildYearOptions(documents: IDocument[]): number[] {
    const years = new Set<number>([new Date().getFullYear()]);
    for (const doc of documents) years.add(new Date(doc.date).getFullYear());
    return Array.from(years).sort((a, b) => b - a);
}

export const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
    monthNameFmt.format(new Date(2000, i, 1))
);

export function currentPeriod(): { year: number; month: number } {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// Sum of Recibo values per month, for the last `months` months (oldest first).
// Months with no revenue still appear as zero, so the trend line reads correctly.
// Always shows a fixed trailing window, independent of the page's period filter.
export function buildMonthlyRevenue(documents: IDocument[], months = 6): MonthlyRevenuePoint[] {
    const now = new Date();
    const points: MonthlyRevenuePoint[] = [];

    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = monthLabelFmt.format(d).replace('.', '');
        points.push({ key: monthKey(d), label, total: 0 });
    }

    const byKey = new Map(points.map((p) => [p.key, p]));
    for (const doc of documents) {
        if (doc.type !== 'Recibo') continue;
        const point = byKey.get(monthKey(new Date(doc.date)));
        if (point) point.total += doc.value;
    }

    return points;
}

export interface RevenueOutlook {
    awaitingPayment: number; // OS accepted/in progress, not yet paid (turned into a Recibo)
    forecast: number; // Orçamentos still awaiting client approval — not a commitment yet
}

// Splits what's not-yet-received into money that's actually expected soon (accepted
// service orders) vs. money that's only a proposal (quotes not yet approved by the client).
export function calculateRevenueOutlook(documents: IDocument[], period: PeriodFilter): RevenueOutlook {
    let awaitingPayment = 0;
    let forecast = 0;

    for (const doc of documents) {
        if (!matchesPeriod(doc, period)) continue;
        if (doc.type === 'OS' && doc.status !== 'Finalizado') {
            awaitingPayment += doc.value;
        } else if (doc.type === 'Orçamento' && doc.status !== 'Finalizado') {
            forecast += doc.value;
        }
    }

    return { awaitingPayment, forecast };
}

// Document count + value by type within the given period.
export function buildDocumentTypeBreakdown(documents: IDocument[], period: PeriodFilter): DocumentTypeSlice[] {
    const slices = new Map<IDocument['type'], DocumentTypeSlice>();

    for (const doc of documents) {
        if (!matchesPeriod(doc, period)) continue;
        const slice = slices.get(doc.type) ?? { type: doc.type, count: 0, value: 0 };
        slice.count += 1;
        slice.value += doc.value;
        slices.set(doc.type, slice);
    }

    return Array.from(slices.values());
}
