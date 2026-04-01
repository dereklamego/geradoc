import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import logoGeradoc from "@/assets/logo-geradoc.png";

export function Hero() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Mais de 50.000 contratos gerados
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-6 leading-tight"
            >
              Plataforma de{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">contratos</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 -z-0 rounded" />
              </span>
              {" "}para profissionais autônomos
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 font-body leading-relaxed"
            >
              Gere contratos profissionais em minutos, automatize seu fluxo de trabalho 
              e feche mais negócios com segurança jurídica. Tudo em uma única plataforma.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Button size="xl" asChild>
                <Link to="/cadastro" className="gap-2">
                  Cadastre-se — é grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="gap-2">
                <Link to="/#como-funciona">
                  <Play className="w-5 h-5" />
                  Veja como funciona
                </Link>
              </Button>
            </motion.div>

            {/* Trust Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-muted-foreground font-body"
            >
              ✓ Sem cartão de crédito &nbsp; ✓ Cancele quando quiser &nbsp; ✓ 3 contratos grátis/mês
            </motion.p>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 w-full max-w-xl lg:max-w-none"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-3xl shadow-card-hover border border-border/50 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                  <span className="ml-4 text-sm text-muted-foreground font-body">GeraDoc</span>
                </div>
                <div className="p-8 md:p-10">
                  {/* Simulated Interface */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={logoGeradoc} 
                        alt="GeraDoc" 
                        className="h-12 w-auto"
                      />
                      <div className="h-4 bg-muted rounded-lg flex-1 max-w-32" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-12 bg-muted rounded-xl" />
                      <div className="h-12 bg-muted rounded-xl" />
                    </div>
                    <div className="h-20 bg-muted/70 rounded-xl" />
                    <div className="flex gap-3">
                      <div className="h-12 gradient-primary rounded-xl flex-1" />
                      <div className="h-12 bg-muted rounded-xl w-24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-card rounded-2xl shadow-lg p-4 border border-border/50 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white text-lg">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-display">Contrato gerado!</p>
                    <p className="text-xs text-muted-foreground font-body">Pronto para download</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-lg p-4 border border-border/50 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center text-white text-lg">
                    📄
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground font-display">+127 modelos</p>
                    <p className="text-xs text-muted-foreground font-body">prontos para usar</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
