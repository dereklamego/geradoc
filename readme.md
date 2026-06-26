# GeraDoc — Frontend

Interface web do GeraDoc, construída com React, Vite e TypeScript.

---

## Pré-requisitos

- Node.js 22+
- Backend GeraDoc rodando em `http://localhost:3000` (veja `backend/README.md`)

---

## 1. Instalar dependências

```bash
npm install
```

---

## 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=/api
```

O Vite já está configurado para fazer proxy de `/api` → `http://localhost:3000`, então você não precisa alterar isso em desenvolvimento.

---

## 3. Rodar em desenvolvimento

```bash
npm run dev
```

Frontend disponível em `http://localhost:8080`.

> O backend precisa estar rodando antes de abrir o frontend. Siga o `backend/README.md` primeiro.

---

## 4. Build para produção

```bash
npm run build    # gera a pasta dist/
npm run preview  # serve a build localmente para validação
```

---

## Usuários de teste

Após rodar o seed do backend (`npx prisma db seed`), estes usuários estarão disponíveis (senha `123456` para todos):

| E-mail | Plano | Acesso |
|---|---|---|
| free@geradoc.com | Gratuito | `/app/*` |
| pro@geradoc.com | Profissional | `/app/*` |
| admin@geradoc.com | Empresarial | `/app/*` e `/admin/*` |

---

## Estrutura de rotas

| Rota | Descrição |
|---|---|
| `/login` | Login |
| `/register` | Cadastro |
| `/app/dashboard` | Dashboard principal |
| `/app/documentos` | Lista de documentos |
| `/app/gerador` | Gerador de documentos |
| `/app/clientes` | Gestão de clientes |
| `/app/servicos` | Catálogo de serviços |
| `/app/assinatura` | Planos e assinatura |
| `/app/perfil` | Perfil da empresa |
| `/admin` | Painel administrativo (role ADMIN) |

---

## Pagamentos (Stripe — modo teste)

O frontend redireciona para o Stripe Checkout ao fazer upgrade. Para o fluxo funcionar localmente o backend precisa estar com o webhook ativo (ver `backend/README.md`).

Cartões de teste:

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Aprovado |
| `4000 0000 0000 0002` | Recusado |
| `4000 0025 0000 3155` | Requer 3D Secure |

Qualquer data futura e qualquer CVV de 3 dígitos funcionam.
