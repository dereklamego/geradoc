# Stripe — Próximos passos para fechar o setup local

Stripe CLI já está instalado (`stripe version 1.40.9`). Falta só ligar o webhook no `.env` e validar o fluxo end-to-end.

---

## 1. Autenticar o Stripe CLI (uma vez)

```bash
stripe login
```

Vai abrir o navegador, autorize no Dashboard, volte ao terminal. A autenticação fica salva em `~/.config/stripe/`.

---

## 2. Iniciar o forwarder de webhooks

Em um **terminal separado** (mantenha aberto enquanto desenvolve):

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Saída esperada:
```
> Ready! You are using Stripe API Version [...]. Your webhook signing secret is whsec_xxxxx...
```

**Copie o `whsec_xxxxx`.**

---

## 3. Atualizar `.env` do backend

Em `backend/.env`, substitua a linha vazia:

```diff
- STRIPE_WEBHOOK_SECRET=""
+ STRIPE_WEBHOOK_SECRET="whsec_xxxxx..."
```

> ⚠️ Esse secret **muda toda vez** que você roda `stripe listen`. Ao reiniciar o CLI, atualize o `.env` e reinicie o backend.

---

## 4. Reiniciar o backend

No terminal do backend: `Ctrl+C` e:

```bash
npm run dev
```

---

## 5. Testar fluxo completo no navegador

1. Login com `free@geradoc.com` / `123456` (já está com plano FREE limpo)
2. Vá em `/app/assinatura`
3. Clique em **"Assinar agora"** no Profissional ou Empresarial
4. Vai para o Stripe Checkout. Use o cartão de teste:
   - Número: `4242 4242 4242 4242`
   - MM/AA: qualquer data futura (ex: `12/34`)
   - CVC: qualquer 3 dígitos (ex: `123`)
   - CEP: qualquer válido (ex: `12345`)
5. Confirma → redireciona para `/app/assinatura?success=true`
6. Banner "aguardando ativação" aparece
7. Webhook chega via CLI → `syncSubscription` atualiza o user → polling do front pega → toast verde "Plano ativado!"

---

## 6. Verificar que tudo está consistente

Você deve ver:
- No **terminal do `stripe listen`**: linhas `[200] POST .../webhook [evt_...]`
- No **terminal do backend**: `Processando Webhook: checkout.session.completed` e `customer.subscription.created/updated`
- No **Stripe Dashboard** (modo teste): https://dashboard.stripe.com/test/payments — sua transação aparece
- No **frontend**: badge muda de "Gratuito" para "Profissional", barra de uso atualiza, método de pagamento mostra `Visa •••• 4242`

---

## 7. Cenários para testar adicionais

### Reprocessar pagamento perdido
Se algum pagamento foi feito antes do webhook estar configurado:
1. Stripe Dashboard → **Developers → Events**
2. Encontre o `checkout.session.completed`
3. Clica → **Resend** → seleciona seu endpoint local

### Disparar eventos manualmente
```bash
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
```

### Cartões para outros cenários
| Número | Cenário |
|---|---|
| `4242 4242 4242 4242` | Aprovado |
| `4000 0000 0000 0002` | Recusado |
| `4000 0000 0000 9995` | Saldo insuficiente |
| `4000 0025 0000 3155` | Requer 3D Secure |

### Cancelamento de assinatura
1. Já assinado, abra `/app/perfil` ou `/app/assinatura`
2. Card de status → botão **"Cancelar assinatura"**
3. Backend chama `subscriptions.update({ cancel_at_period_end: true })`
4. Webhook `customer.subscription.updated` chega → `cancelAtPeriodEnd: true` salvo
5. Badge muda pra **"Cancelando"** (vermelho), banner mostra "Sua assinatura será cancelada em DD de mês"

### Customer Portal (gerenciar cartão)
1. Card de status → botão **"Gerenciar"** ou **"Adicionar cartão"** no método de pagamento
2. Redireciona para o Stripe-hosted Customer Portal
3. **Pré-requisito**: ativar o portal em Stripe Dashboard → Settings → Billing → Customer portal (uma vez)

---

## 8. Downgrade (sem Stripe)

Downgrade continua **lazy local** — não cria nada no Stripe:
1. `/app/assinatura` → clica num plano inferior
2. Modal de confirmação abre com comparação
3. Confirmando → `auth.changePlan` agenda mudança para `currentPeriodEnd`
4. Banner amarelo aparece em ambas as páginas
5. Pode cancelar a mudança a qualquer momento via botão "Cancelar mudança"

---

## Variáveis obrigatórias no `.env`

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...        (ou STRIPE_API_KEY)
STRIPE_WEBHOOK_SECRET=whsec_...      ← muda a cada `stripe listen`
FRONTEND_URL=http://localhost:8080   ← mesmo host:porta que o Vite
PORT=3000
```

---

## Checklist final

- [ ] `stripe login` feito
- [ ] `stripe listen` rodando em terminal dedicado
- [ ] `STRIPE_WEBHOOK_SECRET` atualizado no `.env`
- [ ] Backend reiniciado
- [ ] Customer Portal ativado no Dashboard (Settings → Billing → Customer portal)
- [ ] Pagamento de teste com `4242 4242 4242 4242` funciona
- [ ] Plano atualiza no front automaticamente
- [ ] Cancelamento e gerenciar cartão funcionam
