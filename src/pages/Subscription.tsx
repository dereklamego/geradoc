import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/useAppStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type BillingCycle = "monthly" | "quarterly" | "yearly";

const cycleLabels: Record<BillingCycle, string> = {
  monthly: "Mensal",
  quarterly: "Trimestral",
  yearly: "Anual",
};

const cycleDiscount: Record<BillingCycle, string | null> = {
  monthly: null,
  quarterly: "Economize 10%",
  yearly: "Economize 20%",
};

// Prices per cycle (display only — real price comes from Stripe)
const planPrices: Record<string, Record<BillingCycle, string>> = {
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

const Subscription = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const plans = [
    {
      id: "FREE",
      name: "Gratuito",
      description: "Para quem está começando",
      price: "Grátis",
      period: null,
      icon: null,
      features: [
        "2 documentos por mês",
        "Marca d'água GeraDoc",
        "Modelos básicos",
      ],
      current: user?.plan === "free",
      action: user?.plan === "free" ? "Plano Atual" : "Fazer Downgrade",
      popular: false,
    },
    {
      id: "PROFISSIONAL",
      name: "Profissional",
      description: "Ideal para autônomos e freelancers",
      price: planPrices.PROFISSIONAL[billingCycle],
      period: "/mês",
      icon: Zap,
      features: [
        "30 documentos por mês",
        "Sem marca d'água",
        "Todos os modelos",
        "Personalização de logo",
        "Suporte prioritário",
      ],
      popular: true,
      current: user?.plan === "profissional",
      action: user?.plan === "profissional" ? "Plano Ativo" : "Assinar agora",
    },
    {
      id: "EMPRESARIAL",
      name: "Empresarial",
      description: "Para pequenas empresas e equipes",
      price: planPrices.EMPRESARIAL[billingCycle],
      period: "/mês",
      icon: Building2,
      features: [
        "Documentos ilimitados",
        "Sem marca d'água",
        "Todos os modelos",
        "Múltiplos usuários",
        "Relatórios avançados",
        "Gerente de conta dedicado",
      ],
      popular: false,
      current: user?.plan === "empresarial",
      action: user?.plan === "empresarial" ? "Plano Ativo" : "Assinar agora",
    },
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === "FREE") return;
    navigate("/app/pagamento", { state: { plan: planId, billingCycle } });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Minha Assinatura</h2>
        <p className="text-muted-foreground mt-1">
          Veja seu plano atual e as opções para crescer seu negócio.
        </p>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center bg-muted rounded-xl p-1 gap-1">
          {(["monthly", "quarterly", "yearly"] as BillingCycle[]).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                billingCycle === cycle
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cycleLabels[cycle]}
              {cycleDiscount[cycle] && billingCycle === cycle && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {cycleDiscount[cycle]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col border-2 transition-all duration-300 ${
              plan.popular
                ? "border-primary shadow-lg md:-translate-y-2"
                : "border-border"
            } ${plan.current ? "bg-muted/30" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                <Sparkles className="h-3 w-3" /> Mais Escolhido
              </div>
            )}

            <CardHeader className="text-center pt-8">
              {plan.icon && (
                <div className="mx-auto mb-2 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <plan.icon className="h-5 w-5 text-primary" />
                </div>
              )}
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm mt-1">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm font-normal">{plan.period}</span>
                )}
              </div>
              {billingCycle !== "monthly" && plan.id !== "FREE" && (
                <Badge variant="outline" className="mx-auto mt-2 text-green-600 border-green-300 bg-green-50 text-xs">
                  {cycleDiscount[billingCycle]}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="flex flex-col flex-1 space-y-6">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.current}
                className={`w-full font-bold h-11 ${plan.popular ? "shadow-md hover:shadow-lg" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
