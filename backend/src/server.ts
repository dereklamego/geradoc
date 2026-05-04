import { buildApp } from './app.ts';
import { env } from './config/env.ts';

async function start() {
    const app = await buildApp();
    const port = parseInt(env.PORT, 10) || 3000;

    try {
        await app.listen({ port, host: '0.0.0.0' });
        console.log(`🚀 GeraDoc API running on http://localhost:${port}`);
        console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

start();
