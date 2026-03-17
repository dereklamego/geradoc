# GeraDoc - Front-end Technical Documentation

**Versão: 1.0.0**  
**Role: Lead Front-end Engineer**

Este documento detalha a arquitetura, contratos de dados e fluxos operacionais do Front-end do GeraDoc. O objetivo é fornecer uma especificação exaustiva que permita a construção de um Backend (ou Mock API) perfeitamente compatível.

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
| `/app` | Privado (User) | `DashboardLayout` | Layout da aplicação logada. |
| `/app/gerador` | Privado (User) | `Generator` | Fluxo step-by-step de criação de docs. |
| `/app/clientes` | Privado (User) | `Clients` | Listagem e gestão de clientes. |
| `/app/documentos`| Privado (User) | `Documents` | Repositório de documentos gerados. |
| `/admin` | Privado (Admin)| `AdminLayout` | Gestão global da plataforma. |

### 1.2 Layouts
- **`DashboardLayout`**: Inclui Sidebar persistente, Header com perfil e área de conteúdo dinâmico.
- **`AdminLayout`**: Dashboard isolado para estatísticas de plataforma e moderação de usuários.

---

## 💾 2. Definição de Interfaces (TypeScript)

O Front-end espera objetos estruturados seguindo rigorosamente as interfaces abaixo:

```typescript
// Usuário Autenticado e Perfil
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'beta' | 'admin';
  plan: 'free' | 'premium';
  company_name?: string;
  document?: string; // CPF/CNPJ do prestador
  phone?: string;
  address?: string;
  logoUrl?: string; // URL da logo personalizada
  monthlyUsage: number;
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

// Documento Gerado
export interface IDocument {
  id: string;
  type: 'Orçamento' | 'OS' | 'Recibo';
  clientId: string;
  clientName: string;
  value: number;
  date: string; // ISO format
  items: IServiceItem[];
  status: 'Pendente' | 'Aprovado' | 'Finalizado';
  clientDataSnapshot: IClient; // Cópia dos dados no momento da geração
}
```

---

## 🔄 3. Gerenciamento de Estado e Dados (TanStack Query)

O Front-end utiliza Hooks customizados para abstrair chamadas de API. Cada hook gerencia cache e estados de loading.

### Hooks Necessários:

- `useAuth()`: Gerencia login, logout e persistência de sessão.
- `useClients()`: CRUD de clientes (`GET /clients`, `POST /clients`, `PUT /clients/:id`, `DELETE /clients/:id`).
- `useDocuments()`: Listagem e criação de documentos (`GET /documents`, `POST /documents`).
- `useProfile()`: Atualização de dados da empresa e upload de logo (`PATCH /profile`).

---

## 📝 4. Formulários e Validação (Zod)

As validações são aplicadas em tempo real via `React Hook Form` + `Zod`.

### Regras de Negócio:
1.  **Cadastro de Cliente**:
    - `name`: Mínimo 3 caracteres.
    - `document`: Validação de formato CPF ou CNPJ.
    - `phone`: Formato brasileiro obrigatório.
2.  **Geração de Documento**:
    - OBRIGATÓRIO selecionar um cliente existente.
    - MÍNIMO de 1 item de serviço na lista.
    - Tipo de documento deve ser explicitamente selecionado.
3.  **Assinatura (Stripe/Payment Mock)**:
    - Requer CPF/CNPJ válido para faturamento.

---

## 🔌 5. Contrato de Integração (API Blueprint)

O Backend deve implementar os seguintes endpoints para funcionamento pleno do Front-end:

| Método | Endpoint | Request Body | Response (200) |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | `{ email, password }` | `{ user: IUser, token: string }` |
| `GET` | `/clients` | - | `IClient[]` |
| `POST` | `/clients` | `Omit<IClient, 'id'>` | `IClient` |
| `GET` | `/documents` | - | `IDocument[]` |
| `POST` | `/documents` | `Omit<IDocument, 'id' \| 'date'>` | `IDocument` |
| `PATCH`| `/profile/logo`| `FormData (image)` | `{ logoUrl: string }` |

### Tratamento de Erros:
- **401**: Token expirado ou login inválido.
- **403**: Limite de plano excedido (Ex: Usuário Free tentando gerar > 2 docs/mês).
- **422**: Erro de validação de campos.

---

## 🎨 6. Design System & UX Patterns

### 6.1 Feedback Visual
- **Loading States**: Uso de Skeleton screens (shadcn) para listas de clientes e documentos.
- **Empty States**: Ilustrações e CTAs (Ex: "Nenhum cliente cadastrado. Comece aqui").
- **Toasts**: Notificações via `sonner` para sucessos e falhas de rede.

### 6.2 UX Rules
- **Optimistic Updates**: Ao deletar um cliente, ele deve sumir da lista imediatamente, antes da resposta do servidor.
- **Responsive-First**: A plataforma deve ser 100% operacional via mobile (Layout adaptável).

---

## 🔧 7. Setup de Desenvolvimento

```bash
# Dependências principais
npm install @tanstack/react-query lucide-react react-hook-form zod @react-pdf/renderer

# Variáveis de Ambiente (.env)
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---
*Documento mantido pela equipe de Engenharia de Front-end (Lead).*
