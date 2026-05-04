import Fastify, { FastifyInstance, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ZodError } from 'zod';
import * as dotenv from 'dotenv';
import fastifyRawBody from 'fastify-raw-body';
import { authRoutes } from './domains/auth/auth.routes.ts';
import { documentRoutes } from './domains/documents/documents.routes.ts';
import { paymentsRoutes } from './domains/payments/payments.routes.ts';
import { clientsRoutes } from './domains/clients/clients.routes.ts';
import { servicesRoutes } from './domains/services/services.routes.ts';
import { profileRoutes } from './domains/profile/profile.routes.ts';
import { adminRoutes } from './domains/admin/admin.routes.ts';
import { authenticate } from './shared/http/middlewares/auth.middleware.ts';
import { env } from './config/env.ts';

dotenv.config();

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: true,
    });

    // Security Plugins
    await app.register(helmet);
    await app.register(cors, {
        origin: '*', // Permite de qualquer frontend (temporário/desenvolvimento)
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // Provide raw body buffering for Stripe Webhooks securely.
    // Must run BEFORE the JSON body parser consumes the stream.
    await app.register(fastifyRawBody, {
        field: 'rawBody',
        global: false,
        encoding: false,    // keep as Buffer
        runFirst: true,     // intercept before preParsing hooks
        routes: ['/api/payments/webhook'], // explicit allow-list
    });

    // Authentication Plugin — uses validated env (no silent fallback)
    await app.register(jwt, { secret: env.JWT_SECRET });
    app.log.info({ jwtSecretLen: env.JWT_SECRET.length }, '[boot] JWT plugin registered');

    // Swagger Documentation
    await app.register(swagger, {
        openapi: {
            info: {
                title: 'GeraDoc API',
                description: 'Backend for GeraDoc Application',
                version: '1.0.0',
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 3000}`,
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        },
    });

    await app.register(swaggerUi, {
        routePrefix: '/docs',
    });

    // Global Error Handler
    app.setErrorHandler((error: FastifyError, _request, reply) => {
        if (error instanceof ZodError) {
            return reply.status(400).send({
                error: 'Validation Error',
                message: 'Invalid input data',
                code: 'BAD_REQUEST',
                issues: error.issues,
            });
        }

        if (error.statusCode) {
            return reply.status(error.statusCode).send({
                error: error.name,
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR',
            });
        }

        app.log.error(error);
        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred.',
            code: 'INTERNAL_SERVER_ERROR',
        });
    });

    // Decorated Authenticate Middleware
    app.decorate('authenticate', authenticate);

    // Routes
    await app.register(authRoutes, { prefix: '/api/auth' });
    await app.register(documentRoutes, { prefix: '/api/documents' });
    await app.register(paymentsRoutes, { prefix: '/api/payments' });
    await app.register(clientsRoutes, { prefix: '/api/clients' });
    await app.register(servicesRoutes, { prefix: '/api/services' });
    await app.register(profileRoutes, { prefix: '/api/profile' });
    await app.register(adminRoutes, { prefix: '/api/admin' });

    // Health Check
    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
};
