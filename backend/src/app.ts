import Fastify, { FastifyInstance, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ZodError } from 'zod';
import * as dotenv from 'dotenv';
import { authRoutes } from './domains/auth/auth.routes.ts';
import { documentRoutes } from './domains/documents/documents.routes.ts';
import { authenticate } from './shared/http/middlewares/auth.middleware.ts';

dotenv.config();

export const buildApp = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: true,
    });

    // Security Plugins
    await app.register(helmet);
    await app.register(cors);

    // Authentication Plugin
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || 'fallback_secret',
    });

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

    // Health Check
    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    return app;
};
