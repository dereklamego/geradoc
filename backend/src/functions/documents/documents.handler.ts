import { DocumentService } from '../../domains/documents/documents.service.ts';
import { DocumentRepository } from '../../domains/documents/documents.repository.ts';
import { createDocumentSchema, updateDocumentSchema } from '../../domains/documents/documents.schema.ts';
import { validate } from '../../shared/validate.ts';
import { response } from '../../shared/http/response.ts';
import { handleError } from '../../shared/http/errors.ts';
import { authenticate } from '../../shared/http/middlewares/auth.middleware.ts';

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);

export const list = async (event: any) => {
    try {
        const user = await authenticate(event);
        const query = event.queryStringParameters || {};

        const result = await documentService.list(
            user.id,
            Number(query.page) || 1,
            Number(query.limit) || 10,
            query.q
        );

        return response.success(result);
    } catch (error: any) {
        return handleError(error);
    }
};

export const create = async (event: any) => {
    try {
        const user = await authenticate(event);
        const body = JSON.parse(event.body || '{}');
        const data = validate(createDocumentSchema, body);

        const document = await documentService.create(user.id, data);
        return response.success(document, 201);
    } catch (error: any) {
        return handleError(error);
    }
};

export const get = async (event: any) => {
    try {
        const user = await authenticate(event);
        const id = event.pathParameters?.id;

        const document = await documentService.getById(id, user.id);
        return response.success(document);
    } catch (error: any) {
        return handleError(error);
    }
};

export const update = async (event: any) => {
    try {
        const user = await authenticate(event);
        const id = event.pathParameters?.id;
        const body = JSON.parse(event.body || '{}');
        const data = validate(updateDocumentSchema, body);

        const document = await documentService.update(id, user.id, data);
        return response.success(document);
    } catch (error: any) {
        return handleError(error);
    }
};

export const remove = async (event: any) => {
    try {
        const user = await authenticate(event);
        const id = event.pathParameters?.id;

        await documentService.delete(id, user.id);
        return response.success({ message: 'Document deleted successfully' });
    } catch (error: any) {
        return handleError(error);
    }
};

export const autosave = async (event: any) => {
    try {
        const user = await authenticate(event);
        const id = event.pathParameters?.id;
        const body = JSON.parse(event.body || '{}');

        if (!body.content) throw new Error('Content is required for autosave');

        const document = await documentService.update(id, user.id, { content: body.content });
        return response.success({
            message: 'Autosaved',
            version: document.version,
            updatedAt: document.updatedAt
        });
    } catch (error: any) {
        return handleError(error);
    }
};
