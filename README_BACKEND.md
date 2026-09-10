# GeraDoc Backend - Documentação Administrativa API

**Role**: API Service Oficial  
**Arquitetura**: Node.js + RESTful Controller/Service Model  
**Foco atual**: Comunicação nativa com Banco SQL, proteção JWT estrita, Integrações Financeiras Assíncronas (Stripe Webhooks).

---

## 1. Stack Tecnológico (Core Backend)

- **Runtime**: Node.js v22+
- **Framework**: [Fastify](https://www.fastify.io/) (High performance framework)
- **ORM / Persistência**: [Prisma](https://www.prisma.io/)
- **Database Central**: PostgreSQL (Local/Supabase / RDS). Suporta armazenamento estruturado rígido com expansão flexível no formato JSON.
- **Validação e Tipagem**: Zod
- **Segurança**: JWT (`@fastify/jwt`) entregue via **cookie httpOnly** (`@fastify/cookie`), CORS com origin explícito + `credentials`, Argon2 Hashing (Autenticação), `fastify-raw-body` buffer.
- **Finance**: SDK Oficial Node `stripe`

> **Modelo de autenticação:** o JWT **não** trafega no corpo da resposta nem é guardado em `localStorage`. Após `login`/`register`, o backend grava o token num cookie `httpOnly` (`geradoc_token`) — inacessível a JavaScript, o que elimina a superfície de roubo de token via XSS. O navegador reenvia o cookie automaticamente quando o front usa `fetch(..., { credentials: 'include' })`. O token expira em **7 dias**, alinhado ao `maxAge` do cookie.

---

## 2. Modelagem Relacional (Prisma Schema Atualizada)

```prisma
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  passwordHash  String
  name          String
  role          Role       @default(USER)
  plan          Plan       @default(FREE)

  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  subscription         Subscription?

  // Ciclo de cobrança (aplicado localmente; espelha o período do Stripe)
  currentPeriodStart      DateTime  @default(now())
  currentPeriodEnd        DateTime  @default(now())
  monthlyUsage            Int       @default(0)

  // Downgrade agendado (aplicado no fim do período atual)
  scheduledPlan           Plan?
  scheduledPlanChangeAt   DateTime?

  documents      Document[]
  folders        Folder[]
  clients        Client[]
  services       Service[]
  companyProfile CompanyProfile?
  planEvents     PlanEvent[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model Subscription {
  id                 String   @id @default(uuid())
  userId             String   @unique
  user               User     @relation(fields: [userId], references: [id])
  status             String   // active, trialing, past_due, canceled
  priceId            String
  billingCycle       String?  // monthly, quarterly, yearly
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model CompanyProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  name        String?
  document    String?
  phone       String?
  address     String?
  brandColor  String   @default("#2563eb")
  logoStorage String?  @db.Text // base64 data URL (candidato a virar chave S3 no futuro)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Client {
  id        String   @id @default(uuid())
  name      String
  type      String   // PF ou PJ
  document  String   // CPF ou CNPJ
  phone     String
  address   String
  email     String?
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}

model Service {
  id                      String   @id @default(uuid())
  name                    String
  default_price           Float
  default_warranty_months Int
  userId                  String
  user                    User     @relation(fields: [userId], references: [id])
}

model Document {
  id          String   @id @default(uuid())
  title       String   // Identificador auto-mapeado do Frontend (Ex: Tipo - Cliente)
  content     Json     // Contém a payload estruturada integral (itens, valores)
  status      Status   @default(DRAFT)
  version     Int      @default(1)
  isDeleted   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  folderId    String?
  folder      Folder?  @relation(fields: [folderId], references: [id])
  templateId  String?
  template    Template? @relation(fields: [templateId], references: [id])
}

model Folder {
  id        String     @id @default(uuid())
  name      String
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  documents Document[]
}

model Template {
  id          String     @id @default(uuid())
  name        String
  description String
  structure   Json
  category    String
  documents   Document[]
}

// Idempotência de webhook
model StripeEvent {
  id        String   @id // Webhook event ID
  type      String
  createdAt DateTime @default(now())
}

// Auditoria de mudanças de plano (upgrade, downgrade, cancelamento, admin)
model PlanEvent {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  fromPlan   String
  toPlan     String
  eventType  String   // upgrade | downgrade | cancel | admin_change
  actorId    String?  // null = sistema/stripe, userId = self, adminId = admin
  metadata   Json?
  createdAt  DateTime @default(now())
}
```

> Schema completo em [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

---

## 3. Principais Endpoints e Fluxos REST

### 3.1 Autenticação (`/api/auth`)
- `POST /register`: Hasheia senha via `argon2`, insere o User e **grava o JWT no cookie httpOnly**. Retorna apenas o objeto `user` no corpo.
- `POST /login`: Valida credenciais no DB e **grava o JWT no cookie httpOnly**. Retorna apenas o objeto `user` (sem token no corpo).
- `POST /logout`: **Limpa o cookie de autenticação** (`204 No Content`).
- `GET  /me`: Lê o token do cookie (fallback para header `Authorization: Bearer` para clientes não-browser, ex.: ferramentas/testes) e retorna o status validado do plano do app.

> O middleware `authenticate` lê o JWT do cookie `geradoc_token`; se ausente, tenta o header `Authorization`. Falhas de assinatura/expiração retornam `401 UNAUTHORIZED`.

### 3.2 Clientes e Serviços (`/api/clients` & `/api/services`)
- `GET`, `POST`, `PATCH`, `DELETE` implementados isoladamente para lidar com registros vinculados _indissoluvelmente_ com o `userId` (prevenção absoluta de *Leaking de dados Multi-Tenant*).

### 3.3 Documentos (`/api/documents`)
- `GET  /`: Lista documentos, respeitando limitadores.
- `POST /`: Intercepta o formato customizado (`IDocument`) do Cliente React Frontend, mapeia os campos necessários dinamicamente e comprime perfeitamente as propriedades em Formato `content: JSON` para ignorar erros formais enquanto garante escalabilidade de campos.
- `DELETE /:id`: Gerencia estado `isDeleted: true` (Soft Delete).

### 3.4 Assinaturas Stripe (`/api/payments`)
- `POST /create-checkout-session`: Gera uma URL oficial do Servidor do **Stripe** de alta-segurança de acordo com os _Price ID_ de planos anuais/mensais do `.env`.
- `POST /create-portal-session`: Cria uma sessão do **Stripe Customer Portal** (gestão de método de pagamento, faturas e cancelamento pelo próprio cliente).
- `GET  /method`: Retorna o método de pagamento padrão do usuário (bandeira, últimos 4 dígitos, validade).
- `POST /cancel-subscription`: Cancela a assinatura ao fim do período atual (`cancel_at_period_end: true`), sem cancelamento imediato.
- `POST /webhook`: Rota isolada do CORS/Parse padrão onde um bypass especial em Buffer Nativo autentica os pacotes webhook, executando upscales no Prisma `User.plan` dependendo dos estados emitidos pelo Node do Stripe ("checkout completed", "updated", "deleted"). Idempotência garantida pela tabela `StripeEvent`.

### 3.5 Mudança de plano sem Stripe (dev) e Admin
- `PATCH /api/auth/plan`: troca de plano local — upgrades aplicam na hora, downgrades ficam agendados (`scheduledPlan`/`scheduledPlanChangeAt`) e só entram em vigor no próximo `currentPeriodEnd`, aplicados via `syncBilling` na requisição seguinte autenticada.
- `DELETE /api/auth/plan/scheduled`: cancela um downgrade agendado.
- `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/finance`, `GET /api/admin/events`, `PATCH /api/admin/users/:id/plan`, `PATCH /api/admin/users/:id/role`: painel administrativo (somente `role: ADMIN`), com KPIs, listagem de usuários/assinaturas e log de auditoria (`PlanEvent`).

> **Nota de implementação:** as rotas de `documents`, `clients` e `services` autenticam via `request.jwtVerify()` (plugin `@fastify/jwt`, que também lê o cookie `geradoc_token`), um caminho **diferente** da middleware `authenticate` usada por `auth`, `payments` e `admin`. Isso significa que elas não disparam `syncBilling` a cada request — o rollover de ciclo e a aplicação de downgrades agendados só acontecem quando o usuário bate em rotas que passam pela middleware `authenticate` (ex.: `GET /api/auth/me`).

---

## 4. Setup e Execução do Backend

Requisitos: Database Postgres ativo (Default Fastify Port: 3000)

**1. Configure o `.env` (pasta /backend)**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/geradoc?schema=public"
JWT_SECRET="secretao_aqui"

# Integração Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."   # aceita também STRIPE_API_KEY como alias legado
STRIPE_WEBHOOK_SECRET="whsec_..."

# --- CORS + Cookie de autenticação ---
FRONTEND_URL="http://localhost:8080"  # origin liberado no CORS (deve bater com a URL do front)
# COOKIE_SAMESITE=lax                  # lax (default) | strict | none
# COOKIE_DOMAIN=                       # vazio em dev; ".seudominio.com.br" em prod com subdomínios
```

> Em **desenvolvimento** o front (Vite, porta 8080) usa um **proxy** (`/api` → `localhost:3000`), então as chamadas são same-origin e o cookie `SameSite=lax` funciona sem ajustes.

**2. Prepare o Banco de Dados via Prisma CLI:**
```bash
npx prisma generate
npx prisma migrate dev --name init_e_relaciones
```

**3. Testando em modo Hot-Reload:**
```bash
npm run dev
```

> **Aviso sobre Teste de Webhooks:** Se necessitar testar upgrades do sistema sem enviar à produção, utilize a CLI da Stripe na porta 3000 (`stripe listen --forward-to localhost:3000/api/payments/webhook`) para emular o túnel de compra e injetar a tag `STRIPE_WEBHOOK_SECRET` que a API te der logo no terminal do comando.

---

## 5. Deploy em Produção — Front e Back Separados (Subdomínios)

A arquitetura padrão de produção roda o front-end e o back-end em **subdomínios distintos** do mesmo domínio raiz:

| Componente | Exemplo de URL |
|---|---|
| Front-end (SPA) | `https://app.geradoc.com.br` |
| Back-end (API)  | `https://api.geradoc.com.br` |

Como o navegador trata isso como **cross-site**, o cookie `httpOnly` só é enviado se configurado com `SameSite=None` + `Secure` (exige **HTTPS**) e compartilhado entre os subdomínios via `Domain`.

**Variáveis no back-end (`backend/.env` de produção):**
```env
NODE_ENV=production
FRONTEND_URL="https://app.geradoc.com.br"   # origin exato do front (CORS)
COOKIE_SAMESITE=none                         # permite envio cross-site
COOKIE_DOMAIN=.geradoc.com.br                # ponto inicial = válido em app. e api.
```

**Variável no front-end (`.env` de produção):**
```env
VITE_API_URL="https://api.geradoc.com.br/api"
```

Notas importantes:
- `COOKIE_SAMESITE=none` **força** `Secure` automaticamente no código ([cookies.ts](backend/src/shared/http/cookies.ts)) — portanto a API **precisa** estar atrás de HTTPS.
- `FRONTEND_URL` deve ser o origin **exato** do front; com `credentials: true` o CORS **não** aceita `*`.
- `COOKIE_DOMAIN` começa com ponto (`.geradoc.com.br`) para que o cookie valha tanto em `app.` quanto em `api.`.
- Atenção a **CSRF**: com `SameSite=none` o cookie acompanha requisições cross-site. As mutações sensíveis devem ser protegidas (ex.: token anti-CSRF ou checagem de `Origin`) caso o app passe a aceitar formulários de terceiros.
