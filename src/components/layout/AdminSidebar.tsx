import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Activity,
    LogOut,
    ShieldCheck,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const adminNavItems = [
    { title: 'Início', url: '/admin', icon: LayoutDashboard },
    { title: 'Gestão de Usuários', url: '/admin/users', icon: Users },
    { title: 'Financeiro', url: '/admin/finance', icon: CreditCard },
    { title: 'Logs do Sistema', url: '/admin/logs', icon: Activity },
];

const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r-slate-200">
            <SidebarHeader className="border-b px-4 py-4 bg-slate-900 text-white">
                <div className="flex items-center gap-2 font-bold transition-all group-data-[collapsible=icon]:hidden">
                    <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                    <span className="text-xl tracking-tight">GeraDoc <span className="text-xs font-light opacity-70">Painel</span></span>
                </div>
                <div className="flex items-center justify-center font-bold group-data-[collapsible=icon]:flex hidden">
                    <ShieldCheck className="h-6 w-6" />
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-slate-900 text-slate-300">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 uppercase text-[10px] font-bold tracking-widest">Gerenciamento</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        onClick={() => navigate(item.url)}
                                        isActive={location.pathname === item.url.split('#')[0]}
                                        tooltip={item.title}
                                        className="hover:bg-slate-800 hover:text-white data-[active=true]:bg-primary data-[active=true]:text-white"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-slate-800 bg-slate-900 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout} tooltip="Sair" className="text-slate-400 hover:text-red-400">
                            <LogOut className="h-4 w-4" />
                            <span>Sair do Admin</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AdminSidebar;
