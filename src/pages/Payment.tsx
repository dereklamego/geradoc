import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { useCreateCheckout } from "@/hooks/use-api";
import { toast } from "sonner";

const cycleLabels: Record<string, string> = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    yearly: "Anual",
};

const planLabels: Record<string, string> = {
    PROFISSIONAL: "Profissional",
    EMPRESARIAL: "Empresarial",
};

const planPrices: Record<string, Record<string, string>> = {
    PROFISSIONAL: {
        monthly: "R$ 29,90",
        quarterly: "R$ 26,90",
        yearly: "R$ 23,90",
    },
    EMPRESARIAL: {
        monthly: "R$ 79,90",
        quarterly: "R$ 71,90",
        yearly: "R$ 63,90",
    },
};

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Receive plan and billingCycle from Subscription page navigation
    const plan: string = location.state?.plan || "PROFISSIONAL";
    const billingCycle: string = location.state?.billingCycle || "monthly";

    const createCheckout = useCreateCheckout();

    const handleCheckout = () => {
        createCheckout.mutate(
            { plan, billingCycle },
            {
                onError: (error: any) => {
                    toast.error(error?.message || "Erro ao iniciar pagamento. Tente novamente.");
                },
            }
        );
    };

    const displayPrice = planPrices[plan]?.[billingCycle] || "—";

    return (
        <div className="max-w-lg mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Confirmar Assinatura</h2>
                    <p className="text-muted-foreground mt-1">Você será redirecionado ao Stripe Checkout para pagar com segurança.</p>
                </div>
            </div>

            {/* Order Summary Card */}
            <Card className="border-2 border-primary/20 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Resumo do Pedido
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Plano</span>
                        <span className="font-semibold">{planLabels[plan] ?? plan}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Ciclo</span>
                        <span className="font-semibold">{cycleLabels[billingCycle] ?? billingCycle}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">{displayPrice}<span className="text-sm text-muted-foreground font-normal">/mês</span></span>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 pt-2">
                    <Button
                        onClick={handleCheckout}
                        disabled={createCheckout.isPending}
                        className="w-full h-12 font-bold text-base shadow-md hover:shadow-lg"
                    >
                        <CreditCard className="h-5 w-5 mr-2" />
                        {createCheckout.isPending ? "Redirecionando..." : "Pagar com Stripe"}
                    </Button>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Pagamento 100% seguro via Stripe. Cancele quando quiser.
                    </div>
                </CardFooter>
            </Card>

            {/* What happens next */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground text-sm">O que acontece a seguir?</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Você será redirecionado ao checkout seguro do Stripe.</li>
                    <li>Após o pagamento, seu plano é ativado imediatamente.</li>
                    <li>Você receberá uma nota fiscal por e-mail automaticamente.</li>
                </ol>
            </div>
        </div>
    );
};

export default Payment;
