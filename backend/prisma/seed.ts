import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await argon2.hash('123456');

    const freeUser = await prisma.user.upsert({
        where: { email: 'free@geradoc.com' },
        update: {},
        create: {
            email: 'free@geradoc.com',
            name: 'Usuário Free Teste',
            passwordHash,
            plan: 'FREE',
            role: 'USER',
        },
    });

    const proUser = await prisma.user.upsert({
        where: { email: 'pro@geradoc.com' },
        update: {},
        create: {
            email: 'pro@geradoc.com',
            name: 'Usuário Pro Teste',
            passwordHash,
            plan: 'PREMIUM',
            role: 'USER',
        },
    });

    console.log('Seed concluído com sucesso!');
    console.log({
        freeUser: { email: freeUser.email, plano: freeUser.plan },
        proUser: { email: proUser.email, plano: proUser.plan },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
