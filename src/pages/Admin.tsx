import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    FileText,
    TrendingUp,
    MoreHorizontal,
    UserCheck,
    Shield,
    Zap,
    DollarSign,
    UserPlus,
    AlertCircle,
    Clock,
    Ban,
    LineChart,
    BarChart3,
    CalendarDays,
    Activity
} from 'lucide-react';
import { toast } from 'sonner';

import { useNavigate } from 'react-router-dom';

interface SaaSUser {
    id: string;
    name: string;
    email: string;
    profession: string;
    plan: 'Free' | 'Pro' | 'Beta';
    status: 'Ativo' | 'Suspenso';
    join_date: string;
    last_access: string;
    docs_count: number;
}

interface FinancialRecord {
    id: string;
    user: string;
    plan: string;
    status: 'Pago' | 'Pendente' | 'Atrasado';
    amount: number;
    next_billing: string;
}

interface AdminProps {
    tab?: 'overview' | 'users' | 'finance' | 'logs';
}

const Admin = ({ tab = 'overview' }: AdminProps) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<SaaSUser[]>([
        { id: '1', name: 'João Silva', email: 'joao@servicos.com', profession: 'Técnico de AC', plan: 'Pro', status: 'Ativo', join_date: '2026-01-10', last_access: 'Há 2h', docs_count: 45 },
        { id: '2', name: 'Marcos Marceneiro', email: 'contato@marcos.com', profession: 'Marceneiro', plan: 'Free', status: 'Ativo', join_date: '2026-02-15', last_access: 'Há 1 dia', docs_count: 8 },
        { id: '3', name: 'Ana Elétrica', email: 'ana@eletrica.com', profession: 'Eletricista', plan: 'Beta', status: 'Ativo', join_date: '2026-03-01', last_access: 'Há 15min', docs_count: 120 },
        { id: '4', name: 'Pedro Reformas', email: 'pedro@reformas.com', profession: 'Pedreiro', plan: 'Pro', status: 'Suspenso', join_date: '2025-12-05', last_access: 'Há 2 semanas', docs_count: 0 },
    ]);

    const financialRecords: FinancialRecord[] = [
        { id: 'f1', user: 'João Silva', plan: 'Pro', status: 'Pago', amount: 49.90, next_billing: '2026-04-10' },
        { id: 'f2', user: 'Ana Elétrica', plan: 'Beta', status: 'Pago', amount: 0.00, next_billing: '2026-05-01' },
        { id: 'f3', user: 'Pedro Reformas', plan: 'Pro', status: 'Atrasado', amount: 49.90, next_billing: '2026-03-05' },
    ];

    const systemLogs = [
        { id: 'l1', level: 'info', message: 'João Silva gerou Orçamento #2034', time: 'Há 5min' },
        { id: 'l2', level: 'success', message: 'Novo cadastro: Carlos Pintor', time: 'Há 12min' },
        { id: 'l3', level: 'warning', message: 'Tentativa de login falha: user@unknown.com', time: 'Há 1h' },
        { id: 'l4', level: 'error', message: 'Erro ao processar webhook de pagamento - User #4', time: 'Há 3h' },
    ];

    const changePlan = (userId: string, newPlan: SaaSUser['plan']) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
        toast.success(`Plano alterado para ${newPlan}`);
    };

    const toggleStatus = (userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'Ativo' ? 'Suspenso' : 'Ativo' } : u));
        toast.info('Status do usuário atualizado.');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Painel de Controle SaaS</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium uppercase tracking-tight opacity-70">Monitoramento e Gestão da Plataforma GeraDoc</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <LineChart className="h-4 w-4" /> Exportar Dados
                    </Button>
                    <Button className="gap-2 bg-slate-900">
                        <CalendarDays className="h-4 w-4" /> Hoje
                    </Button>
                </div>
            </div>

            <Tabs
                value={tab}
                onValueChange={(val) => navigate(val === 'overview' ? '/admin' : `/admin/${val}`)}
                className="space-y-6"
            >
                <TabsList className="bg-white p-1 border shadow-sm">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Comercial</TabsTrigger>
                    <TabsTrigger value="users" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Usuários</TabsTrigger>
                    <TabsTrigger value="finance" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Financeiro</TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Logs e Monitoring</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">MRR (Receita Mensal)</CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">R$ 12.450,00</div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-bold">
                                    <TrendingUp className="h-3 w-3" /> +15% vs mês passado
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Usuários Ativos</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">342</div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-bold">
                                    <UserPlus className="h-3 w-3" /> 12 novos esta semana
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engajamento (PDFs hoje)</CardTitle>
                                <FileText className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">89</div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-bold">
                                    <BarChart3 className="h-3 w-3" /> Meta diária: 100
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Churn Rate</CardTitle>
                                <AlertCircle className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">1.2%</div>
                                <div className="flex items-center gap-1 mt-1 text-xs text-rose-600 font-bold">
                                    Estável
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm h-[400px] flex items-center justify-center bg-white text-muted-foreground italic">
                        Visualização de Gráfico Comercial (Área do Desenvolvedor)
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead className="pl-6">Usuário / Profissão</TableHead>
                                        <TableHead>Plano</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Cadastro / Acesso</TableHead>
                                        <TableHead className="text-center">Docs</TableHead>
                                        <TableHead className="text-right pr-6">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-slate-50/30 transition-colors">
                                            <TableCell className="pl-6">
                                                <div className="font-semibold text-slate-900">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.profession} • {user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Beta' ? 'secondary' : 'outline'} className="font-bold">
                                                    {user.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("bg-transparent border", user.status === 'Ativo' ? "text-emerald-600 border-emerald-200" : "text-rose-600 border-rose-200")}>
                                                    {user.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs font-medium">Entrou: {user.join_date}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {user.last_access}</div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold">{user.docs_count}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56">
                                                        <DropdownMenuLabel>Gestão de Conta</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => changePlan(user.id, 'Pro')} className="gap-2">
                                                            <Zap className="h-4 w-4 text-amber-500" /> Mudar para PRO
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => changePlan(user.id, 'Beta')} className="gap-2">
                                                            <Shield className="h-4 w-4 text-blue-500" /> Mudar para BETA
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => changePlan(user.id, 'Free')} className="gap-2">
                                                            <Users className="h-4 w-4 text-slate-500" /> Mudar para FREE
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <Sheet>
                                                            <SheetTrigger asChild>
                                                                <button className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2">
                                                                    <Activity className="h-4 w-4" /> Ver Logs de Uso
                                                                </button>
                                                            </SheetTrigger>
                                                            <SheetContent>
                                                                <SheetHeader>
                                                                    <SheetTitle>Histórico de {user.name}</SheetTitle>
                                                                    <SheetDescription>
                                                                        Atividade detalhada do prestador na plataforma.
                                                                    </SheetDescription>
                                                                </SheetHeader>
                                                                <div className="mt-8 space-y-4">
                                                                    <div className="p-4 rounded-lg bg-slate-50 border">
                                                                        <p className="font-bold text-sm">Resumo de Geração</p>
                                                                        <p className="text-sm mt-1">Este usuário gerou <span className="font-bold text-primary">{user.docs_count}</span> documentos desde o cadastro.</p>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <p className="text-xs font-bold text-slate-400 uppercase">Últimas Ações</p>
                                                                        {[1, 2, 3].map(i => (
                                                                            <div key={i} className="text-xs p-2 border-b">Gerou PDF de Orçamento - 10/03/26 14:{30 + i}</div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </SheetContent>
                                                        </Sheet>
                                                        <DropdownMenuItem onClick={() => toggleStatus(user.id)} className="text-rose-600 gap-2">
                                                            <Ban className="h-4 w-4" /> {user.status === 'Ativo' ? 'Suspender Conta' : 'Ativar Conta'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finance" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle>Controle de Assinaturas</CardTitle>
                            <CardDescription>Status comercial dos usuários Pro e Beta.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead className="pl-6">Assinante</TableHead>
                                        <TableHead>Plano</TableHead>
                                        <TableHead>Status Pagamento</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead className="text-right pr-6">Próxima Cobrança</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {financialRecords.map((rec) => (
                                        <TableRow key={rec.id}>
                                            <TableCell className="pl-6 font-medium">{rec.user}</TableCell>
                                            <TableCell>{rec.plan}</TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "bg-transparent border",
                                                    rec.status === 'Pago' ? "text-emerald-600 border-emerald-200" : "text-rose-600 border-rose-200"
                                                )}>
                                                    {rec.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold">R$ {rec.amount.toFixed(2)}</TableCell>
                                            <TableCell className="text-right pr-6 font-medium">{rec.next_billing}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>Monitoramento em tempo real do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {systemLogs.map((log) => (
                                    <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            log.level === 'info' && "bg-blue-500",
                                            log.level === 'success' && "bg-emerald-500",
                                            log.level === 'warning' && "bg-amber-500",
                                            log.level === 'error' && "bg-rose-500",
                                        )} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900">{log.message}</p>
                                            <p className="text-xs text-slate-500 font-mono">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-2 border-t flex justify-center">
                            <Button variant="link" size="sm" className="text-xs opacity-70">Ver todos os logs históricos</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Admin;
