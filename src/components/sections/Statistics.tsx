import { motion } from "framer-motion";
import { TrendingUp, Users, FileCheck, Clock } from "lucide-react";

const stats = [
  {
    icon: FileCheck,
    value: "50.000+",
    label: "Contratos Gerados",
    description: "Profissionais confiam no GeraDoc",
    color: "primary",
  },
  {
    icon: Users,
    value: "12.000+",
    label: "Usuários Ativos",
    description: "Em todo o Brasil",
    color: "secondary",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Taxa de Satisfação",
    description: "Clientes recomendam",
    color: "accent",
  },
  {
    icon: Clock,
    value: "5 min",
    label: "Tempo Médio",
    description: "Para criar um contrato",
    color: "primary",
  },
];

const getColorClass = (color: string) => {
  switch (color) {
    case "primary":
      return "text-primary bg-primary/10";
    case "secondary":
      return "text-secondary bg-secondary/10";
    case "accent":
      return "text-accent bg-accent/10";
    default:
      return "text-primary bg-primary/10";
  }
};

export function Statistics() {
  return (
    <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display text-background mb-6"
          >
            Números que comprovam nossa eficiência
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-background/70 font-body"
          >
            Milhares de profissionais já transformaram a forma como gerenciam seus contratos
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${getColorClass(stat.color)}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-display text-background mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-display text-background/90 mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-background/60 font-body">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
