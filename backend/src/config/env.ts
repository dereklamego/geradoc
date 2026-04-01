import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    PORT: z.string().default('3000'),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_PREMIUM_PRICE_ID: z.string().optional(),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
}

export const env = result.data;
