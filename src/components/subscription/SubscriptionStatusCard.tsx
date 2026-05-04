import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Calendar, CreditCard, Sparkles, Zap, X, RefreshCw } from 'lucide-react';
import { useUser, useAuthActions } from '@/store/useAppStore';
import { PLANS, toPlanId, PlanId } from '@/lib/plans';
import { formatLongDate, daysUntil } from '@/lib/dates';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
    onUpgradeClick?: () => void;
    onChangePlanClick?: () => void;
    showPlanCTA?: boolean; // shows "Mudar de plano" link
}

export function SubscriptionStatusCard({ onUpgradeClick, onChangePlanClick, showPlanCTA = true }: Props) {
    const user = useUser();
    const { fetchMe } = useAuthActions();
    const navigate = useNavigate();
    const [cancelling, setCancelling] = useState(false);
    const [cancellingSub, setCancellingSub] = useState(false);
    const [openingPortal, setOpeningPortal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<{ brand: string; last4: string; expMonth: number; expYear: number } | null>(null);
    const [loadingPM, setLoadingPM] = useState(false);

    useEffect(() => {
        if (!user || user.plan === 'free') return;
        let cancelled = false;
        setLoadingPM(true);
        api.payments.getMethod()
            .then(({ paymentMethod }) => { if (!cancelled) setPaymentMethod(paymentMethod); })
            .catch(() => { /* silent — leave as null */ })
            .finally(() => { if (!cancelled) setLoadingPM(false); });
        return () => { cancelled = true; };
    }, [user?.plan]);

    if (!user) return null;

    const currentPlanId = toPlanId(user.plan);
    const planInfo = PLANS[currentPlanId];
    const billing = user.billing;

    const usage = billing?.monthlyUsage ?? 0;
    const limit = billing?.monthlyLimit !== undefined
        ? billing.monthlyLimit
        : planInfo.monthlyDocuments;
    const isUnlimited = limit === null;
    const usagePct = !isUnlimited && limit > 0 ? Math.min(100, Math.round((usage / limit) * 100)) : 0;
    const isNearLimit = !isUnlimited && usagePct >= 80 && usagePct < 100;
    const isAtLimit = !isUnlimited && usage >= (limit ?? 0);

    const scheduledPlan = billing?.scheduledPlan;
    const scheduledAt = billing?.scheduledPlanChangeAt;
    const hasScheduled = !!scheduledPlan && !!scheduledAt;
    const daysToChange = hasScheduled ? daysUntil(scheduledAt!) : null;

    const subscription = user.subscription;
    const isCancelling = subscription?.cancelAtPeriodEnd === true;
    const cancelDate = subscription?.currentPeriodEnd;
    const hasActiveStripeSub = !!subscription && subscription.status === 'active' && !isCancelling;

    const handleCancelScheduled = async () => {
        setCancelling(true);
        try {
            await api.auth.cancelScheduledPlan();
            await fetchMe();
            toast.success('Mudança de plano cancelada.');
        } catch (err: any) {
            toast.error(err?.message || 'Erro ao cancelar.');
        } finally {
            setCancelling(false);
        }
    };

    const handleUpgrade = () => {
        if (onUpgradeClick) return onUpgradeClick();
        navigate('/app/assinatura');
    };

    const handleChangePlan = () => {
        if (onChangePlanClick) return onChangePlanClick();
        navigate('/app/assinatura');
    };

    const handleCancelSubscription = async () => {
        if (!confirm('Sua assinatura permanecerá ativa até o fim do ciclo atual. Deseja continuar?')) return;
        setCancellingSub(true);
        try {
            await api.payments.cancelSubscription();
            await fetchMe();
            toast.success('Assinatura cancelada. Você terá acesso até o fim do ciclo.');
        } catch (err: any) {
            toast.error(err?.body?.message || err?.message || 'Erro ao cancelar assinatura.');
        } finally {
            setCancellingSub(false);
        }
    };

    const handleManagePayment = async () => {
        setOpeningPortal(true);
        try {
            const { url } = await api.payments.createPortal();
            window.location.href = url;
        } catch (err: any) {
            const msg = err?.body?.message || err?.message || 'Erro ao abrir portal de pagamento.';
            // Friendly hint when the portal isn't configured in Stripe Dashboard
            if (/portal/i.test(msg) && /(not.*configur|configuration)/i.test(msg)) {
                toast.error('O Customer Portal não está configurado no Stripe Dashboard. Acesse Settings → Customer Portal e ative.');
            } else {
                toast.error(msg);
            }
            setOpeningPortal(false);
        }
    };

    const brandLabel: Record<string, string> = {
        visa: 'Visa',
        mastercard: 'Mastercard',
        amex: 'American Express',
        elo: 'Elo',
        hipercard: 'Hipercard',
        discover: 'Discover',
        diners: 'Diners',
    };

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "h-11 w-11 rounded-xl flex items-center justify-center",
                            currentPlanId === 'EMPRESARIAL' ? 'bg-purple-100' :
                            currentPlanId === 'PROFISSIONAL' ? 'bg-primary/10' : 'bg-slate-100'
                        )}>
                            {currentPlanId === 'EMPRESARIAL' ? <Sparkles className="h-5 w-5 text-purple-600" /> :
                             currentPlanId === 'PROFISSIONAL' ? <Zap className="h-5 w-5 text-primary" /> :
                             <CreditCard className="h-5 w-5 text-slate-500" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">Plano {planInfo.label}</CardTitle>
                                {isCancelling ? (
                                    <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 font-medium">
                                        Cancelando
                                    </Badge>
                                ) : hasScheduled ? (
                                    <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 font-medium">
                                        Mudança agendada
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 font-medium">
                                        Ativo
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {currentPlanId === 'FREE' ? 'Você está no plano gratuito' : 'Sua assinatura está em dia'}
                            </p>
                        </div>
                    </div>
                    {showPlanCTA && (
                        <Button variant="outline" size="sm" onClick={handleChangePlan}>
                            Mudar de plano
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Cancellation banner */}
                {isCancelling && cancelDate && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                        <div className="flex-1 text-sm">
                            <p className="font-medium text-red-900">
                                Sua assinatura será cancelada em {formatLongDate(cancelDate)}
                            </p>
                            <p className="text-red-700 text-xs mt-1">
                                Você terá acesso aos benefícios até essa data.
                            </p>
                        </div>
                    </div>
                )}

                {/* Scheduled change banner */}
                {!isCancelling && hasScheduled && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-3">
                        <RefreshCw className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                        <div className="flex-1 text-sm">
                            <p className="font-medium text-amber-900">
                                Seu plano será alterado para <strong>{PLANS[scheduledPlan!].label}</strong> em {formatLongDate(scheduledAt)}
                            </p>
                            <p className="text-amber-700 text-xs mt-1">
                                {daysToChange === 0 ? 'A mudança ocorre hoje no fim do ciclo.' :
                                 daysToChange === 1 ? 'A mudança ocorre amanhã.' :
                                 `Faltam ${daysToChange} dias.`}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-amber-700 hover:bg-amber-100"
                            onClick={handleCancelScheduled}
                            disabled={cancelling}
                        >
                            <X className="h-3 w-3 mr-1" />
                            {cancelling ? 'Cancelando...' : 'Cancelar mudança'}
                        </Button>
                    </div>
                )}

                {/* Usage */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Uso de documentos no ciclo atual</span>
                        <span className={cn(
                            "text-sm font-bold",
                            isAtLimit && "text-red-600",
                            isNearLimit && "text-amber-600",
                        )}>
                            {usage} {isUnlimited ? '' : `de ${limit}`}
                        </span>
                    </div>
                    {isUnlimited ? (
                        <div className="rounded-md bg-purple-50 border border-purple-100 px-3 py-2 text-xs text-purple-700 font-medium flex items-center gap-2">
                            <Sparkles className="h-3 w-3" />
                            Documentos ilimitados neste plano
                        </div>
                    ) : (
                        <>
                            <Progress value={usagePct} className={cn(
                                "h-2",
                                isAtLimit && "[&>div]:bg-red-500",
                                isNearLimit && "[&>div]:bg-amber-500",
                            )} />
                            {isAtLimit && (
                                <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-2 text-xs text-red-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        <span>Você atingiu o limite do plano</span>
                                    </div>
                                    <Button size="sm" className="h-7 text-xs" onClick={handleUpgrade}>
                                        Fazer upgrade
                                    </Button>
                                </div>
                            )}
                            {isNearLimit && (
                                <div className="mt-2 rounded-md bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        <span>Você está perto do limite ({usagePct}% usado)</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-100" onClick={handleUpgrade}>
                                        Fazer upgrade
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Cycle dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-md bg-slate-50 border p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                            <Calendar className="h-3 w-3" /> Início do ciclo
                        </p>
                        <p className="font-medium">{formatLongDate(billing?.currentPeriodStart)}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 border p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                            <Calendar className="h-3 w-3" /> Término do ciclo
                        </p>
                        <p className="font-medium">{formatLongDate(billing?.currentPeriodEnd)}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 border p-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                            <RefreshCw className="h-3 w-3" /> {hasScheduled ? 'Aplicação da mudança' : 'Próxima renovação'}
                        </p>
                        <p className="font-medium">{formatLongDate(hasScheduled ? scheduledAt : billing?.currentPeriodEnd)}</p>
                    </div>
                </div>

                {/* Payment method */}
                <div className="rounded-md bg-slate-50 border p-3 flex items-start gap-3">
                    <CreditCard className="h-4 w-4 mt-0.5 text-slate-500" />
                    <div className="flex-1 text-sm">
                        <p className="text-xs text-muted-foreground mb-0.5">Método de pagamento</p>
                        {currentPlanId === 'FREE' ? (
                            <p className="text-muted-foreground">Não aplicável no plano gratuito.</p>
                        ) : loadingPM ? (
                            <p className="text-muted-foreground">Carregando…</p>
                        ) : paymentMethod ? (
                            <p className="font-medium">
                                {brandLabel[paymentMethod.brand] ?? paymentMethod.brand.toUpperCase()} •••• {paymentMethod.last4}
                                <span className="text-xs text-muted-foreground font-normal ml-2">
                                    válido até {String(paymentMethod.expMonth).padStart(2, '0')}/{String(paymentMethod.expYear).slice(-2)}
                                </span>
                            </p>
                        ) : (
                            <p className="text-muted-foreground">Nenhum cartão configurado.</p>
                        )}
                    </div>
                    {currentPlanId !== 'FREE' && (
                        <Button
                            size="sm"
                            variant={paymentMethod ? 'ghost' : 'default'}
                            className="h-7 text-xs"
                            onClick={handleManagePayment}
                            disabled={openingPortal}
                        >
                            {openingPortal ? 'Abrindo…' : paymentMethod ? 'Gerenciar' : 'Adicionar cartão'}
                        </Button>
                    )}
                </div>

                {/* Cancel subscription */}
                {hasActiveStripeSub && (
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleCancelSubscription}
                            disabled={cancellingSub}
                        >
                            {cancellingSub ? 'Cancelando…' : 'Cancelar assinatura'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
