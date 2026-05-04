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
- **Segurança**: JWT (`@fastify/jwt`), CORS granular, Arg2 Hashing (Autenticação), `fastify-raw-body` buffer.
- **Finance**: SDK Oficial Node `stripe`

---

## 2. Modelagem Relacional (Prisma Schema Atualizada)

```prisma
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  passwordHash  String
  name          String
  plan          Plan       @default(FREE)
  
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  subscription         Subscription?

  documents     Document[]
  clients       Client[]
  services      Service[]
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
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
  isDeleted   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## 3. Principais Endpoints e Fluxos REST

### 3.1 Autenticação (`/api/auth`)
- `POST /register`: Hasheia senha via `argon2` e insere o User na base.
- `POST /login`: Retorna o _bearer_ Token e valida existência no DB.
- `GET  /me`: Extrai ID do Token para retornar status validado do plano do app.

### 3.2 Clientes e Serviços (`/api/clients` & `/api/services`)
- `GET`, `POST`, `PATCH`, `DELETE` implementados isoladamente para lidar com registros vinculados _indissoluvelmente_ com o `userId` (prevenção absoluta de *Leaking de dados Multi-Tenant*).

### 3.3 Documentos (`/api/documents`)
- `GET  /`: Lista documentos, respeitando limitadores.
- `POST /`: Intercepta o formato customizado (`IDocument`) do Cliente React Frontend, mapeia os campos necessários dinamicamente e comprime perfeitamente as propriedades em Formato `content: JSON` para ignorar erros formais enquanto garante escalabilidade de campos.
- `DELETE /:id`: Gerencia estado `isDeleted: true` (Soft Delete).

### 3.4 Assinaturas Stripe (`/api/payments`)
- `POST /create-checkout-session`: Gera uma URL oficial do Servidor do **Stripe** de alta-segurança de acordo com os _Price ID_ de planos anuais/mensais do `.env`.
- `POST /webhook`: Rota isolada do CORS/Parse padrão onde um bypass especial em Buffer Nativo autentica os pacotes webhook, executando upscales no Prisma `User.plan` dependendo dos estados emitidos pelo Node do Stripe ("checkout completed", "updated", "deleted").

---

## 4. Setup e Execução do Backend

Requisitos: Database Postgres ativo (Default Fastify Port: 3000)

**1. Configure o `.env` (pasta /backend)**
```env
PORT=3000
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/geradoc?schema=public"
JWT_SECRET="secretao_aqui"

# Integração Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

FRONTEND_URL="http://localhost:8080" # URL Base da liberação Anti-CORS
```

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
