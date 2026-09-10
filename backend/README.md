# GeraDoc — Backend

API REST construída com Fastify, Prisma e PostgreSQL.

---

## Pré-requisitos

- Node.js 22+
- PostgreSQL 14+ rodando localmente (ou via Docker)
- Stripe CLI (para webhooks em desenvolvimento)

---

## 1. Instalar dependências

```bash
cd backend
npm install
```

---

## 2. Banco de dados

O projeto já tem um `docker-compose.yml` configurado dentro da pasta `backend/`. Suba o PostgreSQL com:

```bash
docker compose up -d
```

Isso sobe o Postgres em background com healthcheck automático e volume persistente. Para parar: `docker compose down`.

---

## 3. Variáveis de ambiente

Crie o arquivo `backend/.env` com o conteúdo abaixo. As chaves Stripe você obtém no [Dashboard Stripe](https://dashboard.stripe.com/test/apikeys) (modo teste):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/geradoc?schema=public"
JWT_SECRET="troque_por_um_segredo_longo"

STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."  # aceita também STRIPE_API_KEY como alias legado
STRIPE_WEBHOOK_SECRET=""        # preenchido no passo 5

FRONTEND_URL="http://localhost:8080"
PORT=3000
NODE_ENV=development

# Cookie de autenticação (opcionais — defaults servem para dev local)
# COOKIE_SAMESITE=lax    # lax (default) | strict | none (obrigatório em prod com front/back em subdomínios distintos)
# COOKIE_DOMAIN=         # ex.: ".geradoc.com.br" em produção
```

---

## 4. Migrations e seed

```bash
# Aplica todas as migrations e gera o Prisma Client
npx prisma migrate dev

# Popula o banco com usuários de teste
npx prisma db seed
```

Usuários criados pelo seed (senha `123456` para todos):

| E-mail | Plano | Papel |
|---|---|---|
| free@geradoc.com | FREE | USER |
| pro@geradoc.com | PROFISSIONAL | USER |
| admin@geradoc.com | EMPRESARIAL | ADMIN |

---

## 5. Webhook Stripe (desenvolvimento)

O Stripe não consegue alcançar `localhost` diretamente. Use o Stripe CLI para encaminhar eventos:

```bash
# Autenticar uma vez
stripe login

# Em um terminal separado, mantenha aberto enquanto desenvolve
stripe listen --forward-to localhost:3000/api/payments/webhook
```

O comando imprime um `whsec_xxx` — copie e cole em `STRIPE_WEBHOOK_SECRET` no `.env`, depois reinicie o backend.

> O `whsec` muda a cada execução de `stripe listen`. Sempre atualize o `.env` ao reiniciar o CLI.

---

## 6. Rodar o servidor

```bash
npm run dev
```

Servidor disponível em `http://localhost:3000`.  
Documentação Swagger em `http://localhost:3000/docs`.

---

## Autenticação

O JWT é gravado num cookie `httpOnly` (`geradoc_token`) após `login`/`register` — nunca retorna no corpo da resposta nem fica acessível a JavaScript no front. O navegador reenvia o cookie automaticamente com `fetch(..., { credentials: 'include' })`. Expira em 7 dias. Como fallback (clientes não-browser, testes), a middleware `authenticate` também aceita header `Authorization: Bearer`.

Em dev, o front (porta 8080) acessa a API via proxy do Vite (`/api` → `localhost:3000`), então tudo é same-origin e `COOKIE_SAMESITE=lax` (default) funciona sem ajuste. Em produção, com front e back em subdomínios distintos, configure `COOKIE_SAMESITE=none` + `COOKIE_DOMAIN` (ver [`README_BACKEND.md`](../README_BACKEND.md), seção 5).

---

## Rotas disponíveis

| Prefixo | Descrição |
|---|---|
| `POST /api/auth/register` | Cadastro |
| `POST /api/auth/login` | Login |
| `POST /api/auth/logout` | Logout (limpa o cookie) |
| `GET /api/auth/me` | Perfil autenticado |
| `PATCH /api/auth/plan` | Alteração de plano local (upgrade imediato / downgrade agendado) |
| `DELETE /api/auth/plan/scheduled` | Cancela um downgrade agendado |
| `GET /api/documents` | Listagem de documentos |
| `POST /api/documents` | Criação de documento |
| `DELETE /api/documents/:id` | Remoção (soft delete) |
| `GET /api/clients` | Clientes do usuário |
| `GET /api/services` | Serviços do usuário |
| `GET /api/profile` | Perfil da empresa |
| `PATCH /api/profile/logo` | Upload de logo da empresa |
| `POST /api/payments/create-checkout-session` | Iniciar checkout Stripe |
| `POST /api/payments/create-portal-session` | Abrir o Stripe Customer Portal |
| `GET /api/payments/method` | Método de pagamento padrão |
| `POST /api/payments/cancel-subscription` | Cancelar assinatura (ao fim do período) |
| `POST /api/payments/webhook` | Webhook Stripe |
| `GET /api/admin/stats` | KPIs (admin only) |
| `GET /api/admin/users` | Lista de usuários (admin only) |
| `GET /api/admin/finance` | Assinaturas e billing (admin only) |
| `GET /api/admin/events` | Histórico de eventos de plano (admin only) |
| `PATCH /api/admin/users/:id/plan` | Alterar plano de um usuário (admin only) |
| `PATCH /api/admin/users/:id/role` | Alterar papel/suspender usuário (admin only) |

---

## Scripts úteis

```bash
npm run dev           # servidor com hot-reload (tsx watch)
npm run typecheck     # checagem de tipos sem compilar
npm run test          # testes unitários
npm run test:coverage # cobertura de testes
npx prisma studio     # GUI do banco de dados
```

---

## 7. Deploy em produção (AWS Lambda + API Gateway)

O backend já está preparado para rodar como função serverless: `src/handler.ts` embrulha o Fastify com `serverless-http`, e `serverless.yml` define o deploy via [Serverless Framework](https://www.serverless.com/) (Lambda + HTTP API).

### 7.1 Domínio próprio é obrigatório para o cookie de auth funcionar

O front (Amplify) e o back (Lambda) ficam em domínios de infraestrutura totalmente diferentes por padrão (`*.amplifyapp.com` e `*.execute-api.<region>.amazonaws.com`) — **sem relação alguma entre si**. Como a autenticação usa cookie `httpOnly` (`geradoc_token`), o navegador só envia esse cookie entre domínios que compartilham o mesmo domínio raiz (eTLD+1).

Por isso, antes de testar o fluxo de login integrado entre Amplify e Lambda, é necessário:
1. Ter um domínio próprio (ex.: `geradoc.com.br`) com Hosted Zone no **Route 53**.
2. Configurar o Amplify com domínio custom em `app.geradoc.com.br`.
3. Configurar o API Gateway com domínio custom em `api.geradoc.com.br`.

Sem isso, dá para testar a API isoladamente (Swagger em `/docs`, Postman, `curl`), mas não o login via navegador entre os dois domínios.

### 7.2 Domínio custom do API Gateway

O `serverless.yml` já traz o plugin [`serverless-domain-manager`](https://github.com/amplify-education/serverless-domain-manager) configurado. Requisitos antes do primeiro deploy:
- Um certificado ACM válido para `api.geradoc.com.br`, **emitido na mesma região** do `provider.region` (`us-east-1`).
- A variável `API_DOMAIN` setada (veja abaixo).

```bash
# Cria o mapeamento de domínio custom (uma vez, antes do primeiro deploy)
npx serverless create_domain

# Deploy
npx serverless deploy
```

### 7.3 Variáveis de ambiente do deploy

O `serverless.yml` repassa estas variáveis do shell/CI para o Lambda via `${env:VAR}`. Configure-as no seu pipeline de CI/CD (ou exporte localmente antes de rodar `serverless deploy`) — **não** commite secrets no `serverless.yml`:

```env
API_DOMAIN=api.geradoc.com.br
NODE_ENV=production
DATABASE_URL="postgresql://usuario:senha@host:5432/geradoc?schema=public"
JWT_SECRET="segredo_de_producao"
FRONTEND_URL="https://app.geradoc.com.br"
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
COOKIE_SAMESITE=none
COOKIE_DOMAIN=.geradoc.com.br
```

> Para produção real, prefira armazenar os secrets (`JWT_SECRET`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) no **SSM Parameter Store** ou **Secrets Manager** em vez de variáveis de ambiente no CI, e referencie-os no `serverless.yml` com `${ssm:/caminho/do/parametro}`.

### 7.4 Variável no front (Amplify)

No console do Amplify, em **Environment variables** do app:

```env
VITE_API_URL=https://api.geradoc.com.br/api
```
