import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import { useLocation, Outlet } from 'react-router-dom';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();

    const getAdminTitle = (pathname: string) => {
        return 'GeraDoc Admin';
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-100">
                <AdminSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-white sticky top-0 z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div className="h-4 w-[1px] bg-border" />
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                {getAdminTitle(location.pathname)}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">SaaS Owner</span>
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

export default AdminLayout;
