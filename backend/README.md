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

Suba uma instância do PostgreSQL se ainda não tiver uma:

```bash
docker run --name geradoc-db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres
```

---

## 3. Variáveis de ambiente

Crie o arquivo `backend/.env` com o conteúdo abaixo. As chaves Stripe você obtém no [Dashboard Stripe](https://dashboard.stripe.com/test/apikeys) (modo teste):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/geradoc?schema=public"
JWT_SECRET="troque_por_um_segredo_longo"

STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET=""        # preenchido no passo 5

FRONTEND_URL="http://localhost:8080"
PORT=3000
NODE_ENV=development
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

## Rotas disponíveis

| Prefixo | Descrição |
|---|---|
| `POST /api/auth/register` | Cadastro |
| `POST /api/auth/login` | Login |
| `GET /api/auth/me` | Perfil autenticado |
| `PATCH /api/auth/plan` | Alteração de plano (upgrade/downgrade) |
| `GET /api/documents` | Listagem de documentos |
| `POST /api/payments/create-checkout-session` | Iniciar checkout Stripe |
| `POST /api/payments/webhook` | Webhook Stripe |
| `POST /api/payments/cancel-subscription` | Cancelar assinatura |
| `GET /api/clients` | Clientes do usuário |
| `GET /api/services` | Serviços do usuário |
| `GET /api/profile` | Perfil da empresa |
| `GET /api/admin/stats` | KPIs (admin only) |
| `GET /api/admin/users` | Lista de usuários (admin only) |
| `GET /api/admin/events` | Histórico de eventos de plano (admin only) |

---

## Scripts úteis

```bash
npm run dev           # servidor com hot-reload (tsx watch)
npm run typecheck     # checagem de tipos sem compilar
npm run test          # testes unitários
npm run test:coverage # cobertura de testes
npx prisma studio     # GUI do banco de dados
```
