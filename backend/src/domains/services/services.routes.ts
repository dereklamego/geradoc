import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../shared/db/prisma.ts';

async function jwtAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }
}

export async function servicesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', jwtAuth);

    app.get('/', async (request, reply) => {
        const userId = (request.user as any).id;
        const services = await prisma.service.findMany({ where: { userId } });
        return reply.send(services);
    });

    app.post('/', async (request, reply) => {
        const userId = (request.user as any).id;
        const data = request.body as any;
        const service = await prisma.service.create({
            data: {
                ...data,
                userId,
            },
        });
        return reply.status(201).send(service);
    });

    app.patch('/:id', async (request, reply) => {
        const userId = (request.user as any).id;
        const { id } = request.params as { id: string };
        const data = request.body as any;
        const service = await prisma.service.findFirst({ where: { id, userId } });
        if (!service) {
            return reply.status(404).send({ message: 'Service not found' });
        }
        const updated = await prisma.service.update({
            where: { id },
            data,
        });
        return reply.send(updated);
    });

    app.delete('/:id', async (request, reply) => {
        const userId = (request.user as any).id;
        const { id } = request.params as { id: string };
        const service = await prisma.service.findFirst({ where: { id, userId } });
        if (!service) {
             return reply.status(404).send({ message: 'Service not found' });
        }
        await prisma.service.delete({ where: { id } });
        return reply.status(204).send();
    });
}
