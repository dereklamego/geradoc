import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
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

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const usageCount = user?.monthlyUsage || 0;
    const usageLimit = 2;
    const remainingDocs = Math.max(0, usageLimit - usageCount);
    const usagePercentage = Math.min(100, (usageCount / usageLimit) * 100);

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
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Início</h2>
                    <p className="text-muted-foreground mt-1">Oi! Veja como estão as coisas por aqui hoje.</p>
                </div>
                {user?.plan === 'free' && (
                    <Card className="border-blue-100 bg-blue-50/30 overflow-hidden min-w-[280px]">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-semibold text-blue-900">Uso do Mês</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Gratuito</span>
                            </div>
                            <Progress value={usagePercentage} className="h-1.5 mb-2 bg-blue-100" />
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-blue-700 font-medium">{usageCount} de {usageLimit} documentos</span>
                                <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 font-bold hover:text-blue-700" onClick={() => navigate('/app/assinatura')}>
                                    Assinar Plano Pro
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {quickActions.map((action, i) => (
                    <Button key={i} onClick={() => navigate(action.url)} className="gap-2 shadow-sm">
                        <action.icon className="h-4 w-4" /> {action.title}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-blue-600 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Docs Gerados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">24</div>
                        <p className="text-xs mt-1 text-blue-100">+4 este mês</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faturamento</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">R$ 5.420,00</div>
                        <p className="text-xs mt-1 text-green-600 font-medium">+12.5% faturamento</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Garantias</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-xs mt-1 text-muted-foreground">Clientes protegidos</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="border-none shadow-sm h-full">
                    <CardHeader>
                        <CardTitle>Últimos Pedidos</CardTitle>
                        <CardDescription>Mostrando o que foi gerado recentemente.</CardDescription>
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
                                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => navigate('/app/documentos')}>Ver</Button>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/app/documentos')}>Ver todos</Button>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};

export default Dashboard;
