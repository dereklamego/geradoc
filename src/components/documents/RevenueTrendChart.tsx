import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MonthlyRevenuePoint } from '@/lib/dashboard-metrics';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-white px-3 py-2 shadow-sm text-sm">
            <p className="text-muted-foreground capitalize">{label}</p>
            <p className="font-semibold text-blue-700">{formatCurrency(payload[0].value)}</p>
        </div>
    );
}

export function RevenueTrendChart({ data }: { data: MonthlyRevenuePoint[] }) {
    const hasRevenue = data.some((p) => p.total > 0);

    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader>
                <CardTitle>Faturamento ao longo do tempo</CardTitle>
                <CardDescription>Recibos gerados nos últimos {data.length} meses.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasRevenue ? (
                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="label"
                                    className="capitalize"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickFormatter={(v) => formatCurrency(v)}
                                    width={72}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fill="url(#revenueFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[220px] flex items-center justify-center text-center text-sm text-muted-foreground px-6">
                        Gere seu primeiro Recibo para ver a evolução do seu faturamento aqui.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
