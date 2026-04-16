import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../shared/db/prisma.ts';

async function jwtAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }
}

export async function clientsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', jwtAuth);

    app.get('/', async (request, reply) => {
        const userId = (request.user as any).id;
        const clients = await prisma.client.findMany({ where: { userId } });
        return reply.send(clients);
    });

    app.post('/', async (request, reply) => {
        const userId = (request.user as any).id;
        const data = request.body as any;
        const client = await prisma.client.create({
            data: {
                ...data,
                userId,
            },
        });
        return reply.status(201).send(client);
    });

    app.patch('/:id', async (request, reply) => {
        const userId = (request.user as any).id;
        const { id } = request.params as { id: string };
        const data = request.body as any;
        const client = await prisma.client.findFirst({ where: { id, userId } });
        if (!client) {
            return reply.status(404).send({ message: 'Client not found' });
        }
        const updated = await prisma.client.update({
            where: { id },
            data,
        });
        return reply.send(updated);
    });

    app.delete('/:id', async (request, reply) => {
        const userId = (request.user as any).id;
        const { id } = request.params as { id: string };
        const client = await prisma.client.findFirst({ where: { id, userId } });
        if (!client) {
             return reply.status(404).send({ message: 'Client not found' });
        }
        await prisma.client.delete({ where: { id } });
        return reply.status(204).send();
    });
}
