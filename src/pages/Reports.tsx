import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wallet, Hourglass } from 'lucide-react';
import { useDocuments } from '@/hooks/use-api';
import { RevenueTrendChart } from '@/components/documents/RevenueTrendChart';
import { DocumentTypeBreakdown } from '@/components/documents/DocumentTypeBreakdown';
import { PeriodFilter } from '@/components/documents/PeriodFilter';
import {
    buildMonthlyRevenue,
    buildDocumentTypeBreakdown,
    calculateRevenueOutlook,
    buildYearOptions,
    currentPeriod,
    PeriodFilter as PeriodFilterValue,
} from '@/lib/dashboard-metrics';

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

const Reports = () => {
    const user = useUser();
    const [period, setPeriod] = useState<PeriodFilterValue>(currentPeriod());
    // limit=200 so the revenue trend chart (last 6 months) has enough history to work with
    const { data: docsResponse, isLoading } = useDocuments({ limit: 200 });
    const documents = docsResponse?.items || [];

    const yearOptions = useMemo(() => buildYearOptions(documents), [documents]);

    if (user?.plan !== 'empresarial') {
        return <Navigate to="/app/assinatura" replace />;
    }

    const monthlyRevenue = buildMonthlyRevenue(documents);
    const documentTypeBreakdown = buildDocumentTypeBreakdown(documents, period);
    const { awaitingPayment, forecast } = calculateRevenueOutlook(documents, period);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
                    <p className="text-muted-foreground mt-1">Como está o seu negócio, de forma simples.</p>
                </div>
                <PeriodFilter value={period} onChange={setPeriod} years={yearOptions} />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-none shadow-sm bg-emerald-50/50">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-md">
                                    <Wallet className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-900">
                                        Você tem <span className="font-bold">R$ {formatCurrency(awaitingPayment)}</span> aguardando pagamento.
                                    </p>
                                    <p className="text-xs text-emerald-700/80">Soma de Ordens de Serviço já aceitas, ainda não finalizadas, no período selecionado.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-blue-50/50">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-md">
                                    <Hourglass className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-900">
                                        Você tem <span className="font-bold">R$ {formatCurrency(forecast)}</span> previsto em orçamentos.
                                    </p>
                                    <p className="text-xs text-blue-700/80">Soma de orçamentos ainda não aprovados pelo cliente, no período selecionado.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueTrendChart data={monthlyRevenue} />
                        <DocumentTypeBreakdown data={documentTypeBreakdown} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;
