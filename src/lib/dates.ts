const longFmt = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const shortFmt = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

export function formatLongDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    try {
        return longFmt.format(new Date(iso));
    } catch {
        return iso;
    }
}

export function formatShortDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    try {
        return shortFmt.format(new Date(iso));
    } catch {
        return iso;
    }
}

export function daysUntil(iso: string | null | undefined): number | null {
    if (!iso) return null;
    const ms = new Date(iso).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
}
