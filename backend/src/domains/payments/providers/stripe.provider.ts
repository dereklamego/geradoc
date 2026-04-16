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

    async createCheckoutSession(userId: string, priceId: string, successUrl: string, cancelUrl: string) {
        const stripe = this.getClient();
        
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            client_reference_id: userId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
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
}

