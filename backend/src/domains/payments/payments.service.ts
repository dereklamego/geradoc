import Stripe from 'stripe';
import { StripeProvider } from './providers/stripe.provider.ts';
import { prisma } from '../../shared/db/prisma.ts';
import { env } from '../../config/env.ts';

const priceMap: Record<string, Record<string, string>> = {
    PROFISSIONAL: {
        monthly: 'price_1TLwd6A0OtV1xbr3fPfck816',
        quarterly: 'price_1TLwhfA0OtV1xbr3Wdva7qR0',
        yearly: 'price_1TLwpUA0OtV1xbr3t4vyqNFS',
    },
    EMPRESARIAL: {
        monthly: 'price_1TLwfIA0OtV1xbr3sCGL32aT',
        quarterly: 'price_1TLwjvA0OtV1xbr31kanzs0l',
        yearly: 'price_1TLwqjA0OtV1xbr31QwZ2vMr',
    }
};

function getPlanInfoByPriceId(priceId: string) {
    for (const [plan, cycles] of Object.entries(priceMap)) {
        for (const [cycle, id] of Object.entries(cycles)) {
            if (id === priceId) return { plan, billingCycle: cycle };
        }
    }
    return { plan: 'FREE', billingCycle: null };
}

export class PaymentService {
    constructor(private stripeProvider: StripeProvider) { }

    async createCheckoutSession(userId: string, plan: string, billingCycle: string) {
        if (plan === 'FREE') {
            throw new Error('O plano FREE não requer cobrança no Stripe.');
        }

        const planConfig = priceMap[plan.toUpperCase()];
        if (!planConfig) throw new Error('Plano inválido.');

        const priceId = planConfig[billingCycle.toLowerCase()];
        if (!priceId) throw new Error('Ciclo de cobrança inválido.');

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuário não encontrado.');

        const successUrl = `${env.FRONTEND_URL}/app/assinatura?success=true&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${env.FRONTEND_URL}/app/assinatura?canceled=true`;

        const session = await this.stripeProvider.createCheckoutSession({
            userId,
            priceId,
            successUrl,
            cancelUrl,
            customerId: user.stripeCustomerId,
            customerEmail: user.email,
        });
        return { url: session.url };
    }

    async createPortalSession(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuário não encontrado.');

        const customerId = await this.stripeProvider.ensureCustomer({
            customerId: user.stripeCustomerId,
            email: user.email,
            name: user.name,
            userId: user.id,
        });

        if (customerId !== user.stripeCustomerId) {
            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId: customerId },
            });
        }

        const returnUrl = `${env.FRONTEND_URL}/app/perfil`;
        const session = await this.stripeProvider.createPortalSession(customerId, returnUrl);
        return { url: session.url };
    }

    async getPaymentMethod(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.stripeCustomerId) return { paymentMethod: null };

        const pm = await this.stripeProvider.getDefaultPaymentMethod(user.stripeCustomerId);
        if (!pm || !pm.card) return { paymentMethod: null };

        return {
            paymentMethod: {
                brand: pm.card.brand,
                last4: pm.card.last4,
                expMonth: pm.card.exp_month,
                expYear: pm.card.exp_year,
            },
        };
    }

    async cancelSubscription(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });

        if (!user || !user.stripeSubscriptionId) {
            throw new Error('Usuário não possui assinatura ativa no Stripe.');
        }

        const subscription = await this.stripeProvider.cancelSubscription(user.stripeSubscriptionId);

        const sub = await prisma.subscription.update({
            where: { userId },
            data: { cancelAtPeriodEnd: true },
        });

        const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
        await prisma.planEvent.create({
            data: {
                userId,
                fromPlan: dbUser?.plan ?? 'UNKNOWN',
                toPlan: 'FREE',
                eventType: 'cancel',
                actorId: userId,
                metadata: { cancelAt: sub.currentPeriodEnd.toISOString() },
            },
        });

        return { message: 'Assinatura cancelada com sucesso. Você ainda tem acesso até o fim do período atual.' };
    }

    async handleWebhook(rawBody: string | Buffer, signature: string) {
        if (!env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('Missing Stripe Webhook Secret');
        }

        const stripe = this.stripeProvider.getClient();
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        // Idempotency Check
        const existingEvent = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
        if (existingEvent) {
            console.log(`Evento ${event.id} já foi processado. Ignorando.`);
            return { received: true };
        }
        await prisma.stripeEvent.create({ data: { id: event.id, type: event.type } });

        console.log(`Processando Webhook: ${event.type}`);

        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object as Stripe.Checkout.Session;
                    const userId = session.client_reference_id;
                    if (userId && session.subscription) {
                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                stripeCustomerId: session.customer as string,
                                stripeSubscriptionId: session.subscription as string,
                            }
                        });
                        await this.syncSubscription(session.subscription as string, userId);
                    }
                    break;
                }
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted': {
                    const subscription = event.data.object as Stripe.Subscription;
                    await this.syncSubscription(subscription.id);
                    break;
                }
                case 'invoice.payment_succeeded': {
                    const invoice = event.data.object as Stripe.Invoice;
                    if (invoice.subscription) {
                        await this.syncSubscription(invoice.subscription as string);
                    }
                    break;
                }
                case 'invoice.payment_failed': {
                    const invoice = event.data.object as Stripe.Invoice;
                    if (invoice.subscription) {
                        await this.syncSubscription(invoice.subscription as string);
                    }
                    break;
                }
            }
        } catch (err: any) {
            console.error(`Erro ao processar evento ${event.type}:`, err);
            // Re-throw if critical, otherwise swallow to ack Stripe
            throw err;
        }

        return { received: true };
    }

    private async syncSubscription(subscriptionId: string, providedUserId?: string) {
        const stripeSubscription = await this.stripeProvider.retrieveSubscription(subscriptionId);
        
        let userId = providedUserId;
        if (!userId) {
            const user = await prisma.user.findFirst({
                where: { stripeSubscriptionId: subscriptionId }
            });
            if (!user) {
                console.log(`Usuário não encontrado para subscription ${subscriptionId}`);
                return;
            }
            userId = user.id;
        }

        const priceId = stripeSubscription.items.data[0]?.price.id;
        const { plan, billingCycle } = getPlanInfoByPriceId(priceId);

        let activePlan = plan;
        if (stripeSubscription.status === 'canceled' || stripeSubscription.status === 'unpaid') {
            activePlan = 'FREE';
        }

        const newPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
        const newPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

        // Read current cycle to detect renewal (reset usage when period rolls)
        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        const cycleRolled = !dbUser
            || !dbUser.currentPeriodStart
            || newPeriodStart.getTime() > dbUser.currentPeriodStart.getTime();

        // Order: cycle → usage reset → plan/status
        await prisma.user.update({
            where: { id: userId },
            data: {
                currentPeriodStart: newPeriodStart,
                currentPeriodEnd: newPeriodEnd,
                ...(cycleRolled ? { monthlyUsage: 0 } : {}),
                plan: activePlan as any,
                stripeCustomerId: stripeSubscription.customer as string,
                stripeSubscriptionId: subscriptionId,
            }
        });

        await prisma.subscription.upsert({
            where: { userId },
            create: {
                userId,
                status: stripeSubscription.status,
                priceId: priceId,
                billingCycle: billingCycle,
                currentPeriodEnd: newPeriodEnd,
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            },
            update: {
                status: stripeSubscription.status,
                priceId: priceId,
                billingCycle: billingCycle,
                currentPeriodEnd: newPeriodEnd,
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            }
        });
    }
}
