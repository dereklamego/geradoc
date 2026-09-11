# GeraDoc - Front-end Technical Documentation

**Versão: 1.1.0**
**Role: Lead Front-end Engineer**

Este documento detalha a arquitetura, contratos de dados e fluxos operacionais do Front-end do GeraDoc, refletindo o backend real (Fastify + Prisma + PostgreSQL) já em produção — não um blueprint prévio.

---

## 🏗️ 1. Arquitetura de Componentes e Rotas

A aplicação é dividida em três pilares principais de navegação:

### 1.1 Hierarquia de Rotas (`react-router-dom`)

| Rota | Tipo | Componente | Descrição |
| :--- | :--- | :--- | :--- |
| `/` | Público | `Index` | Landing page principal. |
| `/login` | Público | `Login` | Autenticação de usuários. |
| `/register` | Público | `Register` | Criação de novas contas. |
| `/recursos/*` | Público | `FeaturePage` | Páginas de marketing sobre funcionalidades. |
| `/app/dashboard` | Privado (User) | `Dashboard` | Painel principal. |
| `/app/gerador` | Privado (User) | `Generator` | Fluxo step-by-step de criação de docs. |
| `/app/clientes` | Privado (User) | `Clients` | Listagem e gestão de clientes. |
| `/app/clientes/:id` | Privado (User) | `ClientDetails` | Detalhe de um cliente. |
| `/app/documentos` | Privado (User) | `Documents` | Repositório de documentos gerados. |
| `/app/servicos` | Privado (User) | `Services` | Catálogo de serviços. |
| `/app/assinatura` | Privado (User) | `Subscription` | Planos e assinatura (Stripe). |
| `/app/perfil` | Privado (User) | `Profile` | Perfil da empresa. |
| `/admin` | Privado (Admin) | `Admin` | Gestão global da plataforma (`role: ADMIN`). |

### 1.2 Layouts
- **`DashboardLayout`**: Inclui Sidebar persistente, Header com perfil e área de conteúdo dinâmico.
- **`AdminLayout`**: Dashboard isolado para estatísticas de plataforma e moderação de usuários.

---

## 🔐 2. Autenticação

O JWT **não** trafega no corpo da resposta nem é guardado em `localStorage`/`sessionStorage`. Após `login`/`register`, o backend grava o token num cookie `httpOnly` (`geradoc_token`), inacessível a JavaScript. Toda chamada usa `fetch(..., { credentials: 'include' })` (`src/lib/api.ts`) para que o navegador reenvie o cookie automaticamente. O token expira em 7 dias.

O estado de sessão no front (`src/store/useAppStore.ts`, Zustand + `persist`) guarda apenas o objeto `user` mapeado — nunca um token. A validade real da sessão é sempre determinada pelo servidor: `fetchMe()` chama `GET /api/auth/me` e trata `401` como sessão expirada, limpando o estado local.

---

## 💾 3. Definição de Interfaces (TypeScript)

```typescript
// Usuário Autenticado e Perfil (shape usado no front, após mapUser())
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'profissional' | 'empresarial';
  company_name?: string;
  document?: string; // CPF/CNPJ do prestador
  phone?: string;
  address?: string;
  brandColor?: string;
  logoUrl?: string;
  monthlyUsage: number;
  billing?: {
    monthlyUsage: number;
    monthlyLimit: number | null; // null = ilimitado
    currentPeriodStart: string;
    currentPeriodEnd: string;
    scheduledPlan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL' | null;
    scheduledPlanChangeAt: string | null;
  };
  subscription?: {
    status: string; // active | trialing | past_due | canceled
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
}

// Catálogo de Clientes
export interface IClient {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  document: string; // CPF ou CNPJ
  phone: string;
  address: string;
  email?: string;
}

// Itens de Serviço/Produto
export interface IServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Documento Gerado (status espelha o enum Prisma Status)
export interface IDocument {
  id: string;
  type: 'Orçamento' | 'OS' | 'Recibo';
  clientId: string;
  clientName: string;
  value: number;
  date: string; // ISO format
  items: IServiceItem[];
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'FINISHED';
  clientDataSnapshot: IClient;
}
```

> O backend representa `plan` em maiúsculas (`FREE | PROFISSIONAL | EMPRESARIAL`); o front converte para minúsculas em `mapUser()` (`src/store/useAppStore.ts`).

---

## 🔄 4. Gerenciamento de Estado e Dados

- **Zustand** (`src/store/useAppStore.ts`): estado de autenticação (`user`, `isAuthenticated`, `loading`), com ações `login`, `register`, `logout`, `fetchMe`, `updateProfile`. Persiste apenas `user`/`isAuthenticated` no `localStorage` (nunca token).
- **TanStack Query**: cache e loading state para dados de domínio (clientes, documentos, serviços, billing).
- `src/lib/api.ts`: client HTTP central, sempre com `credentials: 'include'`.

---

## 📝 5. Formulários e Validação (Zod)

As validações são aplicadas em tempo real via `React Hook Form` + `Zod`.

### Regras de Negócio:
1. **Cadastro de Cliente**:
   - `name`: Mínimo 3 caracteres.
   - `document`: Validação de formato CPF ou CNPJ.
   - `phone`: Formato brasileiro obrigatório.
2. **Geração de Documento**:
   - OBRIGATÓRIO selecionar um cliente existente.
   - MÍNIMO de 1 item de serviço na lista.
   - Tipo de documento deve ser explicitamente selecionado.
3. **Assinatura (Stripe)**:
   - Requer CPF/CNPJ válido para faturamento.

---

## 🔌 6. Contrato de Integração (API real)

Base URL: `VITE_API_URL` (`/api` em dev, via proxy do Vite). Todas as rotas autenticadas dependem do cookie `geradoc_token` — nenhuma envia/recebe token no corpo.

| Método | Endpoint | Request Body | Response (200) |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | `{ email, password, name }` | `{ user: IUser }` (201; cookie setado) |
| `POST` | `/auth/login` | `{ email, password }` | `{ user: IUser }` (cookie setado, **sem token no corpo**) |
| `POST` | `/auth/logout` | - | `204 No Content` (cookie limpo) |
| `GET` | `/auth/me` | - | `IUser` completo (perfil, billing, subscription) |
| `PATCH` | `/auth/plan` | `{ plan }` | `{ plan, scheduledPlan, scheduledPlanChangeAt, kind }` |
| `DELETE` | `/auth/plan/scheduled` | - | `{ plan, scheduledPlan, scheduledPlanChangeAt }` |
| `GET` | `/clients` | - | `IClient[]` |
| `POST` | `/clients` | `Omit<IClient, 'id'>` | `IClient` |
| `GET` | `/documents` | - | `IDocument[]` |
| `POST` | `/documents` | `Omit<IDocument, 'id' \| 'date'>` | `IDocument` |
| `DELETE` | `/documents/:id` | - | soft delete (`isDeleted: true`) |
| `PATCH` | `/profile/logo` | `FormData (image)` | `{ logoUrl: string }` |
| `POST` | `/payments/create-checkout-session` | `{ plan, billingCycle }` | `{ url }` (Stripe Checkout) |
| `POST` | `/payments/create-portal-session` | - | `{ url }` (Stripe Customer Portal) |
| `GET` | `/payments/method` | - | dados do cartão padrão |
| `POST` | `/payments/cancel-subscription` | - | assinatura marcada para cancelar no fim do ciclo |

### Tratamento de Erros:
- **401**: Sessão expirada ou login inválido (cookie ausente/inválido).
- **403**: Limite de plano excedido, ou rota admin acessada por não-admin.
- **422**: Erro de validação de campos.

---

## 🎨 7. Design System & UX Patterns

### 7.1 Feedback Visual
- **Loading States**: Uso de Skeleton screens (shadcn) para listas de clientes e documentos.
- **Empty States**: Ilustrações e CTAs (Ex: "Nenhum cliente cadastrado. Comece aqui").
- **Toasts**: Notificações via `sonner` para sucessos e falhas de rede.

### 7.2 UX Rules
- **Optimistic Updates**: Ao deletar um cliente, ele deve sumir da lista imediatamente, antes da resposta do servidor.
- **Responsive-First**: A plataforma deve ser 100% operacional via mobile (Layout adaptável).

---

## 🔧 8. Setup de Desenvolvimento

```bash
npm install

# Variáveis de Ambiente (.env na raiz)
VITE_API_URL=/api
```

O Vite faz proxy de `/api` para `http://localhost:3000` em dev (`vite.config.ts`) — não é necessário configurar `VITE_STRIPE_PUBLIC_KEY` no front; as chaves públicas do Stripe são resolvidas pelo backend nas respostas de checkout/portal.

---
*Documento mantido pela equipe de Engenharia de Front-end (Lead).*
