import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Marina Costa",
    role: "Designer Freelancer",
    content:
      "Finalmente consigo enviar contratos profissionais para meus clientes. Antes usava modelos genéricos e ficava insegura. Agora fecho mais projetos!",
    rating: 5,
    avatar: "MC",
    color: "primary",
  },
  {
    name: "Ricardo Almeida",
    role: "Desenvolvedor Web",
    content:
      "O que mais gosto é a praticidade. Em 5 minutos tenho um contrato pronto. Economizo tempo e passo mais segurança para os clientes.",
    rating: 5,
    avatar: "RA",
    color: "secondary",
  },
  {
    name: "Juliana Ferreira",
    role: "Consultora de Marketing",
    content:
      "Recomendo para todo profissional autônomo. Os modelos são bem completos e o suporte é excelente. Vale muito o investimento.",
    rating: 5,
    avatar: "JF",
    color: "accent",
  },
];

const getAvatarGradient = (color: string) => {
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

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            Depoimentos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display text-foreground mt-4 mb-6"
          >
            O que nossos clientes dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-body"
          >
            Milhares de profissionais autônomos já transformaram a forma como fecham negócios
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6 font-body">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${getAvatarGradient(testimonial.color)} flex items-center justify-center text-white font-display font-bold shadow-sm`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground font-body">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
