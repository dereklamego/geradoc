import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DocumentService } from './documents.service.ts';
import { DocumentRepository } from './documents.repository.ts';

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);

// Fastify preHandler for JWT verification (uses @fastify/jwt)
async function jwtAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }
}

export async function documentRoutes(app: FastifyInstance) {
    // All routes require authentication
    app.addHook('preHandler', jwtAuth);

    // GET /api/documents
    app.get('/', async (request, reply) => {
        const query: any = request.query;
        const result = await documentService.list(
            (request.user as any).id,
            Number(query.page) || 1,
            Number(query.limit) || 10,
            query.q
        );
        return reply.send(result);
    });

    // POST /api/documents
    app.post('/', async (request, reply) => {
        const body = request.body as any;
        try {
            const document = await documentService.create((request.user as any).id, body);
            return reply.status(201).send(document);
        } catch (error: any) {
            if (error.message?.includes('Limit reached')) {
                return reply.status(403).send({ message: error.message, code: 'LIMIT_EXCEEDED' });
            }
            throw error;
        }
    });

    // GET /api/documents/:id
    app.get('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        try {
            const document = await documentService.getById(id, (request.user as any).id);
            return reply.send(document);
        } catch (error: any) {
            if (error.message === 'Document not found') {
                return reply.status(404).send({ message: error.message, code: 'NOT_FOUND' });
            }
            throw error;
        }
    });

    // PATCH /api/documents/:id
    app.patch('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as any;
        const document = await documentService.update(id, (request.user as any).id, body);
        return reply.send(document);
    });

    // DELETE /api/documents/:id
    app.delete('/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        await documentService.delete(id, (request.user as any).id);
        return reply.send({ message: 'Document deleted successfully' });
    });

    // PUT /api/documents/:id/autosave
    app.put('/:id/autosave', async (request, reply) => {
        const { id } = request.params as { id: string };
        const body = request.body as any;
        const document = await documentService.update(id, (request.user as any).id, { content: body.content });
        return reply.send({ message: 'Autosaved', version: document.version, updatedAt: document.updatedAt });
    });
}
