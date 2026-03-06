import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Users,
    FileText,
    TrendingUp,
    AlertCircle,
    FilePlus,
    ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const quickActions = [
        { title: 'Novo Orçamento', icon: FilePlus, color: 'bg-blue-500', url: '/app/gerador' },
        { title: 'Cadastrar Cliente', icon: Plus, color: 'bg-green-500', url: '/app/clientes' },
    ];

    const recentActivity = [
        { id: 1, type: 'Orçamento', client: 'Carlos Oliveira', value: 'R$ 150,00', date: 'Há 2 horas' },
        { id: 2, type: 'OS', client: 'Logística Express', value: 'R$ 800,00', date: 'Há 5 horas' },
        { id: 3, type: 'Recibo', client: 'Maria Silva', value: 'R$ 50,00', date: 'Ontem' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name?.split(' ')[0]}! 👋</h2>
                    <p className="text-muted-foreground mt-1">Veja o resumo das suas atividades recentes.</p>
                </div>
                <div className="flex items-center gap-3">
                    {quickActions.map((action, i) => (
                        <Button key={i} onClick={() => navigate(action.url)} className="gap-2 shadow-sm">
                            <action.icon className="h-4 w-4" /> {action.title}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-blue-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Documentos do Mês</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">24</div>
                        <p className="text-xs mt-1 text-blue-100">+4 em relação ao mês anterior</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Valor Gerado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">R$ 5.420,00</div>
                        <p className="text-xs mt-1 text-green-600 font-medium">+12.5% faturamento</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Garantias Ativas</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-xs mt-1 text-muted-foreground">Clientes protegidos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                        <CardDescription>Últimos documentos gerados no sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-md">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{activity.type} - {activity.client}</p>
                                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-primary">{activity.value}</p>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">Ver mais</Button>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/app/documentos')}>Ver todos os documentos</Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-400" /> Insights do Negócio
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                Dica do Dia <TrendingUp className="h-4 w-4" />
                            </h4>
                            <p className="text-sm opacity-90 leading-relaxed">
                                Você teve um aumento de 15% na geração de Orçamentos esta semana. Que tal enviar um lembrete para os clientes que ainda não aprovaram?
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-blue-400" />
                                <span>Base de Clientes cresceu 5%</span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/20 blur-3xl rounded-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
