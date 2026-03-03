import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import logoGeradoc from "@/assets/logo-geradoc.png";

const benefits = [
  "Economize até 30% com planos anuais",
  "Cancele quando quiser, sem multa",
  "Suporte prioritário incluído",
  "Acesso a novos modelos em primeira mão",
];

export default function Subscription() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.img
                src={logoGeradoc}
                alt="GeraDoc"
                className="h-20 w-auto mx-auto mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-sm font-medium font-display text-secondary mb-6"
              >
                <Zap className="w-4 h-4" />
                Escolha seu plano
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-6"
              >
                Invista na profissionalização do seu negócio
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground mb-8 font-body"
              >
                Contratos profissionais passam mais credibilidade e ajudam você a
                fechar mais negócios. Escolha o plano que combina com você.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground font-body"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {benefit}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Component */}
        <Pricing />

        {/* FAQ Preview */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-display text-foreground text-center mb-12">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Posso cancelar a qualquer momento?",
                    a: "Sim! Você pode cancelar sua assinatura quando quiser, sem multa ou taxas adicionais. Seu acesso continua até o final do período pago.",
                  },
                  {
                    q: "Os contratos são juridicamente válidos?",
                    a: "Sim, todos os nossos modelos são elaborados seguindo as melhores práticas jurídicas e são válidos para uso profissional.",
                  },
                  {
                    q: "Como funciona a marca d'água no plano gratuito?",
                    a: "No plano gratuito, os PDFs gerados incluem uma pequena marca d'água discreta no rodapé do documento. Nos planos pagos, você recebe documentos limpos.",
                  },
                  {
                    q: "Posso fazer upgrade ou downgrade do meu plano?",
                    a: "Claro! Você pode alterar seu plano a qualquer momento. O valor será ajustado proporcionalmente.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm"
                  >
                    <h3 className="font-display text-foreground mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground font-body">{faq.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
