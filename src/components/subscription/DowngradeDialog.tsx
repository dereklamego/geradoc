import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { PLANS, PlanId, formatLimit } from '@/lib/plans';

interface DowngradeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentPlan: PlanId;
    targetPlan: PlanId;
    monthlyUsage: number;
    currentPeriodEnd: string; // ISO date
    onConfirm: () => Promise<void> | void;
    confirming?: boolean;
}

const fmtDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return iso;
    }
};

const FeatureRow = ({ label, current, target }: { label: string; current: string; target: string }) => (
    <div className="grid grid-cols-3 gap-3 py-2 text-sm border-b last:border-0">
        <div className="text-muted-foreground">{label}</div>
        <div className="font-medium">{current}</div>
        <div className="font-medium text-amber-600">{target}</div>
    </div>
);

export function DowngradeDialog({
    open,
    onOpenChange,
    currentPlan,
    targetPlan,
    monthlyUsage,
    currentPeriodEnd,
    onConfirm,
    confirming,
}: DowngradeDialogProps) {
    const cur = PLANS[currentPlan];
    const tgt = PLANS[targetPlan];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <DialogTitle>Confirmar mudança de plano</DialogTitle>
                    </div>
                    <DialogDescription>
                        Você está fazendo um downgrade. Confira o que muda antes de confirmar.
                    </DialogDescription>
                </DialogHeader>

                {/* Plan comparison */}
                <div className="rounded-lg border bg-muted/30">
                    <div className="grid grid-cols-3 gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                        <div />
                        <div className="flex items-center gap-1">{cur.label} <span className="text-[10px] text-muted-foreground">(atual)</span></div>
                        <div className="flex items-center gap-1">{tgt.label} <ArrowRight className="h-3 w-3" /></div>
                    </div>
                    <div className="px-3">
                        <FeatureRow label="Documentos" current={formatLimit(cur.monthlyDocuments)} target={formatLimit(tgt.monthlyDocuments)} />
                        <FeatureRow label="Marca d'água" current={cur.watermark ? 'Com marca' : 'Sem marca'} target={tgt.watermark ? 'Com marca' : 'Sem marca'} />
                        <FeatureRow label="Logo personalizada" current={cur.customLogo ? 'Sim' : 'Não'} target={tgt.customLogo ? 'Sim' : 'Não'} />
                        <FeatureRow label="Modelos premium" current={cur.premiumTemplates ? 'Sim' : 'Não'} target={tgt.premiumTemplates ? 'Sim' : 'Não'} />
                    </div>
                </div>

                {/* Current usage */}
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm">
                    <p className="font-medium text-blue-900">Uso neste ciclo</p>
                    <p className="text-blue-700 mt-1">
                        Você já utilizou <strong>{monthlyUsage} documento{monthlyUsage !== 1 ? 's' : ''}</strong>.
                        No novo plano você terá <strong>{formatLimit(tgt.monthlyDocuments)}</strong>.
                    </p>
                </div>

                {/* Application rule + date */}
                <div className="rounded-lg bg-slate-50 border p-3 text-sm flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-slate-600 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-slate-900">A mudança será aplicada no próximo ciclo</p>
                        <p className="text-slate-600 mt-1">
                            Seu plano <strong>{cur.label}</strong> permanece ativo até <strong>{fmtDate(currentPeriodEnd)}</strong>.
                        </p>
                    </div>
                </div>

                {/* Impact warning */}
                {tgt.monthlyDocuments !== null && (cur.monthlyDocuments === null || (tgt.monthlyDocuments < cur.monthlyDocuments)) && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                        ⚠️ Após a mudança, você poderá gerar menos documentos por mês.
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={confirming}>
                        Manter plano atual
                    </Button>
                    <Button
                        variant="default"
                        onClick={async () => { await onConfirm(); }}
                        disabled={confirming}
                    >
                        {confirming ? 'Agendando...' : 'Confirmar downgrade'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
