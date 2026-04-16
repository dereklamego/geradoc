import { z } from 'zod';

export const createDocumentSchema = z.object({
    title: z.string().min(1).max(255),
    content: z.any(), // Flexible JSON content
    folderId: z.string().uuid().optional(),
    templateId: z.string().uuid().optional(),
});

export const updateDocumentSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    content: z.any().optional(),
    status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'FINISHED']).optional(),
    folderId: z.string().uuid().nullable().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
