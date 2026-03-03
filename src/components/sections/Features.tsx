import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  FileText, 
  Zap, 
  Target, 
  BarChart3, 
  Shield, 
  Clock 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Automação de Contratos",
    description: "Gere contratos profissionais automaticamente com nossos modelos inteligentes. Economize horas de trabalho e elimine erros manuais.",
    cta: "Explore a automação",
    href: "/gerador",
    color: "primary",
    image: "contract",
  },
  {
    icon: Zap,
    title: "Inteligência Artificial",
    description: "Nossa IA analisa seu negócio e sugere as melhores cláusulas para seus contratos. Personalização inteligente em segundos.",
    cta: "Conheça a IA GeraDoc",
    href: "/ia",
    color: "secondary",
    image: "ai",
  },
  {
    icon: Target,
    title: "Segmentação Avançada",
    description: "Organize seus contratos por cliente, tipo de serviço ou período. Encontre qualquer documento em segundos.",
    cta: "Veja como organizar",
    href: "/organizacao",
    color: "accent",
    image: "segment",
  },
  {
    icon: BarChart3,
    title: "Análises e Relatórios",
    description: "Acompanhe métricas importantes: contratos fechados, valores totais, clientes ativos e muito mais em dashboards visuais.",
    cta: "Explorar relatórios",
    href: "/relatorios",
    color: "primary",
    image: "analytics",
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case "primary":
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        gradient: "gradient-primary",
      };
    case "secondary":
      return {
        bg: "bg-secondary/10",
        text: "text-secondary",
        gradient: "gradient-secondary",
      };
    case "accent":
      return {
        bg: "bg-accent/10",
        text: "text-accent",
        gradient: "gradient-accent",
      };
    default:
      return {
        bg: "bg-primary/10",
        text: "text-primary",
        gradient: "gradient-primary",
      };
  }
};

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            Funcionalidades
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mt-4 mb-6"
          >
            Tudo que você precisa para gerenciar contratos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-body"
          >
            Ferramentas poderosas para criar, organizar e acompanhar todos os seus contratos em um só lugar.
          </motion.p>
        </div>

        {/* Features Blocks */}
        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                {/* Content */}
                <div className="flex-1 max-w-xl">
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 font-body leading-relaxed">
                    {feature.description}
                  </p>
                  <Button variant="outline" asChild className="group">
                    <Link to={feature.href} className="gap-2">
                      {feature.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full max-w-lg">
                  <div className={`relative rounded-2xl overflow-hidden shadow-card-hover border border-border/50 bg-card`}>
                    <div className={`absolute inset-0 ${colors.gradient} opacity-5`} />
                    <div className="p-8 md:p-10">
                      {/* Simulated UI */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-10 h-10 rounded-xl ${colors.gradient} flex items-center justify-center`}>
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="h-4 bg-muted rounded-lg w-32" />
                        </div>
                        <div className="h-3 bg-muted/70 rounded w-full" />
                        <div className="h-3 bg-muted/70 rounded w-5/6" />
                        <div className="h-3 bg-muted/70 rounded w-4/6" />
                        <div className="flex gap-3 mt-6">
                          <div className={`h-10 ${colors.gradient} rounded-xl w-28`} />
                          <div className="h-10 bg-muted rounded-xl w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
