import { Link } from "react-router-dom";
import logoGeradoc from "@/assets/logo-geradoc.png";

const footerLinks = {
  produto: [
    { label: "Gerador de Contratos", href: "/gerador" },
    { label: "Modelos", href: "/modelos" },
    { label: "Automação", href: "/automacao" },
    { label: "Integrações", href: "/integracoes" },
    { label: "Preços", href: "/#planos" },
  ],
  recursos: [
    { label: "Central de Ajuda", href: "/ajuda" },
    { label: "Tutoriais", href: "/tutoriais" },
    { label: "Blog", href: "/blog" },
    { label: "API Docs", href: "/api" },
    { label: "Status do Sistema", href: "/status" },
  ],
  empresa: [
    { label: "Sobre Nós", href: "/sobre" },
    { label: "Carreiras", href: "/carreiras" },
    { label: "Parceiros", href: "/parceiros" },
    { label: "Imprensa", href: "/imprensa" },
    { label: "Contato", href: "/contato" },
  ],
  legal: [
    { label: "Termos de Uso", href: "/termos" },
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Política de Cookies", href: "/cookies" },
    { label: "LGPD", href: "/lgpd" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", href: "#", icon: "in" },
  { name: "Instagram", href: "#", icon: "ig" },
  { name: "YouTube", href: "#", icon: "yt" },
  { name: "Twitter", href: "#", icon: "tw" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={logoGeradoc} 
                alt="GeraDoc" 
                className="h-14 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed font-body mb-6 max-w-xs">
              A plataforma completa para criar, gerenciar e automatizar seus contratos profissionais. 
              Simples, rápido e juridicamente válido.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-background/10 hover:bg-background/20 flex items-center justify-center text-sm font-bold text-background/70 hover:text-background transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-background/50">
              Produto
            </h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-background/50">
              Recursos
            </h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-background/50">
              Empresa
            </h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold mb-4 text-sm uppercase tracking-wider text-background/50">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/50 font-body">
              © {new Date().getFullYear()} GeraDoc. Todos os direitos reservados.
            </p>
            <p className="text-sm text-background/50 font-body">
              Feito com ❤️ para profissionais autônomos do Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
