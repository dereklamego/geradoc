import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'pro@geradoc.com';
    
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { plan: 'PROFISSIONAL' }
        });
        console.log(`✅ Sucesso! O usuário ${user.email} agora está no plano ${user.plan}.`);
    } catch (e: any) {
        if (e.code === 'P2025') {
            console.log(`❌ Erro: O usuário ${email} ainda não foi criado. Crie-o no Front-end primeiro.`);
        } else {
            console.error(e);
        }
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
