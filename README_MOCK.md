# Guia do Mock Backend (MSW)

Este projeto utiliza **MSW (Mock Service Worker)** para simular uma API REST completa em ambiente de desenvolvimento. Isso permite que o Front-end funcione de forma independente, com dados persistentes e regras de negócio reais, sem a necessidade de um servidor backend rodando.

## 🛠️ Como funciona?

O MSW intercepta todas as requisições de rede enviadas pelo navegador (usando `fetch` ou `axios`) e as redireciona para os **handlers** definidos localmente.

### Camadas do Mock:
1.  **`src/mocks/browser.ts`**: Configura o Service Worker no navegador.
2.  **`src/mocks/handlers.ts`**: Contém as rotas da API (Ex: `/api/clients`) e a lógica de resposta.
3.  **`src/mocks/db.ts`**: Gerencia a persistência dos dados no `localStorage`.

---

## 💾 Persistência de Dados

Diferente de mocks tradicionais que vresetam ao atualizar a página, este mock utiliza o **LocalStorage** do seu navegador.

- **Storage Keys**: `geradoc_mock_users`, `geradoc_mock_clients`, `geradoc_mock_documents`.
- **Efeito**: Se você cadastrar um cliente, ele estará lá mesmo após reiniciar o computador ou atualizar o browser.

### Como resetar os dados?
Para voltar ao estado inicial (Seed Data):
1.  Abra o **Console do Desenvolvedor** (F12).
2.  Execute: `localStorage.clear()`.
3.  Atualize a página.

---

## ⏱️ Simulação de Rede

Para testar a experiência do usuário (UX), adicionamos um **delay artificial** em todas as rotas:
- **Delay padrão**: 500ms a 1200ms.
- Isso permite visualizar Skeletons, Spinners e estados de desabilitado em botões durante o salvamento.

---

## 🚦 Regras de Negócio Implementadas

O Mock não apenas retorna dados, ele valida ações:

- **Limite de Plano Gratuito**: Se você estiver logado como `user@geradoc.com` (Plano Free) e tentar gerar um terceiro documento, o mock retornará um erro **403 Forbidden**.
- **IDs Automáticos**: Novos clientes e documentos ganham UUIDs e números de registro automáticos.
- **Data de Registro**: O campo `date` é preenchido automaticamente com o timestamp atual (ISO format).

---

## 🚀 Como adicionar novos Mocks?

Se você criar uma nova tela que precise de dados:

1.  Vá em `src/mocks/handlers.ts`.
2.  Adicione um novo `http.get` ou `http.post`.
3.  Use o `delay()` para manter o realismo.
4.  Se precisar salvar dados, use a estrutura em `src/mocks/db.ts`.

---

## ⚠️ Nota de Segurança

O MSW está configurado para rodar **APENAS em modo de desenvolvimento** (`import.meta.env.DEV`). 
O arquivo de produção (build) não incluirá o Service Worker nem interceptará chamadas reais de API, garantindo que o app aponte para o backend oficial em staging/produção.
