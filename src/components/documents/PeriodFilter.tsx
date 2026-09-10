import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTH_NAMES, PeriodFilter as PeriodFilterValue } from '@/lib/dashboard-metrics';

interface PeriodFilterProps {
    value: PeriodFilterValue;
    onChange: (value: PeriodFilterValue) => void;
    years: number[];
}

export function PeriodFilter({ value, onChange, years }: PeriodFilterProps) {
    const mode = value === 'all' ? 'all' : 'month';
    const year = value === 'all' ? years[0] : value.year;
    const month = value === 'all' ? new Date().getMonth() + 1 : value.month;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Select
                value={mode}
                onValueChange={(v) => onChange(v === 'all' ? 'all' : { year, month })}
            >
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todo o período</SelectItem>
                    <SelectItem value="month">Mês específico</SelectItem>
                </SelectContent>
            </Select>

            {mode === 'month' && (
                <>
                    <Select
                        value={String(month)}
                        onValueChange={(v) => onChange({ year, month: Number(v) })}
                    >
                        <SelectTrigger className="w-[140px] h-9 capitalize">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTH_NAMES.map((name, i) => (
                                <SelectItem key={name} value={String(i + 1)} className="capitalize">
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={String(year)}
                        onValueChange={(v) => onChange({ year: Number(v), month })}
                    >
                        <SelectTrigger className="w-[100px] h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </>
            )}
        </div>
    );
}
