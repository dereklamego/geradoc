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
            plan: 'PROFISSIONAL',
            role: 'USER',
        },
    });

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@geradoc.com' },
        update: {},
        create: {
            email: 'admin@geradoc.com',
            name: 'Administrador Teste',
            passwordHash,
            plan: 'EMPRESARIAL',
            role: 'ADMIN',
        },
    });

    console.log('Seed concluído com sucesso!');
    console.log({
        freeUser: { email: freeUser.email, plano: freeUser.plan, role: freeUser.role },
        proUser: { email: proUser.email, plano: proUser.plan, role: proUser.role },
        adminUser: { email: adminUser.email, plano: adminUser.plan, role: adminUser.role },
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
