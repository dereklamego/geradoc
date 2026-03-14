import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Gratuito",
      description: "Para quem está começando",
      price: "Grátis",
      features: [
        "2 documentos por mês",
        "Marca d'água GeraDoc",
        "Modelos básicos",
      ],
      current: user?.plan === 'free',
      action: "Seu plano atual",
      variant: "outline" as const,
    },
    {
      name: "Profissional",
      description: "Ideal para autônomos",
      price: "R$ 29,90",
      period: "/mês",
      features: [
        "30 documentos por mês",
        "Sem marca d'água",
        "Todos os modelos",
        "Personalização de logo",
      ],
      popular: true,
      current: user?.plan === 'premium',
      action: user?.plan === 'premium' ? "Plano Ativo" : "Assinar agora",
      variant: "default" as const,
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === 'Gratuito') return;
    navigate('/app/pagamento');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Minha Assinatura</h2>
        <p className="text-muted-foreground mt-1">Veja seu plano atual e as opções para crescer seu negócio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative border-2 transition-all duration-300 ${plan.popular ? "border-primary shadow-lg scale-105" : "border-slate-100"
              } ${plan.current ? "bg-slate-50/50" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="h-3 w-3" /> Mais Escolhido
              </div>
            )}

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm font-normal">{plan.period}</span>}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.current}
                className={`w-full font-bold h-11 ${plan.popular ? "shadow-md hover:shadow-lg" : ""}`}
                variant={plan.variant}
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
