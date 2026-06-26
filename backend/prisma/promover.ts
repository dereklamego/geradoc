import { PrismaClient, Plan, Role } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_PLANS: Plan[] = ['FREE', 'PROFISSIONAL', 'EMPRESARIAL'];
const VALID_ROLES: Role[] = ['USER', 'ADMIN', 'BETA'];

async function main() {
    const [emailArg, planArg, roleArg] = process.argv.slice(2);

    if (!emailArg || !planArg) {
        console.log('Uso: npx tsx prisma/promover.ts <email> <plano> [role]');
        console.log(`Planos válidos: ${VALID_PLANS.join(', ')}`);
        console.log(`Roles válidas: ${VALID_ROLES.join(', ')}`);
        process.exit(1);
    }

    const plan = planArg.toUpperCase() as Plan;
    if (!VALID_PLANS.includes(plan)) {
        console.error(`❌ Plano inválido: ${planArg}. Use: ${VALID_PLANS.join(', ')}`);
        process.exit(1);
    }

    const role = roleArg ? (roleArg.toUpperCase() as Role) : undefined;
    if (role && !VALID_ROLES.includes(role)) {
        console.error(`❌ Role inválida: ${roleArg}. Use: ${VALID_ROLES.join(', ')}`);
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email: emailArg },
            data: { plan, ...(role ? { role } : {}) },
        });
        console.log(`✅ Sucesso! ${user.email} → plano ${user.plan}, role ${user.role}.`);
    } catch (e: any) {
        if (e.code === 'P2025') {
            console.log(`❌ Erro: o usuário ${emailArg} não existe. Crie-o pelo cadastro do front-end primeiro.`);
        } else {
            console.error(e);
        }
    }
}

main().finally(async () => {
    await prisma.$disconnect();
});
