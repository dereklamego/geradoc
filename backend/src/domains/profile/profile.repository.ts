import { prisma } from '../../shared/db/prisma.ts';

export class ProfileRepository {
    async findByUserId(userId: string) {
        return prisma.companyProfile.findUnique({ where: { userId } });
    }

    async upsert(userId: string, data: {
        name?: string;
        document?: string;
        phone?: string;
        address?: string;
        brandColor?: string;
        logoStorage?: string;
    }) {
        return prisma.companyProfile.upsert({
            where: { userId },
            create: { userId, ...data },
            update: data,
        });
    }
}
