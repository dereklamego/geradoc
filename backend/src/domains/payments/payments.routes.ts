import { FastifyInstance } from 'fastify';
import { PaymentService } from './payments.service.ts';
import { StripeProvider } from './providers/stripe.provider.ts';

export async function paymentsRoutes(app: FastifyInstance) {
    const stripeProvider = new StripeProvider();
    const paymentService = new PaymentService(stripeProvider);

    // Create Checkout Session
    app.post(
        '/create-checkout-session',
        {
            preHandler: [app.authenticate],
            schema: {
                description: 'Cria uma sessão de checkout no Stripe',
                tags: ['payments'],
                security: [{ bearerAuth: [] }],
                body: {
                    type: 'object',
                    required: ['plan', 'billingCycle'],
                    properties: {
                        plan: { type: 'string' },
                        billingCycle: { type: 'string' },
                    },
                },
            },
        },
        async (request, reply) => {
            const data = request.body as { plan: string; billingCycle: string };
            const userId = (request as any).user.id;
            
            const result = await paymentService.createCheckoutSession(userId, data.plan, data.billingCycle);
            return reply.send(result);
        }
    );

    // Cancel Subscription
    app.post(
        '/cancel-subscription',
        {
            preHandler: [app.authenticate],
            schema: {
                description: 'Cancela a assinatura atual ao fim do período',
                tags: ['payments'],
                security: [{ bearerAuth: [] }],
            },
        },
        async (request, reply) => {
            const userId = (request as any).user.id;
            const result = await paymentService.cancelSubscription(userId);
            return reply.send(result);
        }
    );

    // Stripe Webhook (Raw Body Processing in Route via config or global plugin)
    app.post(
        '/webhook',
        {
            config: {
                rawBody: true, // Tells fastify-raw-body to store rawBuffer in request.rawBody
            },
            schema: {
                description: 'Endpoint para o Stripe Webhook',
                tags: ['payments', 'webhook'],
            },
        },
        async (request, reply) => {
            try {
                const signature = request.headers['stripe-signature'];
                if (!signature) {
                    return reply.status(400).send({ error: 'Missing Stripe signature header' });
                }

                // If fastify-raw-body is registered, the raw buffer sits in request.rawBody
                const rawBuffer = (request as any).rawBody;
                if (!rawBuffer) {
                    return reply.status(400).send({ error: 'Raw body missing' });
                }

                const result = await paymentService.handleWebhook(rawBuffer, signature as string);
                return reply.send(result);
            } catch (error: any) {
                app.log.error(error);
                return reply.status(400).send({ error: error.message });
            }
        }
    );
}
