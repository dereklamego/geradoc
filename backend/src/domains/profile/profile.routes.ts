import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ProfileRepository } from './profile.repository.ts';
import { ProfileService } from './profile.service.ts';

const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    document: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

const updateLogoSchema = z.object({
    base64: z.string()
        .refine((v) => v.startsWith('data:image/'), 'Must be a base64 image data URL')
        .refine((v) => {
            const bytes = Buffer.from(v.split(',')[1] ?? '', 'base64').length;
            return bytes <= 300 * 1024; // 300 KB after compression
        }, 'Image exceeds 300 KB after compression'),
});

export async function profileRoutes(app: FastifyInstance) {
    const service = new ProfileService(new ProfileRepository());

    app.get('/', { preHandler: [app.authenticate] }, async (request) => {
        const userId = (request as any).user.id;
        return service.getProfile(userId);
    });

    app.patch('/', { preHandler: [app.authenticate] }, async (request, reply) => {
        const userId = (request as any).user.id;
        const data = updateProfileSchema.parse(request.body);
        const profile = await service.updateProfile(userId, data);
        return reply.send(profile);
    });

    app.patch('/logo', { preHandler: [app.authenticate] }, async (request, reply) => {
        const userId = (request as any).user.id;
        const { base64 } = updateLogoSchema.parse(request.body);
        const result = await service.updateLogo(userId, base64);
        return reply.send(result);
    });
}
