import { AuthService } from '../../domains/auth/auth.service.ts';
import { AuthRepository } from '../../domains/auth/auth.repository.ts';
import { registerSchema, loginSchema } from '../../domains/auth/auth.schema.ts';
import { validate } from '../../shared/validate.ts';
import { response } from '../../shared/http/response.ts';
import { handleError } from '../../shared/http/errors.ts';
import { authenticate } from '../../shared/http/middlewares/auth.middleware.ts';
import { SignJWT } from 'jose';
import { env } from '../../config/env.ts';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const register = async (event: any) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const data = validate(registerSchema, body) as any;

        const user = await authService.register(data);

        const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        return response.success({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
        }, 201);
    } catch (error: any) {
        return handleError(error);
    }
};

export const login = async (event: any) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const data = validate(loginSchema, body) as any;

        const user = await authService.login(data);

        const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        return response.success({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
        });
    } catch (error: any) {
        return handleError(error);
    }
};

export const me = async (event: any) => {
    try {
        const userPayload = await authenticate(event);
        const user = await authService.getUserById(userPayload.id);

        return response.success({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            stripeCustomerId: user.stripeCustomerId,
            subscription: user.subscription ? {
                status: user.subscription.status,
                currentPeriodEnd: user.subscription.currentPeriodEnd,
            } : null,
        });
    } catch (error: any) {
        return handleError(error);
    }
};
