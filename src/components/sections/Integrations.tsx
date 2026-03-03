import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const integrations = [
  { name: "Google Drive", icon: "📁", description: "Armazene seus contratos" },
  { name: "Dropbox", icon: "💧", description: "Sincronize arquivos" },
  { name: "WhatsApp", icon: "💬", description: "Envie direto ao cliente" },
  { name: "DocuSign", icon: "✍️", description: "Assinaturas digitais" },
  { name: "Zapier", icon: "⚡", description: "Automatize processos" },
  { name: "Notion", icon: "📝", description: "Organize projetos" },
  { name: "Slack", icon: "💼", description: "Notificações em tempo real" },
  { name: "Google Sheets", icon: "📊", description: "Exporte dados" },
];

export function Integrations() {
  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="flex-1 max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-semibold text-accent uppercase tracking-wider bg-accent/10 px-4 py-1.5 rounded-full mb-4"
            >
              Integrações
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display text-foreground mt-4 mb-6"
            >
              Conecte com suas ferramentas favoritas
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 font-body"
            >
              O GeraDoc se integra com mais de 300 aplicativos para automatizar seu fluxo de trabalho. 
              Envie contratos, colete assinaturas e organize documentos sem sair da plataforma.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="outline" asChild className="group">
                <Link to="/integracoes" className="gap-2">
                  Ver todas as integrações
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Integrations Grid */}
          <div className="flex-1 w-full max-w-xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-background rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 text-center group cursor-pointer"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {integration.icon}
                  </div>
                  <p className="text-sm font-medium text-foreground font-display mb-1">
                    {integration.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {integration.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
