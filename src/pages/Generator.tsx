import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  FileText,
  Briefcase,
  Users,
  ShieldCheck,
  Handshake,
  FileCheck,
  ChevronRight,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const contractTypes = [
  {
    id: "prestacao-servicos",
    icon: Briefcase,
    title: "Prestação de Serviços",
    description: "Para freelancers, consultores e prestadores de serviço em geral",
    popular: true,
    color: "primary",
  },
  {
    id: "parceria",
    icon: Handshake,
    title: "Contrato de Parceria",
    description: "Para parcerias comerciais, co-criação e colaborações",
    color: "secondary",
  },
  {
    id: "confidencialidade",
    icon: ShieldCheck,
    title: "NDA / Confidencialidade",
    description: "Proteja informações sensíveis e segredos de negócio",
    color: "accent",
  },
  {
    id: "trabalho-freelancer",
    icon: Users,
    title: "Contrato Freelancer",
    description: "Modelo específico para trabalhos pontuais e projetos",
    color: "primary",
  },
  {
    id: "termo-uso",
    icon: FileCheck,
    title: "Termo de Uso",
    description: "Para sites, aplicativos e plataformas digitais",
    color: "secondary",
  },
  {
    id: "outros",
    icon: FileText,
    title: "Outros Modelos",
    description: "Explore mais opções de contratos disponíveis",
    color: "accent",
  },
];

type Step = "select" | "form" | "preview";

const getIconBg = (color: string) => {
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

export default function Generator() {
  const [step, setStep] = useState<Step>("select");
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  const handleSelectContract = (id: string) => {
    setSelectedContract(id);
    setStep("form");
  };

  const handleBack = () => {
    if (step === "form") {
      setStep("select");
      setSelectedContract(null);
    } else if (step === "preview") {
      setStep("form");
    }
  };

  const selectedContractData = contractTypes.find((c) => c.id === selectedContract);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-display text-foreground mb-4"
            >
              {step === "select" && "Escolha o tipo de contrato"}
              {step === "form" && selectedContractData?.title}
              {step === "preview" && "Visualização do Contrato"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-body"
            >
              {step === "select" &&
                "Selecione o modelo que melhor atende sua necessidade"}
              {step === "form" &&
                "Preencha os dados para gerar seu contrato personalizado"}
              {step === "preview" && "Revise seu contrato antes de baixar"}
            </motion.p>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-4">
              {["Modelo", "Dados", "PDF"].map((label, index) => {
                const stepIndex =
                  step === "select" ? 0 : step === "form" ? 1 : 2;
                const isActive = index <= stepIndex;
                const isCurrent = index === stepIndex;

                return (
                  <div key={label} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold transition-all ${
                          isActive
                            ? "gradient-primary text-white shadow-md"
                            : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-sm font-medium font-display ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-16 h-0.5 mb-6 rounded-full ${
                          index < stepIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back Button */}
          {step !== "select" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </motion.div>
          )}

          {/* Step Content */}
          {step === "select" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {contractTypes.map((contract, index) => (
                <motion.button
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectContract(contract.id)}
                  className="relative bg-card rounded-2xl p-6 text-left border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:border-primary/30 group"
                >
                  {contract.popular && (
                    <span className="absolute top-4 right-4 text-xs font-semibold font-display text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl ${getIconBg(contract.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    <contract.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-display text-foreground mb-2">
                    {contract.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-body">
                    {contract.description}
                  </p>
                  <div className="flex items-center text-sm font-medium font-display text-primary">
                    Selecionar
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-card rounded-2xl border border-border/50 shadow-card p-8">
                <form className="space-y-6">
                  {/* Contratante Section */}
                  <div>
                    <h3 className="text-lg font-display text-foreground mb-4">
                      Dados do Contratante
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium font-display text-foreground mb-2">
                          Nome Completo / Razão Social
                        </label>
                        <input
                          type="text"
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium font-display text-foreground mb-2">
                          CPF / CNPJ
                        </label>
                        <input
                          type="text"
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contratado Section */}
                  <div>
                    <h3 className="text-lg font-display text-foreground mb-4">
                      Dados do Contratado
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium font-display text-foreground mb-2">
                          Nome Completo / Razão Social
                        </label>
                        <input
                          type="text"
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                          placeholder="Digite aqui..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium font-display text-foreground mb-2">
                          CPF / CNPJ
                        </label>
                        <input
                          type="text"
                          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h3 className="text-lg font-display text-foreground mb-4">
                      Detalhes do Serviço
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium font-display text-foreground mb-2">
                          Descrição do Serviço
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-body"
                          placeholder="Descreva detalhadamente o serviço a ser prestado..."
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium font-display text-foreground mb-2">
                            Valor Total (R$)
                          </label>
                          <input
                            type="text"
                            className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                            placeholder="0,00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium font-display text-foreground mb-2">
                            Prazo de Execução
                          </label>
                          <input
                            type="text"
                            className="w-full h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                            placeholder="Ex: 30 dias"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      size="lg"
                      className="w-full"
                      onClick={() => setStep("preview")}
                    >
                      Gerar Contrato
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === "preview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Document Preview */}
                <div className="lg:col-span-2">
                  <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
                    <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center justify-between">
                      <span className="font-display font-medium text-foreground">
                        Prévia do Documento
                      </span>
                      <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-1 rounded-full font-display">
                        PDF • 2 páginas
                      </span>
                    </div>
                    <div className="p-8 bg-background min-h-[500px]">
                      {/* Mock Document Content */}
                      <div className="max-w-lg mx-auto">
                        <h2 className="text-xl font-display text-center text-foreground mb-8">
                          CONTRATO DE PRESTAÇÃO DE SERVIÇOS
                        </h2>
                        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-body">
                          <p>
                            <strong className="text-foreground font-display">CLÁUSULA PRIMEIRA – DAS PARTES</strong>
                          </p>
                          <p>
                            De um lado, como <strong>CONTRATANTE</strong>, [Nome do Contratante], inscrito no CPF/CNPJ sob o nº [Número], doravante denominado simplesmente CONTRATANTE.
                          </p>
                          <p>
                            De outro lado, como <strong>CONTRATADO</strong>, [Nome do Contratado], inscrito no CPF/CNPJ sob o nº [Número], doravante denominado simplesmente CONTRATADO.
                          </p>
                          <p className="pt-4">
                            <strong className="text-foreground font-display">CLÁUSULA SEGUNDA – DO OBJETO</strong>
                          </p>
                          <p>
                            O presente contrato tem como objeto a prestação de serviços de [Descrição do Serviço], conforme especificações acordadas entre as partes...
                          </p>
                          <div className="pt-8 text-center text-muted-foreground/50">
                            [Continua...]
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                  <div className="bg-card rounded-2xl border border-border/50 shadow-card p-6">
                    <h3 className="font-display text-foreground mb-4">
                      Seu contrato está pronto!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 font-body">
                      Revise o documento e faça o download em PDF.
                    </p>
                    <div className="space-y-3">
                      <Button size="lg" className="w-full gap-2">
                        <Download className="w-5 h-5" />
                        Baixar PDF
                      </Button>
                      <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link to="/#planos">Ver Planos</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                    <p className="text-sm text-muted-foreground mb-2 font-body">
                      Plano Gratuito
                    </p>
                    <p className="text-sm text-foreground font-display">
                      <strong>2 de 3</strong> PDFs restantes este mês
                    </p>
                    <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full w-1/3 gradient-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
