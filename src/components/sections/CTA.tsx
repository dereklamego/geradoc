import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import logoGeradoc from "@/assets/logo-geradoc.png";

const benefits = [
  "3 contratos grátis por mês",
  "Sem cartão de crédito",
  "Cancele quando quiser",
];

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Mascot */}
          <motion.img
            src={logoGeradoc}
            alt="GeraDoc"
            className="h-24 w-auto mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-6 text-balance">
            Pronto para profissionalizar seus contratos?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-body">
            Comece agora gratuitamente. Sem cartão de crédito, sem compromisso.
            Crie seu primeiro contrato em menos de 5 minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="xl" asChild>
              <Link to="/gerador" className="gap-2">
                Criar Meu Primeiro Contrato
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium font-body">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
