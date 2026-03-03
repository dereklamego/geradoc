import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, FileText, Users, Zap, BarChart3, Shield, Headphones, BookOpen, Video, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoGeradoc from "@/assets/logo-geradoc.png";

const menuItems = [
  {
    label: "Recursos",
    children: [
      {
        title: "Gerador de Contratos",
        description: "Crie contratos profissionais em minutos",
        icon: FileText,
        href: "/gerador",
        color: "primary",
      },
      {
        title: "Modelos Prontos",
        description: "Diversos modelos para seu negócio",
        icon: BookOpen,
        href: "/modelos",
        color: "secondary",
      },
      {
        title: "Automação",
        description: "Automatize seus processos contratuais",
        icon: Zap,
        href: "/automacao",
        color: "accent",
      },
      {
        title: "Relatórios",
        description: "Acompanhe suas métricas e resultados",
        icon: BarChart3,
        href: "/relatorios",
        color: "primary",
      },
    ],
  },
  {
    label: "Soluções",
    children: [
      {
        title: "Para Freelancers",
        description: "Contratos para profissionais autônomos",
        icon: Users,
        href: "/freelancers",
        color: "primary",
      },
      {
        title: "Para Pequenas Empresas",
        description: "Soluções escaláveis para PMEs",
        icon: Shield,
        href: "/empresas",
        color: "secondary",
      },
    ],
  },
  {
    label: "Suporte",
    children: [
      {
        title: "Central de Ajuda",
        description: "Encontre respostas para suas dúvidas",
        icon: HelpCircle,
        href: "/ajuda",
        color: "primary",
      },
      {
        title: "Tutoriais",
        description: "Aprenda a usar todas as funcionalidades",
        icon: Video,
        href: "/tutoriais",
        color: "secondary",
      },
      {
        title: "Contato",
        description: "Fale com nossa equipe de suporte",
        icon: Headphones,
        href: "/contato",
        color: "accent",
      },
    ],
  },
];

const simpleLinks = [
  { label: "Como Funciona", href: "/#como-funciona" },
  { label: "Preços", href: "/#planos" },
];

const getIconBgClass = (color: string) => {
  switch (color) {
    case "primary":
      return "bg-primary/10 text-primary";
    case "secondary":
      return "bg-secondary/10 text-secondary";
    case "accent":
      return "bg-accent/10 text-accent";
    default:
      return "bg-primary/10 text-primary";
  }
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logoGeradoc} 
              alt="GeraDoc" 
              className="h-12 md:h-14 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors font-display"
                >
                  {item.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-72 bg-card rounded-2xl shadow-lg border border-border/50 p-2 mt-2"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          to={child.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors group/item"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconBgClass(child.color)} group-hover/item:scale-110 transition-transform`}>
                            <child.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground font-display">{child.title}</p>
                            <p className="text-sm text-muted-foreground font-body">{child.description}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {simpleLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors font-display ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Conectar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/cadastro">Cadastre-se</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4">
              {menuItems.map((item) => (
                <div key={item.label} className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    {item.label}
                  </p>
                  <div className="space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        to={child.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getIconBgClass(child.color)}`}>
                          <child.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium font-display">{child.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {simpleLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-3 px-2 text-sm font-medium font-display hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-border">
                <Button variant="outline" asChild>
                  <Link to="/login">Conectar</Link>
                </Button>
                <Button asChild>
                  <Link to="/cadastro">Cadastre-se</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
