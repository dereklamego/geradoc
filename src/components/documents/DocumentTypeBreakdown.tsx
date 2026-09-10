import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentTypeSlice } from '@/lib/dashboard-metrics';

const COLORS: Record<DocumentTypeSlice['type'], string> = {
    'Orçamento': '#3b82f6',
    'OS': '#f59e0b',
    'Recibo': '#22c55e',
};

type Metric = 'count' | 'value';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function formatAmount(metric: Metric, slice: DocumentTypeSlice) {
    return metric === 'value'
        ? formatCurrency(slice.value)
        : `${slice.count} documento${slice.count !== 1 ? 's' : ''}`;
}

interface DocumentTypeBreakdownProps {
    data: DocumentTypeSlice[];
}

export function DocumentTypeBreakdown({ data }: DocumentTypeBreakdownProps) {
    const [metric, setMetric] = useState<Metric>('count');

    const chartData = useMemo(
        () => data.map((slice) => ({ ...slice, amount: metric === 'value' ? slice.value : slice.count })),
        [data, metric]
    );
    const total = chartData.reduce((acc, d) => acc + d.amount, 0);

    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="space-y-3">
                <div>
                    <CardTitle>Onde seu trabalho está</CardTitle>
                    <CardDescription>Distribuição de documentos por tipo, no período selecionado.</CardDescription>
                </div>
                <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
                    <TabsList className="h-8">
                        <TabsTrigger value="count" className="text-xs px-3">Quantidade</TabsTrigger>
                        <TabsTrigger value="value" className="text-xs px-3">Valor (R$)</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                {total > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="h-[180px] w-[180px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="type"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {chartData.map((slice) => (
                                            <Cell key={slice.type} fill={COLORS[slice.type]} stroke="none" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            {data.map((slice) => (
                                <div key={slice.type} className="flex items-center justify-between gap-3 py-1.5 border-b last:border-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: COLORS[slice.type] }}
                                        />
                                        <span className="text-sm font-medium text-slate-700 truncate">{slice.type}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 shrink-0">
                                        {formatAmount(metric, slice)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-[180px] flex items-center justify-center text-center text-sm text-muted-foreground px-6">
                        Nenhum documento gerado neste período.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
