import { jwtVerify } from 'jose';
import { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../../config/env.ts';
import { prisma } from '../../db/prisma.ts';
import { syncBilling } from '../../billing/billing.service.ts';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const header = request.headers?.authorization;
    if (!header) {
        request.log.warn({ url: request.url }, '[auth] no Authorization header');
        return reply.status(401).send({ error: 'Unauthorized', message: 'Missing token', code: 'UNAUTHORIZED' });
    }

    const [bearer, token] = header.split(' ');
    if (bearer !== 'Bearer' || !token) {
        request.log.warn({ url: request.url, header: header.slice(0, 30) }, '[auth] bad bearer format');
        return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid auth header', code: 'UNAUTHORIZED' });
    }

    let payload: any;
    try {
        ({ payload } = await jwtVerify(token, JWT_SECRET));
    } catch (err: any) {
        request.log.warn({ url: request.url, errMsg: err?.message, tokenPrefix: token.slice(0, 20) }, '[auth] jwtVerify failed');
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
