import { PaymentService } from '../../domains/payments/payments.service.ts';
import { StripeProvider } from '../../domains/payments/providers/stripe.provider.ts';
import { response } from '../../shared/http/response.ts';
import { handleError } from '../../shared/http/errors.ts';
import { authenticate } from '../../shared/http/middlewares/auth.middleware.ts';

const stripeProvider = new StripeProvider();
const paymentService = new PaymentService(stripeProvider);

export const getPlans = async () => {
    try {
        const plans = await paymentService.getPlans();
        return response.success(plans);
    } catch (error: any) {
        return handleError(error);
    }
};

export const createCheckout = async (event: any) => {
    try {
        const user = await authenticate(event);
        const body = JSON.parse(event.body || '{}');
        if (!body.priceId) throw new Error('priceId is required');

        const result = await paymentService.createCheckoutSession(user.id, body.priceId);
        return response.success(result);
    } catch (error: any) {
        return handleError(error);
    }
};

export const createPortal = async (event: any) => {
    try {
        const user = await authenticate(event);
        const result = await paymentService.createPortalSession(user.id);
        return response.success(result);
    } catch (error: any) {
        return handleError(error);
    }
};

export const webhook = async (event: any) => {
    try {
        const signature = event.headers?.['stripe-signature'];
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

        await paymentService.handleWebhook(body, signature);
        return response.success({ received: true });
    } catch (error: any) {
        return handleError(error);
    }
};
