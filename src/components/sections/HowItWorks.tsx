import { motion } from "framer-motion";
import { ClipboardList, FileEdit, Download } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Escolha o tipo de contrato",
    description:
      "Selecione entre diversos modelos: prestação de serviços, freelancer, parceria, confidencialidade e muito mais.",
    color: "primary",
  },
  {
    icon: FileEdit,
    step: "02",
    title: "Preencha os dados",
    description:
      "Complete as informações do contrato: partes envolvidas, valores, prazos e condições específicas do seu negócio.",
    color: "secondary",
  },
  {
    icon: Download,
    step: "03",
    title: "Baixe seu PDF",
    description:
      "Pronto! Receba seu contrato profissional em PDF, pronto para ser assinado e utilizado imediatamente.",
    color: "accent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const getGradientClass = (color: string) => {
  switch (color) {
    case "primary":
      return "gradient-primary";
    case "secondary":
      return "gradient-secondary";
    case "accent":
      return "gradient-accent";
    default:
      return "gradient-primary";
  }
};

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            Simples e Rápido
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display text-foreground mt-4 mb-6"
          >
            Como funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-body"
          >
            Em apenas 3 passos simples, você tem um contrato profissional pronto para usar.
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 md:gap-10"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border" />
              )}

              <div className="bg-background rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 relative z-10 group">
                {/* Step Number */}
                <span className="absolute -top-3 -right-2 text-6xl font-display font-bold text-muted/20 group-hover:text-primary/10 transition-colors">
                  {step.step}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${getGradientClass(step.color)} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-body">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
