import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type BillingPeriod = "mensal" | "trimestral" | "anual";

const billingOptions: { value: BillingPeriod; label: string; discount?: string }[] = [
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral", discount: "-15%" },
  { value: "anual", label: "Anual", discount: "-30%" },
];

const plans = [
  {
    name: "Gratuito",
    description: "Para experimentar a plataforma",
    prices: { mensal: 0, trimestral: 0, anual: 0 },
    features: [
      { text: "2 PDFs por mês", included: true },
      { text: "Marca d'água no documento", included: true, negative: true },
      { text: "Modelos básicos", included: true },
      { text: "Suporte por email", included: true },
      { text: "Modelos avançados", included: false },
    ],
    cta: "Começar Grátis",
    variant: "outline" as const,
  },
  {
    name: "Profissional",
    description: "Para profissionais autônomos",
    prices: { mensal: 29.9, trimestral: 25.41, anual: 20.93 },
    popular: true,
    features: [
      { text: "30 PDFs por mês", included: true },
      { text: "Sem marca d'água", included: true },
      { text: "Todos os modelos", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Personalização de logo", included: true },
    ],
    cta: "Assinar Agora",
    variant: "default" as const,
  },
  {
    name: "Empresarial",
    description: "Para equipes e empresas",
    prices: { mensal: 79.9, trimestral: 67.91, anual: 55.93 },
    features: [
      { text: "PDFs ilimitados", included: true },
      { text: "Sem marca d'água", included: true },
      { text: "Todos os modelos + exclusivos", included: true },
      { text: "Suporte 24/7", included: true },
      { text: "Personalização completa", included: true },
    ],
    cta: "Falar com Vendas",
    variant: "secondary" as const,
  },
];

const singlePdfPrice = 9.9;

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("mensal");

  const getBillingMultiplier = (period: BillingPeriod) => {
    switch (period) {
      case "trimestral":
        return 3;
      case "anual":
        return 12;
      default:
        return 1;
    }
  };

  return (
    <section id="planos" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            Planos e Preços
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display text-foreground mt-4 mb-6"
          >
            Escolha o plano ideal para você
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-body"
          >
            Comece gratuitamente ou escolha um plano que atenda suas necessidades
          </motion.p>
        </div>

        {/* Single PDF Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-12 bg-secondary/10 border border-secondary/20 rounded-2xl p-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-2 font-body">
            Precisa de apenas um contrato?
          </p>
          <p className="text-2xl font-display text-foreground">
            R$ {singlePdfPrice.toFixed(2).replace(".", ",")}
            <span className="text-base font-normal text-muted-foreground font-body"> / PDF avulso</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-body">
            Sem assinatura, pague apenas pelo que usar
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex bg-muted rounded-2xl p-1.5 gap-1">
            {billingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setBillingPeriod(option.value)}
                className={cn(
                  "relative px-5 py-2.5 rounded-xl text-sm font-medium font-display transition-all duration-200",
                  billingPeriod === option.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
                {option.discount && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {option.discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative bg-card rounded-2xl border transition-all duration-300",
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10 scale-[1.02] md:scale-105"
                  : "border-border shadow-card hover:shadow-card-hover"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 gradient-primary text-primary-foreground text-sm font-semibold font-display px-4 py-1.5 rounded-full shadow-md">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-display text-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display text-foreground">
                      R$ {plan.prices[billingPeriod].toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-muted-foreground font-body">/mês</span>
                  </div>
                  {billingPeriod !== "mensal" && plan.prices[billingPeriod] > 0 && (
                    <p className="text-sm text-muted-foreground mt-1 font-body">
                      Cobrado R$ {(plan.prices[billingPeriod] * getBillingMultiplier(billingPeriod)).toFixed(2).replace(".", ",")}{" "}
                      {billingPeriod === "trimestral" ? "a cada 3 meses" : "anualmente"}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Button
                  variant={plan.variant}
                  size="lg"
                  className="w-full mb-8"
                  asChild
                >
                  <Link to="/cadastro">{plan.cta}</Link>
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className={cn(
                        "flex items-start gap-3 text-sm font-body",
                        feature.included ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {feature.included ? (
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          feature.negative ? "bg-muted" : "bg-primary/10"
                        )}>
                          <Check
                            className={cn(
                              "w-3 h-3",
                              feature.negative ? "text-muted-foreground" : "text-primary"
                            )}
                          />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={feature.negative ? "text-muted-foreground" : ""}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
