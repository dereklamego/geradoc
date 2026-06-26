import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    PORT: z.string().default('3000'),
    STRIPE_PUBLIC_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_API_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    // Auth cookie tuning. For front/back on different subdomains
    // (app.example.com / api.example.com) use SameSite=none + Secure and set
    // COOKIE_DOMAIN=.example.com so the cookie is shared across subdomains.
    COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
    COOKIE_DOMAIN: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
}

export const env = {
    ...result.data,
    // Allow STRIPE_API_KEY as alias (legacy naming)
    STRIPE_SECRET_KEY: result.data.STRIPE_SECRET_KEY ?? result.data.STRIPE_API_KEY,
};
