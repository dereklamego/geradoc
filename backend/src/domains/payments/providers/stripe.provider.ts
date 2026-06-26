import Stripe from 'stripe';
import { env } from '../../../config/env.ts';

export class StripeProvider {
    private stripe: Stripe | null = null;

    constructor() {
        if (env.STRIPE_SECRET_KEY) {
            this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
                apiVersion: '2023-10-16' as any,
                appInfo: { name: 'GeraDoc SaaS' },
            });
        }
    }

    public getClient(): Stripe {
        if (!this.stripe) {
            throw new Error('Stripe is not configured. STRIPE_SECRET_KEY is missing.');
        }
        return this.stripe;
    }

    async createCheckoutSession(args: {
        userId: string;
        priceId: string;
        successUrl: string;
        cancelUrl: string;
        customerId?: string | null;
        customerEmail?: string;
    }) {
        const stripe = this.getClient();

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            client_reference_id: args.userId,
            // Reuse existing customer if any; otherwise let Stripe create one and tie email
            ...(args.customerId
                ? { customer: args.customerId }
                : args.customerEmail ? { customer_email: args.customerEmail } : {}),
            line_items: [{ price: args.priceId, quantity: 1 }],
            subscription_data: {
                metadata: { userId: args.userId },
            },
            metadata: { userId: args.userId },
            success_url: args.successUrl,
            cancel_url: args.cancelUrl,
            allow_promotion_codes: true,
        });

        return session;
    }

    async cancelSubscription(subscriptionId: string) {
        const stripe = this.getClient();
        return stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
    }

    async retrieveSubscription(subscriptionId: string) {
        const stripe = this.getClient();
        return stripe.subscriptions.retrieve(subscriptionId);
    }

    /**
     * Creates (or reuses) a Stripe Customer for users that don't have one yet.
     * Useful before creating a portal session for users on FREE plan.
     */
    async ensureCustomer(args: { customerId?: string | null; email: string; name?: string; userId: string }) {
        const stripe = this.getClient();
        if (args.customerId) {
            try {
                const c = await stripe.customers.retrieve(args.customerId);
                if (!('deleted' in c) || !c.deleted) return c.id;
            } catch {
                // fall through to create
            }
        }
        const created = await stripe.customers.create({
            email: args.email,
            name: args.name,
            metadata: { userId: args.userId },
        });
        return created.id;
    }

    async createPortalSession(customerId: string, returnUrl: string) {
        const stripe = this.getClient();
        return stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
    }

    /**
     * Returns the default payment method (card) for a customer, or null.
     * Reads invoice_settings.default_payment_method first, then falls back to listing.
     */
    async getDefaultPaymentMethod(customerId: string) {
        const stripe = this.getClient();
        const customer = await stripe.customers.retrieve(customerId);
        if ('deleted' in customer && customer.deleted) return null;

        const defaultPmId = (customer as Stripe.Customer).invoice_settings?.default_payment_method;
        if (defaultPmId && typeof defaultPmId === 'string') {
            return stripe.paymentMethods.retrieve(defaultPmId);
        }

        const list = await stripe.paymentMethods.list({ customer: customerId, type: 'card', limit: 1 });
        return list.data[0] ?? null;
    }
}

