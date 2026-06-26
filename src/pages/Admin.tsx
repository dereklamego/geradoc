import { useState, useEffect, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users, FileText, TrendingUp, TrendingDown, MoreHorizontal, Shield,
    Zap, DollarSign, UserPlus, AlertCircle, Clock, Building2,
    BarChart3, CalendarDays, RefreshCw, Loader2, ArrowUpRight, ArrowDownRight, XCircle, UserCog,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

interface AdminProps {
    tab?: 'overview' | 'users' | 'finance' | 'events' | 'logs';
}

const planLabel: Record<string, string> = {
    FREE: 'Gratuito',
    PROFISSIONAL: 'Profissional',
    EMPRESARIAL: 'Empresarial',
};

const roleLabel: Record<string, string> = {
    USER: 'Usuário',
    ADMIN: 'Admin',
    BETA: 'Beta',
};

function fmt(n: number) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR');
}

const Admin = ({ tab = 'overview' }: AdminProps) => {
    const navigate = useNavigate();

    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [finance, setFinance] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [eventsTotal, setEventsTotal] = useState(0);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingFinance, setLoadingFinance] = useState(false);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const data = await api.admin.stats();
            setStats(data);
        } catch {
            toast.error('Erro ao carregar estatísticas.');
        } finally {
            setLoadingStats(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const { users: list } = await api.admin.users();
            setUsers(list);
        } catch {
            toast.error('Erro ao carregar usuários.');
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    const fetchFinance = useCallback(async () => {
        setLoadingFinance(true);
        try {
            const { subscriptions } = await api.admin.finance();
            setFinance(subscriptions);
        } catch {
            toast.error('Erro ao carregar dados financeiros.');
        } finally {
            setLoadingFinance(false);
        }
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoadingEvents(true);
        try {
            const { events: list, total } = await api.admin.events({ limit: 100 });
            setEvents(list);
            setEventsTotal(total);
        } catch {
            toast.error('Erro ao carregar eventos.');
        } finally {
            setLoadingEvents(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { if (tab === 'users') fetchUsers(); }, [tab, fetchUsers]);
    useEffect(() => { if (tab === 'finance') fetchFinance(); }, [tab, fetchFinance]);
    useEffect(() => { if (tab === 'events') fetchEvents(); }, [tab, fetchEvents]);

    const handleSetPlan = async (userId: string, plan: 'FREE' | 'PROFISSIONAL' | 'EMPRESARIAL') => {
        setActionLoading(`plan-${userId}`);
        try {
            await api.admin.setPlan(userId, plan);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan } : u));
            toast.success(`Plano alterado para ${planLabel[plan]}.`);
        } catch {
            toast.error('Erro ao alterar plano.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSetRole = async (userId: string, role: 'USER' | 'BETA') => {
        setActionLoading(`role-${userId}`);
        try {
            await api.admin.setRole(userId, role);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
            toast.success(`Papel alterado para ${roleLabel[role]}.`);
        } catch {
            toast.error('Erro ao alterar papel.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Painel de Controle SaaS</h2>
                    <p className="text-slate-500 mt-1 text-sm font-medium uppercase tracking-tight opacity-70">Monitoramento e Gestão da Plataforma GeraDoc</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={fetchStats} disabled={loadingStats}>
                        {loadingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Atualizar
                    </Button>
                    <Button className="gap-2 bg-slate-900">
                        <CalendarDays className="h-4 w-4" />
                        {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
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
                    <TabsTrigger value="events" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Eventos de Plano</TabsTrigger>
                    <TabsTrigger value="logs" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">Logs e Monitoring</TabsTrigger>
                </TabsList>

                {/* ── OVERVIEW ── */}
                <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* MRR */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">MRR (Receita Mensal)</CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                {loadingStats ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold">R$ {fmt(stats?.mrr ?? 0)}</div>
                                        <div className={cn("flex items-center gap-1 mt-1 text-xs font-bold", stats?.mrrGrowth >= 0 ? "text-emerald-600" : "text-rose-600")}>
                                            {stats?.mrrGrowth != null ? (
                                                <>
                                                    {stats.mrrGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                    {stats.mrrGrowth >= 0 ? '+' : ''}{stats.mrrGrowth}% vs mês passado
                                                </>
                                            ) : (
                                                <span className="text-slate-400">Primeiro mês</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Usuários */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Usuários Ativos</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                {loadingStats ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold">{stats?.activeUsers ?? 0}</div>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-bold">
                                            <UserPlus className="h-3 w-3" /> {stats?.newThisWeek ?? 0} novos esta semana
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documentos */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Documentos hoje</CardTitle>
                                <FileText className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                {loadingStats ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold">{stats?.docsToday ?? 0}</div>
                                        <div className={cn("flex items-center gap-1 mt-1 text-xs font-bold", (stats?.docsGrowth ?? 0) >= 0 ? "text-amber-600" : "text-rose-600")}>
                                            <BarChart3 className="h-3 w-3" />
                                            {stats?.docsThisMonth ?? 0} este mês
                                            {stats?.docsGrowth != null && (
                                                <span className="ml-1">({stats.docsGrowth >= 0 ? '+' : ''}{stats.docsGrowth}%)</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Churn */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Churn Rate</CardTitle>
                                <AlertCircle className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                {loadingStats ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                ) : (
                                    <>
                                        <div className="text-3xl font-bold">{stats?.churnRate ?? '0.0'}%</div>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-bold">
                                            Cancelamentos neste ciclo
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Distribuição de planos */}
                    {!loadingStats && stats?.planDistribution && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Users className="h-4 w-4 text-slate-400" /> Gratuito
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.planDistribution.FREE}</div>
                                    <p className="text-xs text-muted-foreground mt-1">usuários no plano free</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-primary" /> Profissional
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.planDistribution.PROFISSIONAL}</div>
                                    <p className="text-xs text-muted-foreground mt-1">assinantes • R$ {fmt(stats.planDistribution.PROFISSIONAL * 29.90)}/mês</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-purple-500" /> Empresarial
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.planDistribution.EMPRESARIAL}</div>
                                    <p className="text-xs text-muted-foreground mt-1">assinantes • R$ {fmt(stats.planDistribution.EMPRESARIAL * 79.90)}/mês</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {/* ── USERS ── */}
                <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Usuários da Plataforma</CardTitle>
                                <CardDescription>{users.length} usuários cadastrados</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loadingUsers} className="gap-2">
                                {loadingUsers ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                Atualizar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loadingUsers ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="pl-6">Usuário</TableHead>
                                            <TableHead>Plano</TableHead>
                                            <TableHead>Papel</TableHead>
                                            <TableHead className="text-center">Docs (total)</TableHead>
                                            <TableHead className="text-center">Uso mês</TableHead>
                                            <TableHead>Cadastro</TableHead>
                                            <TableHead className="text-right pr-6">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-slate-50/30 transition-colors">
                                                <TableCell className="pl-6">
                                                    <div className="font-semibold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        user.plan === 'EMPRESARIAL' ? 'default' :
                                                        user.plan === 'PROFISSIONAL' ? 'secondary' : 'outline'
                                                    } className="font-semibold">
                                                        {planLabel[user.plan] ?? user.plan}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "bg-transparent border font-medium",
                                                        user.role === 'ADMIN' ? "text-purple-700 border-purple-300" :
                                                        user.role === 'BETA' ? "text-blue-600 border-blue-300" :
                                                        "text-slate-600 border-slate-300"
                                                    )}>
                                                        {roleLabel[user.role] ?? user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-bold">{user._count?.documents ?? 0}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className={cn("font-medium text-sm", user.monthlyUsage > 0 ? "text-slate-900" : "text-slate-400")}>
                                                        {user.monthlyUsage}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs flex items-center gap-1 text-muted-foreground">
                                                        <Clock className="h-3 w-3" /> {fmtDate(user.createdAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" disabled={actionLoading?.startsWith(user.id)}>
                                                                {actionLoading === `plan-${user.id}` || actionLoading === `role-${user.id}`
                                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                                    : <MoreHorizontal className="h-4 w-4" />}
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56">
                                                            <DropdownMenuLabel>Alterar Plano</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleSetPlan(user.id, 'FREE')} disabled={user.plan === 'FREE'} className="gap-2">
                                                                <Users className="h-4 w-4 text-slate-500" /> Gratuito
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleSetPlan(user.id, 'PROFISSIONAL')} disabled={user.plan === 'PROFISSIONAL'} className="gap-2">
                                                                <Zap className="h-4 w-4 text-primary" /> Profissional
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleSetPlan(user.id, 'EMPRESARIAL')} disabled={user.plan === 'EMPRESARIAL'} className="gap-2">
                                                                <Building2 className="h-4 w-4 text-purple-500" /> Empresarial
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel>Alterar Papel</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleSetRole(user.id, 'USER')} disabled={user.role === 'USER'} className="gap-2">
                                                                <Users className="h-4 w-4 text-slate-500" /> Usuário comum
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleSetRole(user.id, 'BETA')} disabled={user.role === 'BETA'} className="gap-2">
                                                                <Shield className="h-4 w-4 text-blue-500" /> Beta tester
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {!loadingUsers && users.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                                    Nenhum usuário encontrado.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── FINANCE ── */}
                <TabsContent value="finance" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Assinaturas Ativas</CardTitle>
                                <CardDescription>Assinantes pagantes com dados do Stripe.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchFinance} disabled={loadingFinance} className="gap-2">
                                {loadingFinance ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                Atualizar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loadingFinance ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="pl-6">Assinante</TableHead>
                                            <TableHead>Plano</TableHead>
                                            <TableHead>Ciclo</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Próxima cobrança</TableHead>
                                            <TableHead className="pr-6">Cancelamento</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {finance.map((sub) => (
                                            <TableRow key={sub.id}>
                                                <TableCell className="pl-6">
                                                    <div className="font-semibold text-slate-900">{sub.user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{sub.user.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="font-semibold">
                                                        {planLabel[sub.user.plan] ?? sub.user.plan}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm capitalize text-muted-foreground">
                                                    {sub.billingCycle ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "bg-transparent border font-medium",
                                                        sub.status === 'active' ? "text-emerald-600 border-emerald-200" :
                                                        sub.status === 'past_due' ? "text-rose-600 border-rose-200" :
                                                        "text-slate-500 border-slate-200"
                                                    )}>
                                                        {sub.status === 'active' ? 'Ativa' :
                                                         sub.status === 'past_due' ? 'Inadimplente' :
                                                         sub.status === 'canceled' ? 'Cancelada' : sub.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">
                                                    {fmtDate(sub.currentPeriodEnd)}
                                                </TableCell>
                                                <TableCell className="pr-6 text-sm">
                                                    {sub.cancelAtPeriodEnd ? (
                                                        <span className="text-rose-600 font-medium">Em {fmtDate(sub.currentPeriodEnd)}</span>
                                                    ) : (
                                                        <span className="text-slate-400">—</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {!loadingFinance && finance.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                    Nenhuma assinatura ativa encontrada.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                        {finance.length > 0 && (
                            <CardFooter className="bg-slate-50/50 p-3 border-t">
                                <p className="text-xs text-muted-foreground">
                                    MRR estimado: <strong>R$ {fmt(finance.filter(s => s.status === 'active').length * 29.90)}</strong> — dados sincronizados via Stripe webhook.
                                </p>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
                {/* ── EVENTS ── */}
                <TabsContent value="events" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Eventos de Plano</CardTitle>
                                <CardDescription>{eventsTotal} evento{eventsTotal !== 1 ? 's' : ''} registrado{eventsTotal !== 1 ? 's' : ''} — upgrades, downgrades e cancelamentos.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchEvents} disabled={loadingEvents} className="gap-2">
                                {loadingEvents ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                                Atualizar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loadingEvents ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="pl-6">Usuário</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>De</TableHead>
                                            <TableHead>Para</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead className="pr-6">Obs.</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((ev) => (
                                            <TableRow key={ev.id} className="hover:bg-slate-50/30 transition-colors">
                                                <TableCell className="pl-6">
                                                    <div className="font-semibold text-slate-900">{ev.user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{ev.user.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {ev.eventType === 'upgrade' && (
                                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 gap-1">
                                                            <ArrowUpRight className="h-3 w-3" /> Upgrade
                                                        </Badge>
                                                    )}
                                                    {ev.eventType === 'downgrade' && (
                                                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 gap-1">
                                                            <ArrowDownRight className="h-3 w-3" /> Downgrade
                                                        </Badge>
                                                    )}
                                                    {ev.eventType === 'cancel' && (
                                                        <Badge className="bg-rose-50 text-rose-700 border border-rose-200 gap-1">
                                                            <XCircle className="h-3 w-3" /> Cancelamento
                                                        </Badge>
                                                    )}
                                                    {ev.eventType === 'admin_change' && (
                                                        <Badge className="bg-purple-50 text-purple-700 border border-purple-200 gap-1">
                                                            <UserCog className="h-3 w-3" /> Admin
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-muted-foreground">{planLabel[ev.fromPlan] ?? ev.fromPlan}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-medium text-slate-900">{planLabel[ev.toPlan] ?? ev.toPlan}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(ev.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="pr-6 text-xs text-muted-foreground">
                                                    {ev.eventType === 'downgrade' && ev.metadata?.scheduledAt && (
                                                        <span>Efetivo em {fmtDate(ev.metadata.scheduledAt)}</span>
                                                    )}
                                                    {ev.eventType === 'cancel' && ev.metadata?.cancelAt && (
                                                        <span>Acesso até {fmtDate(ev.metadata.cancelAt)}</span>
                                                    )}
                                                    {ev.eventType === 'admin_change' && (
                                                        <span className="text-purple-600">Alterado via painel admin</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {!loadingEvents && events.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                    Nenhum evento registrado ainda.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* ── LOGS ── */}
                <TabsContent value="logs" className="animate-in fade-in slide-in-from-bottom-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>Monitoramento em tempo real do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {[
                                    { id: 'l1', level: 'info', message: 'João Silva gerou Orçamento #2034', time: 'Há 5min' },
                                    { id: 'l2', level: 'success', message: 'Novo cadastro: Carlos Pintor', time: 'Há 12min' },
                                    { id: 'l3', level: 'warning', message: 'Tentativa de login falha: user@unknown.com', time: 'Há 1h' },
                                    { id: 'l4', level: 'error', message: 'Erro ao processar webhook de pagamento - User #4', time: 'Há 3h' },
                                ].map((log) => (
                                    <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full flex-shrink-0",
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
