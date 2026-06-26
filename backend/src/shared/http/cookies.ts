import { FastifyReply } from 'fastify';
import { env } from '../../config/env.ts';

// Name of the httpOnly cookie that carries the auth JWT.
export const AUTH_COOKIE = 'geradoc_token';

const isProd = env.NODE_ENV === 'production';

// One week, matching the JWT lifetime.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// SameSite=none is only honored alongside Secure, so force it on in that case
// even outside production (required for cross-subdomain app./api. setups).
const sameSite = env.COOKIE_SAMESITE;
const secure = isProd || sameSite === 'none';

// Shared base options so set and clear stay in sync (domain/path must match).
const baseOptions = {
    path: '/',
    sameSite,
    domain: env.COOKIE_DOMAIN, // e.g. '.geradoc.com.br' to share across subdomains
} as const;

// Sets the auth token as an httpOnly cookie. Not readable by JS (XSS-safe).
export function setAuthCookie(reply: FastifyReply, token: string): void {
    reply.setCookie(AUTH_COOKIE, token, {
        ...baseOptions,
        httpOnly: true,
        secure,
        maxAge: MAX_AGE_SECONDS,
    });
}

// Clears the auth cookie on logout.
export function clearAuthCookie(reply: FastifyReply): void {
    reply.clearCookie(AUTH_COOKIE, baseOptions);
}
