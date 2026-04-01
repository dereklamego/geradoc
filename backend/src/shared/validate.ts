// Shared Zod validation helper
import { ZodSchema } from 'zod';

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        const messages = result.error.issues.map((e) => e.message).join(', ');
        const err: any = new Error(messages);
        err.statusCode = 400;
        err.validation = result.error.issues;
        throw err;
    }

    return result.data;
}
