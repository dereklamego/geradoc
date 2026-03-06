import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useLocation, Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const location = useLocation();

    // Map routes to titles
    const getTitle = (pathname: string) => {
        switch (pathname) {
            case '/': return 'Painel';
            case '/gerador': return 'Gerar Documento';
            case '/clientes': return 'Gestão de Clientes';
            case '/servicos': return 'Catálogo de Serviços';
            case '/perfil': return 'Meu Perfil';
            case '/admin': return 'Administração';
            default: return 'GeraDoc';
        }
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-50/50">
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-[1px] bg-border" />
                            <h1 className="text-lg font-semibold text-foreground">
                                {getTitle(location.pathname)}
                            </h1>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto space-y-6">
                            <Outlet />
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
