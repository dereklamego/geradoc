import serverless from 'serverless-http';
import { buildApp } from './app.ts';
import { FastifyInstance } from 'fastify';

let app: FastifyInstance;

export const handler = async (event: any, context: any) => {
    if (!app) {
        app = await buildApp();
        await app.ready();
    }
    const serverlessHandler = serverless(app as any);
    return serverlessHandler(event, context);
};
