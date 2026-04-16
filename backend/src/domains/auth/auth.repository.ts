import { prisma } from '../../shared/db/prisma.ts';

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                subscription: true,
            },
        });
    }

    async create(data: { email: string; passwordHash: string; name: string }) {
        return prisma.user.create({
            data,
        });
    }

    async updateSubscription(userId: string, data: any) {
        return prisma.user.update({
            where: { id: userId },
            data,
        });
    }
}
