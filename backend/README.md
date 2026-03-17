# GeraDoc Backend - Guia de Configuração

Este diretório contém a implementação do backend para o projeto GeraDoc, focada em segurança, performance e escalabilidade.

## 🚀 Tecnologias
- **Node.js**: v22+
- **Framework**: Fastify
- **Banco de Dados**: PostgreSQL + Prisma
- **Validação**: Zod
- **Segurança**: JWT + Argon2

---

## 🛠️ Como Configurar

### 1. Instalar Dependências
Navegue até a pasta `backend` (se já não estiver nela) e execute:
```bash
npm install
```

### 2. Configurar o Banco de Dados (PostgreSQL)

Para que o backend funcione, você deve garantir que possui uma instância do PostgreSQL ativa:

1.  **Instância Ativa**: Certifique-se de que o PostgreSQL está rodando localmente no seu sistema ou via **Docker**.
    - Se usar Docker, você pode subir um banco rapidamente com:
      ```bash
      docker run --name geradoc-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
      ```
2.  **Configurar Variáveis**: O arquivo `.env` já foi criado na pasta `backend`. Ajuste a linha `DATABASE_URL` com suas credenciais:
    ```env
    DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/geradoc?schema=public"
    ```

### 3. Migração e Prisma Client
Com o banco rodando e o `.env` configurado, execute o comando abaixo para criar as tabelas e gerar o cliente de consulta:
```bash
# Execute dentro da pasta /backend
npx prisma migrate dev --name init
```

### 4. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3000`.

---

## 📖 Documentação da API
Uma vez que o servidor esteja rodando, você pode acessar a documentação interativa (Swagger) em:
`http://localhost:3000/docs`

---

## ✅ Funcionalidades Implementadas
- [x] Template de variáveis de ambiente (`.env`).
- [x] Schema do banco de dados (Prisma) completo.
- [x] Inicialização do servidor Fastify com plugins de segurança e documentação.
- [x] Módulo de Autenticação (Registro, Login, Perfil).
- [x] Middleware de proteção de rotas via JWT.

## 🔜 Próximos Passos
1.  **Módulo de Pagamentos (Stripe)**: Criação de sessões de checkout e webhook para confirmação de planos.
2.  **Módulo de Documentos**: CRUD completo com isolamento de usuário e sistema de rascunhos (Auto-save).
3.  **Sistema de Paywall**: Travas de limite (5 documentos para Free) e acesso a templates Premium.
4.  **Exportação**: Geração dinâmica de PDFs dos orçamentos e recibos.
