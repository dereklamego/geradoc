# GeraDoc - Gerador de Documentos Ágeis

O **GeraDoc** é uma plataforma SaaS projetada para simplificar a vida de prestadores de serviços e pequenas empresas. O foco principal é a **agilidade na emissão de documentos comerciais**, permitindo que orçamentos, ordens de serviço e recibos sejam gerados em menos de 2 minutos, profissionalizando o atendimento ao cliente.

## 🚀 Foco do Projeto

Eliminar o uso de planilhas complexas ou editores de texto manuais. O GeraDoc centraliza a gestão de clientes, catálogo de serviços e a geração automatizada de documentos em uma interface moderna, rápida e intuitiva, perfeitamente integrada a um backend robusto (PostgreSQL) e sistema de pagamentos recorrentes (Stripe).

---

## ✨ Funcionalidades Principais

- **Gerador de Documentos**: Criação guiada de Orçamentos, Ordens de Serviço (OS) e Recibos com cálculos automáticos de totais, exibição de logos da empresa emissora e personalização PDF.
- **Gestão de Clientes (CRM)**: Cadastro completo de clientes integrados ao banco de dados, para seleção instantânea nos relatórios.
- **Catálogo de Serviços**: Armazenamento de itens, preços padrão e garantias em PostgreSQL para acelerar as operações diárias.
- **Dashboard Financeiro**: Acompanhamento de documentos gerados, métricas de conta e Faturamento Inteligente (filtra automaticamente a soma unicamente de "Recibos").
- **Sistema de Assinaturas (Stripe)**: Planos Gratuito, Profissional e Empresarial reais. Integração completa com o Stripe Checkout, Portal do Cliente (Billing Portal) e proteção automatizada via Webhooks seguros.
- **Exportação e Visualização em PDF**: Emissão de documentos profissionais em modal integrado via `@react-pdf/renderer` pronto para exportação local das impressoras.

---

## 🖥️ Telas e Navegação

### Área do Usuário (Sistema)
- **Dashboard**: Visão geral de métricas, atividade recente e status de cota do plano Free.
- **Clientes**: CRUD completo com lista e modal intuitivos (Shadcn UI).
- **Serviços**: Gestão de catálogo padrão ("Novo Serviço").
- **Gerador**: Múltiplos passos para gerar de forma rápida e segura relatórios valiosos.
- **Documentos**: Histórico de PDFs gerados, leitura em PDF Viewer embutido, acompanhamento de valores e exclusão através de Modais Nativos.
- **Assinatura / Payment**: Migração transparente com Toggle de planos, passando pelo Checkout oficial da Stripe validando melhorias instantaneamente ("Assinatura Especialista/PRO").

---

## 🛠️ Tecnologias Utilizadas (Frontend)

- **Core**: [React 18](https://reactjs.org/) + Vite + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (AlertDialog, Dropdowns, Modals, Tables, Forms)
- **Animações**: Framer Motion
- **Formulários & Validação**: React Hook Form + Zod
- **Gerenciamento de Estado/Dados**: Zustand (Estado UI e Store) + TanStack Query (Requisições HTTP Caching)
- **PDF**: `@react-pdf/renderer` para renderização limpa baseada em componentes reativos

---

## ⚙️ Como executar o projeto (Full Stack)

### Pré-requisitos
- Node.js instalado (v18+)
- Backend rodando paralelamente na porta `3000` (Veja o arquivo `README_BACKEND.md` na pasta /backend).
- Chaves públicas do Stripe (opcional se não testar compras).

### Instalação
1. Clone o repositório
2. Configure o arquivo `.env` referenciando a API local do Backend.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor frontend:
   ```bash
   npm run dev
   ```
5. O sistema ficará disponível via `localhost` (Porta Vite Padrão ou Vite Custom :8080).

---

## 🔑 Como Testar e Simular Fluxos Atuais (Sem limites Fake)

Acabou a época dos mocks ("Mocking Storage"). Agora os limites são calculados e regidos por Backend.
Para testar hoje:
1. Pressione **"Não tem conta? Registre-se"** na tela de Login. 
2. Realize o cadastro com qualquer Email (`testes@app.com`). A base `Postgres` irá salvar e hashear essa senha.
3. Acesse o sistema. Identifique que o seu Dashboard diz "Uso de mês - Gratuito" indicando limite restrito.
4. Vá em **Clientes** e **Serviços** e popule um pouco o seu banco de dados criando exemplos. E teste o botão "Excluir" em alguns registros para atestar o fluxo de UI reativo do *AlertDialog*.
5. Salve um novo Documento do tipo `Recibo`. Olhe no Dashboard e veja o Faturamento aumentar.
6. Vá na aba de **Assinatura** -> Escolha Profissional Mensal -> Pague digitando na janela nova o cartão universal restrito do Stripe Checkout (`4242 4242 4242...`), volte na página, seu perfil agora recarregará como PRO.