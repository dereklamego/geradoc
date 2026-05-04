import { prisma } from '../../shared/db/prisma.ts';
import { CreateDocumentInput } from './documents.schema.ts';

export class DocumentRepository {
    async findMany(userId: string, skip: number, take: number, search?: string) {
        const where: any = {
            userId,
            isDeleted: false,
        };

        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        return prisma.document.findMany({
            where,
            skip,
            take,
            orderBy: { updatedAt: 'desc' },
            include: { folder: true, template: true },
        });
    }

    async count(userId: string, search?: string) {
        const where: any = {
            userId,
            isDeleted: false,
        };

        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        return prisma.document.count({ where });
    }

    async findFirst(id: string, userId: string) {
        return prisma.document.findFirst({
            where: { id, userId, isDeleted: false },
            include: { folder: true, template: true },
        });
    }

    async create(userId: string, data: CreateDocumentInput) {
        return prisma.document.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    async update(id: string, userId: string, data: any) {
        return prisma.document.update({
            where: { id, userId },
            data,
        });
    }

    async getUserPlan(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true },
        });
    }
}
