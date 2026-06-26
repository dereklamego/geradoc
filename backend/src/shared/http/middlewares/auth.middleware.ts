import { jwtVerify } from 'jose';
import { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../../config/env.ts';
import { prisma } from '../../db/prisma.ts';
import { syncBilling } from '../../billing/billing.service.ts';
import { AUTH_COOKIE } from '../cookies.ts';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

// Reads the JWT from the httpOnly cookie. Falls back to the Authorization
// header for non-browser clients (e.g. API tooling, tests).
function extractToken(request: FastifyRequest): string | null {
    const cookieToken = request.cookies?.[AUTH_COOKIE];
    if (cookieToken) return cookieToken;

    const header = request.headers?.authorization;
    if (!header) return null;
    const [bearer, token] = header.split(' ');
    if (bearer !== 'Bearer' || !token) return null;
    return token;
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const token = extractToken(request);
    if (!token) {
        return reply.status(401).send({ error: 'Unauthorized', message: 'Missing token', code: 'UNAUTHORIZED' });
    }

    let payload: any;
    try {
        ({ payload } = await jwtVerify(token, JWT_SECRET));
    } catch (err: any) {
        request.log.warn({ url: request.url, errMsg: err?.message }, '[auth] jwtVerify failed');
        return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token', code: 'UNAUTHORIZED' });
    }

    (request as any).user = payload as UserPayload;

    // Lazy billing sync — billing failures must NOT log the user out
    try {
        const dbUser = await prisma.user.findUnique({ where: { id: payload.id } });
        if (dbUser) await syncBilling(dbUser);
    } catch (err) {
        request.log.error({ err }, 'syncBilling failed (non-fatal)');
    }
}
