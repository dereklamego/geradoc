import { jwtVerify } from 'jose';
import { env } from '../../../config/env.ts';

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export async function authenticate(event: any): Promise<UserPayload> {
    const header = event.headers?.authorization || event.headers?.Authorization;
    if (!header) {
        throw new Error('UNAUTHORIZED');
    }

    const [bearer, token] = header.split(' ');
    if (bearer !== 'Bearer' || !token) {
        throw new Error('UNAUTHORIZED');
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as UserPayload;
    } catch (error) {
        throw new Error('UNAUTHORIZED');
    }
}
