import { DocumentRepository } from './documents.repository.ts';
import { PLAN_LIMITS } from '../../shared/plans/limits.ts';
import { incrementUsage } from '../../shared/billing/billing.service.ts';

function mapDocument(doc: any) {
    if (!doc) return doc;
    const content = doc.content || {};
    return {
        ...doc,
        ...content,
        id: doc.id,
        date: doc.createdAt,
    };
}

export class DocumentService {
    constructor(private documentRepository: DocumentRepository) { }

    async list(userId: string, page = 1, limit = 10, search?: string) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.documentRepository.findMany(userId, skip, limit, search),
            this.documentRepository.count(userId, search),
        ]);

        return { items: items.map(mapDocument), total, page, limit };
    }

    async getById(id: string, userId: string) {
        const document = await this.documentRepository.findFirst(id, userId);

        if (!document) {
            throw new Error('Document not found');
        }

        return mapDocument(document);
    }

    async create(userId: string, data: any) {
        const user = await this.documentRepository.getUserPlan(userId);

        // Enforce the monthly document limit for the user's plan. monthlyUsage
        // is reset per billing period (see billing.service syncBilling).
        const limit = user ? PLAN_LIMITS[user.plan].monthlyDocuments : Infinity;
        if (user && user.monthlyUsage >= limit) {
            const error = new Error(
                `Limite do plano atingido (máx. ${limit} documentos/mês). Faça upgrade para gerar mais.`
            );
            (error as any).statusCode = 403;
            throw error;
        }

        const title = `${data.type || 'Documento'} - ${data.clientName || 'Cliente'}`;
        const createObj = {
            title,
            content: data,
        };

        const result = await this.documentRepository.create(userId, createObj as any);

        // Count this document against the monthly quota.
        await incrementUsage(userId);

        return mapDocument(result);
    }

    async update(id: string, userId: string, data: any) {
        const document = await this.documentRepository.findFirst(id, userId);
        if (!document) {
            throw new Error('Document not found');
        }

        const updateData: any = {};
        
        updateData.title = `${data.type || (document.content as any)?.type || 'Documento'} - ${data.clientName || (document.content as any)?.clientName || 'Cliente'}`;
        updateData.content = { ...(document.content as any || {}), ...data };
        updateData.version = document.version + 1;
        
        if (data.status) updateData.status = data.status;

        const result = await this.documentRepository.update(id, userId, updateData);
        return mapDocument(result);
    }

    async delete(id: string, userId: string) {
        await this.getById(id, userId);

        return this.documentRepository.update(id, userId, { isDeleted: true });
    }
}
