import { JWT } from '@fastify/jwt';

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }
    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: string;
            email: string;
            role: string;
        };
    }
}
